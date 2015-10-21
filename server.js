var express = require('express')
var app = express()
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var CONFIG = require('config')
var bodyParser = require('body-parser')
var Joi = require('joi')
var bunyan = require('bunyan')
var pkg = require('./package.json')
var log = bunyan.createLogger({ name: pkg.name })

var contactSchema = Joi.object().keys({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email(),
  subject: Joi.string().max(70),
  message: Joi.string().max(2000).required()
})

var smtpTrans = nodemailer.createTransport(smtpTransport(CONFIG.smtp))

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Add headers
app.use(function (req, res, next) {

  // Allow post from www.codercoded.com
  res.setHeader('Access-Control-Allow-Origin', 'https://www.codercoded.com')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  next()
})

app.post('/', function (req, res) {

  log.info('Got POST:')
  log.info({body: req.body})

  Joi.validate(req.body, contactSchema, function (err, value) {

    if (err) {
      log.error(err)
      res.status(400).send('Invalid form data.')
      return
    }

    // Mailer options
    var mailOpts = {
      from: CONFIG.from,
      to: CONFIG.to,
      subject: CONFIG.prefix + req.body.subject
    }

    if (req.body.email) {
      mailOpts.replyTo = {
        name: req.body.name,
        address: req.body.email
      }
      mailOpts.text = req.body.message
    } else {
      mailOpts.text = req.body.name + ' sent a message:\n\n' + req.body.message
    }

    log.info('Sending email:')
    log.info({ options: mailOpts })

    smtpTrans.sendMail(mailOpts, function (error, response) {
      if (error) {
        log.error(error)
        res.status(500).send('Failed to send the message.')
      } else {
        log.info(response)
        res.status(200).send('Message successfully sent!')
      }
    })
  })
})

var server = app.listen(CONFIG.port, function () {
  var host = server.address().address
  var port = server.address().port

  log.info('Mailer listening at http://%s:%s', host, port)
})
