const copyCourse = require('copy-a-canvas-course');
const https = require('https');
const path = require('path');
const createCourseObj = require('create-course-object');
const indexCourse = require('index-directory').conversionTool;
const asyncLib = require('async');
const verify = require('course-object-verifier');
const standardTests = require('child-module-standard-tests');

var canvasGauntlets;

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

module.exports = (gauntletNum, finalCallback) => {

    function copyGauntlet(callback) {
        https.get('https://raw.githubusercontent.com/byuitechops/canvas-gauntlet-ous/master/canvas-ous.json', (res) => {
            res.setEncoding('utf8');
            res.on('data', (d) => {
                canvasGauntlets = JSON.parse(d);
                // Copy the course
                copyCourse(canvasGauntlets[`Gauntlet ${gauntletNum}`], 19, (err, newCourse) => {
                    if (err) {
                        callback(err, newCourse.id);
                    }
                    else {
                        callback(null, newCourse.id);
                    }
                });
            });
        }).on('error', (e) => {
            callback(e);
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

    copyGauntlet(finalCallback);

};
