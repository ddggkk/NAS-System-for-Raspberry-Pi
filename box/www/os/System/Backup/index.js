function init(){
	bind();
	load();
}


function bind(){
	$('.refresh').click(load);
	$('.add').click(add);
	$('#main').on('click','a',function(){backup(this);});
}

function load(o){
	API.backup.get({success:parse});
}

function parse(j){
	var $b=$('#main table tbody'),h=[];
	$b.empty();
	for(var i of j){
		if(i.ftp){
			h.push('<tr class="dir mobile"><td class="fileicon"><div></div>'+i.ftp+'<br><a class="linkbutton" path="'+i.ftp+'" >'+$.l10n.__('backup')+'</a></td></tr>');
		}
		else {
			h.push('<tr class="dir '+(i.vendor==='Apple_Inc.'?'ios':'android')+'"><td class="fileicon"><div></div>'+i.model+'<br><a class="linkbutton" path="'+i.uuid+'" model="'+i.model+'">'+$.l10n.__('backup')+'</a></td></tr>');
		}
	}
	$b.html(h.join(''));
}

function backup(e){
	var $e=$(e),p=$e.attr('path'),m=$e.attr('model');
	WINDOW.dialog({url:'settings.html?path='+p+(m?'&model='+m:''),caption:$.l10n.__('settings'),width:500,height:550});
}

function add(){
	WINDOW.prompt($.l10n.__('add'),'','ftp://',(p)=>{
		var $d=$('#main [ftp="'+p+'"]');if($d[0])return;
		API.backup.check({data:{ftp:p},success:load})
	});
}