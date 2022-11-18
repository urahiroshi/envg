const { exec } = require('child_process');
const { debug } = require('./_debug');

const execAndCheckOutputs = ({ command, expected, done }) => {
  debug({ expected });
  const child = exec(command);

  let stdout = '';
  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });
  child.stderr.on('data', (data) => {
    debug(data.toString());
  });

  child.on('error', (err) => {
    console.error(err.stack);
  });

  child.on('exit', (code) => {
    const lines = stdout.split('\n');
    expect(Object.keys(expected).every(key => {
      // translate object to `printenv` format (key=value)
      return lines.includes(`${key}=${expected[key]}`);
    })).toBe(true);
    expect(code).toBe(0);
    done();
  });
};

const wrappedCommands = [
  // call `printenv` command as shell file
  './_printenv.sh',
  // show all `process.env` params in Node.js
  'node _printProcessEnv.js',
  // show all `require('envg').env` params in Node.js
  'node _printEnvgEnv.js',
];

wrappedCommands.forEach(wrappedCommand => {
  describe(`envg <env_name> ${wrappedCommand}`, () => {
    ['example1', 'example2'].forEach(envName => {
      describe(`register default values from env/${envName}.js`, () => {
        const command = `envg ${envName} ${wrappedCommand}`;
        test(command, done => {
          execAndCheckOutputs({
            command,
            expected: require(`../env/${envName}`),
            done,
          });
        });
      });
    });

    describe('overwrite default value if same env var is set', () => {
      const example1 = require('../env/example1');
      const [key, val] = [Object.keys(example1)[0], 'hogehogehoge'];
      const command = `${key}=${val} envg example1 ${wrappedCommand}`;

      test(command, done => {
        execAndCheckOutputs({
          command,
          expected: { ...example1, ...{ [key]: val }},
          done,
        });
      });
    });

    describe('failed if non-default env var is not set', () => {
      const command = `envg example3 ${wrappedCommand}`;

      test(command, done => {
        const child = exec(command);
        child.on('exit', (code) => {
          expect(code).not.toBe(0);
          done();
        });
      });
    });
  
    describe('not failed if non-default env var is set', () => {
      const [key, val] = ['SECRET_VALUE', 'thisissecret'];
      const command = `${key}=${val} envg example3 ${wrappedCommand}`;

      test(command, done => {
        execAndCheckOutputs({
          command,
          expected: { ...require(`../env/example3`), ...{ [key]: val } },
          done,
        });
      });
    });

    describe('failed if invalid character is found in specified key', () => {
      const example1 = require('../env/example1');
      const [key, val] = [Object.keys(example1)[0], "it'sinvalid"];
      const command = `${key}="${val}" envg example1 ${wrappedCommand}`;
      test(command, done => {
        const child = exec(command);
        child.on('exit', (code) => {
          expect(code).not.toBe(0);
          done();
        });
      })
    });

    describe('not failed if invalid character is found in non specified key', () => {
      const example1 = require('../env/example1');
      // detail conditions is checked by unit.test.js
      const [key, val] = ['NEW_KEY', "it'sinvalid"];
      const command = `${key}="${val}" envg example1 ${wrappedCommand}`

      test(command, done => {
        execAndCheckOutputs({
          command,
          expected: example1,
          done,
        });
      })
    });
  });
});
