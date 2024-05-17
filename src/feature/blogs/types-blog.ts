export type CreateBlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type ViewBlog = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};