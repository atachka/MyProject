const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    cartItems: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        }
    ]
});

exports.Cart = mongoose.model('Cart', cartSchema);