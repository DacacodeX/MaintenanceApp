const mongoose = require('mongoose');

const correctiveMaintenanceSchema = new mongoose.Schema({
  equipment: {
    type: String,
    required: true
  },
  component: {
    type: String,
    required: true
  },
  failureDescription: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: false
  },
  correctiveActions: [{
    action: String,
    date: Date,
    performedBy: String
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['reported', 'diagnosed', 'in-repair', 'completed'],
    default: 'reported'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completionDate: Date,
  partsUsed: [{
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory'
    },
    quantity: Number
  }],
  downtime: {
    type: Number, // en horas
    default: 0
  },
  cost: {
    labor: Number,
    parts: Number,
    total: Number
  },
  technician: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('CorrectiveMaintenance', correctiveMaintenanceSchema);