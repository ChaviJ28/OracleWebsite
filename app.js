var express = require('express');
var app = express();
var session = require('express-session');
var bodyparser = require('body-parser');
var flash = require('connect-flash');
var ejs = require('ejs');
var methodOverride = require('method-override');

app.use(bodyparser.json())
.use(bodyparser.urlencoded({
    extended: true
}));
const mongoose = require("./config/database.js");

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(flash());

// app.use(favicon("./public/images/favicon.ico")); 

app.use(session({
    secret: "OracleWebsite",
    resave: false,
    rolling: true,
    saveUninitialized: false
}));


//flash, user setup
app.use(async function (req, res, next) {
    // res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//define routes
const indexRoutes = require('./routes/index.js')
const blogRoutes = require('./routes/blogs.js')
const eventRoutes = require('./routes/events.js')
// const aboutRoutes = require('./routes/about.js')

//use routes
app.use('/', indexRoutes);
app.use('/blogs', blogRoutes);
app.use('/events', eventRoutes);
// app.use('/about', aboutRoutes);


var port = 3000
app.listen(port, () => {
    console.log('listening on port' + port)
})