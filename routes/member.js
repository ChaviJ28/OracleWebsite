const express = require('express')
const router = express.Router();
const member = require('../controllers/member');



router.post('/', member.new);
router.post('/:id/delete', member.delete)
router.get('/admin', member.admin);
router.get('/view/:id', member.view);
router.get('/mail', member.mail);
router.post('/mail', member.mailMember);
router.get('/accept', member.accform);
router.post('/accept', member.acceptMembers);
router.get('/download', member.excel);

module.exports = router