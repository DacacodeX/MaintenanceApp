const mongoose = require('mongoose');

const preventiveMaintenanceSchema = new mongoose.Schema({
  equipment: {
    type: String,
    required: true
  },
  taskDescription: {
    type: String,
    required: true
  },
  frequency: {
    type: Number,
    required: true
  },
  frequencyUnit: {
    type: String,
    enum: ['hours', 'kilometers'],
    required: true
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  nextMaintenance: {
    type: Date,
    required: true
  },
  currentUsage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  workOrder: {
    type: String,
    unique: true
  },
  assignedTo: {
    type: String
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('PreventiveMaintenance', preventiveMaintenanceSchema);