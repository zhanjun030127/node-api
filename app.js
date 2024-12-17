const express = require("express"); //导入express

const bodyParser = require('body-parser');  //使用body-parser中间件来解析JSON格式的请求体
const cors = require("cors"); // 导入cors中间件
const path = require('path'); // 引入 path 模块  
const userRouter = require("./router/user"); // 导入用户路由模块

const userinfoRouter = require("./router/userinfo"); // 导入并使用用户信息路由模块

const artCateRouter = require("./router/artcate");// 导入并使用文章分类路由模块

const updataRouter = require("./router/updata");// 导入并使用上传图片路由模块
const orderRouter = require("./router/order");// 导入并使用上传图片路由模块
const Joi = require("joi"); // 导入 Joi 来定义验证规则

const config = require("./config"); // 导入配置文件

const expressJWT = require("express-jwt"); // 解析token中间件
// 导入数据库连接对象
const db = require("./db/index");
// 用这个包来生成 Token 字符串
const jwt = require("jsonwebtoken");

const app = express(); // 创建express服务器实例
// 将cors注册为全局中间件
app.use(cors()); //不传参默认允许简单跨域和预检跨域

app.use('/static', express.static('uploads'))

app.use(bodyParser.json()); // 解析application/json类型的请求体  
app.use(bodyParser.urlencoded({ extended: true })); // 解析application/x-www-form-urlencoded类型的请求体  
// 响应数据的中间件
app.use(function (req, res, next) {
  res.cc = function (err, status = 400) {
    res.send({
      // 状态
      status,
      // 状态描述：判断err是错误对象还是字符串
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});



// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }));

// 自定义中间件，用于提取 token
const tokenExtractor = (req, res, next) => {
  if (!req.path.startsWith("/api")) {
    const token = req.headers["token"]; // 从请求头提取 token

    //判断存放字段错误
    if (!Object.keys(req.headers).includes("token")) {
      return res.cc("Token存放字段错误", 401);
    }

    if (!token) {
      return res.cc("Token字段是空的", 401);
    }

    // 使用格式 token <令牌>，提取令牌部分
    const parts = token.split(" ");
    if (parts.length !== 2 || parts[0] !== "token") {
      return res.cc("Token格式错误", 401);
    }

    req.token = parts[1]; // 将令牌存入请求对象
  }
  next(); // 继续处理请求
};

// 使用自定义中间件进行 token 验证
app.use(tokenExtractor); // 先提取 token，然后再进行验证
app.use(
  expressJWT({
    secret: config.jwtSecretKey,
    algorithms: ["HS256"],
    getToken: (req) => req.token,
  }).unless({ path: [/^\/api\//] }) // 放行/api/路径
);

// token错误处理
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    if (err.message === "jwt expired") {
      return res.cc("Token已过期,请重新登录", 401);
    }
    return res.cc("无效的token", 401);
  }
  next();
});

// 配置解析表单数据的中间件
app.use(
  // 验证Token的中间件
  function verifyToken(req, res, next) {
    if (req.path.startsWith('/api')) {  
      return next();  
    }  
  
    // const token = req.headers["token"]?.split(" ")[1]; //liunx不允许使用？符号
    const token = req.headers["token"]
    if (!token) return res.cc("未提供Token", 401);
   
    jwt.verify(token.split(" ")[1], config.jwtSecretKey, (err, decoded) => {
      if (err) return res.cc("Token验证失败", 401);

      // 从数据库中获取用户的token_version
      const sqlStr = "SELECT token_version FROM ev_users WHERE id = ?";
      db.query(sqlStr, [decoded.id], (dbErr, results) => {
        if (dbErr) return res.cc(dbErr.message);
        if (results.length !== 1) return res.cc("用户不存在", 401);

        // 检查Token中的版本号与数据库中的是否一致
        if (Number(decoded.token_version) !== Number(results[0].token_version)) {
          return res.cc("Token已失效,请重新登录", 401);
        }

        // 版本号一致，继续处理请求
        next();
      });
    });
  }
);
// 使用.unless({ path: [/^\/api\//] }) 指定哪些接口不需要token认证
// app.use(
//   expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })
// );

// 4.1 错误级别中间件
app.use(function (err, req, res, next) {
  // 4.1 Joi 参数校验失败

  if (err instanceof Joi.ValidationError) {
    return res.cc(err.message);
  }
  // 4.2 未知错误
  res.cc(err.message);
});

// 注册用户模块用户路由模块
app.use("/api", userRouter); //每次访问用户模块的接口都要添加/api前缀

// 注意:以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use("/my", userinfoRouter);

app.use("/my", artCateRouter);
app.use("/my", updataRouter);
app.use("/my", orderRouter);
// 启动服务器
app.listen(3007, function () {
  console.log("api server running at 127.0.0.1:3007");
});