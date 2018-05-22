const updater = require('./updater.js');
const asyncLib = require('async');
const {
    author,
    name
} = require('../../package.json');

var gauntlets = [
    '340002',
    '340007',
    '340008',
    '340009',
];

var gauntletNum = () => {
    return isNaN(+process.argv[3]) ? 0 : process.argv[3] - 1;
};

var courseData = {
    domain: 'byui',
    platform: 'online',
    D2LOU: gauntlets[gauntletNum()],
    cleanUpModules: [],
    preImportModules: [],
    postImportModules: [],
    name: `Conversion Test Gauntlet ${gauntletNum() + 1}`,
    author: author
};

function setPlatform(course, callback) {
    course.settings.platform = 'online';
    callback(null, course);
}

function runChildModule() {

    return new Promise((resolve, reject) => {
        if (process.argv.includes('update')) {
            return resolve(null);
        }
        var workflow = [
            asyncLib.constant(courseData),
            require('create-course-object'),
            setPlatform,
            require('./adjustFilePaths.js'),
            require('index-directory'),
            require('./postImport.js'),
            require('../../main.js')
        ];

        /* add course-make-blueprint if it's not the child module being tested */
        if (name !== 'course-make-blueprint') {
            workflow.splice(workflow.length - 1, 0, require('course-make-blueprint'));
        }

        asyncLib.waterfall(workflow, (err, course) => {
            if (err) return reject(err);
            // npm_lifecycle_event is just "start" or "test" depending on which command you use
            if (process.env.npm_lifecycle_event === 'test') {
                var childTests = require('../../Tests/childTests.js');
                childTests(course, (err, courseObject) => {
                    if (err) return reject(err);
                    resolve(course);
                });
            } else {
                resolve(course);
            }
        });
    });
}

function runProcess() {
    updater()
        .then(runChildModule)
        .then((course) => {
            if (course !== null) {
                console.log(`Process complete! Course Link:\n https://byui.instructure.com/courses/${course.info.canvasOU}`);
            }
            if (course.info.prototypeOU) console.log(`Prototype Exists:\n https://byui.instructure.com/courses/${course.info.prototypeOU}`);
            if (course.info.backupOU) console.log(`Backup Created:\n https://byui.instructure.com/courses/${course.info.backupOU}`);
        })
        .catch((err) => {
            console.error(err);
            console.log('\nIs your local gauntlet up-to-date? Try running:\n npm start update\n');
        });
}


runProcess();