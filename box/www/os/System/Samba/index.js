var LIST={},PATH,FILE='home:///.smb.conf';
function init(){
	layout();
	bind();
	load();
}

function layout(){
	$('#users,#path').hide();
	$('body').layout({center:{pane:'#center'},west:{pane:'#side',size:220,popable:true},north:{pane:'#toolbar',size:30}});
}

function bind(){
	$('.add').click(add);
	$('.del').click(del);
	$('.save').click(save);
	$('#list').on('click','li',function(){
		$('#list .ui-selected').removeClass('ui-selected');
		$(this).addClass('ui-selected');
		parse(this);
	});
	$('#users').on('click','input',set)
}

function load(){
	API.auth.users({success:parseUser});
	OS.path.read({path:FILE,success:parsePath});
}

function parsePath(t){
	if(t=='404'||t=='403')return;
	var $ul=$('#list');$ul.empty();
	var j={};
	var _t=t.split('\n');
	for(var l of _t){
		var L=$.trim(l);
		if(L==='')continue;
		if(L.indexOf('#')===0)continue;
		if(L.indexOf('[')===0){
			var _n=L.replace('[','').replace(']','');
			var n={name:_n};
			j[_n]=n;
			continue;
		}
		if(n){
			var _L=L.indexOf('=');
			var L0=$.trim(L.substr(0,_L)),L1=$.trim(L.substr(_L+1));
			n[L0]=L0==='path'?OS.path.localpath(L1):L1;
		}
	}
	LIST=j;
	for(var _i in j){
		var i=j[_i];
		if(!i.path)continue;
		addPath(i)
	}
}

function addPath(i){
	var $ul=$('#list');
	var l=document.createElement('li'),n=document.createElement('h2');
	l.data=i;n.innerHTML=i.name;
	$(l).append(n).appendTo($ul);
}

function parseUser(j){
	var $ul=$('#users');$ul.empty();
	for(var i of j){
		var c=document.createElement('input');
		var d=document.createElement('li');d.setAttribute('name',i.name);d.data=i
		$(d).html('<label class="accounts"><input type="checkbox"/> '+i.name+'</label><br><label><input type="checkbox"/> '+$.l10n.__('writable')+'</label>').appendTo($ul);
	}
}

function parse(li){
	$('#users,#path').show();
	$('#users input').prop('checked',false);
	var j=li.data,u=j['valid users']||'Everyone',w=j['write list']||'';u=u.split(',');w=w.split(',');
	for(var i of u)$('#users [name="'+i+'"] input:first ').prop('checked',true);
	for(var i of w)$('#users [name="'+i+'"] input:last').prop('checked',true);
	$('#path').html(j.path);PATH=j.name;
}

function set(){
	var $li=$('#users li'),u=[],w=[];
	for(var li of $li){
		var n=li.getAttribute('name');
		var c=$('input:first',li).prop('checked'),_w=$('input:last',li).prop('checked');
		if(!c){$('input:last',li).prop('checked',false);continue};
		u.push(n);if(_w)w.push(n);
	}
	if(u.length>0)LIST[PATH]['valid users']=u.join(',');
	else delete(LIST[PATH]['valid users']);
	if(w.length>0)LIST[PATH]['write list']=w.join(',');
	else delete(LIST[PATH]['write list']);
}

function add(){
	WINDOW.opendir({
		callback:(d)=>{
			if(exists(d)){
				WINDOW.alert($.l10n.__('itemexists'));
				return;
			}
			var p=OS.path.getProp(d);
			n=p.name.replace(/[\\\/\:\*\?\"\<\>\|]/g,'')
			var i={
				'name':n
				,'path':d
				,'browseable':'Yes'
				,'read only':'Yes'
				,'create mode':'0660'
				,'directory mode':'0770'
			}
			LIST[n]=i;
			addPath(i);
			return true;
		}
	})
}

function del(){
	var $li=$('#list li.ui-selected');
	for(var li of $li){
		delete(LIST[li.data.name]);
	}
	$li.remove();
	$('#users,#path').hide();
	$('#list li:first').click();
}

function save(){
	var data=[];
	for(var i in LIST){
		var l=LIST[i];
		data.push('['+i+']');
		for(var _i in l){
			var _l=l[_i];
			if(_i==='name'){continue;}
			if(_i==='path')_l=OS.path.serverpath(_l);
			data.push(_i+' = '+_l);
		}
		data.push('\n');
	}
	data=data.join('\n')
	OS.path.save({
		path:FILE
		,data:data
		,success:()=>{
			API.service.restart({data:{name:'samba'}});
		}
	});
}

function exists(p){
	for(var i in LIST){
		if(LIST[i].path===p)return true;
	};
	return false;
}