'user strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const EmailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    recipients: {
        type: Array,
        required: true
    }
});

schema.set('timestamps', true);

const Email = mongoose.model('Email', EmailSchema);

module.exports = {Email};