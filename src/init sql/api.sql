/*
Navicat MySQL Data Transfer

Source Server         : MYSQL
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : api

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2017-11-24 15:43:39
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sys_api
-- ----------------------------
DROP TABLE IF EXISTS `sys_api`;
CREATE TABLE `sys_api` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `db_id` int(10) unsigned zerofill DEFAULT '0000000001',
  `api_name` varchar(255) DEFAULT NULL,
  `nonce` varchar(255) DEFAULT NULL,
  `sqlstr` text,
  `param` varchar(255) DEFAULT NULL,
  `rec_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_api
-- ----------------------------
INSERT INTO `sys_api` VALUES ('1', '0000000001', ' 接口列表', 'e61799e7ab', 'SELECT a.id, b.db_name 数据库, a.api_name 接口名称, a.nonce, a.sqlstr 查询语句, ( CASE WHEN isnull(a.param) THEN \'\' ELSE a.param END ) 查询参数, a.rec_time 建立时间, a.update_time 最近更新, a.db_id FROM sys_api a INNER JOIN sys_database b on a.db_id = b.id WHERE a.id >2', '', '2017-07-30 03:07:37', '2017-11-24 02:39:56');
INSERT INTO `sys_api` VALUES ('2', '0000000001', '数据库列表', '6119bacd08', 'SELECT a.id,a.db_name text FROM sys_database AS a', null, '2017-11-24 00:49:19', '2017-11-24 00:55:09');

-- ----------------------------
-- Table structure for sys_database
-- ----------------------------
DROP TABLE IF EXISTS `sys_database`;
CREATE TABLE `sys_database` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `db_name` varchar(255) DEFAULT NULL,
  `db_key` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_database
-- ----------------------------
INSERT INTO `sys_database` VALUES ('1', '接口管理', 'db1');
INSERT INTO `sys_database` VALUES ('2', '业务数据', 'db2');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `psw` varchar(255) NOT NULL,
  `rec_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
DROP TRIGGER IF EXISTS `api_nonce`;
DELIMITER ;;
CREATE TRIGGER `api_nonce` BEFORE INSERT ON `sys_api` FOR EACH ROW set new.nonce = substring(MD5(RAND()*100),1,10)
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `api_rectime`;
DELIMITER ;;
CREATE TRIGGER `api_rectime` BEFORE INSERT ON `sys_api` FOR EACH ROW SET new.rec_time = CURRENT_TIMESTAMP,new.update_time = CURRENT_TIMESTAMP
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `api_update`;
DELIMITER ;;
CREATE TRIGGER `api_update` BEFORE UPDATE ON `sys_api` FOR EACH ROW SET new.update_time = CURRENT_TIMESTAMP
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `user_rectime`;
DELIMITER ;;
CREATE TRIGGER `user_rectime` BEFORE INSERT ON `sys_user` FOR EACH ROW SET new.rec_time = CURRENT_TIMESTAMP
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update_psw`;
DELIMITER ;;
CREATE TRIGGER `update_psw` BEFORE INSERT ON `sys_user` FOR EACH ROW SET new.psw = MD5(concat('wMqSakbLdy9t8LLD',new.psw))
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `user_updatetime`;
DELIMITER ;;
CREATE TRIGGER `user_updatetime` BEFORE UPDATE ON `sys_user` FOR EACH ROW SET new.update_time = CURRENT_TIMESTAMP
;;
DELIMITER ;
