/*eslint-env node, es6*/
/*eslint no-console:0*/

const path = require('path');
const chalk = require('chalk');
const childModule = require(path.resolve('.', './main.js'));
const preImportSetup = require('./preImportSetup.js');
const postImportSetup = require('./postImportSetup.js')
const updateD2L = require('./updateD2LGauntlets.js');
const { childType } = require(path.resolve('.', 'package.json'));
const verifyCourseUpload = require('./verifyCourseUpload.js');

var gauntletNum = 1;

if (process.argv.includes('update')) {
    updateD2L();
} else {
    if (process.argv.includes('gauntlet')) {
        gauntletNum = +process.argv[process.argv.indexOf('gauntlet') + 1];
        if (gauntletNum > 4 || gauntletNum < 1) {
            console.log(chalk.redBright('Invalid gauntlet number.'));
            return;
        }
    }

    preImportSetup(childModule, gauntletNum, (error, course) => {
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
                postImportSetup(gauntletNum, (postErr, courseID) => {
                    if (postErr) console.log(postErr);
                    else {
                        course.info.canvasOU = courseID;
                        verifyCourseUpload(course, (err, course) => {
                            childModule(course, (err, resultCourse) => {
                                console.log(chalk.greenBright(`Process Complete for Gauntlet: ${course.info.canvasOU}`));
                            });
                        });
                    }
                });
            } else {
                childModule(course, (err, resultCourse) => {
                    console.log(chalk.greenBright(`Process Complete for Gauntlet: ${course.info.canvasOU}`));
                });
            }
        }
    });
}
