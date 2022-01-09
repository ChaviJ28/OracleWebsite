var express = require('express');
const Member = require("../models/member");
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const xl = require('excel4node');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: "oracleclub2020@gmail.com",
        pass: process.env.PASSWORD

    }
})


async function check(umail) {
    var members = await Member.find({}).sort({ _id: -1 });
    var resp = 'ok';
    console.log(umail.toString())
    members.forEach((m) => {
        if (m.email.toString() == umail.toString()) {
            console.log(m.email.toString())
            resp = 'duplicate'
        }
    })
    return resp;
}

module.exports.new = async (req, res) => {
    resp = await check(req.body.email);
    console.log(resp);
    if (resp == 'duplicate') {
        req.flash('error', 'duplicate');
        res.redirect('/join');
    } else {

        if (req.body.email && req.body.fName && req.body.lName && req.body.faculty && req.body.course) {
            const newMember = new Member({
                email: req.body.email,
                studentId: req.body.studId,
                fName: req.body.fName,
                lName: req.body.lName,
                phoneNo: req.body.phoneNo,
                course: req.body.course,
                level: req.body.level,
                year: req.body.year,
                faculty: req.body.faculty,
                checked: false,
                dateFilled: Date.now()
            });
            console.log(newMember);


            await newMember.save();
            req.flash('success', 'You have successfully registered');
            res.redirect('/join');

        } else {
            req.flash('error', 'Please try again later');
            res.redirect('/join');

        }
    }
}


module.exports.admin = async (req, res) => {
    isLoggedIn(req, res, async () => {
        isAdmin(req, res, async () => {

            var members = [];
            var count = 0;
            const mem = await Member.find({})
            mem.forEach(m => {
                if (m.checked) {
                    members.push(m);
                } else {
                    count++;
                }
            });
            res.render('memberAdmin', { members, count });
        })
    })
}


module.exports.delete = async (req, res) => {
    isLoggedIn(req, res, async () => {
        isAdmin(req, res, async () => {

            const id = req.params.id;
            await Member.findByIdAndDelete(id);
            req.flash('success', 'Member Successfully deleted ');
            res.redirect('/member/admin');
        })
    })
}

module.exports.view = async (req, res) => {
    const member = await Member.findById(req.params.id);
    isLoggedIn(req, res, () => {
        isAdmin(req, res, async () => {

            res.render('singleMember', { member });
        })
    })
}

module.exports.mail = async (req, res) => {
    isLoggedIn(req, res, () => {
        isAdmin(req, res, async () => {

            res.render('memberMail');
        })
    })
}

module.exports.mailMember = async (req, res) => {
    isLoggedIn(req, res, async () => {
        isAdmin(req, res, async () => {

            //IF ACCEPTED MEMBER THEN SEND MAIL
            try {
                var arr = [];
                if (req.body.subject && req.body.mail) {
                    const members = await Member.find({})
                    const mail = req.body.mail;
                    const subject = req.body.subject;
                    members.forEach(function (member) {
                        if (member.checked == true) {
                            arr.push(member.email);
                        }
                    });
                    var msg = {
                        from: {
                            address: 'oracleclub2020@gmail.com',
                            name: 'Uom Oracle Club'
                        },
                        to: arr,
                        subject: subject,
                        html: mail
                    }
                    transporter.sendMail(msg).then(info => {

                        if (info.rejected.length > 0) {
                            req.flash('error', info.rejected + ' mails not found');
                            res.redirect('/member/admin');
                        } else {
                            req.flash('success', 'Email successfully sent');
                            res.redirect('/member/admin');
                        }
                    });
                }
            } catch (e) {
                res.json(e)
            }

        })
    })
}

module.exports.accform = async (req, res) => {
    isLoggedIn(req, res, async () => {
        isAdmin(req, res, async () => {

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
    })
}

module.exports.acceptMembers = async (req, res) => {
    isLoggedIn(req, res, () => {
        isAdmin(req, res, async () => {

            var arr = [];
            const filePath = path.join(__dirname, '../views/mail.html');
            const source = fs.readFileSync(filePath, 'utf-8').toString();
            const template = handlebars.compile(source);
            try {
                req.body.forEach(async (id) => {
                    var member = await Member.findById(id);
                    member.checked = true;
                    member.dateAccepted = Date.now();
                    member.save();
                    //send mail
                    switch (member.year) {
                        case '1': wa = 'https://chat.whatsapp.com/CuAWydqa7tSJBY3kYHrPLF'
                            break;
                        case '2': wa = 'https://chat.whatsapp.com/H6vm3zFudvi7nBuBgMNhi6'
                            break;
                        default: wa = 'https://chat.whatsapp.com/FMRKWyYaNXBJL8jG4HF2P0'
                    }
                    const replacements = {
                        whatsapp: wa
                    };
                    const htmlToSend = template(replacements);
                    const mailOptions = {
                        from: {
                            address: 'oracleclub2020@gmail.com',
                            name: 'Uom Oracle Club'
                        },
                        to: member.email,
                        subject: 'Welcome to Uom Oracle Club',
                        html: htmlToSend
                    };
                    const info = await transporter.sendMail(mailOptions);
                    if (info.rejected.length > 0) {
                        arr.push(info.rejected[0])
                    }
                })
                if (arr.length > 0) {
                    req.flash('error', arr + ' mails not found');
                    res.json(arr);

                } else {
                    req.flash('success', 'Email successfully sent');
                    res.json('/member/admin');
                }
            } catch (e) {
                res.json(e)
            }

        })
    })
}


module.exports.excel = async (req, res) => {
    isLoggedIn(req, res, async () => {
        isAdmin(req, res, async () => {
            var members = await Member.find({}).sort({ _id: -1 });
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Members');
            var ws1 = wb.addWorksheet('New');
            var style = wb.createStyle({
                font: {
                    color: '#000000',
                    size: 10,
                }
            });
            var headstyle = wb.createStyle({
                font: {
                    color: '#000000',
                    size: 11,
                    bold: true
                }
            });

            ws.cell(2, 1).string('No.').style(headstyle)
            ws.cell(2, 2).string('StudentId').style(headstyle)
            ws.cell(2, 3).string('Email').style(headstyle)
            ws.cell(2, 4).string('First').style(headstyle)
            ws.cell(2, 5).string('Last').style(headstyle)
            ws.cell(2, 6).string('Phone').style(headstyle)
            ws.cell(2, 7).string('Course').style(headstyle)
            ws.cell(2, 8).string('Level').style(headstyle)
            ws.cell(2, 9).string('Year').style(headstyle)
            ws.cell(2, 10).string('Faculty').style(headstyle)
            ws.cell(2, 10).string('Date Filled Form').style(headstyle)
            ws.cell(2, 10).string('Date Accepted').style(headstyle)

            ws1.cell(2, 1).string('No.').style(headstyle)
            ws1.cell(2, 2).string('StudentId').style(headstyle)
            ws1.cell(2, 3).string('Email').style(headstyle)
            ws1.cell(2, 4).string('First').style(headstyle)
            ws1.cell(2, 5).string('Last').style(headstyle)
            ws1.cell(2, 6).string('Phone').style(headstyle)
            ws1.cell(2, 7).string('Course').style(headstyle)
            ws1.cell(2, 8).string('Level').style(headstyle)
            ws1.cell(2, 9).string('Year').style(headstyle)
            ws1.cell(2, 10).string('Faculty').style(headstyle)
            ws1.cell(2, 10).string('Date Filled Form').style(headstyle)

            var titlestyle = wb.createStyle({
                font: {
                    color: '#000000',
                    size: 13,
                    bold: true
                },
                fill: {
                    type: "pattern",
                    patternType: "solid",
                    bgColor: "#33FF35",
                    fgColor: "#33FF35"
                }
            });
            ws.cell(1, 6).string('Accepted Members').style(titlestyle)
            ws.cell(1, 7).string().style(titlestyle)
            ws1.cell(1, 5).string('Requesting To Join Members').style(titlestyle)
            ws1.cell(1, 6).string().style(titlestyle)
            ws1.cell(1, 7).string().style(titlestyle)

            var i = 1; var j = 1;
            members.forEach((mem) => {
                if (mem.checked == true) {
                    ws.cell(i + 2, 1).string(i.toString()).style(style)
                    ws.cell(i + 2, 2).string(mem.studentId).style(style)
                    ws.cell(i + 2, 3).string(mem.email).style(style)
                    ws.cell(i + 2, 4).string(mem.fName).style(style)
                    ws.cell(i + 2, 5).string(mem.lName).style(style)
                    ws.cell(i + 2, 6).string(mem.phoneNo).style(style)
                    ws.cell(i + 2, 7).string(mem.course).style(style)
                    ws.cell(i + 2, 8).string(mem.level).style(style)
                    ws.cell(i + 2, 9).string(mem.year).style(style)
                    ws.cell(i + 2, 10).string(mem.faculty).style(style)
                    ws.cell(i + 2, 10).string(mem.dateFilled).style(style)
                    ws.cell(i + 2, 10).string(mem.dateAccepted).style(style)
                    i++
                } else {
                    ws1.cell(j + 2, 1).string(i.toString()).style(style)
                    ws1.cell(j + 2, 2).string(mem.studentId).style(style)
                    ws1.cell(j + 2, 3).string(mem.email).style(style)
                    ws1.cell(j + 2, 4).string(mem.fName).style(style)
                    ws1.cell(j + 2, 5).string(mem.lName).style(style)
                    ws1.cell(j + 2, 6).string(mem.phoneNo).style(style)
                    ws1.cell(j + 2, 7).string(mem.course).style(style)
                    ws1.cell(j + 2, 8).string(mem.level).style(style)
                    ws1.cell(j + 2, 9).string(mem.year).style(style)
                    ws1.cell(j + 2, 10).string(mem.faculty).style(style)
                    ws1.cell(j + 2, 10).string(mem.dateFilled).style(style)
                    j++
                }
            })
            var time = Date.now();
            var str = "Oracle_" + new Date(time).toLocaleDateString() + ".xlsx";
            wb.write(str, res);
        })
    })
}



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.user && req.user.admin == true) {
        return next();
    }
    res.redirect('/dash');
}