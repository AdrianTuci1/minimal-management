import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff'],
    default: 'staff'
  },
  workspaces: [{
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace'
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'staff'],
      default: 'staff'
    }
  }],
  avatar: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  // Hash parola dacă a fost modificată
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  this.updatedAt = Date.now();
  next();
});

// Metodă pentru a compara parolele
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Metodă pentru a obține workspace-urile utilizatorului
userSchema.methods.getWorkspaces = function() {
  return this.workspaces.map(w => w.workspaceId);
};

// Metodă pentru a verifica dacă utilizatorul are acces la un workspace
userSchema.methods.hasWorkspaceAccess = function(workspaceId) {
  return this.workspaces.some(w => 
    w.workspaceId.toString() === workspaceId.toString()
  );
};

// Metodă pentru a obține rolul utilizatorului într-un workspace
userSchema.methods.getRoleInWorkspace = function(workspaceId) {
  const workspace = this.workspaces.find(w => 
    w.workspaceId.toString() === workspaceId.toString()
  );
  return workspace ? workspace.role : null;
};

export default mongoose.model('User', userSchema);
