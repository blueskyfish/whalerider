import {
  endsWidth,
  get,
  getTypeFrom,
  isFunction,
  isNil,
  isString,
  size,
  startsWith,
  toLower,
  toUpper,
  trim,
} from './lodash';

describe('Lodash', () => {
  describe('isNil', () => {
    it('should return "true"', () => {
      const dd = null;
      const rec: any = {};
      expect(isNil(dd)).toBeTruthy();
      expect(isNil(rec.date)).toBeTruthy();
    });

    it('should return "false"', () => {
      expect(isNil(1)).toBeFalsy();
      expect(isNil(true)).toBeFalsy();
      expect(isNil('test')).toBeFalsy();
    });

    it('"NaN" should return "false"', () => {
      expect(isNil(NaN)).toBeFalsy();
    });
  });

  describe('isString', () => {
    it('empty string should return "true"', () => {
      expect(isString('')).toBeTruthy();
    });

    it('should be a string', () => {
      const text = 'ABC';
      expect(isString(text)).toBeTruthy();
      expect(isString((3.14567).toFixed(2))).toBeTruthy();
    });

    it('should not be a string', () => {
      const ss = undefined;
      expect(isString(null)).toBeFalsy();
      expect(isString(ss)).toBeFalsy();
      expect(isString(1)).toBeFalsy();
      expect(isString(new Date())).toBeFalsy();
      expect(isString(NaN)).toBeFalsy();
    });
  });

  describe('isFunction', () => {
    it('should not a function', () => {
      expect(isFunction(1)).toBeFalsy();
      expect(isFunction('today')).toBeFalsy();
      expect(isFunction(null)).toBeFalsy();
      expect(isFunction(undefined)).toBeFalsy();
    });

    it('should a function', () => {
      function hello(hello: string) {
        console.log(hello);
      }
      const calc = (x: number, y: number): number => x + y;

      expect(isFunction(hello)).toBeTruthy();
      expect(isFunction(calc)).toBeTruthy();
    });
  });

  describe('toLower', () => {
    it('should convert to lowercase', () => {
      expect(toLower('Abc')).toEqual('abc');
      expect(toLower('abc')).toEqual('abc');
      expect(toLower('ABC')).toEqual('abc');
    });

    it('empty string is null', () => {
      expect(toLower('')).toBeNull();
    });

    it('Null or undefined should return null', () => {
      expect(toLower(null)).toBeNull();
      expect(toLower(undefined)).toBeNull();
    });
  });

  describe('toUpper', () => {
    it('should convert to lowercase', () => {
      expect(toUpper('Abc')).toEqual('ABC');
      expect(toUpper('abc')).toEqual('ABC');
      expect(toUpper('ABC')).toEqual('ABC');
    });

    it('empty string is null', () => {
      expect(toUpper('')).toBeNull();
    });

    it('Null or undefined should return null', () => {
      expect(toUpper(null)).toBeNull();
      expect(toUpper(undefined)).toBeNull();
    });
  });

  describe('trim', () => {
    it('should trim string', () => {
      expect(trim('  ABC  ')).toEqual('ABC');
    });

    it('Empty string return null', () => {
      expect(trim('')).toBeNull();
    });

    it('Null or undefined return null', () => {
      expect(trim(null)).toBeNull();
      expect(trim(undefined)).toBeNull();
    });
  });

  describe('startsWith', () => {
    it('should return true', () => {
      expect(startsWith('test1234', 'test')).toBeTruthy();
      expect(startsWith('test1234', 'est', 1)).toBeTruthy();
    });

    it('should return false', () => {
      expect(startsWith(null, 'test')).toBeFalsy();
      expect(startsWith(null, null)).toBeFalsy();
      expect(startsWith('test1234', null)).toBeFalsy();
    });
  });

  describe('endsWith', () => {
    it('should return true', () => {
      expect(endsWidth('test1234', '1234')).toBeTruthy();
      expect(endsWidth('test1234', '123', 'test1234'.length - 1)).toBeTruthy();
    });

    it('should return false', () => {
      expect(endsWidth(null, 'test')).toBeFalsy();
      expect(endsWidth(null, null)).toBeFalsy();
      expect(endsWidth('test1234', null)).toBeFalsy();
    });
  });

  describe('get', () => {
    const d = {
      list: ['ab', 'cd'],
      flag: true,
      some: {
        age: 12,
        name: 'Sam',
      },
    };

    it('get from list', () => {
      expect(get(d, 'list[0]', null)).toEqual('ab');
      expect(get(d, 'list[1]', null)).toEqual('cd');
      expect(get(d, 'list[99]', null)).toBeNull();
    });

    it('get value', () => {
      expect(get(d, 'flag', false)).toEqual(true);
    });

    it('get sub value', () => {
      expect(get(d, 'some.name', null)).toEqual('Sam');
      expect(get(d, 'some.age', NaN)).toEqual(12);
    });
  });

  describe('size', () => {
    it('string returns length', () => {
      expect(size('abc')).toEqual(3);
      expect(size('Abc' + 'Xyz')).toEqual(6);
      expect(size('')).toEqual(0);
    });

    it('Object returns property count', () => {
      const d1 = {
        f1: 'Hallo',
        f2: 23,
        f3: true,
        f4: null,
      };
      expect(size(d1)).toEqual(4);
    });

    it('Array returns the count of items', () => {
      expect(size(['a', 'b'])).toEqual(2);
      expect(size([12, 23, null, null, 33])).toEqual(5);
    });

    it('Other values are -1', () => {
      expect(size(null)).toEqual(-1);
      expect(size(undefined)).toEqual(-1);
    });
  });

  describe('getTypeFrom', () => {
    it('should return "null"', () => {
      expect(getTypeFrom(null)).toEqual('null');
    });
    it('should return "undefined"', () => {
      const ss = undefined;
      expect(getTypeFrom(ss)).toEqual('undefined');
    });
    it('should return "string"', () => {
      expect(getTypeFrom('test')).toEqual('string');
    });
    it('should return "number"', () => {
      expect(getTypeFrom(42)).toEqual('number');
    });
    it('should return "boolean"', () => {
      expect(getTypeFrom(true)).toEqual('boolean');
      expect(getTypeFrom(false)).toEqual('boolean');
    });
    it('should return "object"', () => {
      expect(getTypeFrom({})).toEqual('object');
    });
  });
});
