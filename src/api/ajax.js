import axios from "axios";
export default function ajax(url = "", data = {}, type = "GET") {
    // console.log(`data is :${JSON.stringify(data)}`)
  if (type === "GET") {
    // 准备 url query 参数数据
    let dataStr = ""; //数据拼接字符串
    Object.keys(data).forEach((key) => {
      dataStr += key + "=" + data[key] + "&";
    });
    if (dataStr !== "") {
      dataStr = dataStr.substring(0, dataStr.lastIndexOf("&"));
      url = url + "?" + dataStr;
    } // 发送 get 请求
    return axios.get('/api'+url);
  } else {
    // 发送 post 请求
    // console.log(`axios url is ${url}`)
    return axios.post('/api'+url, data); // data: 包含请求体数据的对象
  }
}
