(function(e){function t(t){for(var o,r,s=t[0],l=t[1],c=t[2],u=0,m=[];u<s.length;u++)r=s[u],Object.prototype.hasOwnProperty.call(n,r)&&n[r]&&m.push(n[r][0]),n[r]=0;for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(e[o]=l[o]);d&&d(t);while(m.length)m.shift()();return i.push.apply(i,c||[]),a()}function a(){for(var e,t=0;t<i.length;t++){for(var a=i[t],o=!0,s=1;s<a.length;s++){var l=a[s];0!==n[l]&&(o=!1)}o&&(i.splice(t--,1),e=r(r.s=a[0]))}return e}var o={},n={index:0},i=[];function r(t){if(o[t])return o[t].exports;var a=o[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=o,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(a,o,function(t){return e[t]}.bind(null,o));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var c=0;c<s.length;c++)t(s[c]);var d=l;i.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("8aac")},"0670":function(e,t,a){"use strict";a("5363");var o,n=a("2b0e"),i=a("f309");const r=window.matchMedia("(prefers-color-scheme: dark)");let s=r.matches,l=(null===(o=window.config)||void 0===o?void 0:o.theme)||"system";"system"!==l?s="dark"===l:r.addEventListener("change",(function(e){c.framework.theme.dark=e.matches,document.documentElement.setAttribute("data-theme",e.matches?"dark":"light")})),n["a"].use(i["a"]);const c=new i["a"]({theme:{dark:s,disable:!1},icons:{iconfont:"mdi"}});document.documentElement.setAttribute("data-theme",s?"dark":"light"),window.vuetify=c,window.openExternal=function(e){window.ipcrenderer.send("open-external",e)},t["a"]=c},"3a1a":function(e,t,a){"use strict";var o=a("f589"),n=a.n(o);n.a},"6c92":function(e,t,a){"use strict";var o=a("87f2"),n=a.n(o);n.a},"87f2":function(e,t,a){},"8aac":function(e,t,a){"use strict";a.r(t);var o=a("2b0e"),n=a("0670"),i=a("2f62");o["a"].use(i["a"]);const r=new i["a"].Store({state:{appLoading:!1,config:window.config,darkmode:window.config.theme},mutations:{openForm(e,t){e.appLoading=!0,window.ipcrenderer.send("open-forms",t)},async changeColorScheme(e,t){e.config.theme=t,await s(),e.darkmode=t;let a="system"===t?window.matchMedia("(prefers-color-scheme: dark)").matches:"dark"===t;window.vuetify.framework.theme.dark=a,document.documentElement.setAttribute("data-theme",a?"dark":"light")},async updateConfig(e){await s()}},actions:{},modules:{}});function s(){return new Promise((e,t)=>{window.ipcrenderer.once("update-config",(function(a,o){o?e(!0):t(!1)})),window.ipcrenderer.send("update-config",window.store.state.config)})}window.ipcrenderer.on("pong",(function(e){console.log("Got pong from the renderer")})),window.ipcrenderer.send("ping"),console.log("Sent ping to the renderer."),window.store=r;var l=r,c=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app",{attrs:{id:"1_app"}},[a("v-navigation-drawer",{attrs:{app:"",clipped:""},model:{value:e.drawer,callback:function(t){e.drawer=t},expression:"drawer"}},[a("v-list",{attrs:{dense:""}},e._l(e.drawerList,(function(t){return a("v-list-item",{key:t.key,class:{drawerActive:e.page===t.name},attrs:{"active-class":"drawerActive"},on:{click:function(a){e.page=t.name,e.drawer=null}}},[t.icon?a("v-list-item-action",[a("v-icon",[e._v(e._s(t.icon))])],1):e._e(),a("v-list-item-content",[a("v-list-item-title",[e._v(e._s(t.title))])],1)],1)})),1)],1),a("v-app-bar",{attrs:{app:"","clipped-left":"",color:"blue",dark:"",loading:this.$store.state.appLoading}},[a("v-app-bar-nav-icon",{on:{click:function(t){t.stopPropagation(),e.drawer=!e.drawer}}}),a("v-toolbar-title",[e._v(e._s(e.pageTitle))]),a("v-spacer"),a("v-menu",{attrs:{"offset-y":""},scopedSlots:e._u([{key:"activator",fn:function(t){var o=t.on,n=t.attrs;return[a("v-btn",e._g(e._b({attrs:{dark:"",icon:""}},"v-btn",n,!1),o),[a("v-icon",[e._v("mdi-plus")])],1)]}}])},[a("v-list",e._l(e.addList,(function(t){return a("v-list-item",{key:t.key,on:{click:t.onClick}},[t.icon?a("v-list-item-action",[a("v-icon",[e._v(e._s(t.icon))])],1):e._e(),a("v-list-item-content",[a("v-list-item-title",[e._v(e._s(t.title))])],1)],1)})),1)],1)],1),a("v-main",["dashboard"===this.page?a("dashboard"):"settings"===this.page?a("settings"):"users"===this.page?a("users"):e._e()],1),a("v-footer",{attrs:{app:"",dense:""}},[a("span",[e._v(" "+e._s(e.$store.state.config.databaseFile.location)+" ")]),a("v-spacer"),a("span",[a("a",{on:{click:e.openGithub}},[a("v-icon",{attrs:{size:"20"}},[e._v("mdi-github")]),e._v("vigneshpa/chit ")],1),e._v(" © "+e._s((new Date).getFullYear())+" GPL3 ")])],1)],1)},d=[],u=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("v-container",{attrs:{fluid:"",id:"dashboard"}},[e._v(" Dashboard goes here. "),o("v-img",{attrs:{src:a("cf05"),width:"500"}}),o("v-img",{attrs:{src:a("cf05"),width:"500"}})],1)},m=[],p=o["a"].extend({}),v=p,f=(a("3a1a"),a("2877")),h=a("6544"),w=a.n(h),b=a("a523"),g=a("adda"),y=Object(f["a"])(v,u,m,!1,null,null,null),k=y.exports;w()(y,{VContainer:b["a"],VImg:g["a"]});var _=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{attrs:{fluid:"",id:"settings"}},[a("v-card",[a("v-card-title",[e._v("Settings")]),a("v-divider"),a("v-tabs",{attrs:{vertical:e.$vuetify.breakpoint.mdAndUp}},[a("v-tab",[a("v-icon",{attrs:{left:""}},[e._v("mdi-palette")]),e._v(" Theme ")],1),a("v-tab",[a("v-icon",{attrs:{left:""}},[e._v("mdi-database-lock")]),e._v(" Data ")],1),a("v-tab",[a("v-icon",{attrs:{left:""}},[e._v("mdi-cable-data")]),e._v(" Test ")],1),a("v-tab-item",[a("v-card",{attrs:{flat:""}},[a("v-card-title",[e._v("Dark mode")]),a("v-card-text",[a("v-switch",{attrs:{label:"Follow system"},model:{value:e.darkModeFollowSystem,callback:function(t){e.darkModeFollowSystem=t},expression:"darkModeFollowSystem"}}),a("v-expand-transition",[e.darkModeFollowSystem?e._e():a("v-radio-group",{attrs:{disabled:e.darkModeFollowSystem,label:"Choose color scheme"},model:{value:e.customColorScheme,callback:function(t){e.customColorScheme=t},expression:"customColorScheme"}},[a("v-radio",{attrs:{label:"light",value:"light"}}),a("v-radio",{attrs:{label:"dark",value:"dark"}})],1)],1)],1)],1)],1),a("v-tab-item",[a("v-card",{attrs:{flat:""}},[a("v-card-title",[e._v("Database file")]),a("v-card-text",[a("v-switch",{attrs:{label:"Use app's default location to store data"},model:{value:e.dbFileUseAppLocation,callback:function(t){e.dbFileUseAppLocation=t},expression:"dbFileUseAppLocation"}}),a("v-expand-transition",[a("v-text-field",{attrs:{disabled:e.dbFileUseAppLocation,readonly:"",label:"Database file Location"},on:{click:e.chooseDBfile},model:{value:e.dbFileLocation,callback:function(t){e.dbFileLocation=t},expression:"dbFileLocation"}})],1)],1)],1)],1)],1)],1)],1)},V=[],x=o["a"].extend({data:function(){return{darkModeFollowSystem:"system"===window.store.state.darkmode,customColorScheme:"system"===window.store.state.darkmode?null:window.store.state.darkmode,dbFileUseAppLocation:!window.config.databaseFile.isCustom,dbFileLocation:window.config.databaseFile.location}},watch:{darkModeFollowSystem(){this.darkModeFollowSystem?(this.customColorScheme=null,window.store.commit("changeColorScheme","system")):this.customColorScheme||(this.customColorScheme=window.vuetify.framework.theme.dark?"dark":"light")},customColorScheme(){this.customColorScheme&&window.store.commit("changeColorScheme",this.customColorScheme)},dbFileUseAppLocation(){window.store.state.config.databaseFile.isCustom=!this.dbFileUseAppLocation,window.store.commit("updateConfig")},dbFileLocation(){window.store.state.config.databaseFile.location=this.dbFileLocation,window.store.commit("updateConfig")}},methods:{async chooseDBfile(e){window.store.state.config.databaseFile.isCustom=!0;let t={properties:["promptToCreate","openFile"],title:"Choose a database file",message:"Choose a database file. If the file doesn't esists it will be created",defaultPath:window.store.state.config.databaseFile.location,filters:[{name:"SQLite Database",extensions:["db"]}]},a=await new Promise((e,a)=>{window.ipcrenderer.once("show-dialog",(t,a)=>{e(a)}),window.ipcrenderer.send("show-dialog","open",t)});a.canceled||(this.dbFileLocation=a.filePaths.join(""))}}}),S=x,C=a("b0af"),F=a("99d9"),L=a("ce7e"),P=a("0789"),D=a("132d"),A=a("67b6"),T=a("43a6"),I=a("b73d"),U=a("71a3"),M=a("c671"),O=a("fe57"),j=a("8654"),B=Object(f["a"])(S,_,V,!1,null,null,null),E=B.exports;w()(B,{VCard:C["a"],VCardText:F["b"],VCardTitle:F["c"],VContainer:b["a"],VDivider:L["a"],VExpandTransition:P["a"],VIcon:D["a"],VRadio:A["a"],VRadioGroup:T["a"],VSwitch:I["a"],VTab:U["a"],VTabItem:M["a"],VTabs:O["a"],VTextField:j["a"]});var $=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{attrs:{fluid:""}},[a("v-data-iterator",{attrs:{items:e.users,search:e.search,"sort-by":e.keys[e.sortBy],"sort-desc":e.sortDesc},scopedSlots:e._u([{key:"header",fn:function(){return[a("v-toolbar",{staticClass:"mb-1",attrs:{dark:"",color:"blue darken-3"}},[a("v-text-field",{attrs:{clearable:"",flat:"","solo-inverted":"","hide-details":"","prepend-inner-icon":"mdi-magnify",label:"Search"},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),e.$vuetify.breakpoint.mdAndUp?[a("v-spacer"),a("v-select",{attrs:{flat:"","solo-inverted":"","hide-details":"",items:e.keysNames,"prepend-inner-icon":"mdi-sort",label:"Sort by"},model:{value:e.sortBy,callback:function(t){e.sortBy=t},expression:"sortBy"}}),a("v-spacer"),a("v-btn-toggle",{attrs:{mandatory:""},model:{value:e.sortDesc,callback:function(t){e.sortDesc=t},expression:"sortDesc"}},[a("v-btn",{attrs:{large:"",depressed:"",color:"blue",value:!1}},[a("v-icon",[e._v("mdi-arrow-up")])],1),a("v-btn",{attrs:{large:"",depressed:"",color:"blue",value:!0}},[a("v-icon",[e._v("mdi-arrow-down")])],1)],1)]:e._e()],2)]},proxy:!0},{key:"default",fn:function(t){return[a("v-row",e._l(t.items,(function(t){return a("v-col",{key:t.name,attrs:{cols:"12",sm:"6",md:"4",lg:"3"}},[a("v-hover",{scopedSlots:e._u([{key:"default",fn:function(o){var n=o.hover;return[a("v-card",[a("v-card-title",{staticClass:"subheading font-weight-bold"},[a("span",[e._v(e._s(t.name))]),a("v-spacer"),a("v-icon",[e._v("mdi-account-details")])],1),a("v-divider"),a("v-list",{attrs:{dense:""}},e._l(e.filteredKeys,(function(o,n){return a("v-list-item",{key:n},[a("v-list-item-content",{class:{"blue--text":e.sortBy===o}},[e._v(" "+e._s(o)+": ")]),a("v-list-item-content",{staticClass:"align-end",class:{"blue--text":e.sortBy===o}},[e._v(" "+e._s(t[e.keys[o]])+" ")])],1)})),1),a("v-expand-transition",[n?a("v-overlay",{attrs:{absolute:"",color:"grey"}},[a("v-btn",{on:{click:function(a){return e.editUser(t.UID)}}},[e._v("View profile")])],1):e._e()],1)],1)]}}],null,!0)})],1)})),1)]}}])})],1)},G=[],N=o["a"].extend({data(){return{users:[],loading:!1,itemsPerPageArray:[4,8,12],search:"",filter:{},sortDesc:!1,page:1,itemsPerPage:4,sortBy:"name",keysNames:["Name","UID","Phone","Address"],keys:{Name:"name",UID:"UID",Phone:"phone",Address:"address"},items:[]}},computed:{numberOfPages(){return Math.ceil(this.items.length/this.itemsPerPage)},filteredKeys(){return this.keysNames.filter(e=>"Name"!==e)}},methods:{nextPage(){this.page+1<=this.numberOfPages&&(this.page+=1)},formerPage(){this.page-1>=1&&(this.page-=1)},updateItemsPerPage(e){this.itemsPerPage=e},editUser(e){}},mounted(){window.ipcrenderer.once("get-users-data",(e,t)=>{this.users=t,this.loading=!1}),this.loading=!0,window.ipcrenderer.send("get-users-data")}}),R=N,J=a("8336"),K=a("a609"),z=a("62ad"),H=a("c377"),Q=a("ce87"),Y=a("8860"),q=a("da13"),W=a("5d23"),X=a("a797"),Z=a("0fd9"),ee=a("b974"),te=a("2fa4"),ae=a("71d9"),oe=Object(f["a"])(R,$,G,!1,null,null,null),ne=oe.exports;w()(oe,{VBtn:J["a"],VBtnToggle:K["a"],VCard:C["a"],VCardTitle:F["c"],VCol:z["a"],VContainer:b["a"],VDataIterator:H["a"],VDivider:L["a"],VExpandTransition:P["a"],VHover:Q["a"],VIcon:D["a"],VList:Y["a"],VListItem:q["a"],VListItemContent:W["a"],VOverlay:X["a"],VRow:Z["a"],VSelect:ee["a"],VSpacer:te["a"],VTextField:j["a"],VToolbar:ae["a"]});var ie=o["a"].extend({props:{source:String},data:()=>({drawer:null,page:"dashboard",addList:[{title:"Add User",key:1,onClick:()=>{window.store.commit("openForm","addUser")},icon:"mdi-account-plus"},{title:"Add Group",key:2,onClick:()=>{window.store.commit("openForm","addGroup")},icon:"mdi-account-multiple-plus"}],drawerList:[{title:"Dashboard",name:"dashboard",key:1,icon:"mdi-view-dashboard"},{title:"Users",name:"users",key:3,icon:"mdi-account-multiple"},{title:"Groups",name:"groups",key:4,icon:"mdi-account-group"},{title:"Settings",name:"settings",key:2,icon:"mdi-cog"}]}),computed:{pageTitle(){for(const e of this.drawerList)if(e.name===this.page)return e.title;return"Chit Management System"}},methods:{openGithub(e){e.preventDefault(),window.openExternal("https://github.com/vigneshpa/chit")}},created(){},components:{dashboard:k,settings:E,users:ne}}),re=ie,se=(a("6c92"),a("7496")),le=a("40dc"),ce=a("5bc1"),de=a("553a"),ue=a("1800"),me=a("f6c4"),pe=a("e449"),ve=a("f774"),fe=a("2a7f"),he=Object(f["a"])(re,c,d,!1,null,null,null),we=he.exports;w()(he,{VApp:se["a"],VAppBar:le["a"],VAppBarNavIcon:ce["a"],VBtn:J["a"],VFooter:de["a"],VIcon:D["a"],VList:Y["a"],VListItem:q["a"],VListItemAction:ue["a"],VListItemContent:W["a"],VListItemTitle:W["c"],VMain:me["a"],VMenu:pe["a"],VNavigationDrawer:ve["a"],VSpacer:te["a"],VToolbarTitle:fe["a"]}),o["a"].config.productionTip=!1,window.app=new o["a"]({store:l,render:e=>e(we),vuetify:n["a"]}).$mount("#app")},cf05:function(e,t,a){e.exports=a.p+"img/logo.82b9c7a5.png"},f589:function(e,t,a){}});
//# sourceMappingURL=index.c8da0e90.js.map