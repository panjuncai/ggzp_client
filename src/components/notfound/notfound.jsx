import React from "react";
import { Button, Space, Result, Divider } from "antd-mobile";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // 返回上一页
  };

  const goHome = () => {
    navigate("/"); // 跳转到首页
  };

  return (
    <div
      style={{
        height:'100vh',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap:'1rem',
        backgroundColor:'white'
      }}
    >
      <Result
        status="warning"
        title="404"
        description="抱歉，您访问的页面不存在"
      />
      <Space direction="vertical" block>
        <Button block color="primary" onClick={goHome}>
          返回首页
        </Button>
      </Space>
    </div>
  );
};

