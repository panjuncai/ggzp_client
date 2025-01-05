import React,{useEffect,useState} from "react";
import Register from "./containers/register/register";
import "./App.sass";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./containers/login/login";
import Notfound from "./components/notfound/notfound";
import LaobanInfo from "./containers/laoban-info/laoban-info";
import DashenInfo from "./containers/dashen-info/dashen-info";
import Cookies from "js-cookie";
import { Toast } from "antd-mobile";
import Main from "./containers/main/main";
import Laoban from "./containers/laoban/laoban";
import Dashen from "./containers/dashen/dashen";
import Message from "./containers/message/message";
import Personal from "./containers/personal/personal";

export default () => {
  
  return (
    <div className="container">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Main />} />
        <Route path="/notfound" element={<Notfound />} />
        <Route path="/laobaninfo" element={<LaobanInfo />} />
        <Route path="/laoban" element={<Laoban />} />
        <Route path="/dasheninfo" element={<DashenInfo />} />
        <Route path="/dashen" element={<Dashen />} />
        <Route path="/message" element={<Message />} />
        <Route path="/me" element={<Personal />} />
        <Route path="/b" element={<Bottom />} />
      </Routes>
    </div>
  );
};
