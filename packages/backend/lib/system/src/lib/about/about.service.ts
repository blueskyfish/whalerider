import { notFound } from '@blueskyfish/backend-commons';
import { File } from '@blueskyfish/backend-core';
import { isNil } from '@blueskyfish/grundel';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { About } from './about.model';

@Injectable()
export class AboutService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AboutService.name);

  private about: About | null = null;

  constructor(private configService: ConfigService) {}

  getAbout(): About {
    if (!this.about) {
      throw notFound({
        code: 'about.notFound',
        message: 'About information not found',
      });
    }
    return this.about;
  }

  async onApplicationBootstrap(): Promise<any> {
    const filename = this.configService.get<string>('system.about', '??');
    if (filename === '??' || !(await File.exists(filename))) {
      this.logger.error(`App about information is missing (${filename})`);
      return;
    }
    const about = await File.readJson<About>(filename);
    if (isNil(about)) {
      this.logger.warn(`App about information not exist (${filename})`);
      return;
    }
    this.logger.log(
      `Found app about information:\n${JSON.stringify(about, null, 2)}`
    );
    this.about = about;
  }
}
