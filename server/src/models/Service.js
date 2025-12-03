import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  duration: {
    type: Number, // în minute
    required: true
  },
  durationDays: {
    type: Number, // pentru servicii hoteliere (zile)
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'RON'
  },
  // Câmpuri specifice pentru clinică
  category: String,
  requiresApproval: {
    type: Boolean,
    default: false
  },
  // Câmpuri specifice pentru fitness
  sessions: Number, // număr de ședințe pentru pachete
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  // Câmpuri specifice pentru hotel
  roomType: String,
  amenities: [String],
  // Câmpuri comune
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'promoted'],
    default: 'active'
  },
  color: String,
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

serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pentru căutări rapide
serviceSchema.index({ workspaceId: 1, code: 1 }, { unique: true });
serviceSchema.index({ workspaceId: 1, name: 1 });

export default mongoose.model('Service', serviceSchema);
