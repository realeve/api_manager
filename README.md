# api_manager

api manager for ...

# install

cnpm install

# develop

gulp

# update package

cnpm install -g npm-check
npm-check -u

# 更新内容

## 2019-02-26

```sql
-- id:1
SELECT a.id, b.db_name 数据库, a.api_name 接口名称, a.nonce, a.sqlstr 查询语句, ( CASE WHEN isnull(a.param) THEN '' ELSE a.param END ) 查询参数, a.rec_time 建立时间, a.update_time 最近更新, a.db_id,a.remark,uid,c.fullname username FROM sys_api a INNER JOIN sys_database b on a.db_id = b.id inner join sys_user c on a.uid=c.id WHERE a.id >3 order by a.id desc
```
