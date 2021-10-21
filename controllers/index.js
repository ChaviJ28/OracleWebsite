
module.exports.home = async (req, res) => {
    try {
        res.send('Hi Bitch')
    } catch (err) {
        console.log(err)
    }
}