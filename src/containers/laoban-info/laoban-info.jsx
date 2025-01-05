import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderSelector from "../../components/header-selector/header-selector";
import { Form, Button, Input, TextArea, Toast } from "antd-mobile";
import { processUpdateUser, resetStatus } from "../../redux/userSlice";
import { useSelector, useDispatch } from "react-redux";

export default () => {
  const userStatus = useSelector((state) => state.user.status);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isInit, setIsInit] = useState(false);

  const [state, setState] = useState({
    header: "",
    info: "",
    post: "",
    company: "",
    salary: "",
  });

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        info: user.info,
        post: user.post,
        company: user.company,
        salary: user.salary,
      });
    }
    // console.log(`user is ${JSON.stringify(user)}`);
    setIsInit(true);
  }, []);

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
      navigate("/personal", { replace: true });
    } else if (userStatus === "rejected") {
      Toast.show({
        icon: "fail",
        content: user.msg,
      });
    }
    dispatch(resetStatus());
  }, [userStatus, dispatch]);

  const handleUpdateUser = async () => {
    await dispatch(processUpdateUser(state));
  };

  const handleChange = (name, value) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateSalary = (_, value) => {
    if (!value || /^[1-9]\d*$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("请输入正整数"));
  };

  if (!isInit) {
    return null;
  }
  return (
    <>
      <Form
        layout="horizontal"
        form={form}
        autoComplete="off"
        footer={
          <Button
            block
            type="button"
            onClick={handleUpdateUser}
            color="primary"
            size="large"
          >
            保存
          </Button>
        }
      >
        <Form.Header>老板信息完善</Form.Header>
        <Form.Item
          name="post"
          label="招聘职位："
          rules={[{ required: true, message: "招聘职位不能为空" }]}
        >
          <Input
            onChange={(val) => handleChange("post", val)}
            placeholder="请输入招聘职位"
          />
        </Form.Item>
        <Form.Item
          name="company"
          label="公司名称："
          rules={[{ required: true, message: "公司名称不能为空" }]}
        >
          <Input
            onChange={(val) => handleChange("company", val)}
            placeholder="请输入招聘公司名称"
          />
        </Form.Item>
        <Form.Item
          name="salary"
          label="薪资(k)："
          help="不填代表面议"
          rules={[{ validator: validateSalary }]}
        >
          <Input
            type="number"
            onChange={(val) => handleChange("salary", val)}
            placeholder="请输入期望薪资"
          />
        </Form.Item>
        <Form.Item name="info" label="职位要求：">
          <TextArea
            placeholder="请输入职位要求"
            maxLength={1000}
            rows={2}
            showCount
            onChange={(val) => handleChange("info", val)}
          />
        </Form.Item>
      </Form>
    </>
  );
};
