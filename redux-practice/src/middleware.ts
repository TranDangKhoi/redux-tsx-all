import { AnyAction, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const rtkQueryLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  return next(action);
};
