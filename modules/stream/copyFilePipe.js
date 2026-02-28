const fs = require('fs');

const readStream = fs.createReadStream(`${__dirname}/files/democopy.txt`);
const writeStream = fs.createWriteStream(`${__dirname}/files/pipecopy.txt`);

readStream.pipe(writeStream);

readStream.on('end', () => {
    console.log('read complete.');
    writeStream.end();
});

readStream.on('error', (err) => {
    console.log(err.message);
});

writeStream.on('error', (err) => {
    console.log(err);
});

writeStream.on('finish', () => {
    console.log('writing data finished');
});
