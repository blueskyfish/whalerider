import { AuthUser } from "./auth.user";

export const DUMMY_ID = '00000000-0000-0000-0000-000000000000';

export const DUMMY = new AuthUser({
  id: DUMMY_ID,
  permissions: [],
  creation: -1,
});
