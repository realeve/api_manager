import data2file from '../common/exportTable';
import lib from '../common/lib';
import { axios } from '../common/axios';

import select2 from './select2/select2';

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


let initEvent = () => {
    exportConfig.title = 'API列表';
    exportConfig.message = '';
    initExportBtns();
    initEditBtn();

    $('#add').on('click', () => {
        curType = addType.NEW;
        resetNewModal();
    })
}

let resetNewModal = () => {
    $('#addapi input,#addapi textarea').val('');
    select2.value('db_id', ' ');
    $('#api-saved').text('添加');
}

let initEditBtn = () => {
    $('tbody').on('click', 'button[name="edit"]', function() {
        let id = $(this).data('id');
        curType = addType.EDIT;
        editingData = tblData.filter(item => item[0] == id)[0];

        $('#addapi [name="api_name"]').val(editingData[2]);
        select2.value('db_id', editingData[8]);
        $('#addapi [name="param"]').val(editingData[5]);
        $('#addapi [name="sql"]').val(editingData[4]);
        $('#api-saved').text('更新');

        $('#addapi').modal();
    })
}

let initDelBtn = () => {
    $('tbody').on('confirmed.bs.confirmation', 'button[name="del"]', function() {
        let id = $(this).data('id');
        deleteDataFromIdx(id);
        deleteAPI(id, $(this).data('nonce'));
        $(this).parents('tr').remove();
    });
}

let deleteDataFromIdx = idx => {
    let dataIdx = tblData.findIndex(item => item[0] == idx);
    tblData.splice(dataIdx, 1);
}

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
    let url = `delete.json?id=${id}&nonce=${nonce}&tbl=sys_api`;
    axios({
        url
    }).then(res => {
        lib.tip('数据成功删除')
    })

}

let refreshData = () => {
    var dataUrl = '?id=1&mode=array&nonce=e61799e7ab&cache=0';

    var option = {
        url: dataUrl,
        method: 'get'
    }
    axios(option).then(res => {
        // lib.tips({
        //     text: '查询完毕',
        //     delay: 5,
        //     type: 2
        // })
        tblData = res.data;
        renderTable(res);
    })
}

let renderTable = res => {
    if (res.rows == 0) {
        $('.result-content tbody').html('<tr><td class="text-center">未查询到数据</td></tr>');
        return;
    }
    exportConfig.header = ['#', ...res.header];
    exportConfig.body = [];

    let header = res.header.map(item => `<th>${item}</th>`);
    $('.result-content thead').html(`<tr>${header.join('')}<th class="operator">操作</th></tr>`);
    renderTBody();
    initDelBtn();
}

let renderTBody = () => {
    let strs = tblData.map((row, i) => {
        exportConfig.body.push([i + 1, ...row]);
        let trStr = row.map(item => `<td>${item}</td>`).join('');
        let btnDel = `<button type="button" name="del" data-toggle="confirmation" data-original-title="确认删除本接口?" data-singleton="true" data-btn-ok-label="是" data-btn-cancel-label="否" data-id="${row[0]}" data-nonce="${row[3]}" class="btn red-haze btn-sm">删除</button>`;
        let btnEdit = `<button type="button" name="edit" data-id="${row[0]}" class="btn blue-steel btn-sm">编辑</button>`;
        return `<tr>${trStr}<td>${btnEdit}${btnDel}</td></tr>`;
    })

    $('.result-content tbody').html(strs.join(''));
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