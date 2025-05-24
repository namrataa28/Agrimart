const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pasportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    googleId: {
        type: String,
      },
    email:{
        type:String,
        required:true,
    },
    location: {
        type: String,
        required: true,
      },
    category:{
        type:String,
        enum:['Farmer','Buyer'],
        required:true,
    },
    cart:[{
      type:mongoose.Schema.Types.ObjectId,
      default:[],
      ref:"products",
    }]
    //we don't need to add password field here because passport-local-mongoose will add it automatically
});

userSchema.plugin(pasportLocalMongoose); //this will add username and password field to our schema

module.exports = mongoose.model('user', userSchema);