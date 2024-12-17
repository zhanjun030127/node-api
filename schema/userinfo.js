// 导入 Joi 来定义验证规则
const Joi = require("joi");

const userInfoSchema = {
    body: {
      id: Joi.number().integer().min(1).required(),
      username: Joi.string().alphanum().min(3).max(12).required(),
    //   nickname: Joi.string().required(),
    //   email: Joi.string().email().required(),
    },
};
  
exports.update_userinfo_schema = userInfoSchema;
  
const userInfoSUpdata = {
    body: {
      id: Joi.number().integer().min(1).required(),
    //   username: Joi.string().alphanum().min(3).max(12).required(),
      address: Joi.string().required()
    //   email: Joi.string().email().required()
    },
};

exports.update_userinfo = userInfoSUpdata;