import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
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
  specialty: {
    type: String,
    trim: true
  },
  cabinet: String,
  licenseNumber: String,
  // Câmpuri specifice pentru fitness
  certifications: [String],
  specializations: [String],
  // Câmpuri specifice pentru hotel
  department: String,
  position: String,
  // Câmpuri comune
  color: {
    type: String,
    default: '#6366F1'
  },
  avatar: String,
  schedule: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String],
    saturday: [String],
    sunday: [String]
  },
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

staffSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pentru căutări rapide
staffSchema.index({ workspaceId: 1, email: 1 }, { unique: true });
staffSchema.index({ workspaceId: 1, name: 1 });

export default mongoose.model('Staff', staffSchema);
