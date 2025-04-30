const express = require('express');
const router = express.Router();
const mongoose = require('../db.js');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
    },
    assigned_to: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    colocation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Colocation',
        required: true
    },
    due_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['à faire', 'en cours', 'terminée'],
        default: 'à faire'
    },
    priority: {
        type: String,
        enum: ['basse', 'moyenne', 'haute'],
        default: 'moyenne'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', taskSchema);

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send('Tâche non trouvée');
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/colocation/:colocationId', async (req, res) => {
    try {
        const tasks = await Task.find({ colocation_id: req.params.colocationId });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/:id/assigned', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('members.user_id', 'username email');
        if (!colocation) return res.status(404).send('Tâche non trouvée');

        res.status(200).json(task.members);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/assigned/today/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const tasks = await Task.find({
            assigned_to: userId,
            due_date: { $gte: startOfDay, $lte: endOfDay }
        });

        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

router.get('/colocation/:colocationId/upcoming', async (req, res) => {
    try {
      const { colocationId } = req.params;
  
      const today = new Date();
      today.setHours(23, 59, 59, 999);
  
      const tasks = await Task.find({
        colocation_id: colocationId,
        due_date: { $gt: today }
      })
      .sort({ due_date: 1 })
      .limit(3);
  
      res.status(200).json(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).send("Erreur serveur");
    }
  });
router.post('/', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) return res.status(404).send('Tâche non trouvée');
        res.json(updatedColocation);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).send('Tâche non trouvée');
        res.json({ message: 'Tâche supprimée' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
