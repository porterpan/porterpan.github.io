// build time:Fri Feb 10 2023 02:15:29 GMT+0800 (GMT+08:00)
define([],function(){var e=false;var t,n,i;var d,s,o,a,l;var r=function(){s=document.body.scrollHeight/document.body.scrollWidth;o=document.body.scrollWidth;a=0};var c=function(){if(t){document.getElementById("js-mobile-tagcloud").innerHTML=t.innerHTML}if(n){document.getElementById("js-mobile-aboutme").innerHTML=n.innerHTML}if(i){document.getElementById("js-mobile-friends").innerHTML=i.innerHTML}};var m=function(){var e=document.createElement("div");e.id="viewer";e.className="hide";t=document.getElementById("js-tagcloud");n=document.getElementById("js-aboutme");i=document.getElementById("js-friends");function d(e){return $("link.menu-list").attr(e)}var s=t?'<span class="viewer-title">'+d("tags")+'</span><div class="viewer-div tagcloud" id="js-mobile-tagcloud"></div>':"";var o=i?'<span class="viewer-title">'+d("friends")+'</span><div class="viewer-div friends" id="js-mobile-friends"></div>':"";var a=n?'<span class="viewer-title">'+d("about")+'</span><div class="viewer-div aboutme" id="js-mobile-aboutme"></div>':"";e.innerHTML='<div id="viewer-box">        <div class="viewer-box-l">            <div class="viewer-box-wrap">'+a+o+s+'</div>        </div>        <div class="viewer-box-r"></div>        </div>';document.getElementsByTagName("body")[0].appendChild(e);var r=document.getElementById("viewer-box");l=r;r.style.height=document.body.scrollHeight+"px"};var v=function(t,n){document.getElementById("viewer").className="";setTimeout(function(){l.className="anm-swipe"},0);e=true;document.ontouchstart=function(e){if(e.target.tagName!="A"){return false}}};var u=function(){document.getElementById("viewer-box").className="";e=false;document.ontouchstart=function(){return true}};var f=function(){var t=t;document.getElementById("viewer-box").addEventListener("webkitTransitionEnd",function(){if(e==false){document.getElementById("viewer").className="hide";e=true}else{}},false);var n=false;d.addEventListener("touchend",function(){v()},false);$(".viewer-box-l").click(function(){u();n=false});$(".viewer-div").click(function(){u();n=false});var i=$("#mobile-nav .overlay");var s=$(".js-mobile-header");window.onscroll=function(){var e=document.documentElement.scrollTop+document.body.scrollTop;if(e>=69){i.addClass("fixed")}else{i.removeClass("fixed")}if(e>=160){s.removeClass("hide").addClass("fixed")}else{s.addClass("hide").removeClass("fixed")}u()};s[0].addEventListener("touchstart",function(){$("html, body").animate({scrollTop:0},"slow")},false)};return{init:function(){d=document.getElementsByClassName("slider-trigger")[0];r();m();c();f();resetTags()}}});
//rebuild by neat 