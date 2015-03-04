/*
20150304 by lijun
MobileScrollbar
initedCallback：初始化回调
scrollTopCallback：滚到顶部回调
scrollBottomCallback：滚到顶部回调
resizeFix：重置
*/

var MobileScrollbar = (function(window,document){
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

	var MobileScrollbar = function(ele,options){
		this.init();
	}
	MobileScrollbar.prototype = {
		init: function(){
			var _this=this;
			//绑定touch事件
			_this.wrap.addEventListener(startEvent, function (e) {
				_this.__start(e);
			}, false);
			_this.wrap.addEventListener(moveEvent, function (e) {
				_this.__move(e);
			}, false);
			_this.wrap.addEventListener(endEvent, function (e) {
				_this.__end(e);
			}, false);
	        
	        window.addEventListener(resizeEvent, function (e) {
				// _this.movewidth = _this.wrapwidth-_this.wraps.clientWidth;
	   //      	_this.newX = 0;
	   //      	_this.__pos(_this.newX);
			}, false);
		},
		//滚动到指定坐标
		__pos:function (x) {
			this.wrap.style.cssText=cssVendor+'transform:translate3d('+x+'px,0,0);';
		},
		//手势开始
		__start:function (e) {
			if (this.initiated) return;
			this.initiated=true;
			var _this = this;
			var point = hasTouch ? e.touches[0] : e;
			this.startX = point.pageX;
			this.startY = point.pageY;
			this.pointX = point.pageX;
			this.pointY = point.pageY;
			this.stepsX = 0;
			this.stepsY = 0;
			this.directionX = 0;
			this.directionLocked = false;
			_this.wrap.style[transitionDuration] = '0s';
		},
		//手势移动
		__move:function (e) {
			if (!this.initiated) return;
			var _this = this;
			var point = hasTouch ? e.touches[0] : e,
				deltaX = point.pageX - this.pointX,
				deltaY = point.pageY - this.pointY;
			
			this.stepsX = Math.abs(deltaX);
			this.stepsY = Math.abs(deltaY);

			_this.moveX = _this.newX + 2*deltaX;
			//console.log('deltaX'+deltaX)
			if (this.stepsY > 1 && this.stepsY > this.stepsX) {
				return ;
			}
			// if (!this.directionLocked && this.stepsY > this.stepsX) {
			// 	this.initiated = false;
			// 	return;
			// }
			e.preventDefault();
			this.directionLocked = true;
			if (point.pageX < _this.startX) {
				_this.__pos(_this.moveX);
			}else if (point.pageX > _this.startX){
				_this.__pos(_this.moveX);
			}
			
		},
		//手势结束
		__end:function (e) {
			var _this = this;
			if (!this.initiated) return;
			this.initiated = false;
			_this.newX = _this.moveX;
			//console.log('newx:'+_this.newX)			
			var point = hasTouch ? e.changedTouches[0] : e,
				dist = Math.abs(point.pageX - _this.startX);
			//console.log(this.wrapwidth)
			if (point.pageX < this.startX && Math.abs(_this.newX) >= _this.movewidth) {
				//console.log(_this.movewidth)
				_this.newX = -_this.movewidth;
				_this.__pos(this.newX);
			}else if (point.pageX > _this.startX && _this.newX > 0){
				_this.newX = 0;
				_this.__pos(_this.newX);
			}
		}
	}
})(window,document);