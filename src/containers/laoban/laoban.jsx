import { Avatar, Button, Toast } from "antd-mobile";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { List, Image, Card, Space } from "antd-mobile";
import "./laoban.sass";
import { reqAllLaobans } from "../../api";
import { useState, useEffect } from "react";

export default () => {
  const [laobans, setLaobans] = useState([]);
  const navigate=useNavigate()

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
