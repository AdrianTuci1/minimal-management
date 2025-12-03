import express from 'express';
import serviceController from '../controllers/ServiceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Aplicăm middleware de autentificare la toate rutele
router.use(authenticateToken);

// Rute standard CRUD
router.get('/workspaces/:workspaceId/services', serviceController.getAll);
router.get('/workspaces/:workspaceId/services/:id', serviceController.getById);
router.post('/workspaces/:workspaceId/services', serviceController.create);
router.put('/workspaces/:workspaceId/services/:id', serviceController.update);
router.delete('/workspaces/:workspaceId/services/:id', serviceController.delete);

// Rute specifice
router.get('/workspaces/:workspaceId/services/category', serviceController.getByCategory);
router.get('/workspaces/:workspaceId/services/popular', serviceController.getPopular);
router.get('/workspaces/:workspaceId/services/stats', serviceController.getStats);

export default router;
