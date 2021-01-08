const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

router.post('/signup', function(req, res) {
   bcrypt.hash(req.body.password, 10, function(err, hash){
      if(err && req.body.logintype=="email") {
         return res.status(500).json({
            error: err
         });
      }
      else {
		  var user;
		  var success=false;
		  if(req.body.logintype=="email" && req.body.email.length>3)
		  {
			  user = new User({
				_id: new  mongoose.Types.ObjectId(),
				email: req.body.email,
				password: hash,
				logintype: req.body.logintype,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				phoneNumber: req.body.phoneNumber,
			 });
			 success=true;
		  }
		  else if(req.body.logintype=="fb" && req.body.facebookId!=null && req.body.facebookToken!=null)
		  {
			  user = new User({
				_id: new  mongoose.Types.ObjectId(),
				email: req.body.email,
				password: hash,
				logintype: req.body.logintype,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				phoneNumber: req.body.phoneNumber,
				facebookId:req.body.facebookId,
				facebookToken:req.body.facebookToken
			 });
			 success=true;
		  }
		  if(success)
		  {
			 user.save().then(function(result) {
				console.log(result);
				res.status(200).json({
				   success: 'New user has been created'
				});
			 }).catch(error => {
				res.status(500).json({
				   error: err
				});
			 });
		  }
		  else
		  {
			  res.status(500).json({
				  error: 'Some variable is missing!'
			  });
		  }
      }
   });
});

router.post('/signin', function(req, res){
	console.log(req.body);
	if(req.body.logintype=='email')
	{
	   User.findOne({email: req.body.email, logintype:req.body.logintype})
	   .exec()
	   .then(function(user) {
		  bcrypt.compare(req.body.password, user.password, function(err, result){
			 if(err) {
				return res.status(401).json({
				   failed: 'Unauthorized Access'
				});
			 }
			if(result) {
			   const JWTToken = jwt.sign({
					email: user.email,
					_id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					phoneNumber: user.phoneNumber
				  },
				  'secret',
				   {
					 expiresIn: '2h'
				   });
				   return res.status(200).json({
					 success: 'Welcome to the Buddygram',
					   token: JWTToken,
					   user_id: user._id,
					   firstName: user.firstName,
					   lastName: user.lastName,
					   email: user.email,
					   phoneNumber: user.phoneNumber

				   });
			  }
			 return res.status(401).json({
				failed: 'Unauthorized Access'
			 });
		  });
	   })
	   .catch(error => {
		  res.status(500).json({
			 error: error
		  });
	   });
	}
	else if(req.body.logintype=='fb')
	{
		facebookLogin(req,function(success,code,msg){
			if(success==true)
			{
				   return res.status(200).json({
					success: 'Welcome to the CatchUp',
					token: msg
				});
			}
			else
			{
				 return res.status(code).json({
					failed: msg
				});
			}
		});
		
	}	
});
module.exports = router;
function facebookLogin(req,callback)
{
	var failed=false;
	User.findOne({facebookId: req.body.facebookId})
	   .exec()
	   .then(function(user) {
		   console.log('here');
		   console.log(user);
		   
		   if(user!=null)
		   {
			   console.log('found user');
				getLoginDetails(req.body.facebookToken, function(is_valid, Token_id){
				is_valid=true;
				 if(is_valid==false /*|| Token_id!= req.body.facebookId*/) {
					 callback(false,401,'Unauthorized Access');
				 }
				if(is_valid) {
				   var email_='';
				   if(user.email!=null)
					   email_=user.email;
				   const JWTToken = jwt.sign({
						email: email_,
						_id: user._id,
						firstName: user.firstName,
						lastName: user.lastName,
						phoneNumber: user.phoneNumber,
						facebookId: user.facebookId,
						facebookToken: user.facebookToken
					  },
					  'secret',
					   {
						 expiresIn: '2h'
					   });
					   callback(true,200,JWTToken);
				  }
				  else
				  {
					  callback(false,401,'Unauthorized Access');
				  }
			  });
		   }
		   else
		   {
			console.log('user not found');
			facebookbooksignup(req,callback);
		   }
	   })
	   .catch(error => {
			facebookbooksignup(req,callback);
	   });
	   
}
function facebookbooksignup(req,callback)
{
	console.log('sing up');
			var user = new User({
				_id: new  mongoose.Types.ObjectId(),
				email: req.body.email,
				logintype: req.body.logintype,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				phoneNumber: req.body.phoneNumber,
				facebookId:req.body.facebookId,
				facebookToken:req.body.facebookToken
			});
			user.save().then(function(result) {
				console.log(result);
				facebookLogin(req,callback);
			 }).catch(error => {
				
			 });
}
function getLoginDetails(facebookToken, callback) {
	var http = require('http');
	var _path='/me?accessToken='+facebookToken;
	return http.get({host:'graph.facebook.com',path:_path}, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
			 console.log(body);	
        });
        response.on('end', function() {
            var parsed = JSON.parse(body);
			 console.log(body);
			if(parsed.data!=null && parsed.data.is_valid!=null && parsed.data.user_id!=null)
				callback(parsed.data.is_valid,parsed.data.user_id);
			else
				callback(false,'');
		});
	});
}

