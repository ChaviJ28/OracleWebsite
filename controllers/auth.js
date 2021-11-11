var express = require('express');
const passport = require('passport');
const userdb = require("../models/user");

module.exports.loginform = async (req, res) => {
    res.render('login')
}

module.exports.registerform = async (req, res) => {
    // isLoggedIn(req, res, () => {
    res.render('register')
    // })
}

module.exports.login = async (req, res) => {
    res.redirect('/dash')
}

module.exports.logout = async (req, res) => {
    req.logout();
    res.redirect('/login');
}

module.exports.register = async (req, res) => {
    // isLoggedIn(req, res, () => {
    let nUser = new userdb({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email
    });
    userdb.register(nUser, 'default123', (err, user) => {
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
                    res.redirect('/dash')
                }
            })
        }
    })
    // })

}

module.exports.dash = async (req, res) => {
    isLoggedIn(req, res, () => {
        res.render('dashboard')
    })
}

module.exports.users = async (req, res) => {
    isLoggedIn(req, res, async () => {
        var users = await userdb.find({}).sort({ _id: -1 });
        res.render('users', { users })
    })
}

module.exports.userone = async (req, res) => {
    const user = await userdb.findById(req.params.id);
    isLoggedIn(req, res, () => {
        res.render('updateUser', { user });
    })
}

module.exports.updateuser = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const id = req.params.id;
        const user = await userdb.findByIdAndUpdate(id, {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email
        });
        await user.save();
        res.redirect('/users');
    })
}

module.exports.reset = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const id = req.params.id;
        const user = await userdb.findById(req.params.id);
        user.setPassword('default123', async (e, u) => {
            if (!e) {
                await u.save();
                res.redirect('/users')
            }
            else throw 'error'
        })
    })
}

module.exports.changeform = async (req, res) => {
    const user = await userdb.findById(req.params.id);
    isLoggedIn(req, res, () => {
        res.render('changepassword', { user });
    })
}

module.exports.change = async (req, res) => {
    const user = await userdb.findById(req.params.id);
    isLoggedIn(req, res, () => {
        if (req.body.pass == req.body.pass1) {
            user.changePassword(req.body.oldpass, req.body.pass, (e, u) => {
                if (!e) {
                    req.flash('success', 'password changed')
                    res.redirect('/logout')
                } else {
                    req.flash('error', 'Retry again')
                    res.redirect('/users/' + user.id + '/change')
                }
            })
        } else {
            req.flash('error', 'passwords do not match')
            res.redirect('/users/' + user.id + '/change')
        }
    })
}

module.exports.delete = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const id = req.params.id;
        const user = await userdb.findById(id);
        await userdb.findByIdAndDelete(id);
        res.redirect('/users');
    })
}


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}