import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  // Câmpuri specifice pentru clinică
  medicalHistory: {
    type: String
  },
  allergies: [{
    type: String
  }],
  // Câmpuri specifice pentru fitness
  membershipType: {
    type: String,
    enum: ['basic', 'premium', 'vip']
  },
  membershipExpiresAt: Date,
  fitnessGoals: [String],
  // Câmpuri specifice pentru hotel
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  preferences: {
    roomType: String,
    floor: String,
    smoking: Boolean
  },
  // Câmpuri comune
  notes: String,
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

clientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pentru căutări rapide
clientSchema.index({ workspaceId: 1, email: 1 }, { unique: true });
clientSchema.index({ workspaceId: 1, name: 1 });

export default mongoose.model('Client', clientSchema);
