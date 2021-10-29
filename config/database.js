mongoose = require('mongoose');
// 
mongoUrl = "mongodb://localhost:27017/oracledb"; 
const options = {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(mongoUrl, options)
    .then(() => console.log("connection successful"))
    .catch(err => console.log(err))

module.exports = mongoose