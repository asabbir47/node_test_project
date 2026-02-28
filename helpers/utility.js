const crypto = require('crypto');

const utility = {
    /**
     * @description: 生成随机字符串
     * @param {number} length 字符串长度
     * @return {string} 随机字符串
     */
    randomString: (length) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    parseJsonToObject: (str) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return {};
        }
    },
    hash: (str, key) => crypto.createHmac('sha256', key).update(str).digest('hex'),
};

module.exports = utility;
