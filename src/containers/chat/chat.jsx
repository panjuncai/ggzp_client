import React, { useRef, useMemo } from "react";
import { Bubble, Sender } from "@ant-design/x";
import { Flex } from "antd";
import { Avatar, NavBar } from "antd-mobile";
import { XProvider } from "@ant-design/x";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import './chat.sass'

export default () => {
  const [value, setValue] = useState("");
  const [msgs, setMsgs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const chats = useSelector((state) => state.chats.chat.chatMsgs);
  const { state } = location;
  const { toId, toHeader, toUserName } = state || {};
  const userid = Cookies.get("userid");
  const user = useSelector((state) => state.user.user);
  const socket = useMemo(() => io("http://localhost:4000"), []);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  // 需要处理全局的聊天记录
  // 1. 我发出去的
  // 2. 对方发给我的
  // 上述需要from + to都是同一个聊天
  // 并且需要按照时间排序
  // 这里需要构建Msg，把from和to理清
  // from 张三 to p1
  // from p1 to 张三
  // chat打开时，from=张三 && to=p1 或者 from=p1 && to=张三
  useEffect(() => {
    // console.log(`chats are ${JSON.stringify(chats)}`);
    // console.log(`useEffect 1`)
    const processChats = chats
      .filter(
        (i) =>
          (i.from === userid && i.to === toId) ||
          (i.from === toId && i.to === userid)
      )
      .sort((a, b) => a.create_time - b.create_time)
      .map(({ chat_id, from, to, content }) => ({
        chat_id,
        from,
        to,
        content,
      }));
    // console.log(`chats are ${JSON.stringify(processChats)}`);
    setMsgs([...msgs,...processChats]);
  }, []);

  useEffect(() => {
    // console.log(`useEffect 2`)
    // console.log(`toId is ${toId},toUsername is ${toUserName},toHeader is ${toHeader}`)
    socket.on("receiveMessage", (message) => {
      // console.log(`received message is ${JSON.stringify(message)}`)
      if (message.to === userid && message.from === toId) {
        setMsgs((prevMessages) => [...prevMessages, message]);
      }
      scrollToBottom();
    });
    // 清理连接
    return () => {
      socket.disconnect();
    };
  }, [socket, toId, userid]);

  useEffect(() => {
    // console.log(`useEffect 3`)
    scrollToBottom();
  }, [msgs]);

  const sendMsg = (msgObj) => {
    socket.emit("sendMessage", msgObj);
    setMsgs((prevState) => [...prevState, msgObj]);
  };

  const back = () => {
    navigate(-1);
  };

  // const renderSend = (props) => {
  //   const { ...btnProps } = props;
  //   return (
  //     <Sender
  //       value={value}
  //       onChange={setValue}
  //       onSubmit={(msg) => {
  //         sendMsg({
  //           chat_id: userid + toId,
  //           from: userid,
  //           to: toId,
  //           content: msg,
  //         });
  //         setValue("");
  //       }}
  //       actions={(_, info) => {
  //         const { SendButton } = info.components;
  //         let node = <SendButton {...btnProps} />;
  //         return node;
  //       }}
  //     />
  //   );
  // };

  return (
    <XProvider theme={{ token: { colorPrimary: "#10c6b1" } }}>
      <div className="app">
        <div className="top">
          <NavBar back="" backIcon={true} onBack={back}>
            {toUserName}
          </NavBar>
        </div>
        <div className="body" style={{ padding: "1rem" }}>
          <Flex gap="middle" vertical>
            {msgs.map((i) => (
              <Bubble
                key={nanoid(4)}
                placement={i.to === userid ? "start" : "end"}
                content={i.content}
                shape="corner"
                variant={i.to===userid?'filled':'outlined'}
                avatar={{
                  icon: (
                    <Avatar
                      src={`/assets/images/${
                        i.to !== userid ? user.header : toHeader
                      }.png`}
                    />
                  ),
                }}
              />
            ))}
            <div ref={messagesEndRef} />
          </Flex>
        </div>
        <div style={{ padding: "1rem" }}>
          {/* {renderSend({
            variant: "text",
            color: "primary",
            icon: <SendOutlined />,
            shape: "default",
          })} */}
          <Sender
            value={value}
            onChange={setValue}
            onSubmit={(msg) => {
              sendMsg({
                chat_id: userid + toId,
                from: userid,
                to: toId,
                content: msg,
              });
              setValue("");
              scrollToBottom();
            }}
            allowSpeech
          />
        </div>
      </div>
    </XProvider>
  );
};
