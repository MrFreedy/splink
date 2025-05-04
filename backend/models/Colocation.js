const mongoose = require('../db');

const colocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true }
  },
  members: [{
    user_id: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member', required: true }
  }],
  join_code: { type: Number, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Colocation', colocationSchema);