const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '/../.data');

lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir}/${dir}/${file}.json`, 'wx', (err, fd) => {
        if (!err && fd) {
            let dataToSave = '';
            if (typeof data === 'object') {
                dataToSave = JSON.stringify(data);
            } else if (typeof data === 'string') {
                dataToSave = data;
            } else if (typeof data === 'number') {
                dataToSave = `${data}`;
            } else {
                callback(true, { messge: 'Invalid data' });
            }
            fs.writeFile(fd, dataToSave, (err2) => {
                if (!err2) {
                    fs.close(fd, (err3) => {
                        if (!err3) {
                            callback(null, { messge: 'File created successfully' });
                        } else {
                            callback(err3, { messge: 'File close failed' });
                        }
                    });
                } else {
                    callback(err2, { messge: 'File write failed' });
                }
            });
        } else {
            callback(err, { messge: 'File open failed. File may exists' });
        }
    });
};

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir}/${dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir}/${dir}/${file}.json`, 'r+', (fOpenError, fd) => {
        if (!fOpenError && fd) {
            fs.ftruncate(fd, (fTruncError) => {
                if (!fTruncError) {
                    let dataToSave = '';
                    if (typeof data === 'object') {
                        dataToSave = JSON.stringify(data);
                    } else if (typeof data === 'string') {
                        dataToSave = data;
                    } else if (typeof data === 'number') {
                        dataToSave = `${data}`;
                    } else {
                        callback(true, { messge: 'Invalid data' });
                    }
                    fs.writeFile(fd, dataToSave, (fWriteError) => {
                        if (!fWriteError) {
                            fs.close(fd, (fCloseError) => {
                                if (!fCloseError) {
                                    callback(false, { messge: 'File updated successfully' });
                                } else {
                                    callback(true, { messge: 'File closing erro' });
                                }
                            });
                        } else {
                            callback(true, { messge: 'File write error' });
                        }
                    });
                } else {
                    callback(true, { messge: 'File truncate failed.' });
                }
            });
        } else {
            callback(true, { messge: 'File open failed.' });
        }
    });
};

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir}/${dir}/${file}.json`, (error) => {
        if (!error) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

module.exports = lib;
