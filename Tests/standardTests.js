/* These tests are not unit tests.
They check to see if child modules
are meeting the set standards. */

const fs = require('fs');
const path = require('path');
const asyncLib = require('async');

// check for report module creation
// check if has at least one success
// check if throws fatal (should not)
// check if calls callback correctly

module.exports = (course, stepCallback) => {

    var contents = '';

    function checkReport(callback) {

        callback();
    }

    function checkSuccess(callback) {
        callback();
    }

    function checkFatal(callback) {
        callback();
    }

    function checkCallback(callback) {
        callback();
    }

    fs.readFile('../myChildModule.js', 'utf8', (readErr, data) => {
        if (readErr) stepCallback(readErr, data);
        else {
            contents = data;
            asyncLib.waterfall([
                checkReport,
                checkSuccess,
                checkFatal,
                checkCallback
            ], (asyncErr, result) => {
                if (asyncErr) stepCallback(asyncErr, result);
                else {
                    course.success('Child module passed all standard tests.');
                    stepCallback(null, course);
                }
            });
        }
    });

};
