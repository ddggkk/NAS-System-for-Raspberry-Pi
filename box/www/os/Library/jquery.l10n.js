(function($){
	$.extend({
		l10n:{
			opts:{
				dir:"Languages"
				,lang:"auto"
			}
			,messages:{}
			,__:function(words){
				if(this.opts.lang&&this.messages[this.opts.lang]&&this.messages[this.opts.lang][words]){
					words=this.messages[this.opts.lang][words];
				}else{
					if(top!==window)words=top.$.l10n.__(words);
				}
				return words;
			}
			,load:function(L,l){
				if(!L)L=this.opts.lang;
				var url=this.opts.dir+"/"+L+".json";
				if(l&&$.l10n.messages[L]){
					$.l10n.messages[l]=$.l10n.messages[L];
					return;
				}
				$.ajax({
					url:url
					,dataType:'json'
					,cache:true
					,async:false
					,success:function(json){
						if(!$.l10n.messages[L])$.l10n.messages[L]=json;
						if(l)$.l10n.messages[l]=$.l10n.messages[L];
					}
					,error:function(h){
						if(L!='en'){
							$.l10n.load('en',L);
						}
					}
				});
			}
			,init:function(opts){
				$.extend(this.opts,opts);
				if(this.opts.lang=="auto")this.opts.lang=window.navigator.systemLanguage||window.navigator.language;
				this.opts.lang=this.opts.lang.toLowerCase();
				if(this.opts.lang!="")this.load();
			}
		}
	});

	$.fn.extend({
		l10n:function(opts){
			$.l10n.init(opts);
			this.each(function(){
				var l10n,words,tag;
				l10n=this.getAttribute("l10n");
				if(l10n==='')l10n=this.innerHTML;
				tag=this.tagName.toLowerCase();
				words=$.l10n.__(l10n);
				switch(tag){
					case "input":
						if(this.getAttribute("placeholder")!==null)$(this).attr("placeholder",words);
						if(this.getAttribute("type")==="submit")$(this).val(words);
					break;
					case "img":
						this.alt=words;
					break;
					default:
						var title=this.getAttribute("title");
						if(title){
							if(title!=='')$(this).attr("title",$.l10n.__(title));
							else $(this).attr("title",words);
							if(this.innerHTML===this.innerText)this.innerHTML=words;
						}else{
							this.innerHTML=words;
						}
					break;
				}
			});
		}
	})
})(jQuery);


function setLang(l){ 
	if(!l||typeof(l)==='function')l=window.top.LANGUAGE||localStorage.language||window.navigator.systemLanguage||window.navigator.language;
	l=l.toLowerCase();
	if(l.indexOf('-')>-1){
		var L=l.split('-');
		if(L[0]==='zh'){
			if(l!=='zh-cn')l='zh-tw';
		}else{
			l=L[0];
		}
	}
	window.top.LANGUAGE=l;
	$('[l10n]').l10n({lang:l});
}
$(setLang);
