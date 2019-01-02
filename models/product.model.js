const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 100
    },
    price: {
        type: Number,
        required: true
    }
});

//create a model from ProductSchema, name it Product and export.
module.exports = mongoose.model('Product', ProductSchema)