
//提供一个全站的所有api接口地址，通过{}提供给外面
define(['jquery'],function($){

    function getBannerData(){
        return $.ajax('/api/mock/banner.json');  // promise对象提供出去
    }
    function getBanner2Data(){
        return $.ajax('/api/mock/banner2.json');  // promise对象提供出去
    }

    return {
        getBannerData,
        getBanner2Data
    };

});