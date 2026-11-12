import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveFacebookUid } from './lib/fbResolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]', reason);
});

app.use(cors());
app.use(express.json());

// Serve static frontend files from public folder
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// API endpoint: Single lookup
const handleLookup = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(200).json({ success: false, error: 'សូមបញ្ចូល Link ឬ Username Facebook។' });
    }

    const result = await resolveFacebookUid(url);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(200).json({ success: false, error: `Lỗi xử lý máy chủ: ${err.message}` });
  }
};

app.post(['/api/lookup', '/lookup', '/server.js'], handleLookup);

// API endpoint: Batch lookup
const handleBatchLookup = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { urls } = req.body || {};
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(200).json({ success: false, error: 'បញ្ជីតំណភ្ជាប់ទទេ' });
    }

    const limitedUrls = urls.slice(0, 25);
    const results = [];

    for (const item of limitedUrls) {
      if (typeof item === 'string' && item.trim()) {
        const result = await resolveFacebookUid(item);
        results.push({
          input: item,
          ...result
        });
      }
    }

    return res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) {
    return res.status(200).json({ success: false, error: err.message });
  }
};

app.post(['/api/batch-lookup', '/batch-lookup'], handleBatchLookup);

// Health check endpoint
const handleHealth = (req, res) => {
  res.json({ status: 'ok', service: 'Facebook UID Finder API', timestamp: new Date().toISOString() });
};

app.get(['/api/health', '/health'], handleHealth);

// Universal fallback middleware for POST requests
app.use((req, res, next) => {
  if (req.method === 'POST') {
    if (req.body && req.body.urls) return handleBatchLookup(req, res);
    if (req.body && req.body.url) return handleLookup(req, res);
  }
  next();
});

// Serve index.html for all non-API GET requests (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start listener when run locally (skipped in Vercel serverless environment)
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FB UID Finder] Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel
export default app;
export { resolveFacebookUid, handleLookup, handleBatchLookup, handleHealth };
