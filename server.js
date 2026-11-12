import app from './api/index.js';

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FB UID Finder] Server running at http://localhost:${PORT}`);
  });
}

export default app;
