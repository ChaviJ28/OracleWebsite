
const express = require('express')
const router = express.Router();
const index = require('../controllers/index');

//Home
router.get('/', index.home)


module.exports = router