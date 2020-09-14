//MODELLO DI UNA RECENSIONE

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const reviewSchema = mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: String,
        required: true
    },
    pub: {
        type: String,
        required: true
    },
    drink: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    }
});


reviewSchema.pre('save', async function (next) {
    // insert in the db the review
    const review = this;
    next();
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;  //disponibile a livello globale