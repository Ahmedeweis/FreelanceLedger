// server.js
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// استيراد الـ routes الجديدة
// import authRoutes from './routes/auth.js'; // Removed
import ledgerRoutes from './routes/ledger.js';
import projectRoutes from './routes/projects.js';
import incomeRoutes from './routes/income.js';
import initDb from './dbInit.js';

dotenv.config();
const app = express();

// Middlewares
// ✅ مفتوح للكل مؤقتاً (Swagger + Vue + Postman) - يتقيّد بعد رفع الفرونت
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Mount routes
// app.use('/api/admin', authRoutes); // Removed
app.use('/api/ledger', ledgerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/income', incomeRoutes);
// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Freelance Ledger API',
      version: '1.0.0',
      description: 'API documentation for the Freelance Income Tracker System',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local Development' },
    ],
  },
  apis: [join(dirname(fileURLToPath(import.meta.url)), 'routes', '*.js')], // مسار مطلق يشتغل على Render
};
const startServer = async () => {
  try {
    // 1. Check DB Connection
    const res = await pool.query('SELECT NOW()');
    console.log('✅ DB Connected at:', res.rows[0].now);

    // 2. Automate Schema Setup (Senior Developer Approach)
    await initDb();

    // 3. Setup Swagger
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // 4. Start Listening
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};
startServer();
