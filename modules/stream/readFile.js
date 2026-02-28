const fs = require('fs');

const fileReadStream = fs.createReadStream(`${__dirname}/files/demo.txt`);

fileReadStream.on('data', (chunk) => {
    console.log(chunk);
    // console.log(chunk.toJSON());
    // console.log(chunk.toString());
});

fileReadStream.on('end', () => {
    console.log('read completed');
});

fileReadStream.on('error', (error) => {
    console.log(error.message);
});
