import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { processQueryUser, queryUser } from "../../redux/userSlice";
import { Routes, Route, Navigate } from "react-router-dom";
import Laoban from "../laoban/laoban";
import Dashen from "../dashen/dashen";
import Message from "../message/message";
import Personal from "../personal/personal";
import { getRedirectPath } from "../../utils";
import { Toast } from "antd-mobile";
import Cookies from "js-cookie";
import { resetStatus } from "../../redux/userSlice";

export default () => {
  //...............第一阶段：初始化....................
  // 从Redux中获取用户信息和状态
  const user = useSelector((state) => state.user.user);
  const userStatus = useSelector((state) => state.user.status);
  const dispatch = useDispatch();

  // 从Cookie中获取userid
  const userid = Cookies.get("userid");

  // 是否初始化完成状态
  const [isInit, setIsInit] = useState(false);

  const navList = [
    {
      path: "/laoban",
      component: Laoban,
      title: "大神列表",
      icon: "dashen",
      text: "大神",
    },
    {
      path: "/dashen",
      component: Dashen,
      title: "老板列表",
      icon: "laoban",
      text: "老板",
    },
    {
      path: "/message",
      component: Message,
      title: "消息列表",
      icon: "message",
      text: "消息",
    },
    {
      path: "/personal",
      component: Personal,
      title: "用户中心",
      icon: "personal",
      text: "个人",
    },
  ];

  //...............第二阶段：依赖变化....................
  // 第一次加载时，根据 userid 判断是否需要获取用户信息
  useEffect(() => {
    if (userid) {
      // 说明cookie中取到了userid
      dispatch(processQueryUser())
        .unwrap()
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

  // 监听userStatus,给出提示
  useEffect(() => {
    if (userStatus === "pending") {
      Toast.show({
        icon: "loading",
      });
    } else if (userStatus === "fulfilled") {
      Toast.show({
        icon: "success",
        content: user.msg,
      });
    } else if (userStatus === "rejected") {
      Toast.show({
        icon: "fail",
        content: user.msg,
      });
    }

    if (userStatus !== "idle") {
      dispatch(resetStatus());
    }
  }, [userStatus, dispatch, user.msg]);

  //...............第三阶段：渲染....................
  // 1.如果还未初始化，先显示Loading
  if (!isInit) {
    // 这里可以放骨架屏,todo...
    return null;
  }

  // 2.如果没有userid，说明还没登录，跳转到登录
  if (!userid) {
    return <Navigate to="/login" />;
  }

  // 3.有userid，说明已经登录，则根据user.type跳转
  if (user.type === "laoban") {
    // return <Navigate to="/laoban" replace />;
    return null
  } else if (user.type === "dashen") {
    // return <Navigate to="/dashen" replace />;
    return null
  }

  // 4.其他情况
  return <Navigate to="/login" replace />;
};
