const handler = {};

handler.notFoundHandler = (requestData, callback) => {
    callback(404, { success: false, message: 'route not found' });
};

module.exports = handler;
