/*eslint-env node, es6*/
/*eslint no-console:0*/

/* Dependencies */
const downloader = require('d2l-course-downloader');
const decompress = require('decompress');
const del = require('del');
const chalk = require('chalk');
const path = require('path');

module.exports = () => {
    /* Deletes any old gauntlet zips or files */
    del(['./node_modules/child-development-kit/factory/unzipped/*',
        './node_modules/child-development-kit/factory/originalZip/*'
    ]).then(paths => {
        if (paths.length > 0) {
            console.log(chalk.yellow('Outdated Zips/Files deleted:\n', paths.join('\n')));
        } else {
            console.log(chalk.yellowBright('No outdated files to be deleted.\n'));
        }

        /* Download Information */
        var downloadData = {
            ous: ['340002', '340007', '340008', '340009'],
            domain: 'byui',
            downloadLocation: path.resolve('.', 'node_modules/child-development-kit/factory/originalZip')
        };

        /* Download all of the gauntlet courses */
        downloader(downloadData, (error, courses) => {
            if (error) {
                console.log(error);
            } else {
                courses.forEach(course => {
                    decompress(course.downloadLocation,
                            `./node_modules/child-development-kit/factory/unzipped/${course.name}`
                        )
                        .then((files) => {
                            console.log(chalk.blueBright(
                                `${course.name} successfully unzipped`));
                        }, (promiseError) => {
                            if (promiseError) console.error(chalk.red(promiseError));
                        });
                });
            }
        });
    });
}