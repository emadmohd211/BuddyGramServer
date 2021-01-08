const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Group=require('../models/group.model');

router.post('/add', function(req, res) {
	Group.findOne({name: req.body.name, user_id: req.decoded._id}).exec()
	.then(function(fGroup){
		if(fGroup===null)
		{
			var group=new Group({
				_id: new  mongoose.Types.ObjectId(),
				name: req.body.name,
				user_id: req.decoded._id
			});
			group.save().then(function(result) {
				console.log(result);
				res.status(200).json({
				success:true,
				message: 'New group has been created'
			});
			}).catch(error => {
				res.status(500).json({
					success:false,
					message: error
				});
			});
		}
		else
		{
			res.status(500).json({
				success:false,
				message:'The group already exist'
			});
		}
	}).catch(error => {
		  res.status(500).json({
			  success:false,
			  message: error
		  });
	   });
});
router.post('/update', function(req, res) {
	var userId=req.decoded._id;
	var query={user_id:userId};
	var group= new Group({
		name: req.body.name,
		user_id: req.decoded._id,
		connectionId: req.body.connectionId
	});

	Group.findOneAndUpdate(query, group , {upsert:true}, function(err, doc){
		if (err) 
		{
			res.status(500).json({
			  success:false,
			  message: err
			});
		}
		else
		{
			res.status(200).json({
			  success:true,
			  message: 'The Group Has been updated'
			});
		}
	});	
	
});
router.post('/getGroups',function(req,res){
	Group.find({user_id: req.decoded._id}, function(err, groups) {
		var groupMap = [];

		groups.forEach(function(group) {
		  groupMap.push(group);
		});
		var retValue=[];
		for(var i=0;i<groupMap.length;i++)
		{
			console.log(groupMap[i]);
			var tempRetVal={
				name: groupMap[i].name,
				membernum: groupMap[i].connectionId.length
			};
			retValue.push(tempRetVal);
		}
		res.status(200).json({
				success: true,
				groups: retValue
			});
		//console.log(groupMap);
	});
});
router.post('/getUsers', function(req, res) {
	Group.findOne({name: req.body.name, user_id: req.decoded._id}).exec()
	.then(function(fGroup){
		if(fGroup===null)
		{
			res.status(204).json({
			  success:false,
			  message: 'There is no connection'
			});
		}
		else
		{
			res.status(200).json({
				success: true,
				connectionNumber: fGroup.connectionId.length,
				connections: fGroup.connectionId
			});
		}
		
	}).catch(error => {
		  res.status(500).json({
			  success:false,
			  message: error
		  });
	   });
	
});

module.exports = router;