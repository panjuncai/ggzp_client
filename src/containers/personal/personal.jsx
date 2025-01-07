import { Avatar, Button, Toast, Space, List, Modal } from "antd-mobile";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import {
  logout,
  processDeleteUser,
  processQueryUser,
  resetStatus,
} from "../../redux/userSlice";
import { useNavigate ,Navigate} from "react-router-dom";
import { useSelector } from "react-redux";
import {
  UserContactOutline,
  SmileOutline,
  HandPayCircleOutline,
} from "antd-mobile-icons";
import { useEffect, useState } from "react";
export default () => {
  // 初始化变量
  const userid = Cookies.get("userid");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userStatus = useSelector((state) => state.user.status);
  // const [isInit, setIsInit] = useState(false);

  // 通过userid拿一次用户信息
  // useEffect(() => {
  //   if (userid) {
  //     dispatch(processQueryUser())
  //       .then(() => {
  //         // 拿到用户信息后，初始化完成
  //         setIsInit(true);
  //       })
  //       .catch(() => {
  //         // 拿不到用户信息也要完成初始化
  //         setIsInit(true);
  //       });
  //         setIsInit(true);
  //   } else {
  //     // 拿不到cookie中的用户信息，也完成了初始化
  //     setIsInit(true);
  //   }
  // }, [userid, dispatch]);

  // 监听userStatus,给出提示
  useEffect(() => {
    if (userStatus === "pending") {
      //   Toast.show({
      //     icon: "loading",
      //   });
    } else if (userStatus === "fulfilled") {
      //   Toast.show({
      //     icon: "success",
      //     content: user.msg,
      //   });
    } else if (userStatus === "rejected") {
      Toast.show({
        icon: "fail",
        content: user.msg,
      });
    }
    // console.log(`personal user is ${JSON.stringify(user)}`)
    // 如果是注销，则带提示
    if (userStatus === "fulfilled" && user.username === "") {
      Toast.show({
        icon: "success",
        content: user.msg,
      });
      // 提示完跳转到登录页
      navigate("/login", { replace: true });
    }

    if (userStatus !== "idle") {
      dispatch(resetStatus());
    }
  }, [userStatus, dispatch, user.msg]);

  // 用户事件
  const handleLogout = () => {
    Cookies.remove("userid");
    dispatch(logout());
    Toast.show({
        icon: "success",
        content: '成功登出',
      });
    navigate("/login", { replace: true });
  };

  // const handleDeleteUser = () => {
  //   // Cookies.remove("userid");
  //   dispatch(processDeleteUser());
  // };

  const gotoUpdateInfo = () => {
    if (user.type === "laoban") {
      navigate("/laobaninfo");
    } else if (user.type === "dashen") {
      navigate("/dasheninfo");
    } else {
      Toast.show({ icon: "fail", content: "用户类型错误" });
    }
  };

  // 1.如果还未初始化，先显示Loading
  // if (!isInit) {
  //   // 这里可以放骨架屏,todo...
  //   return null;
  // }

  // 2.如果没有userid，说明还没登录，跳转到登录
  if (!userid) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{padding:'1rem'}} className="no-select">
      <Space block direction="vertical" justify="center" align="center">
        <Avatar
          src={`/assets/images/${user.header}.png`}
          style={{ "--size": "128px" }}
        />
        <h1>{user.username}</h1>
      </Space>
      <List header="" mode="card">
        {user.type === "dashen" ? (
          <>
            <List.Item prefix={<UserContactOutline />} title="求职岗位">
              {user.post}
            </List.Item>
            <List.Item prefix={<SmileOutline />} title="相关简介">
              {user.info}
            </List.Item>
          </>
        ) : (
          <>
            <List.Item prefix={<UserContactOutline />} title="招聘岗位">
              {user.post}
            </List.Item>
            <List.Item prefix={<SmileOutline />} title="技能要求">
              {user.info}
            </List.Item>
            <List.Item prefix={<HandPayCircleOutline />} title="薪资">
              {user.salary ? `${user.salary}K` : "面议"}
            </List.Item>
          </>
        )}
      </List>
      <Space direction='vertical' block>
        <Button block size="large" color="primary" onClick={gotoUpdateInfo}>
          修改资料
        </Button>
        <Button
          block
          size="large"
          color="warning"
          onClick={async () => {
            const result = await Modal.confirm({
              content: "确认退出？",
            });
            if (result) {
              handleLogout();
            }
          }}
        >
          退出登录
        </Button>
        {/* <Button
          block
          size="large"
          color="danger"
          onClick={() => {
            Modal.confirm({
              content: (
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "red",
                  }}
                >
                  谨慎！确认注销账户？{" "}
                </div>
              ),
              actions: [
                {
                  key: "confirm",
                  text: "确认",
                  bold: true,
                  danger: true,
                  primary: true,
                },
                { key: "cancel", text: "取消" },
              ],
              onConfirm: () => {
                handleDeleteUser();
              },
            });
          }}
        >
          注销用户
        </Button> */}
      </Space>
    </div>
  );
};
