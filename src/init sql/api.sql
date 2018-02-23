/*
Navicat MySQL Data Transfer

Source Server         : MYSQL
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : api

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2018-02-23 17:31:57
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sys_api
-- ----------------------------
DROP TABLE IF EXISTS `sys_api`;
CREATE TABLE `sys_api` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `db_id` int(10) unsigned zerofill DEFAULT '0000000001',
  `uid` int(11) DEFAULT NULL,
  `api_name` varchar(255) DEFAULT NULL,
  `nonce` varchar(255) DEFAULT NULL,
  `sqlstr` text,
  `param` varchar(255) DEFAULT NULL,
  `rec_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_api
-- ----------------------------
INSERT INTO `sys_api` VALUES ('1', '0000000001', '49', ' 接口列表', 'e61799e7ab', 'SELECT a.id, b.db_name 数据库, a.api_name 接口名称, a.nonce, a.sqlstr 查询语句, ( CASE WHEN isnull(a.param) THEN \'\' ELSE a.param END ) 查询参数, a.rec_time 建立时间, a.update_time 最近更新, a.db_id FROM sys_api a INNER JOIN sys_database b on a.db_id = b.id WHERE a.id >3 order by a.id desc', '', '2017-07-30 03:07:37', '2017-12-18 00:33:27');
INSERT INTO `sys_api` VALUES ('2', '0000000001', '49', '数据库列表', '6119bacd08', 'SELECT a.id,a.db_name text FROM sys_database AS a', '', '2017-11-24 00:49:19', '2017-12-18 00:33:27');
INSERT INTO `sys_api` VALUES ('3', '0000000001', '49', '数据库列表', 'e4e497e849', 'select id,db_name 数据库名,db_key 配置项键值 from sys_database', '', '2017-11-24 16:02:10', '2017-12-18 00:33:27');
INSERT INTO `sys_api` VALUES ('4', '0000000002', '49', '用户类型列表', 'dc2861d656', 'SELECT type_id value,type_name name FROM data_user_type a ORDER BY 1', '', '2017-11-27 00:41:18', '2017-12-18 00:33:27');
INSERT INTO `sys_api` VALUES ('6', '0000000002', '49', '用户列表', 'f150045a94', 'SELECT a.id,a.username,a.type_id,a.dept,(case when isnull(c.dept_name) then \'无\' else c.dept_name end) dept_name,a.status,(case when a.status =1 then \'激活\' else \'注销\' end) status_name,b.type_name FROM data_user a LEFT JOIN data_user_type b on a.type_id = b.type_id LEFT JOIN data_dept c on a.dept = c.id order by a.status desc,a.id', '', '2017-12-07 21:51:36', '2017-12-18 00:33:27');
INSERT INTO `sys_api` VALUES ('7', '0000000002', '49', '部门列表', '6f77963c65', 'SELECT a.id value ,a.dept_name name,a.status,a.uid FROM data_dept a order by a.order_idx', '', '2017-12-08 00:16:44', '2017-12-18 00:33:27');
INSERT INTO `sys_api` VALUES ('14', '0000000002', '49', '用户基本信息', '78473cfd9b', 'SELECT a.id,a.type_id,dept FROM `data_user` a where uid = ? and status=1', 'uid', '2017-12-11 09:47:10', '2017-12-18 00:33:27');
INSERT INTO `sys_api` VALUES ('18', '0000000001', '49', '更新密码', '63bc967cec', 'update sys_user set psw =? where id =? and psw=MD5(concat(\'wMqSakbLdy9t8LLD\',?))', 'new,uid,old', '2017-12-18 02:10:47', '2017-12-18 02:11:12');
INSERT INTO `sys_api` VALUES ('19', '0000000001', '49', '用户登录', '209a76b78d', 'select id from sys_user where id =? and psw=MD5(concat(\'wMqSakbLdy9t8LLD\',?))', 'uid,psw', '2017-12-18 02:50:11', '2017-12-18 02:50:11');
INSERT INTO `sys_api` VALUES ('20', '0000000003', '49', 'orcl测试', 'cfa450c2d0', 'select * from \"tbl_user\" a where a.\"id\"=3', '', '2018-01-28 17:50:48', '2018-02-23 10:39:38');
INSERT INTO `sys_api` VALUES ('21', '0000000004', '49', 'mssql测试', 'e0db8c647f', 'select * from tblApi a where a.id=1', '', '2018-01-30 00:11:04', '2018-02-23 14:55:47');

-- ----------------------------
-- Table structure for sys_database
-- ----------------------------
DROP TABLE IF EXISTS `sys_database`;
CREATE TABLE `sys_database` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `db_name` varchar(255) DEFAULT NULL,
  `db_key` varchar(255) DEFAULT NULL,
  `db_type` varchar(255) DEFAULT NULL,
  `db_host` varchar(255) DEFAULT NULL,
  `db_username` varchar(255) DEFAULT NULL,
  `db_password` varchar(255) DEFAULT NULL,
  `db_port` varchar(255) DEFAULT NULL,
  `db_database` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_database
-- ----------------------------
INSERT INTO `sys_database` VALUES ('1', '接口管理', 'db1', 'mysql', '127.0.0.1', 'root', 'root', '3306', 'api');
INSERT INTO `sys_database` VALUES ('2', '用户数据', 'db2', 'mysql', '127.0.0.1', 'root', 'root', '3306', 'kpi');
INSERT INTO `sys_database` VALUES ('3', 'oracle测试', 'db4', 'orcl', '127.0.0.1', 'orcl', 'orcl', '1521', 'ORCL');
INSERT INTO `sys_database` VALUES ('4', 'mssql测试', 'db3', 'mssql', '127.0.0.1', 'sa', '123', '1433', 'api');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `psw` varchar(255) NOT NULL,
  `rec_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('49', 'develop', '管理员张三', '11c292b26e7ca9b11ab892ef8627ea63', '2018-02-23 17:16:08', '2018-02-23 17:16:08');
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
DROP TRIGGER IF EXISTS `insert`;
DELIMITER ;;
CREATE TRIGGER `insert` BEFORE INSERT ON `sys_user` FOR EACH ROW SET new.psw = MD5(concat('wMqSakbLdy9t8LLD',new.psw)),new.rec_time = CURRENT_TIMESTAMP
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update`;
DELIMITER ;;
CREATE TRIGGER `update` BEFORE UPDATE ON `sys_user` FOR EACH ROW if new.psw<>old.psw then
   SET new.psw = MD5(concat('wMqSakbLdy9t8LLD',new.psw)),new.update_time = CURRENT_TIMESTAMP;
else
  SET new.update_time = CURRENT_TIMESTAMP;
end if
;;
DELIMITER ;
