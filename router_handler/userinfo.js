// 导入数据库操作模块
const db = require("../db/index");
const bcrypt = require("bcryptjs");
// 获取用户信息的处理函数
exports.getUserInfo = (req, res) => {
  // 根据用户的 id，查询用户的基本信息
  // 注意:为了防止用户的密码泄露，需更排除 password 字段
  
  if (!Object.keys(req.query).includes("id")) {
    return res.send({
      status: 500,
      message: "id字段不存在",
    });
  }
  if (!Object.keys(req.query).includes("username")) {
    return res.send({
      status: 500,
      message: "用户名字段不存在",
    });
  }
  if (!req.query.id || !req.query.username) {
    return res.send({
      status: 500,
      message: "id或用户名不能为空",
    });
  }
  const sqlStr =
    "select id,username,user_pic,user_phone,address,email from ev_users where id=?";
  // 注意: req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(sqlStr, [req.query.id], (err, results) => {
    // sql执行失败
    if (err) res.cc(err);
    // // 执行sql成功，但查询到的数据条数不等于1
    if (results.length !== 1) return res.cc("获取用户信息失败");
    // 将用户信息响应给客户端
    res.send({
      status: 200,
      message: "用户信息获取成功",
      data: results[0],
    });
  });
};

// 更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
    
    const userinfo = req.body;
    if (!Object.keys(userinfo).includes('id')) {
      return res.send({
        status: 400,
        message: "id字段不存在",
      });
    }
    if (!Object.keys(userinfo).includes('address')) {
      return res.send({
        status: 400,
        message: "address字段不存在",
      });
    }
  // 定义待执行的 SOL 语句:
  const sqlStr = "update ev_users set ? where id=?";
  // 调用 db.query() 执行 SQL 语句并传参:
  db.query(sqlStr, [req.body, req.body.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);
    // 执行 SQL 语句成功，但影响行数不为 1
    if (results.affectedRows !== 1) return res.cc("修改用户基本信息失败!");
    // 修改用户信息成功
    return res.cc("修改用户基本信息成功!", 200);
  });
};


// 重置密码的处理函数
exports.updatePassword = (req, res) => {
  const userinfo = req.body;
    if (!Object.keys(userinfo).includes('newpwd')) {
      return res.send({
        status: 400,
        message: "newpwd字段不存在",
      });
    }
    if (!Object.keys(userinfo).includes('oldpwd')) {
      return res.send({
        status: 400,
        message: "oldpwd字段不存在",
      });
    }
  // 定义根据 id 查询用户数据的 SQL 语句
  const sqlStr = "SELECT * FROM ev_users WHERE id=?";
  // 调用 db.query() 执行 SQL 语句并传参:
  try {
    db.query(sqlStr, req.user.id, (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err,500);
      // 执行 SQL 语句成功，但影响行数不为 1
      if (results.length !== 1) return res.cc("用户不存在!",400);
      // 判断提交的旧密码是否正确
      // 在头部区域导入 bcryptjs 后，
      // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
      
      // 判断提交的旧密码是否正确
      const compareResult = bcrypt.compareSync(
        req.body.oldpwd,
        results[0].password
      );
      if (!compareResult) return res.cc("原密码错误",400);
      // 对新密码加密后更新到数据库
      // 定义更新密码的sql
      const updateSqlStr = "update ev_users set password=? where id=?";
      // 对新密码进行 bcrypt 加密处理
      const newPwd = bcrypt.hashSync(req.body.newpwd, 10);
     
      db.query(updateSqlStr, [newPwd, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.affectedRows !== 1) return res.cc("更新密码失败!",400);
        res.cc("更新密码成功!", 200);
      });
     
    });
  } catch (error) {
    res.cc("服务端报错!", 500);
  }
};


// 更新用户头像
exports.updateAvatar = (req, res) => {
  // 定义更新头像的sql语句
  const sqlStr = "update ev_users set user_pic=? where id=?";
  db.query(sqlStr, [req.body.avatar, req.user.id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err,500);
    // 执行 SQL 语句成功，但影响行数不为 1
    if (results.changedRows !== 1) return res.cc("更新头像失败!",400);
    // 更新头像成功
    return res.cc("更新头像成功!", 200);
  });
};