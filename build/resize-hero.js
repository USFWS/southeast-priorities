(function () {
  'use strict';
  var sharp = require('sharp');
  var Imagemin = require('imagemin');
  var rename = require('gulp-rename');
  var mkdirp = require('mkdirp');
  var fs = require('fs');

  var input = 'src/images/hero/';
  var output = 'site/static/images/hero/';
  var images = fs.readdirSync(input);

  // If there's a DS Store item, remove it
  var i = images.indexOf('.DS_Store');
  if (i > -1) images.splice(i,1);

  // Ensure the output dir exists
  mkdirp(output, function(err) {
    if (err) console.error(err);

    images.forEach(function (name) {
      var img = sharp(input + name);
      img
        .resize(1100)
        .toBuffer(function (err, buffer, info) {
          if (err) console.error(err);
          jpegmin(buffer, name);
        });
    });
  });

  function jpegmin(buffer, name) {
    new Imagemin()
      .src(buffer)
      .dest(output)
      .use(Imagemin.jpegtran({ progressive: true }))
      .use(rename(name))
      .run();
  }

})();
