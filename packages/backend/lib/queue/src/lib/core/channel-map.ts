import { ReplaySubject } from 'rxjs';

/**
 * Not emit the value
 */
export class NullSubject<T> extends ReplaySubject<T> {
  override next(value: T) {
  }
}

/**
 * A map with the channels and there observable
 */
export type ChannelMap = {
  [channel: string]: ReplaySubject<any>;
}

