import { useEffect, useState } from "react";
import { reqAllDashens } from "../../api";
import { Card, Space, Avatar } from "antd-mobile";
import { useNavigate } from "react-router-dom";

export default () => {
  const [dashens, setDashens] = useState([]);
  const [isInit, setIsInit] = useState(false);
  const navigate=useNavigate()

  const handleChat=(dashenId,dashenHeader,dashenName)=>{
    navigate('/chat',{state:{toId:dashenId,toHeader:dashenHeader,toUserName:dashenName}}) 
  }
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
          >
            <div>求职岗位：{i.post}</div>
            <div>掌握技能：{i.info}</div>
          </Card>
        ))}
      </Space>
    </div>
  );
};
