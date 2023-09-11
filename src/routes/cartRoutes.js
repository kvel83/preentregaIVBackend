const express = require("express");
const router = express.Router();
const Cart = require('../controllers/cartController');

router.post("/", Cart.addCart);
router.get("/:cid", Cart.getCartById);
router.post("/:cid/product/:pid", Cart.addProductToCart);

module.exports = router;