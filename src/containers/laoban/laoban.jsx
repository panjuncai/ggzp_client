import { Avatar, Toast,Card, Space } from "antd-mobile";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./laoban.sass";
import { reqAllLaobans } from "../../api";
import { useState, useEffect } from "react";
import { processQueryChatMsgs, resetStatus } from "../../redux/chatSlice";
import { useSelector } from "react-redux";
import { processQueryUser } from "../../redux/userSlice";

export default () => {
  const [laobans, setLaobans] = useState([]);
  const [isInit, setIsInit] = useState(false);
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const userid=Cookies.get('userid')
  const chatData = useSelector((state) => state.chats);
  const { chat, status, error } = chatData;

  // 由于登录后第一次跳转到本页面，则将消息全拿到
  useEffect(() => {
    if (userid) {
          // 说明cookie中取到了userid
          dispatch(processQueryChatMsgs())
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
  }, [dispatch,userid]);

 // 拿消息是异步的，需要展示加载
 useEffect(() => {
    Toast.clear();
    if (status === "pending") {
      Toast.show({ icon: "loading" });
    } else if (status === "fulfilled") {
      
    } else if (status === "rejected") {
      Toast.show({ icon: "error", content: error.msg });
    }
    if (status !== "idle") {
      dispatch(resetStatus());
    }
  }, [dispatch, status, error, chat]);

  useEffect(() => {
    async function fetchLaobans() {
      const result = await reqAllLaobans();
      setLaobans(result.data.data);
      // console.log(`all laobans is ${JSON.stringify(result.data.data)}`)
    }
    fetchLaobans();
  }, []);

  const handleChat=(laobanId,laobanHeader,laobanName)=>{
    // console.log(`laoban id is ${laobanId}`)
    navigate('/chat',{state:{toId:laobanId,toHeader:laobanHeader,toUserName:laobanName}})
  }

  if (!isInit) {
    return null;
  }

  return (
    <div className="innerContainer">
      <Space direction="vertical" block className="info">
        {laobans.map((i) => (
          <Card
            key={i._id}
            icon={<Avatar src={`/assets/images/${i.header}.png`} />}
            title={i.username}
            style={{ borderRadius: "8px" }}
            onClick={()=>handleChat(i._id,i.header,i.username)}
            className="no-select"
          >
            <div>岗位：{i.post}</div>
            <div>公司：{i.company}</div>
            <div>月薪：{i.salary ? `${i.salary}K` : "面议"}</div>
            <div>要求：{i.info}</div>
          </Card>
        ))}
      </Space>
    </div>
  );
};
