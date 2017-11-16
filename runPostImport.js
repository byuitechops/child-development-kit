const copyCourse = require('copy-a-canvas-course');
const https = require('https');

var canvasGauntlets;

module.exports = (childModule, gauntletNum, stepCallback) => {

    function copyGauntlet(callback) {
        https.get('https://raw.githubusercontent.com/byuitechops/canvas-gauntlet-ous/master/canvas-ous.json', (res) => {
            res.setEncoding('utf8');
            res.on('data', (d) => {
                canvasGauntlets = JSON.parse(d);
                console.log(canvasGauntlets['Gauntlet 1']);

                copyCourse(canvasGauntlets['Gauntlet 1'], 14, (err, result) => {
                    if (err) console.log('ERR', err);
                    else console.log('COMPLETE');
                });
            });
        }).on('error', (e) => {
            console.error(e);
        });
    }

    copyGauntlet();
};
