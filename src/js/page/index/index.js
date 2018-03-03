import data2file from '../common/exportTable';
import lib from '../common/lib';
import { axios } from '../common/axios';
import select2 from './select2/select2';
import language from './datatable';
import tableApp from '../common/renderTable';
import beautify from 'js-beautify'
import sqlFormatter from './sqlFormatter';

const Clipboard = require('clipboard');

let select2InitFlag = false;
let previewInitFlag = false;
let getDBName = async () => {
    await select2.renderWithUrl('db_id', '2/6119bacd08.json');
}
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
    title: '',
    header: [],
    body: [],
    showTitle: true,
    orientation: 'landscape' // 'portrit'
};

let initStatus = false;

let addApi = async () => {
    // 此处需将空字符，全角问号等全部替换
    let data = {
        api_name: $('#addapi [name="api_name"]').val(),
        db_id: $('#addapi [name="db_id"]').val(),
        sqlstr: $('#addapi [name="sqlstr"]').val(),
        param: $('#addapi [name="param"]').val(),
        tbl: 'sys_api',
        remark: $('#addapi [name="remark"]').val(),
        uid: apps.userInfo.uid
    }
    data.sqlstr = data.sqlstr.replace(/'/g, "\\'");
    // if(data.sqlstr.includes("'")){
    //     lib.tip('查询语句中包含单引号，服务端在数据组装时将报错，请用视图等方式解决该问题。')
    //     return;
    // }

    // 去除无效字符
    data.sqlstr = data.sqlstr.replace(/\s/g, ' ').replace(/  /g, ' ').replace(/？/g, '?').replace(/, /g, ',').replace(/`/g, '').trim();

    // 去除param中数字部分，禁止1=1此类问题出现
    if (data.param != '') {
        let paramData = data.param.split(',');
        data.param = paramData.filter(item => parseInt(item) != item).join(',');
    }

    if (curType) {
        // 更新数据时需加入  condition条件，使用key-value形式，后台自动处理
        data.condition = {
            id: editingData[0],
            uid: apps.userInfo.uid
        };
    }

    await axios({
        data,
        method: curType == addType.NEW ? 'post' : 'put'
    }).then(res => {
        refreshData();
        lib.tip('数据成功' + (curType ? '修改' : '添加'));
    })
    $('[name="remark"]').val('');
}

let initEvent = () => {
    exportConfig.title = 'API列表';
    exportConfig.message = '';
    initExportBtns();
    initEditBtn();

    $('#add').on('click', () => {
        curType = addType.NEW;
        resetNewModal();
    })

    $('#api-saved').on('click', () => {
        $('#addapi').modal('hide');
        addApi();
    })

    $('#reset-tag').on('click', () => {
        $('[name="param"]').tagsinput('removeAll');
    })

    let option = {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        theme: 'material'
    };
    editor = CodeMirror.fromTextArea($("#codeContent")[0], option);
    resultEditor = CodeMirror.fromTextArea($("#result")[0], option);
    editor.setSize('100%', '340px');
    resultEditor.setSize('100%', '340px');
}

let resetNewModal = () => {
    $('#addapi input,#addapi textarea').val('');
    $('#api-saved').text('添加');
    $('#addapi .modal-title').text('新增接口');
    $('[name="param"]').tagsinput('removeAll');
    $('[name="param"]').tagsinput('add', 'tstart,tend');
    if (select2InitFlag) {
        select2.value('db_id', '2');
    }
}

let initEditBtn = () => {
    $('tbody').on('click', 'button[name="edit"]', function () {
        let id = $(this).data('id');
        curType = addType.EDIT;
        editingData = tblData.filter(item => item[0] == id)[0];
        $('#addapi [name="api_name"]').val(editingData[2]);
        select2.value('db_id', editingData[8]);
        // 待调试
        $('#addapi [name="param"]').tagsinput('removeAll');
        $('#addapi [name="param"]').tagsinput('add', editingData[5]);

        $('#addapi [name="sqlstr"]').val(editingData[4].data);
        $('#api-saved').text('更新');
        $('#addapi .modal-title').text('修改接口');
        $('#addapi').modal();
        $('#addapi [name="remark"]').val(editingData[9]);
    })
}

let initDelBtn = () => {
    $('tbody').on('confirmed.bs.confirmation', 'button[name="del"]', function () {
        let id = $(this).data('id');
        // deleteDataFromIdx(id);
        // $(this).parents('tr').remove();
        deleteAPI(id, $(this).data('nonce'));
    });
}

let initCopyBtn = () => {
    var btns = document.querySelectorAll('.copy');
    var clipboard = new Clipboard(btns);
    clipboard.on('success', function (e) {
        lib.tip('调用代码已复制至剪贴板。');
    });
    if (previewInitFlag) {
        return;
    }
    previewInitFlag = true;

    $('tbody').on('click', '[name="preview"]', function () {
        App.scrollTop();
        let url = $(this).data('url') + '&cache=0';
        let surl = $(this).data('surl');
        const urls = [apps.host + url,
        apps.host + surl + '.json?cache=5',
        apps.host + surl + '.html',
        apps.host + surl + '.html?mode=array',
        apps.host + surl + '/array.json',
        apps.host + surl + '/json.json'
        ]
        $('#codeurl').html(urls.join('<br>'));

        const code = $(this).data('clipboard-text');
        let beautyOption = { indent_size: 2, wrap_line_length: 80, jslint_happy: true };
        const codeStr = beautify(code, beautyOption);

        editor.setValue(codeStr);

        if ($(this).data('params').trim().length) {
            const resultStr = beautify(JSON.stringify({
                msg: '该接口中含有额外请求参数，请自行配置参数预览数据'
            }), beautyOption);
            resultEditor.setValue(resultStr);
            return;
        }
        axios({ url }).then(data => {
            const resultStr = beautify(JSON.stringify(data), beautyOption);
            resultEditor.setValue(resultStr);
        })
    })
}

// let deleteDataFromIdx = idx => {
//     let dataIdx = tblData.findIndex(item => item[0] == idx);
//     tblData.splice(dataIdx, 1);
// }

let initExportBtns = () => {
    $('#printpdf').on('click', () => {
        // exportData();
        NProgress.start();
        data2file.pdf(exportConfig, false);
        NProgress.done();
    })
    $('#downloadpdf').on('click', () => {
        NProgress.start();
        data2file.pdf(exportConfig);
        NProgress.done();
    });
    $('#downloadxlsx').on('click', () => {
        NProgress.start();
        data2file.xlsx(exportConfig);
        NProgress.done();
    })
}

let deleteAPI = (id, nonce) => {
    // 参数说明：
    // 此处nonce不是必须，但对sys_api删除时需保证id,nonce,uid一致
    axios({
        method: 'delete',
        data: {
            id,
            nonce,
            uid: apps.userInfo.uid,
            tbl: 'sys_api'
        }
    }).then(res => {
        lib.tip('数据成功删除');
        refreshData();
    })
}

let capitalize = str => str[0].toUpperCase() + str.substr(1, str.length);

let getFucName = sql => {
    let DATA_MODE = sql.split(' ')[0].toLowerCase();
    let tableName = '', prefix = '';
    switch (DATA_MODE) {
        case 'select':
            prefix = 'readFrom';
            tableName = sql.match(/ from(\s+)(\S+)/gi)[0].match(/(\S+)/gi)[1];
            break;
        case 'insert':
            prefix = 'addInto';
            tableName = sql.match(/ into(\s+)(\S+)/gi)[0].match(/(\S+)/gi)[1].split('(')[0].trim();
            break;
        case 'update':
            prefix = 'upateTbl';
            tableName = sql.match(/update(\s+)(\S+)/gi)[0].match(/(\S+)/gi)[1];
            break;
        case 'delete':
            prefix = 'deleteFrom';
            tableName = sql.match(/ from(\s+)(\S+)/gi)[0].match(/(\S+)/gi)[1];
            break;
    }
    return prefix + capitalize(tableName).replace(/"/g, '');
}

const getAjaxDemo = row => {
    const url = `/${row[0]}/${row[3]}.json`;
    let params = row[5].trim();

    let text = `{
                url:'${url}'
            }`
    let queryParam = params.split(',').map(str => `${str}:'${str}'`).join(',\n');
    let isPatchInsert = row[4].includes('insert ') && row[5].includes('values')
    // 批量插入时对参数需做特殊处理
    let preCode = ''

    if (isPatchInsert) {
        let item = row[9].match(/\[\[(\S+)/g)[0].substr(2);
        queryParam = `values`;
        preCode = `
                // 将待插入的数据[{key:value},{key,value}]转换为[value,value]
                let values = formData.map(
                    ({ ${item} }) => [${item}]
                );
                `
    }

    if (params.length) {
        text = `{
                    url:'${url}',
                    params:{${queryParam}},
                }`;
    }

    // 传入参数
    let paramCode = `{${params}}`;
    if (!params.includes(',')) {
        paramCode = isPatchInsert ? 'formData' : params;
    }

    let funcName = getFucName(row[4]);

    // headers及baseURL在axios实例初始化时指定
    // const headers = {
    //     Authorization:'${window.apps.token}'
    // };
    // const baseURL = '${window.apps.host}';
    let remark = '';
    if (row[9].trim().length) {
        remark = '\r\n\t以下参数在建立过程中与系统保留字段冲突，已自动替换:\r\n\t' + (row[9].split('<br>').join('\r\n\t'));
    }
    const copyText = `
\/**
*   @database: { ${row[1]} }
*   @desc:     { ${row[2]} } ${remark}
*\/
let ${funcName} = async (${paramCode})=>{ ${preCode}
    const data = await axios(${text}).then(res=>res.data);
    return data;
};
            `;
    return beautify(copyText, { indent_size: 2, wrap_line_length: 80, jslint_happy: true });
}

let refreshData = () => {
    var option = {
        url: '1/e61799e7ab/array.json',
        params: {
            // id: 1,
            // mode: 'array'
            // nonce: 'e61799e7ab',
            cache: 10
        }
    }
    axios(option).then(res => {
        tblData = res.data;
        res.header[4] = {
            data: res.header[4],
            width: '450px'
        }
        exportConfig.header = ['#', ...res.header];
        exportConfig.body = res.data.map((row, i) => [i + 1, ...row]);

        res.data = res.data.map((row, i) => {
            const copyText = getAjaxDemo(row);
            let btnDel = `<button type="button" name="del" data-toggle="confirmation" data-original-title="确认删除本接口?" data-singleton="true" data-btn-ok-label="是" data-btn-cancel-label="否" data-id="${row[0]}" data-nonce="${row[3]}" class="btn red-haze btn-sm">删除</button>`;
            let btnEdit = `<button type="button" name="edit" data-id="${row[0]}" class="btn blue-steel btn-sm">编辑</button>`;
            let btnCopy = `<button type="button" name="preview" data-params="${row[5]}" data-url="?id=${row[0]}&nonce=${row[3]}" data-surl="${row[0]}/${row[3]}" class="btn btn-sm copy ${row[5] == '' ? 'green-jungle' : ''}" data-clipboard-text="${copyText}">调用代码</button>`;

            row.push(btnEdit + btnDel + btnCopy);

            row[4] = {
                data: row[4],
                class: "break"
            }

            return row;
        });
        initDatatable(res);
        resetNewModal();
    })
}


let table = null;
let initDatatable = res => {
    if (initStatus) {
        table.fnDestroy();
    }

    tableApp.render(res);

    if (res.rows == 0) {
        $('#printpdf').parent().hide();
        return;
    }
    $('#printpdf').parent().show();
    table = $('.result-content .table').dataTable({
        language,
        destroy: true,
        "columnDefs": [
            {
                "targets": [5],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [3],
                "visible": false
            },
            {
                "targets": [9],
                "visible": false
            }
        ],
        "autoWidth": false,
        "lengthMenu": [
            [5, 10, 15, 20, 50, 100, -1],
            [5, 10, 15, 20, 50, 100, "所有"] // change per page values here
        ],
        order: [
            [1, 'desc']
        ],
        "bOrder": false,
        "bProcessing": true,
        "bStateSave": true,
        "bScrollInfinite": true,
        searchHighlight: true, //高亮
        "pageLength": 10,
        "initComplete": function (settings) {
            var api = this.api();
            api.on("click", 'tbody td', function () {
                const text = $(this).text().toLowerCase();
                if (text.includes('select') || text.includes('.json')) {
                    return;
                }
                if ($(this).find('button').length == 0) {
                    api.search(this.innerText.trim()).draw();
                }
            });
            initDelBtn();
            initCopyBtn();
            initStatus = true;
        }
    });
}

const initAddPanel = () => {
    $('[name="api-parse"]').on('click', function () {
        let $dom = $(this);
        let mode = $dom.data('mode');
        let sqlstr = $('#addapi [name="sqlstr"]').val();
        if (!sqlFormatter.validateStr(sqlstr)) {
            return;
        }
        const sqlSetting = sqlFormatter[mode](sqlstr);
        // 自动添加参数
        $('[name="param"]').tagsinput('removeAll');
        $('[name="param"]').tagsinput('add', sqlSetting.params.join(','));
        $('#addapi [name="sqlstr"]').val(sqlSetting.sql);
        if (typeof sqlSetting.remarkList == 'undefined') {
            sqlSetting.remarkList = []
        }
        $('[name="remark"]').val(sqlSetting.remarkList.join('<br>'));
    })
}

let init = async () => {
    initEvent();
    refreshData();
    await getDBName();
    initAddPanel();
    select2.init();
    select2InitFlag = true;
    $('.bootstrap-tagsinput').css('width', '85%');
}
export default {
    init
}