import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import AppLayout from "./AppLayout";
import Login from "./containers/login/login";
import Register from "./containers/register/register";
import NotFound from "./components/notfound/notfound";
import LaobanInfo from "./containers/laoban-info/laoban-info";
import DashenInfo from "./containers/dashen-info/dashen-info";
import Laoban from "./containers/laoban/laoban";
import Dashen from "./containers/dashen/dashen";
import Message from "./containers/message/message";
import Personal from "./containers/personal/personal";
import { useSelector } from "react-redux";
import Chat from "./containers/chat/chat";

function AppRouter() {
  const user = useSelector((state) => state.user.user);
  // console.log(`AppRouter user is ${JSON.stringify(user)}`)
  return (
    <BrowserRouter>
      <Routes>
        {/* 
          鉴权布局，可以设置成公共路由的父级，
          如果需要“未登录才能访问”或“已登录才能访问”，
          可以在这里或者单独用 <RequireAuth /> 组件做处理 
        */}
        <Route path="/" element={<AuthLayout />}>
          {/* 默认重定向到 /main，根据登录状态判断 */}
          <Route
            index
            element={
              user.type === "laoban" ? (
                <Navigate to="/dashen" replace />
              ) : user.type === "dashen" ? (
                <Navigate to="/laoban" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 主应用布局（已登录后可访问） */}
          <Route path="/" element={<AppLayout />}>
            <Route path="laoban" element={<Laoban />} />
            <Route path="laobaninfo" element={<LaobanInfo />} />
            <Route path="dashen" element={<Dashen />} />
            <Route path="dasheninfo" element={<DashenInfo />} />
            <Route path="personal" element={<Personal />} />
          </Route>
        </Route>

        {/* 未登录时可访问的路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="message" element={<Message />} />

        {/* 404 路由 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
