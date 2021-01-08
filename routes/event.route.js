const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Group = require('../models/group.model');
const Event = require('../models/event.model');

router.post('/create', function (req, res) {
    try {
        var userId = req.body.userid;
        var temp = req.body.members;
        var members = [];
        for (var i=0; i < temp.length; i++) {
            var tempMember = {
                user_id: temp[i],
                status: 0
            };
            members.push(tempMember);
        }
        var event = new Event({
            _id: new mongoose.Types.ObjectId(),
            user_id: userId,
            ownerName: req.body.ownerName,
            title: req.body.eventName,
            venue: req.body.venue,
            dateTime: req.body.datetime,
            members: members
        });
        event.save().then(function (result) {
            console.log(result);
            res.status(200).json({
                success: true,
                message: 'New event has been created'
            });
        }).catch(error => {
            res.status(500).json({
                success: false,
                message: error
            });
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
});


router.post('/getEvents', function (req, res) {
    try {
        var userId = req.body.user_id;
        Event.find({
            'members.user_id': userId
        }, function (err, events) {
            var eventMap = [];
            events.forEach(function (event) {
                eventMap.push(event);
            });

          
            var retValue = [];
            for (var i = 0; i < eventMap.length; i++) {
                var tempRet = {
                    title: eventMap[i].title,
                    dateTime: eventMap[i].dateTime,
                    venue: eventMap[i].venue,
                    eventId: eventMap[i]._id,
                    ownerName: eventMap[i].ownerName
                };
                retValue.push(tempRet);
            }
            res.status(200).json({
                success: true,
                event: retValue
            });
  
    

        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err
        });
    }

});
router.post('/getInvitedEvent', function (req, res) {

});
router.post('/getEventDetail', function (req, res) {
});
module.exports = router;