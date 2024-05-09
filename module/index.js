const { query, transaction } = require("../common/mysql");
const { formatMenu, formatCreateTable, getVistor } = require("../utils");
const { getToken } = require("../common/jwt");
const createError = require("http-errors");
const dayjs = require("dayjs");

function getMsgList(req, res, next) {
  let { page = 1, pagesize = 10, name = "", description = "" } = req.query;
  if (Number(page) < 1 || Number(pagesize) < 10)
    return res.send({ msg: "Parameter error, please try again", status: 1 });
  var sql =
    `select SQL_CALC_FOUND_ROWS *,DATE_FORMAT(add_time,"%Y-%m-%d %H:%i:%S") as add_time from message 
  where name like ? and description like ?  limit ?,?;
  select found_rows() as total;` + "show create table message;";
  let params = [
    `%${name}%`,
    `%${description}%`,
    (page - 1) * Number(pagesize),
    Number(pagesize),
  ];
  query(sql, params, next, (datalist) => {
    let createStr = datalist[2][0]["Create Table"];
    let mapKey = formatCreateTable(createStr);
    res.send({
      status: 0,
      data: { list: datalist[0], mapKey, total: datalist[1][0].total },
      msg: "",
    });
  });
}

function login(req, res, next) {
  const { account, pswd } = req.body;
  let userInfo = req.user;
  if (userInfo) return res.send({ msg: "login successful", status: 0, data: userInfo });
  if (!account || !pswd) {
    return res.send({ msg: "Login information cannot be empty, please try again!", status: 1 });
  }
  let sql = "select * from user_info where account = ? and pswd = ?";
  query(sql, [account, pswd], next, (result) => {
    if (result && result.length) {
      let data = result[0];
      delete data.pswd;
      var token = getToken({ ...data });
      res.send({ msg: "login successful", status: 0, token, data });
      return;
    }
    res.send({ status: 1, msg: "Account information not found, please try again!" });
  });
}

function getMenu(req, res, next) {
  var sql =
    "SELECT  * FROM `menu` WHERE  m_id IN (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(a.`menu_id`,',',b.help_topic_id + 1),',', -1 ) as menuId FROM (SELECT  p.menu_id FROM `user_info` as u INNER JOIN `power`as p ON u.`type_id` = p.`type_id` and u.user_id = 1) as a JOIN mysql.help_topic as b ON b.help_topic_id < (LENGTH(a.`menu_id`)-LENGTH(REPLACE(a.`menu_id`,',',''))+1)) ORDER BY menu.`order`"
  query(sql, [req.user.user_id], next, (result) => {
    let data = (result || []);
    res.send(data);
  });
}

function addMenu(req, res, next) {
  const {
    icon,
    parent_m_id,
    path,
    title,
    keep_alive,
    order,
  } = req.body;
  if (!path || !title || !keep_alive || typeof order === "undefined")
    return res.send({
      msg: "Parameter error",
      status: 1,
    });

  var sql = "insert into menu values(null,?,?,?,?,?,?,'true')";
  const parmas = [parent_m_id || null, title, path, icon || null, keep_alive, order];
  query(sql, parmas, next, function () {
    res.send({
      msg: "The addition is successful, the menu bar needs to be closed and reopened to take effect!",
      status: 0,
    });
  });
}

function addMsg(req, res, next) {
  let userInfo = req.user;
  const { name, description } = req.body;
  if (!name || !description) return res.send({ status: 1, msg: "Parameter error" });
  let sql = "insert into message values(null,?,?,?,?)";
  let params = [
    name,
    description,
    userInfo.username,
    dayjs().format("YYYY-MM-DD HH:ss:mm"),
  ];
  query(sql, params, next, () => res.send({ msg: "Added successfully", status: 0 }));
}

function getPower(req, res, next) {
  let sql =
    "select * from power;show create table power;select * from menu order by menu.`order`;";
  query(sql, null, next, (reslut) => {
    let mapKey = formatCreateTable(reslut[1][0]["Create Table"]);
    let menu = formatMenu(reslut[2]);
    res.send({ status: 0, data: reslut[0], mapKey, menu });
  });
}

function delMenu(req, res, next) {
  let { m_id } = req.body;
  if (!m_id) return res.send({ msg: "Parameter error", status: 1 });
  let sqls = [
    "delete from menu where m_id = ?",
    "delete from menu where parent_m_id = ?",
  ];
  let params = [[m_id], [m_id]];
  transaction(sqls, params, next)
    .then(() => {
      res.send({
        msg: "The operation is successful. The menu bar needs to be closed and reopened to take effect.！",
        status: 0,
      });
    })
    .catch((err) => {
      res.send({ msg: "operation failed", status: 1 });
    });
}

function getMenuInfo(req, res, next) {
  let { m_id } = req.query;
  if (!m_id) return res.send({ msg: "Parameter error", status: 1 });
  let sql = "select * from menu where m_id = ?";
  query(sql, [m_id], next, (result) => {
    if (!result || result.length === 0) {
      return res.send({ msg: "No relevant information found", status: 0 });
    }
    res.send({ status: 0, data: result[0] });
  });
}

function editMenu(req, res, next) {
  const {
    icon = null,
    parent_m_id = null,
    path,
    title,
    keep_alive,
    order,
    m_id,
  } = req.body;
  if (!m_id || !path || !title || !keep_alive || typeof order === "undefined")
    return res.send({ msg: "Parameter error", status: 1 });
  let sql =
    "update menu set icon=?,path=?,title=?,parent_m_id=?,keep_alive=?,`order`=? where m_id=?";
  let params = [icon, path, title, parent_m_id, keep_alive, order, m_id];
  query(sql, params, next, () => {
    res.send({
      status: 0,
      msg: "The modification is successful. The menu bar needs to be closed and reopened to take effect.！",
    });
  });
}

function countIP(req, res, next) {
  let userInfo = req.user;
  let url = req.url;
  let passUrl = ["/login", "/api/react-ant-admin/login"];
  let passNextUrl = ["/getvisitordata", "/getiplist"];
  if (!userInfo && !passUrl.includes(url)) return next(createError(401));
  if (passNextUrl.includes(url)) return next();

  res.on("finish", () => {
    let time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
    let statusCode = res.statusCode;
    console.log("----------");
    console.log(ip, url, time, statusCode);
    console.log("----------");
    let sql = "insert into statistics values(null,?,?,?,?)";
    let params = [ip, url, time, statusCode];
    query(sql, params, function (err) {
      console.log(err);
    });
  });
  next();
}

function getIP(req, res, next) {
  let { page = 1, pagesize = 10 } = req.query;
  if (page < 1 || pagesize < 1) return res.send({ status: 1, msg: "Parameter error" });
  let sql =
    'select SQL_CALC_FOUND_ROWS url,DATE_FORMAT(time,"%Y-%m-%d %H:%i:%S") as time,`status`,CONCAT(LEFT(ip,3),".***.***.***") as ip,s_id from statistics limit ?,?;' +
    "select found_rows() as total;" +
    "show create table statistics;";
  let parmas = [(Number(page) - 1) * pagesize, Number(pagesize)];
  query(sql, parmas, next, function (result) {
    let createStr = result[2][0]["Create Table"];
    let mapKey = formatCreateTable(createStr);
    let list = result[0];
    res.send({
      status: 0,
      data: { list, total: result[1][0].total, mapKey },
    });
  });
}

function getVisitor(req, res, next) {
  let sql =
    "select * ,DATE_FORMAT(time,'%Y-%m-%d %H:%i:%S') as time from statistics";
  query(sql, null, next, function (result) {
    let data = getVistor(result);
    res.send({ status: 0, data });
  });
}

function getUserList(req, res, next) {
  let { page = 1, pagesize = 10, name = "" } = req.query;
  if (Number(page) < 1 || Number(pagesize) < 10)
    return res.send({ msg: "Parameter error，Please try again", status: 1 });
  let sql =
    "select SQL_CALC_FOUND_ROWS u.*, CONCAT('********','') as pswd ,p.`name` as type_id,p.type_id as t_id from user_info as u LEFT JOIN power as p  ON p.type_id=u.type_id  where username like ? limit ?,?;" +
    "select found_rows() as total;" +
    "show create table user_info;";
  let params = [`%${name}%`, (page - 1) * Number(pagesize), Number(pagesize)];
  query(sql, params, next, (result) => {
    let list = result[0];
    let createStr = result[2][0]["Create Table"];
    let mapKey = formatCreateTable(createStr);
    res.send({ status: 0, data: { list, mapKey }, total: result[1][0].total });
  });
}

function getUserInfo(req, res, next) {
  let { user_id } = req.query;
  if (!user_id) return res.send({ msg: "Parameter error，Please try again", status: 1 });
  let sql = "select *, CONCAT('','') as pswd from user_info where user_id = ?";
  let params = [user_id];
  query(sql, params, next, (result) => {
    if (!result || result.length === 0) {
      return res.send({ msg: "User information not found, please check carefully", status: 1 });
    }
    res.send({ status: 0, data: result[0] });
  });
}

function editUser(req, res, next) {
  let { user_id, username, account, pswd, type_id } = req.body;
  if (!user_id || !username || !account || !type_id)
    return res.send({ msg: "Parameter error,Please try again", status: 1 });
  let modifyPswd = Boolean(pswd);
  let sql = modifyPswd
    ? "update user_info set username = ?, account=?, pswd=?, type_id=? where user_id=? "
    : "update user_info set username = ?, account=?, type_id=? where user_id=?";
  let params = modifyPswd
    ? [username, account, pswd, type_id, user_id]
    : [username, account, type_id, user_id];
  query(sql, params, next, (result) => {
    if (result.affectedRows === 1) {
      return res.send({ status: 0, data: null, msg: "Successfully modified" });
    }
    res.send({ status: 1, msg: "Modification failed, please check the submission information" });
  });
}

function addUser(req, res, next) {
  let { username, account, pswd, type_id } = req.body;
  if (!username || !account || !pswd || !type_id)
    return res.send({ msg: "Parameter error,Please try again", status: 1 });
  let sql = "insert into user_info values(null,?,?,?,?)";
  let parmas = [username, account, pswd, type_id];
  query(sql, parmas, next, function (result) {
    if (result.affectedRows === 1) {
      return res.send({ status: 0, data: null, msg: "Added successfully" });
    }
    res.send({ status: 1, msg: "Failed to add user information, please check the submission information" });
  });
}

function editType(req, res, next) {
  let { type_id, name, menu_id } = req.body;
  if (!name || !type_id || !Array.isArray(menu_id))
    return res.send({ msg: "Parameter error,Please try again", status: 1 });
  let sql = "update power set `name`=?,menu_id=? where type_id = ?;";
  let params = [name, menu_id.join(","), type_id];
  query(sql, params, next, (result) => {
    if (result.affectedRows === 1) {
      return res.send({ status: 0, data: null, msg: "Successfully modified" });
    }
    res.send({ status: 1, msg: "Failed to modify permission information, please check the submission information" });
  });
}
function addType(req, res, next) {
  let { name, menu_id } = req.body;
  if (!name || !Array.isArray(menu_id))
    return res.send({ msg: "Parameter error,Please try again", status: 1 });
  let sql = "insert into power values(null,?,?);";
  let params = [name, menu_id.join(",")];
  query(sql, params, next, (result) => {
    if (result.affectedRows === 1) {
      return res.send({ status: 0, data: null, msg: "Added successfully" });
    }
    res.send({ status: 1, msg: "Failed to add permission information, please check the submission information" });
  });
}
function getMenuList(req, res, next) {
  var sql =
    "SELECT  * FROM menu  ORDER BY menu.`order`; " + "show create table menu;";
  query(sql, null, next, (result) => {
    let createStr = result[1][0]["Create Table"];
    let mapKey = formatCreateTable(createStr);
    let data = formatMenu(result[0] || []);
    res.send({ data, mapKey });
  });
}

module.exports = {
  getMsgList,
  login,
  getMenu,
  addMenu,
  addMsg,
  getPower,
  delMenu,
  getMenuInfo,
  editMenu,
  countIP,
  getIP,
  getVisitor,
  getUserList,
  getUserInfo,
  editUser,
  addUser,
  editType,
  addType,
  getMenuList,
};
