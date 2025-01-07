import { useState, useEffect } from "react";
import {
  Input,
  Radio,
  Button,
  Space,
  Form,
  Toast,
} from "antd-mobile";
import Logo from "../../components/logo/logo";
import { Navigate } from "react-router-dom";
import { registerUser,resetStatus } from "../../redux/userSlice";
import { useSelector, useDispatch } from "react-redux";
import './register.sass'

export default () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.user.status);

  const [state, setState] = useState({
    username: "",
    password: "",
    password2: "",
    type: "",
    redirectToLogin: false,
  });

  useEffect(() => {
    if(userStatus==='pending'){
      Toast.show({
        icon:'loading'
      })
    }
    else if (userStatus === "fulfilled") {
      Toast.show({
        icon:'success',
        content:user.msg
      })
      setState({redirectToLogin:true})
    }else if(userStatus === "rejected"){
      Toast.show({
        icon:'fail',
        content:user.msg
      })
    }
    dispatch(resetStatus())
  }, [userStatus, dispatch]);

  const handleChange = (name, value) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const toLogin = () => {
    setState({ redirectToLogin: true });
  };

  const register = async () => {
    await dispatch(registerUser(state));
    // console.log(`result is :${result}`);
  };

  const footer = (
    <Space direction="vertical" block>
      <Button
        block
        type="submit"
        color="primary"
        size="large"
        onClick={register}
      >
        注册
      </Button>
      <Button block color="default" size="large" onClick={toLogin}>
        已有账户
      </Button>
    </Space>
  );

  if (state.redirectToLogin) {
    return <Navigate to='/login' replace />;
  }

  return (
    <div className='container2'>
      <Logo />
      <Space align="center">
        <Form layout="horizontal" autoComplete="off" footer={footer}>
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
          <Form.Item
            label="确认密码"
            name="password2"
            rules={[{ required: true, message: "确认密码不能为空" }]}
          >
            <Input
              placeholder="请输入确认密码"
              type="password"
              onChange={(val) => handleChange("password2", val)}
            />
          </Form.Item>
          <Form.Item name="type" label="用户类型：" required>
            <Radio.Group onChange={(val) => handleChange("type", val)}>
              <Space direction="horizontal">
                <Radio value="dashen">求职者</Radio>
                <Radio value="laoban">BOSS</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};
