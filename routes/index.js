var express = require("express");
var router = express.Router();
const reactAdmin = require("../module");

router.use(reactAdmin.countIP);
router.get("/getmessage", reactAdmin.getMsgList);
router.post("/login", reactAdmin.login);
router.get("/getmenu", reactAdmin.getMenu);
router.get("/getmenulist", reactAdmin.getMenuList);
router.post("/addmenu", reactAdmin.addMenu);
router.post("/addmessage", reactAdmin.addMsg);
router.get("/getpower", reactAdmin.getPower);
router.post("/delmenu", reactAdmin.delMenu);
router.get("/getmenuinfo", reactAdmin.getMenuInfo);
router.post("/editmenuinfo", reactAdmin.editMenu);
router.get("/getiplist", reactAdmin.getIP);
router.get("/getvisitordata", reactAdmin.getVisitor);
router.get("/getuserlist", reactAdmin.getUserList);
router.get("/getuserinfo", reactAdmin.getUserInfo);
router.post("/edituserinfo", reactAdmin.editUser);
router.post("/adduserinfo", reactAdmin.addUser);
router.post("/edittype", reactAdmin.editType);
router.post("/addtype", reactAdmin.addType);
module.exports = router;