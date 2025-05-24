const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const initData = require('./home');
const initSchema = require('../models/home');
const productData = require("./product");
const productSchema = require('../models/product');

main().then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Agrimart");
}

//product data insertion
const initDataDB = async() => {
    await productSchema.insertMany(productData);
    console.log("Data inserted");
}
initDataDB().catch((err) => {
    console.log(err);
})

//homepage data insertion
// const initDB = async() => {
//     await initSchema.insertMany(initData.data);
//     console.log("Data inserted");
// }
// initDB().catch((err) => {
//     console.log(err);
// });