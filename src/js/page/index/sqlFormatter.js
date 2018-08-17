import lib from "../common/lib";
import R from "ramda";
let systemVariants = [{
        name: "id",
        desc: "api 索引序号"
    },
    {
        name: "nonce",
        desc: "接口唯一字符串变量"
    },
    {
        name: "callback",
        desc: "jsonp 回调参数的命名"
    },
    {
        name: "cache",
        desc: "接口缓存时长"
    },
    {
        name: "api_auth_id",
        desc: "API作者ID"
    },
    {
        name: "mode",
        desc: "数据返回模式，array|object两种，默认array传输更少的数据。"
            // }, {
            // 	name: 'values',
            // 	desc: '数据批量插入时所用的参数，格式为[object,object],objtct表示需要插入的每一项数据。'
    },
    {
        name: 'blob',
        desc: "指定哪些字段是二进数据，array|string。<br>例如在json输出的数据格式中，blob = ['img_data'] 时，img_data将会被base64编码;<br>在array输出时，blob=[5]时，每项数据的第5项将会被base64编码。<br><br>示例url:<br>api.example.com/171/994d3ec6b8/5.json?blob[]=img_data<br>api.example.com/171/994d3ec6b8/5?mode=array&blob[]=5<br>api.example.com/api/172/521dfce816.json?cache=5&blob[]=ErrImage1&blob[]=ErrImage2&blob[]=ErrImage3"
    }
];
const validParam = _param => {
    let param = _param.toLowerCase().trim();

    let msg = R.filter(R.propEq("name", param), systemVariants);

    if (msg.length) {
        return {
            desc: msg[0].desc,
            disabled: true,
            name: param
        };
    }
    return {
        disabled: false,
        name: param
    };
};

const strHandler = str =>
    str
    .trim()
    .replace(/\n/g, " ")
    .replace(/\r/g, " ")
    .replace(/\s/g, " ")
    .replace(/  /g, " ");
const validateStr = str => str.toUpperCase().split("SELECT").length - 1 == 1;
const preHandler = str => {
    str = strHandler(str);
    str = str
        .toLowerCase()
        .replace("select ", "")
        .split("group")[0]
        .split("having")[0]
        .split("order by")[0]
        .trim();
    let sql = str.split("from ");
    let columns = sql[0]
        .split(",")
        .map(item => (item.includes(".") ? item.split(".")[1] : item));
    let tableName = sql[1].trim().split(" ")[0];
    let whereInfo = sql[1].split("where");

    if (whereInfo.length > 1) {
        let where = whereInfo[1]
            .replace(/ \>/g, ">")
            .replace(/ \</g, "<")
            .replace(/ \=/g, "=")
            .replace(/  /g, " ");
        where = where
            .replace(/\> /g, ">")
            .replace(/\< /g, "<")
            .replace(/\= /g, "=")
            .trim()
            .split(" ");

        whereInfo = where.map(item => {
            let whereItem = item.match(/(\S+)=|(\S+)>|(\S+)</);
            return whereItem == null ? item : whereItem[0] + "?";
        });
    } else {
        whereInfo = [];
    }
    whereInfo.map((item, idx) => {
        if (item == "between") {
            whereInfo[idx + 1] = "?";
            whereInfo[idx + 3] = "?";
        }
    });

    let safeCondition = [];
    let safeConditionRemark = [];
    // let queryConditionList = whereInfo.map(item => {
    // 	let _val = item.split('=')[0].split('<')[0].split('>')[0];
    // 	let val;
    // 	if (_val.includes('.')) {
    // 		val = _val.split('.')[1].trim()
    // 	} else {
    // 		val = _val.trim();
    // 	}
    // 	if (['and', 'or', 'between'].includes(val)) {
    // 		return;
    // 	}
    // 	let sItem = validParam(val);
    // 	safeCondition.push(sItem.disabled ? ('_' + val) : val)
    // 	if (sItem.disabled) {
    // 		safeConditionRemark.push(`@${val}:_${val}. 参数说明：${sItem.desc}`)
    // 	}
    // 	return val;
    // }).filter(item => typeof item != 'undefined');

    let queryConditionList = [];
    whereInfo
        .filter(item => !["and", "or", "between", "?"].includes(item))
        .forEach(item => {
            if (item.includes("?")) {
                queryConditionList.push(item);
            } else {
                queryConditionList = queryConditionList.concat([
                    item + "1",
                    item + "2"
                ]);
            }
        });

    queryConditionList.map(item => {
        let _val = item
            .split("=")[0]
            .split("<")[0]
            .split(">")[0];
        let val;
        if (_val.includes(".")) {
            val = _val.split(".")[1].trim();
        } else {
            val = _val.trim();
        }
        let sItem = validParam(val);
        safeCondition.push(sItem.disabled ? "_" + val : val);
        if (sItem.disabled) {
            safeConditionRemark.push(`@${val}:_${val}. 参数说明：${sItem.desc}`);
        }
        return val;
    });
    console.log(queryConditionList);
    let paramsRemark = [];
    let params = columns.map(column => {
        let item = validParam(column);
        let paramName = item.disabled ? "_" + column : column;
        if (item.disabled) {
            paramsRemark.push(`@${column}:_${column}. 参数说明：${item.desc}`);
        }
        return paramName.replace(/`/g, "").replace(/ /g, "");
    });

    return {
        paramsRemark, // 字段转换说明
        params, // 转换后的字段列表
        columns, // 原字段列表

        tableName,
        where: whereInfo,
        condition: queryConditionList,
        safeCondition,
        safeConditionRemark
    };
};

const insert = str => {
    let sql = preHandler(str);
    let values = sql.columns.map(item => "?").join(",");
    return {
        sql: `insert into ${sql.tableName}(${sql.columns.join(
      ","
    )}) values (${values})`.replace(/  /g, " "),
        params: sql.params,
        remarkList: sql.paramsRemark
    };
};

const insertPatch = str => {
    let sql = preHandler(str);
    let values = sql.columns.map(item => "?").join(",");
    return {
        sql: `insert into ${sql.tableName}(${sql.columns.join(
      ","
    )}) values ?`.replace(/  /g, " "),
        params: ["values"],
        columns: sql.columns,
        remarkList: [
            `@desc:批量插入数据时，约定使用二维数组values参数，格式为[{${sql.columns.join(
        ","
      )}}]，数组的每一项表示一条数据`
        ]
    };
};

const update = str => {
    let sql = preHandler(str);
    let setInfo = sql.columns.map(item => `${item} = ?`).join(",");
    sql.where = sql.where.map(
        item => (item.includes(".") ? item.split(".")[1] : item)
    );
    let whereStr = sql.where.length == 0 ? "" : " where " + sql.where.join(" ");
    if (sql.where.length == 0) {
        lib.tip(
            "更新数据时未加入where条件做限制，可能会造成数据被批量更新的风险，请谨慎操作。"
        );
    }
    return {
        sql: `update ${sql.tableName} set ${setInfo} ${whereStr}`.replace(
            /  /g,
            " "
        ),
        params: sql.params.concat(sql.safeCondition),
        remarkList: sql.paramsRemark.concat(sql.safeConditionRemark)
    };
};

const _delete = str => {
    let sql = preHandler(str);
    let setInfo = sql.columns.map(item => `${item} = ?`).join(",");
    sql.where = sql.where.map(
        item => (item.includes(".") ? item.split(".")[1] : item)
    );
    let whereStr = sql.where.length == 0 ? "" : " where " + sql.where.join(" ");
    if (sql.where.length == 0) {
        lib.tip(
            "删除数据时未加入where条件做限制，可能会造成数据被批量删除的风险，请谨慎操作。"
        );
    }
    return {
        sql: `delete from  ${sql.tableName} ${whereStr}`,
        params: sql.safeCondition,
        remarkList: sql.safeConditionRemark
    };
};

const query = str => {
    str = strHandler(str).toLowerCase();
    let sql = preHandler(str);
    let preSelect = str.split(" where")[0];
    let appendSelect = str.split(" group ");
    if (appendSelect.length > 1) {
        appendSelect = " group " + appendSelect[1];
    } else {
        appendSelect = "";
    }
    let whereStr = sql.where.length == 0 ? "" : " where " + sql.where.join(" ");

    return {
        sql: `${preSelect} ${whereStr} ${appendSelect}`.replace(/  /g, " "),
        params: sql.safeCondition,
        remarkList: sql.safeConditionRemark
    };
};

export default {
    insert,
    update,
    _delete,
    query,
    insertPatch,
    validateStr,
    systemVariants
};