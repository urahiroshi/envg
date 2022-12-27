import * as path from 'path';

import validateKeyValues from './validateKeyValues';
import overwriteWithValidation, { EnvVars } from './overwriteWithValidation';

export default function (envName): EnvVars {
  if (!envName) {
    throw new Error('ENV_NAME is not defined');
  }
  const defaults = require(path.join(process.cwd(), 'env', envName));
  const env = overwriteWithValidation({ defaults, overwrittenBy: process.env });
  env.ENV_NAME = envName;
  return env;
}
