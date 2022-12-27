import generateEnv from '../lib/generateEnv';

const originalEnvName = process.env.ENV_NAME;

describe('returns valid env', () => {
  ['example1', 'example2'].forEach(envName => {
    const defaults = require(`../env/${envName}`);

    test(`generateEnv() with ENV_NAME=${envName}`, () => {
      const expected = { ...defaults, ...{ ENV_NAME: envName } };
      expect(Object.is(generateEnv(envName), expected));
    });
  });
});

test('throw Error if ENV_NAME is not defined', () => {
  // @ts-ignore
  expect(() => generateEnv()).toThrow('ENV_NAME is not defined');
});
