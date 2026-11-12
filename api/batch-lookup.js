import { resolveFacebookUid } from '../lib/fbResolver.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    const { urls } = body || {};
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
}

