export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  pagination?: {
    totalPage?: number;
    currentPage?: number;
    prevPage: number;
    nextPage: number;
    limit?: number;
    totalItem?: number;
  };
  data: T;
  token?: string;
};

export type IQueryObj = {
  [key: string]: unknown;
  page?: string;
  limit?: string;
  searchTerm?: string;
  fields?: string;
  sortBy?: string;
  sortOrder?: string;
};

export type ISearchFields = string[];
