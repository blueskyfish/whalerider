import { Module } from '@nestjs/common';
import { AboutService } from "./about";
import { AboutController } from "./about/about.controller";

const services = [
  AboutService,
]

@Module({
  controllers: [
    AboutController,
  ],
  providers: [
    ...services,
  ],
})
export class BackendSystemModule {}
