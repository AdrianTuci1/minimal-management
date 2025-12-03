import express from 'express';
import appointmentController from '../controllers/AppointmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Aplicăm middleware de autentificare la toate rutele
router.use(authenticateToken);

// Rute standard CRUD
router.get('/workspaces/:workspaceId/appointments', appointmentController.getAll);
router.get('/workspaces/:workspaceId/appointments/:id', appointmentController.getById);
router.post('/workspaces/:workspaceId/appointments', appointmentController.create);
router.put('/workspaces/:workspaceId/appointments/:id', appointmentController.update);
router.delete('/workspaces/:workspaceId/appointments/:id', appointmentController.delete);

// Rute specifice
router.get('/workspaces/:workspaceId/appointments/date', appointmentController.getByDate);
router.get('/workspaces/:workspaceId/appointments/period', appointmentController.getByPeriod);
router.put('/workspaces/:workspaceId/appointments/:id/confirm', appointmentController.confirm);
router.put('/workspaces/:workspaceId/appointments/:id/cancel', appointmentController.cancel);

export default router;
