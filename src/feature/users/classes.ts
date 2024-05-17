export class DtoUser {
  createdAt: string;

  constructor(
    public login: string,
    public passwordHash: string,
    public email: string,
  ) {
    this.createdAt = new Date().toISOString();
  }
}

export class ViewUser {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
  ) {}
}
