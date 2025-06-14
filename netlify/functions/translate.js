const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { text, target } = JSON.parse(event.body);
  const apiKey = 'YOUR_GOOGLE_CLOUD_API_KEY'; // Ganti dengan API key Anda

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: target || 'en'
        })
      }
    );
    const data = await response.json();
    if (data.data && data.data.translations && data.data.translations[0]) {
      return {
        statusCode: 200,
        body: JSON.stringify({ translatedText: data.data.translations[0].translatedText })
      };
    } else {
      return { statusCode: 500, body: JSON.stringify({ error: 'Translation failed', detail: data }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};