// 导入 express
const express = require("express"); // 创建路由对象
const router = express.Router();
// 导入用户信息的处理函数模块
const update_userinfo_handler = require("../router_handler/userinfo");
// 获取用户的基本信息

// // 1. 导入 @escook/express-joi
const expressJoi = require("@escook/express-joi");
// 2，导入需要的验证规则对象
const {
  update_userinfo_schema,
  update_userinfo,
} = require("../schema/userinfo");

const { update_password_schema,reg_avatar_schema } = require("../schema/user");
const handleValidationError = (err, req, res, next) => {
  console.log(res)
  if (err && err.details && err.details.length > 0) {
    const errorMsg = err.details.map((detail) => detail.message).join(", ");
    return res.send({
      status: 500,
      msg: `字段验证失败: ${errorMsg}`,
    });
  }
  // 如果不是expressJoi验证相关的错误，继续传递给下一个中间件（比如全局错误中间件）
  next(err);
};
router.get(
  "/userinfo",
  expressJoi(update_userinfo_schema),
  handleValidationError,
  update_userinfo_handler.getUserInfo
);

// 更新用户的基本信息
router.post(
  "/updateUserInfo",
  expressJoi(update_userinfo),
  handleValidationError,
  update_userinfo_handler.updateUserInfo
);

// 重置密码的路由
router.post(
  "/updatepwd",
  expressJoi(update_password_schema),
  handleValidationError,
  update_userinfo_handler.updatePassword
);


router.post(
  "/update/avatar",
  expressJoi(reg_avatar_schema),
  handleValidationError,
  update_userinfo_handler.updateAvatar
);

// 向外共享路由对象
module.exports = router;
