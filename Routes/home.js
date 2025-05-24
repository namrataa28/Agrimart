const express = require('express');
const router = express.Router();
const product = require('../models/product');
const initSchema = require("../models/home");
const User = require("../models/user");
const {isLogged} = require("../middleware");
const {saveRedirectUrl} = require("../middleware");

router.get("/",async(req,res) => {
    let all_image = await initSchema.find({});
    let spiceList = await product.find({category:"Spices"});
    let cashCrop = await product.find({category:"Cash crops"});
    let liveStock = await product.find({category:"Livestock and Plantation"});
    let cereal = await product.find({category:"Cereals and Grains"})
    let legumes = await product.find({category:"Legumes and Oil Seeds"});
    let fruits = await product.find({category:"Fruits and Vegetables"})
    res.render("./listing/home",{all_image, spiceList,cashCrop,liveStock,cereal,legumes,fruits});
})

//access cart section
router.get('/cart',isLogged,async(req,res) => {
    let userId = req.user._id;
    let user = await User.findById(userId).populate('cart');
    res.render('./listing/cart',{user});
})

//delete route for cart
router.delete('/cart/delete/:productId', async (req, res) => {
  try {
    let userId = req.user._id;
    let user = await User.findById(userId).populate('cart');
    let productId = req.params.productId;
    
    // More robust check for product existence
    // const initialCount = user.cart.length;
user.cart = user.cart.filter(product => product._id.toString() !== productId);
    // if (user.cart.length === initialCount) {
    //   return res.status(404).json({ message: 'Product not found in cart' });
    // }
    
    await user.save();
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error deleting product from cart' });
  }
});

module.exports = router;