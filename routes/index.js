
const express = require('express')
const router = express.Router();
const index = require('../controllers/index');

//Home
router.get('/', index.home)
router.get('/about', index.about)
router.get('/join', index.member)
router.get('/privacy', index.privacy)

module.exports = router