import { DateTime } from 'luxon';

export type AuthData = {
  readonly id: string;
  readonly permissions: string[];
  readonly creation: number;
};

export class AuthUser {

  get id(): string {
    return this.data.id;
  }

  get creation(): DateTime {
    return DateTime.fromSeconds(this.data.creation);
  }

  constructor(private data: AuthData) {
  }

  hasPermission(permission: string): boolean {
    return this.data.permissions.includes(permission);
  }
}
