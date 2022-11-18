const method = require('../lib/overwriteWithValidation');

test('overwrite `defaults` value if there is same key in `overwrittenBy`', () => {
  const defaults = { HOGE: 'hogehoge', FUGA: 'fugafuga' };
  const overwrittenBy = { HOGE: 'overwritten' };
  const expected = { HOGE: 'overwritten', FUGA: 'fugafuga' };
  expect(Object.is(method({ defaults, overwrittenBy }), expected));
});

test('overwrite `defaults` value if there is no same key in `overwrittenBy`', () => {
  const defaults = { HOGE: 'hogehoge', FUGA: 'fugafuga' };
  const overwrittenBy = { PIYO: 'overwritten' };
  const expected = { HOGE: 'hogehoge', FUGA: 'fugafuga' };
  expect(Object.is(method({ defaults, overwrittenBy }), expected));
});

test('throw error if undefined value is not overwritten', () => {
  const defaults = { HOGE: 'hogehoge', FUGA: undefined };
  const overwrittenBy = { HOGE: 'overwritten' };
  expect(() => method({ defaults, overwrittenBy })).toThrow(
    'Undefined variables found: FUGA'
  );
});

test('throw error if undefined values are not overwritten', () => {
  const defaults = { HOGE: 'hogehoge', FUGA: undefined, PIYO: undefined };
  const overwrittenBy = { HOGE: 'overwritten' };
  expect(() => method({ defaults, overwrittenBy })).toThrow(
    'Undefined variables found: FUGA, PIYO'
  );
});

test('not throw error if undefined value is overwritten', () => {
  const defaults = { HOGE: 'hogehoge', FUGA: undefined, PIYO: undefined };
  const overwrittenBy = { FUGA: 'overwrittenFuga', PIYO: 'overwrittenPiyo' };
  const expected = { HOGE: 'hogehoge', FUGA: 'overwrittenFuga', PIYO: 'overwrittenPiyo' };
  expect(Object.is(method({ defaults, overwrittenBy }), expected));
});
