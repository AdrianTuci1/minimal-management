import BaseController from './BaseController.js';
import Client from '../models/Client.js';
import workspaceService from '../services/WorkspaceService.js';
import Workspace from '../models/Workspace.js';

class ClientController extends BaseController {
  constructor() {
    super(Client, workspaceService);
  }

  // Metodă specifică pentru a obține clienții cu programări viitoare
  async getWithUpcomingAppointments(req, res) {
    try {
      const { workspaceId } = req.params;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      // Obținem configurația workspace-ului pentru a determina tipul de business
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }

      // Construim query-ul în funcție de tipul de business
      let query = { workspaceId, isActive: true };
      let populateOptions = {};

      if (workspace.type === 'hotel') {
        // Pentru hotel, populăm rezervările viitoare
        populateOptions = {
          path: 'appointments',
          match: { 
            startDate: { $gte: new Date() },
            status: { $in: ['nouă', 'confirmată'] }
          },
          populate: [
            { path: 'serviceId', select: 'name durationDays price' },
            { path: 'staffId', select: 'name' }
          ]
        };
      } else {
        // Pentru clinică și fitness, populăm programările viitoare
        populateOptions = {
          path: 'appointments',
          match: { 
            date: { $gte: new Date() },
            status: { $in: ['nouă', 'confirmată'] }
          },
          populate: [
            { path: 'serviceId', select: 'name duration price' },
            { path: 'staffId', select: 'name' }
          ]
        };
      }

      const clients = await Client.find(query)
        .populate(populateOptions)
        .sort({ name: 1 });

      // Filtrăm clienții care au programări viitoare
      const clientsWithAppointments = clients.filter(client => 
        client.appointments && client.appointments.length > 0
      );

      res.status(200).json(clientsWithAppointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Metodă specifică pentru a obține statisticile clienților
  async getStats(req, res) {
    try {
      const { workspaceId } = req.params;
      const { period = 'month' } = req.query;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      // Obținem configurația workspace-ului
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }

      // Calculăm data de început în funcție de perioadă
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'month':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      // Numărul total de clienți
      const totalClients = await Client.countDocuments({ workspaceId, isActive: true });
      
      // Clienți noi în perioada specificată
      const newClients = await Client.countDocuments({
        workspaceId,
        isActive: true,
        createdAt: { $gte: startDate }
      });

      // Clienți activi (cu programări în perioada specificată)
      let activeClientsQuery;
      if (workspace.type === 'hotel') {
        activeClientsQuery = {
          workspaceId,
          isActive: true,
          'appointments.startDate': { $gte: startDate }
        };
      } else {
        activeClientsQuery = {
          workspaceId,
          isActive: true,
          'appointments.date': { $gte: startDate }
        };
      }

      const activeClients = await Client.countDocuments(activeClientsQuery);

      res.status(200).json({
        total: totalClients,
        new: newClients,
        active: activeClients,
        period
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
      if (workspace.type === 'fitness' && !entityData.membershipType) {
        entityData.membershipType = 'basic';
      }
      
      if (workspace.type === 'hotel' && !entityData.loyaltyPoints) {
        entityData.loyaltyPoints = 0;
      }

      const client = new Client(entityData);
      await client.save();

      // Notificăm serverul Elixir despre schimbare
      await this.workspaceService.notifyChange(workspaceId, {
        type: 'create',
        entity: 'Client',
        data: client
      });

      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new ClientController();
