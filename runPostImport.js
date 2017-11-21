const copyCourse = require('copy-a-canvas-course');
const https = require('https');
const path = require('path');
const createCourseObj = require('create-course-object');
const indexCourse = require('index-directory').conversionTool;
const asyncLib = require('async');
const verify = require('course-object-verifier');
const standardTests = require('child-module-standard-tests');

var canvasGauntlets;
var canvasOU;

const gauntlets = [
    'Conversion Test Gauntlet 1.zip',
    'Conversion Test Gauntlet 2.zip',
    'Conversion Test Gauntlet 3.zip',
    'Conversion Test Gauntlet 4.zip'
];

var adjustFilepaths = function (course, cb) {
    course.addModuleReport('adjustFilepaths');
    course.info.originalFilepath = path.join('.', 'node_modules/child-development-kit/D2LOriginal', course.info.fileName);
    course.info.unzippedFilepath = path.join('.', 'node_modules/child-development-kit/D2LProcessing', course.info.fileName
        .split('.zip')[0]);
    course.success('adjustFilepaths', 'File paths adjusted for testing.');
    cb(null, course);
}

module.exports = (childModule, gauntletNum, stepCallback) => {

    function copyGauntlet(callback) {
        https.get('https://raw.githubusercontent.com/byuitechops/canvas-gauntlet-ous/master/canvas-ous.json', (res) => {
            res.setEncoding('utf8');
            res.on('data', (d) => {
                canvasGauntlets = JSON.parse(d);
                // Copy the course
                copyCourse(canvasGauntlets[`Gauntlet ${gauntletNum + 1}`], 14, (err, newCourse) => {
                    if (err) {
                        callback(err, newCourse);
                    }
                    else {
                        canvasOU = newCourse.id;
                        callback(null, newCourse.id);
                    }
                });
            });
        }).on('error', (e) => {
            callback(e);
        });
    }

    function buildCourse(item, mapCallback) {
        var gauntletPath = path.join('.', item);
        asyncLib.waterfall([
            (callback) => {
                console.log(`---`);
                console.log(`Building course:  ${item.split('.zip')[0]}`);
                callback(null);
            },
            copyGauntlet,
            asyncLib.constant(gauntletPath, settings),
            createCourseObj,
            verify,
            adjustFilepaths,
            verify,
            (course, callback) => {
                course.info.canvasOU = canvasOU;
                callback(null, course);
            },
            standardTests,
            verify,
            indexCourse,
            verify,
            childModule,
            verify
        ], (err, result) => {
            if (err) stepCallback(err, result);
            else stepCallback(null, result);
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
};
