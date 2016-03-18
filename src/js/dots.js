(function () {
  'use strict';

  /* A navigation element fixed to the right side of the screen.  Each dot is
     created after searching the page for an H2.  Clicking the dot will scroll
     the page to that particular section.
  */

  var _ = require('./util');
  var emitter = require('./mediator');

  var options = {};
  var defaults = {
    headings: 'h2'
  };

  function init(opts) {
    options = _.defaults(options, opts, defaults);
    createElement();
  }

  function createElement() {
    var headings = document.querySelectorAll(options.headings);
    var li, text;

    options.dots = _.create('ol', 'dot-nav', document.body);

    _.each(headings, function (heading) {
      text = heading.innerHTML;
      li = _.create('li', 'tipsy tipsy--w', options.dots);
      li.innerHTML = text;
      li.setAttribute('data-tipsy', text);
    });
  }

  module.exports.init = init;
})();
