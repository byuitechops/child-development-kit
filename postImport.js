const canvas = require('canvas-wrapper');
const copyCourse = require('copy-a-canvas-course');
const chalk = require('chalk');
const { childType } = require('../../package.json');

module.exports = (course, callback) => {

    function getPristine() {
        return new Promise((resolve, reject) => {
            var gauntletNum = course.info.fileName.split('.zip')[0];
            gauntletNum = gauntletNum[gauntletNum.length - 1];
            canvas.get(`/api/v1/accounts/1/courses?search_term=${gauntletNum} (Pristine)`, (getErr, foundCourse) => {
                if (getErr) return reject(getErr);
                if (course.length < 1) return reject(new Error('Cannot find Pristine Gauntlet.'));
                resolve(foundCourse[0]);
            });
        });
    }

    function copyTheCourse(foundCourse) {
        return new Promise((resolve, reject) => {
            copyCourse(foundCourse.id, 19, (err, newCourse) => {
                if (err) return reject(err);
                course.info.canvasOU = newCourse.id;
                resolve(newCourse);
            });
        });
    }

    function changeName(newCourse) {
        return new Promise((resolve, reject) => {
            var today = new Date();
            var minutes = (today.getMinutes() < 10) ? '0' + today.getMinutes() : today.getMinutes();
            canvas.put(`/api/v1/courses/${newCourse.id}`,
                {
                    'course[name]': `Conversion Gauntlet ${today.getMonth() + 1}/${today.getDate()} ${today.getHours()}:${minutes} - ${course.info.author}`,
                    'course[course_code]': `CG ${today.getMonth() + 1}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}`,
                },
                (err, changedCourse) => {
                    if (err) return reject(err);
                    console.log(chalk.blueBright(`Gauntlet Course Name: ${chalk.greenBright(changedCourse.id)} - Conversion Gauntlet ${today.getMonth() + 1}/${today.getDate()} ${today.getHours()}:${minutes}`));
                    resolve(changedCourse)
                });
        });
    }

    if (childType === 'preImport') {
        callback(null, course);
        return;
    }

    return getPristine()
        .then(copyTheCourse)
        .then(changeName)
        // ADD COURSE BLUPEINRT MAKERR DEAL
        .then(changedCourse => {
            callback(null, course);
        })
        .catch(callback);
}


