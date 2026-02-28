const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../route');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJsonToObject } = require('./utility');

const handler = {};

handler.handleReqRes = (req, resp) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;
    const trimmedPathname = pathname.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const { query } = parsedUrl;
    const { headers } = req;

    let realdata = '';
    const stringDecoder = new StringDecoder('utf-8');

    req.on('data', (buffer) => {
        realdata += stringDecoder.write(buffer);
    });

    req.on('end', () => {
        realdata += stringDecoder.end();

        const choosenHandler = routes[trimmedPathname] ? routes[trimmedPathname] : notFoundHandler;

        const requestData = {
            parsedUrl,
            pathname,
            trimmedPathname,
            method,
            query,
            headers,
            body: parseJsonToObject(realdata),
        };

        choosenHandler(requestData, (statusCode, payload) => {
            resp.setHeader('Content-Type', 'application/json');
            resp.writeHead(typeof statusCode === 'number' ? statusCode : 500);
            resp.end(JSON.stringify(typeof payload === 'object' ? payload : {}));
        });
    });
};

module.exports = handler;
