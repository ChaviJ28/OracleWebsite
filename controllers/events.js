var express = require('express');
const Event = require("../models/event");
const bannerdb = require("../models/banner");
const multer = require('multer');
const fs = require('fs')
var showdown = require('showdown');
converter = new showdown.Converter();

const imagePath = __dirname + '/../public/';



module.exports.all = async (req, res) => {
    var currentEvent = [];
    var previousEvent = [];
    var events = await Event.find({});
    events.forEach(function (event, i) {
        console.log(event.date, Date.now());
        if (event.date < Date.now()) {
            previousEvent.push(event);
        } else {
            currentEvent.push(event);
        }
    })
    res.render('events', { currentEvent, previousEvent })
}


// module.exports.viewOne = async (req, res) => {
//     const event = await Event.findById(req.params.id, err);
//     if (!event) {
//        console.log(err);
//     }
//     res.render('singleEvent', { event });
// }

module.exports.newEvent = (req, res) => {
    isLoggedIn(req, res, async () => {

        res.render('newEvent');
    })
}

module.exports.one = async (req, res) => {
    const event = await Event.findOne({ _id: req.params.id });
    console.log(event);
    res.render('singleEvent', { event });
}


module.exports.updateEvent = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const event = await Event.findById(req.params.id);
        var year = event.date.getFullYear()
        var month = event.date.getMonth() + 1
        var day = event.date.getDate()
        if (month < 10) { month = '0' + month.toString() }
        var newDate = (year + '-' + month + '-' + day)
        res.render('updateEvent', { event, newDate });
    })
}

module.exports.admin = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const events = await Event.find({})
        res.render('eventsAdmin', { events });
    })
}



module.exports.new = async (req, res, next) => {
    isLoggedIn(req, res, async () => {

        console.log(req.body)
        console.log(req.file)
        var big = false;
        if (req.body.big) {
            big = true;
        }

        if (req.file) {
            if (req.file) {
                const newEvent = new Event({

                    title: req.body.title,
                    date: req.body.date,
                    description: req.body.description,
                    smallDes: req.body.smallDes,
                    imageUrl: '/uploads/images/' + req.file.filename,
                    timeFrom: req.body.from,
                    timeTo: req.body.to,
                    big: big,
                    location: req.body.location,
                    linkgoogle: req.body.google,

                });
                console.log(newEvent);

                await newEvent.save();
                res.redirect('/events/admin');
            }
            else throw 'error';
        }
    })

}

module.exports.update = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const id = req.params.id;
        var imageUrl = req.body.oldImage;

        var big = false;
        if (req.body.big) {
            big = true;
        }

        var imgUpdate = false;
        if (req.body.updateImage) {
            imgUpdate = true;
        }

        console.log(req.body);

        if (imgUpdate == true) {
            fs.unlinkSync(imagePath + imageUrl)
            imageUrl = '/uploads/images/' + req.file.filename;

        }
        const event = await Event.findByIdAndUpdate(id, {

            title: req.body.title,
            description: req.body.description,
            smallDes: req.body.smallDes,
            timeFrom: req.body.from,
            timeTo: req.body.to,
            big: big,
            location: req.body.location,
            linkgoogle: req.body.google,
            imageUrl: imageUrl,
            date: req.body.date
        });
        await event.save();
        console.log(event);


        res.redirect('/events/admin');
    })
}


module.exports.delete = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const id = req.params.id;
        const event = await Event.findById(id);
        fs.unlinkSync(imagePath + event.imageUrl);
        await Event.findByIdAndDelete(id);
        res.redirect('/events/admin');
    })
}

module.exports.allbanners = async (req, res) => {
    isLoggedIn(req, res, async () => {

        var banners = await bannerdb.find({}).sort({ _id: -1 });
        res.render('bannerAdmin', { banners })
    })
}

module.exports.newbanner = async (req, res) => {
    isLoggedIn(req, res, async () => {

        res.render('newbanner')
    })
}

module.exports.addbanner = async (req, res, next) => {
    isLoggedIn(req, res, async () => {

        if (req.file) {
            if (req.file) {
                const newBanner = new bannerdb({
                    url: '/uploads/images/' + req.file.filename,
                    link: req.body.link,
                    active: false
                });
                console.log(newBanner);

                await newBanner.save();
                res.redirect('/events/banners');
            }
            else throw 'error';
        }
    })
}

module.exports.updatebannerform = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const banner = await bannerdb.findById(req.params.id);
        res.render('updateBanner', { banner })
    })
}

module.exports.updatebanner = async (req, res, next) => {
    isLoggedIn(req, res, async () => {

        const id = req.params.id;
        var imageUrl = req.body.oldImage;

        var imgUpdate = false;
        if (req.body.updateImage) {
            imgUpdate = true;
        }

        if (imgUpdate == true) {
            fs.unlinkSync(imagePath + imageUrl)
            imageUrl = '/uploads/images/' + req.file.filename;
        }

        const banner = await bannerdb.findByIdAndUpdate(id, {
            link: req.body.link,
            url: imageUrl,
        });
        await banner.save();
        console.log(banner);

        res.redirect('/events/banners');
    })
}

module.exports.deletebanner = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const banner = await bannerdb.findById(req.params.id);
        fs.unlinkSync(imagePath + banner.url);
        await bannerdb.findByIdAndDelete(req.params.id);
        res.redirect('/events/banners');
    })
}

module.exports.togglebanner = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const banner = await bannerdb.findById(req.params.id);
        banner.active = !banner.active;
        banner.save((e, b) => {
            if (!e) {
                res.redirect('/events/banners');
            }
            else throw 'error'
        })
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}