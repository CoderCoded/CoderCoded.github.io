/*
  Miniport by HTML5 UP
  html5up.net | @n33co
  Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

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
    });

  $(function() {

    var $window = $(window),
      $body = $('body');

    // Disable animations/transitions until the page has loaded.
      $body.addClass('is-loading');

      $window.on('load', function() {
        $body.removeClass('is-loading');
      });

    // Fix: Placeholder polyfill.
      $('form').placeholder();

    // Prioritize "important" elements on mobile.
      skel.on('+mobile -mobile', function() {
        $.prioritize(
          '.important\\28 mobile\\29',
          skel.breakpoint('mobile').active
        );
      });

    // CSS polyfills (IE<9).
      if (skel.vars.IEVersion < 9)
        $(':last-child').addClass('last-child');

    // Scrolly.
      $window.load(function() {

        $('#nav a, .scrolly').scrolly({
          speed: 1000,
          offset: $('#nav').height() - 2
        });

      });

      $('#contact-form').on('submit', function(e) {
        e.preventDefault();

        var form = e.target;
        var $form = $(form);

        // Use Ajax to submit form data
        $.ajax({
          url: $form.attr('action'),
          type: 'POST',
          data: $form.serialize(),
          success: function(result) {
            humane.log('Message sent successfully.', { addnCls: 'humane-bigbox-success' });
            form.reset();
          },
          error: function(res) {

            var err = 'Error sending form.'

            if (res.status === 400 || res.status === 500) {
              err = res.responseText
            }

            humane.log(err, { addnCls: 'humane-bigbox-error' });
          }
        });
      })

  });

})(jQuery);