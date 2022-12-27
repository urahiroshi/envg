// This test only checks types for smoke testing,
// detail spec is tested by functional-test and each library's test

import { env, print } from '../lib/envg';

test('envg.env returns object', () => {
  expect(typeof env).toBe('object');
});

test("envg.print() doesn't throw error", () => {
  expect(() => print()).not.toThrow();
});
