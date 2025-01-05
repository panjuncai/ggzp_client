import { useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import HeaderSelector from "../../components/header-selector/header-selector";
import { Form, Button, Input, TextArea, Toast } from "antd-mobile";
import Cookies from "js-cookie";
import { useSelector,useDispatch } from "react-redux";
import { processUpdateUser, resetStatus } from "../../redux/userSlice";

export default () => {
  const [state, setState] = useState({
    info: "",
    post: "",
  });
  const [form]=Form.useForm()
  const [isInit,setIsinit]=useState(false)
  const userStatus=useSelector(state=>state.user.status)
  const user=useSelector(state=>state.user.user)
  const dispatch=useDispatch()
  const navigate=useNavigate()

  useEffect(()=>{
    if(user){
        form.setFieldsValue({
            post:user.post,
            info:user.info
        })
    }
    setIsinit(true)
  },[])

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
        navigate('/personal',{replace:true})
      }else if(userStatus === "rejected"){
        Toast.show({
          icon:'fail',
          content:user.msg
        })
      }
      dispatch(resetStatus())
    }, [userStatus, dispatch]);

  const handleUpdateUser = async () => {
      await dispatch(processUpdateUser(state));
    //   console.log(`updateUser is :${result}`);
    };
  
  const handleChange = (name, value) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  if(!isInit){
    return null
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
        <Form.Header>求职者信息完善</Form.Header>
        <Form.Item
          name="post"
          label="求职岗位："
          rules={[{ required: true, message: "求职岗位不能为空" }]}
        >
          <Input
            onChange={(val) => handleChange("post", val)}
            placeholder="请输入求职岗位"
          />
        </Form.Item>
        <Form.Item name="info" label="个人介绍：">
          <TextArea
            placeholder="请输入个人介绍"
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
