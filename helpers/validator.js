// validator.js
const validator = {};

// Rule handlers
const ruleHandlers = {
    required: (value) => {
        if (value === undefined || value === null || value === '') return 'is required';
        return '';
    },
    string: (value) => {
        if (value !== undefined && value !== null && typeof value !== 'string') {
            return 'must be string';
        }

        return '';
    },
    number: (value) => {
        if (value !== undefined && value !== null && typeof value !== 'number') {
            return 'must be number';
        }
        return '';
    },
    email: (value) => {
        if (value !== undefined && value !== null && typeof value === 'string') {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(value)) return 'must be a valid email';
        }

        return '';
    },
    max: (value, param) => {
        if (value === undefined || value === null) return null;
        const max = Number(param);
        if (typeof value === 'string' && value.length > max) {
            return `must not exceed ${max} characters`;
        }
        if (typeof value === 'number' && value > max) return `must not exceed ${max}`;
        return '';
    },
    min: (value, param) => {
        if (value === undefined || value === null) return null;
        const min = Number(param);
        if (typeof value === 'string' && value.length < min) {
            return `must be at least ${min} characters`;
        }
        if (typeof value === 'number' && value < min) return `must be at least ${min}`;
        return '';
    },
    length: (value, param) => {
        if (value === undefined || value === null) return null;
        const len = Number(param);
        if (typeof value === 'string' && value.length !== len) {
            return `must be exactly ${len} characters`;
        }
        if (typeof value === 'number' && value.toString().length !== len) {
            return `must be exactly ${len} digits`;
        }
        return '';
    },
};

validator.validate = (data, rules) => {
    const errors = {};
    const validated = {};

    Object.keys(rules).forEach((field) => {
        const value = data[field];
        const ruleList = rules[field].split('|');
        const fieldErrors = [];

        // Handle nullable early
        if (ruleList.includes('nullable')) {
            if (value === null) {
                validated[field] = null;
                return;
            }
            if (value === undefined) return; // skip field
        }

        const filteredRuleList = ruleList.filter((item) => item !== 'nullable');

        filteredRuleList.forEach((ruleStr) => {
            const [ruleName, param] = ruleStr.split(':');
            const handler = ruleHandlers[ruleName];

            if (!handler) throw new Error(`Unknown validation rule: ${ruleName}`);

            const errMsg = handler(value, param);
            if (errMsg) fieldErrors.push(`${field} ${errMsg}`);
        });
        if (fieldErrors.length > 0) errors[field] = fieldErrors;
        else validated[field] = value;
    });

    const hasErrors = Object.values(errors).some((arr) => arr.length > 0);

    return { isValid: !hasErrors, errors, validated };
};

module.exports = validator;
