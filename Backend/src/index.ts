// debe ir primero: carga y valida el .env antes que cualquier otro módulo
import { env } from './config/env.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import projectRoutes from './routes/project.routes.js';
import experienceRoutes from './routes/experience.routes.js';
import educationRoutes from './routes/education.routes.js';
import skillRoutes from './routes/skill.routes.js';

const app = express();

// no anunciar el framework en las cabeceras de respuesta
app.disable('x-powered-by');

app.use(
  cors({
    // solo los frontends listados en CORS_ORIGINS; las peticiones sin Origin (curl, Postman) pasan
    origin: env.CORS_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // el JWT viaja en el header Authorization, no en cookies
    credentials: false,
    maxAge: 600,
  }),
);
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => {
  res.json({ message: '¡Servidor Express con TypeScript funcionando al 100%!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/skills', skillRoutes);

app.listen(env.PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${env.PORT}`);
});
