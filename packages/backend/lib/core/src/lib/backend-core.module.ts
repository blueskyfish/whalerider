import { Global, Module } from '@nestjs/common';
import { CryptoService } from './crypto';

const services = [
  CryptoService,
]

/**
 * Core Nestjs module for backend application
 */
@Global()
@Module({
  providers: [
    ...services,
  ],
  exports: [
    ...services,
  ],
})
export class BackendCoreModule {}
