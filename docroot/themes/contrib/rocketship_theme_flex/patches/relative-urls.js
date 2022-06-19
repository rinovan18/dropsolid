const fs = require('fs');
var glob = require("glob");
const myFiles = '../../../styleguide/main.*.bundle.js';

glob(myFiles, {nonull:true}, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
  if (er !== null) {
    console.log('log error');
    console.log(er);
  }

  // Fix for relative paths in CSS
  for (let i in files) {
    const f = files[i];

    fs.readFile(f, 'utf8', function (err,data) {

      if (err) {
        return console.log(err);
      }

      var result = data.replace(/url\("..\/fonts\//g, 'url\("');
      result = result.replace(/url\("..\/images\//g, 'url\("');
      result = result.replace(/url\("..\/icons\//g, 'url\("');

      fs.writeFile(f, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }

});
