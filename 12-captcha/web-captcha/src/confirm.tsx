// import { useState } from "react";
import { Button } from "antd";
import axios from "axios";

const params = new URLSearchParams(window.location.search);

console.log("=>", params.get("id"));
axios.get(`http://192.168.0.106:3000/user/qrcode/scan?id=${params.get("id")}`);

const confirm = async () => {
  console.log(1111);
  await axios.get(
    `http://192.168.0.106:3000/user/qrcode/confirm?id=${params.get("id")}`
  );
};
const cancel = async () => {
  await axios.get(
    `http://192.168.0.106:3000/user/qrcode/cancel?id=${params.get("id")}`
  );
};

function App() {
  return (
    <div style={{ display: "flex" }}>
      {/* 二维码 */}
      <div style={{ margin: "0 50px" }}>
        <Button
          type="primary"
          style={{ marginBottom: "10px" }}
          onClick={confirm}
        >
          确认登录
        </Button>
        <Button onClick={cancel}>取消登录</Button>
      </div>
      {/* 二维码 */}
    </div>
  );
}

export default App;

