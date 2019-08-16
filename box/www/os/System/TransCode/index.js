function init(){
	bind();
}

function bind(){
	$('#start').click(start);
	$('#source').click(source);
	$('#source,#targetencode').change(source);
}


function start(a){
	API.files.transencode({
		data:{
			source:$('#source').val()
			,sourceencode:$('#sourceencode').val()
			,target:$('#target').val()
			,targetencode:$('#targetencode').val()
		}
		,success:function(){
			var t=$('#target').val();
			t=OS.path.dirname(t);
			OS.path.refreshWin(t);
		}
	});
}

function source(){
	WINDOW.open({
		single:true
		,callback:(d)=>{
			$('#source').val(d);
			var c=OS.path.getProp(d).charset;
			if(window.top.LANGUAGE=='zh-cn'&&c=='iso-8859-1')c='gbk';
			$('#sourceencode').val(c);
			change();
			return true;
		}
	});
}

function change(){
	var c=$('#targetencode').val(),s=$('#source').val(),i=s.lastIndexOf('.'),t=s.substr(0,i);
	t=t+'.'+c+s.substr(i);
	$('#target').val(t)
}