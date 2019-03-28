var express = require('express');
var router = express.Router();
const AWS = require("aws-sdk");
require("express-async-errors");

const connectInstanceId = "";

AWS.config.accessKeyId = "_____";
AWS.config.secretAccessKey = "____";
AWS.config.update({region: 'us-east-1'});
AWS.config.apiVersions = {
  connect: '2017-08-08'
};

var connect = new AWS.Connect();

router.get("/", function(req, res){
  var params = {
    InstanceId: connectInstanceId, /* required */
  };
  connect.listUsers(params, function(err, data) {
    console.log(data);
    res.render("index");
  });
});

router.post("/call", function(req, res){
  console.log("phone number:"+req.body.phone_number);
  var destinationPhoneNumber = req.body.phone_number;
  var params = {
    ContactFlowId: '______', /* required */
    DestinationPhoneNumber: destinationPhoneNumber, /* required */
    InstanceId: connectInstanceId, /* required */
    // Attributes: {
    //   '<AttributeName>': 'STRING_VALUE',
    //   /* '<AttributeName>': ... */
    // },12054562426
    // ClientToken: 'STRING_VALUE',
    SourcePhoneNumber: '+111111111'
  };
  connect.startOutboundVoiceContact(params, function(err, data) {
    if (err){// an error occurred
      console.log(err, err.stack);
      res.status(400).json({data: err});
    }
    else{// successful response
      console.log("Success:"+data);
      res.status(200).json({data:data});
    }
  });

});

router.post("/describeUser", function(req, res){
  var params = {
    InstanceId: connectInstanceId /* required */
  };
  connect.getFederationToken(params, function(err, data) {
    if (err){// an error occurred
      console.log(err, err.stack);
      res.status(400).json({data: err});
    }
    else{// successful response
      console.log(data);
      res.status(200).json({data:data});
    }
  });
});

router.post("/user", async (req, res) => {
  var userId = req.body.userId;
  var params = {
    InstanceId: connectInstanceId, /* required */
    UserId: userId /* required */
  };
  connect.describeUser(params, function(err, data) {
    if (err){// an error occurred
      console.log(err, err.stack);
      res.status(400).json({data: err});
    }
    else{// successful response
      console.log(data);
      res.status(200).json({data:data});
    }
  });
});

router.post("/endcall", function(req, res){
  console.log("contact id:"+req.body.contactID);
  var params = {
    ContactId: contactID, /* required */
    InstanceId: connectInstanceId /* required */
  };
  connect.stopContact(params, function(err, data) {
    if (err){// an error occurred
      console.log(err, err.stack);
      res.status(400).json({data: err});
    }
    else{// successful response
      console.log(data);
      res.status(200).json({data:dasta});
    }
  });
})

module.exports = router;
