import { toInt } from './number';

describe('Numbers', () => {
  it('should return number "42"', () => {
    expect(toInt('42')).toEqual(42);
  });
  it('should return number "+42"', () => {
    expect(toInt('+42')).toEqual(42);
  });
  it('should return number "-42"', () => {
    expect(toInt('-42')).toEqual(-42);
  });
  it('should return number as number', () => {
    expect(toInt(42)).toEqual(42);
  });
});
