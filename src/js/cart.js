
requirejs.config({
    paths : {
            "jquery" : "../lib/jquery-3.4.1.min"
    }
});


define(['jquery' , './modules/cartStorage'],function($ , { getCartStorage , setCartStorage }){

    var $cart = $('#cart');

    initCart();

    function initCart(){   //初始化购物车页面

        var $cart_list = $cart.find('.cart_list');
        var cartList = getCartStorage();
    
        var tmp = cartList.map((v,i,a)=>{
            return `
                <li>
                    <div>${ v.goodsChecked ? '<input class="cb" type="checkbox" checked>' : '<input class="cb" type="checkbox">' }</div>
                    <div>${v.goodsName} ( ${v.goodsColor} )</div>
                    <div>¥ ${v.goodsPrice}.00</div>
                    <div>
                        <span class="reduceBtn">-</span>
                        <input class="cart_list_text" type="text" value="${v.goodsNumber}">
                        <span class="addBtn">+</span>
                    </div>
                    <div>¥ ${ v.goodsNumber * v.goodsPrice }.00</div>
                    <div class="removeBtn">删除</div>
                </li>
            `;
        }).join('');

        $cart_list.html(tmp);

        var cbs = $cart.find('.cb').get();
        var $cart_title_selectAll = $cart.find('.cart_title_selectAll');
        var $cart_computed_price_0 = $cart.find('.cart_computed_price p').eq(0);
        var $cart_computed_price_1 = $cart.find('.cart_computed_price p').eq(1);
        var allNumber = 0;
        var allPrice = 0;
       
        if( isAllCheckbox() ){
            // 如果针对是checked属性的时候，最好不要用attr -> prop方法
            //Attr()-> attribute -> elem.setAttribute('checked',true);
            //prop() -> . []  ->  elem.checked = true;

            $cart_title_selectAll.prop('checked',true);
        }
        else{
            $cart_title_selectAll.prop('checked',false);
        }
       
        for(var i=0;i<cbs.length;i++){
            if( cbs[i].checked ){
                allPrice  += cartList[i].goodsNumber * cartList[i].goodsPrice;
                allNumber += cartList[i].goodsNumber;
            }
        }

        $cart_computed_price_1.html(`已选择 ${allNumber} 件商品`);
        $cart_computed_price_0.html(`总计：¥ ${allPrice}.00`);


        chooseNumberFn(cartList);
        removeCartFn(cartList);
        chooseCheckboxFn(cartList);
        chooseAllCheckbox(cartList);
    }


    function chooseNumberFn(cartList){   //数量的变化函数
        var $reduceBtn = $cart.find('.reduceBtn');
        var $addBtn = $cart.find('.addBtn');
        var $cart_list_text = $cart.find('.cart_list_text');
        $addBtn.click(function(){
            var index = $(this).closest('li').index();
            cartList[index].goodsNumber++;
            setCartStorage(cartList);
            initCart();
        });
        $reduceBtn.click(function(){
            var index = $(this).closest('li').index();
            cartList[index].goodsNumber--;
            setCartStorage(cartList);
            initCart();
        });
        $cart_list_text.on('input',function(){
            if( !Number($(this).val()) ){
                $(this).val('');
            }
        });
        $cart_list_text.on('blur',function(){
            if( !Number($(this).val()) ){
                $(this).val(1);
            }
            var index = $(this).closest('li').index();
            cartList[index].goodsNumber = Number($(this).val());
            setCartStorage(cartList);
            initCart();
        });
    }

    function removeCartFn(cartList){  //删除指定的商品
        var $removeBtn = $cart.find('.removeBtn');
        $removeBtn.click(function(){
            var index = $(this).closest('li').index();
            cartList.splice(index , 1);
            setCartStorage(cartList);
            initCart();
        });
    }

    function chooseCheckboxFn(cartList){   //选择复选框操作函数
        var $cbs = $cart.find('.cb');
        $cbs.click(function(){
            var index = $(this).closest('li').index();
            cartList[index].goodsChecked = this.checked;
            setCartStorage(cartList);
            initCart();   //会修改所有的DOM变化，根据本地存储的数据
        });
    }

    function isAllCheckbox(){    // 全选按钮操作
        var cbs = $cart.find('.cb').get();
        for(var i=0;i<cbs.length;i++){
            if( !cbs[i].checked ){
                return false;
            }
        }
        return true;  //所有复选框都选中
    }

    function chooseAllCheckbox(cartList){   //选择全选按钮功能
        var $cart_title_selectAll = $cart.find('.cart_title_selectAll');
        $cart_title_selectAll.click(function(){
            for(var i=0;i<cartList.length;i++){
                cartList[i].goodsChecked = this.checked;
            }
            setCartStorage(cartList);
            initCart();
        });
    }
    
});