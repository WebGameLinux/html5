/*
20150304 by lijun
MobileScrollbar
initedCallback：初始化回调
scrollTopCallback：滚到顶部回调
scrollBottomCallback：滚到顶部回调
resizeFix：重置
*/

var MobileScrollbar = (function (window,document){
	function prefixStyle (style) {
		if ( vendor === '' ) return style;
		style = style.charAt(0).toUpperCase() + style.substr(1);
		return vendor + style;
	};
	var dummyStyle = document.createElement('div').style,
		vendor = (function () {
			var vendors = 't,webkitT,MozT,msT,OT'.split(','),
				t,
				i = 0,
				l = vendors.length;
			for ( ; i < l; i++ ) {
				t = vendors[i] + 'ransform';
				if ( t in dummyStyle ) {
					return vendors[i].substr(0, vendors[i].length - 1);
				}
			}
			return false;
		})(),
		cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',
		// Style properties
		transform = prefixStyle('transform'),
		transitionDuration = prefixStyle('transitionDuration'),
		transitionTimingFunction = prefixStyle('transitionTimingFunction'),
		// Browser capabilities
		has3d = prefixStyle('perspective') in dummyStyle,
		hasTouch = 'ontouchstart' in window,
		hasTransform = !!vendor,
		hasTransitionEnd = prefixStyle('transition') in dummyStyle,
		// Helpers
		translateZ = has3d ? ' translateZ(0)' : '',
		// Events
		resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove',
		endEvent = hasTouch ? 'touchend' : 'mouseup',
		cancelEvent = hasTouch ? 'touchcancel' : 'mouseup',
		transitionEndEvent = (function () {
			if ( vendor === false ) return false;
			var transitionEnd = {
					''			: 'transitionend',
					'webkit'	: 'webkitTransitionEnd',
					'Moz'		: 'transitionend',
					'O'			: 'oTransitionEnd',
					'ms'		: 'MSTransitionEnd'
				};
			return transitionEnd[vendor];
		})();

	var MobileScrollbar = function(options){
		this.options = {
			'wrap': '',
			'container': '',
			'isHorizontal': '',
			initedCallback:function(){
    		},
    		scrollTopCallback:function(){
    		},
    		scrollBottomCallback: function(){
		    }
		};
		for (i in options) this.options[i] = options[i];
		if(!this.options.wrap){return};
		if(document.querySelector){
			this.wrap = document.querySelector(this.options.wrap);
			this.container = this.wrap.querySelector(this.options.container);
		};		
		this.init();
	};
	MobileScrollbar.prototype = {
		init: function(){
			// console.log('init...')
			var _this = this;
			//绑定touch事件
			_this.wrap.addEventListener(startEvent, function (e) {
				_this._start(e);
			}, false);
			_this.wrap.addEventListener(moveEvent, function (e) {
				_this._move(e);
			}, false);
			_this.wrap.addEventListener(endEvent, function (e) {
				_this._end(e);
			}, false);	        
	        window.addEventListener(resizeEvent, function (e) {
				// _this.movewidth = _this.wrapwidth-_this.wraps.clientWidth;
	   //      	_this.newX = 0;
	   			_this._reset();
			}, false);
			_this._reset();
		},
		_reset: function(){
			this.moveY = 0;
			var _this = this;
			_this._pos(0);
			this.wrapHeight = _this.wrap.clientHeight;
			// this.containerHeight = this.container.clientHeight;
			this.maxDist = _this.container.clientHeight - this.wrapHeight;
			// console.log(this.wrapHeight + '||' + this.containerHeight + '||' + this.maxDist);
		},
		//滚动到指定坐标
		_pos: function (x,t,tf) {
			var _this = this,
				t = t || 0,
				tf = tf || 'ease';
			if(_this.isHorizontal){
				_this.container.style.cssText = cssVendor+'transform:translate3d('+x+'px,0,0);';
			}else{
				_this.container.style.cssText = cssVendor+'transform:translate3d(0,'+x+'px,0);';
			};
			if(t != 0){
				_this.container.style[transitionDuration] = t + 'ms';
			};
			_this.container.style[transitionTimingFunction] = tf;
			
		},
		//手势开始
		_start: function (e) {
			// console.log('start...')
			var _this = this;			
			if(this.maxDist < 0) return;
			if (this.initiated) return;
			this.initiated = true;			
			var point = hasTouch ? e.touches[0] : e;
			this.startX = point.pageX;
			this.startY = point.pageY;
			this.pointX = point.pageX;
			this.pointY = point.pageY;
			this.stepsX = 0;
			this.stepsY = 0;
			this.startTime = new Date().getTime();
			// this.directionX = 0;
			// this.directionLocked = false;
			// _this.wrap.style[transitionDuration] = '0s';
		},
		//手势移动
		_move: function (e) {
			if (!this.initiated) return;
			e.preventDefault();
			var _this = this;
			var point = hasTouch ? e.touches[0] : e,
				deltaX = point.pageX - this.pointX,
				deltaY = point.pageY - this.pointY;			
			this.stepsX = deltaX;
			this.stepsY = deltaY;

			// this.moveY = deltaY;
			//console.log('deltaX'+deltaX)
			// if (this.stepsY > 1 && this.stepsY > this.stepsX) {
			// 	return ;
			// }
			// if (!this.directionLocked && this.stepsY > this.stepsX) {
			// 	this.initiated = false;
			// 	return;
			// }
			
			// this.directionLocked = true;
			// if (point.pageX < _this.startX) {
			_this._pos(this.moveY + deltaY);
			// }else if (point.pageX > _this.startX){
				// _this._pos(_this.moveX);
			// }
			
		},
		//手势结束
		_end: function (e) {
			var _this = this;
			if (!this.initiated) return;
			this.initiated = false;
			this.endTime = new Date().getTime();
			this.moveY = this.moveY + this.stepsY;//滑动距离
			
			
			//console.log('newx:'+_this.newX)			
			// var point = hasTouch ? e.changedTouches[0] : e,
			// 	distX = point.pageX - _this.startX,
			// 	distY = point.pageY - _this.startY;
			
			
			if (this.stepsY < 0 && this.moveY < 0 && Math.abs(this.moveY) > _this.maxDist) {
				this.moveY = -_this.maxDist;
				// console.log(this.moveY)
				_this._pos(this.moveY, 300, 'ease-out');
			}else if (this.stepsY > 0 && this.moveY > 0){
				this.moveY = 0;
				_this._pos(this.moveY, 300, 'ease-out');
			}else{
				_this._pos(this.moveY);
				_this._inertiaScroll();
			}
			// console.log(this.moveY +"||" +this.stepsY)
		},
		// 惯性滚动
		_inertiaScroll: function(){
			var _this = this,
				inertiaDist;
			this.moveV = _this.stepsY / (_this.endTime - _this.startTime);//滑动速度
			inertiaDist = this.moveV*300;//惯性滑动的距离
			if(this.moveV){

			}
			console.log(this.moveV +"||"+ inertiaDist);
			this.moveY = inertiaDist + _this.moveY;
			if(this.stepsY < 0 && this.moveY < 0 && Math.abs(this.moveY) > _this.maxDist){				
				setTimeout(function(){
					this.moveY = -_this.maxDist;
					_this._pos(this.moveY, 100, 'ease-out');
				},701)
			}else if(this.stepsY > 0 && this.moveY > 0){
				setTimeout(function(){
					this.moveY = 0;
					_this._pos(this.moveY, 100, 'ease-out');
				},701)
			}
			_this._pos(this.moveY, 700, 'ease-out');
			
		}
	};
	return MobileScrollbar;
})(window,document);