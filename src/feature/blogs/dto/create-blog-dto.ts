export class CreateBlogDto {
  createdAt: string;

  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public isMembership: boolean,
  ) {
    this.createdAt = new Date().toISOString();
  }
}
