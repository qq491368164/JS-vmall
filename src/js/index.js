

requirejs.config({
    paths : {
            "jquery" : "../lib/jquery-3.4.1.min"
    }
});

//首页的具体业务流程，拿到首页要用到的数据。
define(['jquery','../api/server' , './modules/banner'],function($ , { getBannerData } , initBanner){
    //console.log( $ );

    getBannerData().then((res)=>{
        initBanner(res);
    });

    
});