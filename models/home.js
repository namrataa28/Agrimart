const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homepageSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    category:{
        type:String,
        enum:['Fruits and Vegetables','Legumes and Oil Seeds','Cereals and Grains','Livestock and Plantation','Cash crops','Spices'],
        required:true
    }
});

const HomePageModel = mongoose.model('HomePage', homepageSchema);
module.exports = HomePageModel;