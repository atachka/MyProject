const mongoose = require('mongoose');
// const { Product } = require('./productModel')

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a shop must have a name!']
    },
    image: {
        type: String
    },
    location: {
        type: String,
        required: [true, 'a shop must have a location']
    },
    products: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        }
    ]
});

// shopSchema.pre('save', async function (next) {
//     const productsPromises = this.products.map(async id => await Product.findById(id));
//     this.products = await Promise.all(productsPromises);
//     next();
// });

exports.Shop = mongoose.model('Shop', shopSchema);