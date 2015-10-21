var express = require('express')
var app = express()
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var CONFIG = require('config')
var bodyParser = require('body-parser')
var Joi = require('joi')

var contactSchema = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email(),
  subject: Joi.string().alphanum().max(70),
  message: Joi.string().alphanum().max(2000).required()
})

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

var smtpTrans = nodemailer.createTransport(smtpTransport(CONFIG.smtp))

app.post('/', function (req, res) {

  console.log('Got POST:')
  console.log(JSON.stringify(req.body, null, 2))

  Joi.validate(req.body, contactSchema, function (err, value) {

    if (err) {
      console.error(err)
      res.status(500).send('Invalid form data.')
    }

    // Mailer options
    var mailOpts = {
      from: req.body.name + ' &lt;' + req.body.email + '&gt;',
      to: CONFIG.to,
      subject: CONFIG.prefix + req.body.subject,
      text: req.body.message
    }

    smtpTrans.sendMail(mailOpts, function (error, response) {
      if (error) {
        console.error(err)
        res.status(500).send('Failed to send the message.')
      } else {
        console.log(err)
        res.status(200).send('Message successfully sent!')
      }
    })
  })
})

var server = app.listen(CONFIG.port, function () {
  var host = server.address().address
  var port = server.address().port

  console.info('Mailer listening at http://%s:%s', host, port)
})
