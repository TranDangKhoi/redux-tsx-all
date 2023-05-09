import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { HttpStatusCode } from "axios";

type ErrorFormObject = {
  [key: string | number]: string | ErrorFormObject | ErrorFormObject[];
};

type EntityError = {
  status: HttpStatusCode.UnprocessableEntity;
  data: {
    error: ErrorFormObject;
  };
};

// Narrow Type
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

export function isSerializedError(error: unknown): error is SerializedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string"
  );
}

export function isUnprocessableEntityError(
  error: unknown
): error is EntityError {
  return (
    isFetchBaseQueryError(error) &&
    error.status === HttpStatusCode.UnprocessableEntity &&
    typeof error.data === "object" &&
    !(error.data instanceof Array)
  );
}
