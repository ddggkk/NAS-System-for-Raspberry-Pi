var DATA={};
$(init);

function init(){
	layout();
	bind();
	load();
}

function layout(){
	$('body').layout({center:{pane:'#center'},west:{pane:'#west',size:220,popable:true}});
	$('table').hide();
	$('#dhcp').click(function(){
		if($(this).is(':checked'))$('#ipaddr,#netmask,#gateway').attr('disabled','disabled');
		else $('#ipaddr,#netmask,#gateway').removeAttr('disabled');
	});
}

function bind(){
	$('#list').on('click','li',show)
	$('#setnetwork').click(setnetwork);
	$('#setdns').click(setdns);
	$('#wlan').change(wifi);
}

function load(){
	API.info.getnetwork({
		success:parse
	})
}

function parse(j){
	var $l=$('#list');
	var a=j.adapter,s=$('#list li.ui-selected').attr('name');
	DATA['dns']=j.dns;
	$l.empty();
	for(var i of a){
		DATA[i.name]=i;
		var li=document.createElement('li');
		li.innerHTML=i.name+' '+i.model;
		li.setAttribute('name',i.name);
		$l.prepend(li);
	}
	$l.append('<li name="dns">'+$.l10n.__('dns')+'</li>')
	var $s=$('li[name="'+s+'"]');if(!$s[0])$s=$('li:first',$l);
	$s.click();
}

function show(){
	$(this).siblings().removeClass('ui-selected');
	$(this).addClass('ui-selected');
	var n=$(this).attr('name');
	var j=DATA[n]
	$('table').hide();
	if(n==='dns'){
		$('#dns').show();
		$('#dns1').val(j[0]||'');
		$('#dns2').val(j[1]||'');
	}else{
		$('#adapter').show();
		$('#name').val(j.name);
		$('#ipaddr').val(j.ipaddr);
		$('#netmask').val(j.netmask);
		$('#gateway').val(j.gateway);
		$('#dhcp').prop('checked',j.dhcp);
		$('#WLAN,#WLANPSK').hide();
		$('#wlan').empty().data({orig:j});
		if(j.dhcp)$('#ipaddr,#netmask,#gateway').attr('disabled','disabled');
		else $('#ipaddr,#netmask,#gateway').removeAttr('disabled');
		if(n.indexOf('wlan')===0){
			for(var w of j.list){$('#wlan').append('<option value="'+w.essid+'" key="'+w.key+'" '+(j.essid===w.essid?'selected="selected"':'')+'>'+w.essid+'</option>');}
			if(j.essid==='')$('#dhcp').prop('checked','checked');
			$('#WLAN,#WLANPSK').show();
			$('#ipaddr,#netmask,#gateway,#dhcp').attr('disabled','disabled');
		}
	}
}

function setnetwork(){
	var data={
		name:$('#name').val()
		,dhcp:$('#dhcp').prop('checked')
		,ipaddr:$('#ipaddr').val()
		,netmask:$('#netmask').val()
		,gateway:$('#gateway').val()
	}
	if(data.name.indexOf('wlan')===0){
		var $s=$('#wlan option:selected')
		data=$.extend({
			essid:$('#wlan').val()
			,psk:$('#psk').val()
		},data)
	}
	API.info.setnetwork({
		data:data
	});
}

function setdns(){
	API.info.setnetwork({
		data:{
			dns1:$('#dns1').val()
			,dns2:$('#dns2').val()
		}
	});
}

function wifi(){
	var w=$('#wlan').val(),$s=$('#wlan option:selected'),k=$s.attr('key');
	var j=$('#wlan').data().orig;
	if(j.essid===w){
		$('#ipaddr').val(j.ipaddr);
		$('#netmask').val(j.netmask);
		$('#gateway').val(j.gateway);
		$('#dhcp').prop('checked',j.dhcp);
	}else{
		$('#psk,#ipaddr,#netmask,#gateway').val('');
		$('#dhcp').prop('checked','checked');
	}
	if(k==='on'){$('#WLANPSK').show()}
	else{$('#WLANPSK').hide()}
}