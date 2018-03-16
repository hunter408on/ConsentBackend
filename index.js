var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require("http");
var path = require('path');
var PORT = process.env.PORT || 8001;;
var resData = [];
var resSearchData = [];
var sendgrid = require('sendgrid')('');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var sendgridOption = {
  auth :{
     api_user : '',
     api_key : ''
  }
};
var twilio = require('twilio');
var twilioclient = new twilio('','');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.post('/api/sendemail',sendemail);
function sendemail(req,res){
    var email = req.body.email;
    var from  = req.body.from;
    var subject = req.body.subject;
    var message = req.body.message;
    var text = req.body.text;
    var sendgrid_mailer = nodemailer.createTransport(sgTransport(sendgridOption));
    var sendgrid_email = {
        to: [email],
        from: from,
        subject: subject,
        text: text,
        html: message
    };
    console.log("Post forgot processing" + "processed");
    sendgrid_mailer.sendMail(sendgrid_email, function(email_err, result) {
        if (email_err) {
            console.log(email_err)
            res.status(404).json({'status':'error'});
        }
        console.log(result);
        res.json({'status':'success'});
    });
}
app.post('/api/sendsms',sendsms);
function sendsms(req,res){    
    var phone = req.body.phone;
    var name = req.body.name; 
    var message = req.body.message;   
    twilioclient.messages.create({
        to:phone,
        from : '',
        body : message
    },function(error, messages){
        console.error(error);
        console.log('Sms message '+ messages);
        if (!error) {
            res.json({'status':'success'});
        }else{
            res.json({'status':'error'});
        }
    });
    
}
function parseJSONorNot(mayBeJSON) {
    if (typeof mayBeJSON === 'string') {
        return JSON.parse(mayBeJSON);
    } else {
        return mayBeJSON;
    }
}
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
