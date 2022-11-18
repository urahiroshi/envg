const path = require('path');
const validateKeyValues = require('./validateKeyValues');
const overwriteWithValidation = require('./overwriteWithValidation');

module.exports = (envName) => {
  if (!envName) {
    throw new Error('ENV_NAME is not defined');
  }
  const defaults = require(path.join(process.cwd(), 'env', envName));
  const env = overwriteWithValidation({ defaults, overwrittenBy: process.env });
  env.ENV_NAME = envName;
  return env;
};
