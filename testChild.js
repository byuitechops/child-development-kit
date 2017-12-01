const childModule = require('../../main.js');
const preImportSetup = require('./preImportSetup.js');
const postImportSetup = require('./postImportSetup.js');
const childTests = require('../../Tests/childTests.js');
const asyncLib = require('async');

/* Test object:
    {
        gauntlet: 1 // Always a number 1 - 4
        tests: function(course, callback) // contains all the tests
    }
*/
function runTests(testObject, callback) {
    preImportSetup(childModule, testObject.gauntlet, (error, course) => {
        if (error) {
            console.error(chalk.redBright(error));
            console.log(`\nYou may need to update your D2L gauntlets with:\n\n \t${chalk.blueBright("npm start -- update")}\n`);
        } else {
            if (childType != 'postImport' && childType != 'preImport') {
                console.log(
                    'Incorrect type set on child module package.json. Please specify "preImport" or "postImport"'
                );
                return;
            }
            if (childType === 'postImport') {
                postImportSetup(testObject.gauntlet, (postErr, courseID) => {
                    if (postErr) console.log(postErr);
                    else {
                        course.info.canvasOU = courseID;
                        childModule(course, (err, resultCourse) => {
                            console.log(
                                chalk.greenBright(`Setup and your Child Module have ran. Running tests for Gauntlet ${testObject.gauntlet}.`)
                            );
                            testObject.tests(course, callback);
                        });
                    }
                });
            } else {
                childModule(course, (err, resultCourse) => {
                    console.log(
                        chalk.greenBright(`Setup and your Child Module have ran. Running tests for Gauntlet ${testObject.gauntlet}.`)
                    );
                    testObject.tests(course, callback);
                });
            }
        }
    });
}

asyncLib.series(childTests, runTests, err => {
    console.log('All tests are complete.');
});
