import {
  BadRequestException,
  ForbiddenException, HttpException, HttpStatus,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ErrorItem } from './error-item';


export function badRequest<T extends ErrorItem>(error: T, description?: string): BadRequestException {
  return new BadRequestException(error, description);
}

export function unauthorized<T extends ErrorItem>(error: T, description?: string): UnauthorizedException {
  return new UnauthorizedException(error, description);
}

export function notFound<T extends ErrorItem>(error: T, description?: string): NotFoundException {
  return new NotFoundException(error, description);
}

export function notAccept<T extends ErrorItem>(error: T, description?: string): NotAcceptableException {
  return new NotAcceptableException(error, description);
}

export function forbidden<T extends ErrorItem>(error: T, description?: string): ForbiddenException {
  return new ForbiddenException(error, description);
}

export function internalError<T extends ErrorItem>(error: T): HttpException {
  return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
}
