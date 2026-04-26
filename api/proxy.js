// proxy.js — forwards requests to Covenant AI (Gemini)
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.COVENANT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ status: false, message: 'COVENANT_API_KEY not set' });
  }

  const { messages } = req.body;
  try {
    const response = await axios.post(
      'https://api.covenant.sbs/api/ai/gemini',
      { messages },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const result = response.data.data.result;
    return res.json({ status: true, data: { result } });
  } catch (err) {
    const status = err.response?.status || 500;
    const msg = err.response?.data?.message || err.message;
    return res.status(status).json({ status: false, message: msg });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
