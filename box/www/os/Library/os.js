$(function(){window.OS=new os();})
class os{
	constructor() {
		if(isMobile){$('body').on('touchstart',function(){if(!(document.fullscreen||document.webkitIsFullScreen||document.mozIsFullScreen||document.msIsFullScreen)){try{document.documentElement.requestFullScreen();}catch(e){};try{document.documentElement.mozRequestFullScreen();}catch(e){};try{document.documentElement.webkitRequestFullScreen();}catch(e){};try{document.documentElement.msRequestFullScreen();}catch(e){};}})}
		if(localStorage.power){this.reload();return;}
		this.name='box';
		this.storage='file:///'+DEVINFO.storage+'/storage/'
		this.$win=$('body');
		this.desktop=new desktop();
		this.alert=(o)=>{return this.desktop.win.alert(o)}
		this.confirm=(o,c,k)=>{return this.desktop.win.confirm(o,c,k)}
		this.prompt=(m,p,t,c)=>{return this.desktop.win.prompt(m,p,t,c)}
		this.progress=(m,c)=>{return this.desktop.win.progress(m,c)}
		this.print=(c)=>{if(!this.printFrame){var f=document.createElement('iframe');$(f).appendTo('body').hide();this.printFrame=f.contentWindow;}this.printFrame.document.body.innerHTML='';this.printFrame.document.write('<pre>'+c+'</pre>');this.printFrame.print();}
		this.logout=()=>{OS.confirm($.l10n.__('logouttext'),(e)=>{if(e){API.logout()}})}
		this.reboot=()=>{OS.confirm($.l10n.__('reboottext'),(e)=>{if(!e){return};API.auth.reboot({nowaiting:true});localStorage.power='loading';this.reload();})}
		this.poweroff=()=>{OS.confirm($.l10n.__('powerofftext'),(e)=>{if(!e){return};API.auth.poweroff();localStorage.power='off';this.reload();})}
		this.passwd=()=>{OS.confirm('<table class="table changepass"><tr><td>'+$.l10n.__('newpass')+'</td><td><input type="password"/></td></tr><tr><td>'+$.l10n.__('confirmpass')+'</td><td><input type="password"/></td></tr><tr><td></td><td></td></tr></table>',(e)=>{if(!e){return};var $p=$('table.table.changepass');var p1=$.trim($('input:first',$p).val());var p2=$.trim($('input:last',$p).val());if(p1===p2&&p1!==''){API.auth.passwd({data:{pass:p1},success:()=>e.close()});}else{$('td:last',$p).html($.l10n.__('checkinput'))}},true)}
		this.path=new path();
		this.apps=[];this.loadApps();
		this.clipboard={};
		this.loaddevinfo();
	}
	loaddevinfo(){
		API.info.base({data:{_:new Date().getTime()},success:(j)=>{
			DEVINFO=j;sessionStorage.devinfo=JSON.stringify(j);
			document.title=j.hostname;this.storage='file:///'+j.storage+'/storage/';
		}});
	}
	reload(){
		$('html').css({background:'#000'});
		if(localStorage.power==='loading'){
			$('body').empty().css({background:'#000'});
			$('body').html('<progress style="width:100%;height:5px;position:fixed;border:none;"></progress>');
			var i=0;setInterval(()=>{i+=0.001;if(i>=1){i=0;}$('progress').val(i);},10);
			setInterval(()=>API.info.status({nowaiting:true,success:()=>location='../index.html'}),3000);
		}
		if(localStorage.power==='off'){
			$('body').css({overflow:'hidden'}).animate({opacity:0},3000,()=>$('body').html('$').css({opacity:1,background:'none',fontFamily:'box',fontSize:'22px',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}));
		}
	}
	loadApps(){
		API.info.getapps({
			success:(json)=>{
				for(i in json){
					var j=json[i]
					for(let a of j){
						if(a.options.admin&&!USERINFO.admin){continue;}
						this[a.name]=new app(a,i);
						if(a.options.startmenu!==false){this.apps.push(this[a.name]);}
					}
				}
			}
			,error:()=>{}
		});
	}
}

class app{
	constructor(n,d){
		if(typeof(n)==='string'){n={name:n}}
		this.name=n.name;
		this.path=`${d}/${this.name}/`;
		this.icon=`${d}/${this.name}/icon.svg`;
		this.conf=`${d}/${this.name}/conf.json`;
		this.url=`${d}/${this.name}/index.html`;
		this.caption=this.caption?typeof(this.caption)==='string'?this.caption:this.caption[LANGUAGE]?this.caption[LANGUAGE]:this.caption['en']:this.name
		if(n.options){this.set(n.options)}
	}
	load(fo,wo){
		if(this.win){this.win.active();let o=fo,w=this.win;if(this.options.init){eval(this.options.init);}return;}
		if(this.options){this.init(fo,wo);return;}
		if(this.state&&this.state==='loading'){var i=setInterval(()=>{if(this.state==='loaded'){this.load(fo,wo);clearInterval(i);}},100);return;}
		this.state='loading';
		$.getJSON(this.conf,(o)=>{this.state='loaded';this.set(o);this.init(fo,wo);});
	}
	set(o){
		var o=$.extend({
			app:this
			,caption:this.name
			,url:o.content||o.content===''?'':this.url
			,width:800
			,height:600
			,onclose:()=>{if(this.win){delete(this.win)}}
		},o);
		if(typeof(o.caption)==='object'){o.caption=o.caption[LANGUAGE]||o.caption['en'];}
		this.caption=o.caption;
		this.options=o;
	}
	init(o,wo){
		if(this.options.admin&&!USERINFO.admin){OS.alert($.l10n.__('needadmin'));return;}
		if(this.options.css){loadCSS(this.path+this.options.css);}
		var w=new win(o,$.extend(wo,this.options));
		if(this.options.unique||!this.options.multiwin){this.win=w;}
		if(this.options.init){eval(this.options.init);}
		return w;
	}
}

class desktop{
	constructor(o){
		this.draw();
	}
	draw(){
		$('html,body').css({width:'100%',height:'100%',margin:0,padding:0,overflow:'hidden','-moz-user-select':'none','-webkit-user-select':'none'});
		this.draghelper=document.createElement('div');this.draghelper.style.cssText='position:absolute;left:-1000px;top:-1000px;width:84px;height:84px;background-repeat:no-repeat;background-position:center center;background-size:contain;';
		this.$children=$(document.createElement('div'));
		this.$panel=$(document.createElement('div'));
		this.panel = new panel({container:this.$panel});
		this.$panel.append(this.panel.$dom);var _e=(e)=>{e.stopPropagation();e.preventDefault();}
		$('body').css({background:'url("'+DOMAIN+'desktop:///.background") no-repeat center center/cover'}).append([this.$children,this.$panel,this.draghelper]).on('contextmenu',()=>{return false});$('body > *').css({position:'fixed'}).on('dragover',(e)=>{return _e(e)}).on('dragenter',(e)=>{return _e(e)}).on('dragleave',(e)=>{return _e(e)}).on('drop',(e)=>{return _e(e)});
		setTimeout(()=>{this.win=new win({},{desktop:true,app:OS});$('body').append([this.win.$topwin,this.win.$modal]);this.load()},50);
		$(window).resize(()=>this.panel.set());
		$('body').mousedown((e)=>{var $ps=$(e.target).parentsUntil('.win.app.active');if($ps[$ps.length-1]==document.documentElement)$('.win.app.active').removeClass('active');})
	}
	load(){
		if(!isMobile){new fileManager({isdesktop:true},this.win);}
	}
	show(){
		this.$children.show();
	}
	hide(){
		this.$children.hide();
	}
	background(p){
		$('body').css({backgroundImage:'url("'+DOMAIN+p+'")'});
		API.files.setbackground({data:{path:p}})
	}
}

class panel{
	constructor(o){
		o=$.extend({
			size:40
			,position:'bottom'
			,autohide:false
			,lock:false
			,container:''
		},o);
		this.options=o;
		this.size=o.size;
		this.draw();
		this.set();
	}
	draw(){
		var $b=$('body');
		var w=$b.width(),h=$b.height(),s=this.options.size,s1=this.options.size*2;
		this.$dom=$(document.createElement('div'));
		this.$taskbar=$(document.createElement('div'));this.$taskbar.css({flexGrow:99,overflow:'hidden'}).addClass('taskbar');if(isMobile){this.$taskbar.hide();}
		this.$mainmenu=$(document.createElement('div'));this.$mainmenu.addClass('mainmenu icon');
		this.$taskview=$(document.createElement('div'));this.$taskview.addClass('taskview icon');
		this.$mount=$(document.createElement('div'));this.$mount.addClass('mount icon');
		this.$time=$(document.createElement('div'));this.$time.addClass('time icon');
		this.$temp=$(document.createElement('div'));this.$temp.addClass('temp icon');
		this.$bluetooth=$(document.createElement('div'));this.$bluetooth.addClass('bluetooth icon');
		this.$wifi=$(document.createElement('div'));this.$wifi.addClass('wifi icon');
		this.$notification=$(document.createElement('div'));this.$notification.addClass('notification icon');
		this.$preferences=$(document.createElement('div'));this.$preferences.addClass('preferences icon');
		this.$showdesktop=$(document.createElement('div'));this.$showdesktop.addClass('showdesktop icon');
		this.$quit=$(document.createElement('div'));this.$quit.addClass('quit icon');
		this.$power=$(document.createElement('div'));this.$power.addClass('power icon');
		this.$menu=$(document.createElement('div'));this.$menu.css({position:'fixed',width:'auto',height:'auto'}).addClass('menu').hide();
		this.$mainmenu_menu=$(document.createElement('div'));this.$mainmenu_menu.css({position:'fixed'}).addClass('mainmenu menu').hide();if(isMobile)this.$mainmenu_menu.css({width:'100%',height:'calc(100% - '+this.options.size+'px)'});
		this.$notification_menu=$(document.createElement('div'));this.$notification_menu.css({position:'fixed'}).addClass('notification menu').hide();
		this.$dom.addClass('panel').css({position:'fixed',display:'flex',fontSize:0})
		.append([this.$mainmenu,this.$taskview,isMobile?'':this.$showdesktop,this.$taskbar,USERINFO.admin?this.$preferences:'',this.$quit,USERINFO.admin?this.$bluetooth:'',USERINFO.admin?this.$wifi:'',this.$quit,this.$time,USERINFO.admin?this.$power:'',this.$menu,this.$mainmenu_menu,this.$notification_menu])
		.appendTo(this.options.container)
		.draggable({helper:'clone',opacity:0.001,start:()=>{addMask();},stop:(e)=>{clearMask();this.set((e.pageX<s1&&e.pageY>s1&&e.pageY<h-s1)?'left':(e.pageX>w-s1&&e.pageY>s1&&e.pageY<h-s1)?'right':(e.pageX>s1&&e.pageX<w-s1&&e.pageY<s1)?'top':(e.pageX>s1&&e.pageX<w-s1&&e.pageY>h-s1)?'bottom':this.options.position)}});
		$('>.icon',this.$dom).css({width:s,height:s});
		$('>.menu',this.$dom).css({whiteSpace:'nowrap'});
		this.$menus=$('>.menu',this.$dom);$b.mousedown((e)=>{setTimeout(()=>{this.$menus.hide()},100);});
		this.$mainmenu.mousedown((e)=>{setTimeout(()=>this.showMainMenu(),300);});
		this.$bluetooth.mousedown((e)=>{setTimeout(()=>this.showBluetoothMenu(),300);});
		this.$wifi.mousedown((e)=>{setTimeout(()=>this.showWifiMenu(),300);});
		this.$time.html(dateTimeToString(new Date(DEVINFO.time),'hh:mm')).mousedown((e)=>{setTimeout(()=>this.showTime(),300);});setInterval(()=>{DEVINFO.time+=1000;this.$time.html(dateTimeToString(new Date(DEVINFO.time),'hh:mm'))},1000)
		this.$notification.mousedown((e)=>{setTimeout(()=>this.showNotificationMenu(),300);});
		this.$temp.mousedown((e)=>OS.Temperature.load());
		this.$preferences.mousedown((e)=>OS.Preferences.load());
		this.$quit.mousedown((e)=>{setTimeout(()=>this.showQuitMenu(),300);});
		this.$power.mousedown((e)=>{setTimeout(()=>this.showPowerMenu(),300);});
		this.$taskview.mousedown((e)=>{setTimeout(()=>this.showTaskview(),300);});
		this.$showdesktop.mousedown((e)=>{setTimeout(()=>OS.desktop.win.$children.toggle(),100);});
		$(window).resize(()=>{this.set()});
	}
	set(p){
		if(!p){p=this.options.position;}
		if(isMobile){p='bottom';}
		this.options.position=p;
		var $b=$('body');
		var s=this.size;
		var w=$b.width();
		var h=$b.height();
		var $mw=$('.win.maxed');
		switch(p){
			case 'top':
				this.$dom.css({flexDirection:'row',width:w,height:s,left:0,top:0});
				this.$menu.css({top:s,right:'auto',bottom:'auto'});
				this.$mainmenu_menu.css({left:0,top:s,bottom:'auto'});
				this.$notification_menu.css({right:0,top:s,height:`calc(100% - ${s}px)`});
				$mw.css({left:0,top:s,width:w,height:h-s});
			break;
			case 'bottom':
				this.$dom.css({display:'flex',flexDirection:'row',width:w,height:s,left:0,top:'auto',bottom:0});
				this.$menu.css({bottom:s,top:'auto',right:'auto'});
				this.$mainmenu_menu.css({left:0,bottom:s,right:'auto',top:'auto'});
				this.$notification_menu.css({right:0,top:0,height:`calc(100% - ${s}px)`});
				$mw.css({left:0,top:0,width:w,height:h-s});
				if(isMobile){var $i=$('>.icon',this.$dom),l=$i.length;$i.css({width:w/l})}
			break;
			case 'left':
				this.$dom.css({display:'flex',flexDirection:'column',width:s,height:h,left:0,top:0});
				this.$menu.css({left:s,right:'auto',bottom:'auto'});
				this.$mainmenu_menu.css({left:s,top:0,right:'auto',bottom:'auto'});
				this.$notification_menu.css({right:0,top:0,height:'100%'});
				$mw.css({left:s,top:0,width:w-s,height:h});
			break;
			case 'right':
				this.$dom.css({display:'flex',flexDirection:'column',width:s,height:h,left:'auto',right:0,top:0});
				this.$menu.css({left:'auto',right:s,bottom:'auto'});
				this.$mainmenu_menu.css({top:0,right:s,left:'auto',bottom:'auto'});
				this.$notification_menu.css({right:s,top:0,height:'100%'});
				$mw.css({left:0,top:0,width:w-s,height:h});
			break;
		}
	}
	showMainMenu(){
		this.$mainmenu_menu.toggle();
		this.$mainmenu_menu.empty();
		for(let a of OS.apps){
			let $d=$(document.createElement('div'));
			$d.html(a.caption).css({backgroundImage:`url(${a.icon})`});
			this.$mainmenu_menu.append($d);
			$d.mousedown(()=>{a.load();});
		}
	}
	showTime(){
		this.$menu.html('');
		API.info.gettime({success:(j)=>{
			DEVINFO.time=new Date(j.time);
			var s=dateTimeToString(DEVINFO.time,'YYYY/M/D hh:mm:ss').split(' ');
			this.$menu.html('<div style="text-align:center;"><div style="font-size:48px;">'+s[1]+'</div><div style="font-size:14px;">'+s[0]+'</div></div>').show();
			this.setMenu(this.$time);
		}});
	}
	showWifiMenu(){
		this.$menu.html('');
		API.info.getnetwork({success:(j)=>{
			for(var a of j.adapter){
				if(!a.list)continue;
				var h=[];
				for(var i of a.list){
					h.push('<div class="'+(a.essid===i.essid?'selected':'')+'" name="'+a.name+'" essid="'+i.essid+'" encryption="'+i.encryption+'" key="'+i.key+'"><label style="display:block;width:100%">'+i.essid+(a.essid===i.essid&&a.ipaddr!==''?(' ['+a.ipaddr+']'):'')+'</label><span style="display:none">'+(i.key=='off'?'':'<input placeholder="'+$.l10n.__('password')+'" style="width:100%"><br>')+'<button>'+$.l10n.__('connect')+'</button></span></div>');
				}
				this.$menu.html(h.join(''));
			}
			$('*',this.$menu).mousedown((e)=>{e.stopPropagation();})
			$('label',this.$menu).mousedown((e)=>{
				$('span',this.$menu).hide();
				if($(e.target.parentNode).hasClass('disabled'))return;
				$('span',e.target.parentNode).show();
			});
			$('button',this.$menu).mousedown((e)=>{
				this.$menu.hide();
				var $e=$(e.target.parentNode.parentNode),k=$e.attr('key'),v=$.trim($('input',$e).val());
				if(k=='off')v='none';if(v=='')return;
				API.info.setnetwork({data:{name:$e.attr('name'),dhcp:true,essid:$e.attr('essid'),psk:v}});
			});
			this.$menu.show();
			this.setMenu(this.$wifi);
		}});
	}
	showBluetoothMenu(){
		this.$menu.html('');
		API.info.getbluetooth({data:{pid:this.bluetooth_pid||''},success:(j)=>{
			this.bluetooth_pid=j.pid;
			for(var a of j.dev){
				var h=document.createElement('div');h.data=a;h.className=a.Paired==='0'?'':'selected';
				h.innerHTML='<label style="display:block;width:100%">'+a.Name+'</label><span style="display:none">'+(a.Paired=='0'?'':'<button dev="'+a.Address+'" name="'+(a.Connected=='0'?'connect':'disconnect')+'">'+$.l10n.__(a.Connected=='0'?'connect':'disconnect')+'</button>')+'<button dev="'+a.Address+'" name="'+(a.Paired=='0'?'pair':'unpair')+'">'+$.l10n.__(a.Paired=='0'?'pair':'unpair')+'</button></span></div>';
				this.$menu.append(h);
			}
			$('*',this.$menu).mousedown((e)=>{e.stopPropagation();})
			$('label',this.$menu).mousedown((e)=>{
				$('span',this.$menu).hide();
				if($(e.target.parentNode).hasClass('disabled'))return;
				$('span',e.target.parentNode).show();
			});
			$('button',this.$menu).mousedown((e)=>{
				this.$menu.hide();
				var a=$(e.target).attr('name'),m=$(e.target).attr('dev');
				API.info[a+'bluetooth']({data:{dev:m}});
			});
			this.$menu.show();
			this.setMenu(this.$wifi);
		}});
	}
	showNotificationMenu(){
		this.$notification_menu.toggle();
		this.$notification_menu.empty();
	}
	showQuitMenu(){
		this.$menu.html('<div class="passwd">'+$.l10n.__('changepass')+'</div><div class="logout">'+$.l10n.__('logout')+'</div>');
		$('span',this.$menu).mousedown((e)=>{e.stopPropagation();this.$menu.hide();})
		$('.passwd',this.$menu).mousedown(()=>OS.passwd());
		$('.logout',this.$menu).mousedown(()=>OS.logout());
		this.$menu.show();
		this.setMenu(this.$quit);
	}
	showPowerMenu(){
		this.$menu.html('<div class="reboot">'+$.l10n.__('reboot')+'</div><div class="poweroff">'+$.l10n.__('poweroff')+'</div>');
		$('span',this.$menu).mousedown((e)=>{e.stopPropagation();this.$menu.hide();})
		$('.reboot',this.$menu).mousedown(()=>OS.reboot());
		$('.poweroff',this.$menu).mousedown(()=>OS.poweroff());
		this.$menu.show();
		this.setMenu(this.$power);
	}
	showTaskview(){
		if($('body').hasClass('taskview')&&OS.desktop.curwin){OS.desktop.curwin.active();return}$('body').addClass('taskview');
		var W=$('body').width(),H=$('body').height(),$w=$('.win.app'),i=1,_m=1,n=$w.length,s=10,l=0,_l=s,t=0,w=0,h=0,_w=isMobile?W*.8:400,_h=isMobile?_w*H/W:300,_p=_w/_h,c=Math.floor((W-s)/(_w+s)),r=Math.ceil(n/c);
		var m=function(){_w=_w-_m;_h=_w/_p;c=Math.floor((W-s)/(_w+s));r=Math.ceil(n/c);if(r*(_h+s)>(H-s)){m();}};if(r*_h>H){m();}
		l=(W+s-(_w+s)*Math.min(n,c))/2;t=Math.max((H+s-r*(_h+s))/2,s);_l=l;
		$w.each(function(){
			var $t=$(this);var v=$(this).is(':visible');$(this).css({overflow:'hidden'}).show();this.originalPosition=$t.position();this.originalPosition.visible=v;
			w=$t.width();h=$t.height();var w2=0,h2=0,p=(w/h>=_p)?_w/w:_h/h;if(w/h<_p){w2=(_w-w*p)/2}else{h2=(_h-h*p)/2};
			$t.removeClass('active').css({transform:'scale('+p+')',left:l-w*(1-p)/2+w2,top:t-h*(1-p)/2+h2});l=l+_w+s;
			if(i%c===0){l=_l;t=t+_h+s;}i++;
		});
	}
	addTask(win){
		if(win.app===OS)return;
		var $w=$('.'+win.appname,this.$taskbar);
		if(!$w[0]){
			var $w=$(document.createElement('div'));
			$w.addClass(win.appname+' icon').css({display:'inline-block',width:this.size,height:this.size,backgroundRepeat:'no-repeat',backgroundPosition:'center center','background-size':`$(this.size)px ${this.size}px`,backgroundImage:`url(${win.icon})`});
			this.$taskbar.append($w);
			$w.click((e)=>this.showTask(e,$w));
		}
		if(!$w.data().tasks){$w.data().tasks=[];}
		$w.data().tasks.push(win);
		win.$taskbar=$w;
	}
	showTask(e,$w){
		e.stopPropagation();
		this.$menus.hide();
		this.$menu.empty();
		if($w.data().tasks.length===1){
			let w=$w.data().tasks[0];
			if(w.$win.hasClass('active')){w.min();}
			else{w.active();}
		}else{
			for(let w of $w.data().tasks){
				let $d=$(document.createElement('div'));
				let $s=$(document.createElement('span'));$s.addClass('close');
				$s.click((e)=>{e.stopPropagation();w.close();$d.remove();})
				$d.html([$s,w.caption]).mousedown((e)=>{e.stopPropagation();this.$menu.hide();w.active();});
				this.$menu.append($d);
			}
			this.$menu.show();
			this.setMenu($w);
		}
	}
	setMenu(i){
		switch(this.options.position){
			case 'top':case 'bottom':
				var w=$('body').width(),_w=this.$menu.width(),l=i.position().left;
				if(l+_w>=w){this.$menu.css({left:'auto',right:0});}
				else{this.$menu.css({left:l,right:'auto'});}
			break;
			case 'left':case 'right':
				var h=$('body').height(),_h=this.$menu.height(),t=i.position().top;
				if(t+_h>=h){t=h-_h;}
				this.$menu.css({top:t});
			break;
		}
	}
	removeTask(win){
		if(!win.$taskbar)return;
		var t=win.$taskbar.data().tasks,_t=[];
		for(var w of t){if(!w.closed){_t.push(w);}}
		if(_t.length===0){win.$taskbar.remove();}
	}
	activeTask(win){
		if(!win.$taskbar){return;}
		$('.selected',this.$taskbar).removeClass('selected');
		win.$taskbar.addClass('selected');
	}
	deactiveTask(win){
		if(!win.$taskbar){return;}
		win.$taskbar.removeClass('selected');
	}
}

class win{
	constructor(fo,wo){
		if(!fo){fo={};}if(!wo){wo={};}
		if(wo&&wo.id){var _id=$('#'+wo.id)[0];if(_id&&_id.win){_id.win.active();return}}
		if(!wo.parent){wo.parent=OS.desktop.win||OS.desktop;}
		var $p=wo.parent.$win||$('body');$p.show()
		var w=$p.width(),h=$p.height();
		this.param=fo;
		if(isMobile&&wo.popup){wo.center=true;wo.width=Math.min(wo.width,w-40);wo.height=Math.min(wo.height,h-40);}
		this.options=$.extend({
			id:new Date().getTime()
			,caption:''
			,content:''
			,url:''
			,left:wo.left||wo.center?(w-(wo.width||600))/2:rand(0,w-(wo.width||600))
			,top:wo.top||wo.center?(h-(wo.height||400))/2:rand(0,h-(wo.height||400))
			,width:600
			,height:400
			,min_width:300
			,min_height:200
			,center:false
			,resizable:true
			,draggable:true
			,min_button:true
			,max_button:true
			,close_button:true
			,ontop:false
			,type:'normal'
			,maxed:false
			,mined:false
			,onload:null
			,onclose:null
			,onactive:null
			,ondeactive:null
			,onresize:null
			,ondrag:null
		},wo);
		this.caption=this.options.caption;
		this.app=wo.app;
		this.appname=wo.app?wo.app.name:'';
		this.icon=wo.app?wo.app.icon:'';
		this.parent=this.options.parent;
		this.state=this.options.state;
		this.$win=$(document.createElement('div'));this.$win.attr('id',this.options.id).addClass('win '+(wo.app?wo.app.desktop?'desktop ':'app ':'')+(this.appname)+(this.options.classname||'')).css({position:'absolute',width:this.options.width,height:this.options.height,top:this.options.top<0?0:this.options.top,left:this.options.left<0?0:this.options.left,overflow:'visible'});this.$win[0].win=this;
		this.$caption=$(document.createElement('div'));this.$caption.addClass('caption');
		this.$top=$(document.createElement('div'));this.$top.addClass('n border');
		this.$bottom=$(document.createElement('div'));this.$bottom.addClass('s border');
		this.$left=$(document.createElement('div'));this.$left.addClass('w border');
		this.$right=$(document.createElement('div'));this.$right.addClass('e border');
		this.$top_left=$(document.createElement('div'));this.$top_left.addClass('nw border');
		this.$top_right=$(document.createElement('div'));this.$top_right.addClass('ne border');
		this.$bottom_left=$(document.createElement('div'));this.$bottom_left.addClass('sw border');
		this.$bottom_right=$(document.createElement('div'));this.$bottom_right.addClass('se border');
		this.$control=$(document.createElement('div'));this.$control.addClass('control');this.$control.css({zIndex:1});
		if(this.options.close_button){this.$close=this.options.close_button?$(document.createElement('div')):null;if(this.$close){this.$close.addClass('close');}}
		if(this.options.max_button){this.$max=this.options.max_button?$(document.createElement('div')):null;if(this.$max){this.$max.addClass('max');}if(isMobile){this.$max.hide();}}
		if(this.options.min_button){this.$min=this.options.min_button?$(document.createElement('div')):null;if(this.$min){this.$min.addClass('min');}}
		this.$content=$(document.createElement('div'));this.$content.addClass('content');this.$content.css({zIndex:2});
		this.$frame=$(document.createElement('iframe'));this.$frame.addClass('content');this.$frame.css({zIndex:2});
		this.$mask=$(document.createElement('div'));this.$mask.addClass('mask').css({zIndex:3,background:'rgba(0,0,0,0)'});
		this.$waiting=$(document.createElement('div'));this.$waiting.addClass('waiting').css({zIndex:3,display:'none'});
		this.$children=$(document.createElement('div'));this.$children.addClass('children').css({zIndex:4});
		this.$topwin=$(document.createElement('div'));this.$topwin.addClass('topwin').css({zIndex:5});if(this.options.desktop)this.$topwin.css({position:'fixed',left:0,top:0});
		this.$modal=$(document.createElement('div'));this.$modal.addClass('modal').css({zIndex:6});
		if(typeof(this.options.onload)==='string'){eval('this.options.onload='+this.options.onload);}
		this.child=(o)=>{return new win($.extend({parent:this},o));}
		this.modal=(o)=>{return new win($.extend({parent:this},o));}
		this.alert=(o)=>{return new alert_win({content:o,parent:this});}
		this.confirm=(o,c,k)=>{return new confirm_win({content:o,callback:c,parent:this,keep:k});}
		this.prompt=(m,p,t,c)=>{return new prompt_win({caption:m,pre:p,content:t,callback:c,parent:this});}
		this.progress=(m,c)=>{return new progress_win({caption:m,callback:c,parent:this});}
		this.dialog=(o)=>{return new dialog_win($.extend({parent:this},o));}
		this.open=(o)=>{return this.dialog({left:10,top:30,caption:$.l10n.__('open'),classname:'files',onload:(_w)=>{var _o=$.extend({button:'open'},o);new fileManager(_o,_w)}})}
		this.opendir=(o)=>{return this.dialog({left:10,top:30,width:400,caption:$.l10n.__('open'),classname:'files',onload:(_w)=>{var _o=$.extend({filter:'folder'},o);new fileManager(_o,_w)}})}
		this.save=(o)=>{return this.dialog({left:10,top:30,caption:$.l10n.__('save'),classname:'files',onload:(_w)=>{var _o=$.extend({button:'save',single:true},o);new fileManager(_o,_w)}})}
		this.draw();this.load();this.active();
	}
	draw(){
		var $b=$('body');
		switch(this.options.type){case 'modal':this.$container=this.parent.$modal;break;case 'top':this.$container=this.parent.$topwin;break;default:this.$container=this.parent.$children;break;}
		if(this.options.desktop){this.$win.append([this.$content,this.$frame,this.$children,this.$modal,this.$topwin]).addClass('maxed').css({left:0,top:0,width:$b.width(),height:$b.height(),background:'none',border:'none',opacity:1}).show().appendTo(this.$container);this.$content.css({top:0,width:'100%',height:'100%'});}
		else{this.$win.append([this.$top,this.$bottom,this.$left,this.$top_right,this.$top_left,this.$top_right,this.$bottom_left,this.$top_right,this.$caption,this.$control,this.$content,this.$frame,this.$mask,this.$waiting,this.$children,this.$modal,this.$topwin]).appendTo(this.$container);this.$control.append([this.$min||'',this.$max||'',this.$close||'']).appendTo(this.$win);this.$caption.html(this.options.caption);}
		$('>*',this.$win).css({position:'absolute'});
		if((isMobile&&!this.options.popup)||(this.options.maxed&&this.$max&&!this.options.desktop)){this.max();}
		if(this.options.mined&&this.$min&&!this.options.desktop){this.min();}
		if(this.options.draggable&&!this.options.desktop)this.$win.draggable({start:()=>{if(this.state===2)return false;addMask()},stop:()=>{this.store();clearMask();},drag:(e,u)=>{let w=$b.width(),h=$b.height();if(e.pageX===0||e.pageX===w)u.position.left0=u.position.left;if(e.pageY===0||e.pageY===h)u.position.top0=u.position.top;if(e.pageX<0||e.pageX>w)u.position.left=u.position.left0;if(e.pageY<0||e.pageY>h)u.position.top=u.position.top0;},handle:'.n,.caption',scroll:false});
		if(this.options.resizable&&!this.options.desktop){this.$win.resizable({handles:'n,s,e,w,ne,nw,se,sw',start:addMask,stop:()=>{this.store();clearMask();this.$content.resize();},minWidth:this.options.min_width,minHeight:this.options.min_height});this.$resize_hanles=$('.ui-resizable-handle',this.$win);}
		if(this.$close)this.$close.click(()=>{this.close()});
		if(this.$max)this.$max.click(()=>{this.max()});
		if(this.$min){this.$min.click(()=>{this.min()});this.addTask();}var _e=(e)=>{e.stopPropagation();e.preventDefault();}
		this.$win.mousedown((e)=>{if(this.options.desktop){return;}this.active()}).on('dragover',(e)=>{$('.win.frame.active').addClass('dragover');return _e(e)}).on('dragenter',(e)=>{return _e(e)}).on('dragleave',(e)=>{return _e(e)}).on('drop',(e)=>{_e(e);$('.win.frame.active').removeClass('dragover');if(this.frameWindow&&this.frameWindow.drop)this.frameWindow.drop(e);return false})
		this.$container.show();
	}
	load(){
		if(this.options.url&&this.options.url!==''){this.$win.addClass('frame');this.$content.remove();this.$frame.attr('src',this.options.url).on('load',()=>{this.frameWindow=this.$frame[0].contentWindow;this.frameWindow.OS=OS;this.frameWindow.WINDOW=this;if(this.frameWindow.init)this.frameWindow.init()});}
		else{this.$frame.remove();this.$content.empty().append(this.options.content);}
		if(this.options.onload){this.options.onload(this);}
	}
	close(){
		if(this.$modal.children().length>0)return;
		if(this.options.onclose)this.options.onclose(this);
		if(this.prev){OS.desktop.curwin=null;this.prev.active();}
		if(this.$container.parent()[0]===document.body&&this.$container.hasClass('modal'))this.$container.hide();
		this.closed=true;this.$win.remove();this.removeTask();if(this.app&&this.app.win)delete(this.app.win);delete(this);
	}
	active(){
		$('body').removeClass('taskview');
		$('.win.app').css({transform:'none',position:'fixed'}).each(function(){if(this.originalPosition){$(this).css({overflow:'visible',left:this.originalPosition.left,top:this.originalPosition.top});if(!this.originalPosition.visible)$(this).hide();delete(this.originalPosition);}});
		$('.win.dragover').removeClass('dragover');if(!this.$container.data().stack||this.$container.children().length===0)this.$container.data().stack=0;this.$win.css({zIndex:this.$container.data().stack++});
		if(this.$modal.children().length>0){$('.win:last',this.$modal).addClass('active').show();return;}
		this.$win.addClass('active').show();if(this.app===OS)return;OS.desktop.show();this.$container.show();
		if(OS.desktop.curwin===this){return;}
		this.prev=OS.desktop.curwin||this.prev;if(this.prev)this.prev.deactive();OS.desktop.curwin=this;
		this.activeTask();
	}
	deactive(){
		this.$win.removeClass('active');
	}
	show(){
		this.$win.show();
	}
	hide(){
		this.$win.hide();
	}
	store(){
		this.state_data={width:this.$win.width(),height:this.$win.height(),left:this.$win.position().left,top:this.$win.position().top};
	}
	max(){
		if(this.state===2){this.restore();return;}
		this.state=2;this.store();if(this.$max)this.$max.addClass('restore');this.$win.addClass('maxed');
		if(this.$resize_hanles)this.$resize_hanles.hide();$(window).resize();this.$content.resize();
	}
	restore(){
		this.state=0;this.$max.removeClass('restore');this.$win.removeClass('maxed').css(this.state_data);
		if(this.$resize_hanles)this.$resize_hanles.show();$(window).resize();this.$content.resize();
	}
	min(){
		this.deactive();this.$win.hide();this.deactiveTask();
	}
	addTask(){
		OS.desktop.panel.addTask(this);
	}
	removeTask(){
		OS.desktop.panel.removeTask(this);
	}
	activeTask(){
		OS.desktop.panel.activeTask(this);
	}
	deactiveTask(){
		OS.desktop.panel.deactiveTask(this);
	}
	setCaption(t){
		this.$caption.html(t);this.caption=t;
	}
}

class dialog_win extends win{
	constructor(o){
		o=$.extend({caption:'Dialog',type:'modal',min_button:false,max_button:false,parent:OS.desktop.win},o);
		if(o.parent)o.app=o.parent.app;
		if(o.url&&o.parent)o.url=o.parent.app.path+o.url;
		if(o.content){
			var $d=$(document.createElement('div'));$d.addClass(o.classname||'').append(o.content);
			var $b=$(document.createElement('div'));
			if(o.buttons){
				$b.append(o.buttons);
			}else{
				var $b1=$(document.createElement('button'));$b1.html($.l10n.__('ok'));$b1.click(()=>{if(o.callback())this.close();});
				var $b2=$(document.createElement('button'));$b2.html($.l10n.__('cancel'));$b2.click(()=>{this.close()});
				$b.append([$b1,$b2]);
			}
			o.content=[$d,$b];
		}
		super({},o);
		this.$content.addClass('dialog').addClass(o.classname||'');
		if(o.content){
			this.$dialog=$d;this.$buttons=$b;
			$b.css({position:'absolute',width:'100%',bottom:0,overflow:'hidden'});
			$d.css({position:'absolute',overflow:'auto',width:'100%',height:`calc(100% - ${$b.height()}px`,boxSizing:'border-box'});
		}
	}
}

class alert_win extends dialog_win{
	constructor(o){
		var $b=$(document.createElement('button'));$b.html($.l10n.__('ok'));
		if(typeof(o)==='object'){if(!o.content)o.content='';if(typeof(o.content)!=='string')o.content=String(o.content);}
		else{o={content:String(o)};}
		o=$.extend({caption:$.l10n.__('alert'),center:true,width:500,height:250,buttons:$b,popup:true},o);
		super(o);
		this.$content.addClass('alert');
		this.$dialog.css({display:'box',boxAlign:'center',boxPack:'center',padding:24,textAlign:'center'});
		$b.click(()=>{this.close()});
	}
}

class confirm_win extends dialog_win{
	constructor(o){
		var $b=$(document.createElement('button'));$b.html($.l10n.__('ok'));
		var $c=$(document.createElement('button'));$c.html($.l10n.__('cancel'));
		o=$.extend({caption:$.l10n.__('confirm'),center:true,width:400,height:250,min_button:false,max_button:false,buttons:[$b,$c],popup:true},o);
		super(o);
		this.$content.addClass('confirm');
		this.$dialog.css({display:'box',boxAlign:'center',boxPack:'center',padding:24,textAlign:'center'});
		$b.click(()=>{if(o.callback)o.callback(this);if(!o.keep)this.close();});
		$c.click(()=>{this.close();});
	}
}

class prompt_win extends dialog_win{
	constructor(o){
		var $b=$(document.createElement('button'));$b.html($.l10n.__('ok'));
		var $c=$(document.createElement('button'));$c.html($.l10n.__('cancel'));
		var $i=$(document.createElement('input'));$i.attr('type','text').width('100%').val(o.content).keypress((e)=>{if(e.which===13)$b.click()});
		var $d=$(document.createElement('div'));$d.css({textAlign:'left'}).html(o.pre||'').append($i);
		o=$.extend({caption:$.l10n.__('prompt'),center:true,width:400,height:180,min_button:false,max_button:false,buttons:[$b,$c],popup:true,callback:()=>{if(o.callback)o.callback($i.val())}},o);
		o.content=$d;
		super(o);
		this.$dialog.css({display:'box',boxAlign:'center',boxPack:'center',padding:24,textAlign:'center'});
		$b.click(()=>{if(o.callback)o.callback($i.val());this.close();});
		$c.click(()=>{this.close()});
	}
}

class progress_win extends dialog_win{
	constructor(o){
		var $c=$(document.createElement('button'));$c.html($.l10n.__('cancel'));
		var $i=$(document.createElement('progress'));$i.width('100%').val(0);var d;var s=setInterval(()=>{var v=$i.val()-0;if(v<=0)d=.01;if(v>=1)d=-.01;v=v+d;$i.val(v);},10);
		var $d=$(document.createElement('div'));$d.html(o.content);
		o=$.extend({caption:$.l10n.__('progress'),center:true,width:400,height:180,min_button:false,max_button:false,buttons:[$c],popup:true,onclose:()=>clearInterval(s)},o);
		o.content=[$i,$d];
		super(o);
		this.$dialog.css({display:'box',boxAlign:'center',boxPack:'center',padding:24,textAlign:'center'});
		this.setProgress=(v)=>{clearInterval(s);$i.val(v);}
		this.setText=(t)=>$d.html(t);
		this.$content.addClass('progress');
		if(o.callback)o.callback();
		$c.click(()=>{this.close()});
	}
}


class fileManager{
	constructor(o,w){
		if(!o)o={};if(!w)w=OS.desktop.win;
		this.path=o.path||(o.isdesktop?'desktop:///':'root:///');
		this.history=[];
		this.historyIndex=null;
		this.win=w;
		this.isdesktop=o.isdesktop;
		this.options=o;
		this.showhidden=false;
		this.order='asc';
		this.by='name';
		this.parent=this.win.parent;
		if(this.win.options)this.win.options.onclose=()=>{OS.path.delWin(this.win)}
		if(o.filter&&o.filter==='folder')this.choosefolder=true;
		OS.path.addWin(this);
		setTimeout(()=>{
			if(this.choosefolder)this.drawTree();
			else this.draw();
		},5);
	}
	draw(){
		var orderby={child:{orderbyname:()=>this.orderby('name'),orderbytype:()=>this.orderby('type'),orderbysize:()=>this.orderby('size'),orderbymtime:()=>this.orderby('mtime')}};
		var menu={app:'FileManager',menu:{file:{child:{newfolder:()=>this.newfolder(),upload:(e)=>this.upload(e),download:(e)=>this.download(e)}},edit:{child:{copy:()=>this.copy(),cut:()=>this.cut(),paste:()=>this.paste(),pastelink:()=>this.pastelink(),rename:()=>this.rename(),del:(e,_e)=>this.del(e,_e),cleartrashbin:()=>this.cleartrashbin(),properties:()=>this.properties()}},view:{child:{orderby:orderby,showhiddenfile:()=>this.showHidden(),refresh:()=>this.refresh()}}}};
		var cmenu_main={contextmenu:true,app:'FileManager',onload:(e)=>this.setMenu(e),menu:{newfolder:()=>this.newfolder(),paste:()=>this.paste(),pastelink:()=>this.pastelink(),properties:()=>this.properties(),cleartrashbin:()=>this.cleartrashbin(),refresh:()=>this.refresh()}};
		var cmenu_files={contextmenu:true,app:'FileManager',target:'tr',onload:(e)=>this.setMenu(e),menu:{open:(e)=>this.openFolder(e),cut:()=>this.cut(),copy:()=>this.copy(),rename:()=>this.rename(),del:(e,_e)=>this.del(e,_e),setbackground:(e,_e)=>this.setbackground(e,_e),zip:(e,_e)=>this.zip(e,_e),unzip:(e,_e)=>this.unzip(e,_e),cleartrashbin:()=>this.cleartrashbin(),properties:()=>this.properties()}};
		var $b=this.win.$content;if(this.isdesktop){$b.addClass('desktop');}
		var $t=$(document.createElement('div')),$mb=$(document.createElement('div')),$tb=$(document.createElement('div')),$s=$(document.createElement('div')),$m=$(document.createElement('div')),$sb=$(document.createElement('div')),$d=$(document.createElement('div'));
		if(!this.options.button)$mb.appendTo($t).addClass('menubar').menu(menu);if(this.isdesktop){$b.append($m);}else{$b.append([$t,$s,$m,this.options.button?$d:$sb]).layout({center:{pane:$m},north:{pane:$t,size:this.options.button?30:54},south:{pane:this.options.button?$d:$sb,size:this.options.button?130:20},west:isMobile?null:{pane:$s,size:250,resizable:true}});}if(isMobile)$s.hide();
		$tb.appendTo($t).addClass('toolbar').html('<div class="back disabled"></div><div class="forward disabled"></div><div class="up disabled"></div><div class="refresh"></div><div class="path"><div></div><input type="text" style="display:none;border:none;width:100%;height:100%;"></div>'+(this.options.button?'':'<div class="search"><div><input type="text" value="" placeholder="'+$.l10n.__('search')+'"/></div></div>')+'</div></div>');
		$s.addClass('side left').css({overflow:'auto'}).html('<ul class="filetree"><li><a path="root:///" style="display:none;"></a><a>'+$.l10n.__('places')+'</a><ul><li><a path="home:///" class="home dir">'+USERINFO.name+'</a></li><li><a path="desktop:///" class="desktop dir">'+$.l10n.__('desktop')+'</a></li><li><a path="file:///" class="computer dir">'+$.l10n.__('computer')+'</a></li><li><a path="trash:///" class="trash dir">'+$.l10n.__('trash')+'</a></li></ul></li><li><a>'+$.l10n.__('devices')+'</a><ul class="devices"></ul></li><li><a>'+$.l10n.__('shared')+'</a><ul><li><a path="public:///" class="public dir">'+$.l10n.__('public')+'</a></li></ul>').selected({filter:'ul ul a',single:true,selected:(e)=>this.load(e.target.getAttribute('path'),null,true)});//<li><a class="user dir">user1</a></li><li><a class="user dir">user2</a></li></ul></li>
		$m.addClass('main').css({overflow:'auto'}).menu(cmenu_main).html('<table cellspacing="0" cellpadding="0" class="filelist iconlist '+(this.isdesktop?'small':'')+'"><thead><tr><th class="name">'+$.l10n.__('filename')+'</th><th class="type">'+$.l10n.__('filetype')+'</th><th class="size">'+$.l10n.__('filesize')+'</th><th class="mtime">'+$.l10n.__('mtime')+'</th></tr></thead><tbody></tbody></table>').on('mousedown','th',(e)=>{this.orderby(e.target.className)}).selected({filter:'tbody tr',single:this.options.single,selected:(e)=>this.setMenu(e)});if(this.isdesktop)$m.css({width:'100%',height:'100%',overflow:'visible',display:'flex'});
		$sb.addClass('statusbar').html('<div class="status"><span class="items"></span><span class="selecteditems"></span><span class="usage"></span></div><div class="icon tablelist"></div><div class="icon iconlist ui-selected"></div>').selected({filter:'.icon',single:true});
		$d.html('<table width="100%"><tr><td>'+$.l10n.__('filename')+'</td><td><input class="filename" value="'+(this.options.filename||'')+'"/></td></tr><tr><td>'+$.l10n.__('filetype')+'</td><td><select class="filetype"></select></td></tr><tr><td colspan="2" align="right"><button class="'+this.options.button+'">'+$.l10n.__(this.options.button)+'</button><button class="cancel">'+$.l10n.__('cancel')+'</button></td></tr></table>');
		this.$status=$('.status',$sb);this.$status.css({textAlign:'left'});this.$status_items=$('.status .items',$sb);this.$status_selecteditems=$('.status .selecteditems',$sb);this.$status_usage=$('.status .usage',$sb);
		this.$back=$('.back',$t);this.$back.click(()=>this.back());
		this.$forward=$('.forward',$t);this.$forward.click(()=>this.forward());
		this.$up=$('.up',$tb);this.$up.click(()=>this.up());
		this.$refresh=$('.refresh',$tb);this.$refresh.click(()=>this.refresh());
		this.$showhiddenfile=$('.menu [name="showhiddenfile"]',$b);
		this.$orderby=$('.menu [name^="orderby"]',$b);this.$orderbyname=$('.menu [name="orderbyname"]',$b);this.$orderbytype=$('.menu [name="orderbytype"]',$b);this.$orderbysize=$('.menu [name="orderbysize"]',$b);this.$orderbymtime=$('.menu [name="orderbymtime"]',$b);
		this.$content=$('tbody',$m);this.$content.menu(cmenu_files).on('dblclick','tr',(e)=>this.openFolder(e));var _e=(e)=>{e.preventDefault();e.stopPropagation();return false;};this.win.$win.on('drop',(e)=>{this.drop(e);return _e(e)});if(this.isdesktop){this.$content.css({display:'flex',flexDirection:'column',flexWrap:'wrap',alignContent:'start'});$(window).resize(()=>{this.$content.css({width:$('body').width(),height:$('body').height()})}).resize();}
		this.$side=$s;this.$filelist=$('.filelist',$m);this.$devices=$('.devices',$s);this.$container=$b;
		this.$tablelist=$('.tablelist',$sb);this.$tablelist.click(()=>this.$filelist.removeClass('iconlist').addClass('tablelist'));
		this.$iconlist=$('.iconlist',$sb);this.$iconlist.click(()=>this.$filelist.removeClass('tablelist').addClass('iconlist'));
		this.$path=$('.path div',$tb);this.$pathinput=$('.path input',$tb);this.$path.on('click','span',(e)=>{e.stopPropagation();this.load(e.target.getAttribute('path'),null,true);});this.$path.on('click',()=>{this.$pathinput.val(this.path).show();this.$path.hide();});this.$pathinput.on('keypress',(e)=>{if(e.which==13){this.$pathinput.hide();this.$path.show();if(!/\/$/.test(this.$pathinput.val())){this.$pathinput.val(this.$pathinput.val()+'/');}this.load(this.$pathinput.val(),null,true)}})
		this.$search=$('.search',$tb);this.$pattern=$('.search input',$tb);this.$pattern.on('keypress',(e)=>this.find(e));
		this.$open=$('button.open',$d);this.$save=$('button.save',$d);this.$openfiles=$('input.filename',$d);this.$open.click(()=>this.openFiles());this.$save.click(()=>this.saveFile());this.$cancel=$('button.cancel',$d);this.$cancel.click(()=>this.win.close());
		this.$filters=$('select',$d);if(this.options.button){if(!this.options.filter)this.options.filter={};this.options.filter[$.l10n.__('alltypes')]=['*'];for(var _f in this.options.filter){var f=this.options.filter[_f];this.$filters.append(`<option value=".file.${f.join(',.file.')}">${_f}(*.${f.join(',*.')})</option>`);this.$filters.change(()=>{if(this.$filters.val()==='.file.*'){$('.file',this.$content).show();return}$('.file',this.$content).hide();$(this.$filters.val(),this.$content).show()})}}
		if(this.path)this.load(this.path,true,true);
	}
	drawTree(){
		var $w=this.win.$content,$m=$(document.createElement('div')),$b=$(document.createElement('div')),$o=$(document.createElement('button')),$c=$(document.createElement('button'));
		$b.css({position:'absolute',width:'100%',height:60,bottom:0});$b.append([$o,$c]);$o.html($.l10n.__('ok')).click(()=>{if(this.options.callback(this.path))this.win.close()});$c.html($.l10n.__('cancel')).click(()=>this.win.close())
		$m.css({position:'absolute',width:'100%',height:'calc(100% - 60px)',overflow:'auto'});
		$w.append([$m,$b]);
		$m.html('<ul class="filetree"><li><a>'+$.l10n.__('places')+'</a><ul><li><a path="home:///" class="home dir">'+$.l10n.__('home')+'</a></li><li><a path="desktop:///" class="desktop dir">'+$.l10n.__('desktop')+'</a></li><li><a path="file:///" class="computer dir">'+$.l10n.__('computer')+'</a></li></ul></li><li><a>'+$.l10n.__('shared')+'</a><ul><li><a path="public:///" class="public dir">'+$.l10n.__('public')+'</a></li></ul>').selected({filter:'ul ul a',single:true,selected:(e)=>this.load(e.target.getAttribute('path'),null,true)});//<li><a class="user dir">user1</a></li><li><a class="user dir">user2</a></li></ul></li>
		this.$content=$('>ul',$m);
		this.$content.on('click','a',(e)=>{this.load(e.currentTarget.getAttribute('path'))});
		if(this.path)this.load(this.path,true,true);
	}
	refresh(p){
		OS.clipboard=null;
		if(!p)p=this.path;if(typeof(p)==='string')p=[p];
		for(var _p of p)OS.path.ls({data:{path:_p,showhidden:this.showhidden},waiting:this.win.$waiting,win:this});
	}
	load(p,f,h){
		if(!p){p=this.path;f=false};if(p===true){p=this.path;f=true;}if(!/\/$/.test(p))p=OS.path.dirname(p);
		if(!OS.path.storage[p]||(OS.path.storage[p]&&!OS.path.storage[p].children))var f=true;
		this.path=p;if(!this.choosefolder){this.setPlace();this.setMenu();this.setPath(p);if(!this.options.button){this.setCaption(p);this.setSearch(p)}if(h)this.checkHistory();}
		if(this.$search){if(this.path==='root:///'||this.path==='trash:///'||this.path.indexOf('share:///')===0)this.$search.hide();else this.$search.show();}
		if(f){OS.path.ls({data:{path:p,showhidden:this.showhidden},waiting:this.win.$waiting,win:this});if(this.isdesktop)this.parse({});}
		else{var j=OS.path.getStorage(p);this.parse(j);}
	}
	parse(json){
		if(this.choosefolder){return this.parseTree(json);}
		this.$content.empty();
		let r=json.children||[],us=OS.path.getUsage(this.path);this.setStatus({items:r.length,usage:us||(json.prop?json.prop[13]:'')});
		if(this.isdesktop)this.$content.append('<tr path="file:///" class="dir computer" draggable="true"><td class="fileicon"><div></div>'+$.l10n.__('computer')+'</td></tr><tr path="trash:///" class="dir trash" draggable="true"><td class="fileicon"><div></div>'+$.l10n.__('trash')+'</td></tr>');
		for(var f of r){
			var p=f[8],pr=OS.path.getProp(p,f),n=pr.name,e=pr.type,s=pr.sizestr,m=pr.mtimestr,t=pr.title+(pr.isdisk?' ('+pr.name+')':''),c=pr.classname,thumb=pr.thumbnail;
			this.$content.append(`<tr draggable="true" path="${p}" class="${c}"><td class="fileicon"><div ${thumb?'style="background-image:url(\''+thumb+'\')"':''}></div>${t}</td><td>${e}</td><td>${s}</td><td>${m}</td></tr>`);
		}
		$('tr',this.$content).on('dragstart',(e)=>{var $e=$(e.currentTarget);$e.addClass('ui-draggable-dragging');var $s=$('.ui-selected>td.fileicon>div',this.$content),b=[],p=[];for(var s of $s){p.push(s.parentNode.parentNode.getAttribute('path'));b.push(getComputedStyle(s).getPropertyValue('background-image'));}OS.desktop.draghelper.style.backgroundImage=b.join(',');e.originalEvent.dataTransfer.setDragImage(OS.desktop.draghelper,0,0);e.originalEvent.dataTransfer.setData('path',JSON.stringify(p))}).on('dragover',function(){if($(this).hasClass('dir'))$(this).addClass('ui-dragover')}).on('dragleave',function(){$(this).removeClass('ui-dragover')}).on('dragend',(e)=>{$(e.currentTarget).removeClass('ui-dragover');$(e.target).removeClass('ui-draggable-dragging')}).on('drop',(e)=>{e.stopPropagation();e.preventDefault();$(e.currentTarget).removeClass('ui-dragover');OS.desktop.draghelper.style.backgroundImage='none';this.drop(e);return false;});
		this.$filters.change();this.parseDevices();OS.path.trash();
	}
	parseTree(json){
		let r=json.children||[];if(r.length===0)return;
		let $a=$('a[path="'+this.path+'"]',this.$content);$a.next().remove();let $ul=$(document.createElement('ul'));$ul.addClass('treeview');$a.after($ul);
		for(var f of r){
			var p=f[8],pr=OS.path.getProp(p);if(!pr.isdir||(this.path==='file:///'&&!pr.ismount))continue;
			$ul.append('<li><a class="'+pr.classname+'" path="'+p+'">'+pr.title+(pr.isdisk?' ('+pr.name+')':'')+'</a></li>');
		}
	}
	parseDevices(){
		if(this.isdesktop)return;
		let r=OS.path.storage['file:///'].children;
		var s=$('.ui-selected',this.$side).attr('path');
		this.$devices.empty();
		for(var f of r){
			var p=f[8];
			var pr=OS.path.getProp(p,f);
			if(!pr.ismount)continue;
			var u=pr.udev;
			var t=pr.title+(pr.isdisk?' ('+pr.name+')':'');
			var c=pr.classname;
			var n=pr.name;
			this.$devices.append(`<li name="${n}"><a path="${p}" class="${c} dir ${p==s?'ui-selected':''}">${t}</a><li>`);
		}
	}
	openFolder(e){
		if(this.path==='trash:///')return;
		var $t=$(e.currentTarget);
		var p=$t.attr('path');
		if(this.isdesktop&&$t.hasClass('dir')){OS.FileManager.load({path:p});return};
		var s=OS.path.getProp(p);if(s&&s.isfile){if(this.options.button)this.openFiles();else this.openFile(p);return;}
		this.load(p,null,true);
	}
	openFile(p){
		OS.path.open(p);
	}
	openFiles(){
		var p=this.getSelected('.file');
		if(p.length===0)return;
		if(this.options.single)p=p[0];
		this.options.callback(p);
		this.win.close();
	}
	saveFile(){
		var v=this.$openfiles.val();
		var n=validFilename(v);
		if(!n)return;
		var p=this.path+n;
		var _c=()=>{var c=this.options.callback;this.win.close();c(p)}
		OS.path.exists({
			path:p
			,success:()=>this.win.confirm($.l10n.__('replaceexistedfile'),()=>_c())
			,error:()=>_c()
		});
	}
	setMenu(e){
		var p=this.path,$s=this.getSelected(),$t=e?$(e.currentTarget):null;
		$('.disabled','.FileManager.menu').removeClass('disabled');
		var $select=$('[name="download"],[name="copy"],[name="cut"],[name="rename"],[name="del"],[name="setbackground"],[name="zip"],[name="unzip"]','.FileManager.menu');
		if($s.length>0)$select.removeClass('disabled');else $select.addClass('disabled');
		var $image=$('[name="setbackground"]','.FileManager.menu');
		if(e&&$t.hasClass('image'))$image.show();else $image.hide();
		var $unzip=$('[name="unzip"]','.FileManager.menu');
		if(e&&$t.hasClass('zip'))$unzip.show();else $unzip.hide();
		var $paste=$('[name="paste"],[name="pastelink"]','.FileManager.menu');
		if(OS.clipboard&&OS.clipboard.type==='file')$paste.removeClass('disabled');else $paste.addClass('disabled');
		var $nodevices=$('[name="newfolder"],[name="download"],[name="upload"],[name="cut"],[name="paste"],[name="pastelink"],[name="del"],[name="zip"],[name="unzip"]','.FileManager.menu');
		if(this.path==='file:///'||this.path==='root:///')$nodevices.addClass('disabled');
		var $notrash=$('[name="open"],[name="newfolder"],[name="upload"],[name="rename"],[name="paste"],[name="pastelink"],[name="setbackground"],[name="zip"],[name="unzip"]','.FileManager.menu');
		if(this.path.indexOf('trash:///')===0){$notrash.addClass('disabled');if($s.length===0){$('[name="properties"]','.FileManager.menu').addClass('disabled');}}
		var ep=e?$t.attr('path'):null;
		var $notrashicon=$('[name="rename"],[name="copy"],[name="cut"],[name="del"],[name="setbackground"],[name="zip"],[name="unzip"],[name="properties"]','.FileManager.contextmenu');
		if(ep==='trash:///')$notrashicon.addClass('disabled');
		var $nodevicesicon=$('[name="rename"],[name="copy"],[name="cut"],[name="del"],[name="setbackground"],[name="zip"],[name="unzip"]','.FileManager.contextmenu');
		if(ep==='file:///')$nodevicesicon.addClass('disabled');
		var $trash=$('[name="cleartrashbin"]','.FileManager.menu');
		if(this.path.indexOf('trash:///')===0||ep==='trash:///')$trash.show();else $trash.hide();
		if(this.options.button){
			if(this.options.button==='open'){var v=[];for(var f of this.getSelected('.file')){v.push(OS.path.basename(f))};this.$openfiles.val(v.length===1?v[0]:JSON.stringify(v).replace(/^\[/,'').replace(/\]$/,'').replace('","',""));}
			if(this.options.button==='save')this.$openfiles.val(OS.path.basename(this.getSelected('.file')[0]||''));
		}
		if(p==='root:///')$('[name="rename"],[name="cut"],[name="del"],[name="zip"]','.FileManager.contextmenu').addClass('disabled');
	}
	setPlace(){
		var set=(_p)=>{
			var _r=OS.path.dirname(_p),_$s=$('[path="'+_p+'"]',this.$side);
			if(_$s[0]){$('a.ui-selected',this.$side).removeClass('ui-selected');_$s.addClass('ui-selected');}
			else{set(_r);}
		};
		var p=this.path;set(p);
		if(p==='root:///')this.$up.addClass('disabled');else this.$up.removeClass('disabled');
	}
	setPath(p){
		var a=OS.path.split(p),l=a.length,h=a[0],ad=a[1],d=['<span></span>'],p='';
		if(ad===''){
			var s='';
			if(h==='file://'){s=$.l10n.__('computer');}
			else if(h==='home://'){s=USERINFO.name;}
			else{s=$.l10n.__(h.replace('://',''));}
			p=h+'/';
			d.push('<span path="'+p+'">'+s+'</span>');
		}else{
			p=h+ad+'/';var _ad=ad.split('@');
			if(_ad.length>1){
				d.push('<span path="'+p+'">'+_ad[1]+'</span>');
			}else{
				d.push('<span path="'+p+'">'+ad+'</span>');
			}
		}
		for(var i=2;i<l;i++){
			var s=a[i],_p=s;
			p+=_p+'/';
			d.push('<span path="'+p+'">'+s+'</span>');
		}
		d=d.join('');this.$path.html(d).show();this.$pathinput.hide();
	}
	setCaption(p){
		var $s=$('[path="'+p+'"]',this.$side);
		var c=$s[0]?$s.text():OS.path.basename(p);
		if(this.win.setCaption)this.win.setCaption(c);
	}
	setSearch(p){
		var f=OS.path.getProp(p);if(!f)return;
		this.$pattern.attr('placeholder',$.l10n.__('search')+' "'+f.title+'"');
	}
	setStatus(i){
		if(!i){this.$status_items.empty();this.$status_selecteditems.empty();this.$status_usage.empty();return;}
		if(typeof(i.items)!=='undefined'){if(i.selected==='')this.$status_items.empty();else this.$status_items.html($.l10n.__('totalitems').replace('{0}',i.items));}
		if($.inArray(this.path,['root:///','file:///','trash:///','share:///'])>-1){this.$status_usage.empty();return;}
		if(typeof(i.selected)!=='undefined'){if(i.selected==='')this.$status_selecteditems.empty();else this.$status_selecteditems.html($.l10n.__('selecteditems').replace('{0}',i.selected));}
		if(typeof(i.items)!=='undefined'){if(i.usage==='')this.$status_usage.empty();else this.$status_usage.html($.l10n.__('diskusage').replace('{0}',bytesToSize(i.usage.size)).replace('{1}',bytesToSize(i.usage.used)).replace('{2}',bytesToSize(i.usage.avail)) );}
	}
	showHidden(){
		var $h=this.$showhiddenfile;
		$h.toggleClass('checked');
		if($h.hasClass('checked'))this.showhidden=true;
		else this.showhidden=false;
		this.load(true);
	}
	getSelected(f){
		var $s=$('tr.ui-selected'+(f||''),this.$content);
		var p=[];
		for(var s of $s)p.push(s.getAttribute('path'));
		return p;
	}
	checkHistory(){
		var p=this.history[this.history.length-1];
		if(p===this.path)return;
		this.$forward.addClass('disabled');
		if(this.historyIndex!==null)this.history=this.history.slice(0,this.historyIndex+2);
		this.history.push(this.path);
		this.historyIndex=this.history.length-1;
		if(this.history.length>1)this.$back.removeClass('disabled');
	}
	orderby(b){
		if(!b)b=this.by;
		if(b!==this.by)this.order='acs';
		var o=this.order;
		var $tr=$('tr',this.$content);
		$tr.sort(function(x,y){
			var A=OS.path.getProp(x.getAttribute('path'))[b],B=OS.path.getProp(y.getAttribute('path'))[b];
			if(typeof(A)==='string')A=A.toLowerCase();
			if(typeof(B)==='string')B=B.toLowerCase();
			if(o==='acs')return A>B?1:A<B?-1:0;
			else return A>B?-1:A<B?1:0;
		});
		this.$orderby.removeClass('checked');
		this['$orderby'+b].addClass('checked');
		this.order=(o==='acs')?'desc':'acs';
		this.by=b;
		$tr.appendTo(this.$content);
	}
	back(){
		if(this.$back.hasClass('disabled'))return;
		if(this.historyIndex===null)this.historyIndex=this.history.length-1;
		this.historyIndex--;
		if(this.historyIndex===0)this.$back.addClass('disabled');
		this.$forward.removeClass('disabled');
		var p=this.history[this.historyIndex];
		this.load(p);
	}
	forward(){
		if(this.$forward.hasClass('disabled'))return;
		this.historyIndex++;
		if(this.historyIndex===this.history.length-1)this.$forward.addClass('disabled');
		this.$back.removeClass('disabled');
		var p=this.history[this.historyIndex];
		this.load(p);
	}
	up(){
		if(this.$up.hasClass('disabled'))return;
		var p=this.path,j;
		while(!j&&p!=='root:///'){p=OS.path.dirname(p);j=OS.path.storage[p];}
		this.checkHistory();
		this.load(p);
	}
	copy(){
		var ps=this.getSelected();if(ps.length===0)return;
		OS.clipboard={type:'file',data:{action:'copy',data:ps}};
		this.setMenu();
	}
	cut(){
		var ps=this.getSelected();if(ps.length===0)return;
		OS.clipboard={type:'file',data:{action:'cut',data:ps}};
		this.setMenu();
	}
	pastelink(cb,path){
		if(!cb)cb=OS.clipboard;
		var data=cb.data.data;
		path=cb.data.path||this.path;
		OS.path.ln({data:{path:data,newpath:path}});
	}
	paste(cb){
		if($.inArray(this.path,['file:///','shared:///'])>-1)return false;
		if(!cb)cb=OS.clipboard;if(cb.type!=='file')return false;var _path=cb.data.path||this.path;
		var d=cb.data;if(d.data.length===0)return;var _ps=d.data,ps=[];
		for(var _p of _ps){
			var isdir=OS.path.isdir(_p);
			
			if(d.action==='cut'){
				if(OS.path.dirname(_p)!==_path&&(!(_path.indexOf(_p)===0&&isdir))&&$.inArray(_p,['trash:///','home:///','file:///','root:///','share:///'])===-1)ps.push(_p);
			}else{
				if(!(_path.indexOf(_p)===0&&isdir))ps.push(_p);
			}
		}
		if(ps.length===0)return false;
		var c=(s)=>{if(typeof(s)==='string')this.win.alert(s)};
		if(d.action==='cut'){OS.clipboard=null;this.setMenu();OS.path.mv({data:{path:ps,newpath:_path},success:c,error:c});}
		if(d.action==='copy'){OS.path.cp({data:{path:ps,newpath:_path},error:c});}
	}
	newfolder(){
		(this.win.prompt||OS.prompt)($.l10n.__('foldername'),'','',(s)=>{
			let n=validFilename(s);
			if(!n){this.win.alert($.l10n.__('invalidfilename'));return;}
			n=this.path+(/\/$/.test(this.path)?'':'/')+n;
			OS.path.mkdir({data:{path:n}});
		});
	}
	del(e,_e){
		var p=this.getSelected();
		var r=(this.path==='trash:///')||_e&&_e.shiftKey;
		var a=$.l10n.__(r?'delitems':'trashitems');
		this.win.confirm(a,()=>{
			if(r)OS.path.rm({data:{path:p}});
			else OS.path.mv({data:{path:p,newpath:'trash:///'}});
		});
	}
	rename(){
		var p=this.getSelected(),_p=OS.path.getProp(p[0]);
		var n=_p.title||_p.name;
		this.win.prompt($.l10n.__('filename'),'',n,(s)=>{
			if(!s){this.win.alert($.l10n.__('invalidfilename'));return;}
			OS.path.mv({data:{path:p,newpath:s}});
		});
	}
	find(e){
		if(e.keyCode!==13)return;
		var f=$.trim(this.$pattern.val());
		OS.path.find({data:{path:this.path,file:f},success:(j)=>this.parse(j)});
	}
	zip(){
		var p=this.getSelected();
		OS.path.zip({data:{file:JSON.stringify(p),path:this.path}});
	}
	unzip(e,_e){
		var $t=$(e.currentTarget);
		var p=$t.attr('path');
		OS.path.unzip({data:{path:p}});
	}
	setbackground(e,_e){
		var $t=$(e.currentTarget);
		var p=$t.attr('path');
		OS.desktop.background(p);
	}
	cleartrashbin(){
		this.win.confirm($.l10n.__('delitems'),()=>{
			OS.path.cleartrash();
		});
	}
	properties(){
		var ps=this.getSelected();if(ps.length===0)ps=[this.path];var p=ps[0];
		OS.Properties.load({path:p},{id:'properties_'+OS.path.getProp(p).inode,max_button:false,resizable:false});
	}
	upload(e,p){
		if(p){
			var _files=[]
			for(var i of e){_files.push(i.webkitGetAsEntry());}
			this.readLocal(_files,p,(f)=>OS.Upload.load({file:f,path:p,win:this}));
		}else{
			for(var i of e){
				i.href=this.path+i.name;
				OS.Upload.load({file:i,path:this.path,win:this});
			}
		}
	}
	download(e){
		var ps=this.getSelected();
		for(var p of ps){
			if(/\/$/.test(p))continue;
			window.open(DOMAIN+p,'_blank');
		}
	}
	drop(e,path){
		var $p=$(e.currentTarget),_p=$p.hasClass('dir')?$p.attr('path'):this.path;
		if($.inArray(_p,['file:///','shared:///'])>-1)return false;
		var ps=e.originalEvent.dataTransfer.getData('path');
		var items=e.originalEvent.dataTransfer.items;
		if(ps){
			var p=JSON.parse(ps);
			var a='cut';if(e.ctrlKey)a='copy';if(_p==='trash:///')a='cut';
			var cb={type:'file',data:{action:a,data:p,path:_p}};
			if(e.altKey&&_p!=='trash:///')this.pastelink(cb);else this.paste(cb);
		}else{
			if(_p==='trash:///')return;
			this.upload(items,_p);
		}
		return false;
	}
	chmod(p,m,c){
		API.files.chmod({data:{path:p,mode:m},success:c});
	}
	readLocal(files,path,c){
		var listEntries=function(e){
			e.file(function(file){
				file.href=path+e.fullPath.replace(/^\//,'');
				if(c)c(file);
			});
		}
		var readFiles=function(r) {
			for(var i=0,l=r.length;i<l;i++){
				var e=r[i];if(!e)continue;
				if(e.isFile)listEntries(e);else e.createReader().readEntries(readFiles);
			};
		}
		readFiles(files);
	}
}

class upload{
	constructor(o,w){
		var s='<li path="{0}" class="{1}"><div>{2}</div><label>{3}</label><a class="cancel">'+$.l10n.__('cancel')+'</a><a class="start">'+$.l10n.__('start')+'</a><a class="pause">'+$.l10n.__('pause')+'</a><progress></progress><span>{4}</span></li>';
		var add=(f)=>{w.$list.append(s.replace('{0}',f.href).replace('{1}',f.state).replace('{2}',f.name).replace('{3}',f.href).replace('{4}',f.status||''));f.$li=$('[path="'+f.href+'"]:last',w.$list);f.$start=$('a.start',f.$li);f.$pause=$('a.pause',f.$li);f.$cancel=$('a.cancel',f.$li);f.$progress=$('progress',f.$li);f.$name=$('div',f.$li);f.$path=$('label',f.$li);f.$status=$('span',f.$li);f.$cancel.click(()=>{if(f.state!=='completed')o.win.load(true);f.$li.remove();delete(w.app.list[f.href]);f=null;});f.$pause.click(()=>{f.state='paused';f.$li.attr('class',f.state);});f.$start.click(()=>{f.state='queuing';f.$li.attr('class',f.state);f.$status.empty();w.app.upload();});}
		if(!w.$list){w.$list=$(document.createElement('ul'));w.$list.addClass('uploadList').appendTo(w.$content);w.$content.css({'overflow':'auto'});for(var i in w.app.list)add(w.app.list[i]);}
		if(!w.app.list)w.app.list={};if(o.file&&!w.app.list[o.file.href]){var f=o.file;w.app.list[f.href]=f;f.state='queuing';add(f);}
		if(!w.app.upload)w.app.upload=()=>{
			var u,q,p,st=new Date();
			for(var i in w.app.list){var f=w.app.list[i];if(!u&&f.state==='uploading')u=f;if(!q&&f.state==='queuing')q=f;if(!p&&f.state==='paused')p=f;}
			if(u)return;var F=q||p;if(!F)return;
			F.state='uploading';
			var chunk=1024*50;F.loaded=0;
			var read=function(){
				if(!F||!w.app.list[F.href]||F.state!='uploading')return;
				F.ended=F.loaded+chunk;if(F.ended>F.size)F.ended=F.size;
				var b=F.slice(F.loaded,F.ended);send(b);
			}
			var success=function(j){
				if(!F||!w.app.list[F.href]||F.state!='uploading')return;var et=new Date();
				F.path=OS.path.dirname(F.href)+j.name;F.$name.html(j.name);F.$path.html(F.path);F.$li.attr('path',F.path);
				if(F.ended<F.size){F.$status.html(`${parseInt(F.loaded/F.size*100)}% - ${bytesToSize(F.loaded)}/${bytesToSize(F.size)}  ${timeToString(et-st)} ${bytesToSize(F.loaded/(et-st)*1000)}/s`);F.$progress.val(F.loaded/F.size);F.loaded=F.ended;read();}
				else{o.win.load(true);F.$progress.val(1);F.state='completed';F.$li.attr('class',F.state);F.status=$.l10n.__('completed');F.$status.html(`100% - ${bytesToSize(F.size)}/${bytesToSize(F.size)}  ${timeToString(et-st)} ${bytesToSize(F.size/(et-st)*1000)}/s`);delete(w.app.list[F.href]);F.$cancel.html($.l10n.__('remove'));F.$start.remove();F.$pause.remove();F.$progress.remove();F=null;w.app.upload();}
			}
			var error=function(j){
				if(!F||!w.app.list[F.href])return;
				F.state='error';F.status=j;F.$li.attr('class',F.state);F.$status.html(j);
				o.win.load(true);w.app.upload();
			}
			var send=function(b,p){
				if(!F||!w.app.list[F.href])return;
				OS.path.save({
					path:F.href
					,headers:{'Position':F.loaded,'Replace':'true'}
					,data:b
					,success:success
					,error:error
					,nowaiting:true
				});
			}
			read();
		};
		w.app.upload();
	}
}



class path{
	constructor() {
		this.storage={};
		this.wins=[];
		this.ls({data:{path:'file:///'}});
		this.ls({data:{path:'trash:///'}});
	}
	dirname(p){
		p=p.replace(/\/$/,'');
		var i=p.lastIndexOf('/');
		var r=p.substr(0,i+1);
		if(/\:\/\/$/.test(r))r='root:///';
		return r;
	}
	devname(p){
		if(p.indexOf('trash:///')===0||p.indexOf('share:///')===0)return null;
		if(p.indexOf('root:///')===0||p==='file:///')return this.rootpath;
		if(p.indexOf('home:///')===0||p.indexOf('public:///')===0||p.indexOf('desktop:///')===0||p.indexOf('network:///')===0)return this.storagepath;
		if(p.indexOf('file:///')===0){
			var s=p.split('/');
			if(s[3])return 'file:///'+s[3]+'/';
			else return null;
		}
	}
	basename(p){
		p=p.replace(/\/$/,'');
		var i=p.lastIndexOf('/');
		var r=p.substr(i+1);
		return r;
	}
	rootname(p){
		if(/\:\/\/\/$/.test(p))return p;
		var i=p.indexOf(':///');
		var r=p.substr(0,i+4);
		return r;
	}
	split(p){
		p=p.replace(/\/$/,'');
		var i=p.indexOf('://');
		var _p=p.substr(i+3);
		var r=[p.substr(0,i+3)].concat(_p.split(/\/+/));
		return r;
	}
	exists(o){
		if(o.local){
			if(this.storage[p])return true;
			return false;
		}
		API.files.exists({
			data:{path:o.path}
			,success:o.success||function(){}
			,error:o.error||function(){}
		});
	}
	isfile(p){
		return this.storage[p].prop[4];
	}
	isdir(p){
		return this.storage[p].prop[5];
	}
	islink(p){
		return this.storage[p].prop[6];
	}
	ismount(p){
		return this.storage[p].prop[7];
	}
	getProp(p,j){
		var c=[],s=this.storage[p];if(!s){if(!j)return null;}else{j=s.prop;}
		var r={name:j[0],title:$.inArray(p,['file:///','trash:///','public:///','desktop:///','network:///','home:///Desktop/','home:///Documents/','home:///Pictures/','home:///Music/','home:///Movies/','home:///Video/','home:///Downloads/','home:///Backup/'])>-1?$.l10n.__(j[0].toLowerCase()):p==='home:///'?USERINFO.name:this.basename(j[0]),ext:j[1],mime:j[17].split('/')[0],type:j[5]?$.l10n.__('folder'):j[1].replace('.',''),size:j[2],sizestr:j[5]?j[2]:bytesToSize(j[2]),mtime:j[3],mtimestr:dateTimeToString(new Date(j[3]),'YYYY/MM/DD hh:mm'),isfile:j[4],isdir:j[5],islink:j[6],ismount:j[7],path:j[8],owner:j[9],group:j[10],mode:j[11],modestr:parseMode(j[11]),inode:j[12],usage:j[13],udev:j[14],classname:'',writable:$.inArray(p,['file:///','trash:///','share:///'])>-1?false:j[15],thumbnail:j[16]?DOMAIN+(this.dirname(p))+'.thumbnails/.'+this.basename(j[0])+'.jpg':null,rootpath:j[13]&&j[13]['root']?'file:///'+j[0]+'/':null,storagepath:j[13]&&j[13]['storage']?'file:///'+j[0]+'/storage/':null,MIME:j[17],charset:j[18]}
		var u=r.udev;if(r.ismount&&(this.dirname(p))==='file:///'){r.title=(u.ID_FS_LABEL||(u.ID_BUS==='usb'?$.l10n.__('usbdisk'):u.ID_CDROM?'CDROM':$.l10n.__('harddisk')));r.isdisk=true;}
		if(r.isfile){c.push('file');c.push(j[17].split('/')[0]);c.push(j[17].split('/')[1]);var _c=r.ext.replace('.','');c.push(_c);};if(r.isdir)c.push(r.size===0?'dir0 dir':'dir');if(r.islink)c.push('link');if(r.ismount&&this.dirname(p)==='file:///'){c.push('mount '+(u.ID_BUS==='usb'?'usb':'harddisk')+(u.ID_CDROM==='1'?' cdrom':'')+(u.ID_MTP_DEVICE==='1'?' android':'')+(r.usage.storage?' storage':'')+(r.usage.root?' root':''));};
		if(j[8]==='file:///')c.push('computer');if(j[8]==='trash:///'){c.push('trash');if(j[2]>0)c.push('full');}if($.inArray(p,['home:///Documents/','home:///Pictures/','home:///Music/','home:///Movies/','home:///Video/','home:///Downloads/','home:///Desktop/','home:///Backup/'])>-1)c.push(j[0].toLowerCase());
		c=c.join(' ');r.classname=c;
		return r;
	}
	getFolderProp(d){
		if(!OS.path.storage[d])return null;
		var c=OS.path.storage[d].children,r=[];
		for(var i of c){r.push(OS.path.getProp(d+i[0]+(i[5]?'/':'')));}
		return r;
	}
	chmod(o){
		API.files.chmod({data:o.data,success:(j)=>{
			if(j.message==='')this.storage[o.data.path].prop[11]=o.data.mode;
			if(o.success)o.success(j);
		}});
	}
	ls(o){
		API.files.ls({waiting:o.waiting,data:o.data,success:(j)=>{
			var p=o.data.path;if(o.win)o.win.path=p;
			this.setStorage(p,j);this.refreshWin(p,true);
			if(p==='trash:///')this.trash();
			if(o.success)o.success(j);
		},error:(j)=>{
			if(!o.win)return;
			o.win.win.alert(j);
		}});
	}
	trash(b){
		var j=this.storage['trash:///'];
		var $t=$('.trash',OS.desktop.$content);
		if((j&&j.children&&j.children.length>0)||b)$t.addClass('full');
		else $t.removeClass('full');
	}
	mkdir(o){
		API.files.mkdir({data:o.data,success:(j)=>{
			var d=this.dirname(o.data.path);
			this.delStorage(d);this.refreshWin(d);
			if(o.success)o.success(j);
		}});
	}
	mv(o){
		var p=[],_p=o.data.path;if(typeof(p)==='string')p=[o.data.path];for(var i of _p){if($.inArray(i,['trash:///','home:///','file:///','root:///','share:///'])===-1)p.push(i)}if(p.length==0)return;o.data.path=JSON.stringify(p);
		var np=o.data.newpath,w=OS.progress();
		API.files.mv({
			data:o.data
			,nowaiting:o.nowaiting
			,success:(j)=>{
				var _p=[np];for(var f of p){var d=this.dirname(f);if($.inArray(d,_p)==-1)_p.push(d);}
				if(d.indexOf('trash:///')===0){d='trash:///';this.delStorage(d);}
				this.delStorage(_p);this.delStorage(np);this.refreshWin(d);this.refreshWin(np);
				if(np==='trash:///')this.trash(true);
				if(o.success)o.success(j);
				w.close();
			}
			,error:(j)=>{if(o.error)o.error(j);}
		});
	}
	cp(o){
		var p=[],np=o.data.newpath,_p=o.data.path;if(typeof(_p)==='string')_p=[o.data.path];for(var i of _p){if($.inArray(i,['trash:///','file:///','root:///','share:///'])===-1)p.push(i)}o.data.path=JSON.stringify(p);
		var w=OS.progress();
		API.files.cp({
			data:o.data
			,nowaiting:o.nowaiting
			,success:(j)=>{this.delStorage(np);this.refreshWin(np);if(o.success)o.success(j);w.close();}
			,error:(j)=>{if(o.error)o.error(j);}
		});
	}
	rm(o){
		var p=[],_p=o.data.path;if(typeof(_p)==='string')_p=[o.data.path];for(var i of _p){if($.inArray(i,['trash:///','home:///','file:///','root:///','share:///'])===-1)p.push(i)}if(p.length==0)return;o.data.path=JSON.stringify(p);
		var w=OS.progress();
		API.files.rm({
			data:o.data
			,nowaiting:o.nowaiting
			,success:(j)=>{
				var _p=[];for(var f of p){var d=this.dirname(f);if($.inArray(d,_p)===-1)_p.push(d);}
				this.delStorage(_p);this.refreshWin(_p);
				if(o.success)o.success(j);
				w.close();
			}
		});
	}
	find(o){
		var w=OS.progress();
		API.files.find({
			data:o.data
			,nowaiting:o.nowaiting
			,success:(j)=>{
				var p=o.data.path;
				this.setStorage(p,j,true);
				if(o.success)o.success(j);
				w.close();
			}
		});
	}
	zip(o){
		var w=OS.progress();
		API.files.zip({
			data:o.data
			,nowaiting:o.nowaiting
			,success:(j)=>{
				this.refreshWin(o.data.path);
				if(o.success)o.success(j);
				w.close();
			}
		});
	}
	unzip(o){
		var w=OS.progress();
		API.files.unzip({
			data:o.data
			,nowaiting:o.nowaiting
			,success:(j)=>{
				this.refreshWin(o.data.path);
				if(o.success)o.success(j);
				w.close();
			}
		});
	}
	ln(o){
		var p=o.data.path;if(typeof(p)==='string')p=[o.data.path];o.data.path=JSON.stringify(p);
		var _p=o.data.newpath;
		API.files.ln({
			data:o.data
			,success:(j)=>{
				this.delStorage(_p);this.refreshWin(_p);
				if(o.success)o.success(j);
			}
		});
	}
	cleartrash(o){
		API.files.cleartrash({success:(j)=>{
			this.delStorage('trash:///');this.refreshWin('trash:///');
			$('.fileicon.trash',OS.desktop.$content).removeClass('full');
			if(o&&o.success)o.success(j);
		}});
	}
	open(p){
		var m=this.getProp(p).mime;
		switch(m){
			case 'text':case 'code':
				OS.TextEditor.load(p);
			break;
			case 'image':
				OS.ImageViewer.load(p);
			break;
			case 'audio':case 'video':
				OS.MediaPlayer.load(p);
			break;
			case 'zip':
			break;
			default:
				OS.alert($.l10n.__('noapplication'));
			break;
		}
	}
	read(o){
		FETCH({
			url:o.path
			,method:'GET'
			,dataType:'text'
			,success:o.success
		})
	}
	save(o){
		FETCH({
			url:o.path
			,method:'PUT'
			,headers:$.extend({'Content-Type':'application/application/octet-stream'},o.headers)
			,data:o.data
			,success:o.success
			,waiting:o.waiting
			,nowaiting:o.nowaiting
		})
	}
	localpath(p){
		if(p.indexOf('/home/'+USERINFO.name+'/Desktop/')===0)return p.replace('/home/'+USERINFO.name+'/Desktop/','desktop:///');
		if(p.indexOf('/home/'+USERINFO.name+'/.network/')===0)return p.replace('/home/'+USERINFO.name+'/.network/','network:///');
		if(p.indexOf('/home/'+USERINFO.name+'/')===0)return p.replace('/home/'+USERINFO.name+'/','home:///');
		if(p.indexOf('/box/drives/')===0)return p.replace('/box/drives/','file:///');
		if(p.indexOf('/')===0)return p.replace('/','file:///C:/');
	}
	serverpath(p,abs){
		if(p.indexOf('home:///')===0)return p.replace('home:///','/home/'+USERINFO.name+'/');
		if(p.indexOf('desktop:///')===0)return p.replace('desktop:///','/home/'+USERINFO.name+'/Desktop/');
		if(p.indexOf('public:///')===0)return p.replace('public:///','/home/Public/');
		if(p.indexOf('network:///')===0)return p.replace('network:///','/home/'+USERINFO.name+'/.network/');
		if(p.indexOf('file:///')===0){
			if(!abs)return p.replace('file:///','/box/drives/');
			var _p=p.replace('file:///',''),i=_p.indexOf(':'),d=_p.substr(0,i+2),f=_p.substr(i+2),u=OS.path.storage['file:///'+d].prop[14].ID_FS_UUID;
			return '/media/'+u+'/'+f;
		}
	}
	getDrop(e){
		var ps=e.originalEvent.dataTransfer.getData('path');
		if(ps){
			var p=JSON.parse(ps);if(p.length===[0])p=p[0];return p;
		}else{
			var items=e.originalEvent.dataTransfer.items,_files=[];
			for(var i of items){_files.push(i.webkitGetAsEntry());}
			return _files;
		}
	}
	getStorage(p){
		return this.storage[p];
	}
	setStorage(p,j,s){
		if(!s){
			for(var f in this.storage){if(f.indexOf(p)===0)delete(this.storage[f]);}
			this.storage[p]=j;
		}
		for(var i of j.children||[]){
			var _p=(p==='root:///'?'':p)+i[8];i[8]=_p;
			if(!this.storage[_p])this.storage[_p]={};
			this.storage[_p].prop=i;
		}
	}
	delStorage(p){
		if(typeof(p)==='string')p=[p];
		for(var s in this.storage){
			for(var _p of p){if(s.indexOf(_p)===0)delete(this.storage[s]);}
		}
	}
	getUsage(p){
		var r=this.devname(p);
		if(r&&this.storage[r]){var o=this.getProp(r);return o.usage;}
		return null;
	}
	addWin(w){
		this.wins.push(w);
	}
	delWin(w){
		this.wins.splice($.inArray(w,this.wins),1)
	}
	refreshWin(p,r){
		if(!r)this.delStorage(p);
		if(typeof(p)==='string')p=[p];
		for(var w of this.wins){
			for(var _p of p){if(w.path.indexOf(_p)===0)w.load();}
		}
	}
}