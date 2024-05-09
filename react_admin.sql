/*
Navicat Premium Data Transfer

Source Server         : localhost_3306
Source Server Type    : MySQL
Source Server Version : 50624
Source Host           : localhost:3306
Source Schema         : react_admin

Target Server Type    : MySQL
Target Server Version : 50624
File Encoding         : 65001

Date: 16/11/2023 09:50:10
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

------------------------------
--Table structure for menu
------------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `m_id` int(8) NOT NULL AUTO_INCREMENT COMMENT 'menu id',
  `parent_m_id` int(8) NULL DEFAULT NULL COMMENT 'Parent menu id',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'Menu name',
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'menu path',
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'menu icon',
  `keep_alive` enum('true','false') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT 'Whether the page maintains state',
  `order` int(8) NOT NULL COMMENT 'Menu sorting',
  `show` enum('true','false') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'true' COMMENT 'Whether to show on the menu',
  PRIMARY KEY (`m_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

------------------------------
--Records of menu
------------------------------
INSERT INTO `menu` VALUES (1, NULL, 'System Management', '/power', 'icon_set', 'true', 10000, 'true');
INSERT INTO `menu` VALUES (2, NULL, 'List', '/list', 'icon_list', 'true', 1, 'true');
INSERT INTO `menu` VALUES (3, NULL, 'Results page', '/result', 'icon_voiceprint', 'true', 5, 'true');
INSERT INTO `menu` VALUES (4, NULL, 'form page', '/form', 'icon_form', 'true', 3, 'true');
INSERT INTO `menu` VALUES (5, NULL, 'Details page', '/details', 'icon_edit', 'true', 3, 'true');
INSERT INTO `menu` VALUES (6, NULL, 'statistics', '/statistics', 'icon_MTR', 'true', 4, 'true');
INSERT INTO `menu` VALUES (7, NULL, 'Icon library', '/icons', 'icon_bluray', 'true', 10, 'true');
INSERT INTO `menu` VALUES (8, 1, 'Menu management', '/menu', 'icon_menu', 'true', 1475, 'true');
INSERT INTO `menu` VALUES (9, 1, 'Permission Category', '/type', 'icon_safety', 'true', 12, 'true');
INSERT INTO `menu` VALUES (10, 1, 'User Management', '/user', 'icon_infopersonal', 'true', 1593, 'true');
INSERT INTO `menu` VALUES (11, 6, 'visitor statistics', '/visitor', 'icon_addresslist', 'true', 2, 'true');
INSERT INTO `menu` VALUES (12, 6, 'Feedback Statistics', '/feedback', 'icon_feeding', 'true', 1, 'true');
INSERT INTO `menu` VALUES (13, 2, 'card list', '/card', NULL, 'false', 5485, 'true');
INSERT INTO `menu` VALUES (14, 2, 'query list', '/search', NULL, 'false', 9588, 'true');
INSERT INTO `menu` VALUES (15, 3, '403', '/403', 'icon_locking', 'false', 0, 'true');
INSERT INTO `menu` VALUES (16, 3, '404', '/404', 'icon_close', 'false', 1, 'true');
INSERT INTO `menu` VALUES (17, 3, '500', '/500', 'icon_privacy_closed', 'false', 4568, 'true');
INSERT INTO `menu` VALUES (18, 5, 'Personal Center', '/person', 'icon_infopersonal', 'false', 9998, 'true');
INSERT INTO `menu` VALUES (19, 4, 'base form', '/index', NULL, 'false', 9654, 'true');

------------------------------
--Table structure for message
------------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `m_id` int(8) NOT NULL AUTO_INCREMENT COMMENT 'message id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Message name',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'message descriptor',
  `creator` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'founder',
  `add_time` datetime NULL DEFAULT NULL COMMENT 'Creation time',
  PRIMARY KEY (`m_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

------------------------------
--Records of message
------------------------------
INSERT INTO `message` VALUES (1, 'first message', 'Day One Message I Created', 'super administrator', '2021-04-20 17:01:09');
INSERT INTO `message` VALUES (2, 'RegExp', 'The RegExp object represents a regular expression, which is a powerful tool for performing pattern matching on strings. ', 'super administrator', '2021-04-20 17:48:42');
INSERT INTO `message` VALUES (3, 'Ant Design', 'antd 是基于 Ant Design 设计体系的 React UI 组件库，主要用于研发企业级中后台产品。', '超级管理员', '2021-04-20 17:46:44');
INSERT INTO `message` VALUES (4, 'react-ant-admin', 'This framework is used for secondary development. The front-end framework uses react, the UI framework uses ant-design, global data state management uses redux, and the ajax library is axios. Used to quickly build middle and backend pages.', 'super administrator', '2021-04-20 17:28:45');

------------------------------
--Table structure for power
------------------------------
DROP TABLE IF EXISTS `power`;
CREATE TABLE `power`  (
  `type_id` int(4) NOT NULL AUTO_INCREMENT COMMENT 'Permission id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'Permission abbreviation',
  `menu_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Show menu list id',
  PRIMARY KEY (`type_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

------------------------------
--Records of power
------------------------------
INSERT INTO `power` VALUES (1, 'super administrator', '2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,9,1');
INSERT INTO `power` VALUES (2, 'user', '11,2,7,6,17,18,16,3,4,5,13,14,15,19,12');
INSERT INTO `power` VALUES (3, 'tourist', '2,7,18,13,14,5');
INSERT INTO `power` VALUES (4, 'low-power tourist', '2,13,14,7');

------------------------------
--Table structure for statistics
------------------------------
DROP TABLE IF EXISTS `statistics`;
CREATE TABLE `statistics`  (
  `s_id` int(8) NOT NULL AUTO_INCREMENT COMMENT 'Request serial number',
  `ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'IP address',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Request address',
  `time` datetime NULL DEFAULT NULL COMMENT 'Request time',
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Http status code',
  PRIMARY KEY (`s_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 134 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

------------------------------
--Records of statistics
------------------------------
------------------------------
--Table structure for user_info
------------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `user_id` int(8) NOT NULL AUTO_INCREMENT COMMENT 'userid',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'username',
  `account` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'Login account',
  `pswd` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'login password',
  `type_id` int(4) NOT NULL COMMENT 'User rights',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `uq_account`(`account`) USING BTREE,
  INDEX `fk_type`(`type_id`) USING BTREE,
  CONSTRAINT `fk_type_id` FOREIGN KEY (`type_id`) REFERENCES `power` (`type_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

------------------------------
--Records of user_info
------------------------------
INSERT INTO `user_info` VALUES (1, 'Classmate Zhang', 'admin', 'admin123', 1);
INSERT INTO `user_info` VALUES (2, 'Wang Wu', 'user', 'user123', 2);
INSERT INTO `user_info` VALUES (4, 'John Doe', 'qq123456', 'qq123456', 3);
INSERT INTO `user_info` VALUES (5, 'passing rat', 'jake', 'jake123', 4);

SET FOREIGN_KEY_CHECKS = 1;
