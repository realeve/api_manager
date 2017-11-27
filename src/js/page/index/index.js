import data2file from '../common/exportTable';
import lib from '../common/lib';
import { axios } from '../common/axios';

import select2 from './select2/select2';
import language from './datatable';

import tableApp from '../common/renderTable';

let getDBName = async() => {
    await select2.renderWithUrl('db_id', '?id=2&mode=object&nonce=6119bacd08&cache=0');
}

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

let addApi = async() => {
    // 此处需将空字符，全角问号等全部替换
    let data = {
        api_name: $('#addapi [name="api_name"]').val(),
        db_id: $('#addapi [name="db_id"]').val(),
        sqlstr: $('#addapi [name="sqlstr"]').val(),
        param: $('#addapi [name="param"]').val(),
        tbl: 'sys_api',
        uid: apps.userInfo.uid
    }

    // 去除无效字符
    data.sqlstr = data.sqlstr.replace(/\s/g, ' ').replace(/  /g, ' ').replace(/？/g, '?').replace(/, /g, ',').trim();

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
}

let initEvent = () => {
    exportConfig.title = 'API列表';
    exportConfig.message = '';
    initExportBtns();
    initEditBtn();

    $('tbody').on('click', '[name="preview"]', function() {
        let url = $(this).data('url') + '&cache=5';
        axios({ url }).then(data => {
            lib.alert({ text: "调用url: " + apps.host + url });
            lib.alert({
                text: '返回结果:<br><br>' + JSON.stringify(data), //.replace(/,/g, ',<br>').replace(/{/g, '{<br>').replace(/}/g, '<br>}').replace(/\[/g, '<br>[')
                type: 1
            })
        })
    })

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

}

let resetNewModal = () => {
    $('#addapi input,#addapi textarea').val('');
    select2.value('db_id', '2');
    $('#api-saved').text('添加');
    $('#addapi .modal-title').text('新增接口');
    $('[name="param"]').tagsinput('removeAll');
    $('[name="param"]').tagsinput('add', 'tstart,tend');
}

let initEditBtn = () => {
    $('tbody').on('click', 'button[name="edit"]', function() {
        let id = $(this).data('id');
        curType = addType.EDIT;
        editingData = tblData.filter(item => item[0] == id)[0];
        $('#addapi [name="api_name"]').val(editingData[2]);
        select2.value('db_id', editingData[8]);
        // 待调试
        $('#addapi [name="param"]').tagsinput('removeAll');
        $('#addapi [name="param"]').tagsinput('add', editingData[5]);

        $('#addapi [name="sqlstr"]').val(editingData[4]);
        $('#api-saved').text('更新');
        $('#addapi .modal-title').text('修改接口');
        $('#addapi').modal();
    })
}

let initDelBtn = () => {
    $('tbody').on('confirmed.bs.confirmation', 'button[name="del"]', function() {
        let id = $(this).data('id');
        // deleteDataFromIdx(id);
        // $(this).parents('tr').remove();
        deleteAPI(id, $(this).data('nonce'));
    });
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

let refreshData = () => {
    var option = {
        // method: 'get',
        params: {
            id: 1,
            mode: 'array',
            nonce: 'e61799e7ab',
            cache: 10
        }
    }
    axios(option).then(res => {
        tblData = res.data;
        exportConfig.header = ['#', ...res.header];
        exportConfig.body = res.data.map((row, i) => [i + 1, ...row]);

        res.data = res.data.map((row, i) => {
            let btnDel = `<button type="button" name="del" data-toggle="confirmation" data-original-title="确认删除本接口?" data-singleton="true" data-btn-ok-label="是" data-btn-cancel-label="否" data-id="${row[0]}" data-nonce="${row[3]}" class="btn red-haze btn-sm">删除</button>`;
            let btnEdit = `<button type="button" name="edit" data-id="${row[0]}" class="btn blue-steel btn-sm">编辑</button>`;
            let btnPreview = `<button type="button" name="preview" data-url="?id=${row[0]}&nonce=${row[3]}" class="btn btn-sm">预览</button>`;
            row.push(btnEdit + btnDel + (row[5].trim() == '' ? btnPreview : ''));
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
        "initComplete": function(settings) {
            var api = this.api();
            api.on("click", 'tbody td', function() {
                if ($(this).find('button').length == 0) {
                    api.search(this.innerText.trim()).draw();
                }
            });
            initDelBtn();
            initStatus = true;
        }
    });
}

let init = async() => {
    initEvent();
    refreshData();
    await getDBName();
    select2.init();
}
export default {
    init
}