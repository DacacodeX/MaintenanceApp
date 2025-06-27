const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['preventive', 'corrective', 'inventory', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  recipients: [{
    type: String, // IDs de usuarios o roles
    required: true
  }],
  relatedTo: {
    model: {
      type: String,
      enum: ['PreventiveMaintenance', 'CorrectiveMaintenance', 'Inventory']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionType: {
    type: String,
    enum: ['review', 'approve', 'schedule', 'reorder', null],
    default: null
  },
  dueDate: Date,
  readBy: [{
    userId: String,
    readAt: Date
  }],
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
notificationSchema.index({ status: 1, createdAt: -1 });
notificationSchema.index({ recipients: 1, status: 1 });

module.exports = mongoose.model('Notification', notificationSchema);