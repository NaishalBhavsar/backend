const express = require('express');
const cors = require('cors');
const winston = require('winston');  // Basic logging
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

// Logging
const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });
app.use((req, res, next) => { logger.info(`${req.method} ${req.url}`); next(); });

// Swagger Docs
const swaggerOptions = { definition: { openapi: '3.0.0', info: { title: 'Scalable API', version: '1.0.0' } }, apis: ['./routes/*.js'] };
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/tasks', require('./routes/tasks'));

// Error Handling
app.use((err, req, res, next) => { res.status(500).json({ error: 'Internal server error.' }); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
