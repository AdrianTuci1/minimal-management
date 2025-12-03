import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  // Câmpuri pentru programări (clinică, fitness)
  date: {
    type: Date,
    required: true
  },
  startMinutes: {
    type: Number, // minute de la începutul zilei (ex: 9*60 = 540 pentru 09:00)
    required: true
  },
  duration: {
    type: Number, // în minute
    required: true
  },
  // Câmpuri pentru rezervări hoteliere
  startDate: Date,
  endDate: Date,
  durationDays: Number,
  roomId: String,
  // Câmpuri comune
  status: {
    type: String,
    enum: ['nouă', 'confirmată', 'în curs', 'finalizată', 'anulată'],
    default: 'nouă'
  },
  notes: String,
  price: Number,
  paidAmount: {
    type: Number,
    default: 0
  },
  reminders: [{
    type: Date
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pentru căutări rapide
appointmentSchema.index({ workspaceId: 1, date: 1 });
appointmentSchema.index({ workspaceId: 1, clientId: 1 });
appointmentSchema.index({ workspaceId: 1, staffId: 1 });
appointmentSchema.index({ workspaceId: 1, status: 1 });

// Metodă virtuală pentru a calcula ora de sfârșit
appointmentSchema.virtual('endMinutes').get(function() {
  return this.startMinutes + this.duration;
});

// Metodă virtuală pentru a calcula data și ora de sfârșit
appointmentSchema.virtual('endTime').get(function() {
  if (!this.date) return null;
  const endMinutes = this.startMinutes + this.duration;
  const hours = Math.floor(endMinutes / 60);
  const minutes = endMinutes % 60;
  const endTime = new Date(this.date);
  endTime.setHours(hours, minutes, 0, 0);
  return endTime;
});

export default mongoose.model('Appointment', appointmentSchema);
