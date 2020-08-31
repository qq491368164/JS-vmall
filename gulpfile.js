
var { src , dest , series , parallel , watch } = require('gulp');
var clean = require('gulp-clean');
var fileInclude = require('gulp-file-include');
var webserver = require('gulp-webserver');

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
    return src('./dist/view')      //是view文件夹下作为localhost根目录
            .pipe( webserver({
                host : 'localhost',
                port : 4000,
                open : './index.html',
                livereload : true 
            }));
}

function watchTask(){   //监听文件变化，同步到dist文件下
    watch('./src/view/**' , fileIncludeTask);
}


module.exports = {
    // 开发环境下的命令
    dev : series( cleanTask , fileIncludeTask , parallel(webserverTask , watchTask) ),    
    // 生产环境下的命令
    build : series( cleanTask )
};