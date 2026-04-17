export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { question, system, key } = req.query;
  if (!question || !key) return res.status(400).json({ status: false, message: 'Missing params' });

  try {
    const params = new URLSearchParams({ question });
    if (system) params.set('system', system);

    const response = await fetch(
      `https://api.covenant.sbs/api/ai/deepseek?${params.toString()}`,
      { method: 'GET', headers: { 'x-api-key': key } }
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
      }
