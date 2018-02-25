import lib from '../common/lib';
import R from 'ramda';

const validParam = _param => {
	let param = _param.toLowerCase().trim();
	let systemVariants =
		[{
			name: 'id',
			desc: 'api 索引序号'
		}, {
			name: 'nonce',
			desc: '接口唯一字符串变量'
		}, {
			name: 'callback',
			desc: 'jsonp 回调参数的命名'
		}, {
			name: 'cache',
			desc: '接口缓存时长'
		}, {
			name: 'api_auth_id',
			desc: 'API作者ID'
		}, {
			name: 'mode',
			desc: '数据返回模式，array|object两种，默认array传输更少的数据。'
		}];
	let msg = R.filter(R.propEq('name', param), systemVariants)
	if (msg.length) {
		return {
			desc: msg[0].desc,
			disabled: true,
			name: param
		}
	}
	return {
		disabled: false,
		name: param
	}
}

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
		let where = whereInfo[1].replace(/ \>/g, '>').replace(/ \</g, '<').replace(/ \=/g, '=').replace(/  /g, ' ');
		where = where.replace(/\> /g, '>').replace(/\< /g, '<').replace(/\= /g, '=').trim().split(' ')

		whereInfo = where.map(item => {
			if (item.includes('=')) {
				let val = item.split('=');
				val[1] = '?';
				return val.join(' = ');
			} else if (item.includes('>')) {
				let val = item.split('>');
				val[1] = '?';
				return val.join(' > ');
			} else if (item.includes('<')) {
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

	let safeCondition = [];
	let safeConditionRemark = [];
	let queryConditionList = whereInfo.map(item => {
		let _val = item.split('=')[0].split('<')[0].split('>')[0];
		let val;
		if (_val.includes('.')) {
			val = _val.split('.')[1].trim()
		} else {
			val = _val.trim();
		}
		if (['and', 'or', 'between'].includes(val)) {
			return;
		}
		let sItem = validParam(val);
		safeCondition.push(sItem.disabled ? ('_' + val) : val)
		if (sItem.disabled) {
			safeConditionRemark.push(`@${val}:_${val}. 参数说明：${sItem.desc}`)
		}
		return val;
	}).filter(item => typeof item != 'undefined');

	let paramsRemark = [];
	let params = columns.map(column => {
		let item = validParam(column);
		let paramName = item.disabled ? ('_' + column) : column;
		if (item.disabled) {
			paramsRemark.push(`@${column}:_${column}. 参数说明：${item.desc}`)
		}
		return paramName;
	})

	return {
		paramsRemark, // 字段转换说明
		params, // 转换后的字段列表
		columns, // 原字段列表

		tableName,
		where: whereInfo,
		condition: queryConditionList,
		safeCondition,
		safeConditionRemark
	}
}

const insert = str => {
	let sql = preHandler(str);
	let values = sql.columns.map(item => '?').join(',');
	return {
		sql: `insert into ${sql.tableName}(${sql.columns.join(',')}) values (${values})`.replace(/  /g, ' '),
		params: sql.params,
		remarkList: sql.remarkList
	}
}

const update = str => {
	let sql = preHandler(str);
	let setInfo = sql.columns.map(item => `${item} = ?`).join(',');
	let whereStr = sql.where.length == 0 ? '' : ' where ' + sql.where.join(' ');
	if (sql.where.length == 0) {
		lib.tip('更新数据时未加入where条件做限制，可能会造成数据被批量更新的风险，请谨慎操作。');
	}
	return {
		sql: `update ${sql.tableName} set ${setInfo} ${whereStr}`.replace(/  /g, ' '),
		params: sql.params.concat(sql.safeCondition),
		remarkList: sql.paramsRemark.concat(sql.safeConditionRemark)
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
		params: sql.safeCondition,
		remarkList: sql.safeConditionRemark
	}
}

const query = str => {
	str = strHandler(str).toLowerCase();
	let sql = preHandler(str);
	let preSelect = str.split(' where')[0];
	let appendSelect = str.split(' group ');
	if (appendSelect.length > 1) {
		appendSelect = ' group ' + appendSelect[1];
	} else {
		appendSelect = '';
	}
	let whereStr = sql.where.length == 0 ? '' : ' where ' + sql.where.join(' ');

	return {
		sql: `${preSelect} ${whereStr} ${appendSelect}`.replace(/  /g, ' '),
		params: sql.safeCondition,
		remarkList: sql.safeConditionRemark
	}
}

export default {
	insert,
	update,
	_delete,
	query,
	validateStr
}