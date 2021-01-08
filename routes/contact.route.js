const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User_ = require('../models/user.model');
const Contact = require('../models/contact.model');
const Connections_ = require('../models/connection.model');
var defImage = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAB6VBMVEUAAABEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBEREBERED8iQ35iA7qghLogRNEREBEREBERED1hg / 8iQ38iQ38iQ36iA7qghLkgBS3byBEREBEREBEREDjgBTpghLtgxHyhRD0hg/7iA38iQ38iQ1EREBEREBERED8iQ36iA38iQ38iQ1EREBEREBERED8iQ38iQ36iA7ifxSkaCVEREBEREBEREDvhBHrgxL3hw78iQ30hg/8iQ38iQ3NeBr6iA2fZiflgBPwhBDgfhXsgxHtgxH2hw / 4iA7xhRD8iQ3hfxTuhBHafBbpghLvhBDXexf5iA7mgRP6iA7DdB3whRDngROlaCX6iA7ReRn6iA3kgBT4hw7rgxL5iA76iA7dfRbwhRDyhRDpghLuhBHngRPvhBG+ch76iA76iA31hg / gfxXrgxLyhRD6iA70hg / xhRDdfRb6iA3tgxH6iA77iQ3Yexf7iQ3xhRD4iA75iA75iA74iA77iQ3SeRnvhBDxhRD7iQ38iQ37iQ32hw / 1hw/7iQ31hg/0hg / 0hg/zhg/7iQ37iA3zhg / yhRD6iA3yhRDxhRD7iQ37iQ33hw78iQ34iA72hw / 5iA74hw75iA76iA76iA78iQ38iQ37iQ37iQ3UBknvAAAAhHRSTlMAAQIDAwEEBQEFBgEHCEBBRUYBCAkhUIC/gVZHGQIKC0dnhcLRz69gAgsMcM/Pnw4MAhCPkFgdDw4C0pVRIDLfMDzfHnnSWbSkQnHh72rDSofhS5ASzyzweB2gO + 9pYaWBwFoi8JaziMItsK/wN2aioNHRSYGFsL8ncHSBsMBBQBRDQ4DJigkQAAAXjElEQVR42u2d+X/T6HpHQ8jAwIDuDFBLXYCu9oBrAXLbsIwihSSERVkJyWSBBAgYbvf2dl9ubysIhABZgGGd7S + t41225HiR9S7P1z9lTj5D4ucoia336FVXFx54VD52dXd37wIjxSofu3t6enaDkWIVj8 / 27N27d89nYIRY5ePzffv379/3ORghVvn44sDBgwcPfEGDKYryiy+/ + uqrL3 + R / UihOYOqx6HDR44cOXxIYvZbSkxVNU1zc49Hj1dWVh4 / couP7CfU3 / 6d3/09uWdwqOo1YfnDo8eOHz9+7Kjn09Kw3/ + DP / yjP37iVj6ePF1dXX3qx / 4kriYUEnP5bHd36eOvT5w8efLE157PS8GUZPxPn62trT177nH9fCeW0pOKzHPZfk2wp6d0ABw9cerUqdNnPJ8/c1pwZsTSqazKFy/X19dfvvC4bpCl / uzP / 0K+uRRfE + zbWzoADh07ear37DnP58 + d7e0VlxXkZx8bm1tbW5sbHtfNsPMXvpFoLhWvCQ7s39tTeA3wxeHjJ09J5N9Mai25DmTxpCmb / 6OHD+7fWzgn9PmBI8dPnpbFf1/aasd1EEulbZn8f33syMH9ewqvBfcdPHL8xBkp/PdfuNi + 6yBmqaYs/s+cOH7k4L7COcE9+w8eOfa1BP4HBs+H5TqIDQ0OSPFa6fTJ40cOFM4J7t67/ + Dho + I / p0vD4boOYpevSPCzcurk8cOFc4K7evbuP3BI9OdkXL22FY3 / LLOShuh / K0 + dPFZ03t2zd98Xgvs39U65DmCObor9WunUidLv / O6ePZ + L7V / R3Ij955YOFJHfE5wuv + br3v2Z0P4TmsvCf + 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'
router.post('/upload', function(req, res) {
	console.log('here');
	var userId='';
	User_.findOne({_id: req.body.user_id})
	   .exec()
	   .then(function(user) {
			uploadContact(user._id,req,function(ret){
				if(true)
				{
					updateConnectionStatus(user._id,req.body.contacts,function(updRet){
						if(updRet===true)
						{
							getConnections(user._id,function(gcRet,cons){
								if(gcRet===true)
								{
									console.log(cons);
									res.status(201).json({
										success: true,
										connectionCount: cons.length,
										connection: cons});
								}
								else
								{
									res.status(204).json({
										success: true,
										message: 'The server successfully processed the request and is'
									});
								}
								
							});
						}
						else
						{
							res.status(500).json({
								success: false,
								message: '1The server failed to sync the contacts'
							});
						}
						
						
					});
				}
				else
				{
					res.status(500).json({
						success: false,
						message: '2The server failed to sync the contacts'
					});
				}
			});
		})
	   .catch(error => {
		  res.status(500).json({
			 success: false,
              message: error
		  });
	   });
});


router.post('/getContact',function(req,res){
	var userId = req.body.user_id;
	getConnections(userId,function(gcRet,cons){
		if(gcRet===true)
		{
			res.status(201).json({
				success: true,
				connectionCount: cons.length,
				connection: cons
			});
		}
		else
		{
			res.status(204).json({
				success: true,
				message: 'The server successfully processed the request and is'
			});
		}
								
	});
});
function getConnections(userId,callback)
{
	Connections_.findOne({user_id: userId}).exec().
	then(function(con){
		if(con===null)
		{
			callback(false,null);
		}
		else
		{
			callback(true,con.connection);
		}
	});
}
function updateConnectionStatus(userId, contact,callback)
{
	Connections_.findOne({user_id: userId}).exec().
	then(function(con){
		if(con===null)
		{
			var connectionList=[];
			var tempc=contact.length;
			for(var i=0;i<contact.length;i++)
			{
				var phoneNum = contact[i];
				User_.findOne({ phoneNumber: phoneNum })
				   .exec()
				   .then(function(user) {
						if(user===null){
							tempc--;
						}
						else
						{
                            tempc--;
                            var image=''
                            if (user.image !== undefined && user.image !== null) {
                                image = user.image;
                            }
                            else {
                                image = defImage;
                            }
                            var tempConnection = {
								user_id: user._id,
								contactNumber: user._doc.phoneNumber,								
                                image: image
							};
							connectionList.push(tempConnection);
							if(tempc==0)
							{
								var connectionTemp=new Connections_({
									_id: new  mongoose.Types.ObjectId(),
									user_id : userId,
									connection: connectionList
								});
								connectionTemp.save().then(function(result) {
									callback(true);
								 }).catch(error => {
									 console.log(error);
									callback(false);
								 });
						
							}
						}
					})
				   .catch(error => {
					  callback(false);
				   });
			}
		}
		else
		{
			var connectionList=[];
			var tempc=contact.length;
			for(var i=0;i<contact.length;i++)
			{
				var emailAddress=contact[i].email;
				User_.findOne({email :'m_amighi@yahoo.com'})
				   .exec()
				   .then(function(user) {
						//uploadContact(user._id,req,function(ret){
						if(user===null){
							tempc--;
						}
						else
						{
							tempc--;
							var check=false;
							var j=0;
							for(j=0;j<con.connection.length;j++)
							{
								console.log("con.email"+con.connection.length);
								console.log("con.email"+con.connection[j].email);
								if(con.connection[j].email===user.email)
								{
									check=true;
									break;
								}
							}
                            var tempConnection;
                            var image = ''
                            if (user.image !== undefined && user.image !== null) {
                                image = user.image;
                            }
                            else {
                                image = defImage;
                            }
							if(check===false)
							{
                                tempConnection = {
                                    user_id: user._id,
									firstName: user.firstName,
									lastName: user.lastName,
									contactNumber: user.contactNumber,
									email: user.email,
									image: image
								};
							}
							else
								tempConnection=con.connection[j];
							
							connectionList.push(tempConnection);
							if(tempc==0)
							{
								var query={user_id:userId};
								var connectionTemp=new Connections_({
									user_id : userId,
									connection: connectionList
								});
								Contact.findOneAndUpdate(query, connectionTemp, {upsert:true}, function(err, doc){
									if (err) {
										console.log(err);
										callback(false);
									}
									else callback(true);
								});	
							}
						}
					})
				   .catch(error => {
					   console.log(error);
						callback(false);					   
				   });
			}
		}
		
	});
}

function manageContact(contact,callback)
{	
	var connectionList=[];
	var tempc=contact.length;
	for(var i=0;i<contact.length;i++)
	{
		var emailAddress=contact[i].email;

		User_.findOne({email : 'm_amighi@yahoo.com'})
		   .exec()
		   .then(function(user) {
				//uploadContact(user._id,req,function(ret){
               var image = '';
               if (user.image !== undefined && user.image !== null) {
                   image = user.image;
               }
               else {
                   image = defImage;
               }
				if(user===null){
					tempc--;
				}
				else
				{
					tempc--;
                    var tempConnection = {
                        user_id: user._id,
						contactNumber: user.contactNumber,
						image: image
					};
					connectionList.push(tempConnection);
					if(tempc==0)
						callback(connectionList);
				}
			})
		   .catch(error => {
			  
		   });
	}		  
			 //  }
}
function uploadContact(userId,req,callback)
{
	/*	console.log('upload contact');
		var query={user_id:userId};
		var contacts= new Contact({
			user_id: userId,
			contact: req.body.contact
			
		});
		Contact.findOneAndUpdate(query, contacts, {upsert:true}, function(err, doc){
			if (err) callback(false);
			else callback(true);
		});	*/
	callback(true);
}



module.exports = router;

