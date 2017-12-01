const chalk = require('chalk');
const path = require('path');
const createCourseObj = require('create-course-object');
const indexCourse = require('index-directory').conversionTool;
const asyncLib = require('async');
const verify = require('course-object-verifier');
const standardTests = require('child-module-standard-tests');

const gauntlets = [
    'Conversion Test Gauntlet 1.zip',
    'Conversion Test Gauntlet 2.zip',
    'Conversion Test Gauntlet 3.zip',
    'Conversion Test Gauntlet 4.zip'
];

var adjustFilepaths = function (course, cb) {
    course.addModuleReport('adjustFilepaths');
    course.info.originalFilepath = path.join('.', 'node_modules/child-development-kit/D2LOriginal', course.info.fileName);
    course.info.unzippedFilepath = path.join('.', 'node_modules/child-development-kit/D2LProcessing', course.info.fileName.split('.zip')[0]);
    course.success('adjustFilepaths', 'File paths adjusted for testing.');
    cb(null, course);
}

module.exports = (childModule, gauntletNum, finalCallback) => {

        function buildCourse(item, mapCallback) {
            var gauntletPath = path.join('.', item);
            asyncLib.waterfall([
                (callback) => {
                    console.log(`---`);
                    console.log(`Building course:  ${item.split('.zip')[0]}`);
                    callback();
                },
                asyncLib.constant(gauntletPath, settings),
                createCourseObj,
                verify,
                adjustFilepaths,
                verify,
                standardTests,
                verify,
                indexCourse,
                verify
            ], (waterErr, resultCourse) => {
                if (waterErr) {
                    console.error(waterErr);
                    console.log(`\nYou may need to update your D2L gauntlets with:\n\n \t${chalk.blueBright("npm start -- update")}\n`);
                    mapCallback(waterErr, gauntletPath);
                }
                else {
                    mapCallback(null, resultCourse);
                }
            });
        }

        const settings = {
            'debug': true,
            'readAll': true,
            'online': true,
            'keepFiles': true,
            'deleteCourse': false,
            'useDownloader': false
        };

        buildCourse(gauntlets[gauntletNum], finalCallback);
}
