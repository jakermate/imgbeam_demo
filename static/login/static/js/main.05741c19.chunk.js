(this.webpackJsonplogin=this.webpackJsonplogin||[]).push([[0],{15:function(e,t,a){e.exports=a(29)},20:function(e,t,a){},21:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},22:function(e,t,a){},23:function(e,t,a){},29:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(8),c=a.n(r),l=(a(20),a(21),a(22),a(9)),s=a.n(l),i=(a(23),a(10)),m=a(1),u=a(11);a(24);function d(){var e=Object(i.a)(["\n  border: 2px solid rgba(0,0,0,0);\n  font-size: 14px;\n  color: white;\n  background: rgba(255,255,255,.1);\n  border-radius: 3px;\n  :hover{\n    opacity: .8;\n  }\n  :focus{\n    border-color: #3498db;\n  }\n  ::active,:focus{\n    outline: none;\n  }\n"]);return d=function(){return e},e}function x(){var e=Object(n.useState)(""),t=Object(m.a)(e,2),a=t[0],r=t[1],c=Object(n.useState)(!1),l=Object(m.a)(c,2),s=l[0],i=l[1],u=Object(n.useState)(""),d=Object(m.a)(u,2),x=d[0],p=d[1],b=Object(n.useState)(""),g=Object(m.a)(b,2),h=g[0],E=g[1];return Object(n.useEffect)((function(){var e=new URLSearchParams(window.location.search);e.has("redirect")&&"/"!==e.get("redirect")&&r("?redirect="+e.get("redirect")),document.getElementById("login-input").focus()}),[]),Object(n.useEffect)((function(){console.log(a)}),[a]),Object(n.useEffect)((function(){h.length>6&&x.length>0?i(!0):i(!1)}),[h,x]),o.a.createElement("div",{id:"form-container",class:"flex container mx-auto max-w-2xl flex-col justify-center align-center text-black",style:{}},o.a.createElement("form",{action:"/login".concat(a),method:"POST",class:"flex flex-col max-w-2xl mx-auto"},o.a.createElement("div",{id:"login-form-panel",class:" flex flex-col mt-4",style:{width:"300px"}},o.a.createElement(f,{id:"login-input",className:" border-gray-300 outline-none focus:outline-none  px-4 py-1 mb-2",value:x,onChange:function(e){return p(e.target.value)},type:"text",tabIndex:1,name:"username",placeholder:"username or email"}),o.a.createElement(f,{className:" border-gray-300 outline-none focus:outline-none  px-4 py-1 mb-2",onChange:function(e){return E(e.target.value)},value:h,tabIndex:2,type:"password",name:"password",placeholder:"password"})),o.a.createElement("div",{id:"login-control-sub-panel",className:"mt-4"},o.a.createElement("button",{disabled:!s,className:"px-4 w-full text-sm font-bold hover:opacity-50  mb-8 py-1 text-white",type:"submit",tabIndex:3,style:{opacity:"".concat(s?1:.2),borderRadius:"3px",background:"#3498db"}},"Login"),o.a.createElement("div",{id:"forgot-password"},o.a.createElement("a",{href:"/password/forgot",className:"text-xs",style:{color:"#3498db"}},"Forgot password?")))))}var f=u.a.input(d());var p=function(){return o.a.createElement("div",{className:"App text-white flex flex-col h-screen justify-center",style:{background:"#232323"}},o.a.createElement("div",{id:"login-content",className:"max-w-3xl mx-auto py-8",style:{width:"330px",background:"#373737",borderRadius:"3px"}},o.a.createElement("div",{className:"text-center flex items-center justify-center mb-4"},o.a.createElement("a",{href:"//imgbeam.com"},o.a.createElement("img",{src:s.a,alt:"",style:{height:"30px"}}))),o.a.createElement("div",{id:"subtitle",className:"mb-4 text-xs"},"sign in"),o.a.createElement(x,null)),o.a.createElement("div",{id:"login-content",className:"max-w-3xl mx-auto py-3 mt-3",style:{width:"330px",background:"#373737",borderRadius:"3px"}},o.a.createElement("div",{class:"flex flex-col justify-center items-center",style:{background:"#373737",borderRadius:"3px"}},o.a.createElement("div",{class:"text-xs text-white"},"Don't have an account?"),o.a.createElement("a",{href:"/signup",class:" font-bold mt-2 mb-2 text-xs",style:{color:"#3498db"}},"Register"))),o.a.createElement("div",{className:"absolute bottom-0 right-0 mb-2 mr-4"},o.a.createElement("ul",{className:"flex flex-row"},o.a.createElement("li",{className:"mx-1 px-1"},o.a.createElement("a",{href:"/termsofuse"},"terms of use")),o.a.createElement("li",{className:"mx-1 px-1"},o.a.createElement("a",{href:"/privacypolicy"},"privacy")),o.a.createElement("li",{className:"mx-1 px-1"},o.a.createElement("a",{href:"/about"},"about")),o.a.createElement("li",{className:"mx-1 px-1"},o.a.createElement("a",{href:"/support"},"support")))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(p,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},9:function(e,t,a){e.exports=a.p+"static/media/imgbeam.4803f613.png"}},[[15,1,2]]]);
//# sourceMappingURL=main.05741c19.chunk.js.map