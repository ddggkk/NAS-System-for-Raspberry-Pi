var DOMAIN=sessionStorage.domain||'/';
if(window===top){
	var VERSION='1.0',PATHNAME=getPathname(location.pathname)==='login.html';
	if(localStorage.version!==VERSION)for(var i in localStorage)localStorage.removeItem(i);localStorage.version=VERSION;
	var DEVINFO=sessionStorage.devinfo?JSON.parse(sessionStorage.devinfo):null,USERINFO=sessionStorage.userinfo?JSON.parse(sessionStorage.userinfo):null;
	if(PATHNAME==='login.html'){delete(USERINFO);sessionStorage.removeItem('userinfo');if(!DEVINFO)location=window.top.DOMAIN+'index.html';}
	else{if(!sessionStorage.userinfo&&PATHNAME==='register.html'&&PATHNAME==='install.html')location=DOMAIN;}
}else{
	USERINFO=top.USERINFO;
	DEVINFO=top.DEVINFO;
}
document.onkeydown=(e)=>{if(e.keyCode==27)$('body>.waiting').remove()};
var SCHEMA={
	auth:['login','logout','passwd','reboot','poweroff','users','useradd','userdel','getdev','register']
	,info:['status','base','get','getapps','gettime','settime','sethostname','setworkgroup','getnetwork','setnetwork','setwifi','getbluetooth','pairbluetooth','unpairbluetooth','connectbluetooth','disconnectbluetooth','gettemp']
	,files:['exists','ls','mkdir','rm','mv','cp','find','ln','zip','unzip','cleartrash','chmod','trash','setbackground','transencode']
	,disk:['get','mount','umount','mkfs','mkpart','rmpart','mkpart','erase','eject','craid','draid','rmraid','addraid']
	,service:['set','enable','start','restart','stop']
	,dlna:['get','set']
	,daap:['get','set']
	,zerotier:['get','set','add','remove']
	,n2n:['get','set']
	,backup:['get','set','check','getconf','setconf','getpath']
	,camera:['get','start','stop','screen','snapshot','record','stoprecord','getconf','setconf']
	,omxplayer:['play','control']
	,kodi:['status','start','stop','power']
}

var API={
	logout:function(){
		delete(USERINFO);sessionStorage.removeItem('userinfo');
		delete(DEVINFO);sessionStorage.removeItem('devinfo');
		location='../index.html';
	}
	,login:function(o){
		delete(USERINFO);
		localStorage.lastuser=o.data.name;
		localStorage.language=window.top.LANGUAGE;
		localStorage.removeItem('power');
		API.auth.login({
			data:{auth:o.data.pass}
			,success:function(json){
				sessionStorage.userinfo=JSON.stringify(json);
				top.location='index.html';
			}
		});
	}
	,load:function(s){
		s=s||SCHEMA;
		for(let i in s){
			API[i]={};
			var S=s[i];
			for(let j of S){
				let url=i+'/'+j;
				API[i][j]=(o)=>{
					o=o||{};
					o.url=url;
					FETCH(o);
				}
			}
		}
	}
};

API.load();

function FETCH(o){
	var w=false;
	if(!o.waiting&&!o.nowaiting){$('body').append('<div class="waiting"></div>');o.waiting=$('body>.waiting');w=true;}
	if(o.waiting){o.waiting.show();}
	let op=$.extend({
		method:'POST'
		,headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		,credentials:'include'
		,cache:'reload'
		,data:{}
		,dataType:'json'
		,processData:true
	},o);
	let url=DOMAIN+(op.method==='POST'?'box/':'')+op.url;
	if(op.method==='POST')op.body=op.processData?serialize(o.data):o.data;
	if(op.method==='PUT'||op.method==='post')op.body=o.data;
	fetch(url,op).then((r)=>{
			if(o.waiting)o.waiting.hide();
			if(w)$(o.waiting).remove();
			if(!(r.status>=200&&r.status<300)){(o.error||alert)(r.statusText);return}
			if(op.dataType==='text')return r.text();
			return r.json();
		}).then((json)=>{
			if(typeof(json)==='string'){
				if(o.success)o.success(json);
				return;
			}
			if(json.status===0){
				switch(json.message){
					case 408:
						API.logout();
						return;
					break;
					case 409:
						top.location='register.html';
						return;
					case 410:
						top.location='install.html';
						return;
					default:
						json.message=top.$.l10n.__(json.message);
					break;
				}
				var m=(json.message+'').replace(/\n/g,'<br>');
				if(o.error)o.error(json.message);else alert(m);
				return;
			}
			if(o.success)o.success(json);
		}).catch((e)=>{
			if(o.error)o.error();
		});
}