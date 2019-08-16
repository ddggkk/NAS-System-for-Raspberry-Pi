function init(){
	bind();
}

function bind(){
	$('[id]').on('click',function(){window[this.id]();});
	$(document).keydown((e)=>{
		switch(e.keyCode){
			case 36:home();break;
			case 27:back();break;
			case 13:enter();break;
			case 37:left();break;
			case 38:up();break;
			case 39:right();break;
			case 40:down();break;
		}
	});
	getstatus();
}
function getstatus(){
	API.kodi.status({success:(j)=>{
		if(j.running)$('#power').addClass('on');
		else $('#power').removeClass('on');
	}});
}
function power(){
	API.kodi.power({nowaiting:true});
	if($('#power').hasClass('on'))$('#power').removeClass('on');
	else $('#power').addClass('on');
}
function up(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Input.Up"}]'})
}
function down(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Input.Down"}]'})
}
function left(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Input.Left"}]'})
}
function right(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Input.Right"}]'})
}
function enter(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Input.Select"}]'})
}
function back(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Input.Back"}]'})
}
function home(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Input.Home"}]'})
}
function info(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Input.Info"}]'})
}
function previous(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Player.GoTo","params":{"playerid":1,"to":"previous"}}]'})
}
function pause(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Player.PlayPause","params":{"playerid":1}}]'})
}
function next(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Player.GoTo","params":{"playerid":1,"to":"next"}}]'})
}
function random(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc": "2.0","method":"Player.Setshuffle","params":{"playerid":1,"shuffle":"toggle"}}]'})
}
function rewind(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Player.SetSpeed","params":{"playerid":1,"speed":"decrement" }}]'})
}
function stop(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Player.Stop","params":[1]}]'})
}
function forward(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Player.SetSpeed","params":{"playerid":1,"speed":"increment" }}]'})
}
function loop(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Player.Setrepeat","params":{"playerid":1,"repeat":"cycle"}}]'})
}
function mute(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Application.SetMute","params":{"mute":"toggle"}}]'})
}
function vp(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Application.SetVolume","params":{"volume":"decrement" }}]'})
}
function vn(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Application.SetVolume","params":{"volume":"increment" }}]'})
}
function vtp(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Player.SetAudioStream","params":{"playerid":1,"stream":"previous"}]'})
}
function vtn(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Player.SetAudioStream","params":{"playerid":1,"stream":"next"}]'})
}
function st(){
	$('#st').toggleClass('on');
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc":"2.0","method":"Player.SetSubtitle","params":{"subtitle": "'+($('#st').hasClass('on')?'off':'on')+'"}}]'})
}
function stp(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc": "2.0","method":"Player.SetSubtitle","params":{"subtitle": "previous"}}]'})
}
function stn(){
	FETCH({url:'jsonrpc?awx',method:'post',data:'[{"jsonrpc": "2.0","method":"Player.SetSubtitle","params":{"subtitle": "next"}}]'})
}