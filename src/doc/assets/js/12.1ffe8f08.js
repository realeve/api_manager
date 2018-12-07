(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{177:function(t,e,r){"use strict";r.r(e);var a={props:["slot-key"],mounted:function(){this.$nextTick(function(){this.$vuepress.$emit("AsyncMarkdownContentMounted",this.slotKey)})}},n=r(1),s=Object(n.a)(a,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.slotKey}},[r("h1",{attrs:{id:"部署"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#部署","aria-hidden":"true"}},[t._v("#")]),t._v(" 部署")]),t._v(" "),r("p",[t._v("在进阶手册中，我们将对系统部署，后台二次开发与配置等环节做详细说明，后面将以 10.8.1.25 这一服务器 IP 为例说明，用户自行更换为个人接口。")]),t._v(" "),r("h2",{attrs:{id:"准备-php-环境"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#准备-php-环境","aria-hidden":"true"}},[t._v("#")]),t._v(" 准备 php 环境")]),t._v(" "),r("p",[t._v("下载　"),r("a",{attrs:{href:"http://www.onlinedown.net/soft/118187.htm",target:"_blank",rel:"noopener noreferrer"}},[t._v("wamp"),r("OutboundLink")],1),t._v(" 运行环境，确保 php 环境搭建正常，详情可以"),r("a",{attrs:{href:"https://www.cnblogs.com/Informal/p/5608871.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("参考这里"),r("OutboundLink")],1),t._v("。"),r("a",{attrs:{href:"http://php.net/downloads.php",target:"_blank",rel:"noopener noreferrer"}},[t._v("php"),r("OutboundLink")],1),t._v(" 建议升级至 7.0 以上以获得更好的性能。")]),t._v(" "),r("h2",{attrs:{id:"php-数据库环境"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#php-数据库环境","aria-hidden":"true"}},[t._v("#")]),t._v(" php 数据库环境")]),t._v(" "),r("p",[t._v("确保 php 当前配置能连接上 MySQL/SQL Server/Oracle 数据库，相关教程自行搜索。")]),t._v(" "),r("h2",{attrs:{id:"部署数据库"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#部署数据库","aria-hidden":"true"}},[t._v("#")]),t._v(" 部署数据库")]),t._v(" "),r("p",[t._v("系统默认需要 mysql 支持，手工导入运行软件包中提供的数据库初始化语句。")]),t._v(" "),r("h2",{attrs:{id:"部署应用"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#部署应用","aria-hidden":"true"}},[t._v("#")]),t._v(" 部署应用")]),t._v(" "),r("h3",{attrs:{id:"_1-部署后端"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_1-部署后端","aria-hidden":"true"}},[t._v("#")]),t._v(" 1.部署后端")]),t._v(" "),r("p",[t._v("将后台打包部署至服务器，假设端口号为 80。在浏览器打开"),r("a",{attrs:{href:"http://10.8.1.25/public",target:"_blank",rel:"noopener noreferrer"}},[t._v("接口管理主页"),r("OutboundLink")],1),t._v("确保能正常访问。")]),t._v(" "),r("div",{staticClass:"tip custom-block"},[r("p",{staticClass:"custom-block-title"},[t._v("使用其它 IP")]),t._v(" "),r("p",[t._v("如果使用其它端口则链接也一同更改，如：http://10.8.1.25:8000/public")])]),t._v(" "),r("h3",{attrs:{id:"_2-配置前台"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_2-配置前台","aria-hidden":"true"}},[t._v("#")]),t._v(" 2.配置前台")]),t._v(" "),r("p",[t._v("定位至应用目录 public/js/common/public.js 文件，目录结构如下")]),t._v(" "),r("pre",{staticClass:"vue-container"},[r("code",[r("p",[t._v("├─"),r("code",[t._v("public")]),r("em",[t._v("("),r("strong",[t._v("目录")]),t._v(")")]),t._v("\n│ ├─cdn\n│ ├─css\n│ ├─img\n│ ├─"),r("code",[t._v("js")]),r("em",[t._v("("),r("strong",[t._v("目录")]),t._v(")")]),t._v("\n│ │ ├─"),r("code",[t._v("common")]),r("em",[t._v("("),r("strong",[t._v("目录")]),t._v(")")]),t._v("\n│ │ │ ├─demo.js\n│ │ │ ├─layout.js\n│ │ │ ├─"),r("code",[t._v("public.js")]),r("em",[t._v("("),r("strong",[t._v("文件")]),t._v(")")]),t._v("\n│ │ │ ├─quick-nav.js\n│ │ │ └─quick-sidebar.js\n│ │ ├─page\n│ │ │ ├─common\n│ │ │ ├─index\n│ │ │ ├─login\n│ │ │ └─setting\n│ │ └─plugins")]),t._v("\n")])]),r("p",[t._v("将其中的 "),r("em",[t._v("http://localhost:90")]),t._v(" 更换为你部署的服务，如 "),r("em",[t._v("http://10.8.1.25:8000")])]),t._v(" "),r("div",{staticClass:"tip custom-block"},[r("p",{staticClass:"custom-block-title"},[t._v("输出目录树")]),t._v(" "),r("p",[t._v("在 cmd 中的 tree 命令支持输出目录树，相关用法如下：")]),t._v(" "),r("p",[t._v("TREE [drive:][path] [/F][/a]")]),t._v(" "),r("p",[t._v("/F Display the names of the files in each folder.")]),t._v(" "),r("p",[t._v("/A Use ASCII instead of extended characters.")])]),t._v(" "),r("h3",{attrs:{id:"_3-前台登录"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_3-前台登录","aria-hidden":"true"}},[t._v("#")]),t._v(" 3.前台登录")]),t._v(" "),r("p",[t._v("进入链接 "),r("a",{attrs:{href:"http://10.8.1.25:8000/public",target:"_blank",rel:"noopener noreferrer"}},[t._v("http://10.8.1.25:8000/public"),r("OutboundLink")],1),t._v("输入用户名密码，如果登录成功，说明应用环境部署成功。")])])},[],!1,null,null,null);s.options.__file="README.md";e.default=s.exports}}]);