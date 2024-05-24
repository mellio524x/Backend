const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.cookie('session', '1', {
    sameSite: 'Lax', // or 'Strict' or 'None' if Secure is true
    secure: true,    // required if sameSite is 'None'
    httpOnly: true,
  });
  res.send('Cookie is set');
});

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.segment.com https://green-oz9r.onrender.com; object-src 'none'; style-src 'self';");
  next();
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('<html><head></head><body><h1>Hello, world!</h1></body></html>');
  });

// Route for verifying reCAPTCHA
app.post('/api/verify-recaptcha', async (req, res) => {
  const { recaptchaToken, userAction } = req.body;
  const apiKey = 'AIzaSyAAcCCwieFmvtH4rIr0yCzxf5GwJb4FWO0'; // Replace with your actual API key

  const requestBody = {
    event: {
      token: recaptchaToken,
      expectedAction: userAction,
      siteKey: '6LcOU-YpAAAAAFKW2xtEQjE4v7EIfNOGiPA8VBY1'
    }
  };

  const apiURL = `https://recaptchaenterprise.googleapis.com/v1/projects/backend-4f905/assessments?key=${apiKey}`;

  try {
    const fetch = await import('node-fetch'); // Use dynamic import
    const response = await fetch.default(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (result.tokenProperties && result.tokenProperties.valid) {
      res.json({ success: true });
    } else {
      res.json({ success: false, errors: result['error-codes'] });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to verify reCAPTCHA' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
