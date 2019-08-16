var $C,SRC='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACwAAAAAAQABAAACAkQBADs=';

function init(){
	bind()
	load();
}

function bind(){
	$('.start').click(start);
	$('.stop').click(stop);
	$('.screen').click(screen);
	$('.pic').click(snapshot);
	$('.record').click(record);
	$('.open').click(folder);
	$('.settings').click(settings);
	$('body').on('click','.zoomout',zoomout);
	$('body').on('click','.zoomin',zoomin);
	$('#main').on('click','>div',choose);
	$(window).resize(()=>{
		var $m=$('#main'),l=$('#main>div:visible').length,o=calc(l);
		$('#main>div:visible').css({width:o.w,height:o.h});
	})
}

function load(){
	API.camera.get({success:parse});
}

function parse(j){
	var $m=$('#main');$m.empty();
	for(var i of j){
		var h='<div dev="'+i.dev+'" class="'+(i.running?'running ':'stopped ')+(i.recording?'recording':'')+'" '+(i.running?'pid="'+i.running+'"':'')+(i.recording?'rid="'+i.recording+'"':'')+'><img src="'+(i.running?DOMAIN+'camera/'+i.dev+'/?action=stream&_='+(new Date().getTime()):SRC)+'"></div>'
		$m.append(h)
	}
	if(j.length==0)$('.toolbar>div').hide();
	if(j.length>1)$('#main>div').prepend('<div><a class="zoomin"></a><a class="zoomout"></a></div>');
	$('#main>div:first').click();
	$(window).resize();
}

function choose(){
	$C=$(this);
	$('#main .selected').removeClass('selected');
	$C.addClass('selected');
	if($C.hasClass('running')){$('.stop,.screen,.pic,.record').show();$('.start').hide();}
	else{$('.stop,.screen,.pic,.record').hide();$('.start').show();}
	if($C.hasClass('recording')){$('.record').addClass('ing');}
	else{$('.record').removeClass('ing');}
}

function start(){
	var d=$C.attr('dev')-0,$i=$('img',$C);
	API.camera.start({data:{dev:d},success:(j)=>{
		$i.attr('src',DOMAIN+'camera/'+d+'/?action=stream&_='+(new Date().getTime()));
		$C.removeClass('stopped').addClass('running').attr('pid',j.pid);
		$C.click();
	}});
}

function stop(){
	var p=$C.attr('pid'),r=$C.attr('rid')||'',$i=$('img',$C);
	API.camera.stop({data:{pid:p,rid:r},success:()=>{
		$i.attr('src',SRC);
		$C.removeClass('running').addClass('stopped').removeAttr('pid');
		$C.click();
	}});
}

function screen(){
	var d=$C.attr('dev')-0;
	API.camera.screen({nowaiting:true,data:{dev:d}});
}

function snapshot(){
	var d=$C.attr('dev');
	API.camera.snapshot({data:{dev:d}});
}

function record(){
	if($(this).hasClass('ing'))stoprecord();
	else startrecord();
}

function startrecord(){
	var d=$C.attr('dev');
	API.camera.record({data:{dev:d},success:function(j){
		$C.addClass('recording').attr('rid',j.pid);
		$C.click();
	}});
}

function stoprecord(){
	var r=$C.attr('rid');
	API.camera.stoprecord({data:{pid:r},success:function(j){
		$C.removeClass('recording').removeAttr('rid');
		$C.click();
	}});
}

function settings(){
	var d=$C.attr('dev');
	WINDOW.dialog({url:'settings.html?d='+d,caption:'Camera'+d,width:500,height:250});
}

function folder(){
	var d=$C.attr('dev');
	OS.FileManager.load({path:OS.storage+'Camera/'+d+'/'});
}

function zoomin(){
	$('#main>div').hide();
	$('.zoomin',$C).hide();
	$('.zoomout',$C).show();
	$('#main').css({'justify-content':'center'});
	$C.show();
	$(window).resize();
}

function zoomout(){
	$('#main>div').show();
	$('.zoomin',$C).show();
	$('.zoomout',$C).hide();
	$('#main').css({'justify-content':'start'});
	$(window).resize();
}

function calc(n){
	var $m=$('#main'),W=$m.width(),H=$m.height(),p=4/3,s=W*H/n,y=Math.sqrt(s/p),x=y*p,_x=Math.ceil(W/x),_y=Math.ceil(H/y),w=W/_x,h=H/_y;
	if(n==1){$('#main').css({'justify-content':'center'});if(W/H>p){w=H*p;h=H;}else{h=W/p;w=W;}}
	if(n>1){$('#main').css({'justify-content':'start'});if(w/h>p)w=h*p;else h=w/p;}
	return {w:w,h:h}
}