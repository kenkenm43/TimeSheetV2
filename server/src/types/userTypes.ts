export type UserType = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  idCard: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  resetToken: string;
  refreshToken: string;
  roleId: number;
};

export type UserRegisterPayloadType = {
  username: string;
  firstName: string;
  lastName: string;
  idCard: string;
  password: string;
};
export type UserLoginPayloadType = {
  username?: string;
  idCard?: string;
  password: string;
};
export type PasswordReset = {
  password: string;
  token: string;
};
export type DecodeRefreshToken = {
  username: string;
};
