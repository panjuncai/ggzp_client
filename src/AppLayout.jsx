import React from "react";
import { NavBar,TabBar } from "antd-mobile";
import { Routes, Route, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from "antd-mobile-icons";
import './AppLayout.sass'
import { useSelector } from "react-redux";
const Bottom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const user=useSelector(state=>state.user.user)
  

  const setRouteActive = (value) => {
    navigate(value);
  };
  const tabs = [
    {
      key: "/laoban",
      title: "BOSS",
      icon: <UnorderedListOutline />,
    },
    {
      key: "/dashen",
      title: "求职者",
      icon: <UnorderedListOutline />,
    },
    {
      key: "/message",
      title: "消息",
      icon: <MessageOutline />,
    },
    {
      key: "/personal",
      title: "我的",
      icon: <UserOutline />,
    },
  ];

  if(user.type==='laoban'){
    tabs[0].hidden=true
  }else if(user.type==='dashen'){
    tabs[1].hidden=true
  }else {
    tabs[0].hidden=true
    tabs[1].hidden=true
  }

  return (
    <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
      {tabs.filter(i=>!i.hidden).map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};

export default () => {
  
  return (
    <>
      <div className="app">
        <div className="top">
          <NavBar back='' backIcon={false}>Boss直聘</NavBar>
        </div>
        <div className="body">
          <Outlet /> 
        </div>
        <div className='bottom'>
          <Bottom />
        </div>
      </div>
    </>
  );
};
