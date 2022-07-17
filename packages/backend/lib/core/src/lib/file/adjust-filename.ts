/**
 * Adjust the filename and remove unwanted characters in the filename.
 *
 * @param {string} filename the filename
 * @return {string} the adjusted filename
 */
export const adjustFilename = (filename: string): string => {
  return filename
    .toLowerCase()
    .replace(/[ ()$&%+<>{}[\]!?]/g, '-')
    .replace('--', '-')
    .replace('-.', '.');
}
