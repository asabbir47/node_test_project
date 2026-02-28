const handler = {};

handler.sampleHandler = (requestData, callback) => {
    callback(200, { success: true, message: 'sample route' });
};

module.exports = handler;
