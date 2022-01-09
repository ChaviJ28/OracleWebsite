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

//fix to fetch
const memberdb = require("../models/member")
router.get('/list/:no', async (req, res) => {
    var no = parseInt(req.params.no);
    var members = await memberdb.find({}).limit(no).sort({ _id: -1 });
    res.json({
        no: req.params.no,
        mem: members
    });
})

// all to false
router.get('/list/', async (req, res) => {
    var members = await memberdb.find({}).sort({ _id: -1 });
    members.forEach((m) => {
        m.checked = false;
        m.save()
    })
    res.json(members);

})

module.exports = router