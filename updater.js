const downloader = require('d2l-course-downloader');
const Enquirer = require('enquirer');
const del = require('del');
const decompress = require('decompress');
var enquirer = new Enquirer();

enquirer.register('password', require('prompt-password'));

/* User Username */
enquirer.question('username', 'Username:', {
    errorMessage: 'Cannot be blank!',
    validate: (input) => {
        return input != '';
    }
});

/* User Password */
enquirer.question('password', {
    type: 'password',
    message: 'Password:',
    errorMessage: 'Cannot be blank!',
    validate: (input) => {
        return input != '';
    }
});

var gauntlets = [
    '340002',
    '340007',
    '340008',
    '340009',
];

var gauntletNum = () => {
    return (isNaN(+process.argv[3]) ? 0 : (process.argv[3] - 1));
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
        del.sync(['./node_modules/child-development-kit/factory/unzipped/*',
            './node_modules/child-development-kit/factory/originalZip/*'
        ]);

        console.log('Old gauntlets deleted.');

        /* Get username/password */
        enquirer.ask()
            .then((answers) => {
                userData.username = answers.username;
                userData.password = answers.password;
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
            })
            .catch(reject);
    });
};