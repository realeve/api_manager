(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{168:function(t,s,n){"use strict";n.r(s);var a={props:["slot-key"],mounted:function(){this.$nextTick(function(){this.$vuepress.$emit("AsyncMarkdownContentMounted",this.slotKey)})}},e=n(1),o=Object(e.a)(a,function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.slotKey}},[n("h1",{attrs:{id:"服务器白名单"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#服务器白名单","aria-hidden":"true"}},[t._v("#")]),t._v(" 服务器白名单")]),t._v(" "),n("div",{staticClass:"danger custom-block"},[n("p",{staticClass:"custom-block-title"},[t._v("第三方直接调用")]),t._v(" "),n("p",[t._v("如果第三方系统需要直接调用数据接口，需联系管理员将对应域名添加至白名单，否则服务器将拒绝访问，返回 401 错误。")])]),t._v(" "),n("h2",{attrs:{id:"文件路径"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#文件路径","aria-hidden":"true"}},[t._v("#")]),t._v(" 文件路径")]),t._v(" "),n("p",[t._v("打开应用目录下 "),n("em",[t._v("application/config.php")]),t._v(",目录结构如下：")]),t._v(" "),n("pre",{staticClass:"vue-container"},[n("code",[n("p",[n("code",[t._v("thinkPHP")]),t._v("\n├─.vscode\n├─"),n("code",[t._v("application")]),t._v("\n│ ├─command.php\n│ ├─common.php\n│ ├─"),n("code",[t._v("config.php")]),t._v("\n│ ├─database.php\n│ ├─route.php\n│ ├─tags.php\n│ ├─api\n│ │ ├─config.php\n│ │ ├─database.php\n│ │ ├─controller\n│ │ ├─sql\n│ │ └─view\n│ │ └─index\n│ ├─extra\n│ ├─index\n│ │ ├─controller\n│ │ └─view\n│ │ └─index\n├─extend")]),t._v("\n")])]),n("p",[t._v("文件底部，allow_origin 项内容如下：")]),t._v(" "),n("div",{staticClass:"language-php line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-php"}},[n("code",[n("span",{attrs:{class:"token single-quoted-string string"}},[t._v("'allow_origin'")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),n("span",{attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),n("span",{attrs:{class:"token single-quoted-string string"}},[t._v("'10.8.1.25'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),n("span",{attrs:{class:"token single-quoted-string string"}},[t._v("'10.8.1.25:8000'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{attrs:{class:"token single-quoted-string string"}},[t._v("'localhost:8000'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{attrs:{class:"token single-quoted-string string"}},[t._v("'localhost:90'")]),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br")])]),n("p",[t._v("数组中的配置项表示允许哪个网址访问服务器数据，此处不需要配置协议，需要指定端口号。即"),n("strong",[t._v("同一台服务器，如果端口号不同，系统也不允许访问数据")]),t._v("。")]),t._v(" "),n("h2",{attrs:{id:"跨域"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#跨域","aria-hidden":"true"}},[t._v("#")]),t._v(" 跨域")]),t._v(" "),n("p",[t._v("当请求的数据服务器与前台页面地址主机信息不一致时，浏览器会因为安全限制直接拒绝请求。")]),t._v(" "),n("div",{staticClass:"tip custom-block"},[n("p",{staticClass:"custom-block-title"},[t._v("跨域")]),t._v(" "),n("p",[t._v("常见的跨域方案有 jsonp 及 cors 两种模式，系统默认两种方式都支持，但需要配置 cors 配置项。当发现请求的域与白名单中的域一致时，系统将在返回头中加入")]),t._v(" "),n("p",[t._v("Access-Control-Allow-Credentials: true")]),t._v(" "),n("p",[t._v("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE")]),t._v(" "),n("p",[t._v("Access-Control-Allow-Origin:")]),t._v(" "),n("p",[t._v("分别表示为允许请求头校验、允许方法、允许域名")])])])},[],!1,null,null,null);o.options.__file="whitelist.md";s.default=o.exports}}]);