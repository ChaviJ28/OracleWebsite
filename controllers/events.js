var express = require('express');
const Event = require("../models/event");


module.exports.home = async (req, res) => {
    try {
        res.render('events');
    } catch (err) {
        console.log(err)
    }
}