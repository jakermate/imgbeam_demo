(this.webpackJsonpsignup=this.webpackJsonpsignup||[]).push([[0],{11:function(e,t,a){e.exports=a.p+"static/media/imgbeam.4803f613.png"},15:function(e,t,a){e.exports=a(27)},20:function(e,t,a){},21:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},22:function(e,t,a){},23:function(e,t,a){},27:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(9),o=a.n(s),c=(a(20),a(21),a(22),a(23),a(2)),l=a(5),i=a.n(l),u=a(10),m=a(1),d=a(3),b=a(11),f=a.n(b);function p(){var e=Object(c.a)(["\n  background: #3498db;\n  opacity: ",";\n"]);return p=function(){return e},e}function g(){var e=Object(c.a)(["\n  animation: "," 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards;\n"]);return g=function(){return e},e}function h(){var e=Object(c.a)(["\n  from{\n    opacity: 0;\n    transform: scale(1.6) translateX(0px);\n  }\n  to{\n    opacity: 1;\n    transform: scale(1) translateX(40px);\n  }\n"]);return h=function(){return e},e}function x(){var e=Object(c.a)(["\n  /* border-color: ","; */\n  &:focus {\n    border-color: rgba(99, 179, 237);\n  }\n"]);return x=function(){return e},e}function y(){var e=Object(n.useState)(""),t=Object(m.a)(e,2),a=t[0],s=t[1],o=Object(n.useState)(""),c=Object(m.a)(o,2),l=c[0],d=c[1],b=Object(n.useState)(!1),p=Object(m.a)(b,2),g=p[0],h=p[1];Object(n.useEffect)((function(){Q()}),[a]);var x=Object(n.useState)(""),y=Object(m.a)(x,2),E=y[0],j=y[1],O=Object(n.useState)(""),S=Object(m.a)(O,2),k=S[0],C=S[1],R=Object(n.useState)(!1),P=Object(m.a)(R,2),q=P[0],F=P[1];Object(n.useEffect)((function(){fetch("/checkemail?email=".concat(E),{mode:"cors"}).then((function(e){return e.json()})).then((function(e){F(e.valid),C(e.message)}))}),[E]);var I=Object(n.useState)(""),B=Object(m.a)(I,2),J=B[0],A=B[1],L=Object(n.useState)(""),T=Object(m.a)(L,2),W=T[0],X=T[1],z=Object(n.useState)(!1),M=Object(m.a)(z,2),U=M[0],$=M[1],D=Object(n.useState)(""),G=Object(m.a)(D,2),H=G[0],K=G[1];Object(n.useEffect)((function(){fetch("/passwordcheck?p1=".concat(J,"&p2=").concat(W),{mode:"cors"}).then((function(e){return e.json().then((function(e){$(e.valid),K(e.message)}))}))}),[J,W]);var Q=function(){fetch("/checkusername?username=".concat(a),{mode:"cors"}).then((function(e){return e.json()})).then((function(e){h(e.valid),d(e.message)}))};function V(){return Y.apply(this,arguments)}function Y(){return(Y=Object(u.a)(i.a.mark((function e(){var t,n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t={username:a,email:E,password:J,password2:W},e.next=4,fetch("/signup",{method:"post",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});case 4:if(409!=(n=e.sent).status){e.next=8;break}return console.log("Invalid Credentials"),e.abrupt("return");case 8:200==n.status&&(console.log("Success, redirecting."),window.location.replace("/signupsuccess?email=".concat(E))),500==n.status&&console.log("Server error."),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(0),console.log(e.t0);case 15:case"end":return e.stop()}}),e,null,[[0,12]])})))).apply(this,arguments)}return r.a.createElement("div",{className:"mx-auto text-white"},r.a.createElement("div",{id:"signup-form-panel",style:{width:"350px",borderRadius:"3px",background:"#373737"},className:"mt-2 bg-white max-w-lg  px-8 py-8"},r.a.createElement("div",{id:"logo-container",class:"container mx-auto items-center flex justify-center"},r.a.createElement("img",{src:f.a,alt:"",className:"block mb-3",style:{width:"220px"}})),r.a.createElement("div",{id:"register-label",className:"text-xs font-bold mb-6"},"register with email"),r.a.createElement("form",{action:"/signup",method:"POST",className:"flex relative flex-col max-w-2xl mx-auto text-sm mx-6"},r.a.createElement("div",{className:"w-full relative"},r.a.createElement("label",{className:"hidden mb-1 font-bold text-xs text-gray-700",htmlFor:"username"},"Username"),r.a.createElement(w,{valid:g,className:"border-2 w-full border-gray-300  px-4 py-1 mb-1 bg-gray-300 placeholder-gray-600 focus:bg-gray-100 focus:outline-none ",type:"text",onChange:function(e){return s(e.target.value)},name:"username",value:a,placeholder:"username",required:!0,style:{borderRadius:"3px"}}),r.a.createElement("div",{className:"absolute right-0 top-0 w-full"},a.length>0&&!g&&r.a.createElement(v,{message:l}))),r.a.createElement("div",{className:"w-full relative"},r.a.createElement("label",{className:"hidden mb-1 font-bold text-xs text-gray-700",htmlFor:"email"},"Email"),r.a.createElement("input",{className:"border-2 w-full border-gray-300  px-4 py-1 mb-1 bg-gray-300 placeholder-gray-600 focus:bg-gray-100 focus:outline-none ",type:"text",name:"email",onChange:function(e){return j(e.target.value)},placeholder:"email",value:E,required:!0,style:{borderRadius:"3px"}}),r.a.createElement("div",{className:"absolute right-0 top-0 w-full"},E.length>0&&!q&&r.a.createElement(v,{message:k}))),r.a.createElement("div",{className:"w-full relative"},r.a.createElement("label",{className:"hidden mb-1 font-bold text-xs text-gray-700",htmlFor:"password"},"Password"),r.a.createElement("input",{className:"border-2 w-full border-gray-300  px-4 py-1 mb-1 bg-gray-300 placeholder-gray-600 focus:bg-gray-100 focus:outline-none ",type:"password",name:"password",value:J,placeholder:"password",onChange:function(e){return A(e.target.value)},required:!0,style:{borderRadius:"3px"}}),r.a.createElement("div",{className:"absolute right-0 top-0 w-full"},J.length>0&&!U&&"Passwords do not match."!==H&&r.a.createElement(v,{message:H}))),r.a.createElement("div",{className:"w-full relative"},r.a.createElement("label",{className:"hidden mb-1 font-bold text-xs text-gray-700",htmlFor:"retype-password"},"Confirm Password"),r.a.createElement("input",{className:"border-2 w-full border-gray-300  px-4 py-1  bg-gray-300 placeholder-gray-600 focus:bg-gray-100 focus:outline-none ",type:"password",value:W,name:"retype-password",onChange:function(e){return X(e.target.value)},placeholder:"retype password",required:!0,style:{borderRadius:"3px"}}),r.a.createElement("div",{className:"absolute right-0 top-0 w-full"},W.length>0&&!U&&"Passwords do not match."===H&&r.a.createElement(v,{message:H})))),r.a.createElement(N,{className:"px-4 font-bold mt-4 mb-2 py-1 w-full text-white text-sm",type:"submit",onSubmit:function(e){return V()},onClick:function(e){return V()},disabled:!g||!q||!U,style:{borderRadius:"3px"}},"Let me in!"),r.a.createElement("div",{id:"warnings",className:"text-xs mt-6 mx-6"},"By making an account, I agree to the"," ",r.a.createElement("a",{href:"/termsofuse",className:"font-bold",style:{color:"#3498db"}},"terms and conditions")," ","set for by ",r.a.createElement("span",{className:"font-bold"},"imgbeam"))),r.a.createElement("div",{id:"or-sign-in",className:"w-full mb-6 flex flex-col justify-center items-center"},r.a.createElement("div",{className:"text-xs mb-2 mt-4"},"already have a imgbeam account?"),r.a.createElement("a",{href:"/login",className:" font-bold text-sm",style:{color:"#3498db"}},"Log In")))}function v(e){return r.a.createElement(j,{className:"absolute font-bold px-4 py-1 bg-red-400 text-white",style:{left:"100%",whiteSpace:"nowrap"}},e.message)}var w=d.a.input(x(),(function(e){return e.valid?"green":"red"})),E=Object(d.b)(h()),j=d.a.div(g(),E),N=d.a.button(p(),(function(e){return e.disabled?.2:1}));var O=function(){return r.a.createElement("div",{className:"App pt-12"},r.a.createElement(y,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(O,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[15,1,2]]]);
//# sourceMappingURL=main.b078a866.chunk.js.map