const express = require("express");
const router = express.Router();
const Products = require('../controllers/productController');

router.get("/", Products.getAllProducts);
router.get("/:pid", Products.getProductById);
router.post("/", Products.addProduct);
router.put("/:pid", Products.updateProduct);
router.delete("/:pid", Products.deleteProduct);

module.exports = router;

