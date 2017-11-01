const prompt = require('prompt');
const chalk = require('chalk');
const path = require('path');
const createCourseObj = require('create-course-object');
const indexCourse = require('index-directory').conversionTool;
const asyncLib = require('async');
const verify = require('course-object-verifier');

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

function adjustFilepaths (course, cb) {
    course.info.originalFilepath = path.join('.', 'node_modules/child-development-kit/D2LOriginal', course.info.fileName);
    course.info.unzippedFilepath = path.join('.', 'node_modules/child-development-kit/D2LProcessing', course.info.fileName.split('.zip')[0]);
    course.info.altUnzippedFilepath = path.join('.', 'node_modules/child-development-kit/D2LProcessed', course.info.fileName.split('.zip')[0]);
    course.info.zippedFilepath = path.join('.', 'node_modules/child-development-kit/D2LReady', course.info.fileName);
    callback(null, course);
}

module.exports = (childModule, finalCallback) => {
    prompt.start();
    prompt.get(promptQuestions, (err, result) => {
        /* If the user said PreImport */
        if (result.gauntletType === 'pre') {

            var gauntletPath = path.join('.', gauntlets[result.gauntletNumber]);
            const settings = {
                'debug': true,
                'readAll': true,
                'online': true,
                'keepFiles': true,
                'deleteCourse': false,
                'useDownloader': false
            };

            asyncLib.waterfall([
                asyncLib.constant(gauntletPath, settings),
                createCourseObj,
                adjustFilepaths,
                verify,
                indexCourse,
                verify,
                childModule,
                verify
            ], (waterErr, resultCourse) => {
                if (waterErr) console.error(waterErr);
                else {
                    finalCallback(null, resultCourse);
                }
            });

        /* If the user said PostImport */
        } else {

        }
    });
}
