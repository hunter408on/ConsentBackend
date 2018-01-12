var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require("http");
var path = require('path');
var PORT = process.env.PORT || 8001;;
var resData = [];
var resSearchData = [];
var sendgrid = require('sendgrid')('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');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var sendgridOption = {
  auth :{
     api_user : 'adrian09h',
     api_key : 'Sec12345'
  }
};
var smtpTransport = nodemailer.createTransport({
    service : 'SendGrid',
    auth :{
      api_user : 'adrian09h',
      api_key : 'Sec12345'
   }
});
var twilio = require('twilio');
var twilioclient = new twilio('ACe47b7fa718599e9a35557a6b780403ed','6c3fa98e8de091c63b92116844ab8735');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.post('/api/sendemail',sendemail);
function sendemail(req,res){
    var email = req.body.email;
    var message = req.body.message;
    var sendgrid_mailer = nodemailer.createTransport(sgTransport(sendgridOption));
    var sendgrid_email = {
        to: [email],
        from: 'luke@rollseo.com',
        subject: 'Consent Request',
        text: 'Consent Request',
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
        from : '+18442028677',
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
