const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  partNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true
  },
  manufacturer: String,
  currentStock: {
    type: Number,
    required: true,
    min: 0
  },
  minimumStock: {
    type: Number,
    required: true,
    min: 0
  },
  reorderPoint: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  location: {
    warehouse: String,
    shelf: String,
    bin: String
  },
  compatibleEquipment: [{
    type: String
  }],
  supplier: {
    name: String,
    contact: String,
    leadTime: Number // tiempo de entrega en días
  },
  lastRestockDate: Date,
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock', 'ordered'],
    default: 'in-stock'
  },
  alerts: [{
    type: String,
    message: String,
    date: Date,
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active'
    }
  }]
}, {
  timestamps: true
});

// Middleware para actualizar el estado basado en el stock
inventorySchema.pre('save', function(next) {
  if (this.currentStock <= this.minimumStock) {
    this.status = 'low-stock';
  } else if (this.currentStock === 0) {
    this.status = 'out-of-stock';
  } else {
    this.status = 'in-stock';
  }
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);