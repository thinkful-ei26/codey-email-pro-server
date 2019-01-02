'use strict';
const express = require('express');
const router = express.Router();

const passport = require('passport');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Address} = require('../models/address');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', jwtAuth, (req, res) => {
    const userId = req.user.id;
    return Address.find({userId})
        .then(results => {
            return res.status(200).json(results);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }); 
});

router.get('/:id', jwtAuth, (req,res) => {
    const {id} = req.params;
    const userId = req.user.id;
    return Address.findOne({_id: id, userId})
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

router.put('/:id', jsonParser, jwtAuth, (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;

    const toUpdate = {};
    const updateableFields = ['name', 'address'];

    updateableFields.forEach(field => {
        if (field in req.body) {
        toUpdate[field] = req.body[field];
        }
    });
    return Address.findOneAndUpdate({_id: id, userId}, toUpdate, {new: true})
        .then(results => {
            res.status(200).json(results);
        })
        .catch(err => {
            res.status(500).json(err);
        }); 
});

router.post('/', jsonParser, jwtAuth, (req, res) => {
    // add more validation here later
    const {name = '', address} = req.body;
    const userId = req.user.id;
    return Address.find({userId, address})
        .count()
        .then(count => {
            if(count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Address already exists in collection',
                    location: 'address'
                });
            }
            return Address.create({
                userId,
                name,
                address
            })
        })
        .then(address => {
            return res.status(201).json(address);
        })
        .catch(err => {
            if(err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({code: 500, message: 'Internal server error'})
        });    
});

router.delete('/:id', jwtAuth, (req,res) => {
    const {id} = req.params;
    const userId = req.user.id;
    return Address.findOneAndRemove({_id: id, userId})
        .then( () => {
            return res.status(204).json();
        })
        .catch(err => {
            res.status(500).json({code: 500, message: err})
        });
});

module.exports = {router};