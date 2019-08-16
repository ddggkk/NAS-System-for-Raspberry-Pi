$(bind);

function bind(){
	$('#ok').click(add);
	$('input').keypress((e)=>{if(e.which==13)add()});
}

function add(){
	var u=$.trim($('#username').val());
	var p=$.trim($('#password').val());
	var c=$.trim($('#confirmpass').val());
	if(u===''||p===''||p!==c)return;
	if(!/[a-zA-Z0-9_]{1,32}/.test(u)){
		alert($.l10n.__('account_wrong_format'));
		return;
	}
	API.auth.useradd({
		data:{
			name:u
			,pass:p
			,admin:true
		}
		,success:()=>{
			location='../index.html'
		}
	});
}