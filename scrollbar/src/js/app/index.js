var mobilescrollbar = new MobileScrollbar({
    wrap: "#Jscroll",//string,滚动内容外层节点
    container: ".scroll-inner",//string,滚动内容节点
    isHorizontal: false,// bool,是否水平方向，false为垂直方向
    initedCallback: function(){
        console.log('init suc...')
    },
    scrollTopCallback: function(){
        console.log('top...')
    },
    scrollBottomCallback: function(){
        console.log('bottom...')
    }
});