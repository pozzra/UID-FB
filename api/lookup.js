import { resolveFacebookUid } from '../lib/fbResolver.js';

export default async function handler(req, res) {
  // CORS Headers
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

    const { url } = body || {};
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(200).json({ success: false, error: 'សូមបញ្ចូល Link ឬ Username Facebook។' });
    }

    const result = await resolveFacebookUid(url);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(200).json({ success: false, error: `Server error: ${err.message}` });
  }
}

