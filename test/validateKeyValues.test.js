const validateKeyValues = require('../lib/validateKeyValues');

const validEnv = {
  KEY1: 'key1',
  KEY2: 'key2',
  KEY3: 'key3',
};

const toChars = (start, end) => (
  Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(i + start))
);

const asciiMap = [
  { char: toChars(0x00, 0x1f), validKey: false, validVal: false },
  { char: '\x20', validKey: false, validVal: false }, // (space)
  { char: '\x21', validKey: false, validVal: false }, // !
  { char: '\x22', validKey: false, validVal: true },  // "
  { char: '\x23', validKey: false, validVal: false }, // #
  { char: '\x24', validKey: false, validVal: false }, // $
  { char: '\x25', validKey: false, validVal: true },  // %
  { char: '\x26', validKey: false, validVal: false }, // &
  { char: '\x27', validKey: false, validVal: false }, // '
  { char: '\x28', validKey: false, validVal: true },  // (
  { char: '\x29', validKey: false, validVal: true },  // )
  { char: '\x2a', validKey: false, validVal: true },  // *
  { char: '\x2b', validKey: false, validVal: true },  // +
  { char: '\x2c', validKey: false, validVal: true },  // ,
  { char: '\x2d', validKey: false, validVal: true },  // -
  { char: '\x2e', validKey: false, validVal: true },  // .
  { char: '\x2f', validKey: false, validVal: true },  // /
  { char: toChars(0x30, 0x39), validKey: true, validVal: true }, // 0-9
  { char: '\x3a', validKey: false, validVal: true },  // :
  { char: '\x3b', validKey: false, validVal: false }, // ;
  { char: '\x3c', validKey: false, validVal: false }, // <
  { char: '\x3d', validKey: false, validVal: true },  // =
  { char: '\x3e', validKey: false, validVal: false }, // >
  { char: '\x3f', validKey: false, validVal: true },  // ?
  { char: '\x40', validKey: false, validVal: true },  // @
  { char: toChars(0x41, 0x5a), validKey: true, validVal: true }, // A-Z
  { char: '\x5b', validKey: false, validVal: true },  // [
  { char: '\x5c', validKey: false, validVal: false }, // \
  { char: '\x5d', validKey: false, validVal: true },  // ]
  { char: '\x5e', validKey: false, validVal: true },  // ^
  { char: '\x5f', validKey: true, validVal: true },   // _
  { char: '\x60', validKey: false, validVal: false }, // `
  { char: toChars(0x61, 0x7a), validKey: true, validVal: true }, // a-z
  { char: '\x7b', validKey: false, validVal: true },  // {
  { char: '\x7c', validKey: false, validVal: false }, // |
  { char: '\x7d', validKey: false, validVal: true },  // }
  { char: '\x7e', validKey: false, validVal: true },  // ~
  { char: '\x7f', validKey: false, validVal: false },
];

const getCharsByKey = ({ validKey }) => {
  const deepChars = (
    asciiMap.filter(o => o.validKey === validKey).map(o => o.char)
  );
  // it can be replaced by deepChars.flat() if only node >= 12 supported
  return [].concat(...deepChars);
}

const getCharsByVal = ({ validVal }) => {
  const deepChars = (
    asciiMap.filter(o => o.validVal === validVal).map(o => o.char)
  );
  // it can be replaced by deepChars.flat() if only node >= 12 supported
  return [].concat(...deepChars);
}

const validateMethod = env => (() => {
  validateKeyValues(env);
});

const testDesc = char => (`"${char}" (${char.charCodeAt(0)})`)

describe("validateKeyValues() doesn't throw error when valid key", () => {
  const validChars = getCharsByKey({ validKey: true });

  validChars.forEach(c => {
    test(testDesc(c), () => {
      const key = `VALID_KEY_${c}`;
      const value = 'hogehoge';
      expect(validateMethod({ ...validEnv, ...{ [key]: value }})).not.toThrow();
    });
  });
});

describe("validateKeyValues() throw error when invalid key", () => {
  const invalidChars = getCharsByKey({ validKey: false });

  invalidChars.forEach(c => {
    test(testDesc(c), () => {
      const key = `INVALID_KEY_${c}`;
      const value = 'hogehoge';
      const errMsg = `invalid character is included in key name: ${key}`;
      expect(validateMethod({ ...validEnv, ...{ [key]: value }})).toThrow(errMsg);
    });
  });
});

describe("validateKeyValues() doesn't throw error when valid value", () => {
  const validChars = getCharsByVal({ validVal: true });
  const keys = Object.keys(validEnv);

  validChars.forEach((c, i) => {
    test(testDesc(c), () => {
      const key = keys[i];
      const value = `${validEnv[key]}${c}hoge`
      expect(validateMethod({ ...validEnv, ...{ [key]: value }})).not.toThrow();
    });
  });
});

describe("validateKeyValue() throw error when invalid value", () => {
  const invalidChars = getCharsByVal({ validVal: false });
  const keys = Object.keys(validEnv);

  invalidChars.forEach((c, i) => {
    test(testDesc(c), () => {
      const key = keys[i];
      const value = `${validEnv[key]}${c}hoge`
      const errMsg = `invalid character is included in value for ${key}`;
      expect(validateMethod({ ...validEnv, ...{ [key]: value }})).toThrow(errMsg);
    });
  });
});
