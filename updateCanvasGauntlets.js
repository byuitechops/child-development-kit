/* Dependences */
const updateLocal = require('./updateD2LGauntlets.js');
const conversion = require('./node_modules/d2l-to-canvas-conversion-tool/gauntletCLI.js');

module.exports = () => {
    conversion(resultCourses => {
        console.log(resultCourses.length);
    });
}
