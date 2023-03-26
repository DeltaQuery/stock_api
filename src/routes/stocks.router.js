const express = require('express')
const stocksController = require('../controllers/stocks.controller')
//const validatorHandler = require('./../middlewares/validator.handler');
//const { createProductDto, updateProductDto, getProductDto, queryProductDto } = require('../dtos/product.dto');

const router = express.Router()

router.get('/', stocksController.getAllStocks)
router.get('/:stock', stocksController.getStockData)
/*router.post('/', productsController)
router.patch('/', productsController)
router.delete('/', productsController)*/

module.exports = router
