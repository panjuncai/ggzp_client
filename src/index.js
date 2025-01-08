import React from "react";
import ReactDOM from "react-dom/client";
import store from "./redux/store";
import { Provider } from "react-redux";
import AppRouter from "./AppRouter";
import { Toast } from "antd-mobile";

Toast.config({ duration: 1000 });

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </>
);
