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
