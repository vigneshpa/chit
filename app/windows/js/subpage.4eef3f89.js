(function(t){function e(e){for(var n,a,i=e[0],u=e[1],l=e[2],f=0,p=[];f<i.length;f++)a=i[f],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&p.push(o[a][0]),o[a]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(t[n]=u[n]);c&&c(e);while(p.length)p.shift()();return s.push.apply(s,l||[]),r()}function r(){for(var t,e=0;e<s.length;e++){for(var r=s[e],n=!0,i=1;i<r.length;i++){var u=r[i];0!==o[u]&&(n=!1)}n&&(s.splice(e--,1),t=a(a.s=r[0]))}return t}var n={},o={subpage:0},s=[];function a(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=t,a.c=n,a.d=function(t,e,r){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(r,n,function(e){return t[e]}.bind(null,n));return r},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],u=i.push.bind(i);i.push=e,i=i.slice();for(var l=0;l<i.length;l++)e(i[l]);var c=u;s.push([1,"chunk-vendors"]),r()})({"0adc":function(t,e,r){},1:function(t,e,r){t.exports=r("8b72")},"8b72":function(t,e,r){"use strict";r.r(e);var n=r("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("img",{attrs:{alt:"Vue logo",src:r("cf05")}}),n("HelloWorld",{attrs:{msg:"Welcome to Your Vue.js + TypeScript App"}})],1)},s=[],a=r("fdab"),i=n["a"].extend({name:"App",components:{HelloWorld:a["a"]}}),u=i,l=(r("97ca"),r("2877")),c=Object(l["a"])(u,o,s,!1,null,null,null),f=c.exports,p=r("2f62");n["a"].use(p["a"]);var h=new p["a"].Store({state:{},mutations:{},actions:{},modules:{}});n["a"].config.productionTip=!1,new n["a"]({store:h,render:function(t){return t(f)}}).$mount("#app")},"97ca":function(t,e,r){"use strict";var n=r("0adc"),o=r.n(n);o.a},"9b19":function(t,e,r){t.exports=r.p+"img/logo.63a7d78d.svg"},cf05:function(t,e,r){t.exports=r.p+"img/logo.82b9c7a5.png"},fdab:function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",[n("v-row",{staticClass:"text-center"},[n("v-col",{attrs:{cols:"12"}},[n("v-img",{staticClass:"my-3",attrs:{src:r("9b19"),contain:"",height:"200"}})],1),n("v-col",{staticClass:"mb-4"},[n("h1",{staticClass:"display-2 font-weight-bold mb-3"},[t._v(" Welcome to Vuetify ")]),n("p",{staticClass:"subheading font-weight-regular"},[t._v(" For help and collaboration with other Vuetify developers, "),n("br"),t._v("please join our online "),n("a",{attrs:{href:"https://community.vuetifyjs.com",target:"_blank"}},[t._v("Discord Community")])])]),n("v-col",{staticClass:"mb-5",attrs:{cols:"12"}},[n("h2",{staticClass:"headline font-weight-bold mb-3"},[t._v(" What's next? ")]),n("v-row",{attrs:{justify:"center"}},t._l(t.whatsNext,(function(e,r){return n("a",{key:r,staticClass:"subheading mx-3",attrs:{href:e.href,target:"_blank"}},[t._v(" "+t._s(e.text)+" ")])})),0)],1),n("v-col",{staticClass:"mb-5",attrs:{cols:"12"}},[n("h2",{staticClass:"headline font-weight-bold mb-3"},[t._v(" Important Links ")]),n("v-row",{attrs:{justify:"center"}},t._l(t.importantLinks,(function(e,r){return n("a",{key:r,staticClass:"subheading mx-3",attrs:{href:e.href,target:"_blank"}},[t._v(" "+t._s(e.text)+" ")])})),0)],1),n("v-col",{staticClass:"mb-5",attrs:{cols:"12"}},[n("h2",{staticClass:"headline font-weight-bold mb-3"},[t._v(" Ecosystem ")]),n("v-row",{attrs:{justify:"center"}},t._l(t.ecosystem,(function(e,r){return n("a",{key:r,staticClass:"subheading mx-3",attrs:{href:e.href,target:"_blank"}},[t._v(" "+t._s(e.text)+" ")])})),0)],1)],1)],1)},o=[],s=r("2b0e"),a=s["a"].extend({name:"HelloWorld",data:function(){return{ecosystem:[{text:"vuetify-loader",href:"https://github.com/vuetifyjs/vuetify-loader"},{text:"github",href:"https://github.com/vuetifyjs/vuetify"},{text:"awesome-vuetify",href:"https://github.com/vuetifyjs/awesome-vuetify"}],importantLinks:[{text:"Documentation",href:"https://vuetifyjs.com"},{text:"Chat",href:"https://community.vuetifyjs.com"},{text:"Made with Vuetify",href:"https://madewithvuejs.com/vuetify"},{text:"Twitter",href:"https://twitter.com/vuetifyjs"},{text:"Articles",href:"https://medium.com/vuetify"}],whatsNext:[{text:"Explore components",href:"https://vuetifyjs.com/components/api-explorer"},{text:"Select a layout",href:"https://vuetifyjs.com/getting-started/pre-made-layouts"},{text:"Frequently Asked Questions",href:"https://vuetifyjs.com/getting-started/frequently-asked-questions"}]}}}),i=a,u=r("2877"),l=r("6544"),c=r.n(l),f=r("62ad"),p=r("a523"),h=r("adda"),m=r("0fd9"),d=Object(u["a"])(i,n,o,!1,null,null,null);e["a"]=d.exports;c()(d,{VCol:f["a"],VContainer:p["a"],VImg:h["a"],VRow:m["a"]})}});
//# sourceMappingURL=subpage.4eef3f89.js.map