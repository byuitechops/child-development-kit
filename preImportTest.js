const createCourseObj = require('create-course-object');
const indexCourse = require('index-directory').conversionTool;
const asyncLib = require('async');
const childModule = require('./myChildModule');
const verify = require('course-object-verifier');

module.exports = (filepath, stepCallback) => {
    console.log(filepath);
    const settings = {
        'debug': true,
        'readAll': true,
        'online': true,
        'keepFiles': true,
        'deleteCourse': false,
        'useDownloader': false
    };

    asyncLib.waterfall([
        asyncLib.constant(filepath, settings),
        createCourseObj,
        verify,
        indexCourse,
        verify,
        childModule,
        verify
    ], (waterErr, result) => {
        if (waterErr) console.error(waterErr);
        else {

        }
    });

}
