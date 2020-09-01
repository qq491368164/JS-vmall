
requirejs.config({
    paths : {
            "jquery" : "../lib/jquery-3.4.1.min"
    }
});


define(['jquery' , './modules/cartStorage'],function($ , { getCartStorage }){

    var $cart = $('#cart');

    initCart();

    function initCart(){   //初始化购物车页面

        var $cart_list = $cart.find('.cart_list');
        var cartList = getCartStorage();

        var tmp = cartList.map((v,i,a)=>{
            return `
                <li>
                    <div>${ v.goodsChecked ? '<input type="checkbox" checked>' : '<input type="checkbox">' }</div>
                    <div>${v.goodsName} ( ${v.goodsColor} )</div>
                    <div>¥ ${v.goodsPrice}.00</div>
                    <div>
                        <span>-</span>
                        <input class="cart_list_text" type="text" value="${v.goodsNumber}">
                        <span>+</span>
                    </div>
                    <div>¥ ${ v.goodsNumber * v.goodsPrice }.00</div>
                    <div>删除</div>
                </li>
            `;
        }).join('');

        $cart_list.html(tmp);

    }

    
});