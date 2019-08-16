//if(location.protocol==='http:')top.location='https://'+top.location.host;
var isMobile=(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))?true:false;

function getPathname(p){
	if(!p)p=location.pathname;
	p=p.replace(/\/$/,'');
	p=p.substr(p.lastIndexOf('/')+1); 
	return p;
}

function getRequest(name){ 
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r!=null) return decodeURI(r[2]); return null; 
}
function loadCSS(url){
	var l=document.createElement('link'); 
	l.href=url; 
	l.rel='stylesheet'; 
	document.getElementsByTagName('HEAD').item(0).appendChild(l);
}

function rand(begin,end){
	return Math.floor(Math.random()*(end-begin))+begin;
}

function serialize(json){
	var f=[];
	for(var i in json)f.push(i+'='+encodeURIComponent(json[i]));
	return f.join('&');
}

function addMask(){
	$('iframe').each(function() {
		$('<div class="ui-resizable-iframeFix" style="background:tgba(0,0,0,0);"></div>')
		.css({top:this.offsetTop+'px',left:this.offsetLeft+'px',width:this.offsetWidth+'px',height:this.offsetHeight+'px',position:'absolute',zIndex:1000})
		.appendTo(this.parentNode);
	})
}

function clearMask(){
	$('.ui-resizable-iframeFix').remove();
}

function dateTimeToString(d,t){
	var r;
	switch(typeof(d)){
		case 'number':
			var s=parseInt(d);
			var S=parseInt(s%60);
			var M=parseInt((s/60)%60);
			var H=parseInt((s/60/60)%60);
			var D=parseInt((s/60/60/24)%60);
			r=(D>0?D+'d ':'')+(H>0?H+'h ':'')+(M>0?M+'m ':'')+(S+'s')   
		break;
		default:
			var Y=d.getFullYear();
			var y=Y-parseInt(Y/100)*100;
			var M=d.getMonth()+1;
			var D=d.getDate();
			var h=d.getHours();
			var m=d.getMinutes();
			var s=d.getSeconds();
			var MM=(M>9)?M:'0'+M;
			var DD=(D>9)?D:'0'+D;
			var hh=(h>9)?h:'0'+h;
			var mm=(m>9)?m:'0'+m;
			var ss=(s>9)?s:'0'+s;
			r=Y+'-'+MM+'-'+DD+' '+hh+':'+mm+':'+ss;
			if(t)r=t.replace('YYYY',Y).replace('YY',y).replace('Y',y).replace('MM',MM).replace('M',M).replace('DD',DD).replace('D',D).replace('hh',hh).replace('h',h).replace('mm',mm).replace('m',m).replace('ss',ss).replace('s',s);
		break;
	}
	return r;
}

function timeToString(ms,t){
	var s=1000,m=s*60,h=m*60,d=h*24,D=$.l10n.__('day'),H=$.l10n.__('hour'),M=$.l10n.__('minute'),S=$.l10n.__('second'),MS=$.l10n.__('millisecond');  
	var day=parseInt(ms/d);
	var hour=parseInt((ms-day*d)/h);  
	var minute=parseInt((ms-day*d-hour*h)/m);  
	var second=parseInt((ms-day*d-hour*h-minute*m)/s);  
	var milliSecond=parseInt(ms-day*d-hour*h-minute*m-second*s);
	if(ms<1000)return ms+MS;
	if(day>0)return day+D+hour+H+minute+M+second+S;
	if(hour>0)return hour+H+minute+M+second+S;
	if(minute>0)return minute+M+second+S;
	if(second>0)return second+S;
	if(milliSecond>0)return milliSecond+MS;
}

function bytesToSize(bytes) {  
	if(bytes===0)return '0 B';  
	var k=1024;  
	var s=['B','KB','MB','GB','TB','PB','EB','ZB','YB'];  
	var i=Math.floor(Math.log(bytes)/Math.log(k));  
	return (bytes/Math.pow(k,i)).toFixed(2)+' '+s[i]; 
}

function validFilename(s){
	s=$.trim(s);
	if(s.length>256)return false;
	if(s===''||s==='.'||s==='..'||s.replace(/\s/g,'')==='')return false;
	if(/[\\\/\:\*\?\"\<\>\|\$\&]+/.test(s))return false;
	return s;
}

function parseMode(m){
	var r='';
	for(var i of m){
		_m=(i-0).toString(2).toString();
		r+=_m;
	}
	return r;
}

function getPosition(o){
	var r=o.getBoundingClientRect();
	return r;
}

function intersects(A,B){
	var a=A.getBoundingClientRect();
	var b=B.getBoundingClientRect();
	if(Math.min(a.right,b.right)>=Math.max(a.left,b.left)&&Math.min(a.bottom,b.bottom)>=Math.max(a.top,b.top))return true;
	return false;
}


$.fn.extend({
	selected:function(o){
		o=$.extend({filter:'>*'},o);
		var $this=this;
		var _this=this[0];
		this.on('mousedown',o.filter,function(e){
			setTimeout(()=>{
				var $t=$(this);
				var d=$t.hasClass('ui-draggable-dragging');
				if(o.single===true){
					$('.ui-selected',$this).removeClass('ui-selected');
					$t.addClass('ui-selected');
					if(o.selected)o.selected(e);
					return;
				}
				if(o.noaux===true){
					$t.toggleClass('ui-selected');
					return;
				}
				if(!e.ctrlKey&&!e.shiftKey){
					if($t.hasClass('ui-selected')&&(d||e.which===3))return;
					$('.ui-selected',$this).removeClass('ui-selected');
					$t.addClass('ui-selected');
					if(o.selected)o.selected(e);
					return;
				}
				if(e.shiftKey){
					var $s=$(o.filter,$this);
					var $f=$('.ui-selected:first',$this);
					var f=$.inArray($f[0],$s);
					var i=$t.index();
					$('.ui-selected',$this).removeClass('ui-selected');
					$s.slice(Math.min(f,i),1+Math.max(f,i)).addClass('ui-selected');
					if(o.selected)o.selected(e);
					return;
				}
				if(e.ctrlKey){
					$t.toggleClass('ui-selected');
					if(o.selected)o.selected(e);
					return;
				}
			},50)
		}).mousedown(function(e){
			if(o.single===true)return;
			var $ps=$(e.target).parentsUntil(_this);var $s=$(o.filter,_this);
			for(var s of $s){if($.inArray(s,$ps)>-1)return;}
			$s.removeClass('ui-selected');
			if(!$this.$lasso){
				var $l=$(document.createElement('div'));$l.appendTo('body');
				$l.addClass('lasso').css({position:'absolute',zIndex:1000,margin:0,padding:0,left:e.pageX+1,top:e.pageY+1,width:0,height:0}).data({x:e.pageX,y:e.pageY});
				$this.$lasso=$l;
			}
		});
		$('body').mousemove(function(e){
			if($this.$lasso){
				var p=$this.$lasso.position();
				var d=$this.$lasso.data();;
				var l=Math.min(e.pageX,d.x);
				var t=Math.min(e.pageY,d.y);
				var _p=getPosition(_this);
				l=Math.max(l,_p.left);
				t=Math.max(t,_p.top);
				var w=Math.abs(e.pageX-d.x);
				var h=Math.abs(e.pageY-d.y)
				if(l==d.x)w=Math.min(w,_p.right-d.x);
				if(t==d.y)h=Math.min(h,_p.bottom-d.y);
				if(l==_p.left)w=d.x-l;
				if(t==_p.top)h=d.y-t;
				$this.$lasso.css({left:l,top:t,width:w-1,height:h-1});
				var $s=$(o.filter,$this);$s.removeClass('ui-selected');
				var _l=$this.$lasso[0];
				for(var _i of $s){
					if(intersects(_i,_l))$(_i).addClass('ui-selected');
				}
			}
		}).mouseup(function(e){
			if($this.$lasso){
				$this.$lasso.remove();
				delete($this.$lasso);
				if(o.selected)o.selected(e);
			}
		});
		return this;
	}
})

$.fn.extend({
	menu:function(o){
		var _this=this;
		if(!$('body').attr('menued'))$('body').attr('menued',true).mousedown(()=>{$('.menu.contextmenu').remove()});
		var create=function(m,d){
			$('.menu.contextmenu').remove();
			if(!d){
				var d=document.createElement('ul');d.className='menu '+(o.contextmenu?'contextmenu ':' ')+(o.app||'');
				if(o.contextmenu)$(d).css({left:_this.event.pageX,top:_this.event.pageY,display:'block'})
				$('body').append(d);
			}
			for(let i in m){
				let mi=m[i];
				let li=document.createElement('li');
				let a=document.createElement('a');a.name=i;a.innerHTML=$.l10n.__(i);
				$(li).append(a).appendTo(d);
				if(i!=='upload')a.onmousedown=(e)=>setTimeout(()=>{var f=(mi.callback||mi);if(typeof(f)==='function')f(_this.event,e)},10);
				if(i==='upload'){var u=$.l10n.__('upload');var lb=document.createElement('label');$(lb).html(u);$(a).html(lb);var input=document.createElement('input');input.type='file';input.multiple='multiple';$(input).css({opacity:0,marginLeft:'-'+u.length+'em',width:u.length+'em',minWidth:150}).appendTo(a);input.onchange=function(e){(mi.callback||mi)(this.files)};}
				if(mi.child){
					let ul=document.createElement('ul');
					$(a).before(ul);
					create(mi.child,ul)
				}
			}
		}
		this.each(function(){
			if(o.contextmenu){
				let f=(e)=>{_this.event=e;e.stopPropagation();event.preventDefault();setTimeout(()=>{create(o.menu);if(o.onload)o.onload(e);},300)};
				$(this).on(o.dropdown?'mousedown':'contextmenu',o.target||null,f);
			}else{
				var d=document.createElement('ul');d.className='menu '+(o.app||'');
				create(o.menu,d);$(this).append(d);
			}
		});
		return this;
	}
})


var _layout=function(o,t){
	var g={
		init:function(){
			var $np,$sp,$ep,$wp,$n,$s,$e,$w,$t=$(t),$cp=$(o.center.pane);
			$t.addClass('layout');
			$cp.css({position:'absolute',left:o.west?o.west.size:0,top:o.north?o.north.size:0,width:$t[0].offsetWidth-(o.west?o.west.size:0)-(o.east?o.east.size:0),height:$t[0].offsetHeight-(o.north?o.north.size:0)-(o.south?o.south.size:0),overflow:'auto'});
			if(o.north){
				var $np=$(o.north.pane);
				$np.css({width:'100%',height:o.north.size,top:0});
				if(o.north.resizable){
					var $n=$(document.createElement('div'));
					$n.prependTo($t).css({zIndex:10,cursor:'n-resize',width:'100%',height:6,top:o.north.size-3})
					.draggable({containment:'parent',axis:'y',stop:(e,u)=>{var h=u.position.top-u.originalPosition.top;$np.height($np.height()+h);$cp.css({top:$np.height(),height:$cp.height()-h});if($ep)$ep.css({top:$np.height(),height:$ep.height()-h});if($wp)$wp.css({top:$np.height(),height:$wp.height()-h});if($e)$e.css({top:$np.height(),height:$e.height()-h});if($w)$w.css({top:$np.height(),height:$w.height()-h})}});
				}
			}
			if(o.south){
				var $sp=$(o.south.pane);
				$sp.css({width:'100%',height:o.south.size,bottom:0});
				if(o.south.resizable){
					var $s=$(document.createElement('div'));
					$s.prependTo($t).css({zIndex:10,cursor:'s-resize',width:'100%',height:6,bottom:o.south.size-3})
					.draggable({containment:'parent',axis:'y',stop:(e,u)=>{var h=u.originalPosition.top-u.position.top;$sp.height($sp.height()+h);$cp.css({top:$np.height(),height:$cp.height()-h});if($ep)$ep.css({top:$np.height(),height:$ep.height()-h});if($wp)$wp.css({top:$np.height(),height:$wp.height()-h});if($e)$e.css({top:$np.height(),height:$e.height()-h});if($w)$w.css({top:$np.height(),height:$w.height()-h})}});
				}
			}
			if(o.west){
				var $wp=$(o.west.pane);
				$wp.css({height:$t.height()-(o.north?o.north.size:0)-(o.south?o.south.size:0),width:o.west.size||220,left:0,top:o.north?o.north.size:0,overflow:'auto'});
				if(o.west.resizable||o.west.popable){
					var $w=$(document.createElement('div'));
					$w.addClass('resizer west').css({display:'flex','align-items':'center'}).html(o.west.popable?'<a class="pop"></a>':'').prependTo($t).css({position:'absolute',zIndex:10,cursor:'w-resize',height:$wp.height(),width:6,left:o.west.size-3,top:$np?$np.height():0});
					if(o.west.resizable)$w.draggable({containment:'parent',axis:'x',start:()=>$w.children().hide(),stop:(e,u)=>{$w.children().show();var w=u.position.left-u.originalPosition.left;$wp.width($wp.width()+w);$cp.css({left:u.position.left+3,width:$cp.width()-w})}});
					var $lp=$('.pop',$w);$lp.click(function(){var _w=$wp.data().width;if($w.hasClass('collapsed')){$wp.width(_w);$w.css({left:_w});$cp.css({left:_w,width:$cp.width()-$wp.width()})}else{{$wp.data().width=$wp.width();$cp.css({left:0,width:$cp.width()+$wp.width()});$wp.width(0);$w.css({left:0});}}$w.toggleClass('collapsed');});
					if($wp.width()>$cp.width()){$w.removeClass('collapsed');$lp.click();}
				}
			}
			if(o.east){
				var $ep=$(o.east.pane);
				$ep.css({height:$t.height()-(o.north?o.north.size:0)-(o.south?o.south.size:0),width:o.east.size,left:'auto',right:0,top:o.north?o.north.size:0,overflow:'auto'});
				if(o.east.resizable){
					var $e=$(document.createElement('div'));
					$e.prependTo($t).css({zIndex:10,cursor:'e-resize',height:$ep.height(),width:6,right:o.east.size-3,top:$np?$np.height():0})
					.draggable({containment:'parent',axis:'x',stop:(e,u)=>{var w=u.originalPosition.left-u.position.left;$ep.width($ep.width()+w);$cp.css({width:$cp.width()-w})}});
				}
			}
			$cp.mousedown(function(){
				if($w&&!$w.hasClass('collapsed')&&$wp.width()>$cp.width())$lp.click();
			});
			$('>*',t).css({boxSizing:'border-box'});
			(window===top?$t:$(window)).resize(()=>{let w=$t[0].offsetWidth-($wp?$wp.width():0)-($ep?$ep.width():0),h=$t[0].offsetHeight-($np?$np.height():0)-($sp?$sp.height():0);$cp.width(w).height(h);if($wp)$wp.height(h);if($w)$w.height(h);if($ep)$ep.height(h);if($e)$e.css({left:'auto',right:$ep.width()+3,height:h});});
		}
	}
	g.init()
	return g;
}
$.fn.extend({
	layout:function(o){
		this.each(function(){
			return _layout(o,this);
		});
	}
})

var _tag=function(o,t){
	var g={
		init:function(){
			$('.title a',t).click(function(){
				$('.content>*',t).hide();
				$('.title a.selected',t).removeClass('selected');
				$(this).addClass('selected');
				var h=$(this).attr('href');
				if(h&&h!=''){
					if(h.indexOf('.')>-1){
						h=h.replace('#','');
						var $f=$('iframe[src="'+h+'"]',t);
						if(!$f[0]){
							$f=$(document.createElement('iframe'));
							$f.attr('src',h);
							$f.appendTo(t);
						}
						$f.show();
					}else{
						$(h,t).show();
					}
				}
			});
			$('.title a:first',t).click();
		}
	}
	g.init()
	return g;
}
$.fn.extend({
	tag:function(o){
		this.each(function(){
			return _tag(o,this);
		});
	}
})
$(function(){$('.tag').tag();})