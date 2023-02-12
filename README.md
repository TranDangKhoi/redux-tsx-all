## Redux là gì?

Redux là một state container cho Javascript apps.

- Là một single store chứa global state
- Thực hiện event => Dispatch các object action vào store => reducer lắng nghe và trả về state update

Với React thì Redux giúp tạo 1 global state, giúp dễ dàng truyền state xuống các component khác nhau mà không gặp phải vấn đề truyền prop quá nhiều bước (cách giải quyết tương tự `useContext`)

> Redux giống như `useReducer` + `useContext`

Bạn có thể dùng Redux với bất kỳ thư viện view nào, nhưng thường thì người ta dùng với React.

Đây là cách viết Redux core

```js
const ADD_TODO = "ADD_TODO";
const TODO_TOGGLED = "TODO_TOGGLED";

// function tạo action, nó return một plain object
export const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { text, id: nanoid() },
});

export const todoToggled = (id) => ({
  type: TODO_TOGGLED,
  payload: id,
});

export const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return state.concat({
        id: action.payload.id,
        text: action.payload.text,
        completed: false,
      });
    case TODO_TOGGLED:
      return state.map((todo) => {
        if (todo.id !== action.payload.id) return todo;

        return {
          ...todo,
          completed: !todo.completed,
        };
      });
    default:
      return state;
  }
};
```

### Data Flow

Data flow một chiều của redux có thể tóm gọn như sau

- User click thì sẽ dispatch một action
- reducer lắng nghe các action trong app và xử lý tính toán để trả về một state mới
- component đọc state mới và cập nhật lại UI

> **Data flow theo set state thông thường**
>
> - User click thì sẽ set state với một giá trị mới
> - component đọc state mới và cập nhật lại UI
>
> Flow của set state ngắn hơn so với reducer

![Redux Data Flow](./ReduxDataFlowDiagram.gif)

Redux sử dụng một vài **thuật ngữ**

- **action**: là một plain object (object đơn giản tạo bằng `{}` hoặc `new Object()` ) chứa field là `type` mô tả chuyện gì vừa xảy ra. action là một object nhưng chúng ta thường khai báo là một function return về object để có thể dễ dàng gửi data vào action. Chúng ta thường gọi đó là `payload`
- **reducer**: là một function để tính toán state mới dựa vào previous state + action
- **store**: store sẽ chạy root reducer bất cứ khi nào một action được dispatch
- **dispatch**: là một function dùng để gửi một action đi đến store (hay còn gọi reducer cũng được)

> Store là một object chứa state tree. Chỉ nên có duy nhất 1 store trong app.

```ts
type Store = {
  dispatch: Dispatch;
  getState: () => State;
  subscribe: (listener: () => void) => () => void;
  replaceReducer: (reducer: Reducer) => void;
};
```

Có một vấn đề là chỉ để thay đổi một state mà chúng ta tạo ra quá nhiều code thừa: tạo constants, actions, cập nhật state làm sao để không phải mutate state gốc. Và vấn đề này lặp đi lặp lại một cách nhàm chán => Team Redux tạo ra Redux Toolkit để giải quyết vấn đề này

## Redux Toolkit là gì?

Redux Toolkit sinh ra để đơn giản quá cách chúng ta làm việc với redux, tập trung vào logic hơn là những "boilerplate" không cần thiết.

> Redux Toolkit mới ra ~ 2018, vậy nên trước đó người ta chỉ dùng Redux thôi. Vì thế một số dự án các bạn join sau này có thể vẫn còn dùng Redux với cách tiếp cận cũ.

> Team Redux đều recommend dùng Redux Toolkit trên cả trang [https://redux.js.org/](https://redux.js.org/) và [https://react-redux.js.org/](https://react-redux.js.org/)

Bây giờ sẽ có các document sau:

- Document chính thức của Redux: [https://redux.js.org/](https://redux.js.org/)
- Document chính thức của Redux cho React: [https://react-redux.js.org/](https://react-redux.js.org/)
- Document chính thức của Redux-Toolkit: [https://redux-toolkit.js.org/](https://redux-toolkit.js.org/)

> Chúng ta có thể bỏ qua bước tạo một project bằng redux kiểu cũ, vì đơn giản là nó giống `useReducer` và `useContext`. Học luôn redux toolkit cho tiết kiệm thời gian

Redux Toolkit bao gồm các packages nhỏ sau

- Redux
- ImmerJs: Dùng làm việc với immutable state thuận tiện hơn (cập nhật state dễ dàng)
- RTK query: Fetch & catching API

Cách cài bộ redux toolkit vào app

```bash
yarn add react-redux @reduxjs/toolkit
```

# createAction

`createAction` là một helper function dùng để tạo một Redux action

```ts
function createAction(type, prepareAction?);
```

```ts
import { createAction } from "@reduxjs/toolkit";

const increment = createAction<number | undefined>("counter/increment");

let action = increment();
// { type: 'counter/increment' }

action = increment(3);
// returns { type: 'counter/increment', payload: 3 }

console.log(increment.toString());
// 'counter/increment'

console.log(`The action type is: ${increment}`);
// 'The action type is: counter/increment'
```

## Sử dụng Prepare callback để tinh chỉnh payload

Mặc định bạn truyền vào gì thì payload sẽ là cái đó, trong trường hợp bạn muốn truyền vào x nhưng payload là x + 2 thì bạn có thể dùng prepare function callback

```ts
import { createAction, nanoid } from "@reduxjs/toolkit";

const addTodo = createAction("todos/add", function prepare(text: string) {
  return {
    payload: {
      text,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    },
  };
});

console.log(addTodo("Write more docs"));
/**
 * {
 *   type: 'todos/add',
 *   payload: {
 *     text: 'Write more docs',
 *     id: '4AJvwMSWEHCchcWYga3dj',
 *     createdAt: '2019-10-03T07:53:36.581Z'
 *   }
 * }
 **/
```

## Sử dụng với createReducer()

Bởi vì action creator được return từ `createAction()` có method `toString()` bị override rồi, nên ta có thể dễ dàng dùng với `createReducer()`

```ts
import { createAction, createReducer } from "@reduxjs/toolkit";

const increment = createAction<number>("counter/increment");
const decrement = createAction<number>("counter/decrement");

const counterReducer = createReducer(0, (builder) => {
  builder.addCase(increment, (state, action) => state + action.payload);
  builder.addCase(decrement, (state, action) => state - action.payload);
});
```

# createReducer

Đây là cách tiếp cận reducer kiểu cũ

```js
const initialState = { value: 0 };

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "increment":
      return { ...state, value: state.value + 1 };
    case "decrement":
      return { ...state, value: state.value - 1 };
    case "incrementByAmount":
      return { ...state, value: state.value + action.payload };
    default:
      return state;
  }
}
```

Cách này khá là phức tạp và dễ gây lỗi, những lỗi này có thể đến từ việc

- Bạn mutate state
- Bạn quên return một state mới
- Bạn quên khai báo default case

Với `createReducer` chúng ta có thể dễ dàng giải quyết các vấn đề trên:

- Chúng ta có thể mutate state nhờ vào thư viện immer được tích hợp bên trong
- Không cần thiết phải return một state mới
- Không cần khai báo default case

## Cách dùng với "Builder Callback"

`createReducer` nhận vào 2 param

- **initialState** `State | () => State`: Là state khởi tạo hoặc một function khởi tạo state, function này khá hữu ích khi ta muốn lấy state từ localstorage
- **builderCallback** `(builder: Builder) => void`: Đây là callback nhận vào tham số là Builder object dùng để định nghĩa các case cho reducer

```ts
import {
  createAction,
  createReducer,
  AnyAction,
  PayloadAction,
} from "@reduxjs/toolkit";

const increment = createAction<number>("increment");
const decrement = createAction<number>("decrement");

function isActionWithNumberPayload(
  action: AnyAction
): action is PayloadAction<number> {
  return typeof action.payload === "number";
}

const reducer = createReducer(
  {
    counter: 0,
    sumOfNumberPayloads: 0,
    unhandledActions: 0,
  },
  (builder) => {
    builder
      // Dùng addCase để thêm case trong trường hợp dùng createAction
      .addCase(increment, (state, action) => {
        // mutate state dễ dàng nhờ immer xử lý bên trong
        // không cần phải return state mới
        state.counter += action.payload;
      })
      // Thêm case bằng cách dùng .addCase như muỗi chuỗi line
      .addCase(decrement, (state, action) => {
        state.counter -= action.payload;
      })
      // addMatcher cho phép chúng ta thêm "matcher function"
      // nếu "matcher function" return true thì nó sẽ nhảy vào case này
      .addMatcher(isActionWithNumberPayload, (state, action) => {})
      // nếu muốn thêm default case khi không match case nào cả
      // thì dùng addDefaultCase
      .addDefaultCase((state, action) => {});
  }
);
```

## Cách dùng với "Map Object"

Cách này thì ngắn hơn Builder Callback như chỉ hoạt động với Javascript, Typescript thì không hoạt động ổn và ít tương thích với các IDE. Team Redux khuyên dùng Builder Callback hơn là cách này

Nếu dispatch một action thông thường nào mà có type là 'increment' hoặc 'decrement' thì sẽ nhảy vào case dưới

```js
const incrementAction = {
  type: "increment",
};
```

```js
const counterReducer = createReducer(0, {
  increment: (state, action) => state + action.payload,
  decrement: (state, action) => state - action.payload,
});
```

Có thể dùng chung với action mà được tạo từ `createAction`

```js
const increment = createAction("increment");
const decrement = createAction("decrement");

const counterReducer = createReducer(0, {
  [increment]: (state, action) => state + action.payload,
  [decrement.type]: (state, action) => state - action.payload,
});
```

## Log giá trị draft state trong reducer

draft state là thuật ngữ bên immer, nghĩa là state nháp, đang trong quá trình tính toán

Khi chúng ta log state này, trình duyệt sẽ hiển thị ra định dạng Proxy khó đọc.

Khi sử dụng `createReducer` hay `createSlice` thì bạn có thể import `current` để phục vụ cho việc log draft state

```ts
import { createSlice, current } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "todos",
  initialState: [{ id: 1, title: "Example todo" }],
  reducers: {
    addTodo: (state, action) => {
      console.log("before", current(state));
      state.push(action.payload);
      console.log("after", current(state));
    },
  },
});
```

# createSlice

createSlice là sự kết hợp của createReducer và createAction

Mình khuyên các bạn nên dùng createSlice thay vì createReducer vì các bạn không cần tạo action, action sẽ tự động generate ra cho các bạn.

```ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState = { value: 0 } as CounterState;

const counterSlice = createSlice({
  name: "counter", // Đây là prefix cho action type của bạn
  initialState, // Giá trị khởi tạo state cho reducer, cũng có thể là function khởi tạo
  reducers: {
    // key name sẽ được dùng để generate ra action
    increment(state) {
      state.value++;
    },
    decrement(state) {
      state.value--;
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
});

// export action được generate ra từ slice
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// export reducer được generate ra từ slice
export default counterSlice.reducer;
```

Với `reducers` trên thì ta không dùng được với những trường hợp

- default case
- matcher case

=> Nên dùng `extraReducers` trong 2 trường hợp này

Vì đặc tính tự động generate ra action khi dùng `reducers` nên nếu chúng ta sử dụng một thunk thì không nên check trong `reducers` mà hãy check trong `extraReducers`

## extraReducers

`extraReducers` cũng giống `reducers` nhưng nó sẽ không generate ra actions. `extraReducers` cho phép dùng một số tính năng như `addMatcher` hay `addDefaultCase`

> `extraReducers` chính xác giống như reducer trong `createReducer()`

```ts
import { createAction, createSlice, Action, AnyAction } from "@reduxjs/toolkit";
const incrementBy = createAction<number>("incrementBy");
const decrement = createAction("decrement");

interface RejectedAction extends Action {
  error: Error;
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith("rejected");
}

createSlice({
  name: "counter",
  initialState: 0,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(incrementBy, (state, action) => {})

      .addCase(decrement, (state, action) => {})
      .addMatcher(isRejectedAction, (state, action) => {})
      .addDefaultCase((state, action) => {});
  },
});
```

`extraReducers` cho phép dùng cú pháp "map object" nhưng với typescript thì chúng ta nên dùng builder callback

## Tóm lại khi nào dùng reducers, khi nào dùng extraReducers

Dùng reducers khi muốn

- generate ra action

Dùng extraReducers khi

- Không muốn generate action
- muốn dùng addMatcher, addDefaultCase
- Khi dùng với createAsyncThunk

## RTK Query - Giải pháp tối ưu hơn để fetch API

Nếu mà phải sử dụng createAsyncThunk, thì ta sẽ phải tạo ra 3 generic async thunk status (fulfilled, pending, reject), config kha khá vất vả vì phải ghi nhớ nhiều hoặc mất công lên doc copy paste, code loạn

Nếu API của bạn sau này còn sinh ra nhiều endpoints khác nữa thì ta sẽ phải tạo thêm rất nhiều case, dẫn tới việc code dài mà lại không tối ưu, phải handle nhiều case hơn (useEffect, cleanup function, signal, abort ...), mất thời gian maintain/update chức năng hơn. Ví dụ:

```ts
import http from "utils/http";
import { Post } from "../../types/post.type";
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AsyncThunk,
} from "@reduxjs/toolkit";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulFilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;

interface BlogState {
  postList: Post[];
  editingPost: Post | null;
  loading: boolean;
  currentRequestId: undefined | string;
}

const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined,
};

// Mỗi API đều có 4 chức năng CRUD và còn mở rộng ra thêm nữa
export const getPostList = createAsyncThunk(
  "blog/getPostList",
  async (_, thunkAPI) => {
    const response = await http.get<Post[]>("/posts", {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const addPost = createAsyncThunk(
  "blog/addPost",
  async (body: Omit<Post, "id">, thunkAPI) => {
    const response = await http.post<Post>("/posts", body, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "blog/updatePost",
  async (body: Post, thunkAPI) => {
    try {
      const response = await http.put<Post>(`/posts/${body.id}`, body, {
        signal: thunkAPI.signal,
      });
      return response.data;
    } catch (err: any) {
      if (err.name === "AxiosError" && err.response.status === 422) {
        return thunkAPI.rejectWithValue(err.response.data);
      }
      throw err;
    }
  }
);

export const deletePost = createAsyncThunk(
  "blog/deletePost",
  async (postId: string, thunkAPI) => {
    const response = await http.delete(`posts/${postId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    startEditingPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const foundPost =
        state.postList.find((post) => post.id === postId) || null;
      state.editingPost = foundPost;
    },
    cancelEditingPost: (state) => {
      state.editingPost = null;
    },
    finishEditingPost: (state, action: PayloadAction<Post>) => {
      const postId = action.payload.id;
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload;
          state.editingPost = null;
          return true;
        }
        state.editingPost = null;
        return false;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.find((post, index) => {
          if (post.id === action.payload.id) {
            state.postList[index] = action.payload;
            return true;
          }
          return false;
        });
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        const newPostList = state.postList.filter((post) => post.id !== postId);
        state.postList = newPostList;
      })
      // Phải add một đống matcher cho mỗi loại status trả về (fullfilled, pending, rejected)
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          state.loading = true;
          state.currentRequestId = action.meta.requestId;
        }
      )
      .addMatcher<RejectedAction | FulFilledAction>(
        (action) =>
          action.type.endsWith("/rejected") ||
          action.type.endsWith("/fulfilled"),
        (state, action) => {
          if (
            state.loading &&
            state.currentRequestId === action.meta.requestId
          ) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      );
  },
});

export const { cancelEditingPost, finishEditingPost, startEditingPost } =
  blogSlice.actions;

const blogReducer = blogSlice.reducer;
export default blogReducer;
```

Nhìn mà chóng cả mặt, vả lại code ở bên trong các component cũng sẽ dài hơn mà lại trông cũng chưa hẳn là tường minh cho lắm. Cho nên team Redux đã làm thêm Redux Toolkit Query - thư viện thuộc hệ sinh thái Redux giúp chúng ta quản lý việc gọi API và caching dễ dàng.

In contrast, khi bạn sử dụng RTK Query, các bạn chỉ cần config một lần là hiểu => khá dễ để học thuộc ghi nhớ

B1: Tạo một file `store.ts` nằm bên trong thư mục `src`

```ts
import { blogApi } from "./pages/blog/blog.service";
import blogReducer from "pages/blog/blog.slice";
import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {},
});

setupListeners(store.dispatch);

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

B2: Tạo một file tenFile.service.ts tương ứng với nội dung của page bạn đang làm và để bên cùng cấp với thư mục chứa components của page đó. Ví dụ mình đang làm **`trang hiển thị các bài blogs`** thì mình sẽ đặt như sau:

![Folder Structure](https://i.ibb.co/C6cpT8Q/image.png)

B3: Config bên trong file service bạn vừa tạo

```ts
import { Post } from "types/post.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Nếu bên slice chúng ta dùng createSlice để tạo slice thì bên RTK query dùng createApi
// Với createApi chúng ta gọi là slice api
// Chúng ta sẽ khai báo baseUrl và các endpoints

// baseQuery được dùng cho mỗi endpoint để fetch api
// fetchBaseQuery là một function nhỏ được xây dựng trên fetch API
// Nó không thay thế hoàn toàn được Axios nhưng sẽ giải quyết được hầu hết các vấn đề của bạn
// Chúng ta có thể dùng axios thay thế cũng được, nhưng để sau nhé

// endpoints là object tập hợp những method giúp get, post, put, delete... tương tác với server
// Khi khai báo endpoints nó sẽ sinh ra cho chúng ta các hook tương ứng để dùng trong component
// Ví dụ khi ta khai báo một method trong endpoint là getPosts, redux toolkit sẽ tự động sinh ra cho ta một hook là useGetPostsQuery, khá là hịn hò 😎
// endpoints có 2 kiểu là query và mutation.
// Query: Thường dùng cho GET
// Mutation: Thường dùng cho các trường hợp thay đổi dữ liệu trên server như POST, PUT, DELETE

export const blogApi = createApi({
  reducerPath: "blogApi", // Tên field trong Redux state
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    timeout: 10000,
  }),
  endpoints: (build) => ({
    // Generic Types theo thứ tự là kiểu response trả về và arguments
    getPosts: build.query<Post[], void>({
      query: () => "/posts", // method không có argument
    }),
  }),
});

export const { useGetPostsQuery } = blogApi;
```

Có thể thấy useGetPostsQuery đã được auto-generated ra khi ta tạo endpoints getPosts. Thêm nữa là hook này cung cấp cho ta rất nhiều tính năng hay mà mình sẽ nói thêm ở dưới

B4: Sau khi setup như này thành công thì ta lại quay lại `store.ts` để tiếp tục config middleware:

```ts
import { blogApi } from "./pages/blog/blog.service";
import blogReducer from "pages/blog/blog.slice";
import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer, // thêm reducer được tạo từ API slice
  },
  // Thêm api middleware để enable các tính năng như caching, invalidation, polling, refresh
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(blogApi.middleware),
});

// Optional, nhưng bắt buộc nếu dùng tính năng refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
```

Bây giờ, ta chỉ việc sử dụng trong component thôi:

```tsx
import { useGetPostsQuery } from "pages/blog/blog.service";
import PostItem from "../PostItem";
import SkeletonLoading from "../SkeletonLoading";

const PostList = () => {
  // isLoading chỉ dành cho lần fetch đầu tiên
  // isFetching là cho mỗi lần gọi API
  const { data, isLoading, isFetching } = useGetPostsQuery();
  console.log(data, isLoading, isFetching);
  return (
    <>
      <div className="py-6 bg-white sm:py-8 lg:py-12">
        <div className="max-w-screen-xl px-4 mx-auto md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-center text-gray-800 md:mb-6 lg:text-3xl">
              Khôi Dev Blog
            </h2>
            <p className="max-w-screen-md mx-auto text-center text-gray-500 md:text-lg">
              Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ.
              Nhưng ngày mốt sẽ có nắng
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8">
            {isFetching && (
              <>
                <SkeletonLoading></SkeletonLoading>
                <SkeletonLoading></SkeletonLoading>
                <SkeletonLoading></SkeletonLoading>
                <SkeletonLoading></SkeletonLoading>
              </>
            )}
            {!isFetching &&
              data?.map((post) => (
                <>
                  <PostItem key={post.id} post={post}></PostItem>
                </>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostList;
```

Như các bạn thấy, một chiếc hook rất xịn, nó cung cấp luôn cho ta các thuộc tính như isFetching, isLoading, v.v... Nên ta không cần phải code các chức năng đó nữa, chỉ cần dùng thôi

> ... Còn tiếp

## Quy ước lỗi trả về với từ server

Server phải trả về một kiểu lỗi thống nhất, không thể trả về tùy tiện được.

Ở đây Server của mình (JSON Server) cấu hình để trả về 2 kiểu lỗi

1. Lỗi liên quan đến việc gửi data như POST, PUT thì error là một object kiểu `EntityError`

```ts
{
  "error": {
    "publishDate": "Không được publish vào thời điểm trong quá khứ"
  }
}
```

```ts
interface EntityError {
  [key: string | number]: string | EntityError | EntityError[];
}
```

Có thể nâng cao hơn `key: string` là `key: object` hoặc `key: array` nếu form phức tạp

2. Các lỗi còn lại sẽ trả về một thông báo dạng `error: string`

```ts
{
  "error": '❌❌❌Lỗi rồi bạn ơi ❌❌❌'
}
```

## Lỗi từ RTK Query

Sẽ có 2 kiểu: FetchBaseQueryError | SerializedError

Tham khảo: [https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling](https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling)

## Cache data

Caching là một tính năng quan trọng của RTK Query. Khi chúng ta fetch dữ liệu từ server, RTK Query sẽ cache dữ liệu vào Redux. Tất nhiên đây là cache trên RAM => F5 lại là mất

Caching sẽ dựa vào

- API endpoint (tức là mấy cái khai báo `getPosts`, `getPost` các kiểu đó)
- Query params được sử dụng (ví dụ `1` là param trong `useGetPostQuery(1)`)
- Số lượng active subscription cộng dồn

Khi một component được mounted và gọi `useQuery` hook, thì component đó subcribe cái data đó => Ta có 1 subsciption, nếu nó unmount thì ta sẽ trở lại 0 (unsubcribe)

Khi request được gọi, nếu data đã được cache thi thì RTK sẽ không thực hiện request mới đến server mà trả về data cache đó

Số lượng subscription được cộng dồn khi mà cùng gọi 1 endpoint và query param. Miễn là còn component subcribe data thì data nó chưa mất, nếu không còn component nào subcribe thì mặc định sau 60s data sẽ xóa khỏi cache (nếu lúc đó có component nào subcribe lại data đó thì còn dữ tiếp)

## Ví dụ về thời gian cache

```jsx
import { useGetUserQuery } from "./api.ts";

function ComponentOne() {
  // component subscribes to the data
  const { data } = useGetUserQuery(1);

  return <div>...</div>;
}

function ComponentTwo() {
  // component subscribes to the data
  const { data } = useGetUserQuery(2);

  return <div>...</div>;
}

function ComponentThree() {
  // component subscribes to the data
  const { data } = useGetUserQuery(3);

  return <div>...</div>;
}

function ComponentFour() {
  // component subscribes to the *same* data as ComponentThree,
  // as it has the same query parameters
  const { data } = useGetUserQuery(3);

  return <div>...</div>;
}
```

Khi 4 component trên được gọi thì ta có

- Component 1 subcribe data 1
- Component 2 subcribe data 2
- Component 3 và 4 cùng subcribe data 3

Chỉ có 3 request được gửi lên server là request từ component 1,2,3. Còn component 4 sẽ dùng lại data cache từ component 3

Data sẽ được giữ lại cho đến khi không còn component nào subcribe. Ví dụ:

- Nếu component 1 hoặc 2 bị unmount, data 1 hoặc data 2 sẽ bị xóa sau 60s
- Nếu component 3 bị unmount, data 3 vẫn còn vì component 4 vẫn đang subcribe. Nếu lúc này 4 unsubcribe thì data 3 mới bị xóa sau 60s
