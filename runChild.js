const updater = require('./updater.js');
const asyncLib = require('async');
const { author } = require('../../package.json');

var gauntlets = [
    '340002',
    '340007',
    '340008',
    '340009',
];

var gauntletNum = () => {
    return (isNaN(+process.argv[3]) ? 0 : (process.argv[3] - 1));
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

function runChildModule() {
    return new Promise((resolve, reject) => {
        if (process.argv.includes('update')) {
            return resolve(null);
        }
        asyncLib.waterfall([
            asyncLib.constant(courseData),
            require('create-course-object'),
            require('./adjustFilePaths.js'),
            require('index-directory').conversionTool,
            require('./postImport.js'),
            require('../../main.js')
        ], (err, course) => {
            if (err) return reject(err);
            if (process.argv.includes('test')) {
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

function process() {
    updater()
        .then(runChildModule)
        .then((course) => {
            if (course !== null) {
                console.log(`Process complete! Course Link:\n https://byui.instructure.com/courses/${course.info.canvasOU}`);
            }
        })
        .catch((err) => {
            console.error(err);
            console.log('\nIs your local gauntlet up-to-date? Try running:\n npm start update\n');
        });
}


process();

module.exports = () => {
    process();
}
