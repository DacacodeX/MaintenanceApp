const express = require('express');
const router = express.Router();
const PreventiveMaintenance = require('../models/PreventiveMaintenance');
const Notification = require('../models/Notification');

// Obtener todas las tareas de mantenimiento preventivo
router.get('/', async (req, res) => {
  try {
    const tasks = await PreventiveMaintenance.find().sort({ nextMaintenance: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear nueva tarea de mantenimiento preventivo
router.post('/', async (req, res) => {
  const task = new PreventiveMaintenance({
    ...req.body,
    workOrder: `PM-${Date.now()}`
  });

  try {
    const newTask = await task.save();
    
    // Crear notificación
    await Notification.create({
      type: 'preventive',
      title: 'Nueva tarea de mantenimiento programada',
      message: `Se ha programado mantenimiento para ${task.equipment}`,
      priority: 'medium',
      recipients: ['maintenance-team'],
      relatedTo: {
        model: 'PreventiveMaintenance',
        id: newTask._id
      }
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar tarea de mantenimiento
router.patch('/:id', async (req, res) => {
  try {
    const task = await PreventiveMaintenance.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    Object.keys(req.body).forEach(key => {
      task[key] = req.body[key];
    });

    const updatedTask = await task.save();

    // Si se completa la tarea, crear notificación
    if (req.body.status === 'completed') {
      await Notification.create({
        type: 'preventive',
        title: 'Mantenimiento completado',
        message: `Se ha completado el mantenimiento de ${task.equipment}`,
        priority: 'low',
        recipients: ['maintenance-supervisor'],
        relatedTo: {
          model: 'PreventiveMaintenance',
          id: task._id
        }
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener tablero de control
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const dashboard = {
      pending: await PreventiveMaintenance.countDocuments({ status: 'pending' }),
      inProgress: await PreventiveMaintenance.countDocuments({ status: 'in-progress' }),
      completed: await PreventiveMaintenance.countDocuments({ status: 'completed' }),
      upcomingTasks: await PreventiveMaintenance.find({
        nextMaintenance: { $gte: now, $lte: nextWeek },
        status: 'pending'
      }).sort({ nextMaintenance: 1 })
    };
    
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await PreventiveMaintenance.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar tarea de mantenimiento
router.delete('/:id', async (req, res) => {
  try {
    const task = await PreventiveMaintenance.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    await task.remove();
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;