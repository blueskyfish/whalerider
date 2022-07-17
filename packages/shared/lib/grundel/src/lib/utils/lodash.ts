/*
 * Small helper class for replace [lodash](https://lodash.com/)
 *
 * **Reason**
 *
 * * TreeShacking
 *
 * @see <https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore>
 */

export function isNil(v: any): boolean {
  return v === null || typeof v === 'undefined';
}

export function isEmpty(
  s: string | any[] | object | null | undefined
): boolean {
  if (isNil(s)) {
    return true;
  }
  if (!s) {
    return true;
  }
  if (typeof s === 'string') {
    return s.length === 0;
  }
  if (Array.isArray(s)) {
    return s.length === 0;
  }
  return Object.keys(s).length === 0;
}

export function isString(v: any): boolean {
  return !isNil(v) && typeof v.valueOf() === 'string';
}

export function isDate(d: any): boolean {
  return d instanceof Date;
}

export function isFunction(f: any): boolean {
  return f && typeof f === 'function';
}

export function toLower(s: string | null | undefined): string | null {
  return s ? s.toLowerCase() : null;
}

export function toUpper(s: string | null | undefined): string | null {
  return s ? s.toUpperCase() : null;
}

export function trim(s: string | null | undefined): string | null {
  return s ? s.trim() : null;
}

export function startsWith(
  s: string | null | undefined,
  search: string | null | undefined,
  offset?: number
): boolean {
  if (isString(s) && isString(search)) {
    return typeof offset === 'number'
      ? (s as string).startsWith(search as string, offset)
      : (s as string).startsWith(search as string);
  }
  return false;
}

export function endsWidth(
  s: string | null | undefined,
  search: string | null | undefined,
  offset?: number
): boolean {
  if (isString(s) && isString(search)) {
    return typeof offset === 'number'
      ? (s as string).endsWith(search as string, offset)
      : (s as string).endsWith(search as string);
  }
  return false;
}

export function get<T>(
  obj: object,
  path: string,
  defaultValue: T | null
): T | null {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => {
        if (!isNil(res)) {
          // @ts-ignore
          return res[key];
        }
        return res;
      }, obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  // @ts-ignore
  return isNil(result) ? defaultValue : result;
}

export function size(
  s: string | object | Array<any> | null | undefined
): number {
  if (isString(s)) {
    return (s as string).length;
  }
  if (Array.isArray(s)) {
    return (s as []).length;
  }
  if (typeof s === 'object' && !isNil(s)) {
    return Object.keys(s as object).length;
  }
  return -1;
}

export function isArray(s: any): boolean {
  return Array.isArray(s);
}

/**
 * Get the type information from given variable `s`. If the value is null, then it returns `null`.
 *
 * @param s a variable
 * @returns {string} the type information
 */
export function getTypeFrom(s: any): string {
  if (s === null) {
    return 'null';
  }
  return typeof s;
}

export function isBool(s: any): boolean {
  return typeof s === 'boolean';
}

export function isFalse(s: any): boolean {
  return isBool(s) && s === false;
}

export function isTrue(s: any): boolean {
  return isBool(s) && s === true;
}

export function isNumber(n: any): boolean {
  return typeof n === 'number' && !isNaN(n);
}
