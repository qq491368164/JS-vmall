

define(['jquery'],function($){

    var key = 'cartList';

    function addCartStorage(data,cb){

        var cartList = getCartStorage();
        var flag = false;
        var index = -1;
        for(var i=0;i<cartList.length;i++){
            if( cartList[i].goodsId == data.goodsId && cartList[i].goodsColor == data.goodsColor ){  
                flag = true;
                index = i;
            }
        }

        if(flag){   //如果在本地存储中找到了相同的数据，累加个数
            cartList[index].goodsNumber += data.goodsNumber;
            setCartStorage(cartList);
        }
        else{  //本地存储没有这条数据，新添加一条数据。
            cartList.push(data);
            setCartStorage(cartList);
        }
        cb();
    }

    function setCartStorage(data){
        window.localStorage.setItem(key , JSON.stringify(data));
    }

    function getCartStorage(){
        return JSON.parse(window.localStorage.getItem(key) || '[]');
    }

    return {
        addCartStorage,
        setCartStorage,
        getCartStorage
    }

});