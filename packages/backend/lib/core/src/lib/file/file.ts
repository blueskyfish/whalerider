import { isNil, isString } from "@blueskyfish/grundel";
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as util from 'util';
import { ENCODING_UTF8, FILE_GROUP } from "./file.settings";

const asyncReadFile = util.promisify(fs.readFile);
const asyncWriteFile = util.promisify(fs.writeFile);
const asyncStat = util.promisify(fs.stat);
const asyncMkDir = util.promisify(fs.mkdir);
const asyncCopyFile = util.promisify(fs.copyFile);
const asyncMoveFile = util.promisify(fs.rename);
const asyncUnlink = util.promisify(fs.unlink);

/**
 * Helper class for file system operations of read, write and checking
 */
export class File {

  static async readFile(pathname: string, encoding: BufferEncoding = ENCODING_UTF8): Promise<string> {
    try {
      return await asyncReadFile(pathname, {encoding});
    } catch (e: any) {
      Logger.error(`Read file "${pathname}" is failed => ${e.message}`, null, FILE_GROUP);
      throw e;
    }
  }

  static async writeFile<T>(pathname: string, data: T, encoding: BufferEncoding = ENCODING_UTF8): Promise<void> {

    let content: string;
    if (!isString(data)) {
      content = JSON.stringify(data, null, 2);
    } else {
      content = `${data}`;
    }

    await asyncWriteFile(pathname, content, {encoding});
  }

  static async writeBuffer(pathname: string, buffer: Buffer): Promise<boolean> {
    if (Buffer.isBuffer(buffer) && buffer.length > 0) {
      try {
        await asyncWriteFile(pathname, buffer, 'binary');
        return true;
      } catch (e: any) {
        Logger.error(`Write Buffer to "${pathname} is failed => ${e.message}`, null, FILE_GROUP);
        return false;
      }
    }
    return false;
  }

  static async readBuffer(pathname: string): Promise<Buffer> {
    const data = await asyncReadFile(pathname, 'binary');
    if (!Buffer.isBuffer(data)) {
      return Buffer.from(data);
    }
    return data;
  }

  static async readJson<T>(pathname: string): Promise<T> {
    try {
      const text = await File.readFile(pathname);
      return JSON.parse(text);
    } catch (e: any) {
      Logger.error(`Parse file "${pathname}" is failed => ${e.message}`, null, FILE_GROUP);
      throw e;
    }
  }

  static async stats(pathname: string, showError?: boolean): Promise<fs.Stats | null> {
    try {
      return await asyncStat(pathname);
    } catch (e: any) {
      if (isNil(showError) || showError === true) {
        Logger.error(`Stats of "${pathname}" is failed => ${e.message}`, null, FILE_GROUP);
      }
      return null;
    }
  }

  static async isDirectory(pathname: string): Promise<boolean> {
    const stats = await File.stats(pathname, false);
    return stats?.isDirectory() ?? false;
  }

  static async isFile(pathname: string): Promise<boolean> {
    const stats = await File.stats(pathname, false);
    return stats?.isFile() ?? false;
  }

  static async exists(pathname: string): Promise<boolean> {
    const stats = await File.stats(pathname, false);
    return !isNil(stats);
  }

  static async mkdir(path: string): Promise<boolean> {
    try {
      await asyncMkDir(path, { recursive: true });
      return true;
    } catch (e) {
      return false;
    }
  }

  static async copyFile(src: string, dest: string): Promise<boolean> {
    try {
      await asyncCopyFile(src, dest);
      return true;
    } catch (e: any) {
      Logger.error(`Copy File ${src} is failed (${e.message}) => ${dest}`);
      return false;
    }
  }

  static async moveFile(src: string, dest: string): Promise<boolean> {
    try {
      await asyncMoveFile(src, dest);
      return true;
    } catch (e: any) {
      Logger.error(`Move File is failed (${e.message})`);
      return false;
    }
  }

  static async deleteFile(str: string): Promise<boolean> {
    try {
      await asyncUnlink(str);
      return true;
    } catch (e: any) {
      Logger.error(`Delete File error (${e.message}}`);
      return false;
    }
  }
}
