var fs = require('fs-extra');

fs.copy('settings.js.sample', 'settings.js', function(err) { 
  if (err)
    console.log("Error copying settings", err);
});
