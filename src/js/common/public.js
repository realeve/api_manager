/**
 * 需要在各个组件间传递的公共数据
 */
// 由于需要全局传递数据，该文件不做babel转码及后续的webpack打包，请使用ES5。
var apps = (function() {
    var host = 'http://localhost:90/api/';
    var token = '';
    // 业务经办人
    var userInfo = {
        name: '',
        fullname: '',
        org: ''
    };

    /**
     * 菜单样式 active
     */
    var handleMenuInfo = function() {
        var href = window.location.href.split('/');
        var menuItem = href[href.length - 1];
        var dom = $('.nav').find('[href="' + menuItem + '"]')
        dom.parent().addClass('active');

        $('.logo-default').text('JUNIU');
    };

    var init = function() {
        handleMenuInfo();
        // if (window.location.pathname.indexOf('login.html') != -1) {
        //     loadUserInfo();
        // }
    }

    var loadUserInfo = function() {
        var isLogin = window.location.pathname.indexOf('login.html') > -1;
        if (isLogin) {
            return;
        }
        var userInfo = window.localStorage.getItem('user');
        if (userInfo == null) {
            window.location.href = './login.html';
            return {
                token: ''
            };
        }
        userInfo = JSON.parse(userInfo);
        apps.token = userInfo.token;
        $('.nav .username').text(userInfo.fullname);
        return userInfo;
    };

    return {
        init: init,
        host: host,
        token: token,
        loadUserInfo: loadUserInfo
    }
})()

$(document).ready(function() {
    apps.init();
})