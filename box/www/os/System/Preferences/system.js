$(init);

function init(){
	bind();
	load();
}

function bind(){
	$('#hostname').click(sethostname);
	$('#workgroup').click(setworkgroup);
}

function load(){
	API.info.get({
		success:(j)=>{
			for(var i in j){
				$('[l10n="'+i+'"]').next().html(j[i]);
			}
		}
	})
}

function sethostname(){
	window.parent.WINDOW.prompt($.l10n.__('hostname'),'',$('[l10n="hostname"]').next().text(),(t)=>{
		var n=t.replace(/\s/g,'');
		API.info.sethostname({
			data:{name:n}
			,success:()=>{
				$('[l10n="hostname"]').next().html(n);
				window.top.DEVINFO.hostname=n;
				window.top.document.title=n;
			}
		})
	})
	
}

function setworkgroup(){
	window.parent.WINDOW.prompt($.l10n.__('workgroup'),'',$('[l10n="workgroup"]').next().text(),(t)=>{
		var n=t.replace(/\s/g,'');
		API.info.setworkgroup({
			data:{name:n}
			,success:()=>$('[l10n="workgroup"]').next().html(n)
		})
	})
}