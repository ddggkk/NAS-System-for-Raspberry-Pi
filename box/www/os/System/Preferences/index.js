function init(){
	var f=document.getElementById('frame');
	var $b=$('#body'),$l=$('#list'),$t=$('#title');
	$('li').click(function(){
		$b.show();$l.hide();$t.html($(this).text())
		f.src=$('label',this).attr('l10n')+'.html';
	});
	$('.back').click(()=>{$b.hide();$l.show();$t.empty()});
}