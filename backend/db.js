require('dotenv').config();
const mongoose = require('mongoose');

const ENV = process.env;
const mongoURI = `mongodb://${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_NAME}`;

mongoose.connect(mongoURI, {
    user: ENV.DB_USER,
    pass: ENV.DB_PASSWORD,
    authSource: 'admin'
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = mongoose;