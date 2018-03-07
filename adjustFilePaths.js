const path = require('path');

var gauntletNum = () => {
    if (process.argv[2]) {
        return process.argv[2];
    } else {
        return 1;
    }
};

module.exports = function (course, cb) {
    course.info.originalZipPath = path.join('.', 'node_modules/child-development-kit/factory/originalZip', course.info.fileName);
    course.info.unzippedPath = path.join('.', 'node_modules/child-development-kit/factory/unzipped', course.info.fileName.split('.zip')[0]);
    course.message('File paths adjusted for testing.');
    course.info.gauntletNum = gauntletNum();
    cb(null, course);
};