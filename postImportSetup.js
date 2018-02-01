/* eslint no-console:0 */

const copyCourse = require('copy-a-canvas-course');
const canvas = require('canvas-wrapper');
const chalk = require('chalk');


module.exports = (gauntletNum, finalCallback) => {

    function copyGauntlet(callback) {
        canvas.get(`/api/v1/accounts/1/courses?search_term=${gauntletNum}%20(Pristine)`, (getErr, course) => {
            if (getErr) {
                callback(getErr);
                return;
            }
            var courseID = course[0].id;
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

    copyGauntlet((err, courseID) => {
        if (err) {
            console.log(`ERROR: ${err}`);
        }
        else {
            setName(courseID, finalCallback);
        }
    });

};
