$(init);

function init(){
	bind();
	load();
}

function bind(){
	$('area').each(function(){
		var alt=$(this).attr('alt');
		var title=alt.split('/');
		title=title[title.length-1].replace(/_/g,' ');
		$(this).attr('href','javascript:$("#zone").val("'+alt+'")').attr('title',title);
	});
	$('#ok').click(set);
}

function load(){
	API.info.gettime({
		success:parse
	})
}

function set(){
	API.info.settime({
		data: {
			zone:$('#zone').val()
		}
		,success:parse
	});
}

function parse(j){
	$('#time').html(dateTimeToString(new Date(j.time),'YYYY/MM/DD hh:mm'));
	$('#zone').val(j.zone);
}