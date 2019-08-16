var FILE='home:///.share.list';
function init(){
	bind();
	load();
}

function bind(){
	$('.add').click(file);
	$('.open').click(folder);
	$('.remove').click(remove);
	$('.save').click(save);
	$('#list').on('click','li',function(){
		$(this).toggleClass('ui-selected');
	}).on('dblclick','p',function(){
		OS.FileManager.load({path:this.innerText});
	});
}

function load(){
	OS.path.read({path:FILE,success:parsePath});
}

function parsePath(t){
	if(t=='404'||t=='403')return;
	var $ul=$('#list');$ul.empty();
	var _t=t.split('\n');
	for(var l of _t){
		var L=$.trim(l);
		if(L==='')continue;
		if(L.indexOf('#')===0)continue;
		var i=L.indexOf('='),t=$.trim(L.substr(0,i)),u=$.trim(L.substr(i+1));
		addPath(t,u);
	}
}

function addPath(t,u){
	var $ul=$('#list'),c=/\/$/.test(u)?'folder':'file';
	$ul.append('<li class="'+c+'"><h2>'+t+'</h2><p>'+u+'</p></li>');
}


function add(p){
	var $l=$('#list li p')
	for(var l of $l){
		if(l.innerHTML===p){
			WINDOW.alert($.l10n.__('itemexists'));
			return;
		}
	}
	var _t=new Date().getTime(),t=btoa((_t+rand(0,_t)).toString(36)).replace(/\=/g,'');
	addPath(t,p);
}

function folder(){
	WINDOW.opendir({
		callback:(d)=>{
			add(d)
			return true;
		}
	})
}

function file(){
	WINDOW.open({
		callback:(d)=>{
			for(var i of d)add(i)
			return true;
		}
	})
}

function remove(){
	var $li=$('#list li.ui-selected');
	$li.remove();
}

function save(){
	var data=[];
	var $l=$('#list li')
	for(var l of $l){
		var t=$('h2',l).text(),u=$('p',l).text();
		data.push(t+'='+u);
	}
	data=data.join('\n')
	OS.path.save({path:FILE,data:data});
}