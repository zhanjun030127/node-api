const express = require("express");
// 创建用户模块
const multer = require('multer'); //使用multer中间件来解析from-data格式的请求体
// // 1. 导入 @escook/express-joi
const expressJoi = require("@escook/express-joi");
// 2，导入需要的验证规则对象
const { reg_login_schema } = require("../schema/user");


const router = express.Router();
// 导入用户路由处理函数模块
const userHandler = require("../router_handler/user");

// 创建multer实例  
const upload = multer(); // 使用默认配置  

// 注册新用户
//在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
//数据验证通过后，会把这次请求流转给后面的路由处理函数
//数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
const handleValidationError = (err, req, res, next) => {
    if (err && err.details && err.details.length > 0) {
        const errorMsg = err.details.map(detail => detail.message).join(', ');
        return res.send({
            status: 500,
            msg: `字段验证失败: ${errorMsg}`
        });
    }
    // 如果不是expressJoi验证相关的错误，继续传递给下一个中间件（比如全局错误中间件）
    next(err);
};

router.post("/reguser",upload.none(),expressJoi(reg_login_schema),handleValidationError, userHandler.regUser);


// 登录
router.post("/login",upload.none(),expressJoi(reg_login_schema),handleValidationError, userHandler.login);


// 将路由对象共享出去
module.exports = router;
