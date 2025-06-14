const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Link asli file QuantV (ganti sesuai kebutuhan)
  const fileUrl = 'https://cdn.discordapp.com/attachments/1383563453981130796/1383565854599549038/QuantV_FiveM_Updated_2025-6-8.rar?ex=684f419d&is=684df01d&hm=e6a1af1c3be0fe983746a972e8edef9fe8b99315d9e7380dc954269948c068e2&';

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return {
        statusCode: 502,
        body: 'Failed to fetch file.'
      };
    }
    // Forward headers for download
    const headers = {
      'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="QuantV_FiveM_Updated_2025-6-8.rar"',
      'Cache-Control': 'no-store',
    };
    const buffer = await response.buffer();
    return {
      statusCode: 200,
      headers,
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error: ' + err.message
    };
  }
};
