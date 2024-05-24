const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const cors = require('cors');

const RECAPTCHA_SECRET_KEY = '6LcOU-YpAAAAAJSsgO8bm53kqe2fCO3Tf6JwajBv'; // Replace with your actual secret key

app.use(cors());
app.use(bodyParser.json());

app.post('/api/verify-recaptcha', async (req, res) => {
  const { recaptchaToken } = req.body;
  console.log('Received reCAPTCHA token:', recaptchaToken);

  if (!recaptchaToken) {
    console.log('No reCAPTCHA token provided');
    return res.status(400).json({ success: false, message: 'No reCAPTCHA token provided' });
  }

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken
      }
    });

    const data = response.data;
    console.log('reCAPTCHA verification response:', data);

    if (data.success) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: 'reCAPTCHA verification failed' });
    }
  } catch (error) {
    console.error('Error during reCAPTCHA verification:', error);
    return res.status(500).json({ success: false, message: 'Error during reCAPTCHA verification' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
