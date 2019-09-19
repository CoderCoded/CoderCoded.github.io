/*
  Miniport by HTML5 UP
  html5up.net | @n33co
  Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  'use strict'
  /* global humane, skel */
  function getFormData ($form) {
    var serialized = $form.serializeArray()
    var res = {}

    $.each(serialized, function (idx, val) {
      res[val.name] = val.value
    })

    return res
  }

  function disableSubmit () {
    $('input[type="submit"]').attr('disabled', 'disabled')
  }

  function enableSubmit () {
    $('input[type="submit"]').removeAttr('disabled')
  }

  skel
    .breakpoints({
      desktop: '(min-width: 737px)',
      tablet: '(min-width: 737px) and (max-width: 1200px)',
      mobile: '(max-width: 736px)'
    })
    .viewport({
      breakpoints: {
        tablet: {
          width: 1080
        }
      }
    })

  $(function () {
    // Placeholder polyfill.
    $('form').placeholder()

    // CSS polyfills (IE<9).
    if (skel.vars.IEVersion < 9) {
      $(':last-child').addClass('last-child')
    }

    // Scrolly.
    $(window).load(function () {
      $('#nav a, .scrolly').scrolly({
        speed: 1000,
        offset: $('#nav').height() - 2
      })
    })

    $('#contact-form').on('submit', function (e) {
      e.preventDefault()

      disableSubmit()

      var form = e.target
      var $form = $(form)
      var data = getFormData($form)
      var payload = {
        subject: '[Codercoded Contact Form] ' + data.subject,
        body: '\nName: ' + data.subject + '\nEmail: ' + data.email + '\n\n ' + data.body,
        email: data.email
      }

      var success = function onSuccess (result) {
        humane.log(
          'Message sent!',
          {
            addnCls: 'humane-bigbox-success',
            clickToClose: true,
            timeout: 4000
          },
          function callback () {
            enableSubmit()
            form.reset()
          })
      }

      var error = function onError (res) {
        var err = ['Error sending your message.']

        if (res.status === 400 || res.status === 500) {
          err.push(res.responseText)
        }

        humane.log(
          err,
          {
            addnCls: 'humane-bigbox-error',
            clickToClose: true,
            timeout: 4000
          },
          function callback () {
            enableSubmit()
          }
        )
      }

      $.ajax({
        url: $form.attr('action'),
        type: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: success,
        error: error
      })
    })
  })
})(window.jQuery)
