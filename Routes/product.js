const express = require("express");
const router = express.Router();
const User = require("../models/user");


router.get('/:productId',async(req,res) => {
    let user = await User.findOne({email:req.user.email});
    user.cart.push(req.params.productId);
    await user.save();
    // console.log(user.cart);
    req.flash("success","Added to cart");
    res.redirect(req.get("Referer") || "/default-page");
})

router.get('/cart',async(req,res) => {
    let userId = req.user._id;
    let user = await User.findById(userId).populate('cart');
    res.render('./listing/cart',{user});
})