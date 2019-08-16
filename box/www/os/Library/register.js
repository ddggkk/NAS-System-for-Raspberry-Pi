$(bind);

function bind(){
	API.auth.getdev({success:(j)=>$('#dkey').val(j.key)});
	$('#ok').click(register);
	$('input').keypress((e)=>{if(e.which==13)register()});
}

function register(){
	var k=$.trim($('#rkey').val());
	if(k==='')return;
	API.auth.register({
		data:{key:k}
		,success:()=>{
			location='../index.html'
		}
	});
}