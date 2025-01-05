import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from 'js-cookie'

function AuthLayout() {
  const user = useSelector((state) => state.user.user);
  // console.log(`AuthLayout user is ${JSON.stringify(user)}`)
  const isLoggedIn = !!user.username;
  // const isUser=Cookies.get('userid')
  // console.log(`isUser is ${isUser}`)
  // const isLoggedIn=!!isUser
  // console.log(`isLoggedIn is ${isLoggedIn}`)
  if (!isLoggedIn) {
    // 未登录，重定向到 /login
    return <Navigate to="/login" replace />;
  }
  // 已登录，继续渲染子路由
  return <Outlet />;
}

export default AuthLayout;
