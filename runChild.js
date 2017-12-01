const path = require('path');
const childModule = require(path.resolve('.', './main.js'));
const preImportSetup = require('./preImportSetup.js');
const postImportSetup = require('./postImportSetup.js')
const updateD2L = require('./updateD2LGauntlets.js');

const {
    childType
} = require(path.resolve('.', 'package.json'));
var gauntletNum = 0;

if (process.argv.includes('update')) {
    updateD2L();
} else {
    if (process.argv.includes('gauntlet')) {
        gauntletNum = process.argv[process.argv.indexOf('gauntlet') + 1] + 1;
        if (gauntletNum > 4 || gauntletNum < 1) {
            console.log('Invalid gauntlet number.');
        }
    }

    preImportSetup(childModule, gauntletNum, (error, course) => {
        if (error) console.error(error);
        else {
            if (childType != 'postImport' && childType != 'preImport') {
                console.log(
                    'Incorrect type set on child module package.json. Please specify "preImport" or "postImport"'
                );
                return;
            }
            if (childType === 'postImport') {
                postImportSetup(gauntletNum, (postErr, courseID) => {
                    if (postErr) console.log(postErr);
                    else {
                        course.info.canvasOU = courseID;
                        childModule(course, (err, resultCourse) => {
                            console.log('Complete');
                        });
                    }
                });
            } else {
                childModule(course, (err, resultCourse) => {
                    console.log('Complete');
                });
            }
        }
    });
}
