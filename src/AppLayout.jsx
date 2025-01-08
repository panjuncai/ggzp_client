import React from "react";
import { NavBar, TabBar } from "antd-mobile";
import {
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import {
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from "antd-mobile-icons";
import "./AppLayout.sass";
import { useSelector } from "react-redux";
const Title=({msg})=>{
  return <span className="no-select">{msg}</span>
}
const Bottom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const user = useSelector((state) => state.user.user);

  const setRouteActive = (value) => {
    navigate(value);
  };
  const tabs = [
    {
      key: "/laoban",
      title: <Title msg="BOSS" />,
      icon: <UnorderedListOutline />,
    },
    {
      key: "/dashen",
      title: <Title msg="求职者" />,
      icon: <UnorderedListOutline />,
    },
    {
      key: "/message",
      title: <Title msg="消息" />,
      icon: <MessageOutline />,
    },
    {
      key: "/personal",
      title: <Title msg="我的" />,
      icon: <UserOutline />,
    },
  ];

  if (user.type === "laoban") {
    tabs[0].hidden = true;
  } else if (user.type === "dashen") {
    tabs[1].hidden = true;
  } else {
    tabs[0].hidden = true;
    tabs[1].hidden = true;
  }

  return (
    <TabBar safeArea activeKey={pathname} onChange={(value) => setRouteActive(value)}>
      {tabs
        .filter((i) => !i.hidden)
        .map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
    </TabBar>
  );
};

export default () => {
  const location = useLocation();
  const { pathname } = location;
  return (
    <>
      {pathname === "/chat" ? (
        <Outlet />
      ) : (
        <>
          <div className="top">
            <NavBar back="" backIcon={false}>
            Happy Work
            </NavBar>
          </div>
          <div className="body">
            <Outlet />
          </div>
          <div className="bottom">
            <Bottom />
          </div>
        </>
      )}
    </>
  );
};
