import { v4 as uuidv4 } from 'uuid';

class BaseController {
  constructor(model, workspaceService) {
    this.model = model;
    this.workspaceService = workspaceService;
  }

  // Metodă generică pentru a obține toate entitățile dintr-un workspace
  async getAll(req, res) {
    try {
      const { workspaceId } = req.params;
      const { page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      // Construim query-ul
      const query = { workspaceId, isActive: true };
      
      // Adăugăm filtrare după căutare dacă există
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Opțiuni de sortare
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Executăm query-ul cu paginare
      const entities = await this.model
        .find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('staffId', 'name email')
        .populate('serviceId', 'name duration price')
        .populate('clientId', 'name email');

      // Obținem numărul total de documente pentru paginare
      const total = await this.model.countDocuments(query);

      res.status(200).json({
        data: entities,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Metodă generică pentru a obține o entitate după ID
  async getById(req, res) {
    try {
      const { workspaceId, id } = req.params;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      const entity = await this.model.findOne({ _id: id, workspaceId, isActive: true })
        .populate('staffId', 'name email')
        .populate('serviceId', 'name duration price')
        .populate('clientId', 'name email');

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found' });
      }

      res.status(200).json(entity);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Metodă generică pentru a crea o entitate nouă
  async create(req, res) {
    try {
      const { workspaceId } = req.params;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      // Adăugăm workspaceId și createdBy la date
      const entityData = {
        ...req.body,
        workspaceId,
        createdBy: req.user._id
      };

      const entity = new this.model(entityData);
      await entity.save();

      // Notificăm serverul Elixir despre schimbare
      await this.workspaceService.notifyChange(workspaceId, {
        type: 'create',
        entity: this.model.modelName,
        data: entity
      });

      res.status(201).json(entity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Metodă generică pentru a actualiza o entitate
  async update(req, res) {
    try {
      const { workspaceId, id } = req.params;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      const entity = await this.model.findOneAndUpdate(
        { _id: id, workspaceId, isActive: true },
        req.body,
        { new: true, runValidators: true }
      );

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found' });
      }

      // Notificăm serverul Elixir despre schimbare
      await this.workspaceService.notifyChange(workspaceId, {
        type: 'update',
        entity: this.model.modelName,
        data: entity
      });

      res.status(200).json(entity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Metodă generică pentru a șterge o entitate (soft delete)
  async delete(req, res) {
    try {
      const { workspaceId, id } = req.params;
      
      // Verificăm dacă utilizatorul are acces la workspace
      if (!req.user.hasWorkspaceAccess(workspaceId)) {
        return res.status(403).json({ message: 'Access denied to this workspace' });
      }

      const entity = await this.model.findOneAndUpdate(
        { _id: id, workspaceId, isActive: true },
        { isActive: false },
        { new: true }
      );

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found' });
      }

      // Notificăm serverul Elixir despre schimbare
      await this.workspaceService.notifyChange(workspaceId, {
        type: 'delete',
        entity: this.model.modelName,
        data: { _id: id }
      });

      res.status(200).json({ message: 'Entity deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default BaseController;
