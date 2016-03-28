(function () {
  'use strict';

  // To Do:
  //  - How do we address the zenscroll over-scrolling the heading w/docked nav?
  //  - Clicking the nav before it's fixed shouldn't active (open), just scroll

  var _ = require('./util');

  var options = {};
  var defaults = {
    headings: 'h2',
    target: document.body,
    breakpoint: 700,
    debounce: 15,
    fixedClass: 'fixed',
    activeClass: 'active',
    marginTop: 0
    // triggerElement: document.querySelector('.section-heading')
  };

  function init(opts) {
    options = _.defaults({}, opts, defaults);
    _buildNav();
    options.nextEl = options.nav.parentElement.nextSibling;
    options.fixed = _.hasClass(options.nav, options.fixedClass);
    _registerHandlers();
  }

  function _buildNav() {
    options.nav = _.create('ol', 'mobile-nav', options.target);
    var headings = document.querySelectorAll(options.headings);
    _.each(headings, _createListItem);
  }

  function _createListItem(heading, i) {
    var li = _.create('li', '', options.nav);
    var a = _.create('a', '', li);
    a.setAttribute('href', '#scrollNav-' + (i + 1));
    a.innerHTML = heading.innerText;
  }

  function _registerHandlers() {
    window.addEventListener('scroll', _.debounce(_sticky, options.debounce), false);
    window.addEventListener('resize', _.debounce(_sticky, options.debounce), false);
  }

  function _killHandlers() {
    options.nav.removeEventListener('click', _toggle, false);
    // Should see if this works with the whole debounce thing...
    window.removeEventListener('scroll', _.debounce(_sticky, options.debounce));
    window.removeEventListener('resize', _.debounce(_sticky, options.debounce));
  }

  function _sticky(e) {
    // Maybe add a callback?
    if (_getWindowWidth() > options.breakpoint) return;
    var fromTop = _getPosition(options.nextEl).y - options.marginTop;

    if ( fromTop <= 0 ) {
      _.addClass(options.nav, options.fixedClass);
      _.addClass(document.body, options.fixedClass);
      options.fixed = true;
      options.nav.addEventListener('click', _toggle, false);
    }
    else {
      _.removeClass(options.nav, options.fixedClass);
      _.removeClass(document.body, options.fixedClass);
      options.fixed = true;
      options.nav.removeEventListener('click', _toggle, false);
    }
  }

  function _open() {
    if (options.active || !options.fixed) return;

    _.addClass(options.nav, options.activeClass);
    options.active = true;
  }

  function _close() {
    if (!options.active || !options.fixed) return;

    _.removeClass(options.nav, options.activeClass);
    options.active = false;
  }

  function _toggle() {
    if (options.active) _close();
    else _open();
  }

  function _getWindowWidth() {
    var el = document.documentElement,
        body = document.querySelector('body');

    return window.innerWidth || el.clientWidth || body.clientWidth;
  }

  function _getPosition(el) {
    var xPos = 0;
    var yPos = 0;

    while (el) {
      if (el.tagName == "BODY") {
        // deal with browser quirks with body/window/document and page scroll
        var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
        var yScroll = el.scrollTop || document.documentElement.scrollTop;

        xPos += (el.offsetLeft - xScroll + el.clientLeft);
        yPos += (el.offsetTop - yScroll + el.clientTop);
      } else {
        // for all other non-BODY elements
        xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPos += (el.offsetTop - el.scrollTop + el.clientTop);
      }

      el = el.offsetParent;
    }
    return {
      x: xPos,
      y: yPos
    };
  }

  function destroy() {
    _killHandlers();
    _.remove(options.nav);
    options = null;
  }

  module.exports.init = init;
  module.exports.destroy = destroy;
})();
