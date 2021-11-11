const blogDb = require("../models/blog");
const bannerdb = require("../models/banner");

module.exports.home = async (req, res) => {
    try {
        var blogs = await blogDb.find({}).sort({ _id: -1 }).limit(3);
        var banners = await bannerdb.find({}).sort({ _id: -1 });
        var banner = [];
        banners.forEach((b) => {
            if (b.active == true) {
                banner.push(b)
            }
        })
        res.render('homepage', { blogs, banner })
        // res.json({ blogs, banner })
    } catch (err) {
        console.log(err)
    }
}

module.exports.about = async (req, res) => {
    try {
        res.render('aboutus')
    } catch (err) {
        console.log(err)
    }
    for (let index = 0; index < array.length; index++) {
        const element = array[index];

    }
}

