import express from 'express';
import clientController from '../controllers/ClientController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Aplicăm middleware de autentificare la toate rutele
router.use(authenticateToken);

// Rute standard CRUD
router.get('/workspaces/:workspaceId/clients', clientController.getAll);
router.get('/workspaces/:workspaceId/clients/:id', clientController.getById);
router.post('/workspaces/:workspaceId/clients', clientController.create);
router.put('/workspaces/:workspaceId/clients/:id', clientController.update);
router.delete('/workspaces/:workspaceId/clients/:id', clientController.delete);

// Rute specifice
router.get('/workspaces/:workspaceId/clients/upcoming', clientController.getWithUpcomingAppointments);
router.get('/workspaces/:workspaceId/clients/stats', clientController.getStats);

export default router;
