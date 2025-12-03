import BaseController from './BaseController.js';
import Service from '../models/Service.js';
import workspaceService from '../services/WorkspaceService.js';
import Workspace from '../models/Workspace.js';
import mongoose from 'mongoose';

class ServiceController extends BaseController {
  constructor() {
    super(Service, workspaceService);
  }

  // Metodă specifică pentru a obține serviciile după categorie
  async getByCategory(req, res) {
    try {
      const { workspaceId } = req.params;
      const { category } = req.query;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      // Obținem configurația workspace-ului
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }

      // Construim query-ul în funcție de tipul de business
      let query = { workspaceId, isActive: true };
      
      if (workspace.type === 'clinic' && category) {
        query.category = category;
      } else if (workspace.type === 'fitness' && category) {
        query.difficulty = category;
      } else if (workspace.type === 'hotel' && category) {
        query.roomType = category;
      }

      const services = await Service.find(query)
        .populate('staffId', 'name email')
        .sort({ name: 1 });

      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Metodă specifică pentru a obține serviciile populare
  async getPopular(req, res) {
    try {
      const { workspaceId } = req.params;
      const { limit = 5 } = req.query;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      // Obținem serviciile cu statusul "promoted"
      const promotedServices = await Service.find({
        workspaceId,
        isActive: true,
        status: 'promoted'
      })
      .populate('staffId', 'name email')
      .limit(parseInt(limit))
      .sort({ name: 1 });

      // Dacă nu avem suficiente servicii promovate, completăm cu cele mai scumpe
      let popularServices = [...promotedServices];
      
      if (popularServices.length < limit) {
        const additionalServices = await Service.find({
          workspaceId,
          isActive: true,
          _id: { $nin: popularServices.map(s => s._id) }
        })
        .populate('staffId', 'name email')
        .limit(parseInt(limit) - popularServices.length)
        .sort({ price: -1 });
        
        popularServices = [...popularServices, ...additionalServices];
      }

      res.status(200).json(popularServices);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Metodă specifică pentru a obține statisticile serviciilor
  async getStats(req, res) {
    try {
      const { workspaceId } = req.params;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      // Numărul total de servicii
      const totalServices = await Service.countDocuments({ workspaceId, isActive: true });
      
      // Servicii active
      const activeServices = await Service.countDocuments({
        workspaceId,
        isActive: true,
        status: 'active'
      });

      // Servicii promovate
      const promotedServices = await Service.countDocuments({
        workspaceId,
        isActive: true,
        status: 'promoted'
      });

      // Preț mediu
      const priceStats = await Service.aggregate([
        { $match: { workspaceId: new mongoose.Types.ObjectId(workspaceId), isActive: true } },
        { $group: { _id: null, avgPrice: { $avg: '$price' }, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } }
      ]);

      res.status(200).json({
        total: totalServices,
        active: activeServices,
        promoted: promotedServices,
        price: priceStats.length > 0 ? {
          average: Math.round(priceStats[0].avgPrice * 100) / 100,
          min: priceStats[0].minPrice,
          max: priceStats[0].maxPrice
        } : null
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Suprascriem metoda create pentru a adăuga logică specifică
  async create(req, res) {
    try {
      const { workspaceId } = req.params;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      // Obținem configurația workspace-ului
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }

      // Adăugăm câmpuri specifice în funcție de tipul de business
      const entityData = {
        ...req.body,
        workspaceId,
        createdBy: req.user._id
      };

      // Adăugăm valori default în funcție de tipul de business
      if (workspace.type === 'clinic' && !entityData.category) {
        entityData.category = 'General';
      }
      
      if (workspace.type === 'fitness' && !entityData.difficulty) {
        entityData.difficulty = 'beginner';
      }
      
      if (workspace.type === 'hotel' && !entityData.roomType) {
        entityData.roomType = 'Standard';
      }

      const service = new Service(entityData);
      await service.save();

      // Notificăm serverul Elixir despre schimbare
      await this.workspaceService.notifyChange(workspaceId, {
        type: 'create',
        entity: 'Service',
        data: service
      });

      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new ServiceController();
