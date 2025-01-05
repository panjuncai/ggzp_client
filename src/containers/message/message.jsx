import React, { useEffect, useState } from "react";
import { List, Image} from "antd-mobile";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

export default () => {
  const chatData = useSelector((state) => state.chats);
  const { chat } = chatData;
  const [chatList, setChatList] = useState([]);
  const userid = Cookies.get("userid");
  const navigate=useNavigate()

  // 这里只是处理一下消息分组，redux里面数据已经在首页取过了
  useEffect(() => {
    const groupedChats = chat.chatMsgs.reduce((acc, i) => {
      const { chat_id, from, to, content, create_time } = i;
      if (!acc[chat_id] || acc[chat_id].create_time < create_time) {
        acc[chat_id] = { from, to, last_content: content, create_time };
      }
      return acc;
    }, {});

    const arrGroupedChats = Object.values(groupedChats).map(
      ({ from, to, last_content }) => ({
        from,
        to,
        last_content,
      })
    );

    setChatList(
      ...chatList,
      arrGroupedChats.sort((a, b) => b.create_time - a.create_time)
    );
  }, []);

  return (
    <List
    //   header={
    //     <div style={{ textAlign: "center", fontSize: "24px" }}>消息列表</div>
    //   }
    >
      {chatList.map((i) => (
        <List.Item
          key={nanoid(4)}
          prefix={
            <Image
              src={`/assets/images/${
                i.from === userid
                  ? chat.users[i.to].header
                  : chat.users[i.from].header
              }.png`}
              style={{ borderRadius: 10 }}
              fit="cover"
              width={40}
              height={40}
            />
          }
          description={
            i.from === userid
              ? chat.users[i.to].username
              : chat.users[i.from].username
          }
          arrowIcon={true}
          onClick={() => {
            console.log(`chat user ${JSON.stringify(i)}`)
            navigate('/chat',{state:{toId:i.from === userid
                ? chat.users[i.to]._id
                : chat.users[i.from]._id,toHeader:i.from === userid
                ? chat.users[i.to].header
                : chat.users[i.from].header,toUserName:i.from === userid
              ? chat.users[i.to].username
              : chat.users[i.from].username}})
          }}
        >
          {i.last_content}
        </List.Item>
      ))}
    </List>
  );
};
