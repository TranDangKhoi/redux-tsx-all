import { AnyAction, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string;
  };
  message: string;
} {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    typeof (payload as any).data?.error === "string"
  );
}
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
    console.log(action);
    return next(action);
  };
