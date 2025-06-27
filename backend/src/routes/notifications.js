const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Obtener todas las notificaciones
router.get('/', async (req, res) => {
  try {
    const { status, type, recipient, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (recipient) query.recipients = recipient;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear nueva notificación
router.post('/', async (req, res) => {
  const notification = new Notification(req.body);

  try {
    const newNotification = await notification.save();
    // Aquí se podría implementar el envío de notificaciones push
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Marcar notificación como leída
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    notification.status = 'read';
    notification.readBy.push({
      userId: req.body.userId,
      readAt: new Date()
    });

    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Marcar notificación como archivada
router.patch('/:id/archive', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    notification.status = 'archived';
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener notificaciones no leídas por usuario
router.get('/unread/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipients: req.params.userId,
      status: 'unread'
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener resumen de notificaciones
router.get('/summary', async (req, res) => {
  try {
    const summary = {
      unread: await Notification.countDocuments({ status: 'unread' }),
      urgent: await Notification.countDocuments({ 
        priority: 'urgent',
        status: 'unread'
      }),
      byType: await Notification.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Marcar múltiples notificaciones como leídas
router.post('/bulk-read', async (req, res) => {
  try {
    const { notificationIds, userId } = req.body;
    
    const result = await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { 
        $set: { status: 'read' },
        $push: { 
          readBy: {
            userId: userId,
            readAt: new Date()
          }
        }
      }
    );

    res.json({ message: `${result.modifiedCount} notificaciones actualizadas` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;