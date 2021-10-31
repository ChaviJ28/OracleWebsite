
const express = require('express')
const router = express.Router();
const index = require('../controllers/index');

//Home
router.get('/', index.home)
router.get('/about', index.about)

module.exports = router