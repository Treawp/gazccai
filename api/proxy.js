// proxy.js — forwards requests to OpenRouter (OpenAI-compatible)
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ status: false, message: 'OPENROUTER_API_KEY not set' });
  }

  const { messages, model } = req.body;
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model || 'google/gemma-4-26b-a4b-it',
        messages,
        max_tokens: 4000,
        temperature: 0.1,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/gazcc',
          'X-Title': 'GazccThinking',
        },
      }
    );
    const result = response.data.choices[0].message.content;
    return res.json({ status: true, result });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
