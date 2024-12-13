const QRCode = require('qrcode');

const generateQRCode = async (req, res) => {
  const { assessmentId, userId } = req.query;

  if (!assessmentId || !userId) {
    return res.status(400).send('Missing assessmentId or userId');
  }

  const qrData = JSON.stringify({ assessmentId, userId });

  try {
    const qrCode = await QRCode.toDataURL(qrData);
    res.send(`
      <html>
        <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
          <h2>Scan this QR Code in the Mobile App</h2>
          <img src="${qrCode}" alt="QR Code" />
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Error generating QR code:', err);
    res.status(500).send('Error generating QR code');
  }
}
module.exports = { generateQRCode };
