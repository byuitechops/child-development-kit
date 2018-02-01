/* eslint no-console:1 */

const path = require('path');
const createCourseObj = require('create-course-object');
const indexCourse = require('index-directory').conversionTool;
const asyncLib = require('async');
const verify = require('course-object-verifier');
const standardTests = require('child-module-standard-tests');
const findUsedFiles = require('files-find-used-content');

const gauntlets = [
    'Conversion Test Gauntlet 1.zip',
    'Conversion Test Gauntlet 2.zip',
    'Conversion Test Gauntlet 3.zip',
    'Conversion Test Gauntlet 4.zip'
];

var adjustFilepaths = function (course, cb) {
    course.info.originalZipPath = path.join('.', 'node_modules/child-development-kit/factory/originalZip', course.info.fileName);
    course.info.unzippedPath = path.join('.', 'node_modules/child-development-kit/factory/unzipped', course.info.fileName
        .split('.zip')[0]);
    course.success('adjustFilepaths', 'File paths adjusted for testing.');
    cb(null, course);
};

module.exports = (childModule, gauntletNum, finalCallback) => {

    function buildCourse(item, mapCallback) {

        const courseData = {
            settings: {
                'debug': true,
                'readAll': true,
                'online': true,
                'keepFiles': true,
                'deleteCourse': false,
                'useDownloader': false
            },
            courseInfo: {
                path: path.join('.', item)
            }
            
        };

        asyncLib.waterfall([
            (callback) => {
                console.log('---');
                console.log(`Building course:  ${item.split('.zip')[0]}`);
                callback();
            },
            asyncLib.constant(courseData),
            createCourseObj,
            verify,
            adjustFilepaths,
            verify,
            standardTests,
            verify,
            indexCourse,
            verify,
            findUsedFiles,
            verify,
        ], (waterErr, resultCourse) => {
            if (waterErr) {
                mapCallback(waterErr, courseData.path);
            } else {
                mapCallback(null, resultCourse);
            }
        });
    }

    buildCourse(gauntlets[gauntletNum - 1], finalCallback);
};
