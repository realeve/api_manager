import data2file from '../common/exportTable';
import lib from '../common/lib';
import { axios } from '../common/axios';
let exportConfig = {
    title: '',
    header: [],
    body: [],
    showTitle: true,
    orientation: 'landscape' // 'portrit'
};

let tblData = [];

let initEvent = () => {
    exportConfig.title = 'API列表';
    exportConfig.message = '';
    initExportBtns();
    initEditBtn();
}

let initEditBtn = () => {
    $('tbody').on('click', 'button[name="edit"]', function() {
        let id = $(this).data('id');
        lib.tip('编辑' + id);
    })
}

let initDelBtn = () => {
    $('tbody').on('confirmed.bs.confirmation', 'button[name="del"]', function() {
        let id = $(this).data('id');
        deleteDataFromIdx(id);
        deleteAPI(id,$(this).data('nonce'));
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

let deleteAPI = (id,nonce) => {
    let url = `delete.json?id=${id}&nonce=${nonce}&tbl=sys_api`;
    axios({
        url
    }).then(res=>{
        lib.tip('数据成功删除')
    })

}

let refreshData = () => {
    var dataUrl = '?id=1&mode=array&nonce=asd&cache=0';

    var option = {
        url: dataUrl,
        method: 'get'
    }
    axios(option).then(res => {
        lib.tips({
            text: '查询完毕',
            delay: 5,
            type: 2
        })
        tblData = res.data;
        renderTable(res);
    })
}

let renderTable = res => {

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
let init = () => {
    initEvent();
    refreshData();
}
export default {
    init
}