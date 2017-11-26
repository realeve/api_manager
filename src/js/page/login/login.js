import lib from '../common/lib';
import axios from 'axios';

var initEvent = function() {

    $('.login-form').validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            username: {
                required: true
            },
            password: {
                required: true
            },
            remember: {
                required: false
            }
        },

        messages: {
            username: {
                required: "用户名不能为空."
            },
            password: {
                required: "密码不能为空."
            }
        },

        invalidHandler: function(event, validator) { //display error alert on form submit   
            $('.alert-danger', $('.login-form')).show();
        },

        highlight: function(element) { // hightlight error inputs
            $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
        },

        success: function(label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },

        errorPlacement: function(error, element) {
            error.insertAfter(element.closest('.input-icon'));
        },

        submitHandler: function(form) {
            login();
        }
    });

    $('.login-form input').keypress(function(e) {
        if (e.which == 13) {
            if ($('.login-form').validate().form()) {
                $('.login-form').submit(); //form validation success, call ajax form submit
            }
            return false;
        }
    });

    $('.forget-form input').keypress(function(e) {
        if (e.which == 13) {
            if ($('.forget-form').validate().form()) {
                $('.forget-form').submit();
            }
            return false;
        }
    });

    $('#forget-password').click(function() {
        $('.login-form').hide();
        $('.forget-form').show();
    });

    $('#back-btn').click(function() {
        $('.login-form').show();
        $('.forget-form').hide();
    });
}



let login = () => {
    let params = {
        user: $('[name="username"]').val(),
        psw: $('[name="password"]').val()
    };

    axios({
        params,
        url: apps.host + 'authorize.json'
    }).then(res => {
        saveUserInfo(res.data);
    }).catch(res => {
        lib.tip('用户名或密码错误，登录失败.');
    })
}


let saveUserInfo = res => {
    let userInfo = {
        user: $('[name="username"]').val(),
        fullname: res.fullname,
        token: res.token
    }
    apps.token = res.token;
    window.localStorage.setItem('user', JSON.stringify(userInfo));
    window.location.href = './index.html';
}

let loadUserInfo = () => {
    let userInfo = window.localStorage.getItem('user');
    if (userInfo === null) {
        return;
    }
    userInfo = JSON.parse(userInfo);
    $('[name="username"]').val(userInfo.user);
}

let init = function() {

    initEvent();
    loadUserInfo();
    // init background slide images
    $('.login-bg').backstretch([
        "./img/login/bg1.jpg",
        "./img/login/bg2.jpg",
        "./img/login/bg3.jpg"
    ], {
        fade: 1000,
        duration: 8000
    });

    $('.forget-form').hide();

}

export default {
    init
}