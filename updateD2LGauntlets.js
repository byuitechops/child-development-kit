/* Dependencies */
const downloader = require('d2l-course-downloader');
const decompress = require('decompress');
const del = require('del');
const chalk = require('chalk');
const path = require('path');

module.exports = () => {
    /* Deletes any old gauntlet zips or files */
    del(['./node_modules/child-development-kit/D2LOriginal/*',
        './node_modules/child-development-kit/D2LProcessing/*'
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
            downloadLocation: path.resolve('.', 'node_modules/child-development-kit/D2LOriginal')
        };

        /* Download all of the gauntlet courses */
        downloader(downloadData, (error, courses) => {
            if (error) console.error(error);
            console.log(chalk.cyanBright(
                `Your local Gauntlet Test Courses are now up-to-date.`));
        });
    });
}
