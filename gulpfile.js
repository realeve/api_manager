"use strict";

/*-------------------------------------------------------------------
  Required plugins
-------------------------------------------------------------------*/
const gulp = require("gulp");
const babel = require("gulp-babel");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const fileinclude = require("gulp-file-include");
const flatten = require("gulp-flatten");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant"), // 深度压缩
    changed = require("gulp-changed"); // 只操作有过修改的文件
const less = require("gulp-less");
const uglify = require("gulp-uglify");
const gutil = require("gulp-util");
const webserver = require("gulp-webserver");
const runSequence = require("run-sequence");

const webpack = require("gulp-webpack");
const named = require("vinyl-named");

const base64 = require("gulp-base64");
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");

// 报错时不退出
const plumber = require("gulp-plumber");
const PORT_ID = 8080;
/*-------------------------------------------------------------------
  Configuration
-------------------------------------------------------------------*/
const projectName = "oa-print";

const bui = {
    js: projectName + "-js",
    babel: projectName + "-babel",
    images: projectName + "-images",
    css: projectName + "-css",
    less: projectName + "-less",
    fonts: projectName + "-fonts",
    html: projectName + "-html",
    json: projectName + "-json",
    watch: projectName + "-watch",
    webserver: projectName + "-webserver",
    fonts2: "fonts2"
};
const path = {
    js: "./src/js",
    images: "./src/img",
    css: "./src/css",
    fonts: "./src/fonts",
    less: "./src/less",
    html: "./src/tpl",
    json: "./src/data",
    deploy: "./dist"
};
const watch = {
    js: [path.js + "/*.js", path.js + "/**/*.js"],
    images: [path.images + "/*", path.images + "/**/*"],
    css: [path.css + "/*.css", path.css + "/**/*.css"],
    less: [path.less + "/*.less", path.less + "/**/*.less"],
    fonts: [path.css + "/**/fonts/*"],
    fonts2: path.fonts + "/**/*",
    html: [path.html + "/*.html", path.html + "/**/*"],
    page: path.html + "/page/*.html",
    json: [path.json + "/*.json", path.json + "/**/*.json"]
};
const watchBuiArr = [
    bui["images"],
    bui["js"],
    bui["babel"],
    bui["css"],
    bui["less"],
    bui["fonts2"],
    bui["fonts"],
    bui["html"],
    bui["json"]
];
const deploy = {
    js: path.deploy + "/js",
    images: path.deploy + "/img",
    css: path.deploy + "/css",
    fonts: path.deploy + "/css",
    html: path.deploy + "/",
    json: path.deploy + "/json"
};
const smile = gutil.colors.bgBlue(" ^_^ ");
let watchArr = [];

/*-------------------------------------------------------------------
  DEV TASKS
-------------------------------------------------------------------*/
gulp.task(bui["js"], function() {
    gutil.log(smile + " -> " + bui["js"]);
    return (gulp
        .src([...watch.js, "!./src/js/page/*"])
        .pipe(plumber())
        .pipe(changed(deploy.js))
        // .pipe(uglify())
        .pipe(flatten({ includeParents: [1, 1] }))
        .pipe(gulp.dest(deploy.js)));
});

gulp.task(bui["babel"], function() {
    gutil.log(smile + " -> " + bui["js"]);
    let distDir = deploy.js + "/page/";
    return (gulp
        .src(["./src/js/page/*", "./src/js/page/**/*"])
        .pipe(plumber())
        .pipe(
            babel({
                presets: ["env"],
                plugins: ["transform-runtime"]
            })
        )
        .pipe(gulp.dest(distDir))
        .pipe(named()) // 使用原文件名作为输出文件名
        .pipe(webpack())
        // .pipe(uglify())
        .pipe(flatten({ includeParents: [1, 1] }))
        .pipe(gulp.dest(distDir)));
});

gulp.task(bui["images"], function() {
    gutil.log(smile + " -> " + bui["images"]);
    return gulp
        .src(watch.images)
        .pipe(
            imagemin({
                optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true,
                svgoPlugins: [{ removeViewBox: false }]
            }, { use: [pngquant()] })
        )
        .pipe(flatten({ includeParents: [1, 1] }))
        .pipe(gulp.dest(deploy.images));
});
gulp.task(bui["css"], function() {
    gutil.log(smile + " -> " + bui["css"]);
    return gulp
        .src(watch.css)
        .pipe(plumber())
        .pipe(changed(deploy.css))
        .pipe(autoprefixer({ browsers: ["last 2 versions"] }))
        .pipe(base64())
        .pipe(cleanCSS())
        .pipe(flatten({ includeParents: [1, 1] }))
        .pipe(gulp.dest(deploy.css));
});
gulp.task(bui["less"], function() {
    gutil.log(smile + " -> " + bui["less"]);
    return gulp
        .src(watch.less)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({ browsers: ["last 2 versions"] }))
        .pipe(base64())
        .pipe(cleanCSS())
        .pipe(flatten({ includeParents: [1, 1] }))
        .pipe(gulp.dest(deploy.css + "/page/"));
});
gulp.task(bui["fonts"], function() {
    gutil.log(smile + " -> " + bui["fonts"]);
    return gulp
        .src(watch.fonts)
        .pipe(plumber())
        .pipe(changed(deploy.fonts))
        .pipe(flatten({ includeParents: [1, 1] }))
        .pipe(gulp.dest(deploy.fonts));
});

gulp.task(bui["fonts2"], function() {
    gutil.log(smile + " -> " + bui["fonts2"]);
    return gulp
        .src(watch.fonts2)
        .pipe(plumber())
        .pipe(changed(deploy.fonts + "/fonts"))
        .pipe(flatten({ includeParents: [1, 1] }))
        .pipe(gulp.dest(deploy.fonts + "/fonts"));
});

gulp.task(bui["html"], function() {
    gutil.log(smile + " -> " + bui["html"]);
    return gulp
        .src(watch.page)
        .pipe(plumber())
        .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
        .pipe(
            htmlmin({
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                // removeTagWhitespace: true,
                sortAttributes: true,
                sortClassName: true,
                removeComments: true
            })
        )
        .pipe(gulp.dest(deploy.html));
});

gulp.task(bui["json"], () => {
    gutil.log(smile + "->" + bui["json"]);
    return gulp
        .src(watch.json)
        .pipe(plumber())
        .pipe(flatten({ includeParents: [1, 1] }))
        .pipe(gulp.dest(deploy.json));
});

gulp.task(bui["watch"], function() {
    gutil.log(smile + " -> " + bui["watch"]);
    for (let i in watch) {
        watchArr.push(watch[i]);
    }
    gutil.log(smile + " -> " + "watch path: ");
    gutil.log(watchArr);
    runSequence(watchBuiArr);
    gulp.watch(watchArr, watchBuiArr);
});
gulp.task(bui["webserver"], function() {
    gutil.log(smile + " -> " + bui["webserver"]);
    gulp.src("./").pipe(
        webserver({
            port: PORT_ID,
            livereload: true,
            directoryListing: true,
            open: path.deploy + "/index.html"
        })
    );
});
gulp.task("default", function(callback) {
    runSequence(bui["webserver"], bui["watch"], callback);
});