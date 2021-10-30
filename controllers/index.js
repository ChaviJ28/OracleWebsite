
module.exports.home = async (req, res) => {
    try {
        res.render('homepage')
    } catch (err) {
        console.log(err)
    }
}