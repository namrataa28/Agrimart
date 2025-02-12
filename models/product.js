const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        default: 1 
        },
    location:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:['Fruits and Vegetables','Legumes and Oil Seeds','Cereals and Grains','Livestock and Plantation','Cash crops','Spices'],
        required:true
    }
})

 const products = mongoose.model('products',ProductSchema);

 module.exports = products;