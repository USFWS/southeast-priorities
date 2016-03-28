(function () {
  'use strict';

  var replace = require('replace-in-file');

  replace({
    files: 'dist/index.html',
    replace: 'style="background-image: url(\'../',
    with: 'style="background-image: url(\'http://intranet.fws.gov/'
  }, function(err, changedFiles) {
    if (err) return console.error(err);
    console.log('Modified files:', changedFiles.join(', '));
  });
})();
