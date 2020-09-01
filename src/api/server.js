
//提供一个全站的所有api接口地址，通过{}提供给外面
define(['jquery'],function($){

    function getBannerData(){
        return $.ajax('/api/mock/banner.json');  // promise对象提供出去
    }
    function getBanner2Data(){
        return $.ajax('/api/mock/banner2.json');  // promise对象提供出去
    }
    function getPhoneData(){
        return $.ajax('/api/mock/phone.json');
    }
    function getBookData(){
        return $.ajax('/api/mock/book.json');
    }
    function getPadData(){
        return $.ajax('/api/mock/pad.json');
    }
    function getDetailData(type , id){
        var promise = new Promise(function(resolve,reject){
            $.ajax(`/api/mock/${type}.json`).then((res)=>{
                //console.log(res);
                for(var i=0;i<res.goods_list.length;i++){
                    if( id == res.goods_list[i].goodsId){
                        //res.goods_list[i];   //找到id对象的数据
                        resolve(res.goods_list[i]);
                    }
                }
            });
        });
        return promise;
    }

    // 反向代理 php 页面
    /* function actionLogin(){
        return $.ajax('/api2/login.php'); //-> http://localhost/api2/login.php
    }
    actionLogin().then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    }); */


    return {
        getBannerData,
        getBanner2Data,
        getPhoneData,
        getBookData,
        getPadData,
        getDetailData
    };

});