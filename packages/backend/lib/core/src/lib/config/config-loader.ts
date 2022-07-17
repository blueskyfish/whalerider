import { isNil } from '@blueskyfish/grundel';
import { Logger } from '@nestjs/common';
import { ConfigObject } from '@nestjs/config';
import * as yaml from 'js-yaml';
import { checkEnvValue, DefaultEnvValue, fromEnv } from '../env';
import { File } from '../file';

export const CONFIG_CTX = 'Config';

/**
 * The config loader
 *
 * @param configPathEnv the name of the environment
 */
export async function configLoader(configPathEnv: string): Promise<ConfigObject> {
  const configPath = fromEnv(configPathEnv, DefaultEnvValue).asString;
  checkEnvValue(configPathEnv, configPath, DefaultEnvValue);
  try {
    const content = await File.readFile(configPath);
    const config = yaml.load(content) as ConfigObject;
    Logger.log(`Load configuration from "${configPath}"`, CONFIG_CTX);
    return replaceConfig(config);
  } catch (e: any) {
    Logger.error(`Could not load configuration from "${configPath}" (message=${e.message})`, e.stack, CONFIG_CTX);
    return {};
  }
}

/**
 * Iterates through the config object and insert the environment variables
 *
 * @param config the config object
 * @return the expanded config object
 */
function replaceConfig(config: ConfigObject): ConfigObject {
  const dict: ConfigObject = {};
  Object.keys(config).forEach((key: string) => {
    const value = config[key];
    switch (typeof value) {
      case 'number':
      case 'bigint':
      case 'boolean':
        dict[key] = value;
        break;
      case 'string':
        dict[key] = replaceEnv(value);
        break;
      case 'object':
        dict[key] = replaceConfig(value);
        break;
      default:
        Logger.warn(`Unknown type "${typeof value}" => ${value}`, CONFIG_CTX);
        break;
    }
  })

  return dict;
}

function replaceEnv(value: string): string {
  return value.replace(/\${([a-zA-Z_]+)}/g, (text: string, key): string => {
    Logger.debug(`Found environment variable "${key}"`)
    if (!isNil(process.env[key])) {
      return process.env[key] ?? text;
    }
    return text;
  })
}
