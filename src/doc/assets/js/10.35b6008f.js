(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{167:function(t,s,a){"use strict";a.r(s);var n={props:["slot-key"],mounted:function(){this.$nextTick(function(){this.$vuepress.$emit("AsyncMarkdownContentMounted",this.slotKey)})}},e=a(1),o=Object(e.a)(n,function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.slotKey}},[n("h1",{attrs:{id:"jwt"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#jwt","aria-hidden":"true"}},[t._v("#")]),t._v(" JWT")]),t._v(" "),n("div",{staticClass:"tip custom-block"},[n("p",{staticClass:"custom-block-title"},[t._v("说明")]),t._v(" "),n("p",[t._v("JWT 主要用于接口鉴权，如果对该部分不了解可自行查询数据")])]),t._v(" "),n("h2",{attrs:{id:"jwt-配置"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#jwt-配置","aria-hidden":"true"}},[t._v("#")]),t._v(" JWT 配置")]),t._v(" "),n("p",[t._v("打开应用目录下 "),n("em",[t._v("application/api/controller/Index.php")]),t._v(",目录结构如下：")]),t._v(" "),n("pre",{staticClass:"vue-container"},[n("code",[n("p",[n("code",[t._v("thinkPHP")]),t._v("\n├─.vscode\n├─"),n("code",[t._v("application")]),t._v("\n│ ├─"),n("code",[t._v("api")]),t._v("\n│ │ ├─config.php\n│ │ ├─database.php\n│ │ ├─"),n("code",[t._v("controller")]),t._v("\n│ │ │ └─"),n("code",[t._v("Index.php")]),t._v("\n│ │ ├─sql\n│ │ └─view\n│ ├─extra\n│ ├─index\n│ │ ├─controller\n│ │ └─view\n│ │ └─index\n├─extend")]),t._v("\n")])]),n("p",[t._v("定位到 ini 函数，内容如下：")]),t._v(" "),n("div",{staticClass:"language-php line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-php"}},[n("code",[t._v("    "),n("span",{attrs:{class:"token keyword"}},[t._v("protected")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),n("span",{attrs:{class:"token function"}},[t._v("init")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token variable"}},[t._v("$request")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        Config"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),n("span",{attrs:{class:"token function"}},[t._v("load")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token single-quoted-string string"}},[t._v("'config.php'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{attrs:{class:"token variable"}},[t._v("$this")]),n("span",{attrs:{class:"token operator"}},[t._v("-")]),n("span",{attrs:{class:"token operator"}},[t._v(">")]),n("span",{attrs:{class:"token property"}},[t._v("request")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token variable"}},[t._v("$request")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{attrs:{class:"token variable"}},[t._v("$header")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token variable"}},[t._v("$request")]),n("span",{attrs:{class:"token operator"}},[t._v("-")]),n("span",{attrs:{class:"token operator"}},[t._v(">")]),n("span",{attrs:{class:"token function"}},[t._v("header")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{attrs:{class:"token variable"}},[t._v("$header")]),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),n("span",{attrs:{class:"token single-quoted-string string"}},[t._v("'ip'")]),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token variable"}},[t._v("$request")]),n("span",{attrs:{class:"token operator"}},[t._v("-")]),n("span",{attrs:{class:"token operator"}},[t._v(">")]),n("span",{attrs:{class:"token function"}},[t._v("ip")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n        Utils"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),n("span",{attrs:{class:"token variable"}},[t._v("$request")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token variable"}},[t._v("$request")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        Utils"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),n("span",{attrs:{class:"token variable"}},[t._v("$header")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token variable"}},[t._v("$header")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n        "),n("span",{attrs:{class:"token variable"}},[t._v("$this")]),n("span",{attrs:{class:"token operator"}},[t._v("-")]),n("span",{attrs:{class:"token operator"}},[t._v(">")]),n("span",{attrs:{class:"token function"}},[t._v("setCORS")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n        "),n("span",{attrs:{class:"token comment"}},[t._v("// 测试时取消验证,设为true时支持在地址栏直接输入接口数据调试查看。")]),t._v("\n        "),n("span",{attrs:{class:"token variable"}},[t._v("$this")]),n("span",{attrs:{class:"token operator"}},[t._v("-")]),n("span",{attrs:{class:"token operator"}},[t._v(">")]),n("span",{attrs:{class:"token property"}},[t._v("DISABLED_AUTH")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token boolean"}},[t._v("true")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br"),n("span",{staticClass:"line-number"},[t._v("10")]),n("br"),n("span",{staticClass:"line-number"},[t._v("11")]),n("br"),n("span",{staticClass:"line-number"},[t._v("12")]),n("br"),n("span",{staticClass:"line-number"},[t._v("13")]),n("br"),n("span",{staticClass:"line-number"},[t._v("14")]),n("br"),n("span",{staticClass:"line-number"},[t._v("15")]),n("br")])]),n("p",[t._v("其中最后一句")]),t._v(" "),n("blockquote",[n("p",[t._v("$this->DISABLED_AUTH = true;")])]),t._v(" "),n("p",[t._v("表示是否禁用身份校验，如果设为 false 则表示启用 jwt，此时数据的读写均需要在请求头加入相关身份认证。如果未通过校验，系统拒绝返回数据，同时在浏览器地址栏中直接 get 获取数据的操作也将禁止。")]),t._v(" "),n("h2",{attrs:{id:"前台请求修改"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#前台请求修改","aria-hidden":"true"}},[t._v("#")]),t._v(" 前台请求修改")]),t._v(" "),n("div",{staticClass:"danger custom-block"},[n("p",{staticClass:"custom-block-title"},[t._v("安全声明")]),t._v(" "),n("p",[t._v("用户需自行搭建鉴权验证服务，保存登录用户及密码信息，通过请求各自服务器拿到 token，然后返回至前台。此处为方便说明，以前台获取 token 为例说明整个流程。")])]),t._v(" "),n("h3",{attrs:{id:"_1-获取-token"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-获取-token","aria-hidden":"true"}},[t._v("#")]),t._v(" 1.获取 token")]),t._v(" "),n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" host "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'//10.8.1.25/api/'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{attrs:{class:"token keyword"}},[t._v("let")]),t._v(" refreshNoncer "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{attrs:{class:"token keyword"}},[t._v("let")]),t._v(" url "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" host "),n("span",{attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'authorize.json?user=用户名&psw=密码'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),n("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("await")]),t._v(" http"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token keyword"}},[t._v("get")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("url"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("then")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("res"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" res"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("data"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("token"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br")])]),n("p",[t._v("获取到的 token 状态需自行保存。")]),t._v(" "),n("h3",{attrs:{id:"_2-请求参数中加入-token"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-请求参数中加入-token","aria-hidden":"true"}},[t._v("#")]),t._v(" 2.请求参数中加入 token")]),t._v(" "),n("div",{staticClass:"language-js line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[t._v("window"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_global_"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("token "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("''")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nwindow"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_global_"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("token "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("await")]),t._v(" "),n("span",{attrs:{class:"token function"}},[t._v("refreshNoncer")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),n("span",{attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("let")]),t._v(" axios "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("option"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n  option "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" Object"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("assign")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("option"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    headers"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      Authorization"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" window"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_global_"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("token\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    method"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" option"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("method "),n("span",{attrs:{class:"token operator"}},[t._v("||")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'get'")]),t._v("\n  "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n  "),n("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),n("span",{attrs:{class:"token keyword"}},[t._v("await")]),t._v(" http\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("create")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      baseURL"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" host"),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      timeout"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token number"}},[t._v("10000")]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      transformRequest"),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n        "),n("span",{attrs:{class:"token keyword"}},[t._v("function")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          "),n("span",{attrs:{class:"token keyword"}},[t._v("let")]),t._v(" dataType "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{attrs:{class:"token function"}},[t._v("getType")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n          "),n("span",{attrs:{class:"token keyword"}},[t._v("switch")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("dataType"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),n("span",{attrs:{class:"token keyword"}},[t._v("case")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'object'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n            "),n("span",{attrs:{class:"token keyword"}},[t._v("case")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'array'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n              data "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" qs"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("stringify")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n              "),n("span",{attrs:{class:"token keyword"}},[t._v("break")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),n("span",{attrs:{class:"token keyword"}},[t._v("default")]),n("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n              "),n("span",{attrs:{class:"token keyword"}},[t._v("break")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n          "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n          "),n("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" data"),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n      "),n("span",{attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("option"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("then")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" data "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),n("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token keyword"}},[t._v("typeof")]),t._v(" data"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("token "),n("span",{attrs:{class:"token operator"}},[t._v("!==")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v("'undefined'")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        window"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("_global_"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("token "),n("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" data"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("token"),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),n("span",{attrs:{class:"token comment"}},[t._v("// 建议同时将token存储至localStorage")]),t._v("\n      "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n      "),n("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" data"),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),n("span",{attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[t._v("1")]),n("br"),n("span",{staticClass:"line-number"},[t._v("2")]),n("br"),n("span",{staticClass:"line-number"},[t._v("3")]),n("br"),n("span",{staticClass:"line-number"},[t._v("4")]),n("br"),n("span",{staticClass:"line-number"},[t._v("5")]),n("br"),n("span",{staticClass:"line-number"},[t._v("6")]),n("br"),n("span",{staticClass:"line-number"},[t._v("7")]),n("br"),n("span",{staticClass:"line-number"},[t._v("8")]),n("br"),n("span",{staticClass:"line-number"},[t._v("9")]),n("br"),n("span",{staticClass:"line-number"},[t._v("10")]),n("br"),n("span",{staticClass:"line-number"},[t._v("11")]),n("br"),n("span",{staticClass:"line-number"},[t._v("12")]),n("br"),n("span",{staticClass:"line-number"},[t._v("13")]),n("br"),n("span",{staticClass:"line-number"},[t._v("14")]),n("br"),n("span",{staticClass:"line-number"},[t._v("15")]),n("br"),n("span",{staticClass:"line-number"},[t._v("16")]),n("br"),n("span",{staticClass:"line-number"},[t._v("17")]),n("br"),n("span",{staticClass:"line-number"},[t._v("18")]),n("br"),n("span",{staticClass:"line-number"},[t._v("19")]),n("br"),n("span",{staticClass:"line-number"},[t._v("20")]),n("br"),n("span",{staticClass:"line-number"},[t._v("21")]),n("br"),n("span",{staticClass:"line-number"},[t._v("22")]),n("br"),n("span",{staticClass:"line-number"},[t._v("23")]),n("br"),n("span",{staticClass:"line-number"},[t._v("24")]),n("br"),n("span",{staticClass:"line-number"},[t._v("25")]),n("br"),n("span",{staticClass:"line-number"},[t._v("26")]),n("br"),n("span",{staticClass:"line-number"},[t._v("27")]),n("br"),n("span",{staticClass:"line-number"},[t._v("28")]),n("br"),n("span",{staticClass:"line-number"},[t._v("29")]),n("br"),n("span",{staticClass:"line-number"},[t._v("30")]),n("br"),n("span",{staticClass:"line-number"},[t._v("31")]),n("br"),n("span",{staticClass:"line-number"},[t._v("32")]),n("br"),n("span",{staticClass:"line-number"},[t._v("33")]),n("br"),n("span",{staticClass:"line-number"},[t._v("34")]),n("br"),n("span",{staticClass:"line-number"},[t._v("35")]),n("br"),n("span",{staticClass:"line-number"},[t._v("36")]),n("br"),n("span",{staticClass:"line-number"},[t._v("37")]),n("br"),n("span",{staticClass:"line-number"},[t._v("38")]),n("br"),n("span",{staticClass:"line-number"},[t._v("39")]),n("br")])]),n("p",[t._v("这样便在调用中自动加入了 token 信息。需要注意的是，对于 token 的状态用户需自行维护，如可以存储到 localStorage 中。详细请求头如下：")]),t._v(" "),n("p",[n("img",{attrs:{src:a(94),alt:"img"}})]),t._v(" "),n("div",{staticClass:"tip custom-block"},[n("p",{staticClass:"custom-block-title"},[t._v("token 续期")]),t._v(" "),n("p",[t._v("默认 token 存活期为 2 小时，如果超过 2 小时，系统会自动续期，返回数据中将包含 token 这一项。在上例中已经做相关处理")])])])},[],!1,null,null,null);o.options.__file="jwt.md";s.default=o.exports},94:function(t,s,a){t.exports=a.p+"assets/img/config_02.115bf15c.png"}}]);