function init(){
	bind();
	load();
}

function bind(){
	$('#refresh').click(load);
	$('#add').click(add);
	$('#start').click(start);
	$('#restart').click(restart);
	$('#stop').click(stop);
	$('table').on('click','a',remove);
}

function load(){
	API.zerotier.get({success:parse});
}

function parse(j){
	$('table').empty();
	$('#enabled').prop('checked',j.enabled);
	if(j.active){
		$('#start').hide();
		$('#restart,#stop,#add').show();
		for(var n of j.networks){
			var h='<tr id="'+n+'"><td><b>'+n+'</b><br><a class="linkbutton" nwid="'+n+'">'+$.l10n.__('remove')+'</a></td></tr><tr><td id="'+n+'_detail"></td></tr>'
			$('table').append(h);
		}
		for(var n of j.detail){
			var h=($.l10n.__('name')+':'+n.name+'<br>'+$.l10n.__('status')+':'+n.status+'<br>'+$.l10n.__('ipaddr')+':'+n.assignedAddresses.join()+'<hr>')
			$('#'+n.nwid+'_detail').html(h);
		}
	}else{
		$('#start').show();
		$('#restart,#stop,#add').hide();
	}
}

function add(){
	WINDOW.prompt($.l10n.__('name'),'','',(t)=>{
		API.zerotier.add({data:{name:t},success:load});
	})
}

function remove(){
	var t=$(this).attr('nwid');
	API.zerotier.remove({data:{name:t},success:load});
}

function start(){
	set('start');
}

function restart(){
	set('restart');
}

function stop(){
	set('stop');
}

function set(a){
	API.zerotier.set({
		data:{
			enable:$('#enabled').is(':checked')
			,networks:$('#networks').val()
			,option:a
		}
		,success:load
	});
}