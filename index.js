const http = require('http');
const { handleReqRes } = require('./helpers/handleReqres');
const environment = require('./helpers/environments');

const app = {};

app.handleReqRes = handleReqRes;

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    server.listen(environment.port, () => {
        console.log(`server running with port ${environment.port}`);
    });
};

app.createServer();
