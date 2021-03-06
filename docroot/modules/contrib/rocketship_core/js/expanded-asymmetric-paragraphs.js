/**
 * Rocketship UI JS
 *
 * contains: triggers for functions
 * Functions themselves are split off and grouped below each behavior
 *
 * Drupal behaviors:
 *
 * Means the JS is loaded when page is first loaded
 * + during AJAX requests (for newly added content)
 * use jQuery's "once" to avoid processing the same element multiple times
 * http: *api.jquery.com/one/
 * use the "context" param to limit scope, by default this will return document
 * use the "settings" param to get stuff set via the theme hooks and such.
 *
 *
 * Avoid multiple triggers by using jQuery Once
 *
 * EXAMPLE 1:
 *
 * $('.some-link', context).once('js-once-my-behavior').click(function () {
 *   // Code here will only be applied once
 * });
 *
 * EXAMPLE 2:
 *
 * $('.some-element', context).once('js-once-my-behavior').each(function () {
 *   // The following click-binding will only be applied once
 * * });
 */

(function ($, Drupal, window, document) {

  "use strict";

  // set namespace for frontend UI javascript
  if (typeof window.rocketshipAdminUI == 'undefined') { window.rocketshipAdminUI = {}; }

  var self = window.rocketshipAdminUI;

  ///////////////////////////////////////////////////////////////////////
  // Cache variables available across the namespace
  ///////////////////////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////////////////////
  // Behavior for Tabs: triggers
  ///////////////////////////////////////////////////////////////////////

  Drupal.behaviors.RocketshipParagraphsExpAsymLayouts = {
    attach: function (context, settings) {

      var paragraphsDialogList = $('.paragraphs-add-dialog-list');

      // Now we can do stuff to override the CKE text alignment buttons
      if (paragraphsDialogList.length) {
        self.paragraphsDialog(paragraphsDialogList);
      }

    }
  };

  ///////////////////////////////////////////////////////////////////////
  // Behavior for Tabs: functions
  ///////////////////////////////////////////////////////////////////////

  /**
   * Replace the radiobuttons with images
   * Along with adding and classes to make styling easier
   *
   */
  self.paragraphsDialog = function(list) {

    var items = list.children('li');

    items.once('js-once-p-dialog-list').each(function() {

      // hover or touch on the info-icon, toggles up the description and closes all others that are open
      var item = $(this),
          trigger = item.find('.paragraphs-add-dialog-row__description__icon'),
          tooltip = item.find('.paragraphs-add-dialog-row__description__content');

      trigger.on('click', function () {

        // close item
        if (item.hasClass('js-open')) {
          item.removeClass('js-open');
          tooltip.attr('aria-hidden', true);
          // open item
        } else {
          item.addClass('js-open');
          tooltip.attr('aria-hidden', false);

          // close all siblings
          item.siblings().each(function () {
            var sibling = $(this);

            if (sibling.hasClass('js-open')) {
              sibling.removeClass('js-open');
              tooltip.attr('aria-hidden', true);
            }
          });
        }

      });

    });

  };

})(jQuery, Drupal, window, document);
