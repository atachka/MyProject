const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your name!']
    },
    price: {
        type: Number,
        required: [true, 'a product must have a price']
    },
    description: {
        type: String,
        required: [true, 'a product must have a description']
    },
    image: {
        type: String,
        required: [true, 'a product must have an image']
    }
});





exports.Product = mongoose.model('Product', productSchema);