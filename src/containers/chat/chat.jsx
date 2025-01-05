import React, { useRef,useMemo} from "react";
import { Bubble, Sender } from "@ant-design/x";
import { Flex, Tooltip } from "antd";
import { Avatar, NavBar } from "antd-mobile";
import { XProvider } from "@ant-design/x";
import { SendOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

export default () => {
  const [value, setValue] = useState("");
  const [msgs, setMsgs] = useState([]);
  const location = useLocation();
  const { state } = location;
  const { toId, toHeader, toUserName } = state || {};
  const userid = Cookies.get("userid");
  const user = useSelector((state) => state.user.user);
  const socket = useMemo(() => io("http://localhost:4000"), []);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
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
    scrollToBottom();
  }, [msgs, scrollToBottom]);

  const sendMsg = (msgObj) => {
    socket.emit("sendMessage", msgObj);
    setMsgs((prevState) => [...prevState, msgObj]);
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
          <NavBar back="" backIcon={false}>
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
