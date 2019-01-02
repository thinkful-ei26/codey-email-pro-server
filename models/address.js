'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const AddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    name: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        required: true
    }
});

AddressSchema.index({userId: 1, address: 1}, {unique: true});

const Address = mongoose.model('Address', AddressSchema);

module.exports = {Address};
