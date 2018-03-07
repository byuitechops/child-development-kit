const updater = require('./updater.js');
const asyncLib = require('async');
const { author } = require('../../package.json')

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
        asyncLib.waterfall([
            asyncLib.constant(courseData),
            require('create-course-object'),
            require('./adjustFilePaths.js'),
            require('index-directory').conversionTool,
            require('./postImport.js'),
            require('../../main.js')
        ], (err, course) => {
            if (err) return reject(err);
            resolve(course);
        });
    });
}

updater()
    .then(runChildModule)
    .then((course) => {
        console.log(`Process complete! Course Link:\n https://byui.instructure.com/courses/${course.info.canvasOU}`);
    })
    .catch(console.error);
