// src/app.js
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { connectDB } from './db.js';
import mocksRouter from './routes/mocks.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';

// --- crear app ANTES de usarla ---
const app = express();

// middlewares base
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// swagger (después de crear app)
import swaggerUi from 'swagger-ui-express';
import { swaggerSpecs } from './docs/swagger.js';
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

import adoptionRouter from './routes/adoption.router.js';
app.use('/api/adoptions', adoptionRouter);


// rutas
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

// raíz opcional para evitar "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Servidor OK. Visitá /docs para Swagger o /api/... para endpoints');
});

// manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: err.message });
});

// export para tests con supertest
export default app;

// levantar server solo si no estamos corriendo tests
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  connectDB(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`)))
    .catch((e) => {
      console.error('No se pudo conectar a Mongo:', e.message);
      process.exit(1);
    });
}
