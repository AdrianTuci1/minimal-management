import BaseController from './BaseController.js';
import Appointment from '../models/Appointment.js';
import workspaceService from '../services/WorkspaceService.js';
import Workspace from '../models/Workspace.js';

class AppointmentController extends BaseController {
  constructor() {
    super(Appointment, workspaceService);
  }

  // Metodă specifică pentru a obține programările pentru o anumită dată
  async getByDate(req, res) {
    try {
      const { workspaceId } = req.params;
      const { date, staffId } = req.query;
      
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
      
      if (workspace.type === 'hotel') {
        // Pentru hotel, căutăm rezervări care includ data specificată
        query.startDate = { $lte: new Date(date) };
        query.endDate = { $gte: new Date(date) };
      } else {
        // Pentru clinică și fitness, căutăm programări pentru data specificată
        query.date = new Date(date);
      }

      if (staffId) {
        query.staffId = staffId;
      }

      const appointments = await Appointment.find(query)
        .populate('clientId', 'name email phone')
        .populate('staffId', 'name email color')
        .populate('serviceId', 'name duration price')
        .sort({ startMinutes: 1 });

      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Metodă specifică pentru a obține programările pentru o perioadă
  async getByPeriod(req, res) {
    try {
      const { workspaceId } = req.params;
      const { startDate, endDate, staffId } = req.query;
      
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
      
      if (workspace.type === 'hotel') {
        // Pentru hotel, căutăm rezervări în perioada specificată
        query.startDate = { $lte: new Date(endDate) };
        query.endDate = { $gte: new Date(startDate) };
      } else {
        // Pentru clinică și fitness, căutăm programări în perioada specificată
        query.date = { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate) 
        };
      }

      if (staffId) {
        query.staffId = staffId;
      }

      const appointments = await Appointment.find(query)
        .populate('clientId', 'name email phone')
        .populate('staffId', 'name email color')
        .populate('serviceId', 'name duration price')
        .sort(workspace.type === 'hotel' ? { startDate: 1 } : { date: 1, startMinutes: 1 });

      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Metodă specifică pentru a confirma o programare
  async confirm(req, res) {
    try {
      const { workspaceId, id } = req.params;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      const appointment = await Appointment.findOneAndUpdate(
        { _id: id, workspaceId, isActive: true },
        { status: 'confirmată' },
        { new: true, runValidators: true }
      );

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      // Notificăm serverul Elixir despre schimbare
      await this.workspaceService.notifyChange(workspaceId, {
        type: 'update',
        entity: 'Appointment',
        data: appointment
      });

      // Trimitem o notificare către client
      await this.workspaceService.sendDirectMessage(appointment.clientId, {
        type: 'appointment_confirmed',
        appointment: appointment
      });

      res.status(200).json(appointment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Metodă specifică pentru a anula o programare
  async cancel(req, res) {
    try {
      const { workspaceId, id } = req.params;
      const { reason } = req.body;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      const appointment = await Appointment.findOneAndUpdate(
        { _id: id, workspaceId, isActive: true },
        { 
          status: 'anulată',
          notes: reason || 'Anulată de utilizator'
        },
        { new: true, runValidators: true }
      );

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      // Notificăm serverul Elixir despre schimbare
      await this.workspaceService.notifyChange(workspaceId, {
        type: 'update',
        entity: 'Appointment',
        data: appointment
      });

      // Trimitem o notificare către client
      await this.workspaceService.sendDirectMessage(appointment.clientId, {
        type: 'appointment_cancelled',
        appointment: appointment,
        reason
      });

      res.status(200).json(appointment);
    } catch (error) {
      res.status(400).json({ message: error.message });
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

      // Adăugăm validări specifice
      if (workspace.type === 'hotel') {
        // Pentru hotel, asigurăm că avem startDate și endDate
        if (!entityData.startDate) {
          entityData.startDate = new Date();
        }
        if (!entityData.endDate && entityData.durationDays) {
          const endDate = new Date(entityData.startDate);
          endDate.setDate(endDate.getDate() + entityData.durationDays);
          entityData.endDate = endDate;
        }
      } else {
        // Pentru clinică și fitness, asigurăm că avem date și startMinutes
        if (!entityData.date) {
          entityData.date = new Date();
        }
        if (!entityData.startMinutes && entityData.start) {
          // Convertim ora în minute dacă este furnizată ca string "HH:MM"
          const timeMatch = String(entityData.start).match(/^(\d{1,2}):(\d{2})$/);
          if (timeMatch) {
            const hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            entityData.startMinutes = hours * 60 + minutes;
          }
        }
      }

      const appointment = new Appointment(entityData);
      await appointment.save();

      // Notificăm serverul Elixir despre schimbare
      await this.workspaceService.notifyChange(workspaceId, {
        type: 'create',
        entity: 'Appointment',
        data: appointment
      });

      // Trimitem o notificare către client
      await this.workspaceService.sendDirectMessage(appointment.clientId, {
        type: 'appointment_created',
        appointment: appointment
      });

      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new AppointmentController();
