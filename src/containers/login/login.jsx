import { useState, useEffect } from "react";
import { Input, Radio, Button, Space, Form, Toast } from "antd-mobile";
import Logo from "../../components/logo/logo";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, resetStatus } from "../../redux/userSlice";
import './login.sass'

export default () => {
  const user = useSelector((state) => state.user.user);
  const userStatus = useSelector((state) => state.user.status);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [state, setState] = useState({
    username: "",
    password: "",
    redirectToRegister: false,
    redirectToMain: false,
  });
  const handleChange = (name, value) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  useEffect(() => {
    if (userStatus === "pending") {
      Toast.show({
        icon: "loading",
      });
    } else if (userStatus === "fulfilled") {
      Toast.show({
        icon: "success",
        content: user.msg,
      });
      setState((prevStatus) => ({ ...prevStatus, redirectToMain: true }));
    } else if (userStatus === "rejected") {
      Toast.show({
        icon: "fail",
        content: user.msg,
      });
    }
    dispatch(resetStatus());
  }, [userStatus, dispatch, form]);


  const toRegister = () => {
    setState({ redirectToRegister: true });
  };

  const login = async () => {
    // console.log(JSON.stringify(state));
    await dispatch(loginUser(state));
  };

  const footer = (
    <Space direction="vertical" block>
      <Button block type="submit" color="primary" size="large" onClick={login}>
        登录
      </Button>
      <Button block color="default" size="large" onClick={toRegister}>
        还没有账户
      </Button>
    </Space>
  );

  if (state.redirectToRegister) {
    return <Navigate to="/register" replace />;
  }
  if (state.redirectToMain) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className='container2'>
      <Logo />
      <Space align="center">
        <Form
          form={form}
          layout="horizontal"
          autoComplete="off"
          footer={footer}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "用户名不能为空" }]}
          >
            <Input
              placeholder="请输入用户名"
              onChange={(val) => handleChange("username", val)}
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "密码不能为空" }]}
          >
            <Input
              placeholder="请输入密码"
              type="password"
              onChange={(val) => handleChange("password", val)}
            />
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};
