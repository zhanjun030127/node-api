// 导入 Joi 来定义验证规则
const Joi = require("joi");

// 2. 定义验证规则
// 注意：如果客户端提交的某些参数项未在 schema 中定义，
// 此时，这些多余的参数项默认会被忽略掉
const userSchema = {
  // 2.1 校验 req.body 中的数据
  body: {
    username: Joi.string().alphanum().min(3).max(12).required(),
    password: Joi.string()
      .pattern(/^[\S]{6,15}$/)
      .required(),
  },
};

exports.reg_login_schema = userSchema;


const passwordSchema = {
  // 2.1 校验 req.body 中的数据
  body: {
    oldpwd: Joi.string().pattern(/^[\S]{6,15}$/).required(),
    newpwd: Joi.not(Joi.ref("oldPwd")).concat(Joi.string().pattern(/^[\S]{6,15}$/).required()),
  },
};

exports.update_password_schema = passwordSchema;

const avatarSchema = {
  // 2.1 校验 req.body 中的数据
  body: {
    // dataUri() 指的是如下格式的字符串数据:
    // data :image/png :base64,VE9PTUFOWVNFQ1JFVFM-
    // avatar: Joi.string().dataUri().required(),
    avatar: Joi.string().required(),
  },
};

exports.reg_avatar_schema = avatarSchema;