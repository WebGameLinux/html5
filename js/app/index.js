$(function(){
	var winObj = $(window),
		docObj = $(document),
		allnumobj = $('#Jallnum'),
		headerObj = $('#headerCon'),
		containObj = $('#contain'),
		typeObj = $('#typeNav'),
		ctObj = $('#contact'),
		listObj = $('#list'),
		listHandle = $("#list li"),
		isMobile = /iphone|ios|ipad|android|mobile/i.test(navigator.userAgent.toLowerCase()),
		opt = {container : listObj,offset : 25,itemWidth : 220},
		uto = null,
		uto2 = null,
		page = -1,
		nowDis = 'pprz',
		dataArr = [],
		maxPage = 0;
	function setPageType(t) {
		var mData = allData[nowDis];
		var dlen = mData.length;
		var k = 0;
		var c = 0;
		allnumobj.html(dlen);
		for(var i=0;i<dlen;i++) {
			var o = mData[i];
			if(o.ntype==t||(t==0&&o.ntype!=1)) {
				c = parseInt(k/10);
				if(!dataArr[c]) {
					dataArr[c] = [o];
				} else {
					dataArr[c].push(o);
				}
				k++;
			}
		}
		maxPage = dataArr.length;
	}
	function resize() {
		var ww = winObj.width();
		ww2 = Math.max(320, Math.min(1200, ww));
		ww = Math.max(320, Math.min(1200, ww));
		headerObj.width(ww);
		containObj.width(ww2);
		// typeObj.width(ww2);
		ctObj.width(ww2);
		var ct = 0;
		var ot = 760;
		if(isMobile) {
			ct = 70;
			ot = 1520;
		} else {
			ct = 40;
		}
		if(ww<ot) {
			ctObj.css({'top':ct});
		} else {
			ctObj.css({'top':0});
		}
		listObj.trigger('refreshWookmark');
	}
	winObj.resize(function(){
		resize();
	});
	function refreshWm() {
		listObj.find('img').bind('load', function(){
			if(uto) {
				clearTimeout(uto);
			}
			uto = setTimeout(function(){
				listObj.trigger('refreshWookmark');
				// $("body").getNiceScroll().resize();
			}, 200);
		})
	}
	function resetPage(t) {
		dataArr  = [];
		page = -1;
		setPageType(t);
		listObj.empty();
		addPage(0);
	}
	function overList(o) {
		if(isMobile) {
			return true;
		}
		var qr = $(o).data('qrcode');
		var u = $(o).data('url');
		if(qr=='1') {
			$(o).find('.topTxt').stop().css({'opacity':0,'display':'block'}).animate({'opacity':1});
			var h = $(o).find('.tcontent');
			if(h.html()=='') {
				$(o).find('.tcontxt').html('扫二维码');
				if($.support.leadingWhitespace) {
					h.qrcode({'width':180,'height':180,'text':u});
				} else {
					h.qrcode({'render':'table','width':180,'height':180,'text':u});
				}
			}
		} else {
			$(o).find('.topTxt').stop().css({'opacity':0,'display':'block'}).animate({'opacity':0.3});
		}
	}
	function outList(o) {
		if(isMobile) {
			return true;
		}
		$(o).find('.topTxt').stop().animate({'opacity':0}, 300, function(){
			$(this).hide();
		})
	}
	function addPage(p) {
		if(page==p||p<0||p>=maxPage) {
			return;
		}
		page = p;
		var pd = dataArr[page];
		var len = pd.length;
		var str = '';
		for(var i=0;i<len;i++) {
			var one = pd[i];
			str += '<li data-desc="'+one.desc+'" data-url="'+one.url+'" data-qrcode="'+one.qrcode+'"><a href="http://www.w3cmark.com/jump.html#'+one.url+'" target="_blank"><div class="topImg"><img src="'+one.img+'" width="220" height="'+one.height+'"/></div><div class="topTxt" style="height:'+one.height+'px"><div class="topTxtCon"></div><div class="tcontxt"></div><div class="tcontent"></div></div><div class="botCon"><div class="botTop"><p class="btitle">'+one.btitle+'</p><p class="bname">'+one.bname+'</p><p class="btxt">'+one.btxt+'</p></div><div class="botBot"><p class="bdate">'+one.bdate+'</p><p class="btype">'+one.btype+'</p></div></div></a></li>';
		}
		listObj.append(str);
		if (listHandle.wookmarkInstance) {
			listHandle.wookmarkInstance.clear();
		}

		listHandle = $("#list li");
		listHandle.wookmark(opt);
		refreshWm();
		listHandle.mouseenter(function(){
			overList(this);
		});
		listHandle.mouseleave(function(){
			outList(this);
		});
	}
	function onScroll() {
		if(uto2) {
			clearTimeout(uto2);
		}
		uto2 = setTimeout(function(){
			var winHeight = window.innerHeight ? window.innerHeight : winObj.height(),
			closeToBottom = (winObj.scrollTop() + winHeight > docObj.height() - 180);

			if (closeToBottom) {
				var p = page+1;
				addPage(p);
			}
		}, 100);
	};
	var ntype = parseInt( location.hash.substr(1));
	if(ntype) {
		setPageType(ntype);
	} else {
		setPageType(0);
	}
	winObj.bind('scroll.wookmark', onScroll);
	resize();
	addPage(0);

	// $('body').niceScroll({
	// 	scrollspeed: 80,
	// 	cursorcolor: "#ff0000",
	// 	cursorwidth: '8px',
	// 	cursorheight:'30px',
	// 	cursorborder: "0px",
	// 	cursorborderradius: "4px",
	// 	autohidemode:false
	// });
	$("#yxshare").click(function(){
		yxShare(shareUrl,shareTxt,sharePic);
	});
	$("#wbshare").click(function(){
		sinaShare(shareUrl,shareTxt,sharePic);
	});
	function yxShare(url, txt, pic) {
		var str = "http://open.yixin.im/share?appkey=yx3ae08a776bf04178a583cb745fb6aa0c&type=webpage&url="+encodeURIComponent(url)+'&title='+encodeURIComponent(txt)+'&desc='+encodeURIComponent(txt)+'&pic='+encodeURIComponent(pic);
		var ustrObj={
				'width':500,
				'height':480,
				'top':(screen.height - 400) / 4,
				'left':(screen.width - 400) / 2,
				'toolbar':'no',
				'menubar':'no',
				'scrollbars':'no',
				'resizable':'yes',
				'location':'no',
				'status':'no'
		};
		var result=[];
		for (var i in ustrObj){
			result.push(i+"="+ustrObj[i]);
		}
		window.open(str,"_blank",result);
	}
	function sinaShare(url, txt, pic) {
		var str = 'http://service.weibo.com/share/share.php?c=nie&content=gb2312&source=nie&url='+encodeURIComponent(url)+'&title='+encodeURIComponent(txt)+'&pic='+encodeURIComponent(pic);
		var ustrObj={
				'width':500,
				'height':480,
				'top':(screen.height - 400) / 4,
				'left':(screen.width - 400) / 2,
				'toolbar':'no',
				'menubar':'no',
				'scrollbars':'no',
				'resizable':'yes',
				'location':'no',
				'status':'no'
		};
		var result=[];
		for (var i in ustrObj){
			result.push(i+"="+ustrObj[i]);
		}
		window.open(str,"_blank",result);
	}
	$('#qrcode').mouseover(function(){
		$('#qrcodeCon').stop().css({'opacity':0}).show().animate({'opacity':1});
	});
	$('#qrcode').mouseout(function(){
		$('#qrcodeCon').stop().animate({'opacity':0}, 300, function(){
			$(this).hide();
		});
	});
	$('.page').click(function(){
		var p = $(this).data('page');
		if(nowDis==p) {
			return;
		}
		$('#nav li').removeClass('current');
		$(this).parent().addClass('current');
		if(p) {
			nowDis = p;
			resetPage(0);
		}
	});
	var oldTnav = typeObj.find('a').eq(0);
	typeObj.find('a').click(function(){
		var d = $(this).attr('data');
		oldTnav.removeClass('typeCurr');
		oldTnav = $(this);
		$(this).addClass('typeCurr');
		resetPage(parseInt(d));
	});
	setTimeout(function(){
		if($.support.leadingWhitespace) {
			$('#qrcodeCon').qrcode({'width':90,'height':90,'text':location.href});
		} else {
			$('#qrcodeCon').qrcode({'render':'table','width':90,'height':90,'text':location.href});
		}
	}, 200);
})
var onBridgeReady = function () {
	var appId = '';
	// 发送给好友;
	WeixinJSBridge.on('menu:share:appmessage', function(argv){
		var imgUrl = sharePic;
		var link = shareUrl;
		var title = shareTitle;
		var shareDesc = shareTxt;
		WeixinJSBridge.invoke('sendAppMessage',{
			'img_url' : imgUrl,
			'img_width' : '640',
			'img_height' : '640',
			'link' : link,
			'desc' : shareDesc,
			'title' : title
			}, function(res) {
		});
	});
	// 分享到朋友圈;
	WeixinJSBridge.on('menu:share:timeline', function(argv){
		var imgUrl = sharePic;
		var link = shareUrl;
		var title = shareTitle;
		var shareDesc = shareTxt;
		WeixinJSBridge.invoke('shareTimeline',{
		'img_url' : imgUrl,
		'img_width' : '640',
		'img_height' : '640',
		'link' : link,
		'desc' : shareDesc,
		'title' : shareDesc
		}, function(res) {
		});
	});
};
if(document.addEventListener){
	document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
} else if(document.attachEvent){
	document.attachEvent('WeixinJSBridgeReady' , onBridgeReady);
	document.attachEvent('onWeixinJSBridgeReady' , onBridgeReady);
}
if(document.addEventListener){
	document.addEventListener('YixinJSBridgeReady', function onBridgeReady() {
	    YixinJSBridge.call('hideToolbar');
	});
}
var showSearch = function(){
	var $search = $('.search');
	if($search.hasClass('search-hover')){
		$search.removeClass('search-hover');
	}else{
		$search.addClass('search-hover');
	}
}