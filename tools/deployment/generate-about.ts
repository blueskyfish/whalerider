/*!
 * Generates the app about information. It merges the information from "package.json" and "git"
 *
 * Usage:
 * ts-node -P ./tools/deployment/tsconfig.json --cwd . ./tools/deployment/generate-info.ts \
 *   --stage=test --debug --package=path/to/package.json --output=path/to/output.json
 *
 * Parameters
 *
 * --state=stage        The stage value "dev" (default) or other values (e.g "prod", "test")
 * --package=path/to..  The path to the package.json (default "./package.json")
 * --output=path/to...  The path for the output of the app-about.json (default "./app-about.json")
 * --debug=true         Shows message output (default "false")
 *
 */

import * as gitRepoInfo from 'git-repo-info';
import * as minimist from 'minimist';
import * as path from 'path';
import { AppAbout } from "./models/app-about.model";
import { PackageModel } from "./models/package.model";
import { asyncExist, asyncMkDir, asyncReadFile, asyncWriteFile } from "./util/fs";

export interface GenerateInfoOptions {
  packagePath?: string;
  outputPath?: string;
  debug?: boolean;
  stage: string;
}

/**
 * Generates the {@link AppAbout} information. It merges the information from `package.json` and **git**
 *
 * @param options The options
 */
export async function generateAbout(options: GenerateInfoOptions): Promise<void> {
  if (!options.packagePath || !options.outputPath) {
    return Promise.reject('Missing Options')
  }

  try {
    if (options.debug) {
      console.debug('> Start generate AppAbout information...');
    }

    const packageText = await asyncReadFile(options.packagePath, {encoding: 'utf8'});
    const pkg: PackageModel = JSON.parse(packageText);

    const git = gitRepoInfo();

    const now = new Date().toISOString();
    const author: string = typeof pkg.author === 'string' ?
      pkg.author :
      `${ pkg.author.name } <${ pkg.author.email }>`;

    const version = `${ pkg.version }-${ options.stage }`;

    const appAbout: AppAbout = {
      name: pkg.name,
      title: pkg.title ?? pkg.name,
      version,
      description: pkg.description,
      author,
      commit: git.sha,
      commitDate: git.committerDate || git.authorDate || now,
      branch: git.branch,
      buildDate: now,
    };

    if (options.debug) {
      console.debug('> AppAbout information\n%s', JSON.stringify(appAbout, null, 2));
    }

    const dirName = path.dirname(options.outputPath);
    if (!(await asyncExist(dirName))) {
      await asyncMkDir(dirName, {recursive: true});
    }

    await asyncWriteFile(options.outputPath, JSON.stringify(appAbout, null, 2), {encoding: 'utf8'});

    if (options.debug) {
      console.debug('> Finish generate AppAbout information');
    }

  } catch (e) {
    return Promise.reject(`Generate app info is failed => "${ e?.message }"`);
  }
}

async function main() {
  const args = minimist(process.argv.slice(2), {
    string: [ 'stage', 'package', 'output', 'debug' ],
    default: {
      stage: 'dev',
      debug: false,
      package: './package.json',
      output: './var/backend/app-about.json'
    }
  });

  const options: GenerateInfoOptions = {
    packagePath: args.package ?? './package.json',
    outputPath: args.output ?? './var/backend/app-about.json',
    debug: args.debug ?? false,
    stage: args.stage ?? 'dev',
  };

  await generateAbout(options);
}

main().catch((err) => console.error(`> Error: ${ err }`));
