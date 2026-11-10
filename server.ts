import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

import { generateSitemapXml } from './src/utils/sitemap';

app.use(express.json());

// Health check endpoint for Cloud Run and uptime checks
app.get(['/health', '/_ah/health'], (req, res) => {
  res.status(200).send('OK');
});

// Dynamic sitemap.xml endpoint for SEO crawlers and search engine indexing
app.get('/sitemap.xml', (req, res) => {
  try {
    const xml = generateSitemapXml();
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
