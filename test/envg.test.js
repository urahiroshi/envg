// This test only checks types for smoke testing,
// detail spec is tested by functional-test and each library's test

const envg = require('../lib/envg');

test('envg.env returns object', () => {
  expect(typeof envg.env).toBe('object');
});

test("envg.print() doesn't throw error", () => {
  expect(() => envg.print()).not.toThrow();
});
