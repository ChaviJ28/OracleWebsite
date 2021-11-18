
const express = require('express')
const router = express.Router();
const auth = require('../controllers/auth');
const passport = require('passport');


//Home
router.get('/login', auth.loginform)
router.get('/logout', auth.logout)
router.get('/register', auth.registerform)
router.post('/register', auth.register)
router.post('/users/:id/toggle-admin', auth.toggleAdmin)
router.get('/dash', auth.dash)
router.get('/users', auth.users)
router.get('/users/:id/update', auth.userone)
router.post('/users/:id/update', auth.updateuser)
router.post('/users/:id/reset', auth.reset)
router.get('/users/:id/change', auth.changeform)
router.post('/users/:id/change', auth.change)
router.post('/users/:id/delete', auth.delete)

// router.post('/login', auth.login)
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), auth.login);



module.exports = router