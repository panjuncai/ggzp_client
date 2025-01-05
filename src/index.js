import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";
import AppRouter from "./AppRouter";
import { Toast } from 'antd-mobile'; // 配置全局

Toast.config({ duration: 1000});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Provider store={store}>
      {/* <App /> */}
      <AppRouter />
    </Provider>
  </>
);
