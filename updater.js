const downloader = require('d2l-course-downloader');
const Enquirer = require('enquirer');
const del = require('del');
const decompress = require('decompress');
const fs = require('fs');
var enquirer = new Enquirer();

enquirer.register('password', require('prompt-password'));

/* User Username */
if (!process.env.USR) {
    enquirer.question('username', 'Username:', {
        errorMessage: 'Cannot be blank!',
        validate: (input) => {
            return input != '';
        }
    });
}

/* User Password */
if (!process.env.PASS) {
    enquirer.question('password', {
        type: 'password',
        message: 'Password:',
        errorMessage: 'Cannot be blank!',
        validate: (input) => {
            return input != '';
        }
    });
}

var gauntlets = [
    '340002',
    '340007',
    '340008',
    '340009',
];

var gauntletNum = () => {
    return isNaN(+process.argv[3]) ? 0 : process.argv[3] - 1;
};

var userData = {
    domain: 'byui',
    platform: 'online',
    D2LOU: gauntlets[gauntletNum()],
    downloadLocation: './node_modules/child-development-kit/factory/originalZip'
};


module.exports = () => {
    return new Promise((resolve, reject) => {

        /* If we aren't updating, just move on to next part */
        if (!process.argv.includes('update')) {
            return resolve();
        }

        /* Delete all old gauntlets */
        let deletedPaths = del.sync(['./node_modules/child-development-kit/factory/unzipped/*',
            './node_modules/child-development-kit/factory/originalZip/*'
        ]);

        deletedPaths.length ? console.log('Old gauntlets deleted.'): console.log('No gauntlets found.');

        /* create ./factory/originalZip if needed */
        if (!fs.existsSync('./node_modules/child-development-kit/factory/originalZip')) {
            if (!fs.existsSync('./node_modules/child-development-kit/factory')) {
                fs.mkdirSync('./node_modules/child-development-kit/factory');
            }
            fs.mkdirSync('./node_modules/child-development-kit/factory/originalZip');
        }

        /* Get username/password */
        enquirer.ask()
            .then((answers) => {
                userData.username = answers.username ? answers.username : process.env.USR;
                userData.password = answers.password ? answers.password : process.env.PASS;
                return userData;
            })
        /* Download the course */
            .then(downloader)
        /* Unzip the course */
            .then((downloadData) => {
                return decompress(`./node_modules/child-development-kit/factory/originalZip/Conversion Test Gauntlet ${gauntletNum() + 1}.zip`, `./node_modules/child-development-kit/factory/unzipped/Conversion Test Gauntlet ${gauntletNum() + 1}`);
            })
            .then((paths) => {
                console.log('Gauntlet is now up-to-date.');
                return resolve();
            })
            .catch(reject);
    });
};