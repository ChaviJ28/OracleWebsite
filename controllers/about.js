
module.exports.home = async (req, res) => {
    try {
        res.render('about')
    } catch (err) {
        console.log(err)
    }
}