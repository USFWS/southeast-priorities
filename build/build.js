(function () {
  'use strict';

  var replace = require('replace-in-file');

  replace({
    files: 'dist/index.html',
    replace: /style="background-image: url\('..\/images\/hero\//g,
    with: 'style="background-image: url(\'http://www.fws.gov/southeast/priorities/images/hero/'
  }, function(err, changedFiles) {
    if (err) return console.error(err);
    console.log('Modified files:', changedFiles.join(', '));
  });
})();
