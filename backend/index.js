require('dotenv').config();

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const pc = require('picocolors');

const indexRoutes = require('./routes');

const app = express();
const port = process.env.PORT || 8080;
const windowRate = 300000;
const maxRate = 100;

// Limit API to respond to
const limiter = rateLimit({
  windowMs: windowRate,
  max: maxRate,
});
app.use(limiter);
app.set('trust proxy', 1);

// Log incoming requests in DEV mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('tiny'));
}

// Good ol' Cors
app.use(cors());

// Main Router
app.use('/', indexRoutes);

// Error Handler
app.use(errorHandler);

// 404 Catch

app.use('*', (_req, res) =>
  res.status(404).json({ message: 'Endpoint not found' })
);

app.listen(port, () => {
  console.log(pc.blue(`> Server listening on port: ${port}...`));
});
