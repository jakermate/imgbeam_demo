(this.webpackJsonpadmin_client=this.webpackJsonpadmin_client||[]).push([[0],{13:function(e,t,n){},15:function(e,t,n){},17:function(e,t,n){"use strict";n.r(t);var c=n(0),s=n(1),r=n.n(s),a=n(6),l=n.n(a),i=(n(13),n(2)),o=n.n(i),u=n(4),d=n(3);n(15);function j(e){return Object(c.jsxs)("div",{className:"fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center",children:[Object(c.jsx)("div",{onClick:function(t){return e.cancel},className:"overlay z-10 fixed top-0 left-0 w-full h-full bg-black"}),Object(c.jsxs)("div",{className:"bg-gray-100 px-4 py-6 relative z-20 flex flex-col",style:{width:"300px"},children:[Object(c.jsx)("div",{className:"text-2xl font-bold",children:"Delete user?"}),Object(c.jsx)("button",{onClick:function(t){return e.confirmDelete()},className:"bg-red-600 px-4 py-2 mt-6",children:"DELETE"}),Object(c.jsx)("button",{onClick:function(t){return e.cancel()},className:"bg-gray-600 px-4 py-2 mt-6",children:"CANCEL"})]})]})}var x=n(7),b=n.n(x);function p(e){function t(){return(t=Object(u.a)(o.a.mark((function t(n,c){var s,r,a;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(window.confirm("Delete image")){t.next=3;break}return t.abrupt("return");case 3:return s="/admin/user/".concat(e.user.user_id,"/image/delete/").concat(n,"/").concat(c),console.log(s),t.prev=5,t.next=8,fetch(s,{credentials:"include",method:"delete"});case 8:return r=t.sent,t.next=11,r.json();case 11:a=t.sent,console.log(a),a.success,t.next=19;break;case 16:t.prev=16,t.t0=t.catch(5),console.log(t.t0);case 19:case"end":return t.stop()}}),t,null,[[5,16]])})))).apply(this,arguments)}function n(){return(n=Object(u.a)(o.a.mark((function t(n){var c,s;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(window.confirm("Delete gallery?")){t.next=3;break}return t.abrupt("return");case 3:return c="/admin/user/".concat(e.user.user_id,"/gallery/delete/").concat(n),t.prev=4,t.next=7,fetch(c,{credentials:"include",method:"delete"});case 7:s=t.sent,console.log(s.status),200==s.status&&(document.getElementById("user-gallery-".concat(n)).innerHTML="".concat(n," DELETED")),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(4),console.log(t.t0);case 15:case"end":return t.stop()}}),t,null,[[4,12]])})))).apply(this,arguments)}return e.user?Object(c.jsxs)("div",{className:"px-4 py-6 bg-gray-300 text-left",children:[Object(c.jsxs)("div",{children:[Object(c.jsxs)("h2",{className:"text-xl font-bold",children:["User: ",Object(c.jsx)("span",{className:"text-green-500",children:e.user.username})]}),Object(c.jsxs)("h4",{children:["User ID: ",Object(c.jsx)("em",{children:e.user.user_id})]}),Object(c.jsxs)("p",{children:["User Since: ",b()(e.user.date_created).format("MMM d yyyy")]})]}),Object(c.jsxs)("div",{id:"user-control",className:"mt-6 px-12 py-6 test-white bg-gray-500",children:[Object(c.jsx)("button",{onClick:function(t){return e.deleteRequest()},className:"px-4 py-1 bg-purple-500 text-white",children:"Delete User"}),Object(c.jsx)("button",{onClick:function(t){return e.banEmail()},className:"ml-12",children:"Ban User"})]}),Object(c.jsx)("div",{id:"user-galleries",children:e.user.galleries.map((function(e,s){return Object(c.jsxs)("div",{id:"user-gallery-".concat(e.gallery_id),className:"mx-4 my-2 bg-gray-700 p-4 text-white",children:[Object(c.jsxs)("h1",{children:["title: ",e.title]}),Object(c.jsxs)("h3",{children:["id: ",e.gallery_id]}),Object(c.jsxs)("p",{children:["items: ",e.images.length]}),Object(c.jsx)("div",{className:"gallery-image-container flex flex-row flex-wrap my-4",children:e.images.map((function(e){return Object(c.jsxs)("div",{className:"mx-1 bg-gray-800 shadow-md p-3",children:[Object(c.jsxs)("div",{children:[Object(c.jsxs)("div",{className:"mt-2",children:["filename: ",e.file_name]}),Object(c.jsxs)("div",{className:"mt-2",children:["originalname: ",e.original_name]}),Object(c.jsx)("div",{className:"desc font-bold mt-3 mb-4 text-xs",children:e.description})]}),Object(c.jsxs)("a",{href:"".concat(e.path_lq),className:"py-1",target:"_blank",children:[Object(c.jsx)("span",{className:"py-1 text-sm font-bold",children:"LQ Version"}),"image"===e.media_type?Object(c.jsx)("img",{width:"200",src:"".concat(e.path_lq),alt:""}):Object(c.jsx)("video",{width:"200",autoplay:!0,muted:!0,src:"".concat(e.path_lq)})]}),Object(c.jsxs)("a",{href:"".concat(e.path),className:"py-1",target:"_blank",children:[Object(c.jsx)("span",{className:"py-1 text-sm font-bold",children:"Full Quality Version"}),"image"===e.media_type?Object(c.jsx)("img",{width:"200",src:"".concat(e.path),alt:""}):Object(c.jsx)("video",{width:"200",autoplay:!0,muted:!0,src:"".concat(e.path)})]}),Object(c.jsx)("div",{className:"mt-1",children:Object(c.jsx)("button",{onClick:function(n){return function(e,n){return t.apply(this,arguments)}(e.image_id,e.gallery_id)},className:"px-3 py-1 bg-red-600",children:"delete"})})]})}))}),Object(c.jsxs)("div",{className:"gallery-controls",children:[Object(c.jsx)("hr",{className:"my-6"}),Object(c.jsx)("button",{onClick:function(t){return function(e){return n.apply(this,arguments)}(e.gallery_id)},className:"bg-red-600 px-3 py-1",children:"Delete"})]})]},"user-gallery-".concat(e.gallery_id))}))})]}):Object(c.jsx)("div",{children:"No User"})}function m(e){Object(s.useEffect)((function(){l()}),[]);var t=Object(s.useState)([]),n=Object(d.a)(t,2),r=n[0],a=n[1];function l(){return i.apply(this,arguments)}function i(){return(i=Object(u.a)(o.a.mark((function e(){var t,n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"/admin/reports/all",e.prev=1,e.next=4,fetch("/admin/reports/all",{credentials:"include"});case 4:if(t=e.sent,console.log(t.status),200!==t.status){e.next=12;break}return e.next=9,t.json();case 9:n=e.sent,console.log(n),a(n);case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),console.log(e.t0);case 17:case"end":return e.stop()}}),e,null,[[1,14]])})))).apply(this,arguments)}function j(){return(j=Object(u.a)(o.a.mark((function e(t){var n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="/admin/reports/clear/".concat(t),e.prev=1,e.next=4,fetch(n,{credentials:"include",method:"DELETE"});case 4:200==e.sent.status&&(console.log("report cleared"),l()),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),console.log(e.t0);case 11:case"end":return e.stop()}}),e,null,[[1,8]])})))).apply(this,arguments)}return Object(c.jsx)("div",{children:r.map((function(e){return Object(c.jsxs)("div",{children:[e.reason,Object(c.jsx)("button",{onClick:function(t){return function(e){return j.apply(this,arguments)}(e.report_id)},children:"Clear"})]})}))})}function h(){return Object(c.jsx)("div",{className:"",style:{width:"350px"},children:Object(c.jsxs)("form",{className:"flex max-w-xl flex-col",action:"/login",method:"POST",children:[Object(c.jsx)("input",{className:"my-1 px-3 py-1 text-sm",type:"text",name:"username",id:"username"}),Object(c.jsx)("input",{className:"my-1 px-3 py-1 text-sm",type:"password",name:"password",id:"password"}),Object(c.jsx)("input",{className:"my-1 bg-purple-500",type:"submit",value:"Login"})]})})}function f(e){return Object(c.jsx)("div",{className:"",style:{width:"300px"},children:Object(c.jsxs)("div",{id:"sidebar-content",className:"fixed ",children:[Object(c.jsx)("div",{className:"title text-xl font-bold mb-4 p-3",children:"Admin Control"}),Object(c.jsxs)("ul",{className:"text-left font-bold w-full",children:[Object(c.jsx)("li",{className:"p-2 font-bold  hover:opacity-75 cursor-pointer w-full ".concat("search"===e.mode&&"opacity-50"),children:Object(c.jsx)("button",{onClick:function(t){return e.toggleContent("search")},children:"Search"})}),Object(c.jsx)("li",{className:"p-2 font-bold  hover:opacity-75 cursor-pointer w-full ".concat("reports"===e.mode&&"opacity-50"),children:Object(c.jsx)("button",{onClick:function(t){return e.toggleContent("reports")},children:"Reports"})}),Object(c.jsx)("li",{className:"p-2 font-bold  hover:opacity-75 cursor-pointer w-full ".concat("messages"===e.mode&&"opacity-50"),children:Object(c.jsx)("button",{onClick:function(t){return e.toggleContent("messages")},children:"Messages"})})]})]})})}var O=function(){var e=Object(s.useState)(null),t=Object(d.a)(e,2),n=(t[0],t[1],Object(s.useState)("")),r=Object(d.a)(n,2),a=r[0],l=r[1],i=Object(s.useState)(""),x=Object(d.a)(i,2),b=x[0],O=x[1],g=Object(s.useState)(""),v=Object(d.a)(g,2),y=v[0],w=v[1],N=Object(s.useState)("user"),k=Object(d.a)(N,2),C=k[0],_=k[1],S=Object(s.useState)(!1),D=Object(d.a)(S,2),E=D[0],F=D[1],L=Object(s.useState)(""),U=Object(d.a)(L,2),A=U[0],T=U[1],M=Object(s.useState)([]),q=Object(d.a)(M,2),I=q[0],B=q[1];function z(){return(z=Object(u.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"/admin/authenticated",e.prev=1,e.next=4,fetch("/admin/authenticated",{credentials:"include",mode:"cors"});case 4:if(t=e.sent,console.log(t.status),200!=t.status){e.next=9;break}return F(!0),e.abrupt("return");case 9:F(!1),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(1),console.log(e.t0);case 15:case"end":return e.stop()}}),e,null,[[1,12]])})))).apply(this,arguments)}function P(){return(P=Object(u.a)(o.a.mark((function e(t){var n,c,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),n="/admin/gallery/title/".concat(A),e.prev=2,e.next=5,fetch(n,{credentials:"include",mode:"cors"});case 5:return c=e.sent,e.next=8,c.json();case 8:s=e.sent,console.log(s),s.success&&B(s.galleries),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(2),console.log(e.t0);case 16:case"end":return e.stop()}}),e,null,[[2,13]])})))).apply(this,arguments)}function R(){return(R=Object(u.a)(o.a.mark((function e(t){var n,c,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),n="/admin/user/username/".concat(a),e.prev=2,e.next=5,fetch(n,{credentials:"include",mode:"cors"});case 5:return c=e.sent,e.next=8,c.json();case 8:s=e.sent,console.log(s),s.success&&se(s.user),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(2),console.log(e.t0);case 16:case"end":return e.stop()}}),e,null,[[2,13]])})))).apply(this,arguments)}function J(e){return Q.apply(this,arguments)}function Q(){return(Q=Object(u.a)(o.a.mark((function e(t){var n,c,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),n="/admin/user/id/".concat(b),e.prev=2,e.next=5,fetch(n,{credentials:"include",mode:"cors"});case 5:return c=e.sent,e.next=8,c.json();case 8:s=e.sent,console.log(s),se(s),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(2),console.log(e.t0);case 16:case"end":return e.stop()}}),e,null,[[2,13]])})))).apply(this,arguments)}function V(){return(V=Object(u.a)(o.a.mark((function e(t){var n,c,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),n="/admin/user/email/".concat(y),e.prev=2,e.next=5,fetch(n,{credentials:"include",mode:"cors"});case 5:return c=e.sent,e.next=8,c.json();case 8:s=e.sent,console.log(s),s.success&&se(s.user),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(2),console.log(e.t0);case 16:case"end":return e.stop()}}),e,null,[[2,13]])})))).apply(this,arguments)}Object(s.useEffect)((function(){console.log(I)}),[I]),Object(s.useEffect)((function(){!function(){z.apply(this,arguments)}(),window.onbeforeunload=function(){return"Are you sure you wish to go back?"}}),[]);var G=Object(s.useState)("search"),H=Object(d.a)(G,2),K=H[0],W=H[1],X=Object(s.useState)(!1),Y=Object(d.a)(X,2),Z=Y[0],$=Y[1];function ee(){return(ee=Object(u.a)(o.a.mark((function e(){var t,n,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return $(!1),t="/admin/user/".concat(ce.user_id,"/delete"),e.prev=2,e.next=5,fetch(t,{credentials:"include",mode:"cors",method:"delete"});case 5:return n=e.sent,e.next=8,n.json();case 8:c=e.sent,console.log(c),c.success&&(se(null),console.log("user deleted")),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(2),console.log(e.t0);case 16:case"end":return e.stop()}}),e,null,[[2,13]])})))).apply(this,arguments)}var te=Object(s.useState)(null),ne=Object(d.a)(te,2),ce=ne[0],se=ne[1];return Object(c.jsxs)("div",{className:"App flex flex-row min-h-screen",children:[Object(c.jsx)(f,{toggleContent:function(e){W(e)},mode:K}),Object(c.jsxs)("div",{id:"main-content",className:"flex-1",style:{background:"#eee"},children:[Object(c.jsxs)("header",{className:"App-header text-left py-4 px-3",children:[Object(c.jsx)("div",{id:"logged-in-container",className:"text-2xl font-bold p-6 text-white",children:E?Object(c.jsx)("div",{className:"text-green-200",children:"Authenticated"}):Object(c.jsx)("div",{className:"text-yellow-300",children:"Not Authorized"})}),Object(c.jsx)("div",{className:"mx-auto container",children:!E&&Object(c.jsx)(h,{})})]}),"search"===K&&Object(c.jsxs)("div",{className:"text-left bg-gray px-12 py-6",children:[Object(c.jsx)("div",{children:Object(c.jsxs)("ul",{className:"flex flex-row",children:[Object(c.jsx)("li",{className:"mr-3",children:Object(c.jsx)("button",{className:"text-lg font-bold",onClick:function(e){return _("user")},children:"Find User"})}),Object(c.jsx)("li",{className:"mr-3",children:Object(c.jsx)("button",{className:"text-lg font-bold",onClick:function(e){return _("gallery")},children:"Find Gallery"})})]})}),"user"===C&&Object(c.jsxs)("div",{children:[Object(c.jsxs)("form",{onSubmit:function(e){return function(e){return R.apply(this,arguments)}(e)},className:"flex flex-col max-w-xl",children:[Object(c.jsx)("label",{htmlFor:"username",children:"username"}),Object(c.jsx)("input",{className:"bg-black text-white px-2 py-2",value:a,onChange:function(e){return l(e.target.value)},type:"text",name:"username",id:"username"}),Object(c.jsx)("input",{type:"submit",value:"Submit"})]}),Object(c.jsxs)("form",{onSubmit:function(e){return J(e)},className:"flex flex-col max-w-xl",children:[Object(c.jsx)("label",{htmlFor:"user_id",children:"user_id"}),Object(c.jsx)("input",{className:"bg-black text-white px-2 py-2",value:b,onChange:function(e){return O(e.target.value)},type:"text",name:"user_id",id:"user_id"}),Object(c.jsx)("input",{type:"submit",value:"Submit"})]}),Object(c.jsxs)("form",{onSubmit:function(e){return function(e){return V.apply(this,arguments)}(e)},className:"flex flex-col max-w-xl",children:[Object(c.jsx)("label",{htmlFor:"email",children:"email"}),Object(c.jsx)("input",{className:"bg-black text-white px-2 py-2",value:y,onChange:function(e){return w(e.target.value)},type:"text",name:"email",id:"email"}),Object(c.jsx)("input",{type:"submit",value:"Submit"})]}),Object(c.jsx)(p,{getUserID:J,deleteRequest:function(){$(!0)},user:ce})]}),"gallery"===C&&Object(c.jsxs)("div",{children:[Object(c.jsxs)("form",{onSubmit:function(e){return function(e){return P.apply(this,arguments)}(e)},children:[Object(c.jsx)("input",{type:"text",value:A,onChange:function(e){return T(e.target.value)}}),Object(c.jsx)("input",{type:"submit",value:"Search"})]}),I.map((function(e){return Object(c.jsx)("div",{children:e.title})}))]})]}),"reports"===K&&Object(c.jsx)(m,{}),Z&&Object(c.jsx)(j,{cancel:function(){$(!1)},confirmDelete:function(){return ee.apply(this,arguments)}})]})]})},g=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,18)).then((function(t){var n=t.getCLS,c=t.getFID,s=t.getFCP,r=t.getLCP,a=t.getTTFB;n(e),c(e),s(e),r(e),a(e)}))};l.a.render(Object(c.jsx)(r.a.StrictMode,{children:Object(c.jsx)(O,{})}),document.getElementById("root")),g()}},[[17,1,2]]]);
//# sourceMappingURL=main.28506fa4.chunk.js.map