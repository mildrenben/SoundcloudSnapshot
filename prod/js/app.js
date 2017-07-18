"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var _slicedToArray=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var u,c=e[Symbol.iterator]();!(r=(u=c.next()).done)&&(n.push(u.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&c.return&&c.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();window.onload=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return new Promise(function(r,o){var i=t.collection,u=t.next_href,c=[].concat(_toConsumableArray(n),_toConsumableArray(i));u?fetch(u).then(function(e){return e.json()}).then(function(t){return r(e(t,c))}):r(c)})}function t(t,n){var u=new Promise(function(e,r){fetch("https://api.soundcloud.com/users/"+n+"?client_id="+t).then(function(e){return e.json()}).catch(function(e){ga("send","event","Results","Failed"),console.log("err",e.message)}).then(function(t){s.classList.add("Form_Submit--loading"),e(t.id)})}),c=new Promise(function(n,r){u.then(function(e){return fetch("https://api.soundcloud.com/users/"+e+"/followings?client_id="+t+"&page_size=200&linked_partitioning=1")}).then(function(e){return e.json()}).then(function(t){return n(e(t))})}),a=new Promise(function(n,r){u.then(function(e){return fetch("https://api.soundcloud.com/users/"+e+"/favorites?client_id="+t+"&page_size=200&linked_partitioning=1")}).then(function(e){return e.json()}).then(function(t){return n(e(t))})});Promise.all([c,a]).then(function(e){var t=_slicedToArray(e,2),n=t[0],u=t[1],c=r(n),a=o(u),s="username, description, first_name, last_name, website_title, website, permalink\n"+f(c),d="username, title, created_at, description,  bpm, duration (ms), liked_count, kind, play_count, purchase_title, purchase_url, tag_list, permalink\n"+f(a),p=new File([s],"following.csv",{type:"text.csv"}),_=new File([d],"likes.csv",{type:"text.csv"});l.href=URL.createObjectURL(_),m.href=URL.createObjectURL(p),i(),ga("send","event","Results","Delivered")})}function n(e){return"string"==typeof e?e.replace(/[\n\r,]/g,". "):"number"==typeof e?e.toString():e}function r(e){return e.map(function(e){var t=e.description;return[e.username,t,e.first_name,e.last_name,e.website_title,e.website,e.permalink]})}function o(e){return e.map(function(e){var t=e.bpm,n=e.created_at,r=e.description,o=e.duration,i=e.favoritings_count,u=e.kind,c=e.playback_count,a=e.purchase_title,s=e.purchase_url,l=e.permalink,m=e.tag_list,f=e.title;return[e.user.username,f,n,r,t,o,i,u,c,a,s,m,l]})}function i(){s.classList.add("Form_Submit--hide"),setTimeout(function(){return s.classList.add("Form_Submit--none")},410),setTimeout(function(){l.classList.toggle("Download--visible"),m.classList.toggle("Download--visible")},450)}var u=document.querySelector("form"),c=document.querySelector(".Form_Input--clientId"),a=document.querySelector(".Form_Input--username"),s=(document.querySelector(".Form_Error--clientId"),document.querySelector(".Form_Error--username"),document.querySelector(".Form_Submit")),l=document.querySelector(".Download--likes"),m=document.querySelector(".Download--following");u.addEventListener("submit",function(e){e.preventDefault(),ga("send","event","Submit Button","Click"),t(c.value,a.value)});var f=function(e){return e.map(function(e){return e.map(function(e){return n(e)}).join(",")}).join("\n")}};