import * as fs from 'fs';
import { promisify } from 'util';
import * as rimraf from 'rimraf';

export const asyncReadFile = promisify(fs.readFile);
export const asyncWriteFile = promisify(fs.writeFile);
export const asyncStat = promisify(fs.stat);
export const asyncMkDir = promisify(fs.mkdir);


export async function asyncExist(path: fs.PathLike): Promise<boolean> {
  try {
    await asyncStat(path);
    return true;
  } catch (e) {
    return false;
  }
}

export async function asyncRimRaf(path: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) {
        return reject(err.message ?? err);
      }
      resolve();
    })
  })
}
