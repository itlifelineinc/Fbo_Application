const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(bodyParser.json({ limit: '50mb' })); // Support large payloads (images)
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('FBO Academy API is running...');
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});