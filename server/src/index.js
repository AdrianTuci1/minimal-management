import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importăm rutele
import clientRoutes from './routes/clientRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

// Încărcăm variabilele de mediu
dotenv.config();

// Inițializăm aplicația Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Securitate
app.use(compression()); // Compresie
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Limitare rate
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 100, // limită la 100 request-uri per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Parser pentru body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conectare la MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/display-sim', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

// Rute API
app.use('/api', clientRoutes);
app.use('/api', staffRoutes);
app.use('/api', serviceRoutes);
app.use('/api', appointmentRoutes);

// Rute pentru autentificare (vor fi adăugate ulterior)
// app.use('/api/auth', authRoutes);

// Rute pentru workspace-uri (vor fi adăugate ulterior)
// app.use('/api/workspaces', workspaceRoutes);

// Middleware pentru erori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Rute pentru 404
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Pornim serverul
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
