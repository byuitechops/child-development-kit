const updater = require('./gauntlets.js');
const asyncLib = require('async');

function runChildModule() {
    return new Promise((resolve, reject) => {
        asyncLib.waterfall([
            require('create-course-object'),
            require('./adjustFilePaths.js'),
            require('index-directory'),
            // require('./postImport.js'),
            require('../../main.js')
        ], (err, course) => {
            // if (err) return reject(err);
            resolve(course);
        });
    });
}

updater()
    .then(runChildModule)
    .catch(console.error);
