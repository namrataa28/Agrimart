const express = require('express');
const router = express.Router();
const product = require('../models/product');

// router.get("/",async(req,res) => {
//     try{
//         let spiceList = await product.find({category:"Spices"});
//         console.log(spiceList);
//         res.render("listing/home.ejs",{spiceList});
//     }catch(err){
//         console.log(err);
//         res.send("Error found")
//     }
   
// })

module.exports = router;