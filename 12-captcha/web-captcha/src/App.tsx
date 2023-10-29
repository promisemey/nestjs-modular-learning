// import { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";

import axios from "axios";
import { useState } from "react";

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

function App() {
  // const [count, setCount] = useState(0);
  const [form] = Form.useForm();

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
  );
}

export default App;

