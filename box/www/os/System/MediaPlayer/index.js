function init(){
	openfile();
}

function openfile(f){
	if(!f)f=WINDOW.param;
	if(typeof(f)==='string'){var u=DOMAIN+f,n=OS.path.basename(f),p=OS.path.getProp(f),m=p.mime;if(p.thumbnail)u=p.thumbnail.replace(/\.jpg$/,'.mp4')}
	else{var u=f.url,n=f.title,m=f.type;}
	WINDOW.setCaption(WINDOW.app.caption+' - '+n);
	var h='<'+m+' autoplay="true" id="player" controls="true" src="'+u+'" style="width:100%;height:100%"/>'
	$('body').css({width:'100%',height:'100%'}).html(h);
}