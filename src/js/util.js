(function () {
  'use strict';

  var _ = {
    each: require('lodash.forEach'),
    filter: require('lodash.filter'),
    isDom: require('is-dom'),
    debounce: require('lodash.debounce'),
    defaults: require('lodash.defaults'),
    isArray: require('lodash.isArray'),
    parents: parents,
    offset: offset,
    remove: remove,
    removeClass: removeClass,
    getWindowSize: getWindowSize,
    is: is,
    nextUntil: nextUntil,
    unwrap: unwrap,
    wrapAll: wrapAll,
    hasClass: hasClass,
    addClass: addClass,
    splitWords: splitWords,
    trim: trim,
    setClass: setClass,
    getClass: getClass,
    create: create
  };

  module.exports = _;

  function parents(els, filter) {
    var allParents = [];
    if ( !_.isArray(els) ) els = [els];
    _.each(els, function (el) {
      if ( _.hasClass(el.parentNode, filter) )
        allParents.push(el.parentNode);
    });
    return allParents;
  }

  function is(nodeList, selector) {
    [].some.call(nodeList, function (node) {
        return node.matches(selector);
    });
  }

  function nextUntil(el, untilEl) {
    var next = [],
        until = true;

    while (el = el.nextElementSibling) {
      (until && el && !el.matches(untilEl)) ? next.push(el) : until = false;
    }
    return next;
  }

  function unwrap(el) {
    var parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  }

  function wrapAll(options) {
    var wrapper = document.createElement(options.wrapEl);
    wrapper.setAttribute('id', options.id);
    addClass(wrapper, options.class);
    options.elms[0].parentNode.appendChild(wrapper);
    _.each(options.elms, function (el) {
      wrapper.appendChild(el);
    });

    return wrapper;
  }

  function removeClass(el, name) {
    if (el.classList !== undefined) {
      el.classList.remove(name);
    } else {
      setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
    }
  }

  function remove(el) {
    var parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
  }

  function hasClass(el, name) {
    if (el.classList !== undefined) {
      return el.classList.contains(name);
    }
    var className = getClass(el);
    return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
  }

  function splitWords(str) {
    return trim(str).split(/\s+/);
  }

  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  }

  function addClass(el, name) {
    if (el.classList !== undefined) {
      var classes = splitWords(name);
      for (var i = 0, len = classes.length; i < len; i++) {
        el.classList.add(classes[i]);
      }
    } else if (!hasClass(el, name)) {
      var className = getClass(el);
      setClass(el, (className ? className + ' ' : '') + name);
    }
  }

  function setClass(el, name) {
    if (el.className.baseVal === undefined) {
      el.className = name;
    } else {
      // in case of SVG element
      el.className.baseVal = name;
    }
  }

  function getClass(el) {
    return el.className.baseVal === undefined ? el.className : el.className.baseVal;
  }

  function create(tagName, className, container) {

    var el = document.createElement(tagName);
    el.className = className;

    if (container) {
      container.appendChild(el);
    }

    return el;
  }

  function getWindowSize() {
    var docEl = document.documentElement,
        IS_BODY_ACTING_ROOT = docEl && docEl.clientHeight === 0,
        b = document.body;

    // Used to feature test Opera returning wrong values
    // for documentElement.clientHeight.

    function isDocumentElementHeightOff() {
      var d = document,
          div = d.createElement('div'),
          r;
      div.style.height = "50000px";
      d.body.insertBefore(div, d.body.firstChild);
      r = d.documentElement.clientHeight > 49000;
      d.body.removeChild(div);
      return r;
    }

    if (typeof document.clientWidth === "number") {
      return {
        width: document.clientWidth,
        height: document.clientHeight
      };
    } else if (IS_BODY_ACTING_ROOT || isDocumentElementHeightOff()) {
      return {
        width: b.clientWidth,
        height: b.clientHeight
      };
    } else {
      return {
        width: docEl.clientWidth,
        height: docEl.clientHeight
      };
    }
  }

  function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

})();
