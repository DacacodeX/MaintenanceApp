const express = require('express');
const router = express.Router();
const CorrectiveMaintenance = require('../models/CorrectiveMaintenance');
const Notification = require('../models/Notification');
const Inventory = require('../models/Inventory');

// Obtener todos los mantenimientos correctivos
router.get('/', async (req, res) => {
  try {
    const maintenances = await CorrectiveMaintenance.find()
      .sort({ priority: -1, startDate: -1 })
      .populate('partsUsed.partId');
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const maintenance = await CorrectiveMaintenance.findById(req.params.id)
      .populate('partsUsed.partId');
    
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance not found' });
    }
    
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear nuevo mantenimiento correctivo
router.post('/', async (req, res) => {
  const maintenance = new CorrectiveMaintenance(req.body);
  
  try {
    const newMaintenance = await maintenance.save();
    
    // Crear notificación de nueva falla
    await Notification.create({
      type: 'corrective',
      title: 'Nueva falla reportada',
      message: `Se ha reportado una falla en ${maintenance.equipment} - ${maintenance.component}`,
      priority: maintenance.priority,
      recipients: ['maintenance-team', 'supervisor'],
      relatedTo: {
        model: 'CorrectiveMaintenance',
        id: newMaintenance._id
      },
      actionRequired: true,
      actionType: 'review'
    });

    res.status(201).json(newMaintenance);
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ message: error.message });
  }
});

// Actualizar mantenimiento correctivo
router.patch('/:id', async (req, res) => {
  try {
    const maintenance = await CorrectiveMaintenance.findById(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado' });
    }

    // Si se están agregando partes usadas, actualizar el inventario
    if (req.body.partsUsed) {
      for (const part of req.body.partsUsed) {
        const inventory = await Inventory.findById(part.partId);
        if (inventory) {
          inventory.currentStock -= part.quantity;
          await inventory.save();
        }
      }
    }

    Object.keys(req.body).forEach(key => {
      maintenance[key] = req.body[key];
    });

    const updatedMaintenance = await maintenance.save();

    // Si se completa el mantenimiento, crear notificación
    if (req.body.status === 'completed') {
      await Notification.create({
        type: 'corrective',
        title: 'Mantenimiento correctivo completado',
        message: `Se ha completado la reparación de ${maintenance.equipment}`,
        priority: 'medium',
        recipients: ['maintenance-supervisor', 'operations-manager'],
        relatedTo: {
          model: 'CorrectiveMaintenance',
          id: maintenance._id
        }
      });
    }

    res.json(updatedMaintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener estadísticas de mantenimiento correctivo
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      total: await CorrectiveMaintenance.countDocuments(),
      byStatus: await CorrectiveMaintenance.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      byPriority: await CorrectiveMaintenance.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      averageDowntime: await CorrectiveMaintenance.aggregate([
        { $group: { _id: null, avg: { $avg: '$downtime' } } }
      ])
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener historial por equipo
router.get('/equipment/:equipmentId', async (req, res) => {
  try {
    const history = await CorrectiveMaintenance.find({
      equipment: req.params.equipmentId
    }).sort({ startDate: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;