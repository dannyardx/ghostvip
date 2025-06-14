const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { text } = JSON.parse(event.body);
  const apiKey = '9af90e3c-0d8c-4b64-a474-d31e0ffbd546:fx';

  try {
    const res = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'DeepL-Auth-Key ' + apiKey
      },
      body: 'text=' + encodeURIComponent(text) + '&target_lang=EN'
    });
    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};