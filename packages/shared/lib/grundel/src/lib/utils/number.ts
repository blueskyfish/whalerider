/*
 * A module for convert / parse number / booleans from string
 */

import { isNil, toLower } from './lodash';

/**
 * Converts the string into a number.
 *
 * @param {string | number} s the value
 * @returns {number} in case of failed it returns `NaN`.
 */
export function toInt(s: string | number | null | undefined): number {
  if (isNil(s)) {
    return NaN;
  }

  if (typeof s === 'string') {
    try {
      const n: number = parseInt(s, 10);
      if (`${n}` === s || (s.startsWith('+') && `+${n}` === s)) {
        return n;
      }
      // The value contains alphanumeric signs
      return NaN;
    } catch (e) {
      return NaN;
    }
  }
  return s as number;
}

/**
 * Converts the string into a number and if it is failed, then it use the default value
 *
 * @param {string | number} s the value
 * @param {number} defValue a default value oif converting is failed
 * @returns {number}
 */
export function toIntOr(
  s: string | number | null | undefined,
  defValue = NaN
): number {
  const value = toInt(s);
  return isNaN(value) ? defValue : value;
}

export function toFixed(s: number | string, digit = 2): string | null {
  if (typeof s === 'string') {
    s = toInt(s);
  }
  if (isNaN(s)) {
    return null;
  }
  return s.toFixed(digit);
}

/**
 * Convert a string / number into a boolean value
 * @param {string | number | null | undefined} s the value.
 * @returns {boolean}
 */
export function toBool(s: string | number | null | undefined): boolean {
  if (isNil(s)) {
    return false;
  }
  if (typeof s === 'number') {
    const no = toInt(s);
    return isNaN(no) ? false : no > 0;
  }
  const value = toLower(s);
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return false;
  }
}

export function toFloat(s: string | number | null | undefined): number {
  if (typeof s === 'number') {
    return s;
  }
  if (!s) {
    return NaN;
  }
  try {
    return parseFloat(s);
  } catch (e) {
    return NaN;
  }
}

export function toFloatOr(
  s: string | number | null | undefined,
  devValue: number
): number {
  const value = toFloat(s);
  return isNaN(value) ? devValue : value;
}
