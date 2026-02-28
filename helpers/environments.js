const environments = {};

// Staging (default)
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'dfeoireh',
};

// Production
environments.production = {
    port: 7000,
    envName: 'production',
    secretKey: '3fp4igho',
};

// Figure out which environment to export
const currentEnv = process.env.NODE_PROJECT_MODE?.toLowerCase() || 'staging';

const environmentToExport = environments[currentEnv] || environments.staging;

module.exports = environmentToExport;
