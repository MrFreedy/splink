const express = require('express');
const router = express.Router();
const mongoose = require('../db.js');
const Colocation = require('../models/Colocation');

router.get('/', async (req, res) => {
    try {
        const colocations = await Colocation.find();
        res.status(200).json(colocations);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const colocation = await Colocation.findById(req.params.id);
        if (!colocation) return res.status(404).send('Colocation non trouvée');
        res.json(colocation);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/:id/members', async (req, res) => {
    try {
        const colocation = await Colocation.findById(req.params.id);
        if (!colocation) return res.status(404).send('Colocation non trouvée');

        res.status(200).json(colocation.members);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});


router.post('/', async (req, res) => {
    try {
        let joinCode;
        let existing;
        do {
            joinCode = Math.floor(100000 + Math.random() * 900000);
            existing = await Colocation.findOne({ join_code: joinCode });
        } while (existing);

        const newColocation = new Colocation({ ...req.body, join_code: joinCode });
        const savedColocation = await newColocation.save();
        res.status(201).json(savedColocation);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedColocation = await Colocation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedColocation) return res.status(404).send('Colocation non trouvée');
        res.json(updatedColocation);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedColocation = await Colocation.findByIdAndDelete(req.params.id);
        if (!deletedColocation) return res.status(404).send('Colocation non trouvée');
        res.json({ message: 'Colocation supprimée' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.delete('/:id/members/:userId', async (req, res) => {
    try {
        const colocation = await Colocation.findById(req.params.id);
        if (!colocation) return res.status(404).send('Colocation non trouvée');

        colocation.members = colocation.members.filter(member => member.user_id.toString() !== req.params.userId);
        await colocation.save();

        await mongoose.model('User').findByIdAndUpdate(req.params.userId, { $set: { colocation_id: null } });

        res.status(200).json(colocation.members);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;