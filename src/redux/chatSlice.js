import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { reqChatMsgList } from "../api";
import Cookies from 'js-cookie'

const initialState = {
  chat: {
    chatMsgs: [],
    users: {},
    unReadCount: 0,
  },
  status: "idle",
  error: { code: 0, msg: "" },
};

const userid=Cookies.get('userid')

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processQueryChatMsgs.pending, (state) => {
        state.status = "pending";
      })
      .addCase(processQueryChatMsgs.fulfilled, (state, action) => {
        if (action.payload.code === 0) {
        // console.log(`processQueryChatMsgs action ${JSON.stringify(action.payload)}`)
          state.chat.chatMsgs = action.payload.data.chatMsgs??state.chat.chatMsgs;
          state.chat.users = action.payload.data.users??state.chat.users;
          state.unReadCount = state.chat.chatMsgs.reduce((preTotal, msg) => {
            return preTotal + (!msg.read && msg.to === userid);
          }, 0);
          state.status = "fulfilled";
          state.error = { code: 0, msg: "查询聊天记录成功" };
        } else {
          state.status = "rejected";
          state.error = { code: 1, msg: action.payload};
        }
      })
      .addCase(processQueryChatMsgs.rejected, (state, action) => {
        state.status = "rejected";
        state.error = {
          code: 1,
          msg: action.payload,
        };
      });
  },
});

export const processQueryChatMsgs = createAsyncThunk(
  "chat/processQueryChatMsgs",
  async (_, { rejectWithValue }) => {
    try {
      const result = await reqChatMsgList();
      const data = result.data;
      return data;
    } catch (e) {
      return rejectWithValue(e.response ? e.response.data : e.response);
    }
  }
);

export const{resetStatus} = chatSlice.actions
export default chatSlice.reducer