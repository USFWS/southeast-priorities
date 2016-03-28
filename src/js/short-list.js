(function () {
  'use strict';

  var _ = require('./util');

  var options = {};
  var defaults = {
    elements: document.querySelectorAll('.full-list'),
    showClass: 'show'
  };

  function init(opts) {
    options = _.defaults({}, opts, defaults);
    _.each(options.elements, function (element) {
      element.addEventListener('click', _toggle);
    });
  }

  function _toggle(e) {
    var list = getListWrapper(e.target);
    if ( _.hasClass(list, options.showClass) )
      _.removeClass(list, options.showClass);
    else _.addClass(list, options.showClass);
  }

  function getListWrapper(el) {
    if ( _.hasClass(el, 'fade-list') ) return el;
    else return el.parentNode;
  }

  function destroy() {
    _.each(options.elements, function (element) {
      element.removeEventListener('click', _toggle);
    });
    options = null;
  }

  module.exports.init = init;
  module.exports.destroy = destroy;
})();
