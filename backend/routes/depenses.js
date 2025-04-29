const express = require('express');
const router = express.Router();
const mongoose = require('../db.js');

const depenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    paid_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shared_between: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    status: {
        type: String,
        enum: ["à payer", "payée"],
        default: "à payer"
    },
    colocation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Colocation',
        required: true
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
  
depenseSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Depense = mongoose.model('Depense', depenseSchema);

router.get('/', async (req, res) => {
    try {
        const depenses = await Depense.find();
        res.json(depenses);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const depense = await Depense.findById(req.params.id);
        if (!depense) return res.status(404).send('Dépense non trouvée');
        res.json(depense);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/colocation/:colocationId', async (req, res) => {
    try {
        const depenses = await Depense.find({ colocation_id: req.params.colocationId });
        res.json(depenses);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/colocation/:colocationId/last', async (req, res) => {
    try {
        const depenses = await Depense.find({ colocation_id: req.params.colocationId })
            .sort({ created_at: -1 })
            .limit(3);
        res.json(depenses);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/', async (req, res) => {
    try {
        const newDepense = new Depense(req.body);
        const savedDepense = await newDepense.save();
        res.status(201).json(savedDepense);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedDepense = await Depense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDepense) return res.status(404).send('Dépense non trouvée');
        res.json(updatedDepense);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedDepense = await Depense.findByIdAndDelete(req.params.id);
        if (!deletedDepense) return res.status(404).send('Dépense non trouvée');
        res.json({ message: 'Dépense supprimée' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
