const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Products CRUD
router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Filters
router.get('/filters/all', productController.getFilterOptions);

module.exports = router;
