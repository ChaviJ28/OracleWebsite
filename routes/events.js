
const express = require('express')
const router = express.Router();
const event = require('../controllers/events');

//Home
router.get('/', event.home)

module.exports = router