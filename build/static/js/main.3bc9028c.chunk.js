(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(t,e,n){t.exports=n(39)},38:function(t,e,n){},39:function(t,e,n){"use strict";n.r(e);var a=n(0),o=n.n(a),r=n(13),c=n.n(r),u=n(14),i=n(2),l=function(t){var e=t.note,n=t.toggleImportance,a=e.important?"make not important":"make important";return o.a.createElement("li",{className:"note"},e.content,o.a.createElement("button",{onClick:n},a))},m=function(t){var e=t.message;return null===e?null:o.a.createElement("div",{className:"error"},e)},f=n(3),s=n.n(f),d=function(){var t=s.a.get("/api/notes"),e={id:1e4,content:"This note is not saved to server",date:"2019-05-30T17:30:31.098Z",important:!0};return t.then(function(t){return t.data.concat(e)})},p=function(t){return s.a.post("/api/notes",t).then(function(t){return t.data})},b=function(t,e){return s.a.put("".concat("/api/notes","/").concat(t),e).then(function(t){return t.data})},v=function(t){var e=Object(a.useState)([]),n=Object(i.a)(e,2),r=n[0],c=n[1],f=Object(a.useState)(""),s=Object(i.a)(f,2),v=s[0],g=s[1],E=Object(a.useState)(!0),h=Object(i.a)(E,2),O=h[0],j=h[1],w=Object(a.useState)(null),S=Object(i.a)(w,2),k=S[0],y=S[1];Object(a.useEffect)(function(){console.log("effect"),d().then(function(t){c(t)})},[]);var I=O?r:r.filter(function(t){return!0===t.important});return o.a.createElement("div",null,o.a.createElement("h1",null,"Notes"),o.a.createElement(m,{message:k}),o.a.createElement("div",null,o.a.createElement("button",{onClick:function(){return j(!O)}},"show ",O?"important":"all")),o.a.createElement("ul",null,I.map(function(t){return o.a.createElement(l,{key:t.id,note:t,toggleImportance:function(){return function(t){var e=r.find(function(e){return e.id===t}),n=Object(u.a)({},e,{important:!e.important});b(t,n).then(function(e){c(r.map(function(n){return n.id!==t?n:e}))}).catch(function(n){y("the note '".concat(e.content,"' was already deleted from server")),setTimeout(function(){y(null)},5e3),c(r.filter(function(e){return e.id!==t}))}),console.log("importance of "+t+" needs to be toggled")}(t.id)}})})),o.a.createElement("form",{onSubmit:function(t){t.preventDefault();var e={id:r.length+1,content:v,date:(new Date).toISOString,important:Math.random>.5};p(e).then(function(t){c(r.concat(t)),g("")})}},o.a.createElement("input",{value:v,onChange:function(t){g(t.target.value)}}),o.a.createElement("button",{type:"submit"},"Save")))};n(38);c.a.render(o.a.createElement(v,null),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.3bc9028c.chunk.js.map