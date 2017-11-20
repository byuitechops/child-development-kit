const path = require('path');
const childModule = require(path.resolve('.', './main.js'));
const runPreImport = require('./runPreImport.js');
const runPostImport = require('./runPostImport.js');
const updateD2L = require('./updateD2LGauntlets.js');
const updateCanvas = require('./updateCanvasGauntlets.js');
const { type } = require('../../package.json');
var gauntletNum = 0;

if (process.argv.includes('update')) {
    if (process.argv.includes('d2l')) {
        updateD2L();
    } else if (process.argv.includes('canvas')) {
        updateCanvas();
    } else {
        console.log('Please specify "d2l" or "canvas" when updating.');
    }

/* Launch the module */
} else {
    if (process.argv.includes('gauntlet')) {
        gauntletNum = process.argv[process.argv.indexOf('gauntlet') + 1];
        if (gauntletNum > 4 || gauntletNum < 1) {
            console.log('Invalid gauntlet number.');
        }
    }
    console.log('Running your child module on Gauntlet ' + gauntletNum);
    if (type === 'preImport') {
        runPreImport(childModule, gauntletNum, (error, allCourses) => {
            if (error) console.error(error);
            else {
                console.log('\nTrial run complete\n');
            }
        });
    } else if (type === 'postImport') {
        runPostImport(childModule, gauntletNum, (error, allCourses) => {
            if (error) console.error(error);
            else {
                console.log('\nTrial run complete\n');
            }
        });
    } else {
        console.log('Incorrect type set on child module package.json. Please specify "preImport" or "postImport"');
    }
}
