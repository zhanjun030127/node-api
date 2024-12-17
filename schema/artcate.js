// 导入 Joi 来定义验证规则
const Joi = require("joi");
const artcateAddSchema = {
  // 2.1 校验 req.body 中的数据
  body: {
    // alphanum只能包含字母和数字
    name: Joi.string().required(),
    alias: Joi.string().alphanum(),
  },
};
exports.reg_artcate_add_schema = artcateAddSchema;

const artcateIdSchema = {
  // 2.1 校验 req.body 中的数据
  query: {
    id: Joi.number().integer().min(1).required(),
  },
};
/* 删除 */
exports.reg_artcate_id_schema = artcateIdSchema;

const artcateUpdateSchema = {
  // 2.1 校验 req.body 中的数据
  body: {
    // alphanum只能包含字母和数字
    name: Joi.string().required(),
    alias: Joi.string().alphanum(),
    id: Joi.number().integer().min(1).required(),
  },
};
/* 更新 */
exports.reg_artcate_update_schema = artcateUpdateSchema;
