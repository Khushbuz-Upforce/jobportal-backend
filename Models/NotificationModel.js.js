const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: String,
    type: String, // e.g. 'application', 'info', etc.
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
