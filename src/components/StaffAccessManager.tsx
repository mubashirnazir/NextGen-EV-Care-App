import React, { useState, useEffect, useCallback } from 'react';
import { UserAccount, AuditLogEntry, UserRole, AdminPermission } from '../types';
import {
  ShieldCheck,
  UserPlus,
  Users,
  KeyRound,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  RefreshCw,
  Crown,
  UserCog,
  Ban,
  ShieldAlert,
  X
} from 'lucide-react';

interface StaffAccessManagerProps {
  currentUser: UserAccount | null;
  onNotify: (msg: string) => void;
  onSessionInvalidated?: () => void;
}

const ALL_PERMISSIONS: { id: AdminPermission; label: string }[] = [
  { id: 'manage_users', label: 'Manage Users & Roles' },
  { id: 'edit_content', label: 'Edit Projects & Guides' },
  { id: 'delete_records', label: 'Delete Records' },
  { id: 'view_analytics', label: 'View Diagnostics & Leads' }
];

export const StaffAccessManager: React.FC<StaffAccessManagerProps> = ({
  currentUser,
  onNotify,
  onSessionInvalidated
}) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Add User Modal / Form state
  const [showAddUser, setShowAddUser] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'staff' | 'user'>('staff');
  const [newPasscode, setNewPasscode] = useState('evcare2026');
  const [creating, setCreating] = useState(false);

  const canManageUsers =
    currentUser?.role === 'super_admin' ||
    Boolean(currentUser?.permissions?.includes('manage_users'));

  const fetchUsersAndLogs = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        if (onSessionInvalidated) onSessionInvalidated();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setAuditLogs(data.auditLogs || []);
      } else {
        setErrorMsg(data.error || 'Failed to load staff registry.');
      }
    } catch {
      setErrorMsg('Network error loading staff accounts.');
    } finally {
      setLoading(false);
    }
  }, [onSessionInvalidated]);

  useEffect(() => {
    fetchUsersAndLogs();
  }, [fetchUsersAndLogs]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageUsers) {
      onNotify('Permission denied: manage_users privilege required.');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          role: newRole,
          passcode: newPasscode
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        onNotify(data.error || 'Failed to create account.');
        return;
      }
      setUsers(data.users);
      setAuditLogs(data.auditLogs);
      setNewName('');
      setNewEmail('');
      setNewRole('staff');
      setShowAddUser(false);
      onNotify(`Account "${data.user.name}" added with ${data.user.role} role.`);
    } catch {
      onNotify('Network error creating user.');
    } finally {
      setCreating(false);
    }
  };

  const handlePatchUser = async (
    targetUser: UserAccount,
    patch: { role?: UserRole; isActive?: boolean; permissions?: AdminPermission[] },
    successMsg: string
  ) => {
    if (!canManageUsers) {
      onNotify('Permission denied: manage_users privilege required.');
      return;
    }
    setBusyUserId(targetUser.id);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(targetUser.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(patch)
      });
      if (res.status === 401 || res.status === 403) {
        const errData = await res.json().catch(() => ({}));
        onNotify(errData.error || 'Action denied.');
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.success) {
        onNotify(data.error || 'Failed to update account.');
        return;
      }
      setUsers(data.users);
      setAuditLogs(data.auditLogs);
      onNotify(successMsg);
    } catch {
      onNotify('Network error updating user access.');
    } finally {
      setBusyUserId(null);
    }
  };

  const handleTogglePermission = (targetUser: UserAccount, perm: AdminPermission) => {
    const hasPerm = targetUser.permissions.includes(perm);
    const updated = hasPerm
      ? targetUser.permissions.filter((p) => p !== perm)
      : [...targetUser.permissions, perm];
    handlePatchUser(
      targetUser,
      { permissions: updated },
      `Updated permissions for ${targetUser.name}.`
    );
  };

  const handleDeleteUser = async (targetUser: UserAccount) => {
    if (!canManageUsers) return;
    if (!window.confirm(`Permanently remove "${targetUser.name}" (${targetUser.email}) from the RBAC registry?`)) {
      return;
    }
    setBusyUserId(targetUser.id);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(targetUser.id)}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        onNotify(data.error || 'Failed to delete user.');
        return;
      }
      setUsers(data.users);
      setAuditLogs(data.auditLogs);
      onNotify(`Removed account "${targetUser.name}".`);
    } catch {
      onNotify('Network error deleting user.');
    } finally {
      setBusyUserId(null);
    }
  };

  const getRoleBadgeClasses = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'admin':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'staff':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700';
    }
  };

  const getActionBadgeClasses = (action: AuditLogEntry['action']) => {
    if (action === 'ACCESS_REVOKED' || action === 'USER_DELETED') {
      return 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30';
    }
    if (action === 'ROLE_UPDATED' || action === 'PERMISSIONS_UPDATED') {
      return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    }
    return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Top Security Posture & Session Banner */}
      <div className="p-5 sm:p-6 rounded-2xl backdrop-blur-xl saturate-180 bg-white/75 dark:bg-slate-900/75 border border-white/80 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Admin & Staff RBAC Access Control
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                HttpOnly JWT Active
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Grant or revoke administrative privileges in real time. Session tokens are stored strictly in encrypted <code className="font-mono text-emerald-600 dark:text-emerald-400">HttpOnly</code> cookies (15m access + 7d refresh rotation). Revoking access blocks the user immediately on their next request.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={fetchUsersAndLogs}
              className="h-11 px-4 rounded-xl liquid-glass text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-500 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
              <span>Sync Registry</span>
            </button>

            {canManageUsers && (
              <button
                type="button"
                onClick={() => setShowAddUser((prev) => !prev)}
                className="h-11 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Staff / Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Session Identity Strip */}
        {currentUser && (
          <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-slate-500 dark:text-slate-400">Authenticated Identity:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{currentUser.email}</span>
              <span className="text-slate-400">({currentUser.id})</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${getRoleBadgeClasses(currentUser.role)}`}>
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Permissions: {currentUser.permissions.join(' · ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Add User Inline Card */}
      {showAddUser && canManageUsers && (
        <form
          onSubmit={handleCreateUser}
          className="p-5 sm:p-6 rounded-2xl backdrop-blur-xl saturate-180 bg-white/80 dark:bg-slate-900/80 border border-emerald-500/30 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-white/10">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-500" />
              <span>Provision New Account & Assign RBAC Role</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddUser(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Usman Ali (Technician)"
                className="w-full h-11 px-4 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="staff@nextgenevcare.com"
                className="w-full h-11 px-4 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Initial RBAC Role *
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'admin' | 'staff' | 'user')}
                className="w-full h-11 px-4 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="admin">Admin (Full Content & Leads)</option>
                <option value="staff">Staff (Edit Content & Leads)</option>
                <option value="user">User (Standard / No Admin)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Access Passcode *
              </label>
              <input
                type="text"
                required
                minLength={6}
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full h-11 px-4 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddUser(false)}
              className="h-11 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="h-11 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 text-slate-950 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{creating ? 'Provisioning...' : 'Create Account'}</span>
            </button>
          </div>
        </form>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Registered Accounts Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Registered Accounts ({users.length})</span>
          </h3>
          {!canManageUsers && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Read-only view (requires manage_users permission)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => {
            const isPrimaryOwner = user.id === 'admin_0211000';
            const isSelf = currentUser?.id === user.id;
            const isBusy = busyUserId === user.id;

            return (
              <div
                key={user.id}
                className={`p-5 rounded-2xl backdrop-blur-xl saturate-180 bg-white/75 dark:bg-slate-900/75 border transition-all shadow-xl ${
                  !user.isActive
                    ? 'border-red-500/30 opacity-85'
                    : 'border-white/80 dark:border-white/10'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Account Identity & Status */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {isPrimaryOwner ? (
                        <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <UserCog className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${getRoleBadgeClasses(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          user.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
                        }`}
                      >
                        {user.isActive ? 'Active Access' : 'Access Revoked'}
                      </span>
                      {isSelf && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          You
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono">{user.email}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">ID: {user.id}</span>
                      {user.lastLoginAt && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3 text-emerald-500" />
                            Last login: {new Date(user.lastLoginAt).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Role Promotion / Demotion & Revocation Controls */}
                  {canManageUsers && !isPrimaryOwner && !isSelf && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <select
                        disabled={isBusy}
                        value={user.role}
                        onChange={(e) => {
                          const nextRole = e.target.value as UserRole;
                          handlePatchUser(
                            user,
                            { role: nextRole },
                            `Role for ${user.name} updated to ${nextRole}.`
                          );
                        }}
                        aria-label={`Change role for ${user.name}`}
                        className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="admin">Role: Admin</option>
                        <option value="staff">Role: Staff</option>
                        <option value="user">Role: Customer (No Admin)</option>
                      </select>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          handlePatchUser(
                            user,
                            { isActive: !user.isActive },
                            user.isActive
                              ? `Revoked access for ${user.name}. Next API request blocked immediately.`
                              : `Restored access for ${user.name}.`
                          )
                        }
                        className={`h-11 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          user.isActive
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                            : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <Ban className="w-3.5 h-3.5" />
                            <span>Revoke Access</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Restore Access</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDeleteUser(user)}
                        aria-label={`Delete ${user.name}`}
                        title="Permanently delete account"
                        className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500/15 text-slate-500 hover:text-red-500 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {isPrimaryOwner && (
                    <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Root Owner Protected</span>
                    </div>
                  )}
                </div>

                {/* Granular Permission Flags */}
                <div className="mt-4 pt-3.5 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
                    Permissions:
                  </span>
                  {ALL_PERMISSIONS.map((perm) => {
                    const enabled = user.permissions.includes(perm.id);
                    const disabled = !canManageUsers || isPrimaryOwner || isBusy || user.role === 'user';
                    return (
                      <button
                        key={perm.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleTogglePermission(user, perm.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all flex items-center gap-1.5 ${
                          enabled
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-100/70 dark:bg-slate-800/50 text-slate-500 border-slate-200 dark:border-slate-700/80'
                        } ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:border-emerald-500 cursor-pointer'}`}
                      >
                        <CheckCircle2 className={`w-3 h-3 ${enabled ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <span>{perm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Audit Trail */}
      <div className="p-5 sm:p-6 rounded-2xl backdrop-blur-xl saturate-180 bg-white/75 dark:bg-slate-900/75 border border-white/80 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Security & Role Audit Log
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Latest {auditLogs.length} events
          </span>
        </div>

        <div className="divide-y divide-slate-200/60 dark:divide-white/10 max-h-80 overflow-y-auto pr-1">
          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No security events logged yet.</p>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getActionBadgeClasses(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.details}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                    <span>Actor: <code className="font-mono">{log.actorEmail}</code></span>
                    {log.targetEmail && (
                      <>
                        <span>→</span>
                        <span>Target: <code className="font-mono">{log.targetEmail}</code></span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
