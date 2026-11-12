export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    service: 'Facebook UID Finder API',
    endpoints: {
      lookup: 'POST /api/lookup',
      batchLookup: 'POST /api/batch-lookup',
      health: 'GET /api/health'
    }
  });
}

