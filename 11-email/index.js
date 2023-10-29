const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: "xxx@qq.com",
    pass: "xxx",
  },
});

async function main() {
  const info = await transporter.sendMail({
    from: '"PuMa" <xxx@qq.com>',
    to: "xxx@qq.com",
    subject: "Hello 111",
    text: "xxxxx",
  });

  console.log("邮件发送成功：", info.messageId);
}

main().catch(console.error);
