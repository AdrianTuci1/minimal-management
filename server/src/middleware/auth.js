import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware pentru a verifica token-ul JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    // Obținem utilizatorul complet din baza de date
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive user' });
    }

    // Adăugăm utilizatorul la request
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware pentru a verifica rolul utilizatorului
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role;
    
    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient permissions' });
    }
  };
};

// Middleware pentru a verifica accesul la workspace
export const requireWorkspaceAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const workspaceId = req.params.workspaceId;
  
  if (!req.user.hasWorkspaceAccess(workspaceId)) {
    return res.status(403).json({ message: 'Access denied to this workspace' });
  }

  next();
};

// Middleware pentru a verifica rolul utilizatorului într-un workspace specific
export const requireWorkspaceRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const workspaceId = req.params.workspaceId;
    const userRole = req.user.getRoleInWorkspace(workspaceId);
    
    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient permissions for this workspace' });
    }
  };
};
