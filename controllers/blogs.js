
module.exports.home = async (req, res) => {
    try {
        res.send('Hi Blog Bitch')
    } catch (err) {
        console.log(err)
    }
}