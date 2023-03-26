const express = require('express')
const guideController = require('../controllers/guide.controller')

const router = express.Router()

router.get('/', guideController.getGuide)

module.exports = router
