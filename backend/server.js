const express = require('express');
const cors = require('cors');
const config = require('./config');
const bfhlRoutes = require('./routes/bfhlRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/bfhl', bfhlRoutes);

// Root route for API status
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Chitkara Full Stack Challenge API is running. Use POST /bfhl to process graphs.'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(config.PORT, () => {
    console.log(`Backend server running on port ${config.PORT}`);
  });
}

module.exports = app;
