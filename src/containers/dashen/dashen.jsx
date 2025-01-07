import { useEffect, useState } from "react";
import { reqAllDashens } from "../../api";
import { Card, Space, Avatar, Toast} from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { processQueryChatMsgs, resetStatus } from "../../redux/chatSlice";
import Cookies from 'js-cookie'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { processQueryUser } from "../../redux/userSlice";

export default () => {
  const [dashens, setDashens] = useState([]);
  const [isInit, setIsInit] = useState(false);
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const userid=Cookies.get('userid')
  const chatData = useSelector((state) => state.chats);
  const { chat, status, error } = chatData;

  const handleChat=(dashenId,dashenHeader,dashenName)=>{
    navigate('/chat',{state:{toId:dashenId,toHeader:dashenHeader,toUserName:dashenName}}) 
  }
  
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

  // 同步拿老板列表
  useEffect(() => {
    const fetchDashens = async () => {
      const result = await reqAllDashens();
      setDashens(result.data.data);
    };
    fetchDashens();
    setIsInit(true);
  }, []);

  if (!isInit) {
    return null;
  }
  return (
    <div className="innerContainer">
      <Space direction="vertical" block className="info">
        {dashens.map((i) => (
          <Card
            onClick={()=>handleChat(i._id,i.header,i.username)}
            key={i._id}
            icon={<Avatar src={`/assets/images/${i.header}.png`} />}
            title={i.username}
            style={{ borderRadius: "8px" }}
            className="no-select"
          >
            <div>求职岗位：{i.post}</div>
            <div>掌握技能：{i.info}</div>
          </Card>
        ))}
      </Space>
    </div>
  );
};
