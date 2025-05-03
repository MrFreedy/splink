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
    repayments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            isPaid: {
                type: Boolean,
                default: false
            },
            paidAt: {
                type: Date
            }
        }
    ],
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

router.get('/user/:userId/dettes', async (req, res) => {
    try {
        const userId = req.params.userId;

        const dettes = await Depense.find({
        shared_between: userId,
        paid_by: { $ne: userId },
        status: "à payer"
        }).populate('paid_by');

        const result = dettes.map(depense => {
        const montantParPersonne = depense.amount / depense.shared_between.length;

        return {
            depenseId: depense._id,
            title: depense.title,
            category: depense.category,
            date: depense.paymentDate,
            total: depense.amount,
            paidBy: {
            id: depense.paid_by._id,
            username: depense.paid_by.username
            },
            dueAmount: parseFloat(montantParPersonne.toFixed(2))
        };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/user/:userId/avoirs', async (req, res) => {
    try {
        const userId = req.params.userId;

        const depenses = await Depense.find({
        paid_by: userId,
        status: "à payer"
        }).populate('shared_between');

        const result = [];

        for (const depense of depenses) {
        const montantParPersonne = depense.amount / depense.shared_between.length;

        for (const personne of depense.shared_between) {
            if (personne._id.toString() !== userId) {
            result.push({
                depenseId: depense._id,
                title: depense.title,
                category: depense.category,
                date: depense.paymentDate,
                total: depense.amount,
                owedBy: {
                id: personne._id,
                username: personne.username
                },
                amountDue: parseFloat(montantParPersonne.toFixed(2))
            });
            }
        }
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

router.get('/colocation/:colocationId/repartition', async (req, res) => {
    try {
        const { colocationId } = req.params;

        const depenses = await Depense.find({ colocation_id: colocationId }).populate('paid_by');

        const repartitionMap = new Map();
        let totalAmount = 0;

        depenses.forEach(depense => {
            const userId = depense.paid_by._id.toString();
            const username = depense.paid_by.username;
            const current = repartitionMap.get(userId) || { username, amount: 0 };
            current.amount += depense.amount;
            repartitionMap.set(userId, current);
            totalAmount += depense.amount;
        });

        const repartition = Array.from(repartitionMap.entries()).map(([userId, data]) => ({
            userId,
            username: data.username,
            pourcentage: parseFloat(((data.amount / totalAmount) * 100).toFixed(2))
        }));

        res.json(repartition);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

router.get('/colocation/:colocationId/repartition-par-categorie', async (req, res) => {
    try {
        const { colocationId } = req.params;

        const depenses = await Depense.find({ colocation_id: colocationId });

        const categoryMap = new Map();
        let totalAmount = 0;

        depenses.forEach(depense => {
            const category = depense.category;
            const current = categoryMap.get(category) || 0;
            categoryMap.set(category, current + depense.amount);
            totalAmount += depense.amount;
        });

        const repartition = Array.from(categoryMap.entries()).map(([category, amount]) => ({
            category,
            pourcentage: parseFloat(((amount / totalAmount) * 100).toFixed(2))
        }));

        res.json(repartition);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

router.get('/colocation/:colocationId/repartition-mensuelle', async (req, res) => {
    try {
        const { colocationId } = req.params;

        const dateLimite = new Date();
        dateLimite.setDate(dateLimite.getDate() - 30);

        const depenses = await Depense.find({ 
            colocation_id: colocationId, 
            paymentDate: { $gte: dateLimite } 
        }).populate('paid_by');

        const repartitionMap = new Map();
        let totalAmount = 0;

        depenses.forEach(depense => {
            const userId = depense.paid_by._id.toString();
            const username = depense.paid_by.username;
            const current = repartitionMap.get(userId) || { username, amount: 0 };
            current.amount += depense.amount;
            repartitionMap.set(userId, current);
            totalAmount += depense.amount;
        });

        const repartition = Array.from(repartitionMap.entries()).map(([userId, data]) => ({
            userId,
            username: data.username,
            pourcentage: parseFloat(((data.amount / totalAmount) * 100).toFixed(2))
        }));

        res.json(repartition);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

router.get('/colocation/:colocationId/repartition-par-categorie-mensuelle', async (req, res) => {
    try {
        const { colocationId } = req.params;

        const dateLimite = new Date();
        dateLimite.setDate(dateLimite.getDate() - 30);

        const depenses = await Depense.find({
            colocation_id: colocationId,
            paymentDate: { $gte: dateLimite }
        });

        const categoryMap = new Map();
        let totalAmount = 0;

        depenses.forEach(depense => {
            const category = depense.category;
            const currentAmount = categoryMap.get(category) || 0;
            categoryMap.set(category, currentAmount + depense.amount);
            totalAmount += depense.amount;
        });

        const repartition = Array.from(categoryMap.entries()).map(([category, amount]) => ({
            category,
            pourcentage: parseFloat(((amount / totalAmount) * 100).toFixed(2))
        }));

        res.json(repartition);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, amount, category, paymentDate, paid_by, shared_between, colocation_id } = req.body;

        const repayments = shared_between
          .filter(userId => userId !== paid_by)
          .map(userId => ({
            user: userId,
            isPaid: false
          }));

        const newDepense = new Depense({
          title,
          amount,
          category,
          paymentDate,
          paid_by,
          shared_between,
          colocation_id,
          repayments
        });

        const savedDepense = await newDepense.save();
        res.status(201).json(savedDepense);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/:id/repay', async (req, res) => {
    const { userId } = req.body;
    const depenseId = req.params.id;

    try {
      const depense = await Depense.findById(depenseId);
      if (!depense) return res.status(404).send('Dépense non trouvée');

      const repayment = depense.repayments.find(r => r.user.toString() === userId);
      if (!repayment) return res.status(400).send('Utilisateur non concerné');

      repayment.isPaid = true;
      repayment.paidAt = new Date();

      const isFullyPaid = depense.repayments.every(r => r.isPaid);
      if (isFullyPaid) {
        depense.status = "payée";
      }

      await depense.save();
      res.send({ message: 'Remboursement enregistré' });
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
