(function () {
  'use strict';

  var zenscroll = require('zenscroll');
  var _ = require('./util');

  var S = {};
  var defaults = {
    className: 'scroll-nav',
    container: document.querySelector('.container'),
    debounceTimer: 50,
    headlineText: 'Scroll To',
    insertTarget: document.body,
    sections: 'h2',
    sectionElem: 'section',
    showHeadline: true,
    subSections: true,
    fixedMargin: 40,
    scrollOffset: 40
  };

  function init(opts) {
    S.settings = _.defaults({}, opts, defaults);
    // setBodyClass('loading');
    if ( !_.isDom(S.settings.container))
      S.settings.container = document.querySelector(S.settings.container);
    if (S.settings.container === null || typeof S.settings.container === 'string')
      throw new Error('Could not find the content container.  Make sure you passed in a valid Dom node or CSS selector.');
    findSections(S.settings.container);
    setupSections(S.sections.raw);
    // tearDownSections(S.sections.data);
    setupNav(S.sections.data);
    insertNav();
    setupPos();
    checkPos();
    registerHandlers();
  }

  function registerHandlers() {
    window.addEventListener('scroll', _.debounce(checkPos, S.settings.debounceTimer));
    window.addEventListener('resize', resizeHandler);
  }

  function removeHandlers() {
    window.removeEventListener('scroll', _.debounce(checkPos, S.settings.debounceTimer));
    window.removeEventListener('resize', resizeHandler);
  }

  function resizeHandler() {
    _.debounce(function () {
      setupPos();
      checkPos();
    }, S.settings.debounceTimer);
  }

  function checkPos() {
    // Set nav to fixed after scrolling past the header and add an in-view class to any
    // sections currently within the bounds of our view and active class to the first
    // in-view section

    var winTop             = window.pageYOffset;
    var boundryTop         = winTop + S.settings.scrollOffset;
    var boundryBottom      = winTop + S.dims.vpHeight - S.settings.scrollOffset;
    var sectionsActive     = [];
    var subSectionsActive  = [];

    if ( winTop > (S.dims.navOffset - S.settings.fixedMargin) ) _.addClass(S.nav, 'fixed');
    else _.removeClass(S.nav, 'fixed');

    var inView = function(section) {
      return (section.topOffset >= boundryTop && section.topOffset <= boundryBottom) || (section.bottomOffset > boundryTop && section.bottomOffset < boundryBottom) || (section.topOffset < boundryTop && section.bottomOffset > boundryBottom);
    };

    _.each(S.sections.data, function(section) {
      if ( inView(section) ) {
        sectionsActive.push(section);
      }
      _.each(section.subSections, function() {
        if ( inView(section) ) {
          subSectionsActive.push(section);
        }
      });
    });

    var items = S.nav.getElementsByClassName(S.settings.className + '__item');
    _.each(items, function (item) {
      _.removeClass(item, 'active');
      _.removeClass(item, 'in-view');
    });

    var subItems = S.nav.getElementsByClassName(S.settings.className + '__sub-item');
    _.each(subItems, function (subItem) {
      _.removeClass(subItem, 'active');
      _.removeClass(subItem, 'in-view');
    });

    _.each(sectionsActive, function(active, i) {
      var target, parents;
      if (i === 0) {
        target = S.nav.querySelector('a[href="#' + active.id + '"]');
        parents = _.parents(target, S.settings.className + '__item');
        _.each(parents, function (parent) {
          _.addClass(parent, 'active');
          _.addClass(parent, 'in-view');
        });
      } else {
        target = S.nav.querySelector('a[href="#' + active.id + '"]');
        parents = _.parents(target, S.settings.className + '__item');
        _.each(parents, function (parent) {
          _.addClass(parent, 'in-view');
        });
      }
    });

    S.sections.active = sectionsActive;

    _.each(subSectionsActive, function(i) {
      // This might be broken, don't care right now.
      var target, parents;
      if (i === 0) {
        target = S.nav.querySelector('a[href="#' + this.id + '"]');
        parents = _.parents(target, S.settings.className + '__sub-item');
        _each(parents, function (parent) {
          _.addClass(parent, 'active');
          _.addClass(parent, 'in-view');
        });
      } else {
        target = S.nav.querySelector('a[href="#' + this.id + '"]');
        parents = _.parents(S.settings.className + '__sub-item');
        _each(parents, function (parent) {
          _.addClass(parent, 'in-view');
        });
      }
    });
  }

  // Find the offset positions of each section
  function setupPos() {
    var vpHeight   = _.getWindowSize().height;
    var navOffset  = _.offset(S.nav).top;

    var setOffset = function(section) {
      var el  = document.getElementById(section.id);

      section.topOffset    = _.offset(el).top;
      section.bottomOffset = section.topOffset + el.clientHeight;
    };

    _.each(S.sections.data, function(section) {
      setOffset(section);

      _.each(section.subSections, function(subSection) {
        setOffset(subSection);
      });
    });

    S.dims = {
      vpHeight:  vpHeight,
      navOffset: navOffset
    };
  }

  // Add the nav to our page
  function insertNav() {
    if ( _.isDom(S.settings.insertTarget) ) {
      S.settings.insertTarget.appendChild(S.nav);
    } else {
      document.querySelector(S.settings.insertTarget).appendChild(S.nav);
    }
  }

  // Populate an ordered list from the section array we built
  function setupNav(sections) {
    var navList  = _.create('ol', S.settings.className + '__list');
    var headline = _.create('span', S.settings.className + '__heading');
    var wrapper  = _.create('div', S.settings.className + '__wrapper');
    var nav      = _.create('nav', S.settings.className);
    nav.setAttribute('role', 'navigation');
    headline.innerHTML = S.settings.headlineText;

    _.each(sections, function(section, i) {
      var item = (i === 0) ? _.create('li', S.settings.className + '__item active', navList) : _.create('li', S.settings.className + '__item', navList);
      var link = _.create('a', S.settings.className + '__link tipsy tipsy--w', item);
      var subNavList;

      link.setAttribute('href', '#' + section.id);
      link.setAttribute('data-tipsy', section.text);
      // link.innerHTML = section.text;

      if (section.subSections.length > 0 ) {
        _.addClass(item, 'is-parent-item');
        subNavList = _.create('ol', S.settings.className + '__sub-list', item);

        _.each(section.subSections, function (subSection) {
          var subItem = _.create('li', S.settings.className + '__sub-item', subNavList);
          var subLink = _.create('a', S.settings.className + '__sub-link', subItem);
          subLink.innerHTML = subSection.text;
          subLink.setAttribute('href', '#' + subSection.id);
        });
      }
    });
    if (S.settings.showHeadline) {
      wrapper.appendChild(headline);
      wrapper.appendChild(navList);
      nav.appendChild( wrapper );
    } else {
      nav.appendChild( wrapper.appendChild(navList) );
    }

    S.nav = nav;
  }

  // Unwrap sections
  function tearDownSections(sections) {
    _.each(sections, function(section) {
      var el = document.getElementById(section.id);
      _.unwrap(el);
      if (section.subSections.length > 0) {
        _.each(section.subSections, function(subSection) {
          el = document.getElementById(subSection.id);
          _.unwrap(el);
        });
      }
    });
  }

  // Find the html for each section
  function findSections(container) {
    var targetElems = S.settings.sections;
    var html, firstElem, rawHtml = [];
    var headings = container.querySelectorAll(targetElems);

    if (S.settings.showTopLink) {
      firstElem = container.firstChild;

      if ( !_.is(firstElem, targetElems) ) {
        html = _.nextUntil(firstElem, targetElems);
        html.unshift(firstElem);
        rawHtml.push( html );
      }
    }

    _.each(headings, function(heading) {
      html = _.nextUntil(heading, targetElems);
      html.unshift(heading);
      rawHtml.push( html );
    });

    S.sections = {
      raw: rawHtml
    };
  }

    function setupSections(sections) {
      var sectionData = [];

      function getHeadingText(section) {
        var heading = _.filter(section, function (el) {
          return el.nodeName === S.settings.sections.toUpperCase();
        });
        if (heading.length === 1)
          return heading[0].innerHTML;
        else
          console.error('Found more than one heading in this section');
      }

      _.each(sections, function(section, i) {

        var subData = [];
        var sectionId = 'scrollNav-' + (i + 1);
        var isFirst = function() { return i === 0; };
        var hasHeading = function() { return !_.is(section[0], S.settings.sections); };
        var text = ( S.settings.showTopLink && isFirst() && hasHeading() ) ? S.settings.topLinkText : getHeadingText(section);

        _.wrapAll({ elms: section, wrapEl: S.settings.sectionElem, id: sectionId, class: S.settings.className + '__section' });

        // Sub Sections
        // if (S.settings.subSections) {
        //   var $sub_sections  = $this_section.filter(S.settings.subSections);
        //
        //   if ($sub_sections.length > 0) {
        //     $sub_sections.each(function(i) {
        //       var sub_id      = section_id + '-' + (i + 1);
        //       var sub_text    = $(this).text();
        //       var $this_sub   = $this_section.filter($(this).nextUntil($sub_sections).andSelf());
        //
        //       $this_sub.wrapAll('<div id="' + sub_id + '" class="' + S.settings.className + '__sub-section" />');
        //       sub_data.push( {id: sub_id, text: sub_text} );
        //     });
        //   }
        // }

        sectionData.push( {id: sectionId, text: text, subSections: subData} );
      });

      S.sections.data = sectionData;
    }

    function setBodyClass(state) {
      // Set and swap our loading hooks to the body
      var body = document.body;

      if (state === 'loading') {
        _.addClass(body, S.classes.loading);
      } else if (state === 'success') {
        _.removeClass(body, S.classes.loading);
        _.addClass(body, S.classes.success);
      } else {
        _.removeClass(body, S.classes.loading);
        _.addClass(bodyS.classes.failed);
      }
    }

    module.exports.init = init;

})();
