const http = require('http');
const fs = require('fs');
const queryString = require('querystring');

const server = http.createServer((req, resp) => {
    if (req.url === '/') {
        resp.write('<html><head><title>ui</title></head>');
        resp.write(
            "<body><form action='/process' method='post'><input name='message'/></form></body>",
        );
        resp.write('</html>');
        resp.end();
    } else if (req.url === '/process' && req.method === 'POST') {
        const writeStream = fs.createWriteStream(`${__dirname}/files/inputted.txt`);
        const data = [];
        req.on('data', (chunk) => {
            data.push(chunk);
        });

        req.on('end', () => {
            const parsed = queryString.parse(data.concat().join(''));
            // console.log(parsed);
            writeStream.write(parsed.message);
            writeStream.end();
        });
        writeStream.on('finish', () => {
            resp.end('write successfull');
        });
    }
});

server.listen(3000, () => {
    console.log('server started');
});
