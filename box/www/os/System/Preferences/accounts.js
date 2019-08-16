var NAME;
$(init);

function init(){
	layout();
	bind();
	load();
}

function layout(){
	$('body').layout({center:{pane:'#center'},west:{pane:'#west',size:220,popable:true}});
}

function bind(){
	$('#ok').click(set);
	$('.add').click(add);
	$('.del').click(del);
	$('#password,#confirmpass').change(()=>$('#password,#confirmpass').removeClass('error'));
	$('#list').on('mousedown','li',show);
}

function load(){
	API.auth.users({success:parse});
}

function parse(j){
	var $ul=$('#list');$ul.empty();
	for(var i of j){
		var d=document.createElement('li');d.setAttribute('name',i.name);
		var n=document.createElement('h2');n.innerHTML=i.name;
		d.data=i;
		$(d).append(n).appendTo($ul);
	}
	$ul.selected({filter:'li',single:true})
	$('li',$ul).mousedown(show);
	var $s=$('li[name="'+NAME+'"]');
	if($s[0])$s.mousedown()
	else $('li:first',$ul).mousedown();
}

function show(){
	$('#username').val(this.data.name).attr('disabled','disabled');
	$('#password,#confirmpass').val('').removeClass('error');
	$('#admin').prop('checked',this.data.admin);
}

function set(){
	var n=$('#username').val(),p=$('#password').val(),c=$('#confirmpass').val(),a=$('#admin').prop('checked');
	NAME=n;
	if(p!==c){$('#password,#confirmpass').addClass('error');return;}
	API.auth.passwd({
		data:{
			name:n
			,pass:p
			,admin:a
		}
		,success:()=>{
			$('#info').html($.l10n.__('saved'));
			setTimeout(()=>$('#info').empty(),2000);
			load();
		}
	})
}

function add(){
	$('.ui-selected').removeClass('ui-selected');
	$('input').val('').prop('disabled',false);
	$('#admin').prop('checked',false);
}

function del(){
	var n=$('.ui-selected').attr('name');
	NAME=n;
	API.auth.userdel({
		data:{name:n}
		,success:load
	})
}