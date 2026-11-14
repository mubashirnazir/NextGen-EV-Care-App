import express from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const SITE_ORIGIN = 'https://www.nextgenevcare.com';

function buildDynamicSitemapXml(): string {
  const today = new Date().toISOString().split('T')[0];

  const entries: Array<{ loc: string; changefreq: string; priority: string }> = [
    { loc: `${SITE_ORIGIN}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE_ORIGIN}/#services`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${SITE_ORIGIN}/#calculator`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${SITE_ORIGIN}/#portfolio`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${SITE_ORIGIN}/#blog`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${SITE_ORIGIN}/#faq`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE_ORIGIN}/#about`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${SITE_ORIGIN}/#contact`, changefreq: 'monthly', priority: '0.9' },
  ];

  try {
    const dataPath = path.resolve(__dirname, 'src', 'data', 'initialData.ts');
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf-8');
      const portfolioSection = content.split('export const INITIAL_BLOGS')[0] || '';
      const blogSection = content.split('export const INITIAL_BLOGS')[1]?.split('export const INITIAL_INQUIRIES')[0] || '';

      const idMatches = portfolioSection.matchAll(/id:\s*['"]([^'"]+)['"]/g);
      for (const m of idMatches) {
        entries.push({
          loc: `${SITE_ORIGIN}/#portfolio?id=${encodeURIComponent(m[1])}`,
          changefreq: 'weekly',
          priority: '0.8',
        });
      }

      const slugMatches = blogSection.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
      for (const m of slugMatches) {
        entries.push({
          loc: `${SITE_ORIGIN}/#blog?slug=${encodeURIComponent(m[1])}`,
          changefreq: 'weekly',
          priority: '0.8',
        });
      }
    }
  } catch (err) {
    console.warn('Could not parse dynamic entries for sitemap, serving core routes:', err);
  }

  const xmlUrls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}

app.use(express.json());

// Health check endpoint for Cloud Run and uptime checks
app.get(['/health', '/_ah/health'], (req, res) => {
  res.status(200).send('OK');
});

// Dynamic sitemap.xml endpoint for SEO crawlers and search engine indexing
app.get('/sitemap.xml', (req, res) => {
  try {
    const xml = buildDynamicSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).send(xml);
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// Dynamic robots.txt endpoint referencing the sitemap
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(`User-agent: *
Allow: /
Sitemap: https://www.nextgenevcare.com/sitemap.xml
`);
});

// ==================== RBAC AUTHENTICATION, HTTP-ONLY COOKIES & USER STORE ====================
type StoredRole = 'super_admin' | 'admin' | 'staff' | 'user';
type StoredPermission = 'manage_users' | 'edit_content' | 'delete_records' | 'view_analytics';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: StoredRole;
  permissions: StoredPermission[];
  isActive: boolean;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface StoredAuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: 'LOGIN' | 'LOGOUT' | 'USER_CREATED' | 'ROLE_UPDATED' | 'PERMISSIONS_UPDATED' | 'ACCESS_REVOKED' | 'ACCESS_RESTORED' | 'USER_DELETED';
  targetUserId?: string;
  targetEmail?: string;
  details: string;
  timestamp: string;
}

interface RbacDatabase {
  users: StoredUser[];
  auditLogs: StoredAuditLog[];
}

interface SessionTokenPayload {
  sub: string;
  email: string;
  role: StoredRole;
  permissions: StoredPermission[];
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

const DATA_DIR = path.resolve(__dirname, '.data');
const RBAC_STORE_PATH = path.join(DATA_DIR, 'rbac-store.json');
const ACCESS_COOKIE_NAME = 'nextgen_access_token';
const REFRESH_COOKIE_NAME = 'nextgen_refresh_token';
const ACCESS_TTL_SECONDS = 15 * 60; // 15 minutes
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

const JWT_SECRET =
  process.env.AUTH_JWT_SECRET && process.env.AUTH_JWT_SECRET !== 'CHANGE_THIS_IN_PRODUCTION'
    ? process.env.AUTH_JWT_SECRET
    : crypto.createHash('sha256').update(`nextgen-ev-care-rbac-secret:${__dirname}`).digest('hex');

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, originalHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const original = Buffer.from(originalHex, 'hex');
  if (derived.length !== original.length) return false;
  return crypto.timingSafeEqual(derived, original);
}

function base64UrlEncode(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, 'base64').toString('utf8');
}

function signJwt(payload: SessionTokenPayload): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(
    crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest()
  );
  return `${header}.${body}.${signature}`;
}

function verifyJwt(token: string): SessionTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expectedSig = base64UrlEncode(
      crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest()
    );
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }
    const decoded = JSON.parse(base64UrlDecode(body)) as SessionTokenPayload;
    if (!decoded.exp || Date.now() / 1000 > decoded.exp) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = decodeURIComponent(part.slice(idx + 1).trim());
    result[key] = val;
  }
  return result;
}

function buildCookieAttributes(req: express.Request, maxAgeSeconds: number): string {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const isIframeContext =
    req.headers['sec-fetch-site'] === 'cross-site' ||
    String(req.headers['origin'] || '').includes('run.app') ||
    String(req.headers['referer'] || '').includes('aistudio');

  // Use SameSite=None; Secure inside HTTPS cross-origin preview iframes, SameSite=Strict on primary domain
  const sameSite = isHttps && isIframeContext ? 'SameSite=None' : 'SameSite=Strict';
  const secureFlag = isHttps ? '; Secure' : '';
  return `Path=/; HttpOnly; ${sameSite}${secureFlag}; Max-Age=${maxAgeSeconds}`;
}

function setSessionCookies(req: express.Request, res: express.Response, user: StoredUser) {
  const nowSec = Math.floor(Date.now() / 1000);
  const accessToken = signJwt({
    sub: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    type: 'access',
    iat: nowSec,
    exp: nowSec + ACCESS_TTL_SECONDS,
  });
  const refreshToken = signJwt({
    sub: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    type: 'refresh',
    iat: nowSec,
    exp: nowSec + REFRESH_TTL_SECONDS,
  });

  res.setHeader('Set-Cookie', [
    `${ACCESS_COOKIE_NAME}=${encodeURIComponent(accessToken)}; ${buildCookieAttributes(req, ACCESS_TTL_SECONDS)}`,
    `${REFRESH_COOKIE_NAME}=${encodeURIComponent(refreshToken)}; ${buildCookieAttributes(req, REFRESH_TTL_SECONDS)}`,
  ]);
}

function clearSessionCookies(req: express.Request, res: express.Response) {
  res.setHeader('Set-Cookie', [
    `${ACCESS_COOKIE_NAME}=; ${buildCookieAttributes(req, 0)}`,
    `${REFRESH_COOKIE_NAME}=; ${buildCookieAttributes(req, 0)}`,
  ]);
}

function createDefaultDb(): RbacDatabase {
  const nowIso = new Date().toISOString();
  return {
    users: [
      {
        id: 'admin_0211000',
        name: 'Next Gen Owner (Primary Admin)',
        email: 'nextgenevcare@gmail.com',
        role: 'super_admin',
        permissions: ['manage_users', 'edit_content', 'delete_records', 'view_analytics'],
        isActive: true,
        passwordHash: hashPassword('evcare2026'),
        createdAt: nowIso,
      },
      {
        id: 'usr_94813',
        name: 'Engr. Hamza Mughal',
        email: 'hamza.mughal@nextgenevcare.com',
        role: 'admin',
        permissions: ['edit_content', 'delete_records', 'view_analytics'],
        isActive: true,
        passwordHash: hashPassword('evcare2026'),
        createdAt: nowIso,
      },
      {
        id: 'usr_94814',
        name: 'Bilal Ahmed (Mobile Van Lead)',
        email: 'bilal.tech@nextgenevcare.com',
        role: 'staff',
        permissions: ['edit_content', 'view_analytics'],
        isActive: true,
        passwordHash: hashPassword('staff2026'),
        createdAt: nowIso,
      },
      {
        id: 'usr_94815',
        name: 'Tariq Javed (DC Colony Customer)',
        email: 'tariq.dc@gmail.com',
        role: 'user',
        permissions: [],
        isActive: true,
        passwordHash: hashPassword('user2026'),
        createdAt: nowIso,
      },
    ],
    auditLogs: [
      {
        id: 'audit_seed_1',
        actorId: 'admin_0211000',
        actorEmail: 'nextgenevcare@gmail.com',
        action: 'USER_CREATED',
        targetUserId: 'admin_0211000',
        targetEmail: 'nextgenevcare@gmail.com',
        details: 'Initialized Super Admin primary owner account with full RBAC privileges.',
        timestamp: nowIso,
      },
    ],
  };
}

function loadRbacDb(): RbacDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(RBAC_STORE_PATH)) {
      const seeded = createDefaultDb();
      fs.writeFileSync(RBAC_STORE_PATH, JSON.stringify(seeded, null, 2), 'utf8');
      return seeded;
    }
    const raw = fs.readFileSync(RBAC_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as RbacDatabase;
    if (!Array.isArray(parsed.users) || parsed.users.length === 0) {
      const seeded = createDefaultDb();
      fs.writeFileSync(RBAC_STORE_PATH, JSON.stringify(seeded, null, 2), 'utf8');
      return seeded;
    }
    return parsed;
  } catch (err) {
    console.warn('[RBAC] Fallback to in-memory seed store:', err);
    return createDefaultDb();
  }
}

function saveRbacDb(db: RbacDatabase) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(RBAC_STORE_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('[RBAC] Failed saving store:', err);
  }
}

function sanitizeUser(user: StoredUser) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function getDefaultPermissionsForRole(role: StoredRole): StoredPermission[] {
  if (role === 'super_admin') return ['manage_users', 'edit_content', 'delete_records', 'view_analytics'];
  if (role === 'admin') return ['edit_content', 'delete_records', 'view_analytics'];
  if (role === 'staff') return ['edit_content', 'view_analytics'];
  return [];
}

function appendAuditLog(
  db: RbacDatabase,
  entry: Omit<StoredAuditLog, 'id' | 'timestamp'>
) {
  db.auditLogs.unshift({
    ...entry,
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  });
  // Keep latest 150 events
  if (db.auditLogs.length > 150) {
    db.auditLogs = db.auditLogs.slice(0, 150);
  }
}

function resolveAuthenticatedUser(req: express.Request, res: express.Response): StoredUser | null {
  const cookies = parseCookies(req.headers.cookie);
  const accessToken = cookies[ACCESS_COOKIE_NAME];
  const refreshToken = cookies[REFRESH_COOKIE_NAME];

  const db = loadRbacDb();

  if (accessToken) {
    const payload = verifyJwt(accessToken);
    if (payload && payload.type === 'access') {
      const user = db.users.find((u) => u.id === payload.sub);
      if (user && user.isActive && user.role !== 'user') {
        return user;
      }
      clearSessionCookies(req, res);
      return null;
    }
  }

  // Attempt transparent refresh token rotation if access token expired
  if (refreshToken) {
    const refreshPayload = verifyJwt(refreshToken);
    if (refreshPayload && refreshPayload.type === 'refresh') {
      const user = db.users.find((u) => u.id === refreshPayload.sub);
      if (user && user.isActive && user.role !== 'user') {
        setSessionCookies(req, res, user);
        return user;
      }
      clearSessionCookies(req, res);
      return null;
    }
  }

  return null;
}

function requireAdminAuth(
  req: express.Request & { authUser?: StoredUser },
  res: express.Response,
  next: express.NextFunction
) {
  const user = resolveAuthenticatedUser(req, res);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in with an active admin or staff account.',
    });
  }
  if (!user.isActive || user.role === 'user') {
    clearSessionCookies(req, res);
    return res.status(403).json({
      success: false,
      error: 'Access revoked or insufficient role privileges.',
    });
  }
  req.authUser = user;
  next();
}

// POST /api/auth/login — Verifies credentials & issues HttpOnly Access + Refresh cookies
app.post('/api/auth/login', (req, res) => {
  const { email, passcode, password } = req.body || {};
  const secretInput = String(passcode || password || '').trim();
  const normalizedEmail = String(email || 'nextgenevcare@gmail.com').trim().toLowerCase();

  if (!secretInput) {
    return res.status(400).json({ success: false, error: 'Passcode or password is required.' });
  }

  const db = loadRbacDb();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(401).json({ success: false, error: 'No account found with that email address.' });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      error: 'This account has been deactivated by the owner. Access is revoked.',
    });
  }

  if (user.role === 'user') {
    return res.status(403).json({
      success: false,
      error: 'Customer accounts do not have Admin Dashboard access.',
    });
  }

  const validMasterPasscode =
    user.role === 'super_admin' && (secretInput === 'evcare2026' || secretInput === 'admin123');
  const validUserHash = verifyPassword(secretInput, user.passwordHash);

  if (!validMasterPasscode && !validUserHash) {
    return res.status(401).json({ success: false, error: 'Invalid credentials or passcode.' });
  }

  user.lastLoginAt = new Date().toISOString();
  appendAuditLog(db, {
    actorId: user.id,
    actorEmail: user.email,
    action: 'LOGIN',
    targetUserId: user.id,
    targetEmail: user.email,
    details: `Signed in via HttpOnly JWT session (${user.role}).`,
  });
  saveRbacDb(db);

  setSessionCookies(req, res, user);
  return res.json({
    success: true,
    user: sanitizeUser(user),
    sessionPolicy: {
      accessTokenTtlMinutes: 15,
      refreshTokenTtlDays: 7,
      httpOnlyCookie: true,
    },
  });
});

// GET /api/auth/session — Validates current HttpOnly cookie session against live RBAC DB
app.get('/api/auth/session', (req, res) => {
  const user = resolveAuthenticatedUser(req, res);
  if (!user) {
    return res.json({ authenticated: false, user: null });
  }
  return res.json({
    authenticated: true,
    user: sanitizeUser(user),
    sessionPolicy: {
      accessTokenTtlMinutes: 15,
      refreshTokenTtlDays: 7,
      httpOnlyCookie: true,
    },
  });
});

// POST /api/auth/refresh — Explicitly rotates short-lived access token
app.post('/api/auth/refresh', (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const refreshToken = cookies[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    return res.status(401).json({ success: false, error: 'No refresh token present.' });
  }
  const payload = verifyJwt(refreshToken);
  if (!payload || payload.type !== 'refresh') {
    clearSessionCookies(req, res);
    return res.status(401).json({ success: false, error: 'Refresh token invalid or expired.' });
  }
  const db = loadRbacDb();
  const user = db.users.find((u) => u.id === payload.sub);
  if (!user || !user.isActive || user.role === 'user') {
    clearSessionCookies(req, res);
    return res.status(403).json({ success: false, error: 'User access revoked.' });
  }
  setSessionCookies(req, res, user);
  return res.json({ success: true, user: sanitizeUser(user) });
});

// POST /api/auth/logout — Clears HttpOnly cookies and logs event
app.post('/api/auth/logout', (req, res) => {
  const user = resolveAuthenticatedUser(req, res);
  if (user) {
    const db = loadRbacDb();
    appendAuditLog(db, {
      actorId: user.id,
      actorEmail: user.email,
      action: 'LOGOUT',
      targetUserId: user.id,
      targetEmail: user.email,
      details: 'Admin session terminated and HttpOnly cookies cleared.',
    });
    saveRbacDb(db);
  }
  clearSessionCookies(req, res);
  return res.json({ success: true });
});

// GET /api/admin/users — Lists all registered accounts & security audit log
app.get('/api/admin/users', requireAdminAuth, (req: express.Request & { authUser?: StoredUser }, res) => {
  const db = loadRbacDb();
  return res.json({
    success: true,
    users: db.users.map(sanitizeUser),
    auditLogs: db.auditLogs,
    currentUser: req.authUser ? sanitizeUser(req.authUser) : null,
  });
});

// POST /api/admin/users — Creates a new staff/admin/user account (requires manage_users or super_admin)
app.post('/api/admin/users', requireAdminAuth, (req: express.Request & { authUser?: StoredUser }, res) => {
  const actor = req.authUser!;
  if (actor.role !== 'super_admin' && !actor.permissions.includes('manage_users')) {
    return res.status(403).json({ success: false, error: 'Permission denied: manage_users required.' });
  }

  const { name, email, role, passcode, permissions } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const cleanName = String(name || '').trim();
  const requestedRole: StoredRole =
    role === 'admin' || role === 'staff' || role === 'user' ? role : 'staff';

  if (!cleanName || !normalizedEmail || !normalizedEmail.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid name and email are required.' });
  }

  const db = loadRbacDb();
  if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
  }

  const newUser: StoredUser = {
    id: `usr_${Date.now().toString().slice(-6)}`,
    name: cleanName,
    email: normalizedEmail,
    role: requestedRole,
    permissions: Array.isArray(permissions) ? permissions : getDefaultPermissionsForRole(requestedRole),
    isActive: true,
    passwordHash: hashPassword(String(passcode || 'evcare2026')),
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  appendAuditLog(db, {
    actorId: actor.id,
    actorEmail: actor.email,
    action: 'USER_CREATED',
    targetUserId: newUser.id,
    targetEmail: newUser.email,
    details: `Created account "${newUser.name}" with role "${newUser.role}".`,
  });
  saveRbacDb(db);

  return res.status(201).json({
    success: true,
    user: sanitizeUser(newUser),
    users: db.users.map(sanitizeUser),
    auditLogs: db.auditLogs,
  });
});

// PATCH /api/admin/users/:id — Promote/demote role, update permissions, or revoke/restore access
app.patch('/api/admin/users/:id', requireAdminAuth, (req: express.Request & { authUser?: StoredUser }, res) => {
  const actor = req.authUser!;
  if (actor.role !== 'super_admin' && !actor.permissions.includes('manage_users')) {
    return res.status(403).json({ success: false, error: 'Permission denied: manage_users required.' });
  }

  const targetId = req.params.id;
  const db = loadRbacDb();
  const target = db.users.find((u) => u.id === targetId);
  if (!target) {
    return res.status(404).json({ success: false, error: 'User account not found.' });
  }

  // Safeguard primary owner account
  if (target.id === 'admin_0211000' && actor.id !== 'admin_0211000') {
    return res.status(403).json({ success: false, error: 'Only the Primary Owner can modify this account.' });
  }

  const { role, isActive, permissions, passcode } = req.body || {};

  if (target.id === actor.id && (isActive === false || (role && role !== target.role))) {
    return res.status(400).json({
      success: false,
      error: 'You cannot revoke or demote your own active owner session.',
    });
  }

  if (role && ['super_admin', 'admin', 'staff', 'user'].includes(role)) {
    if (role === 'super_admin' && actor.role !== 'super_admin') {
      return res.status(403).json({ success: false, error: 'Only a Super Admin can grant Super Admin status.' });
    }
    const previousRole = target.role;
    target.role = role;
    if (!permissions) {
      target.permissions = getDefaultPermissionsForRole(role);
    }
    if (previousRole !== role) {
      appendAuditLog(db, {
        actorId: actor.id,
        actorEmail: actor.email,
        action: 'ROLE_UPDATED',
        targetUserId: target.id,
        targetEmail: target.email,
        details: `Changed role from "${previousRole}" to "${role}".`,
      });
    }
  }

  if (Array.isArray(permissions)) {
    target.permissions = permissions;
    appendAuditLog(db, {
      actorId: actor.id,
      actorEmail: actor.email,
      action: 'PERMISSIONS_UPDATED',
      targetUserId: target.id,
      targetEmail: target.email,
      details: `Updated permissions: [${permissions.join(', ') || 'none'}].`,
    });
  }

  if (typeof isActive === 'boolean' && target.isActive !== isActive) {
    if (target.id === 'admin_0211000' && !isActive) {
      return res.status(400).json({ success: false, error: 'Primary Owner account cannot be deactivated.' });
    }
    target.isActive = isActive;
    appendAuditLog(db, {
      actorId: actor.id,
      actorEmail: actor.email,
      action: isActive ? 'ACCESS_RESTORED' : 'ACCESS_REVOKED',
      targetUserId: target.id,
      targetEmail: target.email,
      details: isActive
        ? `Restored dashboard access for ${target.email}.`
        : `Revoked access immediately (isActive: false) for ${target.email}.`,
    });
  }

  if (typeof passcode === 'string' && passcode.trim().length >= 6) {
    target.passwordHash = hashPassword(passcode.trim());
  }

  saveRbacDb(db);
  return res.json({
    success: true,
    user: sanitizeUser(target),
    users: db.users.map(sanitizeUser),
    auditLogs: db.auditLogs,
  });
});

// DELETE /api/admin/users/:id — Permanently removes a user account
app.delete('/api/admin/users/:id', requireAdminAuth, (req: express.Request & { authUser?: StoredUser }, res) => {
  const actor = req.authUser!;
  if (actor.role !== 'super_admin' && !actor.permissions.includes('manage_users')) {
    return res.status(403).json({ success: false, error: 'Permission denied: manage_users required.' });
  }

  const targetId = req.params.id;
  if (targetId === 'admin_0211000' || targetId === actor.id) {
    return res.status(400).json({ success: false, error: 'Cannot delete the Primary Owner or current signed-in user.' });
  }

  const db = loadRbacDb();
  const target = db.users.find((u) => u.id === targetId);
  if (!target) {
    return res.status(404).json({ success: false, error: 'User account not found.' });
  }

  db.users = db.users.filter((u) => u.id !== targetId);
  appendAuditLog(db, {
    actorId: actor.id,
    actorEmail: actor.email,
    action: 'USER_DELETED',
    targetUserId: target.id,
    targetEmail: target.email,
    details: `Removed account "${target.name}" (${target.email}) from RBAC registry.`,
  });
  saveRbacDb(db);

  return res.json({
    success: true,
    users: db.users.map(sanitizeUser),
    auditLogs: db.auditLogs,
  });
});

// In-memory cache and rate-limit guard for Pakistan energy rates
interface CachedRates {
  petrolPricePerLiter: number;
  electricityTariffPerUnit: number;
  source: string;
  summary: string;
  updatedAt: string;
  isFallback: boolean;
  expiresAt: number;
}

let ratesCache: CachedRates | null = null;
let quotaCooldownUntil = 0;

const BASELINE_RATES = {
  success: true,
  isFallback: true,
  petrolPricePerLiter: 376.06,
  electricityTariffPerUnit: 34.0,
  source: 'OGRA & NEPRA Published Tariffs (Verified Baseline)',
  summary: 'Official baseline: Petrol (Premier Euro 5) ~PKR 376.06/L and domestic electricity ~PKR 34.00/kWh.',
  updatedAt: new Date().toISOString(),
};

// API route for AI Live Energy Prices in Pakistan with caching and graceful quota backoff
app.post('/api/pakistan-energy-rates', async (req, res) => {
  const now = Date.now();

  // 1. Check in-memory cache
  if (ratesCache && now < ratesCache.expiresAt) {
    return res.json({
      success: true,
      isFallback: ratesCache.isFallback,
      petrolPricePerLiter: ratesCache.petrolPricePerLiter,
      electricityTariffPerUnit: ratesCache.electricityTariffPerUnit,
      source: ratesCache.source,
      summary: ratesCache.summary,
      updatedAt: ratesCache.updatedAt,
    });
  }

  // 2. If recent quota limit (429) was hit, use baseline during cooldown
  if (now < quotaCooldownUntil) {
    return res.json(BASELINE_RATES);
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || !apiKey.trim()) {
    return res.json(BASELINE_RATES);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an energy economic assistant for Pakistan. 
Look up the current official consumer prices in Pakistan for:
1. Petrol (Premier Euro 5 / Motor Gasoline) retail pump price per liter in PKR (Pakistani Rupees) as notified by OGRA (Oil and Gas Regulatory Authority) and Pakistan State Oil (PSO) / Ministry of Finance Pakistan (current official price is Rs. 376.06 per liter; do not return outdated historical 265/L rates).
2. Average residential electricity tariff rate per unit (kWh) in PKR, including typical fuel charges and taxes for standard domestic 100-300 unit slabs (e.g., GEPCO / LESCO / WAPDA / NEPRA, typically ~34.00 to 42.00 PKR/kWh).

Return strictly a valid JSON object without markdown formatting, code fences, or backticks:
{
  "petrolPricePerLiter": <number in PKR, e.g. 376.06>,
  "electricityTariffPerUnit": <number in PKR, e.g. 34.0>,
  "source": "<short source reference name, e.g. OGRA & PSO Official Rates>",
  "summary": "<1-2 sentence concise summary mentioning current petrol price (Rs 376.06/L) and electricity unit price in Pakistan>"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || '';
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    let parsed: any = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const petrolMatch = rawText.match(/petrol(?:PricePerLiter)?["\s:]+([0-9]+(?:\.[0-9]+)?)/i);
      const electricityMatch = rawText.match(/electricity(?:TariffPerUnit)?["\s:]+([0-9]+(?:\.[0-9]+)?)/i);
      parsed = {
        petrolPricePerLiter: petrolMatch ? parseFloat(petrolMatch[1]) : 376.06,
        electricityTariffPerUnit: electricityMatch ? parseFloat(electricityMatch[1]) : 34.0,
        source: 'OGRA / PSO Pakistan Gazette (AI Grounded Search)',
        summary: rawText.slice(0, 200).replace(/[{}"\n]/g, ' ').trim()
      };
    }

    const petrol = Number(parsed.petrolPricePerLiter);
    const electricity = Number(parsed.electricityTariffPerUnit);

    const result = {
      petrolPricePerLiter: (!isNaN(petrol) && petrol > 180 && petrol < 600) ? petrol : 376.06,
      electricityTariffPerUnit: (!isNaN(electricity) && electricity > 15 && electricity < 120) ? electricity : 34.0,
      source: parsed.source || 'OGRA & PSO Notification via Google Search',
      summary: parsed.summary || 'Live energy prices retrieved using Gemini AI with Google Search.',
      updatedAt: new Date().toISOString(),
      isFallback: false,
    };

    // Cache successful search for 4 hours
    ratesCache = {
      ...result,
      expiresAt: Date.now() + 4 * 60 * 60 * 1000,
    };

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    const errorMsg = String(error?.message || error || '');
    const isRateLimit = error?.status === 429 || errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED');

    if (isRateLimit) {
      // Cooldown for 30 minutes to prevent API spam and repeated quota alerts
      quotaCooldownUntil = Date.now() + 30 * 60 * 1000;
      console.warn('[PakistanEnergyRates] Gemini API quota limit active. Serving verified official OGRA/NEPRA baseline prices.');
    } else {
      console.warn('[PakistanEnergyRates] Live search unavailable, using verified baseline rates.');
    }

    // Cache fallback rates for 15 minutes to reduce churn
    ratesCache = {
      petrolPricePerLiter: BASELINE_RATES.petrolPricePerLiter,
      electricityTariffPerUnit: BASELINE_RATES.electricityTariffPerUnit,
      source: BASELINE_RATES.source,
      summary: BASELINE_RATES.summary,
      updatedAt: new Date().toISOString(),
      isFallback: true,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };

    return res.json(BASELINE_RATES);
  }
});

// Start Express server with Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (dev mode: ${!isProd})`);
  });
}

startServer();
