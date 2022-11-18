const { env } = require('envg');

Object.keys(env).forEach(key => {
  console.log(`${key}=${env[key]}`);
});
