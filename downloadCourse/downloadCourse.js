const main = require('../main.js');

exports.run = (returnCallback) => {

  /* STEP LOGIC GOES HERE */

  // temporarily setting a random folder name
  main.setFilename('coursefolder.zip');

  console.log('Step 1: Download Course - Complete');
  returnCallback();
};
