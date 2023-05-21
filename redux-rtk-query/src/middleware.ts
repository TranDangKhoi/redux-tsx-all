import {
  AnyAction,
  isRejected,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { isSerializedError, isUnprocessableEntityError } from "utils/helpers";
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
    /**
     * isRejectedWithValue là một function giúp kiểm tra
     * những action có rejectedWithValue = true từ createAsyncThunk (hay nói cách khác là từ server trả về)
     * RTK Query sử dụng createAsyncThunk bên trong nên chúng ta
     * có thể dùng isRejectedWithValue để kiểm tra lỗi
     */
    if (isRejected(action) && !isRejectedWithValue(action)) {
      if ((action as AnyAction)?.error?.message) {
        toast.error((action as AnyAction)?.error.message);
      } else {
        toast.error("Có lỗi trong quá trình thực thi");
      }
    }
    if (isRejectedWithValue(action)) {
      // Mỗi khi thực hiện query hoặc mutation mà có lỗi thì nó sẽ chạy
      // vào điều kiện if này, nhưng chỉ có những lỗi từ server thì action
      // mới có rejectedWithValue = true
      // Còn những action mà liên quan đến việc caching bị rejected thì, rejectedWithValue = false
      if (isPayloadErrorMessage(action.payload)) {
        toast.error(action.payload.data.error);
      } else if (!isUnprocessableEntityError(action.payload)) {
        // Các lỗi có status code khác ngoài 422
        toast.error(action.error.message);
      }
    }
    return next(action);
  };
