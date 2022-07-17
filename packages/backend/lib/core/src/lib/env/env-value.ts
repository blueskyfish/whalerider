import { isNil, toBool, toInt } from '@blueskyfish/grundel';

export class EnvValue {
  get hasValue(): boolean {
    return !isNil(this.value);
  }

  get asString(): string {
    return `${this.value}`;
  }

  get asNumber(): number {
    return toInt(this.value);
  }

  get asBool(): boolean {
    return toBool(this.value);
  }

  constructor(private readonly value?: string) {}
}
