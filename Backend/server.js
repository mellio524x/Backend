const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://green-oz9r.onrender.com https://cdn.segment.com");
  next();
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
