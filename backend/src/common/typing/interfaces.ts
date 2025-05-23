import { Credits, Subscription, User } from '@prisma/client';

export interface IUser extends User {
  subscription: Subscription;
  credits: Credits;
}
