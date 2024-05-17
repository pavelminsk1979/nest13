export type CreateUserInputModel = {
  login: string;
  password: string;
  email: string;
};

type SortDirection = 'asc' | 'desc';

export type UserQueryParams = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type ViewUser = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type ViewArrayUsers = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ViewUser[];
};
