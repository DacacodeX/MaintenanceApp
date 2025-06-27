const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Notification = require('../models/Notification');

// Obtener todo el inventario
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ partNumber: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear nuevo item en inventario
router.post('/', async (req, res) => {
  const inventory = new Inventory(req.body);

  try {
    const newItem = await inventory.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar item de inventario
router.patch('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    const oldStock = item.currentStock;
    Object.keys(req.body).forEach(key => {
      item[key] = req.body[key];
    });

    const updatedItem = await item.save();

    // Verificar si se necesita crear alertas
    if (updatedItem.currentStock <= updatedItem.reorderPoint) {
      await Notification.create({
        type: 'inventory',
        title: 'Punto de reorden alcanzado',
        message: `El repuesto ${updatedItem.name} ha alcanzado el punto de reorden`,
        priority: 'high',
        recipients: ['inventory-manager', 'purchasing'],
        relatedTo: {
          model: 'Inventory',
          id: updatedItem._id
        },
        actionRequired: true,
        actionType: 'reorder'
      });
    }

    // Si el stock bajó del mínimo, crear alerta
    if (updatedItem.currentStock <= updatedItem.minimumStock) {
      await Notification.create({
        type: 'inventory',
        title: 'Stock mínimo alcanzado',
        message: `El repuesto ${updatedItem.name} ha alcanzado el stock mínimo`,
        priority: 'urgent',
        recipients: ['inventory-manager', 'maintenance-supervisor'],
        relatedTo: {
          model: 'Inventory',
          id: updatedItem._id
        }
      });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener items bajo el punto de reorden
router.get('/reorder', async (req, res) => {
  try {
    const items = await Inventory.find({
      $expr: {
        $lte: ['$currentStock', '$reorderPoint']
      }
    }).sort({ currentStock: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener historial de movimientos
router.get('/:id/history', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    // Obtener alertas relacionadas con este item
    const alerts = await Notification.find({
      'relatedTo.model': 'Inventory',
      'relatedTo.id': item._id
    }).sort({ createdAt: -1 });

    res.json({
      item,
      alerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar items por categoría o nombre
router.get('/search', async (req, res) => {
  try {
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    const items = await Inventory.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;