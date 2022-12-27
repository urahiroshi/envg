import generateEnv from './generateEnv';
import validateKeyValues from './validateKeyValues';

export const env = generateEnv(process.env.ENV_NAME);

export function print () {
  validateKeyValues(env);
  Object.keys(env).forEach(key => {
    console.log(`${key}=${env[key]}`);
  });
}
