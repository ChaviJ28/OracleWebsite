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

//fix
const member = require("../models/member")
router.post('/list/:no', async (req, res) => {
    var members = await member.find({}).sort({ _id: -1 }).limit(req.params.no);
    res.json(members);
})

module.exports = router