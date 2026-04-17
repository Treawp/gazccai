// api/proxy.js — Vercel Serverless Function
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.COVENANT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ status: false, message: 'COVENANT_API_KEY not set' });
  }

  const { question, system } = req.method === 'POST' ? req.body : req.query;

  if (!question) {
    return res.status(400).json({ status: false, message: 'Missing question' });
  }

  try {
    const params = new URLSearchParams({ question, model: 'deepseek' });
    if (system) params.set('system', system);

    const url = `https://api.covenant.sbs/api/ai/deepseek?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'x-api-key': apiKey },
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
}
