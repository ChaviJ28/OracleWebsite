
const express = require('express')
const router = express.Router();
const blog = require('../controllers/blogs');
const multer = require('multer');
const upload = multer({ dest: __dirname + '/../public/uploads/images' })


//Home
router.get('/', blog.all)
router.get('/view/:id/', blog.one)
router.post('/', upload.single('photo'), blog.new)
router.get('/new', blog.newblog)
router.get('/admin', blog.admin)
router.get('/:id/update', blog.updateblog)
router.post('/:id/update', upload.single('photo'), blog.update)
router.post('/:id/delete', blog.delete)

//API
router.get('/api/get', blog.get)


module.exports = router