function init(){
	load();
}

function load(){
	API.info.gettemp({nowaiting:true,success:parseTemp});
}

function parseTemp(j){
	$('#temp').html(j.temp);
	window.setTimeout(load,5000);
}