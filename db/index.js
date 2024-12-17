// 导入mysql模块
const mysql = require("mysql");

// 创建数据库连接对象
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// 向外共享出db数据库连接对象
module.exports = db;


//SQL语句，多表查询，
//'select a.*, b.* from ev_article_cate a join ev_users b on a.id = b.id'

//SQL语句，多表查询,这个需要一个外键来绑定ev_users_id
//'SELECT * FROM ev_users JOIN ev_article_cate ON ev_users.id = ev_article_cate.ev_users_id WHERE ev_users.id = 7 AND ev_article_cate.name'

//查指定的可以这样
//'SELECT ev_users.* ,ev_article_cate.name FROM ev_users JOIN ev_article_cate ON ev_users.id = ev_article_cate.ev_users_id WHERE ev_users.id = 7 AND ev_article_cate.name'