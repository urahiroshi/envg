export default function (env: object) {
  // just allow letters, digits, underscore for environment variable name
  // based on https://pubs.opengroup.org/onlinepubs/000095399/basedefs/xbd_chap08.html
  // but not strictly checking
  const validEnvKeyRegExp = /^\w+$/;

  // To prevent command injection, some special characters (| ; & $ > < ' \ ! >> #)
  // aren't allowed for environment variable value
  // https://wiki.owasp.org/index.php/Testing_for_Command_Injection_(OTG-INPVAL-013)
  const validEnvValRegExp = /^[\w,\.\-=:^~@"\?%\/\+\*\[\]\(\)\{\}]+$/;

  const invalidKey = Object.keys(env).find(key => !key.match(validEnvKeyRegExp));
  if (invalidKey) {
    throw new Error(`invalid character is included in key name: ${invalidKey}`);
  }

  const invalidValKey = Object.keys(env).find(key => !env[key].match(validEnvValRegExp));
  if (invalidValKey) {
    throw new Error(`invalid character is included in value for ${invalidValKey}`);
  }
}
