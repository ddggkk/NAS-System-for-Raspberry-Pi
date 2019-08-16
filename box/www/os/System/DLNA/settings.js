function init(){
	load();
	bind();
}

function bind(){
	$('#enabled').click(enable);
	$('#start').click(start);
	$('#restart').click(restart);
	$('#stop').click(stop);
	$('#rescan').click(rescan);
	$('#path').mousedown(dir);
}

function load(){
	API.dlna.get({success:parse});
}

function parse(j){
	$('#path').val(j.media_dir);
	$('#enabled').prop('checked',j.enabled);
	if(j.active){
		$('#start').hide();
		$('#restart,#stop,#rescan').show();
	}else{
		$('#start').show();
		$('#restart,#stop,#rescan').hide();
	}
}

function enable(){
	set('enable');
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

function rescan(){
	set('rescan');
}

function set(a){
	API.dlna.set({
		data:{
			enable:$('#enabled').is(':checked')
			,path:$('#path').val()
			,option:a
		}
		,success:load
	});
}

function dir(){
	WINDOW.opendir({
		callback:(d)=>{$('#path').val(d);return true;}
	})
}