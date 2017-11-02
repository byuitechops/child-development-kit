/* Dependencies */
const downloader = require('d2l-course-downloader').gauntlets;
const decompress = require('decompress');
const del = require('del');
const chalk = require('chalk');
const asyncLib = require('async');

module.exports = () => {
    /* Deletes any old gauntlet zips or files */
    del(['./D2LOriginal/*', './D2LProcessing/*']).then(paths => {
        if (paths.length > 0) {
            console.log(chalk.yellow('Outdated Zips/Files deleted:\n', paths.join('\n')));
        } else {
            console.log(chalk.yellowBright('No outdated files to be deleted.\n'));
        }
        /* Download all of the gauntlet courses */
        downloader(courses => {
            asyncLib.each(courses, (course, callback) => {
                /* Unzip the gauntlet courses */
                decompress(course.filePath, `./D2LProcessing/${course.name}`)
                .then((files) => {
                    console.log(chalk.blueBright(`${course.name} successfully unzipped`));
                    callback(null);
                }, (promiseError) => {
                    if (promiseError) console.error(promiseError);
                    callback(null);
                });
            }, error => {
                console.log(chalk.cyanBright(`Your local Gauntlet Test Courses are now up-to-date.`));
            });
        });
    });
}
