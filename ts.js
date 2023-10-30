"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var argon2 = require("argon2");
(async () => {
  const res = await argon2.hash("12312312");
  console.log(res);
  const v = await argon2.verify(res, "12312312");
  console.log(v);
})();
// console.log(res);

