/*!
 * Entry point for backend "user"
 */

import { bootstrap, BootstrapOptions } from '@blueskyfish/backend-commons';
import { Logger } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const options: BootstrapOptions = {
  appName: 'Blueskyfish AppStarter',
  appModule: AppModule,
  httpHost: 'localhost',
  httpPort: 52050,
  production: environment.production,
  openApi: {
    title: 'Blueskyfish User',
    description: 'The OpenApi Overview of "Blueskyfish User"',
    version: "0.0.1"
  }
};

bootstrap(options).catch((err) =>
  Logger.error(`🔥 Application "${options.appName}" could not start (${err.message})`, err.stack, 'Boostrap')
);
