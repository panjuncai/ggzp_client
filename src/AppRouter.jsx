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
import { useSelector,useDispatch } from "react-redux";
import Chat from "./containers/chat/chat";
import Cookies from 'js-cookie'
import { useEffect, useState } from "react";
import { processQueryUser } from "./redux/userSlice";

function AppRouter() {
  const user = useSelector((state) => state.user.user);
  const userid=Cookies.get('userid')
  const [isInit, setIsInit] = useState(false);
  const dispatch = useDispatch();
  // 通过userid拿一次用户信息
  useEffect(() => {
    if (userid) {
      dispatch(processQueryUser())
        .then(() => {
          // 拿到用户信息后，初始化完成
          setIsInit(true);
        })
        .catch(() => {
          // 拿不到用户信息也要完成初始化
          setIsInit(true);
        });
    } else {
      // 拿不到cookie中的用户信息，也完成了初始化
      setIsInit(true);
    }
  }, [userid, dispatch]);

   // 如果还未初始化，先显示Loading
  if (!isInit) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
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
            <Route path="message" element={<Message />} />
            <Route path="chat" element={<Chat />} />
          </Route>
        </Route>

        {/* 未登录时可访问的路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 404 路由 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
