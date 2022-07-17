import { toUpper } from '@blueskyfish/grundel';
import { Logger, NotFoundException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { OpenApiSetting } from '../openapi';
import { BootstrapOptions } from './bootstrap-options';

/**
 * Bootstrap the application
 *
 * @param options the options configuration
 */
export async function bootstrap(options: BootstrapOptions): Promise<void> {
  const LOG_CONTEXT = options.logger?.context ?? 'Bootstrap';

  const app = await NestFactory.create(options.appModule);

  const configService = app.get(ConfigService);
  const port: number = configService.get('http.port', options.httpPort)
  const host: string = configService.get('http.host', options.httpHost);

  // Validation input parameters and / or body
  app.useGlobalPipes(new ValidationPipe({
    enableDebugMessages: true,
    skipMissingProperties: true,
  }));

  if (options.production) {
    // use only this log levels
    app.useLogger(['log', 'error','warn']);
  }

  if (!options.production) {
    // (only on dev stage) Open API Configuration
    const openApiOptions = new DocumentBuilder()
      .setTitle(options.openApi.title)
      .setDescription(options.openApi.description)
      .setVersion(options.openApi.version)
      .addSecurity(OpenApiSetting.ApiKey, {
        name: OpenApiSetting.HttpAuthHeader,
        in: 'header',
        type: 'apiKey',
        description:
          'The api key for access for protected resource (contains the current user information)',
      })
      .build();
    const document = SwaggerModule.createDocument(app, openApiOptions);

    // The OpenAP UI is available under http://$host:$port/openapi-ui
    SwaggerModule.setup('openapi-ui', app, document);
    // The OpenAPI document is available under GET: http://$host:$port/openapi.json
    app.use('/openapi.json', (req: Request, res: Response, next: NextFunction) => {
        if (toUpper(req.method) === 'GET') {
          return res.send(document);
        }
        return next(new NotFoundException());
      }
    );
  }

  await app.listen(port, host, () => {
    Logger.log(`🚀 Application "${options.appName}" is running on: http://${host}:${port}/`, LOG_CONTEXT);
    if (!options.production) {
      Logger.log(`🔖 OpenApi of "${options.appName}" is reaching in http://${host}:${port}/openapi-ui`, LOG_CONTEXT);
    }
  });
}
