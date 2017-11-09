#!/usr/bin/env node

const prompt = require('prompt');
const chalk = require('chalk');
const path = require('path');
const createCourseObj = require('create-course-object');
const indexCourse = require('index-directory').conversionTool;
const asyncLib = require('async');
const verify = require('course-object-verifier');
const standardTests = require('child-module-standard-tests');
const updateD2L = require('./updateD2LGauntlets');
// const updateCanvas = require('./updateCanvasGauntlets');

prompt.message = chalk.greenBright('Test Environment: ');
prompt.delimiter = '';

const gauntlets = [
    'Conversion Test Gauntlet 1.zip',
    'Conversion Test Gauntlet 2.zip',
    'Conversion Test Gauntlet 3.zip',
    'Conversion Test Gauntlet 4.zip'
];

const promptQuestions = {
    properties: {
        gauntletType: {
            description: chalk.whiteBright('Is this for Pre-Import or Post-Import? <pre|post>'),
            required: true,
            pattern: /pre*|post*/g,
            message: 'Must be either "pre" or "post"'
        },
        gauntletNumber: {
            description: chalk.whiteBright('Which Guantlet Course are you testing? <1-4>'),
            pattern: /1|2|3|4/g,
            default: 1
        }
    }
};

var adjustFilepaths = function (course, cb) {
    course.addModuleReport('adjustFilepaths');
    course.info.originalFilepath = path.join('.', 'D2LOriginal', course.info.fileName);
    course.info.unzippedFilepath = path.join('.', 'D2LProcessing', course.info.fileName.split('.zip')[0]);
    course.success('adjustFilepaths', 'File paths adjusted for testing.');
    cb(null, course);
}

exports.updateD2L = updateD2L;
// exports.updateCanvas = updateCanvas;
exports.preImportEnv = (childModule, gauntletNum, finalCallback) => {

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
