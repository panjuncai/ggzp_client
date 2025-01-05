import React, { useEffect } from "react";
import { List, Image ,Toast} from "antd-mobile";
import { useDispatch, useSelector } from "react-redux";
import { processQueryChatMsgs } from "../../redux/chatSlice";
import { resetStatus } from "../../redux/userSlice";

export default () => {
  const chatData = useSelector((state) => state.chats);
  const {chat,status,error}=chatData
  const dispatch = useDispatch();

  useEffect(() => {
    if(status==='pending'){
        Toast.show({icon:'loading'})
    }else if(status==='fulfilled'){
        console.log(`chats is ${JSON.stringify(chat)}`)
    }else if(status==='rejected'){
        Toast.show({icon:'error',content:chatData.error.msg})
    }
    dispatch(processQueryChatMsgs());
    if(status!=='idle'){
        dispatch(resetStatus)
    }
  }, [dispatch,chat]);
  return (
    <List
      header={
        <div style={{ textAlign: "center", fontSize: "24px" }}>消息列表</div>
      }
    >
      <List.Item
        prefix={
          <Image
            src={"/assets/images/1.png"}
            style={{ borderRadius: 10 }}
            fit="cover"
            width={40}
            height={40}
          />
        }
        arrowIcon={false}
        onClick={() => {}}
      >
        账单
      </List.Item>
      <List.Item
        prefix={
          <Image
            src={"/assets/images/1.png"}
            style={{ borderRadius: 10 }}
            fit="cover"
            width={40}
            height={40}
          />
        }
        arrowIcon={false}
        onClick={() => {}}
      >
        总资产
      </List.Item>
      <List.Item
        prefix={
          <Image
            src={"/assets/images/1.png"}
            style={{ borderRadius: 10 }}
            fit="cover"
            width={40}
            height={40}
          />
        }
        arrowIcon={false}
        onClick={() => {}}
      >
        设置
      </List.Item>
    </List>
  );
};
