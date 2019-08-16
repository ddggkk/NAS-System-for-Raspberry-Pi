function init(){
	layout();
	_open();
}

function layout(){
	$('body').css({width:'100%',height:'100%'})
}

function _open(f){
	if(!f)f=WINDOW.param;
	if(typeof(f)==='string'){
		var n=OS.path.basename(f),d=OS.path.dirname(f),p=OS.path.getFolderProp(d)||[OS.path.getProp(f)],imgs=[],_i=0;
		for(var i of p){if(i.mime==='image'){imgs.push(DOMAIN+d+i.name);if(i.name===n)_i=imgs.length-1;}}
		new imageViewer(imgs,_i);
	}else{
		new imageViewer(f.items,f.index);
	}
}

function drop(p){
	var f=OS.path.getDrop(p);
	_open(f[0]);
}

class imageViewer{
	constructor(imgs,i){
		$('body').html('<img id="helper" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" /><div id="main" style="width:100%;height:100%;"></div><div id="tool" style="position:absolute;z-index:10;width:200px;height:50px;background:rgba(0,0,0,.5);margin-left:calc(calc(100% - 200px)/2);bottom:0;text-align:center;"><a id="prev">¥</a><a id="rotate">z</a><a id="next">¦</a></div>');
		$('body a').css({display:'inline-block',width:50,height:50,fontFamily:'box',fontSize:'24px',lineHeight:'50px',color:'#fff',cursor:'pointer'})
		$('#prev').click(()=>this.prev());
		$('#next').click(()=>this.next());
		$('#rotate').click(()=>this.rotate());
		this.imgs=imgs;
		this.helper=$('#helper')[0]
		this.index=i||0;
		this.length=this.imgs.length;
		this.$container=$('#main');
		this.container=this.$container[0];
		this.$container.on('mousewheel',(e)=>{
			this.$cur.removeClass('fit');
			if(e.originalEvent.wheelDelta>0)this.zoomIn(e);
			else this.zoomOut(e);
		}).on('dblclick',()=>{
			this.$cur.addClass('fit');
			$(window).resize();
		});
		$(window).resize(()=>{
			var W=this.container.offsetWidth,H=this.container.offsetHeight,w=this.cur.origWidth,h=this.cur.origHeight;
			if(this.$cur.hasClass('fit')){
				var _w=Math.min(W,w),_h=_w*h/w;if(_h>H){_h=H;_w=w*_h/h;}
				this.$cur.css({width:_w,height:_h,left:`${(W-_w)/2}px`,top:`${(H-_h)/2}px`});
			}
		});
		this.init();
	}
	init(){
		$('#next,#prev').css({opacity:1});if(this.index>=this.length-1)$('#next').css({opacity:.5});if(this.index===0)$('#prev').css({opacity:.5});
		var i=this.imgs[this.index];
		WINDOW.setCaption(WINDOW.app.caption+' - '+OS.path.basename(i));
		this.cur=new Image();this.cur.src=i;this.cur.draggable='true';
		this.$cur=$(this.cur);
		this.$container.html(this.cur);
		this.cur.onload=()=>{
			this.cur.origWidth=this.cur.width;this.cur.origHeight=this.cur.height;
			this.$cur.css({position:'absolute',cursor:'-webkit-grab'}).addClass('fit');$(window).resize();
		}
		this.$cur.on('dragstart',(e)=>{
			e.originalEvent.dataTransfer.setDragImage(this.helper,0,0);
			this.$cur.removeClass('fit');this.cur.x0=this.cur.offsetLeft;this.cur.y0=this.cur.offsetTop;this.cur._x=e.clientX;this.cur._y=e.clientY;
		}).on('drag',(e)=>{
			if(e.clientX<0||e.clientY<0||e.clientX>this.container.offsetWidth||e.clientY>this.container.offsetHeight)return false;
			var x0=this.cur.x0,y0=this.cur.y0,x=x0+e.clientX-this.cur._x,y=y0+e.clientY-this.cur._y;this.$cur.css({left:x,top:y});
		})
	}
	zoomIn(e){
		this.zoom(1.25,e.clientX,e.clientY);
	}
	zoomOut(e){
		this.zoom(4/5,e.clientX,e.clientY)
	}
	zoom(n,x,y){
		var w=this.cur.offsetWidth*n,h=this.cur.offsetHeight*n;
		if(w<100||h<100||w>this.cur.origWidth*8||h>this.cur.origHeight*8)return;
		this.$cur.css({width:w, height:h});
		var x0=this.cur.offsetLeft,y0=this.cur.offsetTop,xn=x-x0,yn=y-y0;
		this.$cur.css({left:x0-(n-1)*xn,top:y0-(n-1)*yn});
	}
	prev(){
		if(this.index<=0)return;
		this.index--;
		this.init();
	}
	next(){
		if(this.index>=this.length-1)return;
		this.index++;
		this.init();
	}
	rotate(){
		if(!this.cur.r)this.cur.r=0;this.cur.r+=90;
		this.$cur.css({transform:'rotate('+this.cur.r+'deg)'});
	}
}