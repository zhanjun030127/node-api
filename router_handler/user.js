// 导入数据库连接对象
const db = require("../db/index");
// 导入密码加密工具
const bcrypt = require("bcryptjs");
// 用这个包来生成 Token 字符串
const jwt = require("jsonwebtoken");
// config
const config = require("../config.js");

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 接收表单数据
  const userinfo = req.body;
  console.log(userinfo);
  if (!Object.keys(userinfo).includes("username")) {
    return res.send({
      status: 500,
      message: "用户名字段不存在",
    });
  }
  if (!Object.keys(userinfo).includes("password")) {
    return res.send({
      status: 500,
      message: "密码字段不存在",
    });
  }
  if (!userinfo.username || !userinfo.password) {
    return res.send({
      status: 500,
      message: "用户名或密码不能为空",
    });
  }
  // 定义sql语句
  const sqlStr = "SELECT * FROM ev_users WHERE username=?";
  db.query(sqlStr, userinfo.username, (err, results) => {
    //sql执行出错
    if (err) return res.cc(err);
    // // 判断用户是否被占用
    if (results.length > 0) {
      return res.cc("用户名已被占用，请更换其他用户名");
    }
    // 用户名可用
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    // 定义插入用户的sql语句
    const sql = "insert into ev_users set ?";
    db.query(
      sql,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        // 判断sql语句是否执行成功
        if (err) return res.cc(err);
        // 判断影响行为是否为1
        if (results.affectedRows !== 1) {
          return res.cc("注册用户失败，请稍后再试！");
        }
        res.cc("注册成功", 200);
      }
    );
  });
};

// 登录处理函数
exports.login = (req, res) => {
  // 接收表单数据
  const userinfo = req.body;
  if (!Object.keys(userinfo).includes("username")) {
    return res.cc("用户名字段不存在", 500);
  }
  if (!Object.keys(userinfo).includes("password")) {
    return res.cc("密码字段不存在", 500);
  }
  if (!userinfo.username || !userinfo.password) {
    return res.cc("用户名或密码不能为空", 500);
  }

  // 定义sql语句
  const sqlStr = "SELECT * FROM ev_users WHERE username=?";

  db.query(sqlStr, [userinfo.username], (err, results) => {
    // 执行sql语句失败
    if (err) return res.cc(err.message);
    // 执行sql语句成功但是查询到数据条数不等于1
    if (results.length !== 1) return res.cc("请注册账号",400);

    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );
    // 如果比对结果为false，证明用户输入密码错误
    if (!compareResult) {
      return res.cc("密码输入错误",400);
    }

    // 更新用户的token_version
    const newVersion = Number(results[0].token_version) + 1; // 增加版本号
    const limits_of_authority = userinfo.username == 'admin' ? 1 : 2;
    const updateSql =
      "UPDATE ev_users SET token_version = ? ,limits_of_authority = ? WHERE username = ?";
    db.query(updateSql, [newVersion, limits_of_authority, userinfo.username], (updateErr) => {
      if (updateErr) return res.cc(updateErr.message);

      // 剔除完毕之后，user 中只保留了用户的 id，username，nickname，
      const user = {
        ...results[0],
        password: "",
        user_pic: "",
        token_version: newVersion,
      };

      // 生成 Token 字符串
      const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: config.expiresIn,
      });

      // 调用res.send将token的值返回给客户端
      res.send({
        status: 200,
        message: "登录成功",
        token: tokenStr,
        limits_of_authority:limits_of_authority,
        name: userinfo.username
      });
    });
  });
};
