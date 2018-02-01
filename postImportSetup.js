const copyCourse = require('copy-a-canvas-course');
const https = require('https');
const path = require('path');
const createCourseObj = require('create-course-object');
const indexCourse = require('index-directory').conversionTool;
const asyncLib = require('async');
const verify = require('course-object-verifier');
const standardTests = require('child-module-standard-tests');
const canvas = require('canvas-wrapper');
const verifyCourseUpload = require('./verifyCourseUpload.js');
const chalk = require('chalk');

var canvasGauntlets;

const gauntlets = [
    'Conversion Test Gauntlet 1.zip',
    'Conversion Test Gauntlet 2.zip',
    'Conversion Test Gauntlet 3.zip',
    'Conversion Test Gauntlet 4.zip'
];

var adjustFilepaths = function (course, cb) {
    course.addModuleReport('adjustFilepaths');
    course.info.originalFilepath = path.join('.', 'node_modules/child-development-kit/factory/originalZip', course.info.fileName);
    course.info.unzippedFilepath = path.join('.', 'node_modules/child-development-kit/factory/unzipped', course.info.fileName
        .split('.zip')[0]);
    course.success('adjustFilepaths', 'File paths adjusted for testing.');
    cb(null, course);
}

module.exports = (gauntletNum, finalCallback) => {

    function copyGauntlet(callback) {
        canvas.get(`/api/v1/accounts/1/courses?search_term=${gauntletNum}%20(Pristine)`, (getErr, course) => {
            if (getErr) {
                callback(getErr);
                return;
            }
            courseID = course[0].id;
            copyCourse(courseID, 19, (err, newCourse) => {
                if (err) {
                    callback(err, newCourse.id);
                } else {
                    callback(null, newCourse.id);
                }
            });
        });
    }

    function setName(courseID, callback) {
        var today = new Date();
        var minutes = (today.getMinutes() < 10) ? '0' + today.getMinutes() : today.getMinutes();
        canvas.put(`/api/v1/courses/${courseID}`,
            {
                'course[name]': `Conversion Gauntlet ${today.getMonth() + 1}/${today.getDate()} ${today.getHours()}:${minutes}`,
                'course[course_code]': `CG ${today.getMonth() + 1}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}`,
            },
            (err, changedCourse) => {
                if (err) {
                    callback(err);
                } else {
                    console.log(chalk.blueBright(`Gauntlet Course Name: ${chalk.greenBright(changedCourse.id)} - Conversion Gauntlet ${today.getMonth() + 1}/${today.getDate()} ${today.getHours()}:${minutes}`));
                    callback(null, changedCourse.id);
                }
            }
        );
    }

    const settings = {
        'debug': true,
        'readAll': true,
        'online': true,
        'keepFiles': true,
        'deleteCourse': false,
        'useDownloader': false
    };

    copyGauntlet((err, courseID) => {
        setName(courseID, finalCallback);
    });

};
