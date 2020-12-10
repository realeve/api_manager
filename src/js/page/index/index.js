import data2file from "../common/exportTable";
import lib from "../common/lib";
import { axios } from "../common/axios";
import select2 from "./select2/select2";
import language from "./datatable";
import tableApp from "../common/renderTable";
import beautify from "js-beautify";
import sqlFormatter from "./sqlFormatter";
import moment from "../../plugins/moment";
import { saveAs } from "file-saver";

const Clipboard = require("clipboard");

let select2InitFlag = false;
let previewInitFlag = false;
let getDBName = async () => {
  await select2.renderWithUrl("db_id", "2/6119bacd08.json");
};
let editor, resultEditor;
let addType = {
  NEW: 0,
  EDIT: 1
};

let curType = addType.NEW;
// 原始数据
let tblData = [];
// 编辑中数据;
let editingData = [];

let exportConfig = {
  title: "",
  header: [],
  body: [],
  showTitle: true,
  orientation: "landscape" // 'portrit'
};

let initStatus = false;

let addApi = async () => {
  // 此处需将空字符，全角问号等全部替换
  let data = {
    api_name: $('#addapi [name="api_name"]').val(),
    db_id: $('#addapi [name="db_id"]').val(),
    sqlstr: $('#addapi [name="sqlstr"]').val(),
    param: $('#addapi [name="param"]').val(),
    tbl: "sys_api",
    remark: $('#addapi [name="remark"]').val(),
    uid: apps.userInfo.uid
  };
  data.sqlstr = data.sqlstr.replace(/'/g, "\\'");
  // if(data.sqlstr.includes("'")){
  //     lib.tip('查询语句中包含单引号，服务端在数据组装时将报错，请用视图等方式解决该问题。')
  //     return;
  // }

  // 去除无效字符
  data.sqlstr = data.sqlstr
    .replace(/\s/g, " ")
    .replace(/  /g, " ")
    .replace(/？/g, "?")
    .replace(/, /g, ",")
    .replace(/`/g, "")
    .trim();

  // 去除param中数字部分，禁止1=1此类问题出现
  if (data.param != "") {
    let paramData = data.param.split(",");
    data.param = paramData.filter(item => parseInt(item) != item).join(",");
  }

  if (curType === addType.EDIT) {
    // 更新数据时需加入  condition条件，使用key-value形式，后台自动处理
    data.condition = {
      id: editingData[0],
      uid: apps.userInfo.uid
    };
    data.update_time = lib.now();
  } else {
    data.rec_time = lib.now();
  }

  // 201901， 前台执行时间更新操作

  await axios({
    data,
    method: curType == addType.NEW ? "post" : "put"
  }).then(res => {
    refreshData();
    lib.tip("数据成功" + (curType ? "修改" : "添加"));
  });
  $('[name="remark"]').val("");
};

let initEvent = () => {
  exportConfig.title = "API列表";
  exportConfig.message = "";
  initExportBtns();
  initEditBtn();

  $("#add").on("click", () => {
    curType = addType.NEW;
    resetNewModal();
  });

  $("#api-saved").on("click", () => {
    $("#addapi").modal("hide");
    addApi();
  });

  $("#reset-tag").on("click", () => {
    $('[name="param"]').tagsinput("removeAll");
  });

  let option = {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    theme: "material"
  };
  editor = CodeMirror.fromTextArea($("#codeContent")[0], option);
  resultEditor = CodeMirror.fromTextArea($("#result")[0], option);
  editor.setSize("100%", "780px");
  resultEditor.setSize("100%", "480px");

  // 公共代码
  CodeMirror.fromTextArea($("#publicCode")[0], option).setSize("100%", "120px");
};

let resetNewModal = () => {
  $("#addapi input,#addapi textarea").val("");
  $("#api-saved").text("添加");
  $("#addapi .modal-title").text("新增接口");
  $('[name="param"]').tagsinput("removeAll");
  $('[name="param"]').tagsinput("add", "tstart,tend");
  if (select2InitFlag) {
    select2.value("db_id", "1");
  }
};

let initEditBtn = () => {
  let curUID = apps.userInfo.uid;
  $("tbody").on("click", 'button[name="edit"]', function() {
    let id = $(this).data("id");
    curType = addType.EDIT;
    editingData = tblData.filter(item => item[0] == id)[0];
    $('#addapi [name="api_name"]').val(editingData[2]);

    select2.value("db_id", editingData[8]);

    // 待调试
    $('#addapi [name="param"]').tagsinput("removeAll");
    $('#addapi [name="param"]').tagsinput("add", editingData[5]);

    $('#addapi [name="sqlstr"]').val(editingData[4].data);
    $("#api-saved").text("更新");
    $("#addapi .modal-title").text("修改接口");
    $("#addapi").modal();
    $('#addapi [name="remark"]').val(editingData[9]);

    if (curUID == $(this).data("uid")) {
      $("#api-saved").show();
    } else {
      $("#api-saved").hide();
    }
  });
};

let initDelBtn = () => {
  $("tbody").on("confirmed.bs.confirmation", 'button[name="del"]', function() {
    let id = $(this).data("id");
    // deleteDataFromIdx(id);
    // $(this).parents('tr').remove();
    deleteAPI(id, $(this).data("nonce"));
  });
};

let initCopyBtn = () => {
  var btns = document.querySelectorAll(".copy");
  var clipboard = new Clipboard(btns);
  clipboard.on("success", function(e) {
    lib.tip("调用代码已复制至剪贴板。");
  });
  if (previewInitFlag) {
    return;
  }
  previewInitFlag = true;

  $("tbody").on("click", '[name="preview"]', function() {
    App.scrollTop();

    const code = $(this).data("clipboard-text");
    let beautyOption = {
      indent_size: 2,
      wrap_line_length: 80,
      jslint_happy: true
    };
    let codeStr = beautify(code, beautyOption);

    const codePost = $(this).data("post-mode");

    const postModeStr = beautify(codePost, beautyOption);
    const codeNodeStr = codeStr
      .replace("export const ", "module.exports.")
      .replace("/**", "/** NodeJS服务端调用：\n*");

    codeStr +=
      +"\n\r\n\r" +
      postModeStr.replace("/**", "\n\r/** 数据量较大时建议使用post模式：\n*") +
      "\n\r\n\r" +
      codeNodeStr;

    editor.setValue(
      `import { axios, IAxiosState, AxiosError, DEV, mock, _commonData } from '@/utils/axios'; 
import useFetch,{IFetchState} from '@/utils/useFetch';\r\n
` + codeStr.replace("});0", "});")
    );

    let url = $(this).data("url") + "&cache=0";
    let surl = $(this).data("surl");
    const urls = [
      '<a target="_blank" href="http://10.8.2.133:8000/table#id=' +
        surl +
        '&daterange=9">http://10.8.2.133:8000/table#id=' +
        surl +
        "&daterange=9</a><br/>",
      "默认参数，cache[缓存]0,mode[数据格式]json：",
      apps.host + url + "&mode=json&data_type=json",

      apps.host + surl + ".json?cache=5",

      "<br>url第三段为数值时表示缓存，默认json，需要返回数组时加mode参数",
      apps.host + surl + "/5.html?mode=array",
      apps.host + surl + "/5.html",

      "<br>url后缀表示数据类型:设为xml时以xml返回，否则以json返回，设为array时json数据项将转换为数组而非对象。后缀也可设为.html,.jpg，默认以json的形式输出：",
      apps.host + surl,
      apps.host + surl + ".json",
      apps.host + surl + ".array",
      apps.host + surl + ".xml",
      apps.host + surl + ".html",
      apps.host + surl + ".jpg",
      apps.host + surl + "/5.xml"
    ];

    $("#codeurl").html(urls.join("<br>"));
    let curParam = $(this)
      .data("params")
      .trim();
    let paramLen = curParam.split(",").length;
    let haveParam = curParam.length && paramLen > 0;

    if (haveParam && paramLen == 2) {
      haveParam =
        $(this)
          .data("params")
          .replace(/ /g, "") != "tstart,tend";
    }

    if (haveParam) {
      const resultStr = beautify(
        JSON.stringify({
          msg: "该接口中含有额外请求参数，请自行配置参数预览数据"
        }),
        beautyOption
      );
      resultEditor.setValue(resultStr);
      return;
    }

    let jsonFileName =
      $(this)
        .data("surl")
        .replace("/", "_") + ".json";
    axios({
      url,
      params: {
        tstart: moment()
          .subtract(3, "days")
          .format("YYYYMMDD"),
        tend: lib.ymd()
      }
    }).then(data => {
      const resultStr = beautify(JSON.stringify(data), beautyOption);
      resultEditor.setValue(resultStr);
      const blob = new Blob([resultStr], { type: "text/plain;charset=utf-8" });
      saveAs(blob, jsonFileName);
    });
  });
};

// let deleteDataFromIdx = idx => {
//     let dataIdx = tblData.findIndex(item => item[0] == idx);
//     tblData.splice(dataIdx, 1);
// }

let initExportBtns = () => {
  $("#printpdf").on("click", () => {
    // exportData();
    NProgress.start();
    data2file.pdf(exportConfig, false);
    NProgress.done();
  });
  $("#downloadpdf").on("click", () => {
    NProgress.start();
    data2file.pdf(exportConfig);
    NProgress.done();
  });
  $("#downloadxlsx").on("click", () => {
    NProgress.start();
    data2file.xlsx(exportConfig);
    NProgress.done();
  });
};

let deleteAPI = (id, nonce) => {
  // 参数说明：
  // 此处nonce不是必须，但对sys_api删除时需保证id,nonce,uid一致
  axios({
    method: "delete",
    data: {
      id,
      nonce,
      uid: apps.userInfo.uid,
      tbl: "sys_api"
    }
  }).then(res => {
    lib.tip("数据成功删除");
    refreshData();
  });
};

let capitalize = str =>
  (str[0].toUpperCase() + str.substr(1, str.length)).replace(/"/g, "");
let handleTableName = str => {
  str = str.toLowerCase().replace(/\[|\]/g, "");
  if (str.includes("@")) {
    let [_t, _db] = str.split("@");
    str = _t + "From" + capitalize(_db);
  }
  str = str.includes(".") ? str.split(".")[1] : str;
  let tblName = capitalize(str);
  tblName = tblName.replace(/Data/g, "").replace(/Tbl/g, "");
  let strList = tblName
    .split("_")
    .map(item => (item.length ? capitalize(item) : ""));
  return strList.join("");
};

let getFucName = (sql, isPatchInsert) => {
  let DATA_MODE = sql.split(" ")[0].toLowerCase();

  let tableName = "",
    prefix = "";
  switch (DATA_MODE) {
    case "select":
      prefix = "get";
      tableName = sql.match(/ from(\s+)(\S+)/gi);

      tableName =
        tableName == null
          ? "dual"
          : tableName[tableName.length - 1].match(/(\S+)/gi)[1];
      break;
    case "insert":
      prefix = "add";
      tableName = sql
        .match(/ into(\s+)(\S+)/gi)[0]
        .match(/(\S+)/gi)[1]
        .split("(")[0]
        .trim();
      break;
    case "replace":
      prefix = "replace";
      tableName = sql
        .match(/ into(\s+)(\S+)/gi)[0]
        .match(/(\S+)/gi)[1]
        .split("(")[0]
        .trim();
      break;
    case "update":
      prefix = isPatchInsert ? "sets" : "set";
      tableName = sql.match(/update(\s+)(\S+)/gi)[0].match(/(\S+)/gi)[1];
      break;
    case "delete":
      prefix = "del";
      tableName = sql.match(/ from(\s+)(\S+)/gi)[0].match(/(\S+)/gi)[1];
      break;
    case "call":
      prefix = "call";
      tableName = sql.split(" ")[1].split("(")[0];
      break;
    case "declare":
      prefix = "call";
      tableName = sql
        .split("select ")[1]
        .split(" ")[0]
        .replace(/@/, "");
      break;
    case "exec":
    case "execute":
      prefix = "call";
      tableName = sql.split(" ")[1].split("@")[0];
      break;
    case "with":
    default:
      if (["http://", "https:/"].includes(sql.substr(0, 7))) {
        prefix = "proxy";
        tableName = sql
          .match(/:\/\/([a-zA-Z0-9.]+)/)[1]
          .replace(/www\.|\.com/g, "")
          .replace(/\./g, "_");
        break;
      }
      prefix = "get";
      tableName = 1;
      try {
        tableName = (sql.match(/ from(\s+)(\S+)/gi) || ["dual"])[0].match(
          /(\S+)/gi
        )[1];
      } catch (e) {
        console.log(e);
        console.log("解析出错", sql);
        tableName = "UnknownTable";
      }
      break;
  }

  return {
    funcName: prefix + handleTableName(tableName),
    mode: DATA_MODE
  };
};

const getAjaxDemo = (row, postMode = false) => {
  const url = `/${row[0]}/${row[3]}.json`;
  row[5] = row[5] || "";
  row[4] = row[4] || "";
  let params = row[5]
    .trim()
    .replace(/\n/g, " ")
    .replace(/\r/g, " ")
    .replace(/,/g, ", ");

  let text = `{
              url: DEV ? ${fileName} : '${url}',
            }`;
  let textFetch = "";

  let queryParam = params; //.split(',').map(str => `${str}:'${str}'`).join(',');
  let isPatchInsert = row[4].includes("insert ") && row[5].includes("values");

  // 传入参数
  let paramCode = `{ ${params} }`;
  if (!params.includes(",")) {
    paramCode = isPatchInsert ? "formData" : params;
  }

  let { funcName, mode } = getFucName(row[4], isPatchInsert);

  let asyncText, paramText;
  let param = ("" + params).split(",");
  switch (param.length) {
    case 1:
      if (param[0] == "values") {
        var detail = (row[9].match(/\[(\s|\S)+\]/g) || [""])[0]
          .replace(/\[|\|\{|\}]/g, "")
          .split(",");

        if (detail.length == 0) {
          paramText = `(${param[0]}:{})=>Promise<IAxiosState>`;
        } else {
          paramText = `({${detail
            .map(item => `${item}:string;`)
            .join(" ")}})=>Promise<IAxiosState>`;
        }
      } else {
        paramText =
          param[0] === ""
            ? "()=>Promise<IAxiosState>"
            : `(${param[0]}:string)=>Promise<IAxiosState>`;
      }

      asyncText = param[0] === "" ? "()" : `${param[0]}`;
      break;
    default:
      asyncText = "params";
      paramText = `(params:{${params
        .replace(/ /g, "")
        .split(",")
        .map(item => `${item}:string;`)
        .join("\r\n")}})=>Promise<IAxiosState>`;
      break;
  }

  // 调用文件
  let fileName = `'@/mock/${row[0]}_${row[3]}.json'`;

  // 返回通用数据
  // console.log(row[4].split(' ')[0].toUpperCase())
  let notSelectMode = ["UPDATE", "INSERT", "DELETE"].includes(
    row[4].split(" ")[0].toUpperCase()
  );
  if (notSelectMode) {
    fileName = "_commonData";
  }

  let assignInfo = `export const ${funcName}:${paramText} = ${asyncText} => axios`;
  let fetchAssignInfo = `export const ${funcName}:${paramText} = ${asyncText} => fetch`; // DEV ? mock(${fileName}) :

  // 批量插入时对参数需做特殊处理
  if (isPatchInsert) {
    asyncText = "values";
    // let item = row[9].match(/\[\[(\S+)/g)[0].substr(2);
    queryParam = `values`;
    text = `{
            method:'post',
            data:{values,id:${row[0]},nonce:'${row[3]}'},
        }`;
  }

  if (params.length && !isPatchInsert) {
    if (param.length > 1) {
      text = `{
          url: DEV ? ${fileName} : '${url}',
          params,
      }`;
    } else {
      text = `{
        url: DEV ? ${fileName} : '${url}',
          params:{${param[0]}},
      }`;
    }
  }

  if (postMode) {
    let decodeStr = "";
    switch (asyncText) {
      case "params":
        decodeStr = "...params,";
        break;
      case "()":
        decodeStr = "";
        break;
      default:
        decodeStr = asyncText + ",";
        break;
    }

    text =
      decodeStr.length > 0
        ? `{
            method:'post',
            data:{
                ${decodeStr}
                id:${row[0]},
                nonce:'${row[3]}'
            },
        }`
        : `{
            method:'post',
            data:{
                id:${row[0]},
                nonce:'${row[3]}'
            },
        }`;

    textFetch = `{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
          id:${row[0]},
          nonce:'${row[3]}',
          ${decodeStr}
        }),
    }`;
  }

  let remark = "";
  if (row[9].trim().length > 0) {
    remark =
      "\r\n\t以下参数在建立过程中与系统保留字段冲突，已自动替换:\r\n\t" +
      row[9].split("<br>").join("\r\n\t");
  }

  let tipInfo = `
\/**
*   @database: { ${row[1]} }
*   @desc:     { ${isPatchInsert ? "批量" : ""}${row[2]} } ${remark}`;

  let copyText = `${tipInfo}*\/
    ${assignInfo}(${text});
`;

  let tipInfoFetch = `
\/**
*   fetch post模式
*   @database: { ${row[1]} }
*   @desc:     { ${isPatchInsert ? "批量" : ""}${row[2]} } ${remark}`;

  let preCode = "";

  // 写入数据的模式
  let isWriteMode = ["set", "add", "del"].includes(funcName.slice(0, 3));
  let thenStr = isWriteMode
    ? `.then(({ data: [{ affected_rows }] }: IAxiosState) => (affected_rows as number) > 0)`
    : "";

  // const ${paramCode} = params;
  if (!isPatchInsert) {
    if (params.length > 0 && params.includes(",")) {
      copyText = `

        ${tipInfo} 
*\/
      ${assignInfo}(${text})${thenStr};  
      `;
    } else {
      copyText = `

      ${tipInfo}
    *\/
    ${assignInfo}(${text})${thenStr};`;
    }
  }

  if (postMode) {
    let decodeStr = "";
    switch (asyncText) {
      case "params":
        decodeStr = "?${qs.stringify(params)}";
        break;
      case "()":
        decodeStr = "";
        break;
      default:
        decodeStr = `?\${qs.stringify({\${asyncText}})}`;
        break;
    }

    copyText += `   
    \/**
    *   useFetch (React hooks)
    *   @database: { ${row[1]} }
    *   @desc:     { ${isPatchInsert ? "批量" : ""}${row[2]} } ${remark}
    *   useFetch 返回值说明： data(返回数据), error(报错), loading(加载状态), reFetch(强制刷新),setData(强制设定数据) 
    *\/ 
    const res: IFetchState = useFetch({
      param: {
        url: \`${url}\`,
        params: ${!params.includes(",") ? `{ ${params} }` : paramCode},
      },
    });
    // valid:()=>true , // params中指定参数存在时才发起请求
    // callback:e=>e,// 数据回调

    ${tipInfoFetch}
    const ${paramCode} = params;
    *\/
    ${fetchAssignInfo}
    ('${apps.host}api',${textFetch})
    .then(res=>res.json())${thenStr}; 
    
    \/**
*   fetch get模式
*   @database: { ${row[1]} }
*   @desc:     { ${isPatchInsert ? "批量" : ""}${row[2]} } ${remark}
*   const ${paramCode} = params;
*\/
    ${fetchAssignInfo}
    (\`${apps.host}api${url}${decodeStr}\`)
    .then(res=>res.json())${thenStr}; 
    `;
  }

  copyText = copyText.replace(" 0);0", " 0);");
  return beautify(copyText, {
    indent_size: 2,
    wrap_line_length: 80,
    jslint_happy: true
  });
};

let refreshData = () => {
  var option = {
    url: "1/e61799e7ab/array"
  };
  let curUid = window.apps.userInfo.uid;

  axios(option).then(res => {
    tblData = res.data.map(item => {
      item[8] = parseInt(item[8], 10);
      return item;
    });

    res.header[4] = {
      data: res.header[4],
      width: "450px"
    };
    exportConfig.header = ["#", ...res.header];
    exportConfig.body = res.data.map((row, i) => [i + 1, ...row]);

    res.data = res.data.map((row, i) => {
      const copyText = getAjaxDemo(row);
      const postMode = getAjaxDemo(row, true);
      // console.log(row, curUid, row[10]);
      let btnDel =
        curUid != row[10]
          ? ""
          : `<button type="button" name="del" data-toggle="confirmation" data-original-title="确认删除本接口?" data-singleton="true" data-btn-ok-label="是" data-btn-cancel-label="否" data-id="${
              row[0]
            }" data-nonce="${
              row[3]
            }" class="btn red-haze btn-sm">删除</button>`;
      let btnEdit = `<button type="button" name="edit" data-uid="${
        row[10]
      }" data-id="${row[0]}" class="btn blue-steel btn-sm">编辑</button>`;
      let btnCopy = `<button type="button" name="preview" data-params="${
        row[5]
      }" data-url="?id=${row[0]}&nonce=${row[3]}" data-surl="${row[0]}/${
        row[3]
      }" class="btn btn-sm copy ${
        row[5] == "" || row[5] == "tstart,tend" ? "green-jungle" : ""
      }" data-clipboard-text="${copyText}" data-post-mode="${postMode}">调用代码</button>`;

      row.push(btnEdit + btnDel + btnCopy);

      row[4] = {
        data: row[4].replace(/\\'/g, "'"),
        class: "break"
      };

      return row;
    });
    initDatatable(res);
    resetNewModal();
  });
};

let table = null;
let initDatatable = res => {
  if (initStatus) {
    table.fnDestroy();
  }

  tableApp.render(res);

  if (res.rows == 0) {
    $("#printpdf")
      .parent()
      .hide();
    return;
  }
  $("#printpdf")
    .parent()
    .show();
  table = $(".result-content .table").dataTable({
    language,
    destroy: true,
    columnDefs: [
      {
        targets: [10],
        visible: false,
        searchable: false,
        sortable: 0
      },
      {
        targets: [9],
        visible: false,
        searchable: false,
        sortable: 0
      },
      {
        targets: [8],
        visible: false,
        searchable: false,
        sortable: 0
      },
      {
        targets: [5],
        visible: false,
        searchable: false
      },
      {
        targets: [3],
        visible: false
      }
    ],
    autoWidth: false,
    lengthMenu: [
      [5, 10, 15, 20, 50, 100, -1],
      [5, 10, 15, 20, 50, 100, "所有"] // change per page values here
    ],
    order: [[1, "desc"]],
    bOrder: false,
    bProcessing: true,
    bStateSave: true,
    bScrollInfinite: true,
    searchHighlight: true, //高亮
    pageLength: 10,
    initComplete: function(settings) {
      var api = this.api();

      initDelBtn();

      api.on("click", "tbody td", function() {
        const text = $(this)
          .text()
          .toLowerCase();
        if (text.includes("select") || text.includes(".json")) {
          return;
        }
        if ($(this).find("button").length == 0) {
          api.search(this.innerText.trim()).draw();
        }
      });
      initCopyBtn();
      initStatus = true;
    }
  });
};

const initAddPanel = () => {
  $('[name="api-parse"]').on("click", function() {
    let $dom = $(this);
    let mode = $dom.data("mode");
    let sqlstr = $('#addapi [name="sqlstr"]').val();
    if (!sqlFormatter.validateStr(sqlstr)) {
      return;
    }
    const sqlSetting = sqlFormatter[mode](sqlstr);
    // 自动添加参数
    $('[name="param"]').tagsinput("removeAll");
    $('[name="param"]').tagsinput("add", sqlSetting.params.join(","));
    $('#addapi [name="sqlstr"]').val(sqlSetting.sql);
    if (typeof sqlSetting.remarkList == "undefined") {
      sqlSetting.remarkList = [];
    }
    $('[name="remark"]').val(sqlSetting.remarkList.join("<br>"));
  });
};

const renderDefaultParam = () => {
  $("#defaultParam").html(
    sqlFormatter.systemVariants
      .map(
        ({ name, desc }) =>
          `<p><span class="bold margin-right-10">${name}:</span>${desc}</p>`
      )
      .join("")
  );
};

let init = async () => {
  initEvent();
  refreshData();
  await getDBName();
  initAddPanel();
  select2.init();
  select2InitFlag = true;
  $(".bootstrap-tagsinput").css("width", "85%");
  renderDefaultParam();

  lib.tip(
    '使用文档全新上线，<a href="./doc/" target="_blank">点击菜单栏或这里</a>即可浏览',
    1,
    30
  );
};
export default {
  init
};
