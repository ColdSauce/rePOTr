// server.js

var express = require('express');
var app = express();
var mailer = require('openurl');

var testHole = {
	"id": 2,
	"severity": 1,
	"firstStreet": "Madison",
	"secondStreet": "Wabash",
	"lat": "lat",
	"long": "long",
	"noOfHits": 7,
	"hasContacted": false,
	"crowdFunding": true,
	"backing": 47,
	"fixed": false
};

app.get('/', function(req, res){
  res.send(testHole);
});

app.get('/email',function(req,res){
	var msg = "There is a <strong>new pothole</strong> on "+testHole.firstStreet+" and "+testHole.secondStreet+".";
	var api_user = "testUser2014";	
	var api_key = "testPass";	
	var sendgrid  = require('sendgrid')(api_user, api_key);
	sendgrid.send({
	  to:       'rmperry09@gmail.com',
	  from:     'repotr@repotr.com',
	  subject:  'A new pothole has developed!',
	  html:     msg
	}, function(err, json) {
	  if (err) { return console.error(err); }
	  console.log(json);
	});
});

app.get('/phone',function(req,res){
	//require the Twilio module and create a REST client
	var SID = 'ACfb69f0fe1cb92cd76314c990be076c37';
	var authKey = '4ced5a3907f206947551ffa17421f8dd';

	var client = require('twilio')(SID, authKey);
	client.sendMessage({

	    to:'+13312515297', // Any number Twilio can deliver to
	    from: '+16302974498', // A number you bought from Twilio and can use for outbound communication
	    body: 'word to your mother.' // body of the SMS message

	}, function(err, responseData) { //this function is executed when a response is received from Twilio

	    if (!err) { // "err" is an error received during the request, if any

	        // "responseData" is a JavaScript object containing data received from Twilio.
	        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
	        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

	        console.log(responseData.from); // outputs "+16309997603"
	        console.log(responseData.body); // outputs "word to your mother."

	    }
	});

	//Place a phone call, and respond with TwiML instructions from the given URL
	client.makeCall({

	    to:'+13312515297', // Any number Twilio can call
	    from: '+16302974498', // A number you bought from Twilio and can use for outbound communication
	    url: 'http://www.example.com/twiml.php' // A URL that produces an XML document (TwiML) which contains instructions for the call

	}, function(err, responseData) {

	    //executed when the call has been initiated.
	    console.log(responseData.from); // outputs "+14506667788"

	});
});

app.listen(3000);