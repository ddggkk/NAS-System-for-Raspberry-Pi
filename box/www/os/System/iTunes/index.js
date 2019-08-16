function init(){
	bind();
	load();
}

function bind(){
	if(!top.USERINFO.admin)$('#toolbar .settings').remove();
	$('#toolbar .settings').click(settings);
	$('#toolbar .refresh').click(refresh);
	$('#main')
	.on('click','tr',function(){$(this).toggleClass('ui-selected').siblings().removeClass('ui-selected')})
	.on('dblclick','tr',function(){
		OS.MediaPlayer.load({
			url:$(this).attr('url')
			,title:$(this).attr('title')
			,type:'audio'
		});
	});
}

function settings(){
	WINDOW.dialog({url:'settings.html',caption:$.l10n.__('settings'),width:500,height:200});
}

function load(){
	var client=new DaapClient();
	client.login(function(code){
		if(code==200)client.fetchStreams(parse);
	});
}

function parse(c,d){
	var $b=$('#main table tbody'),h=window.top.DOMAIN.replace(/\/$/,'');
	$b.empty();
	for(var s of d){
		/*uri，trackNumber，title，album，artist，genre，id，duration，size，format，bitrate，year*/
		$b.append('<tr class="audio" title="'+s.title+'" url="'+h+s.uri+'&id='+s.id+'" id="'+s.id+'"><td class="fileicon audio"><div></div>'+s.title+'</td></tr>');
	}
}

function refresh(){
	load();
}