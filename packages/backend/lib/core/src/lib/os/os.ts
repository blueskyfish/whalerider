import * as path from 'path';
import * as os from 'os';

export class OS {

  /**
   * Get the user home directory name
   */
  static get homePath() {
    return os.homedir();
  }

  /**
   * Get the path with the user home extended
   *
   * @param pathname the pathname in the user home directory
   */
  static getHomePathWith(pathname: string): string {
    return path.join(os.homedir(), pathname);
  }
}
