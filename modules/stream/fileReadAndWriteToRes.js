const http = require('http');
const fs = require('fs');

const server = http.createServer((req, resp) => {
    if (req.url === '/') {
        const readStream = fs.createReadStream(`${__dirname}/files/demo.txt`);
        readStream.pipe(resp);
    }
});

server.listen(4000, () => {
    console.log('server started');
});
