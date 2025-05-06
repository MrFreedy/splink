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
            .populate('assigned_to', 'username email');
        if (!task) return res.status(404).send('Tâche non trouvée');

        res.status(200).json(task.assigned_to);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/assigned/today/:userId', async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId);

        const localNow = new Date();
        const localYear = localNow.getFullYear();
        const localMonth = localNow.getMonth();
        const localDate = localNow.getDate();

        const startLocal = new Date(localYear, localMonth, localDate, 0, 0, 0);
        const endLocal = new Date(localYear, localMonth, localDate, 23, 59, 59, 999);

        const tzOffset = localNow.getTimezoneOffset() * 60000;
        const startUtc = new Date(startLocal.getTime() - tzOffset);
        const endUtc = new Date(endLocal.getTime() - tzOffset);

        console.log("Start UTC:", startUtc.toISOString());
        console.log("End UTC:", endUtc.toISOString());

        const tasks = await Task.find({
            assigned_to: userId,
            due_date: {
                $gte: startUtc,
                $lte: endUtc
            }
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
      const limit = req.body?.limit; 

      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const query = Task.find({
          colocation_id: colocationId,
          due_date: { $gt: today }
      })
      .sort({ due_date: 1 })
      .populate('assigned_to', 'username')
      .populate('created_by', 'username');

      if (limit) {
          query.limit(parseInt(limit));
      }

      const tasks = await query;

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
        res.json(updatedTask);
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
