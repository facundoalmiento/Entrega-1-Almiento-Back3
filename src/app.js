import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';


import { connectDB } from './db.js';
import mocksRouter from './routes/mocks.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// Routers
app.use('/api/mocks', mocksRouter); // <- requerido
app.use('/api/users', usersRouter); // verificación
app.use('/api/pets', petsRouter); // verificación

app.get('/', (req, res) => {
  res.send('Servidor ok. Probá /api/mocks/mockingusers o /api/mocks/mockingpets');
});


// Manejo de errores básico
app.use((err, req, res, next) => {
console.error(err);
res.status(500).json({ status: 'error', message: err.message });
});


const PORT = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI)
.then(() => app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`)))
.catch((e) => {
console.error('No se pudo conectar a Mongo:', e.message);
process.exit(1);
});