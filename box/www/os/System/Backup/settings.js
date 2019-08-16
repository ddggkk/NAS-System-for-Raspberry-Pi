var PATH=getRequest('path'),MODEL=getRequest('model'),FTP=PATH.indexOf('ftp://')==0;
function init(){
	load();
	browse();
	bind();
}

function bind(){
	$('#to').click(dir);
	$('#ok').click(set);
	$('#cancel').click(()=>{WINDOW.close()});
	$('#tree').on('click','a',function(){browse($(this).attr('path'))});
	$('#tree').on('click','input',change);
}

function load(){
	API.backup.getconf({data:{path:PATH},success:parse});
}

function parse(j){
	$('#to').val(j.to);
	$('#backup').val(j.backup.join('\n'));
	$('#auto').attr('checked',j.auto=='true');
	$('#folder').val(j.folder);
	if(j.folder==''){
		if(!FTP)$('#folder').val(MODEL+'_'+PATH);
	}
}

function set(a){
	var f=$.trim($('#folder').val()),t=$.trim($('#to').val());
	if(f==''||t=='')return;
	API.backup.setconf({
		data:{
			path:PATH
			,backup:JSON.stringify($('#backup').val().split('\n'))
			,to:$('#to').val()
			,folder:$('#folder').val()
			,auto:$('#auto').is(':checked')
		}
		,success:function(){
			alert($.l10n.__('running'))
			WINDOW.close();
		}
	});
}

function browse(p){
	API.backup.getpath({data:{path:p||PATH},success:(j)=>parsetree(p||PATH,j)})
}

function parsetree(p,j){
	var a=$('#tree a[path="'+p+'"]')[0];
	if(!a){var $ul=$('#tree');}
	else{if(a.nextSibling)return;var ul=document.createElement('ul');$(a).after(ul);var $ul=$(ul);}
	for(var i of j){
		$ul.append('<li><input type="checkbox"></input><a path="'+p+'/'+i+'">'+i+'</a></li>');
	}
}

function change(){
	var $i=$('#tree input:checked'),r=FTP,t=[];
	$i.each(function(){
		var $a=$(this).next(),p=$a.attr('path'),_p=p.replace(PATH+'/','');t.push(_p);
	});
	$('#backup').val(t.join('\n'));
}

function dir(){
	WINDOW.opendir({
		callback:(d)=>{$('#to').val(d);return true;}
	})
}