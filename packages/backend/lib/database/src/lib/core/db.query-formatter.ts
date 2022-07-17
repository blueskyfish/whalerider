import { NULL_VALUE } from '../config';

/**
 * Escape callback function to escape the value into a safety string
 */
export type EscapeFunc = (value: any) => string;

/**
 * Formatter of a date type into an iso date time
 * @param {Date} date if the parameter is null, then it is create a instance with the current date
 * @returns {string}
 */
export const dateTimeFormatter = (date?: Date): string => {
  if (!date) {
    date = new Date();
  }
  return date.toJSON()
    .replace('T', ' ')
    .slice(0, 19);
};

/**
 * Parse the sql query and insert the properties from the given values.
 *
 * @param {EscapeFunc} escapeFunc the callback function for escape the value
 * @param {string} query the sql statement
 * @param values the optional values as parameters into the query
 * @returns {string} the safety sql query string
 */
export const queryFormatter = (escapeFunc: EscapeFunc, query: string, values: any): string => {

  return query
    .replace(/table\(([a-zA-Z]+)?\)/g, (text, table) => {
      return values[table] ?? text;
    })
    .replace(/{([a-zA-Z0-9]+)?}/g, (text, key) => {
      const item = values[key];
      if (Array.isArray(item)) {
        // concat the values with comma separate
        return item.map((v) => escapeFunc(v)).join(',');
      }
      // 'NULL' is sql NULL :-)
      if (item === null || typeof item === 'undefined') {
        // item with "null" or "undefined" is setting to "NULL"
        return NULL_VALUE;
      }
      if (item === NULL_VALUE) {
        return NULL_VALUE;
      }
      // Date formatted as "ISO" (YYYY-MM-DD HH:mm:ss)
      if (item instanceof Date) {
        const value = dateTimeFormatter(item);
        return escapeFunc(value);
      }
      return escapeFunc(item);
    });
};
