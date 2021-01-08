const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Group = require('../models/group.model');
const Event = require('../models/event.model');



var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log(file.fieldname);
        callback(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({ storage: storage }).single('image');

router.post('/upload', function (req, res) {

    try {
        arr = '';


    }
     catch (err) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
});