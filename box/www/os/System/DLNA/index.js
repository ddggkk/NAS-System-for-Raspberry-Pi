var ID='0',PID='-1',BF;
function init(){
	layout();
	bind();
	load();
}

function layout(){
	if(!top.USERINFO.admin)$('#toolbar .settings').remove();
	if(isMobile)$('#side').hide();
	$('body').layout({center:{pane:'#main'},west:isMobile?null:{pane:'#side',size:220,resizable:true},north:{pane:'#toolbar',size:30}});
}

function bind(){
	$('#toolbar .settings').click(settings);
	$('#toolbar .up').click(up);
	$('#toolbar .refresh').click(refresh);
	$('#side').on('click','ul ul a',function(){load({id:this.id})});
	$('#main')
	.on('click','tr',function(){$(this).toggleClass('ui-selected').siblings().removeClass('ui-selected')})
	.on('dblclick','tr',function(){
		if($(this).hasClass('dir')){
			load({id:this.id});
			return;
		}
		if($(this).hasClass('image')){
			var $i=$('#main tr.image'),i=[],_i=0,I,_this=this;
			$i.each(function(){i.push($(this).attr('url'));if(this==_this)I=_i;_i++});
			OS.ImageViewer.load({items:i,index:I});
			return;
		}
		OS.MediaPlayer.load({
			url:$(this).attr('url')
			,title:$(this).attr('title')
			,type:$(this).hasClass('audio')?'audio':'video'
		});
	});
}

function settings(){
	WINDOW.dialog({url:'settings.html',caption:$.l10n.__('settings'),width:500,height:200});
}

function load(o){
	o=$.extend({
		id:'0'
		,action:'Browse' //Browse Search GetSearchCapabilities GetSortCapabilities
		,RequestedCount: 1000
		,StartingIndex: 0
		,BrowseFlag: 'BrowseDirectChildren'
		,Filter: '*' 
		,SearchCriteria:''
		,SortCriteria: '+dc:title'
		,success:null
		,error:null
	},o||{});
	ID=o.id;
	var xml='<?xml version="1.0" encoding="UTF-8" ?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><s:Body><u:Search xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><ContainerID>'+o.id+'</ContainerID><BrowseFlag>'+o.BrowseFlag+'</BrowseFlag><SearchCriteria>'+o.SearchCriteria+'</SearchCriteria><Filter>'+o.Filter+'</Filter><StartingIndex>'+o.StartingIndex+'</StartingIndex><RequestedCount>'+o.RequestedCount+'</RequestedCount><SortCriteria>'+o.SortCriteria+'</SortCriteria></u:Search></s:Body></s:Envelope>';
	$.ajax({
		url:window.top.DOMAIN+'ctl/ContentDir'
		,type:'POST'
		,cache:false
		,data:xml
		,contentType:'text/xml; charset="utf-8"'
		,headers:{'SOAPACTION': 'urn:schemas-upnp-org:service:ContentDirectory:1#'+o.action}
		,success:parse
	});
}


function parse(x){
	var $b=$('#main table tbody'),r=$('Result',x).text(),l=$('#side ul ul li')[0]?true:false;
	$b.empty();
	$('container,item',r).each(function(){
		var id=$(this).attr('id'),_t=$('dc\\:title',this).text(),t=_t,m=$('upnp\\:class',this).text(),u=$('res:first',this).text(),i=$('res:last',this).text();
		if(m.indexOf('container')>-1){m='dir';}else{if(m.indexOf('photo')>-1)m='image';if(m.indexOf('audio')>-1)m='audio';if(m.indexOf('video')>-1)m='video';}
		if(/^[\d,A,B,C,D,E,F]+$/.test(id)||(/^[\d,A,B,C,D,E,F]+\$[\d,A,B,C,D,E,F]+$/.test(id)&&id.indexOf(BF)!=0&&u===''))t=$.l10n.__(t.toLowerCase());
		if(!l){
			$ul=$('#side ul ul');
			$ul.append('<li><a class="dir '+_t.toLowerCase()+'" id="'+id+'">'+t+'</a></li>');
			if(_t==='Browse Folders')BF=id;
		}
		$b.append('<tr class="'+m+' '+(/^\d+$/.test(id)?_t.toLowerCase():'')+'" title="'+t+'" url="'+u+'" id="'+id+'"><td class="fileicon"><div '+((m==='image'&&i!=='')?'style="background-image:url('+i+')':'')+'"></div>'+t+'</td></tr>');
	});
	if(ID==='0')$('#toolbar .up').addClass('disabled');
	else $('#toolbar .up').removeClass('disabled')
	if(ID.indexOf('$')>-1){
		var f=ID.indexOf('$')
		var l=ID.lastIndexOf('$')
		var r=ID.substr(0,f);
		PID=ID.substr(0,l);
	}else{
		var r=ID;
		PID='0';
		if(ID==='0')PID='-1';
	}
	$('#side ul ul a').removeClass('ui-selected');
	$('#side ul ul a#'+r).addClass('ui-selected');
}

function up(){
	if(PID==='-1')return;
	load({id:PID});
}

function refresh(){
	load({id:ID});
}