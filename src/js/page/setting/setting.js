import { axios } from '../common/axios';
import tableApp from '../common/renderTable';
import lib from '../common/lib';

let addType = {
    NEW: 0,
    EDIT: 1
};

let curType = addType.NEW;
// 原始数据
let tblData = [];
// 编辑中数据;
let editingData = [];

let init = () => {
    initEvent();
    refreshData();
}

let refreshData = async () => {
    return await axios({
        url: '3/e4e497e849/array.json',
        params: {
            // id: 3,
            // nonce: 'e4e497e849',
            // mode: 'array',
            cache: 0
        }
    }).then(res => {
        tblData = res.data;
        res.data = res.data.map((row, i) => {
            let btnDel = `<button type="button" name="del" data-toggle="confirmation" data-original-title="确认删除本数据库?" data-singleton="true" data-btn-ok-label="是" data-btn-cancel-label="否" data-id="${row[0]}" class="btn red-haze btn-sm">删除</button>`;
            let btnEdit = `<button type="button" name="edit" data-id="${row[0]}" class="btn blue-steel btn-sm">编辑</button>`;
            row.push(btnEdit + btnDel);
            return row;
        });
        tableApp.render(res);
        resetNewModal();
        initDelBtn();
    })
}


let initEvent = () => {

    $('#add').on('click', () => {
        curType = addType.NEW;
        resetNewModal();
    })

    $('#api-saved').on('click', () => {
        $('#addapi').modal('hide');
        addDB();
    })
    initEditBtn();
}

let initDelBtn = () => {
    $('tbody').on('confirmed.bs.confirmation', 'button[name="del"]', function () {
        let id = $(this).data('id');
        deleteDB(id);
    });
}


let initEditBtn = () => {
    $('tbody').on('click', 'button[name="edit"]', function () {
        let id = $(this).data('id');
        curType = addType.EDIT;
        editingData = tblData.filter(item => item[0] == id)[0];
        $('#addapi [name="db_name"]').val(editingData[1]);
        $('#addapi [name="db_key"]').val(editingData[2]);
        $('#api-saved').text('更新');
        $('#addapi .modal-title').text('修改数据库配置');
        $('#addapi').modal();
    })
}

let getDBTips = () => {
    let curIdx = tblData.length;
    let dataOutStr = tblData.map((item, i) => {
        return `'${item[2]}'=>$db${i + 1}`
    })
    return `
    请在服务端  /application/api/database.php 文件中增加以下信息用于数据库默认配置：<br><br>
    $db${curIdx} = $db1;<br>
    $db${curIdx}['type'] = 'mysql';<br>
    $db${curIdx}['hostname'] = '127.0.0.1';<br>
    $db${curIdx}['database'] = '数据库名';<br>
    $db${curIdx}['username'] = '用户名';<br>
    $db${curIdx}['password'] = '密码';<br><br>
    
    该文件输出的数据$data，其内容请确保为以下内容<br><br>

    $data = [<br>
        ${dataOutStr.join(',<br>')}<br>
    ];
    
    `
}

let resetNewModal = () => {
    $('#addapi input').val('');
    $('#addapi [name="db_key"]').val('db' + (tblData.length + 1));
    $('#api-saved').text('添加');
    $('#addapi .modal-title').text('新增数据库');
}

let addDB = async () => {
    // 此处需将空字符，全角问号等全部替换
    let data = {
        db_name: $('#addapi [name="db_name"]').val(),
        db_key: $('#addapi [name="db_key"]').val(),
        tbl: 'sys_database'
    }

    if (curType == addType.EDIT) {
        data.condition = {
            id: editingData[0]
        };
    }

    await axios({
        data,
        method: curType == addType.NEW ? 'post' : 'put'
    }).then(res => {
        refreshData().then(() => {
            lib.alert({
                text: getDBTips(),
                type: 1,
                delay: 0
            });
        });
        lib.tip('数据成功' + (curType ? '修改' : '添加'));
    })
}

let deleteDB = id => {
    axios({
        method: 'delete',
        data: {
            id,
            tbl: 'sys_database'
        }
    }).then(res => {
        lib.tip('数据成功删除');
        refreshData();
    })
}

export default {
    init
}