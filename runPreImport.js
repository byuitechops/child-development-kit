const prompt = require('prompt');
const chalk = require('chalk');
const path = require('path');
const createCourseObj = require('create-course-object');
const indexCourse = require('index-directory').conversionTool;
const asyncLib = require('async');
const verify = require('course-object-verifier');
const standardTests = require('child-module-standard-tests');

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
                verify,
                childModule,
                verify
            ], (waterErr, resultCourse) => {
                if (waterErr) {
                    console.error(waterErr);
                    console.log('\nYou may need to update your gauntlets with:\n\n \t"npm start -- update d2l"\n');
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

        if (gauntletNum != -1) {
            buildCourse(gauntlets[gauntletNum], (err, course) => {
                if (err) finalCallback(err, course);
                else finalCallback(null, course);
            });
        } else {
            asyncLib.mapSeries(gauntlets, buildCourse, (err, allCourses) => {
                if (err) finalCallback(err, allCourses);
                else finalCallback(null, allCourses);
            });
        }

}
