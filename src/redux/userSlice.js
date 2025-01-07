import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  reqDeleteUser,
  reqLogin,
  reqRegister,
  reqUpdateUser,
  reqUser,
} from "../api";
import { useDispatch } from "react-redux";

const initialState = {
  user: {
    username: "",
    type: "",
    msg: "",
    redirectPath: "",
    post: "",
    salary: "",
    info: "",
    header: "",
  },
  status: "idle",
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authFail: (state, action) => {
      state.user.msg = action.payload.msg;
      state.user.username = action.payload.username ?? state.user.username;
      state.user.type = action.payload.type ?? state.user.type;
      state.error = action.payload.msg;
      state.status = "rejected";
    },
    resetStatus: (state) => {
      state.status = "idle";
    },
    logout: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processRegisterUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(processRegisterUser.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // console.log(`fulfilled action is ${JSON.stringify(action)}`);
        if (action.payload.code === 0) {
          state.user.username = action.payload.data.username;
          state.user.type = action.payload.data.type;
          state.user.redirectPath = "/login";
          state.user.msg = "注册成功";
        } else {
          state.user.msg = action.payload.msg;
          state.status = "rejected";
          state.error = action.payload.msg;
        }
      })
      .addCase(processRegisterUser.rejected, (state, action) => {
        state.status = "rejected";
        state.user.msg = "服务器错误";
        state.error = action.payload || action.error.message;
      })
      .addCase(processLoginUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(processLoginUser.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // console.log(`login action is ${JSON.stringify(action)}`);
        if (action.payload.code === 0) {
          state.user.username = action.payload.data.username;
          state.user.type = action.payload.data.type;
          state.user.post = action.payload.data.post;
          state.user.salary = action.payload.data.salary;
          state.user.info = action.payload.data.info;
          state.user.header = action.payload.data.header;
          state.user.msg = "登录成功";
        } else {
          state.user.msg = action.payload.msg;
          state.status = "rejected";
          state.error = action.payload.msg;
        }
      })
      .addCase(processLoginUser.rejected, (state, action) => {
        // console.log(`login reject action ${JSON.stringify(action)}`);
        state.user.msg = "服务器错误";
        state.status = "rejected";
        state.error = action.payload || action.error.message;
      })
      .addCase(processQueryUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(processQueryUser.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // console.log(`query user action is ${JSON.stringify(action)}`);
        if (action.payload.code === 0) {
          state.user.username =
          action.payload.data.username ?? state.user.username;
          state.user.type = action.payload.data.type ?? state.user.type;
          state.user.header = action.payload.data.header ?? state.user.header;
          state.user.info = action.payload.data.info ?? state.user.info;
          state.user.company =
            action.payload.data.company ?? state.user.company;
          state.user.salary = action.payload.data.salary ?? state.user.salary;
          state.user.post = action.payload.data.post ?? state.user.post;
          state.user.msg = "获取用户成功";
        } else {
          state.user.msg = action.payload.msg;
          state.status = "rejected";
          state.error = action.payload.msg;
        }
      })
      .addCase(processQueryUser.rejected, (state, action) => {
        state.status = "rejected";
        state.user.msg = "服务器错误";
        state.error = action.payload || action.error.message;
      })
      .addCase(processUpdateUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(processUpdateUser.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // console.log(`fulfilled action is ${JSON.stringify(action)}`);
        if (action.payload.code === 0) {
          state.user.username =
            action.payload.data.username ?? state.user.username;
          state.user.type = action.payload.data.type ?? state.user.type;
          state.user.header = action.payload.data.header ?? state.user.header;
          state.user.info = action.payload.data.info ?? state.user.info;
          state.user.company =
            action.payload.data.company ?? state.user.company;
          state.user.salary = action.payload.data.salary ?? state.user.salary;
          state.user.post = action.payload.data.post ?? state.user.post;
          state.user.redirectPath = "/personal";
          state.user.msg = "更新成功";
        } else {
          state.user.msg = action.payload.msg;
          state.status = "rejected";
          state.error = action.payload.msg;
        }
      })
      .addCase(processUpdateUser.rejected, (state, action) => {
        state.status = "rejected";
        state.user.msg = "服务器错误";
        state.error = action.payload || action.error.message;
      })
      .addCase(processDeleteUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(processDeleteUser.fulfilled, (state, action) => {
        // console.log(`delete user action is ${JSON.stringify(action)}`);
        if (action.payload.code === 0) {
          (state.user = {
            username: "",
            type: "",
            msg: "注销成功",
            redirectPath: "",
            post: "",
            salary: "",
            info: "",
            header: "",
          }),
            (state.status = "fulfilled");
          state.error = null;
        } else {
          state.user.msg = action.payload.msg;
          state.status = "rejected";
          state.error = action.payload.msg;
        }
      })
      .addCase(processDeleteUser.rejected, (state, action) => {
        state.status = "rejected";
        state.user.msg = "服务器错误";
        state.error = action.payload || action.error.message;
      });
  },
});


export const registerUser = (user) => async (dispatch) => {
  try {
    // console.log(`slice user is :${JSON.stringify(user)}`);
    if (!user.username || !user.password || !user.password2 || !user.type) {
      dispatch(
        authFail({
          msg: "请检查必填项",
          username: user.username,
          type: user.type,
        })
      );
    } else if (user.password !== user.password2) {
      dispatch(
        authFail({
          msg: "密码和确认密码必须相同",
          username: user.username,
          type: user.type,
        })
      );
    } else {
      dispatch(processRegisterUser(user));
    }
  } catch (e) {
    dispatch(authFail({ msg: e.msg }));
  }
};

export const processRegisterUser = createAsyncThunk(
  "user/processRegisterUser",
  async (user, { rejectWithValue }) => {
    try {
      console.log(`async user is :${JSON.stringify(user)}`);
      const response = await reqRegister(user);
      const result = response.data;
      return result;
    } catch (e) {
      return rejectWithValue(e.response ? e.response.data : e.message);
    }
  }
);

export const processUpdateUser = createAsyncThunk(
  "user/processUpdateUser",
  async (user, { rejectWithValue }) => {
    try {
      // console.log(`async update user is :${JSON.stringify(user)}`)
      const response = await reqUpdateUser(user);
      const result = response.data;
      return result;
    } catch (e) {
      return rejectWithValue(e.response ? e.response.data : e.message);
    }
  }
);

export const loginUser = (user) => async (dispatch) => {
  try {
    // console.log(`login user is ${JSON.stringify(user)}`);
    if (!user.username || !user.password) {
      dispatch(
        authFail({
          msg: "用户名或密码不能为空",
          username: user.username,
          type: user.type,
        })
      );
    } else {
      dispatch(processLoginUser(user));
    }
  } catch (e) {
    dispatch(authFail({ msg: e.message }));
  }
};

export const processLoginUser = createAsyncThunk(
  "user/processLoginUser",
  async (user, { rejectWithValue }) => {
    try {
      // console.log(`async user is :${JSON.stringify(user)}`);
      const response = await reqLogin(user);
      const result = response.data;
      return result;
    } catch (e) {
      return rejectWithValue(e.response ? e.response.data : e.message);
    }
  }
);

export const processDeleteUser = createAsyncThunk(
  "user/processDeleteUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await reqDeleteUser(user);
      const result = response.data;
      return result;
    } catch (e) {
      return rejectWithValue(e.response ? e.response.data : e.message);
    }
  }
);

// export const queryUser = () => async (dispatch) => {
//   try {
//     console.log(`query user is ${JSON.stringify()}`);
//     return dispatch(processQueryUser());
//   } catch (e) {
//     dispatch(authFail({ msg: e.message }));
//   }
// };

export const processQueryUser = createAsyncThunk(
  "user/processQueryUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reqUser();
      const result = response.data;
      return result;
    } catch (e) {
      return rejectWithValue(e.response ? e.response.data : e.message);
    }
  }
);

export const { authFail, resetStatus, logout } = userSlice.actions;
export default userSlice.reducer;
