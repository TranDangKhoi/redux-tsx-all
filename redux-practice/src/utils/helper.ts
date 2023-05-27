import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === "object";
};
