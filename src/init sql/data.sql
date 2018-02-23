/*
Navicat MySQL Data Transfer

Source Server         : MYSQL
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : kpi

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2018-02-23 17:31:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for data_dept
-- ----------------------------
DROP TABLE IF EXISTS `data_dept`;
CREATE TABLE `data_dept` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(255) DEFAULT NULL,
  `status` int(255) DEFAULT '1',
  `uid` int(11) DEFAULT '0',
  `order_idx` int(11) DEFAULT NULL,
  `rec_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of data_dept
-- ----------------------------
INSERT INTO `data_dept` VALUES ('1', '部门1', '0', '0', '-1', '2018-02-23 17:30:39', '2018-02-23 17:30:39');
INSERT INTO `data_dept` VALUES ('2', '办公室', '1', '2', '0', '2017-12-13 23:05:45', '2017-12-13 23:05:45');
INSERT INTO `data_dept` VALUES ('3', '信息技术部', '1', '7', '2', '2018-02-23 17:31:14', '2018-02-23 17:31:14');

-- ----------------------------
-- Table structure for data_user
-- ----------------------------
DROP TABLE IF EXISTS `data_user`;
CREATE TABLE `data_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `dept` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT '1',
  `rec_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`,`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of data_user
-- ----------------------------
INSERT INTO `data_user` VALUES ('49', '49', '管理员', '3', '3', '1', '2017-12-18 22:04:38', '2017-12-18 22:04:38');

-- ----------------------------
-- Table structure for data_user_type
-- ----------------------------
DROP TABLE IF EXISTS `data_user_type`;
CREATE TABLE `data_user_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(255) DEFAULT NULL,
  `type_name` varchar(255) DEFAULT NULL,
  `score_ratio` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of data_user_type
-- ----------------------------
INSERT INTO `data_user_type` VALUES ('1', '0', '用户类型1', '2');
INSERT INTO `data_user_type` VALUES ('2', '1', '用户类型2', '1');
INSERT INTO `data_user_type` VALUES ('3', '2', '用户类型3', '0');
INSERT INTO `data_user_type` VALUES ('4', '3', '管理员', '0');

-- ----------------------------
-- View structure for view_score_list
-- ----------------------------
DROP VIEW IF EXISTS `view_score_list`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_score_list` AS select `a`.`task_id` AS `task_id`,`a`.`dept_id` AS `dept_id`,`a`.`is_manage` AS `is_manage`,`a`.`user_dept_id` AS `user_dept_id`,`d`.`dept_name` AS `被评价部门`,`c`.`username` AS `主管领导`,`c`.`id` AS `leader_uid`,`a`.`score_work` AS `工作效果`,`a`.`score_team` AS `团队建设`,`a`.`score_service` AS `服务配合`,`a`.`score_enhance` AS `持续改进`,`a`.`score_sub` AS `总分`,(case when (`a`.`user_dept_id` = 1) then (case when `a`.`is_manage` then 2 else 1 end) else 0 end) AS `ratio` from ((`data_score` `a` join `data_dept` `d` on((`a`.`dept_id` = `d`.`id`))) join `data_user` `c` on((`c`.`id` = `d`.`uid`))) ;

-- ----------------------------
-- View structure for view_score_stat
-- ----------------------------
DROP VIEW IF EXISTS `view_score_stat`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_score_stat` AS select `a`.`task_id` AS `task_id`,`a`.`dept_id` AS `dept_id`,`a`.`被评价部门` AS `被评价部门`,`a`.`主管领导` AS `主管领导`,`a`.`leader_uid` AS `leader_uid`,`a`.`工作效果` AS `工作效果`,`a`.`团队建设` AS `团队建设`,`a`.`服务配合` AS `服务配合`,`a`.`持续改进` AS `持续改进`,`a`.`最高分` AS `最高分`,`a`.`最低分` AS `最低分`,`a`.`算术平均分` AS `算术平均分`,round(`b`.`领导评分`,2) AS `领导评分`,round(`c`.`部门互评`,2) AS `部门互评`,round(((`b`.`领导评分` * 0.8) + (`c`.`部门互评` * 0.2)),2) AS `总分` from ((((select `a`.`task_id` AS `task_id`,`a`.`dept_id` AS `dept_id`,`a`.`被评价部门` AS `被评价部门`,`a`.`主管领导` AS `主管领导`,`a`.`leader_uid` AS `leader_uid`,round(avg(`a`.`工作效果`),2) AS `工作效果`,round(avg(`a`.`团队建设`),2) AS `团队建设`,round(avg(`a`.`服务配合`),2) AS `服务配合`,round(avg(`a`.`持续改进`),2) AS `持续改进`,max(`a`.`总分`) AS `最高分`,min(`a`.`总分`) AS `最低分`,round(avg(`a`.`总分`),3) AS `算术平均分` from `kpi`.`view_score_list` `a` group by `a`.`task_id`,`a`.`dept_id`,`a`.`被评价部门`,`a`.`主管领导`)) `a` join (select `a`.`task_id` AS `task_id`,`a`.`dept_id` AS `dept_id`,`a`.`被评价部门` AS `被评价部门`,(sum((`a`.`总分` * `a`.`ratio`)) / sum(`a`.`ratio`)) AS `领导评分` from `kpi`.`view_score_list` `a` where (`a`.`ratio` > 0) group by `a`.`task_id`,`a`.`dept_id`,`a`.`被评价部门`) `b` on(((`a`.`dept_id` = `b`.`dept_id`) and (`a`.`task_id` = `b`.`task_id`)))) join (select `a`.`task_id` AS `task_id`,`a`.`dept_id` AS `dept_id`,`a`.`被评价部门` AS `被评价部门`,(((sum(`a`.`总分`) - max(`a`.`总分`)) - min(`a`.`总分`)) / (count(0) - 2)) AS `部门互评` from `kpi`.`view_score_list` `a` where (`a`.`ratio` = 0) group by `a`.`task_id`,`a`.`dept_id`,`a`.`被评价部门`) `c` on(((`a`.`dept_id` = `c`.`dept_id`) and (`a`.`task_id` = `c`.`task_id`)))) ;
DROP TRIGGER IF EXISTS `insert_dept`;
DELIMITER ;;
CREATE TRIGGER `insert_dept` BEFORE INSERT ON `data_dept` FOR EACH ROW SET new.rec_time = CURRENT_TIMESTAMP,new.order_idx=(select max(order_idx)+1 from data_dept)
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update_dept`;
DELIMITER ;;
CREATE TRIGGER `update_dept` BEFORE UPDATE ON `data_dept` FOR EACH ROW SET new.update_time = CURRENT_TIMESTAMP
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `insert`;
DELIMITER ;;
CREATE TRIGGER `insert` BEFORE INSERT ON `data_user` FOR EACH ROW SET new.rec_time = CURRENT_TIMESTAMP,new.uid=(select max(id)+1 from data_user)
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `update`;
DELIMITER ;;
CREATE TRIGGER `update` BEFORE UPDATE ON `data_user` FOR EACH ROW SET new.update_time = CURRENT_TIMESTAMP
;;
DELIMITER ;
