
module.exports.home = async (req, res) => {
    try {
        res.render('homepage')
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
}