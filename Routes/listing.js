const express = require("express");
const router = express.Router();
const product = require("../models/product");

router.get("/:category",async(req,res) => {
    let {category} = req.params;
    let products = await product.find({category:{ $regex: new RegExp("^" + category + "$", "i") }});
    res.render("./listing/view",{products});
})



// Update quantity route
router.patch('/update-quantity', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;
        
        await User.findByIdAndUpdate(userId, {
            $set: { "cart.$[elem].quantity": quantity }
        }, {
            arrayFilters: [{ "elem.productId": productId }],
            new: true
        });

        res.status(200).json({ message: 'Quantity updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update quantity' });
    }
});

// Remove item route
router.delete('/remove', async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;
        
        await User.findByIdAndUpdate(userId, {
            $pull: { cart: { productId: productId } }
        });

        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
});

module.exports = router;