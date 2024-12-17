// 导入数据库连接对象
const db = require("../db/index");

// 注册用户的处理函数
exports.getArtCates = (req, res) => {
  const sqlStr =
    "select * from ev_article_cate where is_delete=0 order by id asc";
  db.query(sqlStr, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 200,
      message: "获取数据成功",
      data: results,
    });
  });
};

// 新增文章分类的处理函数
exports.addArtCate = (req, res) => {
  const sqlStr = "select * from ev_article_cate where name=? or alias=?";
  // 执行查重的sql语句
  db.query(sqlStr, [req.body.name, req.body.alias], (err, results) => {
    console.log(results);
    if (err) return res.cc(err);
    if (results.length === 2) {
      return res.cc("分类名称与分类别名被占用，请更换后重试!", 400);
    }
    if (
      results.length === 1 &&
      results[0].name === req.body.name &&
      results[0].alias === req.body.alias
    ) {
      return res.cc("分类名称与分类别名被占用，请更换后重试!", 400);
    }
    if (results.length === 1 && results[0].name === req.body.name) {
      return res.cc("分类名称被占用，请更换后重试!", 400);
    }
    if (results.length === 1 && results[0].alias === req.body.alias) {
      return res.cc("分类别名被占用，请更换后重试!", 400);
    }
    // TODO: 分类名称和分类别名都可用，执行添加的动作
    const sqlAdd = "insert into ev_article_cate set ?";
    db.query(sqlAdd, req.body, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) {
        return res.cc("新增文章分类失败!", 400);
      }
      res.cc("新增文章分类成功!", 200);
    });
  });
};

// 删除文章分类处理函数
exports.deleteArtCate = (req, res) => {
  const sqlStr = "delete FROM ev_article_cate where id=?";
  db.query(sqlStr, req.query.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("删除文章分类失败");
    return res.cc("删除文章分类成功", 200);
  });
};


// 更新文章分类的处理函数
exports.updateArtCate = (req, res) => {
    const sqlAdd = "update ev_article_cate set name=?, alias=? where id=?";
      db.query(sqlAdd, [req.body.name,req.body.alias,req.body.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) {
          return res.cc("修改文章分类失败!",400);
        }
        res.cc("修改文章分类成功!",200);
      });
  };
  