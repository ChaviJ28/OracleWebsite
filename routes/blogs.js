
const express = require('express')
const router = express.Router();
const blog = require('../controllers/blogs');

//Home
router.get('/', blog.home)

module.exports = router