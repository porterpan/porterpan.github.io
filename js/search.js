// build time:Tue Feb 14 2023 14:05:20 GMT+0800 (GMT+08:00)
var searchFunc=function(e,t,r){"use strict";$.ajax({url:e,dataType:"xml",success:function(e){var a=$("entry",e).map(function(){return{title:$("title",this).text(),content:$("content",this).text(),url:$("url",this).text()}}).get();var n=document.getElementById(t);var i=document.getElementById(r);n.addEventListener("input",function(){var e='<ul class="search-result-list">';var t=this.value.trim().toLowerCase().split(/[\s\-]+/);i.innerHTML="";if(this.value.trim().length<=0){return}a.forEach(function(r){var a=true;var n=[];var i=r.title.trim().toLowerCase();var l=r.content.trim().replace(/<[^>]+>/g,"").toLowerCase();var c=r.url;var s=-1;var o=-1;var u=-1;if(i!=""&&l!=""){t.forEach(function(e,t){s=i.indexOf(e);o=l.indexOf(e);if(s<0&&o<0){a=false}else{if(o<0){o=0}if(t==0){u=o}}})}if(a){var f="<li><a href='"+c+"' class='search-result-title' target='_blank'>"+"> "+i+"</a>";console.log(f);f=f.replace("//",top.location.href+"/");f=f.replace("archives","/");f=f.replace("%2F%2F",top.location.href+"%2F");f=f.replace("archives","/");e+=f;console.log(e);var v=r.content.trim().replace(/<[^>]+>/g,"");if(u>=0){var h=u-6;var p=u+6;if(h<0){h=0}if(h==0){p=10}if(p>v.length){p=v.length}var g=v.substr(h,p);t.forEach(function(e){var t=new RegExp(e,"gi");g=g.replace(t,'<em class="search-keyword">'+e+"</em>")});e+='<p class="search-result">'+g+"...</p>"}}});i.innerHTML=e})}})};
//rebuild by neat 