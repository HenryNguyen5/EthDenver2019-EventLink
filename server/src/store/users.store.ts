export enum UserState {
  CHALLENGE_SENT,
  CHALLENGE_VERIFIED
}

export interface Stage1 {
  state: UserState.CHALLENGE_SENT;
  isVerified: false;
  expectedMessage: string;
}

export interface Stage2 {
  state: UserState.CHALLENGE_VERIFIED;
  isVerified: boolean;
  expectedMessage: string;
}
type User = Stage1 | Stage2;

export interface UserStore {
  [user: string]: User;
}

export const userStore: UserStore = {};
