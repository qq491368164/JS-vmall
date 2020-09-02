
var { src , dest , series , parallel , watch } = require('gulp');
var clean = require('gulp-clean');
var fileInclude = require('gulp-file-include');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var requirejsOptimize = require('gulp-requirejs-optimize');

function cleanTask(){
    return src('./dist' , {allowEmpty : true})
            .pipe( clean() );
}

function fileIncludeTask(){
    return src('./src/view/*.html')
            .pipe(fileInclude({
                prefix : '@',
                basepath : './src/view/templates'
            }))
            .pipe(dest('./dist/view'));
}

function webserverTask(){
    return src('./dist')      //是view文件夹下作为localhost根目录
            .pipe( webserver({
                host : 'localhost',
                port : 4000,
                open : './view/index.html',
                livereload : true,
                proxies:[   //配置反向代理
                    {
                        source:'/api2',
                        target:'http://localhost/api2'
                    }
                ]
            }));
}

function sassTask(){
    return src('./src/css/*.scss')
            .pipe(sass())
            .pipe(dest('./dist/css'));
}

function staticTask(){   //把src中的静态资源同步到dist下
    return src('./src/static/**')
            .pipe(dest('./dist/static'));
}

function libTask(){
    return src('./src/lib/**')
            .pipe( dest('./dist/lib') );
}
function apiTask(){
    return src('./src/api/**')
            .pipe( dest('./dist/api') );
}
function jsTask(){
    return src('./src/js/**')
            .pipe( dest('./dist/js') );
}

function watchTask(){   //监听文件变化，同步到dist文件下
    watch('./src/view/**' , fileIncludeTask);
    watch('./src/css/**' , sassTask);
    watch('./src/static/**' , staticTask);
    watch('./src/lib/**' , libTask);
    watch('./src/api/**' , apiTask);
    watch('./src/js/**' , jsTask);
}

function buildCSSTask(){
    return src('./src/css/*.scss')
            .pipe(sass())
            .pipe(cssmin())
            .pipe(dest('./dist/css'));
}

function buildJSTask(){
    return src('./src/js/*.js')
            .pipe(requirejsOptimize({
                optimize:"none",
                paths:{                        
                    "jquery":"empty:"  //不会把jquery模块合并进去
                }
            }))
            .pipe(babel({
                presets: ['es2015']
             }))
            .pipe(uglify())
            .pipe( dest('./dist/js') );
}

module.exports = {
    // 开发环境下的命令
    dev : series( cleanTask , parallel(fileIncludeTask , sassTask , staticTask , libTask , apiTask , jsTask) , parallel(webserverTask , watchTask) ),    
    // 生产环境下的命令
    build : series( cleanTask , parallel(fileIncludeTask , buildCSSTask , buildJSTask , staticTask , libTask , apiTask) )
};