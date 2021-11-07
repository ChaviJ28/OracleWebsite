var express = require('express');
const passport = require('passport');
const userdb = require("../models/user");

module.exports.loginform = async (req, res) => {
    res.render('login')
}

module.exports.registerform = async (req, res) => {
    res.render('register')
}

module.exports.login = async (req, res) => {
    //  use real auth
    // passport.authenticate('local', (err, user, info) => {
    //     console.log('sdf')

    //     if (err || !user) {
    //         req.flash("error", "Authentication error, please contact administrator !");
    //         res.redirect('/login')
    //     } else {
    //         req.login(user, (err) => {
    //             if (err) {
    //                 req.flash("error", "Something went wrong, please try again !");
    //                 res.redirect('/login')
    //             } else {
    //                 console.log('sdfggg')
    //                 req.flash('success', "Welcome back" + req.body.username);
    //                 res.redirect('/dash');
    //             }
    //         })
    //     }
    // })
}

module.exports.register = async (req, res) => {
    console.log(req.body)
    if (req.body.pass != req.body.pass1) {
        req.flash('error', 'Passwords, does not match, please try again');
        res.redirect('/register');
    } else {
        let nUser = new userdb({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email
        });
        userdb.register(nUser, req.body.pass, (err, user) => {
            if (err) {
                req.flash("error", "Something went wrong, please try again !");
                res.redirect("/register");
            } else {
                //send mail ?
                req.login(nUser, (err) => {
                    if (err) {
                        req.flash('success', 'Accont created, please login ')
                        res.redirect('/login');
                    } else {
                        req.flash('success', "Welcome " + req.body.username + " to the uom Oracle Club website's dashboard")
                        res.redirect('/dash')
                    }
                })
            }
        })
    }

}

module.exports.dash = async (req, res) => {
    isLoggedIn(req, res, () => {
        res.render('dashboard')
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}