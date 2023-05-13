import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { HttpStatusCode } from "src/constants/HttpStatusCode.enum";

type ErrorFormObject = {
  [key: string | number]: string | ErrorFormObject | ErrorFormObject[];
};

type UnprocessableEntityError = {
  status: HttpStatusCode.UnprocessableEntity;
  data: {
    error: ErrorFormObject;
  };
};

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === "object" && error !== null && "status" in error;
};

export const isUnprocessableEntityError = (error: unknown): error is UnprocessableEntityError => {
  return (
    isFetchBaseQueryError(error) &&
    error.status === HttpStatusCode.UnprocessableEntity &&
    typeof error.data === "object" &&
    !(error.data instanceof Array)
  );
};
