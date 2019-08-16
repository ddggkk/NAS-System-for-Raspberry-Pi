var FILTER={
	'Normal text file':['txt']
	,'Unix script file':['bash','sh']
	,'Batch file':['bat','cmd']
	,'Hyper Text Markup Language file':['html','htm']
	,'Javascript file':['js','json']
}
function init(){
	layout();
	bindEvent();
	_open();
}

function layout(){
	var menu={menu:{file:{child:{newfile:newfile,openfile:openfile,save:save,saveas:saveas,print:print}}}};
	$('#toolbar').menu(menu);
	window.EDITOR=$('#editor');
}

function bindEvent(){
	$('textarea').change(()=>window.CHANGED=true)
}

function newfile(){
	if(nosaved())return;
	setTitle(null)
	window.CHANGED=false;
	window.EDITOR.val('');
}

function drop(p){
	if(nosaved())return;
	var f=OS.path.getDrop(p);
	_open(f[0]);
}

function openfile(){
	if(nosaved())return;
	WINDOW.open({
		single:true
		,filter:FILTER
		,callback:(f)=>{
			_open(f);
		}
	})
}

function _open(f){
	if(!f)f=WINDOW.param;
	if(typeof(f)!=='string')return;
	window.CHANGED=false;
	setTitle(f);
	OS.path.read({
		path:f
		,success:(t)=>window.EDITOR.val(t)
	});
}

function save(){
	if(!window.CHANGED)return;
	if(!window.FILE){
		saveas();
		return;
	}
	_save();
}

function _save(){
	OS.path.save({
		path:window.FILE
		,data:EDITOR.val()
		,success:()=>{
			window.CHANGED=false;
			if(window._FILE!==window.FILE)OS.path.refreshWin(OS.path.dirname(window.FILE));
		}
	});
}

function saveas(){
	WINDOW.save({
		filename:(window.FILE&&OS.path.basename(window.FILE))||''
		,filter:FILTER
		,callback:(f)=>{
			setTitle(f);
			_save();
		}
	})
}

function print(){
	OS.print(window.EDITOR.val());
}

function setTitle(f){
	window._FILE=window.FILE;
	window.FILE=f;
	WINDOW.setCaption(WINDOW.app.caption+' - '+(f?OS.path.basename(f):''));
}

function nosaved(){
	if(window.CHANGED){
		WINDOW.alert($.l10n.__('notsaved'));
		return true;
	}
	return false;
}