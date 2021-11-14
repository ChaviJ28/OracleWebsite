var express = require('express');
const Member = require("../models/member");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.com',
    port: 465,
    auth: {
        user: "uomoracleclub@uomoracleclub.org",
        pass: "Uom_oracleclub_400"
    }
})



module.exports.new = async (req, res) => {
    if (req.body.email && req.body.fName && req.body.lName && req.body.faculty && req.body.course) {
        const newMember = new Member({
            email: req.body.email,
            fName: req.body.fName,
            lName: req.body.lName,
            phoneNo: req.body.phoneNo,
            course: req.body.course,
            year: req.body.year,
            faculty: req.body.faculty,
            checked: false
        });
        console.log(newMember);

        await newMember.save();
        req.flash('success', 'You have successfully registered');
        res.redirect('/join');

    } else {
        req.flash('error', 'Please try again later');
    }
}


module.exports.admin = async (req, res) => {
    isLoggedIn(req, res, async () => {
        var members = [];
        var count = 0;
        const mem = await Member.find({})
        mem.forEach(m => {
            if (m.checked) {
                members.push(m)
            } else {
                count++;
            }
        });
        res.render('memberAdmin', { members, count });
    })
}


module.exports.delete = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const id = req.params.id;
        await Member.findByIdAndDelete(id);
        req.flash('success', 'Member Successfully deleted ');
        res.redirect('/member/admin');
    })
}

module.exports.view = async (req, res) => {
    const member = await Member.findById(req.params.id);
    isLoggedIn(req, res, () => {
        res.render('singleMember', { member });
    })
}

module.exports.mail = async (req, res) => {
    isLoggedIn(req, res, () => {

        res.render('memberMail');
    })
}

module.exports.mailMember = async (req, res) => {
    isLoggedIn(req, res, async () => {

        if (req.body.subject && req.body.mail) {
            const members = await Member.find({})
            const mail = req.body.mail;
            const subject = req.body.subject;
            members.forEach(function (member) {
                var msg = {
                    from: 'uomoracleclub@uomoracleclub.org',
                    to: member.email,
                    subject: subject,
                    html: mail
                }
                transporter.sendMail(msg).then(info => {

                });
            });
            req.flash('success', 'Email successfully sent');
            res.redirect('/member/admin');
        }
    })
}

module.exports.accform = async (req, res) => {
    isLoggedIn(req, res, async () => {
        var members = [];
        var wa;
        const mem = await Member.find({})
        mem.forEach(m => {
            if (m.checked == false) {
                members.push(m)
            }
        });

        res.render('memberAccept', { members });
    })
}

module.exports.acceptMembers = async (req, res) => {
    isLoggedIn(req, res, () => {
        console.log(req.body)
        try {
            req.body.forEach(async (id) => {
                var member = await Member.findById(id);
                member.checked = true;
                member.save();
                //send mail
                console.log(member.year)
                console.log(typeof member.year)
                switch (member.year) {
                    case '1': wa = 'https://chat.whatsapp.com/CuAWydqa7tSJBY3kYHrPLF'
                        break;
                    case '2': wa = 'https://chat.whatsapp.com/H6vm3zFudvi7nBuBgMNhi6'
                        break;
                    default: wa = 'https://chat.whatsapp.com/FMRKWyYaNXBJL8jG4HF2P0'
                }
                var msg = {
                    from: 'uomoracleclub@uomoracleclub.org',
                    to: member.email,
                    subject: 'Welcome to Uom Oracle Club',
                    html: wa
                }
                transporter.sendMail(msg).then(info => {

                });
            })
            req.flash('success', 'Email successfully sent');
            res.json('/member/admin');
        } catch (e) {
            res.json(e)
        }

    })
}


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}