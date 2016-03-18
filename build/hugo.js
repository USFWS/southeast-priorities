(function () {
  'use strict';

  var spawn = require('child_process').spawn;
  var hugo = spawn('hugo', [
    '--config=site/config.yml',
    '--destination=../dist/',
    '--source=site/',
    '--baseURL=' + process.argv[3]
  ]);

  hugo.stdout.on('data', function (data) {
    console.log(data.toString('utf8'));
  });

  hugo.stderr.on('data', function (data) {
    console.error(data.toString('utf8'));
  });

})();
