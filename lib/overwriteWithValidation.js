// This modules overwrites `defaults` values by `overwrittenBy` values.
// It is different from merging, result doesn't include keys which `overwrittenBy` only has.
// If there is `undefined` value in `defaults` and not overwritten, it throws error.

module.exports = ({ defaults, overwrittenBy }) => {
  const allEnv = {
    ...defaults,
    ...overwrittenBy,
  };
  const shouldDefinedKeys = Object.keys(defaults);
  
  const env = {};
  const undefinedKeys = shouldDefinedKeys.filter(key => {
    env[key] = allEnv[key];
    return allEnv[key] === undefined;
  });
  if (undefinedKeys.length > 0) {
    throw new Error(`Undefined variables found: ${undefinedKeys.join(', ')}`);
  }
  return env;
}
