const express = require("express");
const multer = require('multer'); //使用multer中间件来解析from-data格式的请求体
const upload = multer(); // 使用默认配置  
// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入验证规则
const {
  reg_artcate_add_schema,
} = require("../schema/artcate");

// 创建文章分类模块
const router = express.Router();
// 导入文章分类的路由处理函数模块
const artCate_handler = require("../router_handler/order");

//数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
const handleValidationError = (err, req, res, next) => {
  console.log(req);
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

// 获取文章分类的列表数据
router.get("/order/list",upload.none(), artCate_handler.setOrder);

// 将路由对象共享出去
module.exports = router;
