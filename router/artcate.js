const express = require("express");

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入验证规则
const {
  reg_artcate_add_schema,
  reg_artcate_id_schema,
  reg_artcate_update_schema,
} = require("../schema/artcate");

// 创建文章分类模块
const router = express.Router();
// 导入文章分类的路由处理函数模块
const artCate_handler = require("../router_handler/artcate");

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
router.get("/article/cates", artCate_handler.getArtCates);

// 新增文章分类的列表数据
router.post(
  "/article/addcates",
  expressJoi(reg_artcate_add_schema),
  handleValidationError,
  artCate_handler.addArtCate
);
// 删除文章分类
router.get(
  "/deletecate/id",
  expressJoi(reg_artcate_id_schema),
  handleValidationError,
  artCate_handler.deleteArtCate
);

// 更新文章分类的处理函数
router.post(
  "/updatecate",
  expressJoi(reg_artcate_update_schema),
  handleValidationError,
  artCate_handler.updateArtCate
);

// 将路由对象共享出去
module.exports = router;
