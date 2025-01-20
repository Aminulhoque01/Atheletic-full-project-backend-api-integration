// import { IGenericErrorMessage } from './error';

import { IGenericErrorMessage } from "./error";

export type IGeneticResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  statusCode: number;

  message: string;
  errorMessage: IGenericErrorMessage[];
};


export interface PaginateResult<T> {
  data: any;
  meta: any;
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}