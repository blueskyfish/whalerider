/**
 * The part of the package.json
 */
export interface PackageModel {
  name: string;
  title?: string;
  description: string;
  version: string;
  author: string | { name: string, email: string };
}
