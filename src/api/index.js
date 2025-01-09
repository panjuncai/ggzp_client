import ajax from "./ajax";
export const reqRegister = (user) => ajax("/register", user, "POST"); // 请求注册
export const reqLogin = (user) => ajax("/login", user, "POST"); // 请求登陆
export const reqDeleteUser = (user) => ajax("/deleteUser", user, "POST"); // 注销账户
export const reqUpdateUser= (user) => ajax("/update", user, "POST"); // 请求更新
export const reqDeleteMsg= (msg) => ajax("/deleteMsg",msg, "POST");
export const reqUser=()=>ajax('/user')
export const reqAllLaobans=()=>ajax('/allLaobans')
export const reqAllDashens=()=>ajax('/allDashens')
export const reqChatMsgList=()=>ajax('/msglist')
export const reqReadChatMsg=(from)=>ajax('/readmsg',{from},'POST')