/**
 * 需要在各个组件间传递的公共数据
 */
// 由于需要全局传递数据，该文件不做babel转码及后续的webpack打包，请使用ES5。
var apps = (function() {
  var host = 'http://localhost:90/api/';
  host = '//10.8.1.25:100/api/';
  // var host = "//api.cbpc.ltd/";

  var token = '';
  // 业务经办人
  var userInfo = {
    name: '',
    uid: '',
    fullname: '',
    org: ''
  };

  /**
   * 菜单样式 active
   */
  var handleMenuInfo = function() {
    var href = window.location.href.split('/');
    var menuItem = href[href.length - 1];
    var dom = $('.nav').find('[href="' + menuItem + '"]');
    dom.parent().addClass('active');

    $('.logo-default').text('API Manager');
  };

  var init = function() {
    handleMenuInfo();
    loadUserInfo();
  };

  var loadUserInfo = function() {
    var isLogin = window.location.pathname.indexOf('login.html') > -1;
    if (isLogin) {
      return;
    }
    var user = window.localStorage.getItem('user');
    if (user == null) {
      window.location.href = './login.html';
      return {
        token: ''
      };
    }
    user = JSON.parse(user);
    apps.token = user.token;
    $('.nav .username').text(user.fullname);

    userInfo.name = user.user;
    userInfo.fullname = user.fullname;
    var extraInfo = atob(user.token.split('.')[1]);
    userInfo.uid = JSON.parse(extraInfo).extra.uid;

    return user;
  };

  return {
    init: init,
    host: host,
    token: token,
    userInfo: userInfo,
    loadUserInfo: loadUserInfo
  };
})();

$(document).ready(function() {
  apps.init();
});
