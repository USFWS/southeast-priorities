(function () {
  'use strict';
  var zenscroll = require('zenscroll');
  var Parallaxify = require('parallaxify');
  var ImageComparison = require('./imageComparison');
  var fitText = require('./fittext');
  var dots = require('./dots');
  var nav = require('./nav');
  var lists = require('./short-list');
  var _ = require('./util');
  // var graph = require('./graph');

  // Scroll speed and offset (offset is for fixed navigation)
  zenscroll.setup(777, 50);

  var sr = require('scrollreveal')({ reset: true });

  new Parallaxify().registerUpdate();
  sr.reveal('.reveal');
  fitText( document.getElementsByClassName('section-heading'));

  nav.init({
    target: document.querySelector('.mini-nav'),
    headings: '.section-heading'
  });

  dots.init({
    container: document.getElementById('content'),
    className: 'dot-nav',
    showHeadline: false
  });

  lists.init({
    elements: document.querySelectorAll('.fade-list')
  });

  // graph.init();

  _.each(document.querySelectorAll('.download-link'), function(link) {
    link.addEventListener('click', recordDownload);
  });

  function recordDownload () {
    ga('send', 'event', 'Priorities Document', 'download');
  }

  document.addEventListener('DOMContentLoaded', domReady);

  function domReady() {

    var imageComparisonCollection = document.querySelectorAll('.image-comparison');
    for (var i = 0; i < imageComparisonCollection.length; i++) {
      var imageWidget = imageComparisonCollection[i];
      var images = imageWidget.querySelectorAll('.comparison-image');
      new window.ImageComparison({
        container: imageWidget,
        startPosition: 50,
        data: [
          {
            image: images[0],
            label: 'Year: 2009'
          },
          {
            image: images[1],
            label: 'Year: 2060'
          }
        ],
      });
    }
  }

})();
