import lib from '../common/lib';

const strHandler = str => str.trim().replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\s/g, ' ');
const validateStr = str => str.toUpperCase().split('SELECT').length - 1 == 1;
const preHandler = str => {
	str = strHandler(str);
	str = str.toLowerCase().replace('select ', '').split('group')[0].split('having')[0].split('order')[0].trim();

	let sql = str.split('from ');
	let columns = sql[0].split(',').map(item => item.includes('.') ? item.split('.')[1] : item);
	let tableName = sql[1].trim().split(' ')[0];
	let whereInfo = sql[1].split('where');
	if (whereInfo.length > 1) {
		let where = whereInfo[1].replace(/ \>/g,'>').replace(/ \</g,'<').replace(/ \=/g,'=').replace(/  /g,' ');
    where = where.replace(/\> /g,'>').replace(/\< /g,'<').replace(/\= /g,'=').trim().split(' ')
    whereInfo = where.map(item => {
			if (item.includes('=')) {
				let val = item.split('=');
				val[1] = '?';
				return val.join(' = ');
			}else if(item.includes('>')) {
				let val = item.split('>');
				val[1] = '?';
				return val.join(' > ');
			}else if(item.includes('<')) {
				let val = item.split('<');
				val[1] = '?';
				return val.join(' < ');
			}
			// and or 等字符
			return item;
		})
	} else {
		whereInfo = [];
	}
  
  let queryConditionList = whereInfo.map(item=>{
    let val = item.split('=')[0].split('<')[0].split('>')[0]
    if(val.includes('.')){
      return val.split('.')[1].trim()
    }
    return val.trim();
  })

	return {
		columns,
		tableName,
		where:whereInfo,
    condition:queryConditionList
	}
}

const insert = str => {
	let sql = preHandler(str);
	let values = sql.columns.map(item => '?').join(',');
	return {
		sql: `insert into ${sql.tableName}(${sql.columns.join(',')}) values (${values})`.replace(/  /g,' '),
		params: sql.columns
	};
}

const update = str => {
	let sql = preHandler(str);
	let setInfo = sql.columns.map(item => `${item} = ?`).join(',');
	let whereStr = sql.where.length == 0 ? '' : ' where ' + sql.where.join(' ');
	if (sql.where.length == 0) {
		lib.tip('更新数据时未加入where条件做限制，可能会造成数据被批量更新的风险，请谨慎操作。');
	}
	return {
		sql: `update ${sql.tableName} set ${setInfo} ${whereStr}`.replace(/  /g,' '),
		params: sql.columns.concat(sql.condition)
	}
};

const _delete = str => {
	let sql = preHandler(str);
	let setInfo = sql.columns.map(item => `${item} = ?`).join(',');
	let whereStr = sql.where.length == 0 ? '' : ' where ' + sql.where.join(' ');
	if (sql.where.length == 0) {
		lib.tip('删除数据时未加入where条件做限制，可能会造成数据被批量删除的风险，请谨慎操作。');
	}
	return {
		sql: `delete from  ${sql.tableName} ${whereStr}`,
		params: sql.condition
	}
}

const query = str => {
  str = strHandler(str).toLowerCase();
	let sql = preHandler(str);
	let preSelect = str.split(' where')[0];
	let appendSelect = str.split(' group ');
	if (appendSelect.length>1) {
		appendSelect = ' group ' + appendSelect[1];
	} else {
		appendSelect = '';
	}
	let whereStr = sql.where.length == 0 ? '' : ' where ' + sql.where.join(' ');

	return {
		sql: `${preSelect} ${whereStr} ${appendSelect}`.replace(/  /g,' '),
		params: sql.condition
	}
}

export default {
	insert,
	update,
	_delete,
	query,
  validateStr
}