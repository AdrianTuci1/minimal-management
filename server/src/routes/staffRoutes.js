import express from 'express';
import staffController from '../controllers/StaffController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Aplicăm middleware de autentificare la toate rutele
router.use(authenticateToken);

// Rute standard CRUD
router.get('/workspaces/:workspaceId/staff', staffController.getAll);
router.get('/workspaces/:workspaceId/staff/:id', staffController.getById);
router.post('/workspaces/:workspaceId/staff', staffController.create);
router.put('/workspaces/:workspaceId/staff/:id', staffController.update);
router.delete('/workspaces/:workspaceId/staff/:id', staffController.delete);

// Rute specifice
router.get('/workspaces/:workspaceId/staff/:id/schedule', staffController.getSchedule);
router.put('/workspaces/:workspaceId/staff/:id/schedule', staffController.updateSchedule);
router.get('/workspaces/:workspaceId/staff/:id/availability', staffController.getAvailability);

export default router;
