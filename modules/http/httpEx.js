const http = require('http');

const server = http.createServer((req, resp) => {
    if (req.url === '/') {
        resp.write('home page');
        resp.end();
    } else if (req.url === '/about') {
        resp.write('about page');
        resp.end();
    } else {
        resp.write('not found');
        resp.end();
    }
});

server.listen(3000, () => {
    console.log('server started');
});
