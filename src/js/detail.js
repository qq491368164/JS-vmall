
requirejs.config({
    paths : {
            "jquery" : "../lib/jquery-3.4.1.min"
    }
});

//首页的具体业务流程，拿到首页要用到的数据。
define(['jquery','../api/server' , './modules/banner' , './modules/cartStorage'],function($ , { getBanner2Data , getDetailData } , initBanner , { addCartStorage }){
    //console.log( $ );

    var type = location.search.match(/type=([^&]+)/)[1];
    var id = location.search.match(/id=([^&]+)/)[1];
    //console.log( type , id );
    var $detail = $('#detail');
    var $detailGoods = $('#detailGoods');

    getDetailData(type , id).then((res)=>{
        
        initDetail(res);
        
    });

    function initDetail(res){   //初始化详情页
        var tmp = `
            <div class="detail_gallery l">
                <div class="detail_gallery_normal">
                    <img src="${res.photoNormal}" alt="">
                    <span></span>
                </div>
                <div class="detail_gallery_large">
                    <img src="${res.photoLarge}" alt="">
                </div>
            </div>
            <div class="detail_message l">
                <h2>${res.goodsName}</h2>
                <p>价 格 <span class="detail_message_price">¥${res.goodsPrice}.00</span></p>
                <p>选择颜色 
                    ${ res.chooseColor.map((v,i,a)=>{
                        if(i==0){
                            return `<span class="detail_message_box active">${v}</span>`;
                        }
                        else{
                            return `<span class="detail_message_box">${v}</span>`;
                        }
                    }).join('') }
                </p>
                <div class="detail_message_btn clearfix">
                    <div class="detail_message_num l">
                        <input type="text" value="1">
                        <span>+</span>
                        <span>-</span>
                    </div>
                    <div class="detail_message_cart l"><a href="javascript:;">加入购物车</a></div>
                    <div class="detail_message_computed l"><a href="/view/cart.html">立即下单</a></div>
                </div>
            </div>
        `;
        var tmp2 = `
            <h3>-- 商品详情 --</h3>
            ${
                res.goodsInfo.map((v,i,a)=>{
                    return `<img src="${v}" alt="">`;
                }).join('')
            }`;
        $detail.html(tmp);
        $detailGoods.html(tmp2);
        magnifier();
        chooseColorFn();
        chooseNumberFn();
        addCartFn(res);
    }

    function magnifier(){   //放大镜的功能
        var $detail_gallery_normal = $detail.find('.detail_gallery_normal');
        var $detail_gallery_normal_span = $detail.find('.detail_gallery_normal span');
        var $detail_gallery_large = $detail.find('.detail_gallery_large');
        var $detail_gallery_large_img = $detail.find('.detail_gallery_large img');
        $detail_gallery_normal.hover(function(){
            $detail_gallery_normal_span.show();
            $detail_gallery_large.show();
        },function(){
            $detail_gallery_normal_span.hide();
            $detail_gallery_large.hide();
        }).mousemove(function(ev){
            var L = ev.pageX - $detail_gallery_normal.offset().left - $detail_gallery_normal_span.outerWidth()/2;
            var T = ev.pageY - $detail_gallery_normal.offset().top - $detail_gallery_normal_span.outerHeight()/2;
            if(L<0){
                L = 0;
            }
            else if(L > $detail_gallery_normal.outerWidth() - $detail_gallery_normal_span.outerWidth()){
                L = $detail_gallery_normal.outerWidth() - $detail_gallery_normal_span.outerWidth();
            }
            if(T<0){
                T = 0;
            }
            else if(T > $detail_gallery_normal.outerHeight() - $detail_gallery_normal_span.outerHeight()){
                T = $detail_gallery_normal.outerHeight() - $detail_gallery_normal_span.outerHeight();
            }
            $detail_gallery_normal_span.css({
                left : L,
                top : T
            });
            var scaleX = L / ($detail_gallery_normal.outerWidth() - $detail_gallery_normal_span.outerWidth());
            var scaleY = T / ($detail_gallery_normal.outerHeight() - $detail_gallery_normal_span.outerHeight());

            $detail_gallery_large_img.css({
                left : - scaleX * ($detail_gallery_large_img.outerWidth() - $detail_gallery_large.outerWidth()),
                top : - scaleY * ($detail_gallery_large_img.outerHeight() - $detail_gallery_large.outerHeight())
            });

        });
    }

    function chooseColorFn(){   //选择颜色
        var $detail_message_box = $detail.find('.detail_message_box');
        $detail_message_box.click(function(){
            $(this).addClass('active').siblings().removeClass('active');
        });
    }

    function chooseNumberFn(){   //改变个数
        var $number = $detail.find('.detail_message_num input');
        var $addBtn = $detail.find('.detail_message_num span').eq(0);
        var $reduceBtn = $detail.find('.detail_message_num span').eq(1);

        $addBtn.click(function(){
            var n = Number($number.val()) + 1;
            $number.val(n);
        });
        $reduceBtn.click(function(){
            var n = Number($number.val()) - 1;
            if(n <= 0){
                return;
            }
            $number.val(n);
        });
        $number.on('input',function(){
            if( !Number($(this).val()) ){
                $(this).val('');
            }
        });
        $number.on('blur',function(){
            if( !Number($(this).val()) ){
                $(this).val(1);
            }
        });
    }

    function addCartFn(res){   //添加购物车功能
        var $detail_message_cart = $detail.find('.detail_message_cart');
        $detail_message_cart.click(function(){
            var $detail_message_box = $detail.find('.detail_message_box').filter('.active');
            var $detail_message_num = $detail.find('.detail_message_num input');
            //添加的数据？
            /* {
                goodsChecked : true,
                goodsName : 'HUAWEI Mate 30 4G',
                goodsColor : '亮黑色',
                goodsPrice : '1899.00',
                goodsNumber : 4,
                goodsId : 127382837
            } */
            var data = {
                goodsChecked : true,
                goodsName : res.goodsName,
                goodsColor : $detail_message_box.html(),
                goodsPrice : res.goodsPrice,
                goodsNumber : Number($detail_message_num.val()),
                goodsId : res.goodsId
            };
            //console.log(data);
            addCartStorage(data,function(){
                alert('购物车添加成功！');
            });
        });
    }

    getBanner2Data().then((res)=>{
        initBanner(res);
    });
});