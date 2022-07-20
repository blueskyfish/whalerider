/*!
 * Entry point for backend "user"
 */

import { bootstrap, BootstrapOptions } from '@blueskyfish/backend-commons';
import { Logger } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const NAME = 'Blueskyfish Backend User';
const DESCRIPTION = `
The OpenApi Overview of **Blueskyfish Backend User**

Blueskyfish Repository <https://github.com/blueskyfish/whalerider.git>
`

const options: BootstrapOptions = {
  appName: NAME,
  appModule: AppModule,
  httpHost: 'localhost',
  httpPort: 52050,
  production: environment.production,
  openApi: {
    title: NAME,
    description: DESCRIPTION,
    version: "0.0.1"
  }
};

bootstrap(options).catch((err) =>
  Logger.error(`🔥 Application "${options.appName}" could not start (${err.message})`, err.stack, 'Boostrap')
);
