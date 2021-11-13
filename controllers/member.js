var express = require('express');
const Member = require("../models/member");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.com',
    port: 465,
    auth: {
        user: "admin@uomoracleclub.org",
        pass: "Uom_oracleclub_450"
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

        const members = await Member.find({})
        res.render('memberAdmin', { members });
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
        res.render('memberMail');
 
}

module.exports.mailMember = async (req, res) => {
    if (req.body.subject && req.body.mail) {
        const members = await Member.find({})
        const mail= req.body.mail;
        const subject = req.body.subject;
        members.forEach(function(member){
            var msg = {
                from: 'admin@uomoracleclub.org',
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
    

}


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}