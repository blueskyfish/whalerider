/**
 * Default Unwanted string value for the enviroment variable
 */
export const DefaultEnvValue = '??';


/**
 * Check the environment value is not the given **not** parameter
 *
 * @param name the environment name
 * @param value the current value
 * @param not the not wanted value
 */
export function checkEnvValue<T = string>(name: string, value: T, not: string) {
  if (`${value}` === not) {
    throw new Error(`Environment "${name}" is required`);
  }
}
