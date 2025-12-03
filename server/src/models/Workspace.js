import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['clinic', 'fitness', 'hotel'],
    default: 'clinic'
  },
  config: {
    labels: {
      type: Map,
      of: String
    },
    menuItems: [{
      id: String,
      label: String,
      icon: String
    }],
    components: {
      type: Map,
      of: String
    }
  },
  schedule: {
    weekdays: String,
    saturday: String,
    sunday: String
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      default: 'basic'
    },
    expiresAt: Date
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

workspaceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Workspace', workspaceSchema);
