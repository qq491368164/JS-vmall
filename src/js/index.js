

requirejs.config({
    paths : {
            "jquery" : "../lib/jquery-3.4.1.min"
    }
});

//首页的具体业务流程，拿到首页要用到的数据。
define(['jquery','../api/server' , './modules/banner'],function($ , { getBannerData , getPhoneData , getBookData , getPadData } , initBanner){
    //console.log( $ );

    getBannerData().then((res)=>{
        initBanner(res);
    });

    getPhoneData().then((res)=>{

        initGoods('#phone' , res);

    });
    getBookData().then((res)=>{

        initGoods('#book' , res);

    });
    getPadData().then((res)=>{

        initGoods('#pad' , res);

    });

    function initGoods(id , res){   //初始化商品列表
        var $elem = $(id);
        var tmp = `
            <h2 class="goods_title">${res.title}</h2>
            <ul class="goods_list clearfix">
                ${
                    res.goods_list.map((v,i,a)=>{
                        return `
                            <li>
                                <a href="/view/detail.html?type=${res.type}&id=${v.goodsId}">
                                    <div><img src="${v.goodsImg}" alt=""></div>
                                    <h3>${v.goodsName}</h3>
                                    <p>¥${v.goodsPrice}</p>
                                </a>
                            </li>
                        `;
                    }).join('').repeat(3)
                }
            </ul>
        `;
        $elem.html(tmp);
    }

    
});