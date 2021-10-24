
const express = require('express')
const router = express.Router();
const event = require('../controllers/events');
const multer = require('multer');
const upload = multer({dest: __dirname + '/../public/uploads/images'})


//Home
router.get('/', event.all)
router.get('/view/:id/', event.one)
router.post('/',upload.single('photo'), event.new)
router.get('/new', event.newEvent)
router.get('/admin', event.admin)
router.get('/:id/update', event.updateEvent)
router.post('/:id/update',upload.single('photo'), event.update)
router.post('/:id/delete', event.delete)

module.exports = router