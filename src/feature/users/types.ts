export type CreateUserInputModel = {
  login: string;
  password: string;
  email: string;
};
export type OutputUser = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
