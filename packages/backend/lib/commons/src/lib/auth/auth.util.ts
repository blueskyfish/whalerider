import { DUMMY } from "./auth.dummy";
import { AuthUser } from "./auth.user";
import { Request } from 'express';

export const getAuthUser = (req: Request): AuthUser => {
  return ((req as any).authUser as AuthUser) ?? DUMMY;
};

export const setAuthUser = (req: Request, authUser: AuthUser): void => {
  (req as any).authUser = authUser;
};
