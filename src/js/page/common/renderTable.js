let render = (res, dom = '.table', needEdit = true) => {
    if (res.rows == 0) {
        $(dom + ' tbody').html('<tr><td class="text-center">未查询到数据</td></tr>');
        return;
    }

    let header = res.header.map(item => `<th>${item}</th>`);
    let strEdit = needEdit ? '<th class="operator">操作</th>' : '';
    $(dom + ' thead').html(`<tr>${header.join('')}${strEdit}</tr>`);
    renderTBody(res, dom);
}

let renderTBody = (res, dom) => {
    let strs = res.data.map((row, i) => {
        let trStr = row.map(item => `<td>${item}</td>`).join('');
        return `<tr>${trStr}</tr>`;
    })
    $(dom + ' tbody').html(strs.join(''));
}

export default {
    render
}