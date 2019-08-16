function init(){
	load();
	bind();
}

function bind(){
	$('#enabled').click(enable);
	$('#start').click(start);
	$('#restart').click(restart);
	$('#stop').click(stop);
}

function load(){
	API.n2n.get({success:parse});
}

function parse(j){
	$('#N2N_SUPERNODE').val(j.N2N_SUPERNODE);
	$('#N2N_SUPERNODE_PORT').val(j.N2N_SUPERNODE_PORT);
	$('#N2N_COMMUNITY').val(j.N2N_COMMUNITY);
	$('#N2N_KEY').val(j.N2N_KEY);
	$('#N2N_IP').val(j.N2N_IP);
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

function set(a){
	API.n2n.set({
		data:{
			enable:$('#enabled').is(':checked')
			,N2N_SUPERNODE:$('#N2N_SUPERNODE').val()
			,N2N_SUPERNODE_PORT:$('#N2N_SUPERNODE_PORT').val()
			,N2N_COMMUNITY:$('#N2N_COMMUNITY').val()
			,N2N_KEY:$('#N2N_KEY').val()
			,N2N_IP:$('#N2N_IP').val()
			,option:a
		}
		,success:load
	});
}