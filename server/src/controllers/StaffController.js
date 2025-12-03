import BaseController from './BaseController.js';
import Staff from '../models/Staff.js';
import workspaceService from '../services/WorkspaceService.js';
import Workspace from '../models/Workspace.js';

class StaffController extends BaseController {
  constructor() {
    super(Staff, workspaceService);
  }

  // Metodă specifică pentru a obține programul de lucru al personalului
  async getSchedule(req, res) {
    try {
      const { workspaceId, id } = req.params;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      const staff = await Staff.findOne({ _id: id, workspaceId, isActive: true });
      
      if (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
      }

      res.status(200).json(staff.schedule);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Metodă specifică pentru a actualiza programul de lucru
  async updateSchedule(req, res) {
    try {
      const { workspaceId, id } = req.params;
      const { schedule } = req.body;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      const staff = await Staff.findOneAndUpdate(
        { _id: id, workspaceId, isActive: true },
        { schedule },
        { new: true, runValidators: true }
      );

      if (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
      }

      // Notificăm serverul Elixir despre schimbare
      await this.workspaceService.notifyChange(workspaceId, {
        type: 'update',
        entity: 'Staff',
        data: staff
      });

      res.status(200).json(staff);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Metodă specifică pentru a obține disponibilitatea personalului
  async getAvailability(req, res) {
    try {
      const { workspaceId, id } = req.params;
      const { date } = req.query;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      const staff = await Staff.findOne({ _id: id, workspaceId, isActive: true });
      
      if (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
      }

      // Obținem programările pentru data specificată
      const Appointment = (await import('../models/Appointment.js')).default;
      const appointments = await Appointment.find({
        staffId: id,
        date: new Date(date),
        status: { $in: ['nouă', 'confirmată', 'în curs'] }
      }).select('startMinutes duration');

      // Calculăm intervalele ocupate
      const occupiedSlots = appointments.map(apt => ({
        start: apt.startMinutes,
        end: apt.startMinutes + apt.duration
      }));

      // Obținem ziua săptămânii pentru a determina programul de lucru
      const dayOfWeek = new Date(date).getDay();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const daySchedule = staff.schedule[dayNames[dayOfWeek]] || [];

      // Convertim programul de lucru în minute
      const workingHours = daySchedule.map(timeSlot => {
        const [start, end] = timeSlot.split('-');
        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);
        
        return {
          start: startHour * 60 + startMin,
          end: endHour * 60 + endMin
        };
      });

      res.status(200).json({
        workingHours,
        occupiedSlots
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
      if (workspace.type === 'clinic' && !entityData.specialty) {
        entityData.specialty = 'General';
      }
      
      if (workspace.type === 'fitness' && !entityData.specializations) {
        entityData.specializations = ['General'];
      }
      
      if (workspace.type === 'hotel' && !entityData.department) {
        entityData.department = 'Recepție';
      }

      const staff = new Staff(entityData);
      await staff.save();

      // Notificăm serverul Elixir despre schimbare
      await this.workspaceService.notifyChange(workspaceId, {
        type: 'create',
        entity: 'Staff',
        data: staff
      });

      res.status(201).json(staff);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new StaffController();
