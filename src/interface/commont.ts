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
