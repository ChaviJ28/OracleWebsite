const express = require('express')
const router = express.Router();
const member = require('../controllers/member');



router.post('/', member.new);
router.post('/:id/delete', member.delete)
router.get('/admin', member.admin);
router.get('/view/:id', member.view);

module.exports = router