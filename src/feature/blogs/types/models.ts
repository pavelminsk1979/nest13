export type CreateBlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

type SortDirection = 'asc' | 'desc';

export type BlogQueryParams = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
};
