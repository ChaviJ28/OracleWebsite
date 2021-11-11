var express = require('express');
const blogDb = require("../models/blog");
const multer = require('multer');
const fs = require('fs')
var showdown = require('showdown');
converter = new showdown.Converter();

const imagePath = __dirname + '/../public/';



module.exports.all = async (req, res) => {
    //  get 4 latest
    res.render('blogs', { next: 0 })
}

module.exports.get = async (req, res) => {
    var blogs = await blogDb.find({}).sort({ _id: -1 });
    var next = parseInt(req.query.next)
    blogs = blogs.slice(next, next + 6);
    var obj = {
        next: next + 6,
        blogs: blogs
    }
    res.json(obj)
}

module.exports.newblog = (req, res) => {
    isLoggedIn(req, res, () => {
        res.render('newblog');
    })
}

module.exports.one = async (req, res) => {
    const blog = await blogDb.findOne({ _id: req.params.id });
    res.render('singleBlog', { blog });
}


module.exports.updateblog = async (req, res) => {
    const blog = await blogDb.findById(req.params.id);

    isLoggedIn(req, res, () => {

        var year = blog.date.getFullYear()
        var month = blog.date.getMonth() + 1
        var day = blog.date.getDate()
        if (month < 10) { month = '0' + month.toString() }
        var newDate = (year + '-' + month + '-' + day)
        res.render('updateBlog', { blog, newDate });
    })
}

module.exports.admin = async (req, res) => {
    var blogs = await blogDb.find({}).sort({ _id: -1 });
    isLoggedIn(req, res, () => {
        res.render('blogAdmin', { blogs });
    })
}



module.exports.new = async (req, res, next) => {
    isLoggedIn(req, res, async () => {

        if (req.file) {
            const newblog = new blogDb({

                title: req.body.title,
                date: Date.now(),
                description: req.body.description,
                imageUrl: '/uploads/images/' + req.file.filename,
                author: req.body.author,
                catch: req.body.catch

            });
            console.log(newblog);

            await newblog.save();
            res.redirect('/blogs/admin');

        }
        else throw 'error';
    })

}

module.exports.update = async (req, res) => {
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
        const blog = await blogDb.findByIdAndUpdate(id, {

            title: req.body.title,
            date: Date.now(),
            description: req.body.description,
            imageUrl: imageUrl,
            author: req.body.author,
            catch: req.body.catch
        });
        await blog.save();


        res.redirect('/blogs/admin');
    })
}


module.exports.delete = async (req, res) => {
    isLoggedIn(req, res, async () => {

        const id = req.params.id;
        const blog = await blogDb.findById(id);
        fs.unlinkSync(imagePath + blog.imageUrl);
        await blogDb.findByIdAndDelete(id);
        res.redirect('/blogs/admin');
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}