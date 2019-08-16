var DATALOST,RAID=[];
function init(){
	DATALOST=$.l10n.__('datalost');
	layout();
	bind();
	load();
}

function layout(){
	$('#diskspanel').layout({center:{pane:'#main'},north:{pane:'#chart',size:150},west:{pane:'#side',size:220,popable:true}});
}

function bind(){
	$('#erase').click(erase);
	$('#mkpart').click(mkpart);
	$('#rmpart').click(rmpart);
	$('#format').click(format);
	$('#mount').click(mount);
	$('#umount').click(umount);
	$('#eject').click(eject);
	$('#eject').click(eject);
	$('#raidspanel').on('click','a.craid',craid)
	$('#raidspanel').on('click','a.draid',draid)
	$('#raidspanel').on('click','span.active a',rmraid)
	$('#side,#chart').on('click','a',function(){
		$('#buttons button,#properties table').hide();$('#properties tr td:last').empty();
		$('#diskspanel .selected').removeClass('selected');
		var $this=$(this),p=$this.attr('path'),d=$('#chart').attr('path'),data=this.data;
		if($this.hasClass('disk')){
			draw(data);$('#disk tr td:last').html('');
			$this.addClass('selected');$('#chart [path="'+p+'"]').addClass('selected');
			if(!data.readonly)$('#erase,#format').show();
			if(data.fstype!=='linux_raid_member'&&!data.os&&(data.udev.ID_BUS==='usb'||data.udev.ID_BUS==='scsi'||data.udev.ID_CDROM==='1'))$('#eject').show();
			$('#model').html(data.model);
			$('#dpath').html(data.name);
			$('#bus').html(data.udev.ID_BUS||'');
			$('#dtype').html(data.parttiontype||'');
			$('#dcapacity').html(data._size);
			$('#disk').show();
		}else{
			if(p.indexOf(d)===-1&&p!==d)draw(data.disk);$('#partition tr td:last').empty()
			var $p=$('.partition[path="'+p+'"]');if($p.length===1)$p=$('[path="'+p+'"]');$p.addClass('selected');
			if(!data.readonly){
				switch(data.type){
					case '':
						if(data.fstype=='free')$('#mkpart').show();
						else $('#rmpart').show();
					break;
					case 'primary':case 'logical':case 'Basic data partition':
						$('#rmpart,#format').show();
					break;
					case 'extended':
						$('#rmpart').show();
					break;
				}
				if(data.fstype!==''){
					$('#rmpart,#format').show();
					if(data.mountpoint&&data.mountpoint.length>0)$('#umount').show();
					else $('#mount').show();
				}
			}
			$('#ppath').html(data.name||'');
			$('#fslabel').html(data.label||'');
			$('#ptype').html(data.type||'');
			$('#filesystem').html(data.fstype||'');
			$('#pcapacity').html(data._size||'');
			$('#used').html(data._used||'');
			$('#avail').html(data._avail||'');
			$('#mountpoint').html(data.mountpoint||'');
			if(data.mountpoint)$('#percent').html('<svg viewBox="0 0 32 32"><circle r="16" cx="16" cy="16" stroke-dasharray="'+data.percent+' 100"></circle><circle r="8" cx="16" cy="16" style="stroke:none;fill:#fff;"></circle></svg>');
			$('#partition').show();
		}
	})
}

function load(f){
	API.disk.get({success:parse});
}


function parse(j){
	var $sp=$('#side a.selected'),sp=$sp.attr('path'),_sp=$sp.hasClass('partition'),sd=sp;if(_sp)sd=sp.substr(0,8);
	$('#side').html('<ul></ul>');$('#raidspanel').html('<table><tbody><tr><td><div><div><span class="removed"><i></i><a></a></span><span class="removed"><i></i><a></a></span></div><label></label><a class="craid">'+$.l10n.__('craid')+'</a></div></td><td></td></tr></tbody></table>');
	var $s=$('#side ul'),unused=[];
	for(var _i in j.disks){
		i=j.disks[_i];i.path=i.name;i.length=i.size;i._size=bytesToSize(i.size*i.sectorsize.logical);i.primarys=0;
		var usd=i.fstype==='linux_raid_member'||j.raids[_i]?true:false;
		var li=document.createElement('li'),a=document.createElement('a');$(a).html(_i.replace('/dev/','')).attr('path',_i).addClass('disk').appendTo(li);a.data=i;i.dom=a;$s.append(li);
		if(i.fstype==='linux_raid_member'||!i.children||i.children.length===0)continue;
		var ps=i.children,$ul=$(document.createElement('ul'));$ul.appendTo(li);
		for(var p in ps){
			var _p=ps[p],et=null;if(_p.mountpoint||_p.fstype==='linux_raid_member')usd=true;
			_p.disk=i;if((!_p.type||_p.type=='')&&(!_p.fstype||_p.fstype==''))_p.fstype='free';_p.type=_p.type||'';_p.fstype=_p.fstype||'';_p.path=_p.name;_p.length=_p.size;_p.size=_p.size*i.sectorsize.logical;_p._size=bytesToSize(_p.size);if(_p.mountpoint){_p._used=bytesToSize(_p.used);_p._avail=bytesToSize(_p.avail);}_p._name=_p.fstype==='free'?($.l10n.__('freespace')+'('+_p._size+')'):_p.name.replace('/dev/','');
			if(_p.type==='primary')i.primarys++;if(_p.type==='extended'){et=_p;}
			if(et&&(_p.type==='logical'||_p.type==='freespace')){if(_p.start>=et.start&&_p.start<et.end){_p.parent=et;_p._start=_p.start-et.start;}}
			var li=document.createElement('li'),a=document.createElement('a');
			a.data=_p;_p.dom=a;$(a).html((_p._name)+(_p.label?(' ('+_p.label+')'):'')).attr('path',_p.name).addClass('partition').appendTo(li);$ul.append(li);
		}
		if(!usd)unused.push(_i);
	}
	sort();
	for(var _i in j.raids){
		var r=j.raids[_i];
		var s=['<tr><td><div><div>'];
		for(var d of r.devices){s.push('<span class="'+d.state+'"><i>'+d.path+'</i><a md="'+_i+'" path="'+d.path+'"></a></span>');}
		s.push('</div><label>'+d.path+'</label><a class="draid" path="'+_i+'">'+$.l10n.__('draid')+'</a></div></td><td><table class="param">');
		s.push('<tr><td>'+$.l10n.__('Raid Level')+'</td><td>'+r['Raid Level']+'</td></tr>');
		s.push('<tr><td>'+$.l10n.__('Raid Devices')+'</td><td>'+r['Raid Devices']+'</td></tr>');
		s.push('<tr><td>'+$.l10n.__('Failed Devices')+'</td><td>'+r['Failed Devices']+'</td></tr>');
		s.push('<tr><td>'+$.l10n.__('Array Size')+'</td><td>'+r['Array Size']+'</td></tr>');
		s.push('<tr><td>'+$.l10n.__('Update Time')+'</td><td>'+r['Update Time']+'</td></tr>');
		s.push('<tr><td>'+$.l10n.__('State')+'</td><td>'+r['State']+'</td></tr>');
		s.push('</table></td></tr>');
		$('#raidspanel>table>tbody').prepend(s.join(''));
	}
	var m={};for(let d of unused){m[d]=addraid;}
	$('#raidspanel').menu({contextmenu:true,dropdown:true,target:'span.removed a',menu:m});
	$s=[];if(sp)$s=$('#side a.'+(_sp?'partition':'disk')+'[path="'+sp+'"]');if(!$s[0])$s=$('#side a.disk[path="'+sd+'"]');if(!$s[0])$s=$('#side a:first');$s.click();
}

function draw(data){
	var $c=$('#chart');
	$c.empty().attr('path',data.name);
	var ps=data.children;
	var l=data.length
	if(!ps){
		$c.html('<a class="freespace partition" path="'+data.name+'"><div path="'+data.name+'">'+data.name+'<br>'+data._size+(data.udev.ID_BUS==='usb'?'<br>Removable':'')+(data.raiddevice?'<br>Device of Raid '+data.raiddevice:'')+'</div></a>');
		return;
	}
	for(var p in ps){
		var a=document.createElement('a');
		_p=ps[p]
		a.data=_p;
		var _c=_p.parent?$('#chart [path="'+_p.parent.name+'"]'):$c,_l=_p.parent?_p.parent.length:l;
		$(a).appendTo(_c).html(`<div path="${_p.name}">${_p._name}<br>${_p._size} ${_p.filesystem||''}${_p.raiddevice?'<br>Device of Raid'+p.raiddevice:''}${data.udev.ID_BUS==='usb'?'<br>Removable':''}</div>`).attr('path',_p.name).addClass(_p.type).addClass('partition').css({width:(_p.length/_l*100)+'%',left:(_p.start/_l*100)+'%'});
		if(_p.percent)$(a).prepend('<span style="width:'+_p.percent+'%;"></span>');
	}
}

function format(){
	WINDOW.confirm($.l10n.__(DATALOST),()=>{
		var p=$('#side a.selected')[0].data;
		API.disk.mkfs({data:{path:p.path},success:load});
	});
}

function erase(){
	WINDOW.confirm($.l10n.__(DATALOST),()=>{
		var p=$('#side a.selected')[0].data;
		API.disk.erase({data:{path:p.path},success:load});
	});
}

function mkpart(){
	var p=$('#side a.selected')[0].data;
	var t='primary';
	if(p.disk.type==='msdos'){
		if(p.disk.primarys+p.disk.extends>4)return;
		if(p.disk.primarys==3)t='extended';
		if(p.parent)t='logical';
	}
	WINDOW.prompt($.l10n.__('mkpart'),'',p.length+'s',(v)=>{
		API.disk.mkpart({data:{path:p.disk.path,type:'primary',start:parseInt(p.start),end:parseInt(p.start)+parseInt(v)-1},success:load});
	});
}

function rmpart(){
	WINDOW.confirm($.l10n.__(DATALOST),()=>{
		var p=$('#side a.selected')[0].data;
		API.disk.rmpart({data:{path:p.disk.name,number:p.number},success:load});
	});
}

function mount(){
	var p=$('#side a.selected')[0].data;
	API.disk.mount({data:{path:p.path},success:load});
}

function umount(){
	var p=$('#side a.selected')[0].data;
	API.disk.umount({data:{path:p.path},success:load});
}

function eject(){
	var p=$('#side a.selected')[0].data;
	API.disk.eject({data:{path:p.path},success:load});
}

function craid(e){
	var p=[];$('i',e.target.parentNode).each(function(){p.push(this.innerText)});
	if(p[0]===''||p[1]==='')return;
	API.disk.craid({data:{path1:p[0],path2:p[1]},success:load});
}

function draid(e){
	var p=$(e.target).attr('path');
	API.disk.draid({data:{path:p},success:load});
}

function addraid(t,m){
	var $t=$(t.target),p=$t.attr('md'),d=m.target.innerText;
	$t.prev().html(d);$t.parent().addClass('filled');
	if(p)API.disk.addraid({data:{path:p,dev:d},success:load});
}

function rmraid(e){
	var $e=$(e.target),p=$e.attr('md'),d=$e.attr('path');
	API.disk.rmraid({data:{path:p,dev:d},success:load});
}

function sort(){
	$('#side>ul>li').each(function(){
		var $a=$('a.partition');
		$a.sort(function(a,b){
			var sa=parseInt(a.data.start),sb=parseInt(b.data.start);
			return sa<sb?-1:1;
		});
		$a.each(function(){
			var p=this.parentNode,$p=$(p.parentNode);
			$p.append(p);
		});
	});
}