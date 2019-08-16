function init(){
	load();
	bind();
}

function bind(){
	$('#ok').click(set);
	$('#cancel').click(()=>{WINDOW.close()});
}

function load(){
	API.camera.getconf({data:{dev:getRequest('d')},success:parse});
}

function parse(j){
	$('#mode option[value="'+j.mode+'"]').attr('selected','selected');
	$('#size').val(j.size);
	$('#frequency').val(j.frequency);
}

function set(a){
	API.camera.setconf({
		data:{
			dev:getRequest('d')
			,mode:$.trim($('#mode').val())
			,size:$.trim($('#size').val())
			,frequency:$.trim($('#frequency').val())
		}
		,success:function(){
			WINDOW.parent.frameWindow.start();
		}
	});
}