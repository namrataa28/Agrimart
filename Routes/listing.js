const express = require("express");
const router = express.Router();
const product = require("../models/product");

router.get("/:category",async(req,res) => {
    let {category} = req.params;
    let products = await product.find({category:{ $regex: new RegExp("^" + category + "$", "i") }});
    res.render("./listing/view",{products});
})

module.exports = router;