const canvas = require('canvas-wrapper');
const asyncLib = require('async');

canvas.get('/api/v1/accounts/14/courses?search_term=gauntlet', (err, gauntlets) => {
    asyncLib.each(gauntlets, gauntlet => {
        if (!gauntlet.name.includes('Pristine')) {
            canvas.delete(`/api/v1/courses/${gauntlet.id}?event=delete`, (err, result) => {
                console.log(result);
            });
        }
    });
});
