// 导入数据库连接对象
const db = require("../db/index");

// 注册用户的处理函数
exports.setOrder = (req, res) => {
  if (!Object.keys(req.query).includes("sise")) {
    return res.send({
      status: 500,
      message: "数量字段不存在",
    });
  }else if(req.query.sise == 0 || null || undefined){
    return res.send({
      status: 500,
      message: "页码字段值错误",
    });
  }
  if (!Object.keys(req.query).includes("sise")) {
    return res.send({
      status: 500,
      message: "分页字段不存在",
    });
  }else if(req.query.page == 0 || null || undefined){
    return res.send({
      status: 500,
      message: "分页字段值错误",
    });
  }
  const page = (Number(req.query.page) - 1) * Number(req.query.sise);
  console.log(req.query.sise, page);
  const sqlStr =
    "SELECT username, role, phone, email, status, DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') AS formatted_time FROM ev_order WHERE username = ? LIMIT ? OFFSET ?";
  // 注意: req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(
    sqlStr,
    [req.user.username, Number(req.query.sise), Number(page)],
    (err, results) => {
      // sql执行失败
      if (err) res.cc(err);
      // // 执行sql成功，但查询到的数据条数不等于1
      if (results.length < 1) return res.send({
        status: 200,
        message: "用户信息获取成功",
        data: [],
      });;
      // 将用户信息响应给客户端
      res.send({
        status: 200,
        message: "用户信息获取成功",
        data: results,
      });
    }
  );
};
