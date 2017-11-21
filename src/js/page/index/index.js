import data2file from '../common/exportTable';
import lib from '../common/lib';
import { axios } from '../common/axios';
let exportConfig = {
    title: '',
    header: [],
    body: [],
    orientation: 'landscape' // 'portrit'
};

let initEvent = () => {

    exportConfig.title = 'API列表';
    exportConfig.message = '';

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
        renderTable(res);
    })
}

let renderTable = res => {

    exportConfig.header = ['#', ...res.header];
    exportConfig.body = [];

    let header = res.header.map(item => `<th>${item}</th>`);
    $('.result-content thead').html(`<tr>${header.join('')}</tr>`);

    let strs = res.data.map((row, i) => {
        exportConfig.body.push([i + 1, ...row]);
        let trStr = row.map(item => `<td>${item}</td>`).join('');
        return `<tr>${trStr}</tr>`;
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