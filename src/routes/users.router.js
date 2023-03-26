const express = require('express')
const usersController = require('../controllers/users.controller')
//const validatorHandler = require('./../middlewares/validator.handler');
//const { createProductDto, updateProductDto, getProductDto, queryProductDto } = require('../dtos/product.dto');

const router = express.Router()

router.get('/', usersController.getAllUsers)
/*router.post('/', productsController)
router.patch('/', productsController)
router.delete('/', productsController)*/

module.exports = router
