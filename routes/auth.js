
const express = require('express')
const router = express.Router();
const auth = require('../controllers/auth');
const passport = require('passport');



//Home
router.get('/login', auth.loginform)
// router.post('/login', auth.login)
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    req.flash('success', "Welcome " + req.body.username);
    res.redirect('/dash');
});
router.get('/register', auth.registerform)
router.post('/register', auth.register)
router.get('/dash', auth.dash)
// router.get('/admin', blog.admin)
// router.get('/:id/update', blog.updateblog)
// router.post('/:id/update', upload.single('photo'), blog.update)
// router.post('/:id/delete', blog.delete)

// //API
// router.get('/api/get', blog.get)


module.exports = router