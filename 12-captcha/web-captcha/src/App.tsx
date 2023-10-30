// import { useState } from "react";
import { Button, Form, Input, message } from "antd";

import axios from "axios";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Confirm from "./confirm";
const params = new URLSearchParams(window.location.search);

console.log("=>", params.get("id"));

const onFinish = async (values: any) => {
  const res = await axios.post("http://localhost:3000/user/login", {
    email: values.email,
    code: values.code,
  });

  if (res.status != 200) return message.error(res.data.message);
  message.success("登陆成功");
  console.log("Success:", res.data);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

type FieldType = {
  email?: string;
  code?: string;
};

// interface qrcode {
//   qrcode_id: string;
//   img: string;
// }

function App() {
  // const [count, setCount] = useState(0);
  const [form] = Form.useForm();
  const [qrCode, setQrCode] = React.useState({
    qrcode_id: "",
    img: "",
  });
  const [info, setInfo] = React.useState("sss");

  const getQrCode = async () => {
    const res = await axios.get("http://192.168.0.106:3000/user/qrcode");
    console.log(res);
    if (res.status === 200) setQrCode(res.data);
    getQrCodeStatus(res.data.qrcode_id);
  };

  const getQrCodeStatus = async (id: string) => {
    const {
      data: { status },
    } = await axios.get(`http://192.168.0.106:3000/user/qrcode/check?id=${id}`);
    // 检测
    enum QrStatus {
      no_scan, // 未扫描
      scan, // 已扫描
      confirm, // 确认
      cancel, // 取消
      expired, // 过期
    }

    console.log("QrStatus[status]", QrStatus[status]);
    setInfo(QrStatus[status]);

    if (status === 0 || status === 1) {
      setTimeout(() => getQrCodeStatus(id), 1000);
    }
  };

  useEffect(() => {
    getQrCode();
  }, []);

  form.setFieldValue("email", "2309283877@qq.com");
  const sendEmailCode = async () => {
    const email = form.getFieldValue("email");

    if (!email) {
      message.error("邮箱不能为空");
      return;
    }

    const res = await axios.get("http://localhost:3000/email/code", {
      params: {
        address: email,
      },
    });

    if (res.status === 200) return message.success("发送成功");
    message.error("发送失败");
    console.log("send email code");
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ display: "flex" }}>
              {/* 邮箱 */}
              <div style={{ width: "500px", margin: "0 auto" }}>
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 600 }}
                  form={form}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item<FieldType>
                    label="邮箱"
                    name="email"
                    rules={[{ required: true, message: "请输入邮箱!" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item<FieldType>
                    label="验证码"
                    name="code"
                    rules={[{ required: true, message: "请输入验证码!" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" ghost onClick={sendEmailCode}>
                      发送验证码
                    </Button>{" "}
                    <Button type="primary" htmlType="submit">
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              {/* 邮箱 */}

              {/* 二维码 */}
              <div style={{ margin: "0 50px" }}>
                <img src={qrCode.img} alt="" />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>{info}</div>
                  <Button type="primary" style={{ marginBottom: "10px" }}>
                    确认登录
                  </Button>
                  <Button>取消登录</Button>
                </div>
              </div>
              {/* 二维码 */}
            </div>
          }
        ></Route>
        <Route path="/confirm" element={<Confirm></Confirm>}></Route>
      </Routes>
    </div>
  );
}

export default App;

