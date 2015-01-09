var descArr = [
    document.getElementById('pub-share-desc1').innerHTML,
    document.getElementById('pub-share-desc2').innerHTML,
    document.getElementById('pub-share-desc3').innerHTML,
    document.getElementById('pub-share-desc4').innerHTML,
    document.getElementById('pub-share-desc5').innerHTML,
    document.getElementById('pub-share-desc6').innerHTML,
    document.getElementById('pub-share-desc7').innerHTML,
    document.getElementById('pub-share-desc8').innerHTML
];
function randomNum(n,m){
    var c = m - n + 1;
    return Math.floor(Math.random() * c + n);
}
var randomtit = descArr[randomNum(0,7)]
var shareInfo = {
    title: randomtit,//分享标题
    desc: document.getElementById('pub-share-title').innerHTML,//分享正文
    url: window.location.href,//分享URL
    imgurl: document.getElementById('pub-share-img').getAttribute('data-src')//分享图片
};

nie.use(["nie.util.mobiShare"],function(){
    MobileShare.setting({//设置分享文案
        title: shareInfo.title,//分享标题
        desc: shareInfo.desc,//分享正文
        url: shareInfo.url,//分享URL
        imgurl: shareInfo.imgurl,//分享图片
        callback:function(){
            nie.config.stats.url.add(link + '?action=ccnxn', '分享');
        }
     })
});

var IndexFun = {
    // isWx : /micromessenger/i.test(navigator.userAgent.toLowerCase()),
    isPlay : false,
    init:function(e){
        var _this = this;
        // console.log('in...')
        // _this.setYxShare();
        _this.audioInit();
    },
    audioInit:function(){
        var audio = $("#Jaudio").get(0),
            _this = this,
            hasTouch = 'ontouchstart' in window,
            startEvent = hasTouch ? 'touchstart' : 'mousedown',
            moveEvent = hasTouch ? 'touchmove' : 'mousemove',
            endEvent = hasTouch ? 'touchend' : 'mouseup',
            cancelEvent = hasTouch ? 'touchcancel' : 'mouseup';
        $('body').live(startEvent,function(){
            if(!_this.isPlay){
                // alert(1)
                $("#Jaudiobtn").removeClass('m-audioA');
                audio.play();
                _this.isPlay = true;
            }
            
        })
        
        $("#Jaudiobtn").bind(startEvent, function() {
            // alert(1)
            // console.log('...')
            if(!audio.paused){
                // console.log('2...')
                audio.pause();
                $(this).addClass('m-audioA');
            }else{
                 audio.play();
                $(this).removeClass('m-audioA');
                // console.log('3...')
            }
        });
    }
};
//实现每次滑屏将当前场景的动画元素按顺序播放一个，当前场景动画元素播放完后下一次滑屏才会进入下一场景
var _animates,
    _bgurl1 = __uri('../../img/bg01.jpg'),
    _bgurl5 = __uri('../../img/bg05.jpg');
loader.show(function(){
    // console.log('loadok');    
}, [_bgurl1,
    _bgurl5
]);

MobileTopic.createTopic({
    warper:"#specile",
    containerDiv:"#stage",
    stages:".stage",
    duration:800,
    activeClassName:"inited",
    isReplay:false,
    isHorizontal:false,
    stageBgs:[_bgurl1, "", "", "", _bgurl5, _bgurl5],
    isAutoToNextStage:true,
    swipeCallback:function(param){
        // MobileTopic.mutilSwipe();
        return;
        var _this = this,
            $stage = $(_this.stages);
        // console.log(param.swipeTo);
        if(param.curStageIndex < param.preStageIndex || param.curStageIndex+1 > $stage.length || (param.curStageIndex == 0 && param.swipeTo < 0)){return}
        if(param.curStageIndex+1 < $stage.length){
            var elem = $stage[param.curStageIndex+1],
            imgs = elem.getElementsByTagName('img'),
            imgs_len = imgs.length;
            for (var i = 0; i < imgs_len; i++) {
                if(imgs[i].attributes["data-src"]){
                    imgs[i].src = imgs[i].attributes["data-src"].value;
                }
            };
        }
        
        if(param.curStageIndex == 1 || param.curStageIndex == 2 || param.curStageIndex == 3 || param.curStageIndex == 4){
            // console.log($stage[param.curStageIndex].id)
            var $stage_outs = $stage.eq(param.curStageIndex).find('.stage_out').eq(0);
            if(param.curStageIndex < $("#stage .stage").length-1 && param.swipeTo > 0){
             if(_animates[param.curStageIndex].length>0){
                $stage_outs.addClass('ani_out').removeClass('stage_out');
                 _animates[param.curStageIndex][0].play();
                 _animates[param.curStageIndex].shift();
             }else{
                 MobileTopic.scorllTo(param.curStageIndex+param.swipeTo);
             };
            }else if(param.curStageIndex >0  &&param.swipeTo<0){
                MobileTopic.scorllTo(param.curStageIndex+param.swipeTo);
            }

        }else if(param.curStageIndex < $("#stage .stage").length-1 && param.swipeTo>0){
            MobileTopic.scorllTo(param.curStageIndex + 1);
        }else if(param.swipeTo < 0){
            // console.log("to:"+param.swipeTo)
            MobileTopic.scorllTo(param.curStageIndex - 1);
        }
        
    },
    initedCallback:function(){
        _animates = MobileTopic.getAinmateEles();
        IndexFun.init();

    }
});

MobileTopic.init();

MobileTopic.createAnimateEle({
    stageIndex:1,
    ele:$("#s2_title1"),
    forwardInClass:"ani",
    outClass:"ani_out1"
})
MobileTopic.createAnimateEle({
    stageIndex:1,
    ele:$("#s2_title2"),
    forwardInClass:"ani",
    outClass:"ani_out1"
})
MobileTopic.createAnimateEle({
    stageIndex:1,
    ele:$("#s2_title3"),
    forwardInClass:"ani",
    outClass:"ani_out1"
})
MobileTopic.createAnimateEle({
    stageIndex:1,
    ele:$("#s2_title4"),
    forwardInClass:"ani",
    outClass:"ani_out1"
})

MobileTopic.createAnimateEle({
    stageIndex:2,
    ele:$("#s3_title1"),
    forwardInClass:"ani"
})
MobileTopic.createAnimateEle({
    stageIndex:2,
    ele:$("#s3_title2"),
    forwardInClass:"ani"
})
MobileTopic.createAnimateEle({
    stageIndex:2,
    ele:$("#s3_title3"),
    forwardInClass:"ani"
})

MobileTopic.createAnimateEle({
    stageIndex:3,
    ele:$("#s4_title1"),
    forwardInClass:"ani"
})
MobileTopic.createAnimateEle({
    stageIndex:3,
    ele:$("#s4_title2"),
    forwardInClass:"ani"
})
MobileTopic.createAnimateEle({
    stageIndex:3,
    ele:$("#s4_title3"),
    forwardInClass:"ani"
})
MobileTopic.createAnimateEle({
    stageIndex:3,
    ele:$("#s4_title4"),
    forwardInClass:"ani"
})

MobileTopic.createAnimateEle({
    stageIndex:4,
    ele:$("#s5_title1"),
    forwardInClass:"ani"
})
MobileTopic.createAnimateEle({
    stageIndex:4,
    ele:$("#s5_title2"),
    forwardInClass:"ani"
})
MobileTopic.createAnimateEle({
    stageIndex:4,
    ele:$("#s5_title3"),
    forwardInClass:"ani"
})

