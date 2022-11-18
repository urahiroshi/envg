const generateEnv = require('./generateEnv');
const validateKeyValues = require('./validateKeyValues');

const env = generateEnv(process.env.ENV_NAME);
module.exports = {
  env,
  print: () => {
    validateKeyValues(env);
    Object.keys(env).forEach(key => {
      console.log(`${key}=${env[key]}`);
    });
  },
};
