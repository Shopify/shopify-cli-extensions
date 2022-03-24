const fs = require('fs');

console.error('Failure');

setTimeout(function () {
    const filename = 'build/main.js';
    fs.closeSync(fs.openSync(filename, 'w'));
    console.log('Success');
}, 500);