if(!sessionStorage.devinfo)location=DOMAIN||'../index.html';
document.title=DEVINFO.hostname;
$(function(){
	bindEvent();
	loadLangs();
});

function loadLangs(){
	$.getJSON('Configurations/System/languages.json', parseLangs);
}

function parseLangs(json){
	let ls=[],lc=[],$langs=$('#langs');
	for(var i in json){
		$langs.append(`<a code="${i}">${json[i]}</a>`);
	}
	var l=window.top.LANGUAGE;
	if($.inArray(l,lc)>=-1){
		$('#langs a[code="'+l+'"]').click();
	}else{
		$('#langs a[code="en"]').click();
	}
}

function  bindEvent(){
	var $cu=$('#change');
	var $u=$('#username');
	var $ul=$('#label');
	var $p=$('#username');
	if(!DEVINFO.registered||DEVINFO.registered=='trial')$('#register').show();else $('#register').hide();
	if(localStorage.lastuser){
		$u.val(localStorage.lastuser).hide();
		$ul.html(localStorage.lastuser).show();
		$cu.show();
	}
	$cu.click(function(){
		$cu.hide();
		$ul.hide();
		$u.show();
	});
	$('#username,#password').keypress(function(e){
		if(e.which==13){
			var u=$.trim($('#username').val());
			var p=p=$.trim($('#password').val());
			if(p==='')$p.focus();
			if(u==='')$u.focus();
			if(p!==''&&u!=='')login();
		}
	});
	$('#langs').on('click','a',function(){
		$('#langs a.selected').removeClass('selected');
		$(this).addClass('selected');
		setLang($(this).attr('code'));
	});
	$('#login').on('click',login);
}


function login(){
	var u=$.trim($('#username').val());
	var p=$.trim($('#password').val());
	if(u===''||p==='')return;
	var crypt = new JSEncrypt();
	var k=DEVINFO.publickey;
	var t=DEVINFO.time;
	var n=DEVINFO.nonce;
	crypt.setPublicKey(k);
	p=`${t}:${n}:${u}:${p}:`;
	p=crypt.encrypt(p);
	API.login({
		data:{
			name:u
			,pass:p
		}
	});
}