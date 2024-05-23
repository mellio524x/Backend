const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const recaptchaSecretKey = '6LcOU-YpAAAAAJSsgO8bm53kqe2fCO3Tf6JwajBv';

app.post('/api/verify-recaptcha', async (req, res) => {
  const { recaptchaToken } = req.body;

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: recaptchaSecretKey,
        response: recaptchaToken,
      },
    });

    const data = response.data;

    if (data.success) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: data['error-codes'] });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Other middleware and routes...

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
