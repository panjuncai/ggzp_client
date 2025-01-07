import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie'

function AuthLayout() {
  const isUser=Cookies.get('userid')
  const isLoggedIn=!!isUser
  if (!isLoggedIn) {
    // 未登录，重定向到 /login
    return <Navigate to="/login" replace />;
  }
  // 已登录，继续渲染子路由
  return <Outlet />;
}

export default AuthLayout;
