import { AnyAction, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";

// error sẽ chia ra làm 2 kiểu nên ta phải handle hiển thị cho cả 2
export const rtkQueryErrorsLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  return next(action);
};
