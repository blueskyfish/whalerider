import { QueueAction } from './queue-action';

/**
 * The shared user entity using in the application **api-user** and **api-booking**
 */
export interface QueueUser {
  readonly action: QueueAction;
  readonly id: string;
  readonly name: string;
}
