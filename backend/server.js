// server.js

var express = require('express');
var app = express();

var testHole = {
	"id": 2,
	"severity": 1,
	"firstStreet": "Madison",
	"secondStreet": "Wabash",
	"thirdStreet": "",
	"lat": 41.8897455,
	"long": -87.63465494,
	"noOfHits": 7,
	"hasContacted": false,
	"crowdFunding": true,
	"backing": 0,
	"goal": 300,
	"fixed": false,
	"claimed": false
};

var testUser = {
	"id": 3,
	"firstName": "John",
	"lastName": "Doe",
	"middleInitial": "J",
	"userHandle": "johnjdoe",
	"password": "ilovejane",
	"typeOfAcct": "filler",
	"isVerified": true,
	"potholesReported": 3,
	"potholesFixed": 42,
	"emails": {
		"newPotholes": true,
		"potholeFilled": false,
		"bountyIncreased": true
	},
	"creditCardNo": 4111111111111111,
	"expiryShortDate": 1218,
	"expirationMonth": 12,
	"expirationYear": 15,
	"cv2": 487
};

app.get('/', function(req, res){
  res.send(testHole);
});

app.get('/email',function(req,res){
	var msg = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'/><title>repotr</title><style type='text/css'>body{margin:0;padding:0;min-width:100%!important;}.content{width:100%;max-width:600px;}</style></head><body bgcolor='#f6f8f1'><table width='100%' bgcolor='#e6e8e1' border='0' cellpadding='0' cellspacing='0'><tr><td><table class='content' align='center' cellpadding='0' cellspacing='0' border='0'><tr><td style='background: #555; text-align: center; padding:20px;'><img src='http://raymperry.com/images/repotrLogo.png' alt='rePOTr Logo'/></td></tr><tr><td style='padding:20px; background: #fff;'>Hello!</td></tr><tr><td style='padding-left:40px; background: #fff;'>Just wanted to let you know that a <strong>new pothole</strong> has developed on the intersection of <strong>"+testHole.firstStreet+" and "+testHole.secondStreet+"</strong>. <br/>Here\'s the long and short of it: <br> <br></td></tr><tr><td style='padding-left:40px; background: #fff;'><strong>Severity:</strong> "+testHole.severity+" <br><strong>Current Reward:</strong> $"+testHole.backing+" <br></td></tr><tr><td style='padding:20px; background: #fff;'>If you\'re a normal user, take heed. If this is a pothole that will affect you, donate a dollar or two? If you\'re a filler, why not give it a shot and help out?</td></tr><tr><td style='background: #555; color:#fff; text-align: center; padding:20px;'>&copy; 2014 rePOTr.</td></tr></table></td></tr></table></body></html>";
	var api_user = "testUser2014";	
	var api_key = "testPass";	
	var sendgrid  = require('sendgrid')(api_user, api_key);
	sendgrid.send({
	  to:       'rmperry09@gmail.com',
	  from:     'pothole-alert@repotr.com',
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

	var newSMS = "Dear Alderman, rePOTr has been notified of a new pothole development in the area. Would you like rePOTr to handle it?";
	client.sendMessage({

	    to:'+13312515297', // Any number Twilio can deliver to
	    from: '+16302974498', // A number you bought from Twilio and can use for outbound communication
	    body: newSMS // body of the SMS message

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

app.get('/pothole', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(testHole));
});

app.get('/braintree', function(req,res){
	var braintree = require('braintree');

	var merchantID = '6szy7vjkkcdr9bx6';
	var publicKey = 'n9vd44xbkn95yqwf';
	var privateKey = 'bed5768fee4f425874e1af9844d3cf1b';

	var gateway = braintree.connect({
	  environment: braintree.Environment.Sandbox,
	  merchantId: merchantID,
	  publicKey: publicKey,
	  privateKey: privateKey
	});

	gateway.transaction.sale({
	  amount: '5.00',
	  creditCard: {
	    number: testUser.creditCardNo,
	    expirationMonth: testUser.expirationMonth,
	    expirationYear: testUser.expirationYear
	  }
	}, function (err, result) {
	  if (err) throw err;

	  if (result.success) {
	    console.log('Transaction ID: ' + result.transaction.id);
	  } else {
	    console.log(result.message);
	  }
	});
});

app.listen(3000);