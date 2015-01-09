
var dummyStyle = document.createElement('div').style,
vendor = (function () {
    var vendors = 't,webkitT,MozT,msT,OT'.split(','),
        t,
        i = 0,
        l = vendors.length;
    for ( ; i < l; i++ ) {
        t = vendors[i] + 'ransform';
        if ( t in dummyStyle ) {
            //alert(vendors[i])
            return vendors[i].substr(0, vendors[i].length - 1);
        }
    }
    return false;
})(),
/**样式兼容**/
_css3pre = vendor ? '-' + vendor.toLowerCase() + '-' : '';
;var MobileTopic = function(){ //定义单例
    var _broswer,
     _ua = navigator.userAgent.toLowerCase(),
     _s,     
     _isScrolling = false,
     _count = 0,
	 _curStageIndex = 0,
     _stagesEles = {},
	 _stagesElesList = 0,
	 _startP,
	 $warper,
	 _imglist = [],
	 _preloading = false,
	 _options = null,
	 _duration = 0,
	_delta = {
		x: 0,
		y: 0
	};

    function prefixStyle (style) {
        if ( vendor === '' ) return style;
        style = style.charAt(0).toUpperCase() + style.substr(1);
        //console.log(style)
        return vendor + style;
    };

    var _createAnimateEle = function(options){//内部类        
    	this.options=$.extend({
    		stageIndex:null,
    		ele:null,
    		imgUrl:"",
    		forwardInClass:"",
    		backInClass:"",
    		outClass:"",
    		finishCallback:null
    	},options||{})
    	this.init();
    	if(this.options.imgUrl&&this.options.imgUrl!=""){
    		_imglist.push(this.options.imgUrl);
    	}
    	if(typeof _stagesEles[this.options.stageIndex]=="undefined"){
    		_stagesEles[this.options.stageIndex]=[];
            // _stagesElesList.push(0);
		}
		_stagesEles[this.options.stageIndex].push(this);
        // console.log(_stagesEles[this.options.stageIndex].length)
        // _stagesElesList.push(_stagesEles[this.options.stageIndex].length);
        //记录各个滑屏的内部滑动个数
        // for (var i = 0; i < _options.stages.length; i++) {
        // if(){
        //     _stagesElesList.push(_stagesEles[i].length);
        // }else{
        //     _stagesElesList.push(0);
        // }
            
        // };
        // _stagesElesList.push(_stagesEles[0].length);
        // console.log(_options.stages)
        // console.log(_stagesElesList);

    }
    _createAnimateEle.prototype = {//对象私有方法
    	init : function(){//对象初始化
    		var csstrans={};
			if(this.options.imgUrl&&this.options.imgUrl!=""){
				csstrans["background-image"]="url("+ this.options.imgUrl +")";
			}
    		$(this.options.ele).css(csstrans);
    	},
    	reset:function(){
    		if($(this.options.ele).hasClass(this.options.forwardInClass)){
				$(this.options.ele).removeClass(this.options.forwardInClass)
			}
			if($(this.options.ele).hasClass(this.options.backInClass)){
				$(this.options.ele).removeClass(this.options.backInClass)
			}
			if(this.options.outClass!=""){
				$(this.options.ele).addClass(this.options.outClass);
				var self=this;
				var st=setTimeout(function(){
					$(self.options.ele).removeClass(self.options.outClass);
				},_duration)
			}
    	},
    	play:function(isBackIn){
    		//return;
    		if($(this.options.ele).hasClass(this.options.outClass)){
				$(this.options.ele).removeClass(this.options.outClass)
			}
    		if(isBackIn){
    			var aniClass="";
    			if(this.options.backInClass!=""){
					aniClass=this.options.backInClass;
				}
    			else{
    				aniClass=this.options.forwardInClass;
    			}
    			$(this.options.ele).addClass(aniClass)
    		}
    		else{
    			$(this.options.ele).addClass(this.options.forwardInClass);
                // console.log(this.options.ele)
    		}

			if(typeof this.options.finishCallback =="function"){
				this.options.finishCallback();
			}
		
    	},
    	addEvent:function(){//事件绑定
    		
    	}
    }
    function throttle(func,context){
    	clearTimeout(func.tId);
    	func.tId=setTimeout(function(){
    		func.call(context);
    	},300)
    }
    var _scrollTo=function(stageIndex){
        // console.log('_scrollTo:'+stageIndex)
    	if(!_isScrolling){
    		var csstrans={};
    		var isBack=false;
    		if(stageIndex<_curStageIndex){
    			isBack=true;
    		}
    		var translate=0;
    		
    		if(_options.isHorizontal){
				 translate= -$containerDiv[0].offsetWidth/_count*stageIndex;
				 csstrans[_css3pre + "transform"]="translate("+translate+"px,0)";
			}else{
			 	translate= -$containerDiv[0].offsetHeight/_count*stageIndex;
			 	csstrans[_css3pre + "transform"]="translate(0,"+translate+"px)";
			}
			$containerDiv.css(csstrans);
    		_isScrolling=true;
    		if(_options.isReplay){
				$(_stagesEles[_curStageIndex]).each(function(index,item){
					item.init();
				})
			}
            if(_options.isAutoToNextStage){
                $(_stagesEles[stageIndex]).each(function(index,item){
                    // item.play(isBack);
                })
            }
    		
    		_curStageIndex=stageIndex;
            if(!$stages.eq(_curStageIndex).hasClass("inited")){
                $stages.eq(_curStageIndex).addClass("inited")
            }
    		var st=setTimeout(function(){
    			_isScrolling=false;
			},_duration);
			// if(typeof _options.swipeCallback =="function"){
   //              if(stageIndex+1 < $(_options.stages).length){
   //                  var elem = $(_options.stages)[stageIndex+1],
   //                  imgs = elem.getElementsByTagName('img'),
   //                  imgs_len = imgs.length;
   //                  for (var i = 0; i < imgs_len; i++) {
   //                      if(imgs[i].attributes["data-src"]){
   //                          imgs[i].src = imgs[i].attributes["data-src"].value;
   //                      }
   //                  };
   //              }
			// }
    	}
    }
    var _scorllBack=function(){
    	if(!_options.isAutoToNextStage){
    		_options.swipeCallback({curStageIndex:_curStageIndex,swipeTo:-1});
    		return;
    	}
		if(!_isScrolling){
			var csstrans={};
			if(_curStageIndex==0) {
				return false;
			}
			_curStageIndex--;
            _stagesElesList = 0;
			var translate=0;
			if(_options.isHorizontal){
				 translate= -$containerDiv[0].offsetWidth/_count*_curStageIndex;
				 csstrans[_css3pre + "transform"]="translate("+translate+"px,0)";

			}else{
			 	translate= -$containerDiv[0].offsetHeight/_count*_curStageIndex;
			 	csstrans[_css3pre + "transform"]="translate(0,"+translate+"px)";

			}
			$containerDiv.css(csstrans);
			_isScrolling=true;
			if(_options.isReplay){
					$(_stagesEles[_curStageIndex+1]).each(function(index,item){
						item.reset();
					})
					$(_stagesEles[_curStageIndex]).each(function(index,item){
						item.play(true);
					})
			}
			var st=setTimeout(function(){
				_isScrolling=false;
			},_duration);
			if(typeof _options.swipeCallback =="function"){
				_options.swipeCallback({preStageIndex:_curStageIndex+1,curStageIndex:_curStageIndex})
			}
			
		}
		
	};
	var _scorllNext=function(){
		if(!_options.isAutoToNextStage){
    		_options.swipeCallback({curStageIndex:_curStageIndex,swipeTo:1});
    		return;
    	}
		if(!_isScrolling){
			var csstrans={};
			if(_curStageIndex==_count-1){
				 return false;
			}
			
			// $containerDiv.css(csstrans);
            console.log('in:'+_curStageIndex)
			_isScrolling = true;
			if(typeof _stagesEles[_curStageIndex] != undefined &&_stagesEles[_curStageIndex].length > _stagesElesList+1){//如果该屏有屏内动画
                // console.log(_stagesElesList)
                _stagesEles[_curStageIndex][_stagesElesList+1].play();
                _stagesEles[_curStageIndex][_stagesElesList].reset();

                //屏内动画计数器
                if(_stagesEles[_curStageIndex].length == _stagesElesList+1){
                    // console.log('...')
                    _stagesElesList = 0;
                }else{
                    // console.log('...')
                    _stagesElesList++;
                    // _curStageIndex--;
                    
                }
			}else{
                _curStageIndex++;
                if(!$stages.eq(_curStageIndex).hasClass("inited")){
                    $stages.eq(_curStageIndex).addClass("inited")
                }
                var translate= 0;
                if(_options.isHorizontal){
                    translate= -$containerDiv[0].offsetWidth/_count*_curStageIndex;
                    csstrans[_css3pre + "transform"]="translate("+translate+"px,0)";

                }else{
                     translate= -$containerDiv[0].offsetHeight/_count*_curStageIndex;
                     csstrans[_css3pre + "transform"]="translate(0,"+translate+"px)";

                }
                $containerDiv.css(csstrans);
                _stagesElesList = 0;
                if( _curStageIndex !=_count-1){
                    _stagesEles[_curStageIndex][_stagesElesList].play();
                }
                
            }

			var st=setTimeout(function(){
				_isScrolling=false;
			},_duration);

			if(typeof _options.swipeCallback =="function"){
				_options.swipeCallback({preStageIndex:_curStageIndex-1,curStageIndex:_curStageIndex})
			}
            // console.log('_curStageIndex:'+_curStageIndex)
		}
		
	};
	var _events = {
		arrow_left: -80,
		arrow_right: -80,
		click_target: "",
		isScrolling:false,
		
		handleEvent: function(event) {
			switch (event.type) {
				case 'touchstart':
					this.start(event);
					break;
				case 'touchmove':
					this.move(event);
					break;
				case 'touchend':
					this.end(event);
					break;
			}
		},
		start: function(event) {
			var touches = event.touches[0];
			startP = {
				x: touches.pageX,
				y: touches.pageY,
				time: +new Date
			};
			delta = {
				x: 0,
				y: 0
			};
			this.click_target = "";
		},
		move: function(event) {
			if (event.touches.length > 1 || event.scale && event.scale !== 1) {
				return;
			}
			
			var touches = event.touches[0];

			delta = {
				x: touches.pageX - startP.x,
				y: touches.pageY - startP.y
			}
			if(!(delta.y>0&&_curStageIndex==0)){
				event.preventDefault();
			}
			
		},
		end: function(event) {
			var isChgX = Math.abs(delta.x) > 50 || Math.abs(delta.x) > $containerDiv.width() / 2;
			var isChgY = Math.abs(delta.y) > 50 || Math.abs(delta.y) > $containerDiv.height() / 2;
			if (isChgX && isChgY) {
				if (Math.abs(delta.x) > Math.abs(delta.y)) {
					isChgY = false;
				} else {
					isChgX = false;
				}
			}
			if (isChgX) {
				if (delta.x < 0) {
					//向左
					if(_options.isHorizontal){
						_scorllNext();
					}
				} else {
					//向右
					if(_options.isHorizontal){
						_scorllBack();
					}
				}
			}
			if (isChgY) {
				if (delta.y < 0) {
					//向上
					if(_options.isHorizontal){
						return;
					}
					_scorllNext();
				} else {
					//向下
					if(_options.isHorizontal){
						return;
					}
					_scorllBack();
				}
			}
			if(!(delta.y>0&&_curStageIndex==0)){
				var st=setTimeout(function(){
						window.scrollTo(0, 1) ;
						window.scrollTo(0, 0) ;
					},_duration);
			}
		}
	};
	function _resize(){
		 if(window.orientation==90||window.orientation==-90){
		 	return;
		 }
		 	if(_options.isHorizontal){
				$containerDiv.css("width",$(window).width()*_count);
				$stages.css({"width":$(window).width()});
				var left= 0-$containerDiv[0].offsetWidth/_count*_curStageIndex;
				var csstrans={};
				csstrans[_css3pre+"transform"]="translate("+left+"px,0)";
				$containerDiv.css(csstrans);
			}
			else{
				$containerDiv.css("height",$(window).height()*_count);
				$stages.css({"height":$(window).height()});
				var top= 0-$containerDiv[0].offsetHeight/_count*_curStageIndex;
				var csstrans={};
				csstrans[_css3pre+"transform"]="translate(0,"+top+"px)";
				$containerDiv.css(csstrans);
			}
		 
	}
	function _onorientationchange(e){
		if(window.orientation==90||window.orientation==-90){
				$("#forhorview").css("display", "-webkit-box");   
				$("#content").css({"height":$(window).height(),"width":$(window).height()*2/3,"margin":"auto"});
        		$stages.css({"height":"480px"})     
    		} 
    		else{
    			$("#content").css({"width":"auto","margin":"auto","height":"100%"});
        		$stages.css({"height":$("#content")[0].offsetHeight}) 
    			$("#forhorview").css("display", "none");    
    	}
    	_resize(e);
	}

	function _addEvent(){
		$warper[0].addEventListener('touchstart', _events, false);
		$warper[0].addEventListener('touchmove', _events, false);
		$warper[0].addEventListener('touchend', _events, false);
		window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function(e){
			
    		_onorientationchange(e);
		}, false);
		window.addEventListener("resize",function(e){
			 throttle(_resize);
		},false)
	}

	function _preLoadImages(callback){
		var loadedCount=0;
		function preLoadImg(imgurl){
			var img= new Image();
			img.onload=function(){
				loadedCount++
				if(loadedCount==_imglist.length){	
					callback();
				}
			}
			img.src=imgurl;
		}
		
		if(_imglist.length>0){
			$(_imglist).each(function(index,imgurl){
				preLoadImg(imgurl);
			})
			
		}
		else{
			callback();
		}
	}

    function _createTopic(options){//
    	_options=$.extend({
    		warper:"",
    		containerDiv:"",
    		stages:"",
    		duration:800,
    		stageBgs:[],    		
    		isHorizontal:false,
    		isAutoToNextStage:true,
    		swipeCallback:function(param){
    		},
    		initedCallback:function(){
    			
    		}
    	},options||{});
    	$warper=$(_options.warper);
    	$containerDiv=$(_options.containerDiv),
    	$stages=$containerDiv.find(_options.stages);
    	_duration=_options.duration;
    	_count=$stages.length;
    	//alert($(window).height());
    	$containerDiv.css(_css3pre+"transition",_css3pre+"transform "+_options.duration+"ms ease-in-out");
    	if(_options.isHorizontal){
    		$containerDiv.css("width",$(window).width()*_count);
    		$stages.css({"width":$(window).width(),"float":"left"});
    	}
    	else{
			$containerDiv.css("height",$(window).height()*_count);
		}
		$stages.css("height",$(window).height());
                
		$stages.each(function(index,item){
			_stagesEles[index]=[];
		})
		if(_options.stageBgs.length>0){
            // console.log('...')
			$(_options.stageBgs).each(function(index,item){
				_imglist.push(item);
			})
		}

        
    }

    function _mutilSwipe(options){
        if(options.swipeTo > 0){
            _scrollTo(options.curStageIndex + 1);
        }else if(options.swipeTo < 0){
            _scrollTo(options.curStageIndex - 1);
        }
        var animates = _stagesEles;
        // MobileTopic.scorllTo(3);
        console.log('mutilSwipe...'+ animates[options.curStageIndex].length);
    }

    function _init(){
    	if(window.orientation==90||window.orientation==-90){  
        	$("#forhorview").css("display", _css3pre+"box");         
    	}  
    	var stageBgs=_options.stageBgs;
		$stages.each(function(index,item){
			if(stageBgs.length >index && stageBgs[index]!=""){
				$(item).css({"background-image":"url("+stageBgs[index]+")"});
			}
		})
			
		_scrollTo(0)
		_addEvent();
		if(typeof _options.initedCallback=="function"){
			_options.initedCallback();
		}
		
		setTimeout(function() { 
			window.scrollTo(1, 0) 
			window.scrollTo(0, 0) 
		}, 0);
        
    }

    return {
    	createTopic:function(options){
    		_createTopic(options)
    	},
    	createAnimateEle:function(options){
    		return new _createAnimateEle(options)
    	},
    	init:function(){
    		_init();
    	},
    	scorllTo:function(stageIndex){
    		_scrollTo(stageIndex);
    	},
    	getAinmateEles:function(){
    		return _stagesEles;
    	}
    	
    }
}();

/*

基于 MobileTopic 的拓展
1、
by lijun 2015-01-05

*/

MobileTopic.mutilSwipe = function(){
    var animates = MobileTopic.getAinmateEles();
    // MobileTopic.scorllTo(3);
    console.log('mutilSwipe...'+ animates);
}