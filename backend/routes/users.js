const express = require('express');
const router = express.Router();
const mongoose = require('../db.js');
const Colocation = require('../models/Colocation');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    settings: {
        theme: { type: String, default: 'light' },
        notifications: { type: Boolean, default: true },
        language: { type: String, default: 'fr' },
        date_format: { type: String, default: 'DD/MM/YYYY' }
    },
    colocation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Colocation'
    },
    status: {
        type: String,
        enum: ['actif', 'inactif'],
        default: 'actif'
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

const User = mongoose.model('User', userSchema);

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('Utilisateur non trouvé');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).send('Utilisateur non trouvé');
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).send('Utilisateur non trouvé');
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) return res.status(401).send('Identifiants invalides');
        return res.status(200).json({
            message: 'Connexion réussie',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                status: user.status,
                created_at: user.created_at,
                updated_at: user.updated_at,
                settings: user.settings,
                colocation_id: user.colocation_id || null
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.put('/:id/join', async (req, res) => {
    try {
        const { join_code, colocation_id } = req.body;

        let colocation = null;
        let role = 'member';

        if (join_code) {
            colocation = await Colocation.findOne({ join_code });
            role = 'member';
        } else if (colocation_id) {
            colocation = await Colocation.findById(colocation_id);
            role = 'admin';
        }

        if (!colocation) return res.status(404).send('Colocation non trouvée');

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { colocation_id: colocation._id },
            { new: true }
        );

        if (!user) return res.status(404).send('Utilisateur non trouvé');

        colocation.members.push({
            user_id: user._id,
            username: user.username,
            role
        });

        await colocation.save();

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
