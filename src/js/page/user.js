import lib from './common/lib';
import { axios } from './common/axios';
import _ from 'lodash';

let saveBtn = $('#user-saved');
let initEvent = () => {

    $('[name="fullname"]').val(apps.userInfo.fullname);

    $('[name="psw2"],[name="psw"]').on('keyup', _.debounce(() => {
        if ($('[name="psw2"]').val() == '' || $('[name="psw"]').val() == '') {
            saveBtn.attr('disabled', false);
            return;
        }
        if ($('[name="psw"]').val() == $('[name="psw2"]').val()) {
            saveBtn.attr('disabled', false);
        } else {
            saveBtn.attr('disabled', true);
            lib.tip('两次输入密码不一致');
        }
    }, 500));

    $('[name="psw"]').on('change', function() {
        let val = $(this).val();
        if (val.length < 6) {
            lib.tip('密码最少长度为6位');
            $(this).val('');
            $(this).focus();
        }
    })

    saveBtn.on('click', function() {
        let data = {
            fullname: $('[name="fullname"]').val(),
            psw: $('[name="psw"]').val(),
            condition: {
                id: apps.userInfo.uid
            },
            tbl: 'sys_user'
        }

        axios({
            data,
            method: 'put'
        }).then(res => {
            lib.tip('密码修改成功');
            window.location.href = './login.html';
        }).catch(res => {
            lib.tip('密码修改失败');
        })
    });

}
let init = () => {
    initEvent();
}
jQuery(document).ready(function() {
    init();
});