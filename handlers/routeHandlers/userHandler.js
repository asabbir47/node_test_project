const { validate } = require('../../helpers/validator');
const db = require('../../lib/data');
const { hash, parseJsonToObject } = require('../../helpers/utility');
const env = require('../../helpers/environments');

const handler = {};

handler.userHandler = (request, callback) => {
    if (!['get', 'post', 'put', 'delete'].includes(request.method?.toLowerCase())) {
        callback(405, { success: false, message: 'method not allowed' });
        return;
    }

    handler._users[request.method.toLowerCase()](request, callback);
};

handler._users = {};

handler._users.post = (request, callback) => {
    const { isValid, validated, errors } = validate(request.body, {
        firstName: 'required|max:20',
        lastName: 'required|max:20',
        email: 'required|email',
        phone: 'required|length:11',
        intro: 'nullable|min:20',
        password: 'required|string|max:20',
    });

    if (!isValid) {
        return callback(400, { success: 'false', message: 'Validation error', errors });
    }

    return db.read('users', validated.phone, (readError) => {
        if (readError) {
            validated.password = hash(validated.password, env.secretKey);

            db.create('users', validated.phone, validated, (userCreateError) => {
                if (!userCreateError) {
                    return callback(200, { success: true, message: 'user created successfully' });
                }

                return callback(500, {
                    success: false,
                    message: 'Something went wrong. Please try later.',
                });
            });
        } else {
            callback(403, { success: false, message: 'User already exists.' });
        }
    });
};

handler._users.get = (request, callback) => {
    const { isValid, validated, errors } = validate(request.body, {
        phone: 'required|length:11',
    });

    if (!isValid) {
        return callback(400, { success: 'false', message: 'Validation error', errors });
    }

    return db.read('users', validated.phone, (readError, data) => {
        if (!readError && data) {
            const result = parseJsonToObject(data);
            delete result.password;
            callback(200, { success: true, data: result });
        } else {
            callback(403, { success: false, message: 'User not found' });
        }
    });
};

handler._users.delete = (request, callback) => {
    const { isValid, validated, errors } = validate(request.body, {
        phone: 'required|length:11',
    });

    if (!isValid) {
        return callback(400, { success: 'false', message: 'Validation error', errors });
    }

    return db.read('users', validated.phone, (readError, data) => {
        if (!readError && data) {
            db.delete('users', validated.phone, (deleteError) => {
                if (!deleteError) {
                    callback(200, { success: true, message: 'Deleted successfully' });
                } else {
                    callback(500, { success: false, message: 'Something went wrong.' });
                }
            });
        } else {
            callback(403, { success: false, message: 'User not found' });
        }
    });
};

handler._users.put = (request, callback) => {
    const { isValid, validated, errors } = validate(request.body, {
        firstName: 'nullable|max:20',
        lastName: 'nullable|max:20',
        email: 'nullable|email',
        phone: 'required|length:11',
        intro: 'nullable|min:20',
        password: 'nullable|string|max:20',
    });

    if (!isValid) {
        return callback(400, { success: 'false', message: 'Validation error', errors });
    }

    return db.read('users', validated.phone, (readError, data) => {
        if (!readError && data) {
            if (validated.password) validated.password = hash(validated.password, env.secretKey);
            const parsedData = parseJsonToObject(data);
            Object.keys(validated).forEach((field) => {
                parsedData[field] = validated[field];
            });

            db.update('users', validated.phone, parsedData, (userUpdateError) => {
                if (!userUpdateError) {
                    return callback(200, { success: true, message: 'user updated successfully' });
                }

                return callback(500, {
                    success: false,
                    message: 'Something went wrong. Please try later.',
                });
            });
        } else {
            callback(403, { success: false, message: 'User not found' });
        }
    });
};

module.exports = handler;
