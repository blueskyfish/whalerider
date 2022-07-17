import { Global, Module } from '@nestjs/common';
import { AuthMiddleware } from './auth';

const middlewares = [
  AuthMiddleware,
];

@Global()
@Module({
  providers: [
    ...middlewares,
  ],
  exports: [
    ...middlewares,
  ]
})
export class BackendCommonsModule {

}
