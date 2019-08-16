function init(){
	$('body').on('mousedown','div[data-option-key="dir"] input',loaddir);
}
function loaddir(i){
	WINDOW.opendir({
		callback:(d)=>{
			var r=OS.path.serverpath(d,true).replace(/\/$/,'');
			$(this).val(r);
			return true;
		}
	});
}