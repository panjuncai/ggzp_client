import React from "react";
import ReactDOM from "react-dom/client";
import store from "./redux/store";
import { Provider } from "react-redux";
import AppRouter from "./AppRouter";
// import { Toast } from "antd-mobile";
import Test from "./Test";

// Toast.config({ duration: 1000 });

// function setVhVar() {
//   document.documentElement.style.setProperty(
//     "--vh",
//     `${window.innerHeight * 0.01}px`
//   );
// }

// window.addEventListener("resize", setVhVar);
// // iOS Safari 的地址栏在滚动中可能不触发 resize，可以加上：
// window.addEventListener("orientationchange", setVhVar);
// window.addEventListener("scroll", () => {
//   // 如果想在滚动时也更新，可能加个节流
//   setVhVar();
// });

// // 首次加载
// setVhVar();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <Provider store={store}>
      {/* <App /> */}
      <AppRouter />
      {/* <Test /> */}
    </Provider>
  </>
);
