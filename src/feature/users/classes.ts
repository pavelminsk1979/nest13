import { ViewUser } from './types';
import { UserDocument } from './domainUser';

export class DtoUser {
  createdAt: string;

  constructor(
    public login: string,
    public passwordHash: string,
    public email: string,
  ) {
    this.createdAt = new Date().toISOString();
  }

  static getViewModel(user: UserDocument): ViewUser {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
