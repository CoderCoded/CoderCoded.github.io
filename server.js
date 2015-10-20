var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var CONFIG = require('config')

app.post('/', function (req, res) {
  var mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport(smtpTransport(CONFIG.smtp));

  // Mailer options
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: CONFIG.to,
    subject: CONFIG.prefix + req.body.subject,
    text: req.body.message
  };

  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      res.status(500).json({error: true, message: 'Failed to send the message.'})
    }
    else {
      res.status(200).json({message: 'Message successfully sent!'})
    }
  });

});

var server = app.listen(CONFIG.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Mailer listening at http://%s:%s', host, port);
});