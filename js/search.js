// build time:Fri Feb 10 2023 02:11:51 GMT+0800 (GMT+08:00)
var searchFunc=function(e,t,r){"use strict";$.ajax({url:e,dataType:"xml",success:function(e){var a=$("entry",e).map(function(){return{title:$("title",this).text(),content:$("content",this).text(),url:$("url",this).text()}}).get();var n=document.getElementById(t);var i=document.getElementById(r);n.addEventListener("input",function(){var e='<ul class="search-result-list">';var t=this.value.trim().toLowerCase().split(/[\s\-]+/);i.innerHTML="";if(this.value.trim().length<=0){return}a.forEach(function(r){var a=true;var n=[];var i=r.title.trim().toLowerCase();var c=r.content.trim().replace(/<[^>]+>/g,"").toLowerCase();var l=r.url;var s=-1;var o=-1;var u=-1;if(i!=""&&c!=""){t.forEach(function(e,t){s=i.indexOf(e);o=c.indexOf(e);if(s<0&&o<0){a=false}else{if(o<0){o=0}if(t==0){u=o}}})}if(a){var f="<li><a href='"+l+"' class='search-result-title' target='_blank'>"+"> "+i+"</a>";f=f.replace("//",top.location.href+"/");f=f.replace("%2F%2F",top.location.href+"%2F");f=f.replace("/archives/","/");e+=f;var v=r.content.trim().replace(/<[^>]+>/g,"");if(u>=0){var h=u-6;var p=u+6;if(h<0){h=0}if(h==0){p=10}if(p>v.length){p=v.length}var m=v.substr(h,p);t.forEach(function(e){var t=new RegExp(e,"gi");m=m.replace(t,'<em class="search-keyword">'+e+"</em>")});e+='<p class="search-result">'+m+"...</p>"}}});i.innerHTML=e})}})};
//rebuild by neat 