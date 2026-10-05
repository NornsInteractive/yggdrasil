var le=(e,t,a)=>(n,s)=>{let r=-1;return o(0);async function o(i){if(i<=r)throw new Error("next() called multiple times");r=i;let l,d=!1,p;if(e[i]?(p=e[i][0][0],n.req.routeIndex=i):p=i===e.length&&s||void 0,p)try{l=await p(n,()=>o(i+1))}catch(c){if(c instanceof Error&&t)n.error=c,l=await t(c,n),d=!0;else throw c}else n.finalized===!1&&a&&(l=await a(n));return l&&(n.finalized===!1||d)&&(n.res=l),n}};var Te=Symbol();var ke=(e,t)=>new Response(e,{headers:{"Content-Type":t.replace(/^[^;]+/,n=>n.toLowerCase())}}).formData();var X=e=>"headers"in e,Ae=async(e,t=Object.create(null))=>{let{all:a=!1,dot:n=!1}=t,o=(X(e)?e.headers:e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();return o==="multipart/form-data"||o==="application/x-www-form-urlencoded"?nt(e,{all:a,dot:n}):{}};async function nt(e,t){if(!X(e)&&e.bodyCache.formData)return Re(await e.bodyCache.formData,t);let a=X(e)?e.headers:e.raw.headers,n=await e.arrayBuffer(),s=ke(n,a.get("Content-Type")||"");X(e)||(e.bodyCache.formData=s);let r=await s;return r?Re(r,t):{}}function Re(e,t){let a=Object.create(null);return e.forEach((n,s)=>{t.all||s.endsWith("[]")?st(a,s,n):a[s]=n}),t.dot&&Object.entries(a).forEach(([n,s])=>{n.includes(".")&&(rt(a,n,s),delete a[n])}),a}var st=(e,t,a)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(a):e[t]=[e[t],a]:t.endsWith("[]")?e[t]=[a]:e[t]=a},rt=(e,t,a)=>{if(/(?:^|\.)__proto__\./.test(t))return;let n=e,s=t.split(".");s.forEach((r,o)=>{o===s.length-1?n[r]=a:((!n[r]||typeof n[r]!="object"||Array.isArray(n[r])||n[r]instanceof File)&&(n[r]=Object.create(null)),n=n[r])})};var ce=e=>{let t=e.split("/");return t[0]===""&&t.shift(),t},Se=e=>{let{groups:t,path:a}=ot(e),n=ce(a);return it(n,t)},ot=e=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(a,n)=>{let s=`@${n}`;return t.push([s,a]),s}),{groups:t,path:e}},it=(e,t)=>{for(let a=t.length-1;a>=0;a--){let[n]=t[a];for(let s=e.length-1;s>=0;s--)if(e[s].includes(n)){e[s]=e[s].replace(n,t[a][1]);break}}return e},Z={},Ie=(e,t)=>{if(e==="*")return"*";let a=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(a){let n=`${e}#${t}`;return Z[n]||(a[2]?Z[n]=t&&t[0]!==":"&&t[0]!=="*"?[n,a[1],new RegExp(`^${a[2]}(?=/${t})`)]:[e,a[1],new RegExp(`^${a[2]}$`)]:Z[n]=[e,a[1],!0]),Z[n]}return null},Ce=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,a=>{try{return t(a)}catch{return a}})}},lt=e=>Ce(e,decodeURI),pe=e=>{let t=e.url,a=t.indexOf("/",t.indexOf(":")+4),n=a;for(;n<t.length;n++){let s=t.charCodeAt(n);if(s===37){let r=t.indexOf("?",n),o=t.indexOf("#",n),i=r===-1?o===-1?void 0:o:o===-1?r:Math.min(r,o),l=t.slice(a,i);return lt(l.includes("%25")?l.replace(/%25/g,"%2525"):l)}else if(s===63||s===35)break}return t.slice(a,n)};var De=e=>{let t=pe(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},O=(e,t,...a)=>(a.length&&(t=O(t,...a)),`${e?.[0]==="/"?"":"/"}${e}${t==="/"?"":`${e?.at(-1)==="/"?"":"/"}${t?.[0]==="/"?t.slice(1):t}`}`),ee=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;let t=e.split("/"),a=[],n="";return t.forEach(s=>{if(s!==""&&!/\:/.test(s))n+="/"+s;else if(/\:/.test(s))if(s.charCodeAt(s.length-1)===63){a.length===0&&n===""?a.push("/"):a.push(n);let r=s.slice(0,-1);n+="/"+r,a.push(n)}else n+="/"+s}),a.filter((s,r,o)=>o.indexOf(s)===r)},te=e=>e.indexOf("%")!==-1?Ce(e,dt):e,de=e=>(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),te(e)),Be=(e,t,a)=>{let n;if(!a&&t&&t.indexOf("%")===-1&&t.indexOf("+")===-1){let o=e.indexOf("?",8);if(o===-1)return;for(e.startsWith(t,o+1)||(o=e.indexOf(`&${t}`,o+1));o!==-1;){let i=e.charCodeAt(o+t.length+1);if(i===61){let l=o+t.length+2,d=e.indexOf("&",l);return de(e.slice(l,d===-1?void 0:d))}else if(i==38||isNaN(i))return"";o=e.indexOf(`&${t}`,o+1)}if(n=/[%+]/.test(e),!n)return}let s=Object.create(null);n??=/[%+]/.test(e);let r=e.indexOf("?",8);for(;r!==-1;){let o=e.indexOf("&",r+1),i=e.indexOf("=",r);i>o&&o!==-1&&(i=-1);let l=e.slice(r+1,i===-1?o===-1?void 0:o:i);if(n&&(l=de(l)),r=o,l==="")continue;let d;i===-1?d="":(d=e.slice(i+1,o===-1?void 0:o),n&&(d=de(d))),a?(s[l]&&Array.isArray(s[l])||(s[l]=[]),s[l].push(d)):s[l]??=d}return t?s[t]:s},Oe=Be,Pe=(e,t)=>Be(e,t,!0),dt=decodeURIComponent;var Le=class{raw;#t;#e;routeIndex=0;path;bodyCache={};constructor(e,t="/",a=[[]]){this.raw=e,this.path=t,this.#e=a}param(e){return e?this.#a(e):this.#r()}#a(e){let t=this.#e[0][this.routeIndex][1][e],a=this.#n(t);return a&&te(a)}#r(){let e={},t=Object.keys(this.#e[0][this.routeIndex][1]);for(let a of t){let n=this.#n(this.#e[0][this.routeIndex][1][a]);n!==void 0&&(e[a]=te(n))}return e}#n(e){return this.#e[1]?this.#e[1][e]:e}query(e){return Oe(this.url,e)}queries(e){return Pe(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t=Object.create(null);return this.raw.headers.forEach((a,n)=>{t[n]=a}),t}async parseBody(e){return Ae(this,e)}#s=e=>{let{bodyCache:t,raw:a}=this,n=t[e];if(n)return n;for(let s in t)return t[s].then(r=>(s==="json"&&(r=JSON.stringify(r)),new Response(r)[e]()));return t[e]=a[e]()};json(){return this.#s("text").then(e=>JSON.parse(e))}text(){return this.#s("text")}arrayBuffer(){return this.#s("arrayBuffer")}bytes(){return this.#s("arrayBuffer").then(e=>new Uint8Array(e))}blob(){return this.#s("blob")}formData(){return this.#s("formData")}addValidatedData(e,t){(this.#t??={})[e]=t}valid(e){return this.#t?.[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Te](){return this.#e}get matchedRoutes(){return this.#e[0].map(([[,e]])=>e)}get routePath(){return this.#e[0].map(([[,e]])=>e)[this.routeIndex].path}};var Me={Stringify:1,BeforeStream:2,Stream:3},ct=(e,t)=>{let a=new String(e);return a.isEscaped=!0,a.callbacks=t,a};var me=async(e,t,a,n,s)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));let r=e.callbacks;if(!r?.length)return Promise.resolve(e);s?s[0]+=e:s=[e];let o=Promise.all(r.map(i=>i({phase:t,buffer:s,context:n}))).then(i=>Promise.all(i.filter(Boolean).map(l=>me(l,t,!1,n,s))).then(()=>s[0]));return a?ct(await o,r):o};var pt="text/plain; charset=UTF-8",ue=(e,t)=>({"Content-Type":e,...t}),V=(e,t)=>new Response(e,t),fe=class{#t;#e;env={};#a;finalized=!1;error;#r;#n;#s;#c;#l;#d;#i;#p;#m;constructor(e,t){this.#t=e,t&&(this.#n=t.executionCtx,this.env=t.env,this.#d=t.notFoundHandler,this.#m=t.path,this.#p=t.matchResult)}get req(){return this.#e??=new Le(this.#t,this.#m,this.#p),this.#e}get event(){if(this.#n&&"respondWith"in this.#n)return this.#n;throw Error("This context has no FetchEvent")}get executionCtx(){if(this.#n)return this.#n;throw Error("This context has no ExecutionContext")}get res(){return this.#s||=V(null,{headers:this.#i??=new Headers})}set res(e){if(this.#s&&e){e=V(e.body,e);for(let[t,a]of this.#s.headers.entries())if(t!=="content-type")if(t==="set-cookie"){let n=this.#s.headers.getSetCookie();e.headers.delete("set-cookie");for(let s of n)e.headers.append("set-cookie",s)}else e.headers.set(t,a)}this.#s=e,this.finalized=!0}render=(...e)=>(this.#l??=t=>this.html(t),this.#l(...e));setLayout=e=>this.#c=e;getLayout=()=>this.#c;setRenderer=e=>{this.#l=e};header=(e,t,a)=>{this.finalized&&(this.#s=V(this.#s.body,this.#s));let n=this.#s?this.#s.headers:this.#i??=new Headers;t===void 0?n.delete(e):a?.append?n.append(e,t):n.set(e,t)};status=e=>{this.#r=e};set=(e,t)=>{this.#a??=new Map,this.#a.set(e,t)};get=e=>this.#a?this.#a.get(e):void 0;get var(){return this.#a?Object.fromEntries(this.#a):{}}#o(e,t,a){let n=this.#s?new Headers(this.#s.headers):this.#i;if(typeof t=="object"&&t.headers){n??=new Headers;for(let[r,o]of new Headers(t.headers))r==="set-cookie"?n.append(r,o):n.set(r,o)}if(a){if(!n){let r=0;for(let o in a)if(++r>1||typeof a[o]!="string"){n=new Headers;break}}if(n)for(let r in a){let o=a[r];if(typeof o=="string")n.set(r,o);else{n.delete(r);for(let i of o)n.append(r,i)}}}let s=typeof t=="number"?t:t?.status??this.#r;return V(e,{status:s,headers:n??a})}newResponse=(...e)=>this.#o(...e);body=(e,t,a)=>this.#o(e,t,a);text=(e,t,a)=>!this.#i&&!this.#r&&!t&&!a&&!this.finalized?new Response(e):this.#o(e,t,ue(pt,a));json=(e,t,a)=>this.#o(JSON.stringify(e),t,ue("application/json",a));html=(e,t,a)=>{let n=s=>this.#o(s,t,ue("text/html; charset=UTF-8",a));return typeof e=="object"?me(e,Me.Stringify,!1,{}).then(n):n(e)};redirect=(e,t)=>{let a=String(e);return this.header("Location",/[^\x00-\xFF]/.test(a)?encodeURI(a):a),this.newResponse(null,t??302)};notFound=()=>(this.#d??=()=>V(),this.#d(this))};var h="ALL",je="all",Ne=["get","post","put","delete","options","patch","query"],ae="Can not add a route since the matcher is already built.",ne=class extends Error{};var Ue="__COMPOSED_HANDLER";var mt=e=>e.text("404 Not Found",404),Fe=(e,t)=>{if("getResponse"in e){let a=e.getResponse();return t.newResponse(a.body,a)}return console.error(e),t.text("Internal Server Error",500)},$e=class qe{get;post;put;delete;options;patch;query;all;on;use;router;getPath;_basePath="/";#t="/";routes=[];constructor(t={}){[...Ne,je].forEach(r=>{this[r]=(o,...i)=>(typeof o=="string"?this.#t=o:this.#r(r,this.#t,o),i.forEach(l=>{this.#r(r,this.#t,l)}),this)}),this.on=(r,o,...i)=>{for(let l of[o].flat()){this.#t=l;for(let d of[r].flat())i.map(p=>{this.#r(d.toUpperCase(),this.#t,p)})}return this},this.use=(r,...o)=>(typeof r=="string"?this.#t=r:(this.#t="*",o.unshift(r)),o.forEach(i=>{this.#r(h,this.#t,i)}),this);let{strict:n,...s}=t;Object.assign(this,s),this.getPath=n??!0?t.getPath??pe:De}#e(){let t=new qe({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,t.#a=this.#a,t.routes=this.routes,t}#a=mt;errorHandler=Fe;route(t,a){let n=this.basePath(t);return a.routes.map(s=>{let r;a.errorHandler===Fe?r=s.handler:(r=async(o,i)=>(await le([],a.errorHandler)(o,()=>s.handler(o,i))).res,r[Ue]=s.handler),n.#r(s.method,s.path,r,s.basePath)}),this}basePath(t){let a=this.#e();return a._basePath=O(this._basePath,t),a}onError=t=>(this.errorHandler=t,this);notFound=t=>(this.#a=t,this);mount(t,a,n){let s,r;n&&(typeof n=="function"?r=n:(r=n.optionHandler,n.replaceRequest===!1?s=l=>l:s=n.replaceRequest));let o=r?l=>{let d=r(l);return Array.isArray(d)?d:[d]}:l=>{let d;try{d=l.executionCtx}catch{}return[l.env,d]};s||=(()=>{let l=O(this._basePath,t),d=l==="/"?0:l.length;return p=>{let c=new URL(p.url);return c.pathname=this.getPath(p).slice(d)||"/",new Request(c,p)}})();let i=async(l,d)=>{let p=await a(s(l.req.raw),...o(l));if(p)return p;await d()};return this.#r(h,O(t,"*"),i),this}#r(t,a,n,s){t=t.toUpperCase(),a=O(this._basePath,a);let r={basePath:s!==void 0?O(this._basePath,s):this._basePath,path:a,method:t,handler:n};this.router.add(t,a,[n,r]),this.routes.push(r)}#n(t,a){if(t instanceof Error)return this.errorHandler(t,a);throw t}#s(t,a,n,s){if(s==="HEAD")return(async()=>new Response(null,await this.#s(t,a,n,"GET")))();let r=this.getPath(t,{env:n}),o=this.router.match(s,r),i=new fe(t,{path:r,matchResult:o,env:n,executionCtx:a,notFoundHandler:this.#a});if(o[0].length===1){let d;try{d=o[0][0][0][0](i,async()=>{i.res=await this.#a(i)})}catch(p){return this.#n(p,i)}return d instanceof Promise?d.then(p=>p||(i.finalized?i.res:this.#a(i))).catch(p=>this.#n(p,i)):d??this.#a(i)}let l=le(o[0],this.errorHandler,this.#a);return(async()=>{try{let d=await l(i);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return this.#n(d,i)}})()}fetch=(t,...a)=>this.#s(t,a[1],a[0],t.method);request=(t,a,n,s)=>t instanceof Request?this.fetch(a?new Request(t,a):t,n,s):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${O("/",t)}`,a),n,s));fire=()=>{addEventListener("fetch",t=>{t.respondWith(this.#s(t.request,t,void 0,t.request.method))})}};var se=[];function ge(e,t){let a=this.buildAllMatchers(),n=((s,r)=>{let o=a[s]||a[h],i=o[2][r];if(i)return i;let l=r.match(o[0]);if(!l)return[[],se];let d=l.indexOf("",1);return[o[1][d],l]});return this.match=n,n(e,t)}var re="[^/]+",$=".*",U="(?:|/.*)",P=Symbol(),ze=new Set(".\\+*[^]$()");function ut(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1?1:e===$||e===U?t===U?-1:1:t===$||t===U?-1:e===re?1:t===re?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var He=class he{#t;#e;#a=Object.create(null);insert(t,a,n,s,r){let o=this;for(let i=0,l=t.length;i<l;i++){let d=t[i],p=d.length===1?d==="*"?i===l-1?["","",$]:["","",re]:null:d==="/*"?["","",U]:d.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),c;if(p){let m=p[1],u=p[2]||re;if(m&&p[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))||u.length===1&&ze.has(u)))throw P;if(c=o.#a[u],!c){if(u!==$&&u!==U){for(let b in o.#a)if((u.length>1||b.length>1)&&b!==$&&b!==U)throw P}c=o.#a[u]=new he}m!==""&&(c.#e??=s.varIndex++,n.push([m,c.#e]))}else if(c=o.#a[d],!c){for(let m in o.#a)if(m.length>1&&m!==$&&m!==U)throw P;c=o.#a[d]=new he}o=c}if(o.#t!==void 0)throw P;o.#t=r?-1:a}buildRegExpStr(){let a=Object.keys(this.#a).sort(ut).map(n=>{let s=this.#a[n],r=s.buildRegExpStr();return r===""?"":(typeof s.#e=="number"?`(${n})@${s.#e}`:ze.has(n)?`\\${n}`:n)+r}).filter(Boolean);return typeof this.#t=="number"&&this.#t!==-1&&a.unshift(`#${this.#t}`),a.length===0?"":a.length===1?a[0]:"(?:"+a.join("|")+")"}};var ve=class{#t={varIndex:0};#e=new He;#a=0;paths=Object.create(null);insert(e,t){if(t){this.#e.insert(e.split(""),0,[],this.#t,!0);return}let a=[],n=[],s=e;for(let o=0;;){let i=!1;if(s=s.replace(/\{[^}]+\}/g,l=>{let d=`@\\${o}`;return n[o]=[d,l],o++,i=!0,d}),!i)break}let r=s.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let o=n.length-1;o>=0;o--){let[i]=n[o];for(let l=r.length-1;l>=0;l--)if(r[l].indexOf(i)!==-1){r[l]=r[l].replace(i,n[o][1]);break}}this.#e.insert(r,this.#a,a,this.#t,!1),this.paths[e]=[this.#a++,a]}buildRegExp(){let e=this.#e.buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0,a=[],n=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(s,r,o)=>r!==void 0?(a[++t]=Number(r),"$()"):(o!==void 0&&(n[Number(o)]=++t),"")),[new RegExp(`^${e}`),a,n]}};var Ke=Object.create(null);function We(e){return Ke[e]??=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,a)=>a?`\\${a}`:"(?:|/.*)")}$`)}function ft(){Ke=Object.create(null)}function oe(e,t){if(e){for(let a of Object.keys(e).sort((n,s)=>s.length-n.length))if(We(a).test(t))return[...e[a]]}}var ie=class{name="RegExpRouter";#t;#e;#a;constructor(){this.#t={[h]:Object.create(null)},this.#e={[h]:Object.create(null)},this.#a={[h]:new ve}}#r(e,t){try{this.#a[e].insert(t,!/\*|\/:/.test(t))}catch(a){throw a===P?new ne(t):a}}add(e,t,a){let n=this.#t,s=this.#e;if(!n||!s)throw new Error(ae);n[e]||(this.#a[e]=new ve,[n,s].forEach(i=>{i[e]=Object.create(null),Object.keys(i[h]).forEach(l=>{i[e][l]=[...i[h][l]],this.#r(e,l)})})),t==="/*"&&(t="*");let r=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){let i=We(t);Object.keys(n).forEach(l=>{(e===h||e===l)&&!n[l][t]&&(this.#r(l,t),n[l][t]=oe(n[l],t)||oe(n[h],t)||[])}),Object.keys(n).forEach(l=>{(e===h||e===l)&&Object.keys(n[l]).forEach(d=>{i.test(d)&&n[l][d].push([a,r])})}),Object.keys(s).forEach(l=>{(e===h||e===l)&&Object.keys(s[l]).forEach(d=>i.test(d)&&s[l][d].push([a,r]))});return}let o=ee(t)||[t];for(let i=0,l=o.length;i<l;i++){let d=o[i];Object.keys(s).forEach(p=>{(e===h||e===p)&&(s[p][d]||(this.#r(p,d),s[p][d]=[...oe(n[p],d)||oe(n[h],d)||[]]),s[p][d].push([a,r-l+i+1]))})}}match=ge;buildAllMatchers(){let e=Object.create(null);return Object.keys(this.#e).concat(Object.keys(this.#t)).forEach(t=>{e[t]||=this.#n(t)}),this.#t=this.#e=this.#a=void 0,ft(),e}#n(e){let t=this.#t[e],a=this.#e[e],n=this.#a[e],s=Object.create(null),r=[];[t,a].forEach(p=>{for(let c in p){let m=p[c],u=n.paths[c];if(!u){s[c]=[m.map(([k])=>[k,Object.create(null)]),se];continue}let b=u[1];r[u[0]]=m.map(([k,R])=>{let g=Object.create(null);for(R-=1;R>=0;R--){let[B,H]=b[R];g[B]=H}return[k,g]})}});let[o,i,l]=n.buildRegExp();for(let p=0,c=r.length;p<c;p++)for(let m=0,u=r[p].length;m<u;m++){let b=r[p][m]?.[1];if(!b)continue;let k=Object.keys(b);for(let R=0,g=k.length;R<g;R++)b[k[R]]=l[b[k[R]]]}let d=[];for(let p in i)d[p]=r[i[p]];return[o,d,s]}};var ye=class{name="SmartRouter";#t=[];#e=[];constructor(e){this.#t=e.routers}add(e,t,a){if(!this.#e)throw new Error(ae);this.#e.push([e,t,a])}match(e,t){if(!this.#e)throw new Error("Fatal error");let a=this.#t,n=this.#e,s=a.length,r=0,o;for(;r<s;r++){let i=a[r];try{for(let l=0,d=n.length;l<d;l++)i.add(...n[l]);o=i.match(e,t)}catch(l){if(l instanceof ne)continue;throw l}this.match=i.match.bind(i),this.#t=[i],this.#e=void 0;break}if(r===s)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(this.#e||this.#t.length!==1)throw new Error("No active router has been determined yet.");return this.#t[0]}};var Y=Object.create(null),gt=e=>{for(let t in e)return!0;return!1},Ve=class Ye{#t;#e;#a;#r=0;#n=Y;constructor(t,a,n){if(this.#e=n||Object.create(null),this.#t=[],t&&a){let s=Object.create(null);s[t]={handler:a,possibleKeys:[],score:0},this.#t=[s]}this.#a=[]}insert(t,a,n){this.#r=++this.#r;let s=this,r=Se(a),o=[];for(let i=0,l=r.length;i<l;i++){let d=r[i],p=r[i+1],c=Ie(d,p),m=Array.isArray(c)?c[0]:d;if(m in s.#e){s=s.#e[m],c&&o.push(c[1]);continue}s.#e[m]=new Ye,c&&(s.#a.push(c),o.push(c[1])),s=s.#e[m]}return s.#t.push({[t]:{handler:n,possibleKeys:o.filter((i,l,d)=>d.indexOf(i)===l),score:this.#r}}),s}#s(t,a,n,s,r){for(let o=0,i=a.#t.length;o<i;o++){let l=a.#t[o],d=l[n]||l[h],p={};if(d!==void 0&&(d.params=Object.create(null),t.push(d),s!==Y||r&&r!==Y))for(let c=0,m=d.possibleKeys.length;c<m;c++){let u=d.possibleKeys[c],b=p[d.score];d.params[u]=r?.[u]&&!b?r[u]:s[u]??r?.[u],p[d.score]=!0}}}search(t,a){let n=[];this.#n=Y;let r=[this],o=ce(a),i=[],l=o.length,d=null;for(let p=0;p<l;p++){let c=o[p],m=p===l-1,u=[];for(let k=0,R=r.length;k<R;k++){let g=r[k],B=g.#e[c];B&&(B.#n=g.#n,m?(B.#e["*"]&&this.#s(n,B.#e["*"],t,g.#n),this.#s(n,B,t,g.#n)):u.push(B));for(let H=0,tt=g.#a.length;H<tt;H++){let Ee=g.#a[H],C=g.#n===Y?{}:{...g.#n};if(Ee==="*"){let N=g.#e["*"];N&&(this.#s(n,N,t,g.#n),N.#n=C,u.push(N));continue}let[at,xe,K]=Ee;if(!c&&!(K instanceof RegExp))continue;let A=g.#e[at];if(K instanceof RegExp){if(d===null){d=new Array(l);let Q=a[0]==="/"?1:0;for(let W=0;W<l;W++)d[W]=Q,Q+=o[W].length+1}let N=a.substring(d[p]),G=K.exec(N);if(G){if(C[xe]=G[0],this.#s(n,A,t,g.#n,C),G[0].length===N.length&&A.#e["*"]&&this.#s(n,A.#e["*"],t,g.#n,C),gt(A.#e)){A.#n=C;let Q=G[0].match(/\//g)?.length??0;(i[Q]||=[]).push(A)}continue}}(K===!0||K.test(c))&&(C[xe]=c,m?(this.#s(n,A,t,C,g.#n),A.#e["*"]&&this.#s(n,A.#e["*"],t,C,g.#n)):(A.#n=C,u.push(A)))}}let b=i.shift();r=b?u.concat(b):u}return n.length>1&&n.sort((p,c)=>p.score-c.score),[n.map(({handler:p,params:c})=>[p,c])]}};var be=class{name="TrieRouter";#t;constructor(){this.#t=new Ve}add(e,t,a){let n=ee(t);if(n){for(let s=0,r=n.length;s<r;s++)this.#t.insert(e,n[s],a);return}this.#t.insert(e,t,a)}match(e,t){return this.#t.search(e,t)}};var _=class extends $e{constructor(e={}){super(e),this.router=e.router??new ye({routers:[new ie,new be]})}};var Je=async(e,t)=>{if(e.req.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS, HEAD","Access-Control-Allow-Headers":"Content-Type, Authorization, X-Ygg-Token, Range","Access-Control-Expose-Headers":"Content-Range, Accept-Ranges, Content-Length, Content-Disposition, ETag","Access-Control-Max-Age":"86400"}});await t(),e.res.headers.set("Access-Control-Allow-Origin","*"),e.res.headers.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS, HEAD"),e.res.headers.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Ygg-Token, Range"),e.res.headers.set("Access-Control-Expose-Headers","Content-Range, Accept-Ranges, Content-Length, Content-Disposition, ETag")};var f=class{static generateFileKey(t,a){let n=t.replace(/[^a-zA-Z0-9_-]/g,"")||"general",s=Date.now(),r=Math.random().toString(36).substring(2,8),o=a.replace(/[^a-zA-Z0-9._-]/g,"_");return`${n}/${s}_${r}_${o}`}static async serveFileWithRange(t,a,n,s,r){let o;if(s&&s.startsWith("bytes=")){let c=s.substring(6).trim().split("-");if(c.length===2){if(c[0]!==""&&c[1]!==""){let m=parseInt(c[0],10),u=parseInt(c[1],10);!isNaN(m)&&!isNaN(u)&&u>=m&&(o={offset:m,length:u-m+1})}else if(c[0]!==""&&c[1]===""){let m=parseInt(c[0],10);isNaN(m)||(o={offset:m})}else if(c[0]===""&&c[1]!==""){let m=parseInt(c[1],10);isNaN(m)||(o={suffix:m})}}}let i=await t.get(a,o?{range:o}:void 0);if(!i)return new Response(JSON.stringify({code:404,message:"File object not found in R2 storage"}),{status:404,headers:{"Content-Type":"application/json"}});let l=new Headers;i.writeHttpMetadata(l),l.set("ETag",i.httpEtag),l.set("Accept-Ranges","bytes");let d=encodeURIComponent(n).replace(/['()]/g,escape);if(l.set("Content-Disposition",`attachment; filename="${n}"; filename*=UTF-8''${d}`),r?l.set("Content-Type",r):l.has("Content-Type")||(n.endsWith(".apk")?l.set("Content-Type","application/vnd.android.package-archive"):l.set("Content-Type","application/octet-stream")),i.range){let p=0,c=i.size;if("offset"in i.range&&i.range.offset!==void 0)p=i.range.offset,c=i.range.length!==void 0?i.range.length:i.size-p;else if("suffix"in i.range&&i.range.suffix!==void 0){let u=i.range.suffix;p=Math.max(0,i.size-u),c=i.size-p}let m=p+c-1;return l.set("Content-Range",`bytes ${p}-${m}/${i.size}`),l.set("Content-Length",`${c}`),new Response(i.body,{status:206,headers:l})}else return l.set("Content-Length",`${i.size}`),new Response(i.body,{status:200,headers:l})}static async putObject(t,a,n,s){return await t.put(a,n,s)}static async deleteObject(t,a){try{await t.delete(a)}catch(n){console.warn(`[StorageService] Failed to delete R2 object ${a}:`,n)}}static async createMultipartUpload(t,a,n){return await t.createMultipartUpload(a,{httpMetadata:n})}static resumeMultipartUpload(t,a,n){return t.resumeMultipartUpload(a,n)}};var w=class{static async listApps(t){let{results:a}=await t.prepare(`
      SELECT 
        a.*,
        (SELECT COUNT(1) FROM app_versions v WHERE v.app_id = a.app_id) AS version_count,
        (SELECT SUM(download_count) FROM app_versions v WHERE v.app_id = a.app_id) AS total_downloads,
        (SELECT version_name FROM app_versions v WHERE v.app_id = a.app_id AND v.is_published = 1 ORDER BY v.version_code DESC LIMIT 1) AS latest_version_name,
        (SELECT version_code FROM app_versions v WHERE v.app_id = a.app_id AND v.is_published = 1 ORDER BY v.version_code DESC LIMIT 1) AS latest_version_code
      FROM apps a
      ORDER BY a.created_at DESC
    `).all();return a||[]}static async getAppByAppId(t,a){return await t.prepare("SELECT * FROM apps WHERE app_id = ?").bind(a).first()||null}static async createApp(t,a){let n="app_"+Date.now().toString(36)+Math.random().toString(36).substring(2,6),s=new Date().toISOString();return await t.prepare(`
      INSERT INTO apps (id, app_id, name, icon_url, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(n,a.app_id.trim(),a.name.trim(),a.icon_url?.trim()||null,a.description?.trim()||null,s,s).run(),{id:n,app_id:a.app_id.trim(),name:a.name.trim(),icon_url:a.icon_url||null,description:a.description||null,created_at:s,updated_at:s}}static async updateApp(t,a,n){let s=new Date().toISOString();await t.prepare(`
      UPDATE apps 
      SET name = COALESCE(?, name),
          icon_url = COALESCE(?, icon_url),
          description = COALESCE(?, description),
          updated_at = ?
      WHERE app_id = ?
    `).bind(n.name?.trim()||null,n.icon_url?.trim()||null,n.description?.trim()||null,s,a).run()}static async deleteApp(t,a,n){let{results:s}=await t.prepare("SELECT file_key FROM app_versions WHERE app_id = ?").bind(n).all();if(s&&s.length>0)for(let r of s)r.file_key&&await f.deleteObject(a,r.file_key);await t.prepare("DELETE FROM app_versions WHERE app_id = ?").bind(n).run(),await t.prepare("DELETE FROM apps WHERE app_id = ?").bind(n).run()}static async listVersions(t,a){let{results:n}=await t.prepare(`
      SELECT * FROM app_versions 
      WHERE app_id = ? 
      ORDER BY version_code DESC, created_at DESC
    `).bind(a).all();return n||[]}static async createVersion(t,a){let n="ver_"+Date.now().toString(36)+Math.random().toString(36).substring(2,6),s=new Date().toISOString(),r=a.channel?.trim()||"default",o=a.min_version_code!==void 0?a.min_version_code:0,i=a.is_force_update?1:0,l=a.is_published!==void 0?a.is_published:1;return await t.prepare(`
      INSERT INTO app_versions (
        id, app_id, version_code, version_name, min_version_code, channel, 
        changelog, file_key, file_name, file_size, file_md5, file_sha256, 
        is_force_update, is_published, download_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).bind(n,a.app_id,a.version_code,a.version_name.trim(),o,r,a.changelog?.trim()||"",a.file_key,a.file_name,a.file_size,a.file_md5||null,a.file_sha256||null,i,l,s).run(),{id:n,app_id:a.app_id,version_code:a.version_code,version_name:a.version_name.trim(),min_version_code:o,channel:r,changelog:a.changelog||"",file_key:a.file_key,file_name:a.file_name,file_size:a.file_size,file_md5:a.file_md5||null,file_sha256:a.file_sha256||null,is_force_update:i,is_published:l,download_count:0,created_at:s}}static async updateVersion(t,a,n){await t.prepare(`
      UPDATE app_versions 
      SET version_name = COALESCE(?, version_name),
          min_version_code = COALESCE(?, min_version_code),
          channel = COALESCE(?, channel),
          changelog = COALESCE(?, changelog),
          is_force_update = COALESCE(?, is_force_update),
          is_published = COALESCE(?, is_published)
      WHERE id = ?
    `).bind(n.version_name?.trim()||null,n.min_version_code!==void 0?n.min_version_code:null,n.channel?.trim()||null,n.changelog!==void 0?n.changelog:null,n.is_force_update!==void 0?n.is_force_update:null,n.is_published!==void 0?n.is_published:null,a).run()}static async deleteVersion(t,a,n){let s=await t.prepare("SELECT file_key FROM app_versions WHERE id = ?").bind(n).first();s&&s.file_key&&await f.deleteObject(a,s.file_key),await t.prepare("DELETE FROM app_versions WHERE id = ?").bind(n).run()}static async getLatestPublishedVersion(t,a,n="default"){let s=await t.prepare(`
      SELECT * FROM app_versions 
      WHERE app_id = ? AND channel = ? AND is_published = 1 
      ORDER BY version_code DESC, created_at DESC 
      LIMIT 1
    `).bind(a,n).first();return!s&&n!=="default"&&(s=await t.prepare(`
        SELECT * FROM app_versions 
        WHERE app_id = ? AND channel = 'default' AND is_published = 1 
        ORDER BY version_code DESC, created_at DESC 
        LIMIT 1
      `).bind(a).first()),s||null}static async getVersionForDownload(t,a,n,s="default"){if(n!==void 0&&!isNaN(n)&&n>0){let r=await t.prepare(`
        SELECT * FROM app_versions 
        WHERE app_id = ? AND version_code = ? AND is_published = 1 
        ORDER BY created_at DESC LIMIT 1
      `).bind(a,n).first();if(r)return r}return await this.getLatestPublishedVersion(t,a,s)}static async incrementDownloadCount(t,a){try{await t.prepare("UPDATE app_versions SET download_count = download_count + 1 WHERE id = ?").bind(a).run()}catch(n){console.warn("[AppService] Failed to increment download count:",n)}}static async checkAppUpdate(t,a,n=0,s="default",r){let o=await this.getAppByAppId(t,a);if(!o)return null;let i=await this.getLatestPublishedVersion(t,a,s);if(!i)return null;let l=i.version_code>n,d=!1;l&&(i.is_force_update===1||i.min_version_code>0&&n<i.min_version_code)&&(d=!0);let p=`${r}/api/v1/app/download?app_id=${encodeURIComponent(a)}&version_code=${i.version_code}&channel=${encodeURIComponent(i.channel)}`;return{has_update:l,is_force:d,app_id:o.app_id,app_name:o.name,icon_url:o.icon_url,current_version_code:n>0?n:void 0,latest_version_code:i.version_code,latest_version_name:i.version_name,min_version_code:i.min_version_code,channel:i.channel,changelog:i.changelog||"",download_url:p,file_name:i.file_name,file_size:i.file_size,file_md5:i.file_md5,file_sha256:i.file_sha256,release_time:i.created_at}}};var E={APP_NAME:"Yggdrasil",DEFAULT_ADMIN_PASSWORD:"admin",DEFAULT_JWT_SECRET:"ygg_secret_jwt_sign_key_default_2026",JWT_EXPIRES_IN_SECONDS:604800,DEFAULT_API_TOKEN:"ygg_secret_token_default_2026",TOKEN_HEADER_NAME:"x-ygg-token",TOKEN_QUERY_NAME:"token",COOKIE_NAME:"ygg_admin_session"},v={API_TOKEN_ENABLED:"api_token_enabled",API_FIXED_TOKEN:"api_fixed_token",APP_CHECK_REQUIRE_TOKEN:"app_check_require_token",APP_DOWNLOAD_REQUIRE_TOKEN:"app_download_require_token",FILE_DOWNLOAD_REQUIRE_TOKEN:"file_download_require_token",SITE_TITLE:"site_title",AUTO_CLEANUP_ENABLED:"auto_cleanup_enabled",AUTO_CLEANUP_DAYS:"auto_cleanup_days",AUTO_CLEANUP_KEEP_LATEST:"auto_cleanup_keep_latest"};var I=class{static async getSetting(t,a,n=""){try{let s=await t.prepare("SELECT value FROM system_settings WHERE key = ?").bind(a).first();return s?s.value:n}catch(s){return console.warn(`[SettingService] Failed to read setting ${a}:`,s),n}}static async getAllSettings(t){let a={[v.API_TOKEN_ENABLED]:"false",[v.API_FIXED_TOKEN]:E.DEFAULT_API_TOKEN,[v.APP_CHECK_REQUIRE_TOKEN]:"false",[v.APP_DOWNLOAD_REQUIRE_TOKEN]:"false",[v.FILE_DOWNLOAD_REQUIRE_TOKEN]:"false",[v.SITE_TITLE]:"Yggdrasil - \u5E94\u7528\u4E0E\u6587\u4EF6\u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3",[v.AUTO_CLEANUP_ENABLED]:"false",[v.AUTO_CLEANUP_DAYS]:"90",[v.AUTO_CLEANUP_KEEP_LATEST]:"3"};try{let{results:n}=await t.prepare("SELECT key, value FROM system_settings").all();if(n&&n.length>0)for(let s of n)a[s.key]=s.value}catch(n){console.warn("[SettingService] Failed to query system_settings table:",n)}return a}static async setSetting(t,a,n,s){let r=new Date().toISOString();await t.prepare(`
      INSERT INTO system_settings (key, value, description, updated_at) 
      VALUES (?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(a,n,s||null,r).run()}static async updateSettings(t,a){let n=Object.entries(a).map(([s,r])=>{let o=new Date().toISOString();return t.prepare(`
        INSERT INTO system_settings (key, value, updated_at) 
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind(s,String(r),o)});n.length>0&&await t.batch(n)}static async checkAuthRequirement(t,a){let n=await this.getAllSettings(t),s=n[v.API_TOKEN_ENABLED]==="true",r=n[v.API_FIXED_TOKEN]||E.DEFAULT_API_TOKEN;if(!s)return{required:!1,fixedToken:r};let o="";return a==="app_check"?o=v.APP_CHECK_REQUIRE_TOKEN:a==="app_download"?o=v.APP_DOWNLOAD_REQUIRE_TOKEN:a==="file_download"&&(o=v.FILE_DOWNLOAD_REQUIRE_TOKEN),{required:n[o]==="true",fixedToken:r}}};function D(e){return async(t,a)=>{let{required:n,fixedToken:s}=await I.checkAuthRequirement(t.env.DB,e);if(!n)return await a();let r=t.req.header(E.TOKEN_HEADER_NAME);if(!r){let o=t.req.header("authorization");o&&o.startsWith("Bearer ")&&(r=o.substring(7).trim())}if(r||(r=t.req.query(E.TOKEN_QUERY_NAME)),!r||r.trim()!==s.trim())return t.json({code:401,message:"Unauthorized: Invalid or missing API Token. Please provide valid token in X-Ygg-Token header or ?token= query parameter."},401);await a()}}var J=new _,Ge=async e=>{let t=e.req.query("app_id")||e.req.query("appId")||e.req.query("package_name");if(!t)return e.json({code:400,message:"Missing required query parameter: app_id (e.g. ?app_id=com.example.app)"},400);let a=e.req.query("version_code")||e.req.query("versionCode")||"0",n=parseInt(a,10)||0,s=e.req.query("channel")||"default",r=new URL(e.req.url).origin,o=await w.checkAppUpdate(e.env.DB,t,n,s,r);return o?e.json({code:0,message:"success",data:o}):e.json({code:404,message:`App '${t}' or published version not found for channel '${s}'`},404)};J.get("/api/v1/app/latest",D("app_check"),Ge);J.get("/api/v1/version/check",D("app_check"),Ge);J.get("/api/v1/app/download",D("app_download"),async e=>{let t=e.req.query("app_id")||e.req.query("appId");if(!t)return e.json({code:400,message:"Missing required query parameter: app_id"},400);let a=e.req.query("version_code")||e.req.query("versionCode"),n=a?parseInt(a,10):void 0,s=e.req.query("channel")||"default",r=await w.getVersionForDownload(e.env.DB,t,n,s);if(!r)return e.json({code:404,message:"Requested APK version not found or not published"},404);e.executionCtx.waitUntil(w.incrementDownloadCount(e.env.DB,r.id));let o=e.req.header("range");return await f.serveFileWithRange(e.env.BUCKET,r.file_key,r.file_name,o,"application/vnd.android.package-archive")});var y=class{static async listFiles(t,a){let n="SELECT * FROM files WHERE 1=1",s="SELECT COUNT(1) as total FROM files WHERE 1=1",r=[],o=[];if(a?.category&&a.category!=="all"&&(n+=" AND category = ?",s+=" AND category = ?",r.push(a.category),o.push(a.category)),a?.search){let c=`%${a.search}%`;n+=" AND (name LIKE ? OR file_name LIKE ? OR alias LIKE ?)",s+=" AND (name LIKE ? OR file_name LIKE ? OR alias LIKE ?)",r.push(c,c,c),o.push(c,c,c)}n+=" ORDER BY created_at DESC";let i=a?.limit||50,l=a?.offset||0;n+=" LIMIT ? OFFSET ?",r.push(i,l);let d=await t.prepare(s).bind(...o).first(),{results:p}=await t.prepare(n).bind(...r).all();return{files:p||[],total:d?.total||0}}static async getFileById(t,a){return await t.prepare("SELECT * FROM files WHERE id = ?").bind(a).first()||null}static async getFileByAlias(t,a){return await t.prepare("SELECT * FROM files WHERE alias = ?").bind(a).first()||null}static async createFile(t,a){let n="f_"+Date.now().toString(36)+Math.random().toString(36).substring(2,6),s=new Date().toISOString(),r=a.category?.trim()||"general",o=a.is_public!==void 0?a.is_public:1,i=a.alias?.trim()||null;return await t.prepare(`
      INSERT INTO files (
        id, name, category, file_key, file_name, file_size, 
        mime_type, file_md5, alias, is_public, download_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).bind(n,a.name.trim(),r,a.file_key,a.file_name,a.file_size,a.mime_type||null,a.file_md5||null,i,o,s).run(),{id:n,name:a.name.trim(),category:r,file_key:a.file_key,file_name:a.file_name,file_size:a.file_size,mime_type:a.mime_type||null,file_md5:a.file_md5||null,alias:i,is_public:o,download_count:0,created_at:s}}static async updateFile(t,a,n){await t.prepare(`
      UPDATE files 
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          alias = COALESCE(?, alias),
          is_public = COALESCE(?, is_public)
      WHERE id = ?
    `).bind(n.name?.trim()||null,n.category?.trim()||null,n.alias!==void 0&&n.alias?.trim()||null,n.is_public!==void 0?n.is_public:null,a).run()}static async deleteFile(t,a,n){let s=await this.getFileById(t,n);s&&s.file_key&&await f.deleteObject(a,s.file_key),await t.prepare("DELETE FROM files WHERE id = ?").bind(n).run()}static async incrementDownloadCount(t,a){try{await t.prepare("UPDATE files SET download_count = download_count + 1 WHERE id = ?").bind(a).run()}catch(n){console.warn("[FileService] Failed to increment download count:",n)}}static async getCategories(t){let{results:a}=await t.prepare("SELECT DISTINCT category FROM files WHERE category IS NOT NULL").all();return(a||[]).map(n=>n.category).filter(Boolean)}};var q=new _;q.get("/api/v1/files/check",D("file_download"),async e=>{let t=e.req.query("alias"),a=e.req.query("id"),n=null;if(t)n=await y.getFileByAlias(e.env.DB,t);else if(a)n=await y.getFileById(e.env.DB,a);else return e.json({code:400,message:"Missing alias or id query parameter"},400);if(!n)return e.json({code:404,message:"File not found"},404);let s=new URL(e.req.url).origin,r=n.alias?`${s}/f/${n.alias}`:`${s}/api/v1/files/${n.id}/download`;return e.json({code:0,message:"success",data:{id:n.id,name:n.name,category:n.category,file_name:n.file_name,file_size:n.file_size,mime_type:n.mime_type,file_md5:n.file_md5,alias:n.alias,download_count:n.download_count,download_url:r,created_at:n.created_at}})});q.get("/api/v1/files/:id/check",D("file_download"),async e=>{let t=e.req.param("id"),a=await y.getFileById(e.env.DB,t);if(!a)return e.json({code:404,message:"File not found"},404);let n=new URL(e.req.url).origin,s=a.alias?`${n}/f/${a.alias}`:`${n}/api/v1/files/${a.id}/download`;return e.json({code:0,message:"success",data:{id:a.id,name:a.name,category:a.category,file_name:a.file_name,file_size:a.file_size,mime_type:a.mime_type,file_md5:a.file_md5,alias:a.alias,download_count:a.download_count,download_url:s,created_at:a.created_at}})});q.get("/api/v1/files/:id/download",D("file_download"),async e=>{let t=e.req.param("id"),a=await y.getFileById(e.env.DB,t);if(!a)return e.json({code:404,message:"File not found"},404);e.executionCtx.waitUntil(y.incrementDownloadCount(e.env.DB,a.id));let n=e.req.header("range");return await f.serveFileWithRange(e.env.BUCKET,a.file_key,a.file_name,n,a.mime_type)});q.get("/f/:alias",D("file_download"),async e=>{let t=e.req.param("alias"),a=await y.getFileByAlias(e.env.DB,t);if(!a)return e.json({code:404,message:"File not found by alias"},404);e.executionCtx.waitUntil(y.incrementDownloadCount(e.env.DB,a.id));let n=e.req.header("range");return await f.serveFileWithRange(e.env.BUCKET,a.file_key,a.file_name,n,a.mime_type)});function _e(e){return btoa(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Qe(e){for(e=e.replace(/-/g,"+").replace(/_/g,"/");e.length%4;)e+="=";return atob(e)}async function Xe(e){let t=new TextEncoder;return await crypto.subtle.importKey("raw",t.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign","verify"])}async function Ze(e,t){let n=_e(JSON.stringify({alg:"HS256",typ:"JWT"})),s=_e(JSON.stringify(e)),r=`${n}.${s}`,o=await Xe(t),i=await crypto.subtle.sign("HMAC",o,new TextEncoder().encode(r)),l=String.fromCharCode(...new Uint8Array(i)),d=_e(l);return`${r}.${d}`}async function ht(e,t){try{let a=e.split(".");if(a.length!==3)return null;let[n,s,r]=a,o=`${n}.${s}`,i=await Xe(t),l=Qe(r),d=new Uint8Array(l.length);for(let u=0;u<l.length;u++)d[u]=l.charCodeAt(u);if(!await crypto.subtle.verify("HMAC",i,d,new TextEncoder().encode(o)))return null;let c=Qe(s),m=JSON.parse(c);return m.exp&&Date.now()/1e3>m.exp?null:m}catch{return null}}var S=async(e,t)=>{let a=e.req.header("authorization"),n="";if(a&&a.startsWith("Bearer "))n=a.substring(7).trim();else{let o=e.req.header("cookie");if(o){let i=o.match(new RegExp(`(?:^|;\\s*)${E.COOKIE_NAME}=([^;]+)`));i&&(n=i[1])}}if(!n)return e.json({code:401,message:"Unauthorized: Admin authentication token required"},401);let s=e.env.JWT_SECRET||E.DEFAULT_JWT_SECRET,r=await ht(n,s);if(!r||r.role!=="admin")return e.json({code:401,message:"Unauthorized: Invalid or expired session"},401);e.set("adminUser",r),await t()};var z=new _;z.post("/api/admin/login",async e=>{try{let t=await e.req.json(),a=e.env.ADMIN_PASSWORD||E.DEFAULT_ADMIN_PASSWORD;if(!t.password||t.password!==a)return e.json({code:401,message:"Invalid admin password"},401);let n=e.env.JWT_SECRET||E.DEFAULT_JWT_SECRET,s=Math.floor(Date.now()/1e3),r={sub:"admin",role:"admin",iat:s,exp:s+E.JWT_EXPIRES_IN_SECONDS},o=await Ze(r,n),i=new URL(e.req.url).protocol==="https:",l=[`${E.COOKIE_NAME}=${o}`,"Path=/",`Max-Age=${E.JWT_EXPIRES_IN_SECONDS}`,"HttpOnly","SameSite=Lax"];i&&l.push("Secure");let d=e.json({code:0,message:"Login successful",data:{token:o,expiresIn:E.JWT_EXPIRES_IN_SECONDS}});return d.headers.set("Set-Cookie",l.join("; ")),d}catch(t){return e.json({code:400,message:"Bad request: "+(t.message||"Unknown error")},400)}});z.post("/api/admin/logout",async e=>{let t=e.json({code:0,message:"Logged out successfully"});return t.headers.set("Set-Cookie",`${E.COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`),t});z.get("/api/admin/me",S,async e=>e.json({code:0,message:"Authenticated",data:{user:"admin",role:"admin"}}));z.get("/api/admin/stats",S,async e=>{try{let t=await e.env.DB.prepare(`
      SELECT 
        (SELECT COUNT(1) FROM apps) AS total_apps,
        (SELECT COUNT(1) FROM app_versions) AS total_versions,
        (SELECT COALESCE(SUM(file_size), 0) FROM app_versions) AS app_storage_bytes,
        (SELECT COALESCE(SUM(download_count), 0) FROM app_versions) AS app_downloads
    `).first(),a=await e.env.DB.prepare(`
      SELECT 
        (SELECT COUNT(1) FROM files) AS total_files,
        (SELECT COALESCE(SUM(file_size), 0) FROM files) AS file_storage_bytes,
        (SELECT COALESCE(SUM(download_count), 0) FROM files) AS file_downloads
    `).first(),n=t?.total_apps||0,s=t?.total_versions||0,r=a?.total_files||0,o=(t?.app_storage_bytes||0)+(a?.file_storage_bytes||0),i=(t?.app_downloads||0)+(a?.file_downloads||0);return e.json({code:0,message:"success",data:{totalApps:n,totalVersions:s,totalFiles:r,totalStorageBytes:o,totalDownloads:i}})}catch(t){return e.json({code:500,message:"Failed to query system stats: "+t.message},500)}});var T=new _;T.use("/api/admin/*",S);T.get("/api/admin/apps",async e=>{let t=await w.listApps(e.env.DB);return e.json({code:0,message:"success",data:t})});T.get("/api/admin/apps/:appId",async e=>{let t=e.req.param("appId"),a=await w.getAppByAppId(e.env.DB,t);return a?e.json({code:0,message:"success",data:a}):e.json({code:404,message:"App not found"},404)});T.post("/api/admin/apps",async e=>{try{let t=await e.req.json();if(!t.app_id||!t.name)return e.json({code:400,message:"app_id and name are required"},400);if(await w.getAppByAppId(e.env.DB,t.app_id))return e.json({code:409,message:`App with app_id '${t.app_id}' already exists`},409);let n=await w.createApp(e.env.DB,t);return e.json({code:0,message:"App created successfully",data:n})}catch(t){return e.json({code:500,message:"Failed to create app: "+t.message},500)}});T.put("/api/admin/apps/:appId",async e=>{try{let t=e.req.param("appId"),a=await e.req.json();return await w.updateApp(e.env.DB,t,a),e.json({code:0,message:"App updated successfully"})}catch(t){return e.json({code:500,message:"Failed to update app: "+t.message},500)}});T.delete("/api/admin/apps/:appId",async e=>{try{let t=e.req.param("appId");return await w.deleteApp(e.env.DB,e.env.BUCKET,t),e.json({code:0,message:"App and associated versions deleted successfully"})}catch(t){return e.json({code:500,message:"Failed to delete app: "+t.message},500)}});T.get("/api/admin/apps/:appId/versions",async e=>{let t=e.req.param("appId"),a=await w.listVersions(e.env.DB,t);return e.json({code:0,message:"success",data:a})});T.post("/api/admin/apps/:appId/versions",async e=>{try{let t=e.req.param("appId"),a=await e.req.json();if(!a.version_code||!a.version_name||!a.file_key||!a.file_name||!a.file_size)return e.json({code:400,message:"Missing required version fields (version_code, version_name, file_key, file_name, file_size)"},400);let n=await w.createVersion(e.env.DB,{...a,app_id:t});return e.json({code:0,message:"Version published successfully",data:n})}catch(t){return e.json({code:500,message:"Failed to publish version: "+t.message},500)}});T.put("/api/admin/versions/:id",async e=>{try{let t=e.req.param("id"),a=await e.req.json();return await w.updateVersion(e.env.DB,t,a),e.json({code:0,message:"Version updated successfully"})}catch(t){return e.json({code:500,message:"Failed to update version: "+t.message},500)}});T.delete("/api/admin/versions/:id",async e=>{try{let t=e.req.param("id");return await w.deleteVersion(e.env.DB,e.env.BUCKET,t),e.json({code:0,message:"Version deleted successfully"})}catch(t){return e.json({code:500,message:"Failed to delete version: "+t.message},500)}});var L=new _;L.use("/api/admin/*",S);L.get("/api/admin/files",async e=>{let t=e.req.query("category"),a=e.req.query("search"),n=parseInt(e.req.query("limit")||"50",10),s=parseInt(e.req.query("offset")||"0",10),r=await y.listFiles(e.env.DB,{category:t,search:a,limit:n,offset:s});return e.json({code:0,message:"success",data:r})});L.get("/api/admin/categories",async e=>{let t=await y.getCategories(e.env.DB);return e.json({code:0,message:"success",data:t})});L.post("/api/admin/files",async e=>{try{let t=await e.req.json();if(!t.name||!t.file_key||!t.file_name||!t.file_size)return e.json({code:400,message:"Missing required file fields (name, file_key, file_name, file_size)"},400);if(t.alias&&await y.getFileByAlias(e.env.DB,t.alias))return e.json({code:409,message:`File alias '${t.alias}' is already in use`},409);let a=await y.createFile(e.env.DB,t);return e.json({code:0,message:"File created successfully",data:a})}catch(t){return e.json({code:500,message:"Failed to create file: "+t.message},500)}});L.put("/api/admin/files/:id",async e=>{try{let t=e.req.param("id"),a=await e.req.json();if(a.alias){let n=await y.getFileByAlias(e.env.DB,a.alias);if(n&&n.id!==t)return e.json({code:409,message:`File alias '${a.alias}' is already in use`},409)}return await y.updateFile(e.env.DB,t,a),e.json({code:0,message:"File updated successfully"})}catch(t){return e.json({code:500,message:"Failed to update file: "+t.message},500)}});L.delete("/api/admin/files/:id",async e=>{try{let t=e.req.param("id");return await y.deleteFile(e.env.DB,e.env.BUCKET,t),e.json({code:0,message:"File deleted successfully"})}catch(t){return e.json({code:500,message:"Failed to delete file: "+t.message},500)}});var M=new _;M.use("/api/admin/*",S);M.post("/api/admin/upload/direct",async e=>{try{let t=await e.req.formData(),a=t.get("file"),n=t.get("category")||"apk",s=t.get("md5")||"";if(!a||typeof a=="string")return e.json({code:400,message:"No file provided in form-data (field: file)"},400);let r=a,o=r.name||"upload.bin",i=r.size,l=r.type||(o.endsWith(".apk")?"application/vnd.android.package-archive":"application/octet-stream"),d=f.generateFileKey(n,o),p=await r.arrayBuffer(),c=s;if(!c){let u=await crypto.subtle.digest("MD5",p).catch(()=>null);u&&(c=Array.from(new Uint8Array(u)).map(b=>b.toString(16).padStart(2,"0")).join(""))}let m=await f.putObject(e.env.BUCKET,d,p,{httpMetadata:{contentType:l},customMetadata:{originalName:o,md5:c||""}});return e.json({code:0,message:"Upload successful",data:{file_key:d,file_name:o,file_size:i,mime_type:l,file_md5:c||m.httpEtag.replace(/"/g,"")}})}catch(t){return e.json({code:500,message:"Upload failed: "+t.message},500)}});M.post("/api/admin/upload/multipart/init",async e=>{try{let t=await e.req.json();if(!t.fileName)return e.json({code:400,message:"fileName is required"},400);let a=t.category||"apk",n=t.mimeType||(t.fileName.endsWith(".apk")?"application/vnd.android.package-archive":"application/octet-stream"),s=f.generateFileKey(a,t.fileName),r=await f.createMultipartUpload(e.env.BUCKET,s,{contentType:n});return e.json({code:0,message:"Multipart upload initialized",data:{upload_id:r.uploadId,file_key:s,file_name:t.fileName}})}catch(t){return e.json({code:500,message:"Failed to init multipart upload: "+t.message},500)}});M.put("/api/admin/upload/multipart/part",async e=>{try{let t=e.req.query("uploadId")||e.req.query("upload_id"),a=e.req.query("fileKey")||e.req.query("file_key"),n=e.req.query("partNumber")||e.req.query("part_number");if(!t||!a||!n)return e.json({code:400,message:"Missing uploadId, fileKey or partNumber query parameter"},400);let s=parseInt(n,10),r=await e.req.arrayBuffer(),i=await f.resumeMultipartUpload(e.env.BUCKET,a,t).uploadPart(s,r);return e.json({code:0,message:"Part uploaded",data:{partNumber:i.partNumber,etag:i.etag}})}catch(t){return e.json({code:500,message:"Failed to upload part: "+t.message},500)}});M.post("/api/admin/upload/multipart/complete",async e=>{try{let t=await e.req.json();if(!t.upload_id||!t.file_key||!t.parts||t.parts.length===0)return e.json({code:400,message:"Missing upload_id, file_key or parts array"},400);let a=[...t.parts].sort((r,o)=>r.partNumber-o.partNumber),s=await f.resumeMultipartUpload(e.env.BUCKET,t.file_key,t.upload_id).complete(a);return e.json({code:0,message:"Multipart upload completed",data:{file_key:t.file_key,file_name:t.file_name,file_size:t.file_size||s.size,file_md5:t.file_md5||s.httpEtag.replace(/"/g,"")}})}catch(t){return e.json({code:500,message:"Failed to complete multipart upload: "+t.message},500)}});M.post("/api/admin/upload/multipart/abort",async e=>{try{let t=await e.req.json();return!t.upload_id||!t.file_key?e.json({code:400,message:"Missing upload_id or file_key"},400):(await f.resumeMultipartUpload(e.env.BUCKET,t.file_key,t.upload_id).abort(),e.json({code:0,message:"Multipart upload aborted successfully"}))}catch(t){return e.json({code:500,message:"Failed to abort multipart upload: "+t.message},500)}});var F=class{static async runCleanup(t,a){let n=await I.getAllSettings(t);if(!(n[v.AUTO_CLEANUP_ENABLED]==="true"))return{enabled:!1,deleted:0,freedBytes:0,details:[]};let r=parseInt(n[v.AUTO_CLEANUP_DAYS]||"90",10)||90,o=parseInt(n[v.AUTO_CLEANUP_KEEP_LATEST]||"3",10)||3;return await this.executeCleanup(t,a,r,o)}static async forceCleanup(t,a,n,s){return await this.executeCleanup(t,a,n,s)}static async executeCleanup(t,a,n,s){let r=new Date(Date.now()-n*24*60*60*1e3).toISOString(),o={enabled:!0,deleted:0,freedBytes:0,details:[]};try{let{results:i}=await t.prepare("SELECT DISTINCT app_id, channel FROM app_versions").all();if(!i||i.length===0)return o;for(let l of i){let{results:d}=await t.prepare(`SELECT id FROM app_versions 
           WHERE app_id = ? AND channel = ? 
           ORDER BY version_code DESC, created_at DESC 
           LIMIT ?`).bind(l.app_id,l.channel,s).all(),p=new Set((d||[]).map(m=>m.id)),{results:c}=await t.prepare(`SELECT id, app_id, version_name, version_code, channel, file_key, file_size, created_at 
           FROM app_versions 
           WHERE app_id = ? AND channel = ? AND created_at < ?
           ORDER BY version_code ASC`).bind(l.app_id,l.channel,r).all();if(!(!c||c.length===0)){for(let m of c)if(!p.has(m.id)){if(m.file_key)try{await f.deleteObject(a,m.file_key)}catch(u){console.warn(`[CleanupService] Failed to delete R2 object ${m.file_key}:`,u)}await t.prepare("DELETE FROM app_versions WHERE id = ?").bind(m.id).run(),o.deleted++,o.freedBytes+=m.file_size||0,o.details.push({app_id:m.app_id,version_name:m.version_name,version_code:m.version_code,channel:m.channel,file_size:m.file_size||0,created_at:m.created_at||""})}}}}catch(i){console.error("[CleanupService] Cleanup execution error:",i)}return o}};var j=new _;j.use("/api/admin/*",S);j.get("/api/admin/settings",async e=>{let t=await I.getAllSettings(e.env.DB);return e.json({code:0,message:"success",data:t})});j.put("/api/admin/settings",async e=>{try{let t=await e.req.json();if(!t||typeof t!="object")return e.json({code:400,message:"Invalid payload, expected settings key-value object"},400);await I.updateSettings(e.env.DB,t);let a=await I.getAllSettings(e.env.DB);return e.json({code:0,message:"Settings saved successfully",data:a})}catch(t){return e.json({code:500,message:"Failed to update settings: "+t.message},500)}});j.post("/api/admin/settings/generate-token",async e=>{let t=new Uint8Array(24);crypto.getRandomValues(t);let a="ygg_"+Array.from(t,n=>n.toString(16).padStart(2,"0")).join("");return e.json({code:0,message:"Token generated",data:{token:a}})});j.post("/api/admin/cleanup",async e=>{try{let t=await F.runCleanup(e.env.DB,e.env.BUCKET);return e.json({code:0,message:`Cleanup completed: ${t.deleted} versions removed`,data:t})}catch(t){return e.json({code:500,message:"Cleanup failed: "+t.message},500)}});j.post("/api/admin/cleanup/force",async e=>{try{let t=await e.req.json(),a=t.days||90,n=t.keep_latest||3,s=await F.forceCleanup(e.env.DB,e.env.BUCKET,a,n);return e.json({code:0,message:`Force cleanup completed: ${s.deleted} versions removed`,data:s})}catch(t){return e.json({code:500,message:"Force cleanup failed: "+t.message},500)}});function et(e="Yggdrasil - \u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3"){return`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${e}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-card: #131b2e;
      --bg-card-hover: #1a243d;
      --bg-input: #0e1626;
      --border: #1e293b;
      --border-focus: #3b82f6;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --primary: #10b981;
      --primary-hover: #059669;
      --primary-light: rgba(16, 185, 129, 0.12);
      --accent: #3b82f6;
      --accent-hover: #2563eb;
      --accent-light: rgba(59, 130, 246, 0.12);
      --warning: #f59e0b;
      --danger: #ef4444;
      --danger-hover: #dc2626;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.25);
      --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.35);
      --shadow-lg: 0 12px 28px -6px rgba(0, 0, 0, 0.45);
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      --font-mono: 'JetBrains Mono', Consolas, Monaco, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg-main);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.5;
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
    }

    /* Layout */
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* Navigation Bar */
    header.navbar {
      background: var(--bg-card);
      border-bottom: 1px solid var(--border);
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text-main);
    }
    .nav-brand .brand-icon {
      font-size: 1.4rem;
      line-height: 1;
    }
    .nav-brand .brand-tag {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: var(--radius-sm);
      background: var(--primary-light);
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-tab {
      padding: 0.5rem 0.85rem;
      border-radius: var(--radius-md);
      color: var(--text-muted);
      cursor: pointer;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      border: 1px solid transparent;
    }
    .nav-tab:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.04);
    }
    .nav-tab.active {
      color: var(--text-main);
      background: var(--bg-input);
      border-color: var(--border);
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    /* Main Content */
    main.content {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }

    /* Stats Ribbon */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .stat-title {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .stat-val {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.03em;
    }
    .stat-meta {
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    /* Action Toolbar */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .section-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.55rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid transparent;
      white-space: nowrap;
      text-decoration: none;
    }
    .btn-primary {
      background: var(--primary);
      color: #042f1f;
    }
    .btn-primary:hover {
      background: var(--primary-hover);
      color: #021a11;
    }
    .btn-secondary {
      background: var(--bg-input);
      border-color: var(--border);
      color: var(--text-main);
    }
    .btn-secondary:hover {
      background: var(--border);
    }
    .btn-accent {
      background: var(--accent);
      color: #ffffff;
    }
    .btn-accent:hover {
      background: var(--accent-hover);
    }
    .btn-danger {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }
    .btn-danger:hover {
      background: var(--danger);
      color: #ffffff;
    }
    .btn-sm {
      padding: 0.35rem 0.65rem;
      font-size: 0.775rem;
      border-radius: var(--radius-sm);
    }
    .btn-icon {
      padding: 0.45rem;
      line-height: 1;
    }

    /* App Cards & Version List */
    .app-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.25rem;
      transition: border-color 0.2s ease;
    }
    .app-card:hover {
      border-color: #2e3d5b;
    }
    .app-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .app-info {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .app-avatar {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--bg-input);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
      overflow: hidden;
    }
    .app-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .app-name-wrap {
      display: flex;
      flex-direction: column;
    }
    .app-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .app-pkg {
      font-family: var(--font-mono);
      font-size: 0.775rem;
      color: var(--text-muted);
    }

    .app-meta-badges {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.85rem;
      flex-wrap: wrap;
      align-items: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
      background: var(--bg-input);
      border: 1px solid var(--border);
      color: var(--text-muted);
    }
    .badge-success {
      background: var(--primary-light);
      border-color: rgba(16, 185, 129, 0.3);
      color: var(--primary);
    }
    .badge-accent {
      background: var(--accent-light);
      border-color: rgba(59, 130, 246, 0.3);
      color: var(--accent);
    }
    .badge-warning {
      background: rgba(245, 158, 11, 0.12);
      border-color: rgba(245, 158, 11, 0.3);
      color: var(--warning);
    }

    .app-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    /* Version Dropdown / Table inside App Card */
    .version-container {
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }
    .version-item {
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin-bottom: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .ver-left {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .ver-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .ver-title {
      font-weight: 700;
      font-size: 0.95rem;
    }
    .ver-code {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-dim);
    }
    .ver-log {
      font-size: 0.8rem;
      color: var(--text-muted);
      white-space: pre-line;
      max-width: 600px;
    }
    .ver-meta {
      display: flex;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: var(--text-dim);
      margin-top: 4px;
    }

    /* Tables */
    .table-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    table.data-table th {
      background: var(--bg-input);
      padding: 0.85rem 1.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border);
    }
    table.data-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border);
      color: var(--text-main);
      vertical-align: middle;
    }
    table.data-table tr:last-child td {
      border-bottom: none;
    }
    table.data-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    /* Forms & Inputs */
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-label {
      display: block;
      margin-bottom: 0.4rem;
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .form-control {
      width: 100%;
      padding: 0.65rem 0.85rem;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      color: var(--text-main);
      font-size: 0.875rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s ease;
    }
    .form-control:focus {
      border-color: var(--border-focus);
    }
    textarea.form-control {
      min-height: 80px;
      resize: vertical;
    }
    .form-help {
      font-size: 0.75rem;
      color: var(--text-dim);
      margin-top: 0.35rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .form-col {
      flex: 1;
    }

    /* Switch toggle */
    .switch-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1rem;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      margin-bottom: 0.75rem;
    }
    .switch-info {
      display: flex;
      flex-direction: column;
    }
    .switch-title {
      font-weight: 600;
      font-size: 0.875rem;
    }
    .switch-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .switch-checkbox {
      width: 44px;
      height: 24px;
      position: relative;
      appearance: none;
      background: #334155;
      outline: none;
      border-radius: 20px;
      cursor: pointer;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .switch-checkbox:checked {
      background: var(--primary);
    }
    .switch-checkbox::before {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      top: 3px;
      left: 3px;
      background: #ffffff;
      transition: transform 0.2s;
    }
    .switch-checkbox:checked::before {
      transform: translateX(20px);
    }

    /* Drag Drop Upload Zone */
    .upload-zone {
      border: 2px dashed var(--border);
      border-radius: var(--radius-lg);
      padding: 2.5rem 1.5rem;
      text-align: center;
      background: rgba(14, 22, 38, 0.6);
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .upload-zone:hover, .upload-zone.dragover {
      border-color: var(--primary);
      background: var(--primary-light);
    }
    .upload-icon {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }
    .upload-text {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-main);
    }
    .upload-hint {
      font-size: 0.8rem;
      color: var(--text-dim);
      margin-top: 0.25rem;
    }

    .progress-bar-wrap {
      margin-top: 1rem;
      background: var(--bg-input);
      border-radius: 10px;
      height: 10px;
      overflow: hidden;
      display: none;
    }
    .progress-bar-inner {
      height: 100%;
      background: var(--primary);
      width: 0%;
      transition: width 0.15s ease;
    }

    /* Modals */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      padding: 1.5rem;
    }
    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
      padding: 1.75rem;
      transform: translateY(12px);
      transition: transform 0.2s ease;
    }
    .modal-overlay.active .modal-card {
      transform: translateY(0);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .modal-title {
      font-size: 1.2rem;
      font-weight: 700;
    }
    .modal-close {
      background: none;
      border: none;
      color: var(--text-dim);
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
    }
    .modal-close:hover {
      color: var(--text-main);
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    /* Toast Notification */
    .toast-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .toast {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0.75rem 1.25rem;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
      font-weight: 500;
      animation: slideUp 0.2s ease;
    }
    .toast.success { border-color: rgba(16, 185, 129, 0.4); color: #6ee7b7; }
    .toast.error { border-color: rgba(239, 68, 68, 0.4); color: #fca5a5; }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Code & Pre Box */
    .code-box {
      background: #070b14;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: #38bdf8;
      overflow-x: auto;
      line-height: 1.6;
    }

    /* Login Box (Screen) */
    .login-container {
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .login-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      max-width: 420px;
      width: 100%;
      box-shadow: var(--shadow-lg);
      text-align: center;
    }
    .login-logo {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    .login-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .login-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 2rem;
    }

    /* Utilities */
    .hidden { display: none !important; }
    .mono { font-family: var(--font-mono); }
    .truncate { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    @media (max-width: 768px) {
      header.navbar { padding: 0 1rem; }
      .nav-brand .brand-tag { display: none; }
      main.content { padding: 1.25rem 1rem 3rem; }
      .form-row { flex-direction: column; gap: 0; }
    }
  </style>
</head>
<body>

  <!-- LOGIN SCREEN -->
  <div id="login-view" class="login-container hidden">
    <div class="login-card">
      <div class="login-logo">\u{1F333}</div>
      <h1 class="login-title">Yggdrasil \u63A7\u5236\u53F0</h1>
      <p class="login-subtitle">Cloudflare \u8FB9\u7F18\u5E94\u7528\u7248\u672C\u4E0E\u6587\u4EF6\u5206\u53D1\u7CFB\u7EDF</p>
      <form id="login-form" onsubmit="handleLogin(event)">
        <div class="form-group" style="text-align: left;">
          <label class="form-label">\u7BA1\u7406\u5458\u8BBF\u95EE\u5BC6\u7801</label>
          <input type="password" id="login-password" class="form-control" placeholder="\u8F93\u5165\u63A7\u5236\u53F0\u5BC6\u7801..." required autofocus />
        </div>
        <button type="submit" id="btn-login-submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem;">
          \u767B \u5F55 \u63A7 \u5236 \u53F0
        </button>
      </form>
    </div>
  </div>

  <!-- MAIN APP VIEW -->
  <div id="app-view" class="app-container hidden">
    <header class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">\u{1F333}</span>
        <span>Yggdrasil</span>
        <span class="brand-tag">Cloudflare Edge</span>
      </div>

      <nav class="nav-links">
        <div class="nav-tab active" data-tab="apps" onclick="switchTab('apps')">
          <span>\u{1F4F1}</span> <span>\u5E94\u7528\u53D1\u5E03</span>
        </div>
        <div class="nav-tab" data-tab="files" onclick="switchTab('files')">
          <span>\u{1F4C1}</span> <span>\u901A\u7528\u6587\u4EF6</span>
        </div>
        <div class="nav-tab" data-tab="settings" onclick="switchTab('settings')">
          <span>\u2699\uFE0F</span> <span>\u9274\u6743\u4E0E\u8BBE\u7F6E</span>
        </div>
        <div class="nav-tab" data-tab="playground" onclick="switchTab('playground')">
          <span>\u{1F9EA}</span> <span>\u63A5\u53E3\u8C03\u8BD5\u53F0</span>
        </div>
        <div class="nav-tab" data-tab="docs" onclick="switchTab('docs')">
          <span>\u{1F4D6}</span> <span>API \u6587\u6863</span>
        </div>
      </nav>

      <div class="nav-user">
        <button class="btn btn-secondary btn-sm" onclick="handleLogout()">\u767B\u51FA</button>
      </div>
    </header>

    <main class="content">
      <!-- \u5168\u5C40\u7ED1\u5B9A\u7F3A\u5931\u4E0E\u7CFB\u7EDF\u9519\u8BEF\u63D0\u793A\u6A2A\u5E45 -->
      <div id="global-alert-banner" class="hidden" style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem; color: #fca5a5; display: flex; align-items: flex-start; gap: 0.75rem;">
        <span style="font-size: 1.5rem; line-height: 1;">\u26A0\uFE0F</span>
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.35rem; color: #ef4444;">\u7CFB\u7EDF\u8D44\u6E90\u914D\u7F6E\u63D0\u793A</div>
          <div id="global-alert-text" style="font-size: 0.85rem; line-height: 1.6; color: #fecaca;"></div>
        </div>
      </div>

      <!-- \u7EDF\u8BA1\u680F -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">\u5DF2\u6258\u7BA1\u5E94\u7528 / \u7248\u672C</div>
          <div class="stat-val" id="stat-apps">0 / 0</div>
          <div class="stat-meta">\u6D3B\u8DC3\u5E94\u7528\u4E0E\u53D1\u5E03\u7248\u672C\u603B\u6570</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">\u901A\u7528\u6587\u4EF6\u6570</div>
          <div class="stat-val" id="stat-files">0</div>
          <div class="stat-meta">\u9759\u6001\u6587\u4EF6\u4E0E\u5F52\u6863\u8D44\u6E90</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">R2 \u5B58\u50A8\u5360\u7528</div>
          <div class="stat-val" id="stat-storage">0 MB</div>
          <div class="stat-meta">Cloudflare R2 \u96F6\u51FA\u53E3\u6D41\u91CF\u8D39\u7528</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">\u7D2F\u79EF\u5206\u53D1\u4E0B\u8F7D\u91CF</div>
          <div class="stat-val" id="stat-downloads">0</div>
          <div class="stat-meta">\u652F\u6301\u5168\u91CF HTTP Range \u7EED\u4F20</div>
        </div>
      </div>

      <!-- TAB 1: \u5E94\u7528\u53D1\u5E03\u7BA1\u7406 -->
      <section id="tab-apps">
        <div class="section-header">
          <div>
            <h2 class="section-title">\u5E94\u7528\u4E0E APK \u53D1\u5E03\u7BA1\u7406</h2>
            <p class="section-subtitle">\u652F\u6301\u591A App \u7EDF\u4E00\u6258\u7BA1\u3001\u6570\u5B57\u7248\u672C\u6BD4\u5BF9 (versionCode)\u3001\u6E20\u9053\u9694\u79BB\u4E0E\u65AD\u70B9\u7EED\u4F20</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary" onclick="openCreateAppModal()">+ \u521B\u5EFA\u65B0\u5E94\u7528</button>
          </div>
        </div>

        <div id="apps-list-container">
          <!-- \u52A8\u6001\u6E32\u67D3\u5E94\u7528\u5361\u7247 -->
        </div>
      </section>

      <!-- TAB 2: \u901A\u7528\u6587\u4EF6\u7BA1\u7406 -->
      <section id="tab-files" class="hidden">
        <div class="section-header">
          <div>
            <h2 class="section-title">\u901A\u7528\u6587\u4EF6\u5206\u53D1</h2>
            <p class="section-subtitle">\u652F\u6301\u914D\u7F6E\u3001\u6587\u6863\u3001\u5B89\u88C5\u5305\u7B49\u4EFB\u610F\u6587\u4EF6\u5B58\u50A8\uFF0C\u652F\u6301\u81EA\u5B9A\u4E49\u77ED\u94FE\u522B\u540D\u5FEB\u6377\u4E0B\u8F7D</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary" onclick="openUploadFileModal()">+ \u4E0A\u4F20\u6587\u4EF6</button>
          </div>
        </div>

        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>\u6587\u4EF6\u540D\u79F0</th>
                <th>\u5206\u7C7B</th>
                <th>\u5927\u5C0F</th>
                <th>\u5FEB\u6377\u522B\u540D (\u77ED\u94FE)</th>
                <th>\u4E0B\u8F7D\u6B21\u6570</th>
                <th>\u4E0A\u4F20\u65F6\u95F4</th>
                <th style="text-align: right;">\u64CD\u4F5C</th>
              </tr>
            </thead>
            <tbody id="files-table-body">
              <!-- \u52A8\u6001\u6E32\u67D3\u6587\u4EF6\u5217\u8868 -->
            </tbody>
          </table>
        </div>
      </section>

      <!-- TAB 3: \u9274\u6743\u4E0E\u7CFB\u7EDF\u8BBE\u7F6E -->
      <section id="tab-settings" class="hidden">
        <div class="section-header">
          <div>
            <h2 class="section-title">API \u9274\u6743\u4E0E\u7CFB\u7EDF\u8BBE\u7F6E</h2>
            <p class="section-subtitle">\u5728\u63A7\u5236\u53F0\u968F\u65F6\u5F00\u542F\u6216\u5173\u95ED\u5F00\u653E\u63A5\u53E3\u7684 Token \u6821\u9A8C\uFF0C\u8BBE\u7F6E\u81EA\u5B9A\u4E49\u56FA\u5B9A Token</p>
          </div>
          <button class="btn btn-primary" onclick="saveSettings()">\u4FDD\u5B58\u914D\u7F6E\u53D8\u66F4</button>
        </div>

        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem;">\u{1F512} \u5BA2\u6237\u7AEF API Token \u9274\u6743\u8BBE\u7F6E</h3>
          
          <div class="switch-wrap">
            <div class="switch-info">
              <span class="switch-title">\u542F\u7528\u5168\u5C40 API Token \u6821\u9A8C</span>
              <span class="switch-desc">\u5F00\u542F\u540E\uFF0C\u5BA2\u6237\u7AEF\u5FC5\u987B\u643A\u5E26\u6B63\u786E Token \u624D\u80FD\u8BBF\u95EE\u5F00\u542F\u4E86\u6821\u9A8C\u7684\u63A5\u53E3</span>
            </div>
            <input type="checkbox" id="cfg-token-enabled" class="switch-checkbox" />
          </div>

          <div class="form-group" style="margin-top: 1rem;">
            <label class="form-label">\u56FA\u5B9A API \u8BBF\u95EE Token (Fixed Token)</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="cfg-fixed-token" class="form-control mono" placeholder="\u8BBE\u7F6E\u56FA\u5B9A Token \u5B57\u7B26\u4E32..." />
              <button class="btn btn-secondary" onclick="generateRandomToken()">\u968F\u673A\u751F\u6210</button>
              <button class="btn btn-secondary" onclick="copyText(document.getElementById('cfg-fixed-token').value, 'Token \u5DF2\u590D\u5236')">\u590D\u5236</button>
            </div>
            <div class="form-help">\u5BA2\u6237\u7AEF\u53EF\u5728 Header \u4F20\u5165 <code class="mono">X-Ygg-Token: &lt;token&gt;</code>\u3001<code class="mono">Authorization: Bearer &lt;token&gt;</code> \u6216 Query \u53C2\u6570 <code class="mono">?token=&lt;token&gt;</code></div>
          </div>

          <h4 style="font-size: 0.9rem; font-weight: 700; margin: 1.25rem 0 0.75rem;">\u7EC6\u7C92\u5EA6\u63A5\u53E3 Token \u6821\u9A8C\u5F00\u5173</h4>
          
          <div class="switch-wrap">
            <div class="switch-info">
              <span class="switch-title">App \u7248\u672C\u68C0\u6D4B\u63A5\u53E3 (/api/v1/app/latest)</span>
              <span class="switch-desc">\u662F\u5426\u8981\u6C42\u624B\u673A App \u5FC5\u987B\u643A\u5E26 Token \u624D\u80FD\u68C0\u6D4B\u6700\u65B0\u7248\u672C</span>
            </div>
            <input type="checkbox" id="cfg-app-check-token" class="switch-checkbox" />
          </div>

          <div class="switch-wrap">
            <div class="switch-info">
              <span class="switch-title">App APK \u4E0B\u8F7D\u63A5\u53E3 (/api/v1/app/download)</span>
              <span class="switch-desc">\u662F\u5426\u8981\u6C42\u4E0B\u8F7D APK \u5B89\u88C5\u5305\u65F6\u643A\u5E26 Token</span>
            </div>
            <input type="checkbox" id="cfg-app-download-token" class="switch-checkbox" />
          </div>

          <div class="switch-wrap">
            <div class="switch-info">
              <span class="switch-title">\u901A\u7528\u6587\u4EF6\u4E0B\u8F7D\u63A5\u53E3 (/api/v1/files/:id/download, /f/:alias)</span>
              <span class="switch-desc">\u662F\u5426\u8981\u6C42\u4E0B\u8F7D\u901A\u7528\u6587\u4EF6\u8D44\u6E90\u65F6\u643A\u5E26 Token</span>
            </div>
            <input type="checkbox" id="cfg-file-download-token" class="switch-checkbox" />
          </div>
        </div>

        <div class="stat-card">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem;">\u{1F9F9} R2 \u5B58\u50A8\u81EA\u52A8\u6E05\u7406\u7B56\u7565</h3>
          <p style="color: var(--text-muted); font-size: 0.825rem; margin-bottom: 1rem;">\u81EA\u52A8\u5220\u9664\u8D85\u8FC7\u6307\u5B9A\u5929\u6570\u7684\u65E7\u7248\u672C\u5B89\u88C5\u5305\uFF0C\u59CB\u7EC8\u4FDD\u7559\u6BCF\u4E2A\u6E20\u9053\u6700\u65B0 N \u4E2A\u7248\u672C\uFF0C\u9632\u6B62 R2 \u5B58\u50A8\u88AB\u5386\u53F2\u5305\u5360\u6EE1\u3002</p>
          
          <div class="switch-wrap">
            <div class="switch-info">
              <span class="switch-title">\u542F\u7528\u81EA\u52A8\u6E05\u7406</span>
              <span class="switch-desc">\u5F00\u542F\u540E\uFF0C\u7CFB\u7EDF\u5C06\u6BCF\u5929\u51CC\u6668\u81EA\u52A8\u626B\u63CF\u5E76\u6E05\u7406\u8D85\u671F\u65E7\u7248\u672C APK</span>
            </div>
            <input type="checkbox" id="cfg-auto-cleanup-enabled" class="switch-checkbox" />
          </div>

          <div class="form-row" style="margin-top: 1rem;">
            <div class="form-col form-group">
              <label class="form-label">\u4FDD\u7559\u5929\u6570 (\u8D85\u8FC7\u6B64\u5929\u6570\u7684\u65E7\u7248\u672C\u5C06\u88AB\u6E05\u7406)</label>
              <input type="number" id="cfg-auto-cleanup-days" class="form-control mono" value="90" min="1" max="3650" placeholder="90" />
              <div class="form-help">\u9ED8\u8BA4 90 \u5929\uFF0C\u5EFA\u8BAE\u6839\u636E\u53D1\u7248\u9891\u7387\u8C03\u6574</div>
            </div>
            <div class="form-col form-group">
              <label class="form-label">\u6BCF\u4E2A\u6E20\u9053\u81F3\u5C11\u4FDD\u7559\u7248\u672C\u6570</label>
              <input type="number" id="cfg-auto-cleanup-keep" class="form-control mono" value="3" min="1" max="100" placeholder="3" />
              <div class="form-help">\u5373\u4F7F\u8D85\u671F\uFF0C\u4E5F\u4F1A\u4FDD\u7559\u6BCF\u4E2A App \u6BCF\u4E2A\u6E20\u9053\u6700\u65B0\u7684 N \u4E2A\u7248\u672C</div>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="runManualCleanup()">\u{1F9F9} \u7ACB\u5373\u6267\u884C\u6E05\u7406</button>
            <span id="cleanup-result" style="font-size: 0.825rem; color: var(--text-muted);"></span>
          </div>
        </div>
      </section>

      <!-- TAB 4: \u63A5\u53E3\u8C03\u8BD5\u53F0 -->
      <section id="tab-playground" class="hidden">
        <div class="section-header">
          <div>
            <h2 class="section-title">\u5BA2\u6237\u7AEF\u63A5\u53E3\u8C03\u8BD5\u53F0 & \u5F00\u53D1\u8005\u6307\u5357</h2>
            <p class="section-subtitle">\u4E00\u952E\u6A21\u62DF Android / iOS / \u5BA2\u6237\u7AEF\u8C03\u7528\u7248\u672C\u68C0\u6D4B\u63A5\u53E3\u4E0E\u4E0B\u8F7D\u8BF7\u6C42</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div class="stat-card">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">\u{1F9EA} \u6A21\u62DF\u7248\u672C\u68C0\u6D4B\u8BF7\u6C42</h3>
            
            <div class="form-group">
              <label class="form-label">\u76EE\u6807 App</label>
              <select id="pg-app-select" class="form-control" onchange="onPlaygroundAppChange()"></select>
            </div>

            <div class="form-row">
              <div class="form-col form-group">
                <label class="form-label">\u5BA2\u6237\u7AEF\u5F53\u524D VersionCode</label>
                <input type="number" id="pg-cur-version" class="form-control mono" value="10000" placeholder="\u4F8B\u5982 10000" />
              </div>
              <div class="form-col form-group">
                <label class="form-label">\u6E20\u9053 Channel</label>
                <input type="text" id="pg-channel" class="form-control" value="default" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">API Token (\u53EF\u9009)</label>
              <input type="text" id="pg-token" class="form-control mono" placeholder="\u82E5\u5F00\u542F\u4E86\u9274\u6743\uFF0C\u5728\u6B64\u586B\u5165 Token" />
            </div>

            <button class="btn btn-primary" style="width: 100%;" onclick="runPlaygroundTest()">\u53D1\u8D77\u6A21\u62DF\u6D4B\u8BD5\u8BF7\u6C42</button>

            <div style="margin-top: 1.25rem;">
              <label class="form-label">cURL \u547D\u4EE4\u884C\u4EE3\u7801\uFF1A</label>
              <div id="pg-curl" class="code-box">curl -i ...</div>
            </div>
          </div>

          <div class="stat-card">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">\u{1F4E6} \u54CD\u5E94\u7ED3\u679C (JSON)</h3>
            <div id="pg-response" class="code-box" style="min-height: 280px; white-space: pre-wrap;">\u70B9\u51FB\u5DE6\u4FA7\u6309\u94AE\u53D1\u8D77\u6D4B\u8BD5...</div>
          </div>
        </div>
      </section>

      <!-- TAB 5: \u5B8C\u6574 API \u6587\u6863 -->
      <section id="tab-docs" class="hidden">
        <div class="section-header">
          <div>
            <h2 class="section-title">API \u63A5\u53E3\u53C2\u8003\u6587\u6863</h2>
            <p class="section-subtitle">\u8BE6\u7EC6\u7684\u63A5\u53E3\u534F\u8BAE\u3001\u53C2\u6570\u8BF4\u660E\u3001\u72B6\u6001\u7801\u4E0E\u79FB\u52A8\u7AEF\u591A\u8BED\u8A00\u5BA2\u6237\u7AEF\u63A5\u5165\u4EE3\u7801</p>
          </div>
        </div>

        <!-- \u63A5\u53E3 1: \u7248\u672C\u68C0\u6D4B -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge badge-success" style="font-weight: 700;">GET</span>
              <span class="mono" style="font-size: 1rem; font-weight: 700;">/api/v1/app/latest</span>
              <span style="color: var(--text-muted); font-size: 0.85rem;">(\u522B\u540D: /api/v1/version/check)</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="copyText(window.location.origin + '/api/v1/app/latest', '\u63A5\u53E3\u8DEF\u5F84\u5DF2\u590D\u5236')">\u590D\u5236 URL</button>
          </div>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
            \u4F9B\u624B\u673A App \u542F\u52A8\u65F6\u6216\u70B9\u51FB\u201C\u68C0\u67E5\u66F4\u65B0\u201D\u65F6\u8C03\u7528\u3002\u670D\u52A1\u7AEF\u6839\u636E\u4F20\u5165\u7684 <code class="mono">version_code</code> \u81EA\u52A8\u5224\u65AD\u662F\u5426\u5B58\u5728\u65B0\u7248\u672C\u53CA\u662F\u5426\u5F3A\u5236\u66F4\u65B0\u3002
          </p>

          <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">\u8BF7\u6C42\u53C2\u6570 (Query String)</h4>
          <table class="data-table" style="margin-bottom: 1rem;">
            <thead>
              <tr>
                <th>\u53C2\u6570\u540D</th>
                <th>\u7C7B\u578B</th>
                <th>\u5FC5\u586B</th>
                <th>\u8BF4\u660E</th>
                <th>\u793A\u4F8B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="mono">app_id</td>
                <td>String</td>
                <td><span class="badge badge-warning">\u662F</span></td>
                <td>\u5E94\u7528\u5305\u540D\u6216\u552F\u4E00\u6807\u8BC6</td>
                <td class="mono">com.example.app</td>
              </tr>
              <tr>
                <td class="mono">version_code</td>
                <td>Integer</td>
                <td>\u5426</td>
                <td>\u5BA2\u6237\u7AEF\u5F53\u524D\u5B89\u88C5\u7684\u7248\u672C\u53F7 (\u6574\u6570)</td>
                <td class="mono">10000</td>
              </tr>
              <tr>
                <td class="mono">channel</td>
                <td>String</td>
                <td>\u5426</td>
                <td>\u6E20\u9053\u6807\u8BC6\uFF0C\u9ED8\u8BA4 default</td>
                <td class="mono">default / beta</td>
              </tr>
              <tr>
                <td class="mono">token</td>
                <td>String</td>
                <td>\u5426</td>
                <td>\u82E5\u5F00\u542F\u4E86 Token \u6821\u9A8C\uFF0C\u53EF\u5728\u6B64\u6216 Header \u4F20\u5165</td>
                <td class="mono">ygg_sec_xxx</td>
              </tr>
            </tbody>
          </table>

          <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">\u6210\u529F\u54CD\u5E94\u793A\u4F8B (JSON)</h4>
          <div class="code-box">{
  "code": 0,
  "message": "success",
  "data": {
    "has_update": true,          // \u662F\u5426\u6709\u66F4\u65B0 (latest_version_code > current_version_code)
    "is_force": false,           // \u662F\u5426\u5F3A\u5236\u66F4\u65B0 (\u6807\u8BB0\u5F3A\u66F4\u6216\u4F4E\u4E8E\u6700\u4F4E\u517C\u5BB9\u7248\u672C)
    "app_id": "com.example.app",
    "app_name": "\u638C\u4E0A\u529E\u516C",
    "icon_url": "https://example.com/icon.png",
    "current_version_code": 10000,
    "latest_version_code": 10200,
    "latest_version_name": "1.2.0",
    "min_version_code": 10000,
    "channel": "default",
    "changelog": "- \u4F18\u5316\u6587\u4EF6\u4E0B\u8F7D\u901F\u5EA6
- \u4FEE\u590D\u5DF2\u77E5\u5D29\u6E83Bug",
    "download_url": "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&version_code=10200",
    "file_name": "app-v1.2.0.apk",
    "file_size": 45829104,
    "file_md5": "e10adc3949ba59abbe56e057f20f883e",
    "release_time": "2026-08-18T10:00:00Z"
  }
}</div>
        </div>

        <!-- \u63A5\u53E3 2: APK \u4E0B\u8F7D -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge badge-success" style="font-weight: 700;">GET</span>
              <span class="mono" style="font-size: 1rem; font-weight: 700;">/api/v1/app/download</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="copyText(window.location.origin + '/api/v1/app/download', '\u63A5\u53E3\u8DEF\u5F84\u5DF2\u590D\u5236')">\u590D\u5236 URL</button>
          </div>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.75rem;">
            APK \u5B89\u88C5\u5305\u4E0B\u8F7D\u63A5\u53E3\u3002\u539F\u751F\u652F\u6301 <b>HTTP Range 206 \u65AD\u70B9\u7EED\u4F20</b>\uFF0C\u517C\u5BB9 Android \u7CFB\u7EDF\u81EA\u5E26 DownloadManager\u3001OkHttp\u3001iOS \u4E0B\u8F7D\u7EC4\u4EF6\u53CA\u5404\u5927\u4E0B\u8F7D\u5668\u3002
          </p>
          <div class="code-box"># \u65AD\u70B9\u7EED\u4F20\u6D4B\u8BD5 (\u5206\u7247\u8BF7\u6C42 Range: bytes=0-1023)
curl -i -H "Range: bytes=0-1023" "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app"

# \u8FD4\u56DE\u54CD\u5E94\u5934:
HTTP/1.1 206 Partial Content
Content-Type: application/vnd.android.package-archive
Accept-Ranges: bytes
Content-Range: bytes 0-1023/45829104
Content-Length: 1024</div>
        </div>

        <!-- \u63A5\u53E3 3: \u901A\u7528\u6587\u4EF6 -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">\u{1F4C1} \u901A\u7528\u6587\u4EF6\u4E0B\u8F7D\u4E0E\u68C0\u6D4B\u63A5\u53E3</h3>
          <ul style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.8; margin-left: 1.25rem;">
            <li><b>\u5143\u6570\u636E\u68C0\u6D4B</b>: <code class="mono">GET /api/v1/files/check?alias=xxx</code> \u6216 <code class="mono">GET /api/v1/files/:id/check</code></li>
            <li><b>\u901A\u8FC7 ID \u4E0B\u8F7D</b>: <code class="mono">GET /api/v1/files/:id/download</code></li>
            <li><b>\u901A\u8FC7\u77ED\u94FE\u522B\u540D\u4E0B\u8F7D</b>: <code class="mono">GET /f/:alias</code> (\u4F8B\u5982: <code class="mono">/f/my-config</code>)</li>
          </ul>
        </div>

        <!-- \u5BA2\u6237\u7AEF\u63A5\u5165\u4EE3\u7801 -->
        <div class="stat-card">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">\u{1F4BB} \u5BA2\u6237\u7AEF\u63A5\u5165\u4EE3\u7801\u6A21\u7248 (Android Kotlin)</h3>
          <div class="code-box" style="max-height: 380px;">// 1. \u7248\u672C\u68C0\u6D4B
val url = "https://your-worker.workers.dev/api/v1/app/latest?app_id=com.example.app&version_code=10000"
val request = Request.Builder().url(url).addHeader("X-Ygg-Token", "your_token").build()

client.newCall(request).enqueue(object : Callback {
    override fun onResponse(call: Call, response: Response) {
        val json = JSONObject(response.body?.string() ?: "")
        val data = json.getJSONObject("data")
        val hasUpdate = data.getBoolean("has_update")
        val downloadUrl = data.getString("download_url")
        // \u82E5\u6709\u66F4\u65B0\uFF0C\u5F15\u5BFC\u7528\u6237\u4E0B\u8F7D\u6216\u81EA\u52A8\u62C9\u8D77\u4E0B\u8F7D
    }
})

// 2. \u65AD\u70B9\u7EED\u4F20\u4E0B\u8F7D
val downloadReq = Request.Builder()
    .url(downloadUrl)
    .addHeader("Range", "bytes=\${existingFile.length()}-")
    .build()</div>
        </div>
      </section>
    </main>
  </div>

  <!-- MODAL: \u521B\u5EFA\u5E94\u7528 -->
  <div id="modal-create-app" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">\u521B\u5EFA\u65B0\u5E94\u7528</h3>
        <button class="modal-close" onclick="closeModal('modal-create-app')">&times;</button>
      </div>
      <form onsubmit="handleCreateApp(event)">
        <div class="form-group">
          <label class="form-label">\u5E94\u7528\u5305\u540D / \u552F\u4E00\u6807\u8BC6 (app_id) *</label>
          <input type="text" id="app-form-id" class="form-control mono" placeholder="com.example.myapp" required />
          <div class="form-help">\u5BA2\u6237\u7AEF\u68C0\u6D4B\u66F4\u65B0\u7684\u6838\u5FC3\u6807\u8BC6\u7B26\uFF0C\u521B\u5EFA\u540E\u4E0D\u53EF\u4FEE\u6539</div>
        </div>
        <div class="form-group">
          <label class="form-label">\u5E94\u7528\u663E\u793A\u540D\u79F0 *</label>
          <input type="text" id="app-form-name" class="form-control" placeholder="\u638C\u4E0A\u529E\u516C" required />
        </div>
        <div class="form-group">
          <label class="form-label">\u5E94\u7528\u56FE\u6807 URL (\u53EF\u9009)</label>
          <input type="url" id="app-form-icon" class="form-control" placeholder="https://example.com/icon.png" />
        </div>
        <div class="form-group">
          <label class="form-label">\u5E94\u7528\u63CF\u8FF0 (\u53EF\u9009)</label>
          <textarea id="app-form-desc" class="form-control" placeholder="\u5E94\u7528\u7B80\u4ECB\u6216\u5907\u6CE8..."></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-create-app')">\u53D6\u6D88</button>
          <button type="submit" class="btn btn-primary">\u7ACB\u5373\u521B\u5EFA</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: \u53D1\u5E03\u65B0\u7248\u672C (APK \u4E0A\u4F20) -->
  <div id="modal-release-version" class="modal-overlay">
    <div class="modal-card" style="max-width: 680px;">
      <div class="modal-header">
        <h3 class="modal-title" id="ver-modal-title">\u53D1\u5E03\u65B0\u7248\u672C</h3>
        <button class="modal-close" onclick="closeModal('modal-release-version')">&times;</button>
      </div>
      <form id="form-release-version" onsubmit="handleReleaseVersion(event)">
        <input type="hidden" id="ver-form-appid" />
        
        <!-- \u4E0A\u4F20\u533A\u57DF -->
        <div class="form-group">
          <label class="form-label">\u9009\u62E9 APK \u5B89\u88C5\u5305 *</label>
          <div id="drop-apk-zone" class="upload-zone" onclick="document.getElementById('file-apk-input').click()">
            <div class="upload-icon">\u{1F4E6}</div>
            <div class="upload-text" id="drop-apk-text">\u70B9\u51FB\u6216\u5C06 APK \u6587\u4EF6\u62D6\u62FD\u81F3\u6B64\u533A\u57DF</div>
            <div class="upload-hint">\u652F\u6301\u5927\u6587\u4EF6\u81EA\u52A8\u5206\u5757\u76F4\u4F20 Cloudflare R2</div>
            <input type="file" id="file-apk-input" style="display: none;" onchange="onFileSelected(this, 'apk')" />
          </div>
          <div id="apk-progress-wrap" class="progress-bar-wrap">
            <div id="apk-progress-bar" class="progress-bar-inner"></div>
          </div>
          <div id="apk-upload-status" class="form-help" style="margin-top: 6px;"></div>
        </div>

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">\u7248\u672C\u540D\u79F0 (versionName) *</label>
            <input type="text" id="ver-form-name" class="form-control" placeholder="1.2.0" required />
          </div>
          <div class="form-col form-group">
            <label class="form-label">\u7248\u672C\u53F7 (versionCode \u6574\u6570) *</label>
            <input type="number" id="ver-form-code" class="form-control mono" placeholder="10200" required />
            <div class="form-help">\u5FC5\u987B\u5927\u4E8E\u65E7\u7248\u672C\u53F7</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">\u53D1\u5E03\u6E20\u9053 (channel)</label>
            <input type="text" id="ver-form-channel" class="form-control" value="default" placeholder="default / beta / googleplay" />
          </div>
          <div class="form-col form-group">
            <label class="form-label">\u6700\u4F4E\u517C\u5BB9\u7248\u672C\u53F7 (minVersionCode)</label>
            <input type="number" id="ver-form-mincode" class="form-control mono" value="0" placeholder="\u4F4E\u4E8E\u6B64\u7248\u672C\u5C06\u5F3A\u5236\u66F4\u65B0" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">\u7248\u672C\u66F4\u65B0\u65E5\u5FD7 (Changelog)</label>
          <textarea id="ver-form-log" class="form-control" placeholder="- \u4F18\u5316\u4E0B\u8F7D\u6027\u80FD\u4E0E\u65AD\u70B9\u7EED\u4F20&#10;- \u4FEE\u590D\u5DF2\u77E5\u5D29\u6E83Bug"></textarea>
        </div>

        <div class="switch-wrap">
          <div class="switch-info">
            <span class="switch-title">\u662F\u5426\u8BBE\u4E3A\u5F3A\u5236\u66F4\u65B0 (Force Update)</span>
            <span class="switch-desc">\u52FE\u9009\u540E\uFF0C\u5BA2\u6237\u7AEF\u68C0\u6D4B\u66F4\u65B0\u65F6\u5C06\u6807\u8BB0\u5FC5\u987B\u5347\u7EA7</span>
          </div>
          <input type="checkbox" id="ver-form-force" class="switch-checkbox" />
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-release-version')">\u53D6\u6D88</button>
          <button type="submit" id="btn-release-submit" class="btn btn-primary" disabled>\u4E0A\u4F20\u5E76\u53D1\u5E03\u65B0\u7248\u672C</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: \u4E0A\u4F20\u901A\u7528\u6587\u4EF6 -->
  <div id="modal-upload-file" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">\u4E0A\u4F20\u901A\u7528\u6587\u4EF6</h3>
        <button class="modal-close" onclick="closeModal('modal-upload-file')">&times;</button>
      </div>
      <form onsubmit="handleUploadGenericFile(event)">
        <div class="form-group">
          <label class="form-label">\u9009\u62E9\u6587\u4EF6 *</label>
          <div class="upload-zone" onclick="document.getElementById('file-generic-input').click()">
            <div class="upload-icon">\u{1F4C4}</div>
            <div class="upload-text" id="drop-gen-text">\u70B9\u51FB\u6216\u5C06\u6587\u4EF6\u62D6\u62FD\u81F3\u6B64</div>
            <div class="upload-hint">\u652F\u6301\u914D\u7F6E\u6587\u4EF6\u3001\u6587\u6863\u3001\u5A92\u4F53\u3001\u5B89\u88C5\u5305\u7B49\u4EFB\u610F\u7C7B\u578B</div>
            <input type="file" id="file-generic-input" style="display: none;" onchange="onFileSelected(this, 'generic')" />
          </div>
          <div id="gen-progress-wrap" class="progress-bar-wrap">
            <div id="gen-progress-bar" class="progress-bar-inner"></div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">\u6587\u4EF6\u663E\u793A\u540D\u79F0 *</label>
          <input type="text" id="gen-form-name" class="form-control" placeholder="app-config.json" required />
        </div>

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">\u5206\u7C7B (Category)</label>
            <input type="text" id="gen-form-cat" class="form-control" value="general" placeholder="config / document / tool" />
          </div>
          <div class="form-col form-group">
            <label class="form-label">\u81EA\u5B9A\u4E49\u77ED\u94FE\u522B\u540D (Alias)</label>
            <input type="text" id="gen-form-alias" class="form-control mono" placeholder="\u5982 my-config" />
            <div class="form-help">\u53EF\u901A\u8FC7 /f/&lt;alias&gt; \u76F4\u63A5\u4E0B\u8F7D</div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-upload-file')">\u53D6\u6D88</button>
          <button type="submit" id="btn-gen-submit" class="btn btn-primary" disabled>\u5F00\u59CB\u4E0A\u4F20</button>
        </div>
      </form>
    </div>
  </div>

  <!-- TOAST CONTAINER -->
  <div id="toast-container" class="toast-container"></div>

  <!-- CLIENT SCRIPTS -->
  <script>
    // State
    let currentUser = null;
    let appsData = [];
    let filesData = [];
    let settingsData = {};
    let activeTab = 'apps';
    let pendingUploadResult = null; // { file_key, file_name, file_size, file_md5, mime_type }

    // Helpers
    function showToast(msg, type = 'success') {
      const c = document.getElementById('toast-container');
      const t = document.createElement('div');
      t.className = 'toast ' + type;
      t.innerText = msg;
      c.appendChild(t);
      setTimeout(() => { t.remove(); }, 3000);
    }

    function formatBytes(bytes, decimals = 2) {
      if (!+bytes) return '0 B';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return \`\${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} \${sizes[i]}\`;
    }

    function copyText(text, successMsg = '\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F') {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
        showToast(successMsg);
      });
    }

    function openModal(id) {
      document.getElementById(id).classList.add('active');
    }
    function closeModal(id) {
      document.getElementById(id).classList.remove('active');
    }

    // Tab Switching
    function switchTab(tabId) {
      activeTab = tabId;
      document.querySelectorAll('.nav-tab').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-tab') === tabId);
      });
      ['apps', 'files', 'settings', 'playground', 'docs'].forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) el.classList.toggle('hidden', t !== tabId);
      });

      if (tabId === 'apps') loadApps();
      if (tabId === 'files') loadFiles();
      if (tabId === 'settings') loadSettings();
      if (tabId === 'playground') setupPlayground();
    }

    // API Helper with credentials
    async function apiRequest(url, options = {}) {
      options.headers = options.headers || {};
      const token = localStorage.getItem('ygg_jwt');
      if (token) {
        options.headers['Authorization'] = 'Bearer ' + token;
      }
      const res = await fetch(url, options);
      if (res.status === 401 && !url.includes('/api/admin/login')) {
        showLoginView();
        throw new Error('Unauthorized');
      }
      return res;
    }

    // Check Login
    async function checkAuth() {
      try {
        const res = await apiRequest('/api/admin/me');
        if (res.ok) {
          currentUser = 'admin';
          showAppView();
          loadStats();
          loadApps();
        } else {
          showLoginView();
        }
      } catch (e) {
        showLoginView();
      }
    }

    function showLoginView() {
      document.getElementById('login-view').classList.remove('hidden');
      document.getElementById('app-view').classList.add('hidden');
    }
    function showAppView() {
      document.getElementById('login-view').classList.add('hidden');
      document.getElementById('app-view').classList.remove('hidden');
    }

    // Login & Logout
    async function handleLogin(e) {
      e.preventDefault();
      const pwd = document.getElementById('login-password').value;
      const btn = document.getElementById('btn-login-submit');
      btn.disabled = true;
      btn.innerText = '\u767B\u5F55\u4E2D...';

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd })
        });
        const data = await res.json();
        if (data.code === 0 && data.data?.token) {
          localStorage.setItem('ygg_jwt', data.data.token);
          showToast('\u767B\u5F55\u6210\u529F');
          checkAuth();
        } else {
          showToast(data.message || '\u5BC6\u7801\u9519\u8BEF', 'error');
        }
      } catch (err) {
        showToast('\u767B\u5F55\u5931\u8D25: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerText = '\u767B \u5F55 \u63A7 \u5236 \u53F0';
      }
    }

    async function handleLogout() {
      await apiRequest('/api/admin/logout', { method: 'POST' });
      localStorage.removeItem('ygg_jwt');
      showLoginView();
      showToast('\u5DF2\u767B\u51FA');
    }

    function showGlobalAlert(msg) {
      const banner = document.getElementById('global-alert-banner');
      const text = document.getElementById('global-alert-text');
      if (banner && text) {
        text.innerText = msg;
        banner.classList.remove('hidden');
      }
    }

    // Stats
    async function loadStats() {
      try {
        const res = await apiRequest('/api/admin/stats');
        const data = await res.json();
        if (data.code === 0 && data.data) {
          document.getElementById('stat-apps').innerText = \`\${data.data.totalApps} / \${data.data.totalVersions}\`;
          document.getElementById('stat-files').innerText = data.data.totalFiles;
          document.getElementById('stat-storage').innerText = formatBytes(data.data.totalStorageBytes);
          document.getElementById('stat-downloads').innerText = data.data.totalDownloads;
        } else if (data.message && (data.message.includes('\u7ED1\u5B9A\u7F3A\u5931') || data.message.includes('D1'))) {
          showGlobalAlert(data.message);
        }
      } catch (e) {}
    }

    // Apps Management
    async function loadApps() {
      try {
        const res = await apiRequest('/api/admin/apps');
        const data = await res.json();
        if (data.code === 0) {
          appsData = data.data || [];
          renderApps();
        } else if (data.message && (data.message.includes('\u7ED1\u5B9A\u7F3A\u5931') || data.message.includes('D1'))) {
          showGlobalAlert(data.message);
        }
      } catch (e) {}
    }

    function renderApps() {
      const c = document.getElementById('apps-list-container');
      if (!appsData.length) {
        c.innerHTML = \`
          <div class="stat-card" style="text-align: center; padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">\u{1F4F1}</div>
            <div style="font-size: 1.1rem; font-weight: 700;">\u6682\u672A\u521B\u5EFA\u4EFB\u4F55\u5E94\u7528</div>
            <p style="color: var(--text-muted); margin: 0.5rem 0 1.25rem;">\u70B9\u51FB\u4E0A\u65B9\u201C\u521B\u5EFA\u65B0\u5E94\u7528\u201D\u5F00\u59CB\u6258\u7BA1\u4F60\u7684\u7B2C\u4E00\u4E2A App / APK \u53D1\u5E03</p>
            <button class="btn btn-primary" onclick="openCreateAppModal()">+ \u7ACB\u5373\u521B\u5EFA\u5E94\u7528</button>
          </div>
        \`;
        return;
      }

      const origin = window.location.origin;

      c.innerHTML = appsData.map(app => {
        const checkApiUrl = \`\${origin}/api/v1/app/latest?app_id=\${encodeURIComponent(app.app_id)}\`;
        const downloadUrl = \`\${origin}/api/v1/app/download?app_id=\${encodeURIComponent(app.app_id)}\`;
        const avatar = app.icon_url ? \`<img src="\${app.icon_url}" alt="\${app.name}" />\` : '\u{1F4F1}';

        return \`
          <div class="app-card" id="app-card-\${app.app_id}">
            <div class="app-card-top">
              <div class="app-info">
                <div class="app-avatar">\${avatar}</div>
                <div class="app-name-wrap">
                  <div class="app-name">
                    \${app.name}
                    \${app.latest_version_name ? \`<span class="badge badge-success">\u6700\u65B0: v\${app.latest_version_name}</span>\` : '<span class="badge badge-warning">\u6682\u65E0\u53D1\u5E03\u7248\u672C</span>'}
                  </div>
                  <div class="app-pkg">\${app.app_id}</div>
                </div>
              </div>

              <div class="app-actions">
                <button class="btn btn-primary btn-sm" onclick="openReleaseModal('\${app.app_id}', '\${app.name}')">+ \u53D1\u5E03\u65B0\u7248\u672C</button>
                <button class="btn btn-secondary btn-sm" onclick="toggleVersionsDrawer('\${app.app_id}')">\u5386\u53F2\u7248\u672C (\${app.version_count || 0})</button>
                <button class="btn btn-secondary btn-sm" onclick="copyText('\${checkApiUrl}', '\u7248\u672C\u68C0\u6D4B\u63A5\u53E3 URL \u5DF2\u590D\u5236')">\u590D\u5236\u68C0\u6D4B API</button>
                <button class="btn btn-secondary btn-sm" onclick="copyText('\${downloadUrl}', '\u6700\u65B0\u7248\u4E0B\u8F7D\u94FE\u63A5\u5DF2\u590D\u5236')">\u590D\u5236\u4E0B\u8F7D\u94FE\u63A5</button>
                <button class="btn btn-danger btn-sm" onclick="deleteApp('\${app.app_id}')">\u5220\u9664\u5E94\u7528</button>
              </div>
            </div>

            <div class="app-meta-badges">
              <span class="badge">\u603B\u4E0B\u8F7D\u91CF: \${app.total_downloads || 0}</span>
              <span class="badge">\u521B\u5EFA\u65F6\u95F4: \${(app.created_at || '').substring(0, 10)}</span>
              \${app.description ? \`<span style="color: var(--text-dim); font-size: 0.8rem; margin-left: 0.5rem;">\${app.description}</span>\` : ''}
            </div>

            <!-- \u52A8\u6001\u6298\u53E0\u7684\u5386\u53F2\u7248\u672C\u5217\u8868\u5BB9\u5668 -->
            <div id="versions-box-\${app.app_id.replace(/\\./g, '_')}" class="version-container hidden">
              <div style="font-weight: 600; margin-bottom: 0.75rem; color: var(--text-muted);">\u{1F4E6} \u5386\u53F2\u53D1\u5E03\u7248\u672C\u8BB0\u5F55</div>
              <div class="versions-content" id="versions-content-\${app.app_id.replace(/\\./g, '_')}">
                \u52A0\u8F7D\u7248\u672C\u5217\u8868\u4E2D...
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function openCreateAppModal() {
      document.getElementById('app-form-id').value = '';
      document.getElementById('app-form-name').value = '';
      document.getElementById('app-form-icon').value = '';
      document.getElementById('app-form-desc').value = '';
      openModal('modal-create-app');
    }

    async function handleCreateApp(e) {
      e.preventDefault();
      const appId = document.getElementById('app-form-id').value.trim();
      const name = document.getElementById('app-form-name').value.trim();
      const iconUrl = document.getElementById('app-form-icon').value.trim();
      const desc = document.getElementById('app-form-desc').value.trim();

      try {
        const res = await apiRequest('/api/admin/apps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ app_id: appId, name, icon_url: iconUrl, description: desc })
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u5E94\u7528\u521B\u5EFA\u6210\u529F');
          closeModal('modal-create-app');
          loadApps();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u521B\u5EFA\u5931\u8D25: ' + err.message, 'error');
      }
    }

    async function deleteApp(appId) {
      if (!confirm(\`\u786E\u5B9A\u8981\u5220\u9664\u5E94\u7528 \${appId} \u5417\uFF1F\u6240\u6709\u5386\u53F2\u7248\u672C\u53CA\u5BF9\u5E94\u7684 APK \u6587\u4EF6\u5C06\u88AB\u6C38\u4E45\u6E05\u7406\uFF01\`)) return;

      try {
        const res = await apiRequest('/api/admin/apps/' + encodeURIComponent(appId), { method: 'DELETE' });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u5E94\u7528\u5DF2\u5220\u9664');
          loadApps();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u5220\u9664\u5931\u8D25: ' + err.message, 'error');
      }
    }

    // Versions Drawer
    async function toggleVersionsDrawer(appId) {
      const safeId = appId.replace(/\\./g, '_');
      const box = document.getElementById('versions-box-' + safeId);
      const content = document.getElementById('versions-content-' + safeId);

      if (!box.classList.contains('hidden')) {
        box.classList.add('hidden');
        return;
      }

      box.classList.remove('hidden');
      content.innerHTML = '\u6B63\u5728\u52A0\u8F7D\u7248\u672C\u8BB0\u5F55...';

      try {
        const res = await apiRequest('/api/admin/apps/' + encodeURIComponent(appId) + '/versions');
        const data = await res.json();
        if (data.code === 0) {
          const versions = data.data || [];
          if (!versions.length) {
            content.innerHTML = '<div style="color: var(--text-dim); font-size: 0.85rem;">\u8BE5\u5E94\u7528\u6682\u65E0\u53D1\u5E03\u4EFB\u4F55\u7248\u672C</div>';
            return;
          }

          content.innerHTML = versions.map(v => {
            const downloadUrl = \`\${window.location.origin}/api/v1/app/download?app_id=\${encodeURIComponent(v.app_id)}&version_code=\${v.version_code}\`;
            return \`
              <div class="version-item">
                <div class="ver-left">
                  <div class="ver-header">
                    <span class="ver-title">v\${v.version_name}</span>
                    <span class="ver-code">(Code: \${v.version_code})</span>
                    <span class="badge badge-accent">\${v.channel}</span>
                    \${v.is_force_update ? '<span class="badge badge-warning">\u5F3A\u5236\u66F4\u65B0</span>' : ''}
                    \${v.is_published ? '<span class="badge badge-success">\u5DF2\u53D1\u5E03</span>' : '<span class="badge">\u5DF2\u4E0B\u67B6</span>'}
                  </div>
                  \${v.changelog ? \`<div class="ver-log">\${v.changelog}</div>\` : ''}
                  <div class="ver-meta">
                    <span>\u6587\u4EF6: \${v.file_name} (\${formatBytes(v.file_size)})</span>
                    <span>\u4E0B\u8F7D\u91CF: \${v.download_count} \u6B21</span>
                    <span>\u53D1\u5E03\u4E8E: \${v.created_at ? v.created_at.substring(0, 19).replace('T', ' ') : ''}</span>
                    \${v.file_md5 ? \`<span>MD5: \${v.file_md5}</span>\` : ''}
                  </div>
                </div>

                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button class="btn btn-secondary btn-sm" onclick="copyText('\${downloadUrl}', '\u6307\u5B9A\u7248\u672C\u4E0B\u8F7D\u94FE\u63A5\u5DF2\u590D\u5236')">\u590D\u5236\u4E0B\u8F7D\u94FE\u63A5</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteVersion('\${v.id}', '\${v.app_id}')">\u5220\u9664</button>
                </div>
              </div>
            \`;
          }).join('');
        }
      } catch (err) {
        content.innerHTML = '<div style="color: var(--danger);">\u52A0\u8F7D\u5931\u8D25</div>';
      }
    }

    async function deleteVersion(versionId, appId) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u8BE5\u7248\u672C\u53CA\u5BF9\u5E94\u7684 APK \u5B58\u50A8\u6587\u4EF6\u5417\uFF1F')) return;
      try {
        const res = await apiRequest('/api/admin/versions/' + versionId, { method: 'DELETE' });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u7248\u672C\u5DF2\u5220\u9664');
          loadApps();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u5220\u9664\u5931\u8D25: ' + err.message, 'error');
      }
    }

    // Release Version Modal & Upload
    function openReleaseModal(appId, appName) {
      pendingUploadResult = null;
      document.getElementById('ver-modal-title').innerText = \`\u53D1\u5E03\u65B0\u7248\u672C - \${appName}\`;
      document.getElementById('ver-form-appid').value = appId;
      document.getElementById('ver-form-name').value = '';
      document.getElementById('ver-form-code').value = '';
      document.getElementById('ver-form-mincode').value = '0';
      document.getElementById('ver-form-channel').value = 'default';
      document.getElementById('ver-form-log').value = '';
      document.getElementById('ver-form-force').checked = false;
      document.getElementById('drop-apk-text').innerText = '\u70B9\u51FB\u6216\u5C06 APK \u6587\u4EF6\u62D6\u62FD\u81F3\u6B64\u533A\u57DF';
      document.getElementById('apk-progress-wrap').style.display = 'none';
      document.getElementById('apk-upload-status').innerText = '';
      document.getElementById('btn-release-submit').disabled = true;
      document.getElementById('file-apk-input').value = '';
      openModal('modal-release-version');
    }

    // File selection & Direct/Multipart upload handler
    async function onFileSelected(input, type) {
      const file = input.files[0];
      if (!file) return;

      if (type === 'apk') {
        document.getElementById('drop-apk-text').innerText = \`\u5DF2\u9009\u62E9: \${file.name} (\${formatBytes(file.size)})\`;
        await uploadFileToR2(file, 'apk', 'apk-progress-wrap', 'apk-progress-bar', 'apk-upload-status', 'btn-release-submit');
      } else {
        document.getElementById('drop-gen-text').innerText = \`\u5DF2\u9009\u62E9: \${file.name} (\${formatBytes(file.size)})\`;
        document.getElementById('gen-form-name').value = file.name;
        await uploadFileToR2(file, 'general', 'gen-progress-wrap', 'gen-progress-bar', null, 'btn-gen-submit');
      }
    }

    async function uploadFileToR2(file, category, progressWrapId, progressBarId, statusTextId, submitBtnId) {
      const wrap = document.getElementById(progressWrapId);
      const bar = document.getElementById(progressBarId);
      const submitBtn = document.getElementById(submitBtnId);
      wrap.style.display = 'block';
      bar.style.width = '0%';
      if (statusTextId) document.getElementById(statusTextId).innerText = '\u51C6\u5907\u4E0A\u4F20\u4E2D...';

      try {
        // \u5927\u6587\u4EF6\u5206\u7247\u4E0A\u4F20 (\u5927\u4E8E 80MB) \u6216\u6807\u51C6\u76F4\u63A5\u76F4\u4F20
        if (file.size > 80 * 1024 * 1024) {
          if (statusTextId) document.getElementById(statusTextId).innerText = '\u5927\u6587\u4EF6\u5206\u7247\u521D\u59CB\u5316\u4E2D...';
          const initRes = await apiRequest('/api/admin/upload/multipart/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, category, mimeType: file.type })
          });
          const initData = await initRes.json();
          if (initData.code !== 0) throw new Error(initData.message);

          const { upload_id, file_key } = initData.data;
          const chunkSize = 10 * 1024 * 1024; // 10MB per part
          const totalParts = Math.ceil(file.size / chunkSize);
          const parts = [];

          for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
            const start = (partNumber - 1) * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            if (statusTextId) {
              document.getElementById(statusTextId).innerText = \`\u6B63\u5728\u4E0A\u4F20\u5206\u7247 \${partNumber}/\${totalParts} (\${Math.round((start / file.size) * 100)}%)...\`;
            }

            const partRes = await apiRequest(\`/api/admin/upload/multipart/part?uploadId=\${upload_id}&fileKey=\${encodeURIComponent(file_key)}&partNumber=\${partNumber}\`, {
              method: 'PUT',
              body: chunk
            });
            const partData = await partRes.json();
            if (partData.code !== 0) throw new Error(partData.message);

            parts.push({ partNumber, etag: partData.data.etag });
            bar.style.width = Math.round((end / file.size) * 100) + '%';
          }

          if (statusTextId) document.getElementById(statusTextId).innerText = '\u5206\u7247\u5B8C\u6210\uFF0C\u6B63\u5728\u5408\u5E76\u6587\u4EF6...';
          const compRes = await apiRequest('/api/admin/upload/multipart/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              upload_id,
              file_key,
              parts,
              file_name: file.name,
              file_size: file.size
            })
          });
          const compData = await compRes.json();
          if (compData.code !== 0) throw new Error(compData.message);

          pendingUploadResult = compData.data;
        } else {
          // \u5E38\u89C4\u6587\u4EF6\u5355\u6B21\u76F4\u4F20
          if (statusTextId) document.getElementById(statusTextId).innerText = '\u6B63\u5728\u6D41\u5F0F\u4E0A\u4F20\u5230 Cloudflare R2...';
          const formData = new FormData();
          formData.append('file', file);
          formData.append('category', category);

          bar.style.width = '50%';
          const res = await apiRequest('/api/admin/upload/direct', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.code !== 0) throw new Error(data.message);

          bar.style.width = '100%';
          pendingUploadResult = data.data;
        }

        if (statusTextId) document.getElementById(statusTextId).innerText = '\u2705 \u4E0A\u4F20\u6210\u529F\u5E76\u5DF2\u5C31\u7EEA';
        if (submitBtn) submitBtn.disabled = false;
        showToast('\u6587\u4EF6\u5DF2\u4E0A\u4F20\u81F3 R2');
      } catch (err) {
        if (statusTextId) document.getElementById(statusTextId).innerText = '\u274C \u4E0A\u4F20\u5931\u8D25: ' + err.message;
        showToast('\u4E0A\u4F20\u5931\u8D25: ' + err.message, 'error');
      }
    }

    async function handleReleaseVersion(e) {
      e.preventDefault();
      if (!pendingUploadResult) {
        showToast('\u8BF7\u5148\u9009\u62E9\u5E76\u4E0A\u4F20 APK \u6587\u4EF6', 'error');
        return;
      }

      const appId = document.getElementById('ver-form-appid').value;
      const versionName = document.getElementById('ver-form-name').value.trim();
      const versionCode = parseInt(document.getElementById('ver-form-code').value, 10);
      const minVersionCode = parseInt(document.getElementById('ver-form-mincode').value, 10) || 0;
      const channel = document.getElementById('ver-form-channel').value.trim() || 'default';
      const changelog = document.getElementById('ver-form-log').value.trim();
      const isForce = document.getElementById('ver-form-force').checked ? 1 : 0;

      try {
        const res = await apiRequest('/api/admin/apps/' + encodeURIComponent(appId) + '/versions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            version_name: versionName,
            version_code: versionCode,
            min_version_code: minVersionCode,
            channel,
            changelog,
            is_force_update: isForce,
            is_published: 1,
            file_key: pendingUploadResult.file_key,
            file_name: pendingUploadResult.file_name,
            file_size: pendingUploadResult.file_size,
            file_md5: pendingUploadResult.file_md5
          })
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u7248\u672C\u53D1\u5E03\u6210\u529F\uFF01');
          closeModal('modal-release-version');
          loadApps();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u53D1\u5E03\u5931\u8D25: ' + err.message, 'error');
      }
    }

    // Generic Files Management
    async function loadFiles() {
      try {
        const res = await apiRequest('/api/admin/files');
        const data = await res.json();
        if (data.code === 0) {
          filesData = data.data?.files || [];
          renderFiles();
        }
      } catch (e) {}
    }

    function renderFiles() {
      const tbody = document.getElementById('files-table-body');
      if (!filesData.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 2rem;">\u6682\u65E0\u901A\u7528\u6587\u4EF6\u8BB0\u5F55</td></tr>';
        return;
      }

      const origin = window.location.origin;

      tbody.innerHTML = filesData.map(f => {
        const directUrl = \`\${origin}/api/v1/files/\${f.id}/download\`;
        const aliasUrl = f.alias ? \`\${origin}/f/\${f.alias}\` : null;

        return \`
          <tr>
            <td>
              <div style="font-weight: 600;">\${f.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">\${f.file_name}</div>
            </td>
            <td><span class="badge">\${f.category || 'general'}</span></td>
            <td class="mono" style="font-size: 0.8rem;">\${formatBytes(f.file_size)}</td>
            <td>
              \${aliasUrl ? \`<a href="\${aliasUrl}" target="_blank" class="mono" style="color: var(--accent); text-decoration: none;">/f/\${f.alias}</a>\` : '<span style="color: var(--text-dim);">-</span>'}
            </td>
            <td>\${f.download_count}</td>
            <td style="font-size: 0.8rem; color: var(--text-dim);">\${(f.created_at || '').substring(0, 10)}</td>
            <td style="text-align: right;">
              <button class="btn btn-secondary btn-sm" onclick="copyText('\${aliasUrl || directUrl}', '\u4E0B\u8F7D\u94FE\u63A5\u5DF2\u590D\u5236')">\u590D\u5236\u94FE\u63A5</button>
              <button class="btn btn-danger btn-sm" onclick="deleteFile('\${f.id}')">\u5220\u9664</button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function openUploadFileModal() {
      pendingUploadResult = null;
      document.getElementById('drop-gen-text').innerText = '\u70B9\u51FB\u6216\u5C06\u6587\u4EF6\u62D6\u62FD\u81F3\u6B64';
      document.getElementById('gen-progress-wrap').style.display = 'none';
      document.getElementById('gen-form-name').value = '';
      document.getElementById('gen-form-cat').value = 'general';
      document.getElementById('gen-form-alias').value = '';
      document.getElementById('btn-gen-submit').disabled = true;
      document.getElementById('file-generic-input').value = '';
      openModal('modal-upload-file');
    }

    async function handleUploadGenericFile(e) {
      e.preventDefault();
      if (!pendingUploadResult) {
        showToast('\u8BF7\u5148\u9009\u62E9\u6587\u4EF6', 'error');
        return;
      }

      const name = document.getElementById('gen-form-name').value.trim();
      const category = document.getElementById('gen-form-cat').value.trim() || 'general';
      const alias = document.getElementById('gen-form-alias').value.trim() || undefined;

      try {
        const res = await apiRequest('/api/admin/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            category,
            alias,
            file_key: pendingUploadResult.file_key,
            file_name: pendingUploadResult.file_name,
            file_size: pendingUploadResult.file_size,
            mime_type: pendingUploadResult.mime_type,
            file_md5: pendingUploadResult.file_md5
          })
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u901A\u7528\u6587\u4EF6\u5DF2\u4FDD\u5B58');
          closeModal('modal-upload-file');
          loadFiles();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u4FDD\u5B58\u5931\u8D25: ' + err.message, 'error');
      }
    }

    async function deleteFile(id) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u6B64\u6587\u4EF6\u5417\uFF1F')) return;
      try {
        const res = await apiRequest('/api/admin/files/' + id, { method: 'DELETE' });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u6587\u4EF6\u5DF2\u5220\u9664');
          loadFiles();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u5220\u9664\u5931\u8D25: ' + err.message, 'error');
      }
    }

    // Settings Management
    async function loadSettings() {
      try {
        const res = await apiRequest('/api/admin/settings');
        const data = await res.json();
        if (data.code === 0 && data.data) {
          settingsData = data.data;
          document.getElementById('cfg-token-enabled').checked = settingsData['api_token_enabled'] === 'true';
          document.getElementById('cfg-fixed-token').value = settingsData['api_fixed_token'] || '';
          document.getElementById('cfg-app-check-token').checked = settingsData['app_check_require_token'] === 'true';
          document.getElementById('cfg-app-download-token').checked = settingsData['app_download_require_token'] === 'true';
          document.getElementById('cfg-file-download-token').checked = settingsData['file_download_require_token'] === 'true';
          document.getElementById('cfg-auto-cleanup-enabled').checked = settingsData['auto_cleanup_enabled'] === 'true';
          document.getElementById('cfg-auto-cleanup-days').value = settingsData['auto_cleanup_days'] || '90';
          document.getElementById('cfg-auto-cleanup-keep').value = settingsData['auto_cleanup_keep_latest'] || '3';
        }
      } catch (e) {}
    }

    async function generateRandomToken() {
      try {
        const res = await apiRequest('/api/admin/settings/generate-token', { method: 'POST' });
        const data = await res.json();
        if (data.code === 0 && data.data?.token) {
          document.getElementById('cfg-fixed-token').value = data.data.token;
          showToast('\u5DF2\u751F\u6210\u65B0 Token\uFF0C\u8BF7\u70B9\u51FB\u53F3\u4E0A\u89D2\u4FDD\u5B58');
        }
      } catch (e) {}
    }

    async function saveSettings() {
      const payload = {
        api_token_enabled: document.getElementById('cfg-token-enabled').checked ? 'true' : 'false',
        api_fixed_token: document.getElementById('cfg-fixed-token').value.trim(),
        app_check_require_token: document.getElementById('cfg-app-check-token').checked ? 'true' : 'false',
        app_download_require_token: document.getElementById('cfg-app-download-token').checked ? 'true' : 'false',
        file_download_require_token: document.getElementById('cfg-file-download-token').checked ? 'true' : 'false',
        auto_cleanup_enabled: document.getElementById('cfg-auto-cleanup-enabled').checked ? 'true' : 'false',
        auto_cleanup_days: document.getElementById('cfg-auto-cleanup-days').value.trim() || '90',
        auto_cleanup_keep_latest: document.getElementById('cfg-auto-cleanup-keep').value.trim() || '3'
      };

      try {
        const res = await apiRequest('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u7CFB\u7EDF\u8BBE\u7F6E\u4FDD\u5B58\u6210\u529F\uFF01');
          settingsData = data.data;
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u4FDD\u5B58\u5931\u8D25: ' + err.message, 'error');
      }
    }

    async function runManualCleanup() {
      const resultEl = document.getElementById('cleanup-result');
      resultEl.textContent = '\u23F3 \u6B63\u5728\u6267\u884C\u6E05\u7406...';
      resultEl.style.color = 'var(--text-muted)';
      try {
        const res = await apiRequest('/api/admin/cleanup', { method: 'POST' });
        const data = await res.json();
        if (data.code === 0) {
          const r = data.data;
          if (!r.enabled) {
            resultEl.textContent = '\u26A0\uFE0F \u81EA\u52A8\u6E05\u7406\u672A\u542F\u7528\uFF0C\u8BF7\u5148\u5F00\u542F\u5F00\u5173\u5E76\u4FDD\u5B58\u8BBE\u7F6E\u540E\u518D\u6267\u884C';
            resultEl.style.color = '#fbbf24';
          } else if (r.deleted === 0) {
            resultEl.textContent = '\u2705 \u626B\u63CF\u5B8C\u6210\uFF0C\u6CA1\u6709\u53D1\u73B0\u9700\u8981\u6E05\u7406\u7684\u8FC7\u671F\u7248\u672C';
            resultEl.style.color = '#6ee7b7';
          } else {
            const freedMB = (r.freedBytes / 1024 / 1024).toFixed(2);
            resultEl.textContent = '\u2705 \u6E05\u7406\u5B8C\u6210\uFF01\u5DF2\u5220\u9664 ' + r.deleted + ' \u4E2A\u65E7\u7248\u672C\uFF0C\u91CA\u653E ' + freedMB + ' MB \u5B58\u50A8\u7A7A\u95F4';
            resultEl.style.color = '#6ee7b7';
            loadApps();
            loadStats();
          }
          showToast(resultEl.textContent);
        } else {
          resultEl.textContent = '\u274C ' + data.message;
          resultEl.style.color = '#fca5a5';
          showToast(data.message, 'error');
        }
      } catch (err) {
        resultEl.textContent = '\u274C \u6E05\u7406\u5931\u8D25: ' + err.message;
        resultEl.style.color = '#fca5a5';
        showToast('\u6E05\u7406\u5931\u8D25', 'error');
      }
    }

    // Playground
    function setupPlayground() {
      const select = document.getElementById('pg-app-select');
      select.innerHTML = appsData.map(a => \`<option value="\${a.app_id}">\${a.name} (\${a.app_id})</option>\`).join('');
      if (!appsData.length) {
        select.innerHTML = '<option value="">\u6682\u65E0\u5E94\u7528\uFF0C\u8BF7\u5148\u521B\u5EFA</option>';
      }
      onPlaygroundAppChange();
    }

    function onPlaygroundAppChange() {
      updatePlaygroundCurl();
    }

    function updatePlaygroundCurl() {
      const appId = document.getElementById('pg-app-select').value;
      const curVersion = document.getElementById('pg-cur-version').value;
      const channel = document.getElementById('pg-channel').value;
      const token = document.getElementById('pg-token').value.trim();

      const origin = window.location.origin;
      let url = \`\${origin}/api/v1/app/latest?app_id=\${encodeURIComponent(appId)}&version_code=\${curVersion}&channel=\${encodeURIComponent(channel)}\`;
      
      let cmd = \`curl -s "\${url}"\`;
      if (token) {
        cmd = \`curl -s -H "X-Ygg-Token: \${token}" "\${url}"\`;
      }

      document.getElementById('pg-curl').innerText = cmd;
    }

    async function runPlaygroundTest() {
      updatePlaygroundCurl();
      const appId = document.getElementById('pg-app-select').value;
      if (!appId) {
        showToast('\u8BF7\u5148\u9009\u62E9\u4E00\u4E2A\u5E94\u7528', 'error');
        return;
      }

      const curVersion = document.getElementById('pg-cur-version').value;
      const channel = document.getElementById('pg-channel').value;
      const token = document.getElementById('pg-token').value.trim();

      let url = \`/api/v1/app/latest?app_id=\${encodeURIComponent(appId)}&version_code=\${curVersion}&channel=\${encodeURIComponent(channel)}\`;
      const headers = {};
      if (token) headers['X-Ygg-Token'] = token;

      document.getElementById('pg-response').innerText = '\u6B63\u5728\u8BF7\u6C42\u4E2D...';

      try {
        const res = await fetch(url, { headers });
        const data = await res.json();
        document.getElementById('pg-response').innerText = JSON.stringify(data, null, 2);
      } catch (err) {
        document.getElementById('pg-response').innerText = '\u8BF7\u6C42\u51FA\u9519: ' + err.message;
      }
    }

    // Init
    window.addEventListener('DOMContentLoaded', () => {
      checkAuth();
    });
  <\/script>
</body>
</html>`}var x=new _;x.use("*",Je);x.use("/api/*",async(e,t)=>{if(e.req.path==="/api/admin/login"||e.req.path==="/api/admin/logout"||e.req.path==="/api/admin/me"||e.req.path==="/health")return await t();if(!e.env||!e.env.DB)return e.json({code:500,message:'\u3010Cloudflare \u7ED1\u5B9A\u7F3A\u5931\u3011\u672A\u68C0\u6D4B\u5230 D1 \u6570\u636E\u5E93\u7ED1\u5B9A\u3002\u8BF7\u524D\u5F80 Cloudflare \u63A7\u5236\u53F0 -> Workers -> yggdrasil -> Settings -> Bindings -> \u6DFB\u52A0 D1 \u6570\u636E\u5E93\u7ED1\u5B9A\uFF0C\u53D8\u91CF\u540D\u79F0\u5FC5\u987B\u586B\u5199\u4E3A "DB"\uFF08\u5927\u5199\uFF09\uFF0C\u5E76\u9009\u62E9\u60A8\u7684 D1 \u6570\u636E\u5E93\uFF08\u5982 ygg-db\uFF09\u3002'},500);if(e.req.path.startsWith("/api/admin/upload")&&!e.env.BUCKET)return e.json({code:500,message:'\u3010Cloudflare \u7ED1\u5B9A\u7F3A\u5931\u3011\u672A\u68C0\u6D4B\u5230 R2 \u5B58\u50A8\u6876\u7ED1\u5B9A\u3002\u8BF7\u524D\u5F80 Cloudflare \u63A7\u5236\u53F0 -> Workers -> yggdrasil -> Settings -> Bindings -> \u6DFB\u52A0 R2 \u5B58\u50A8\u6876\u7ED1\u5B9A\uFF0C\u53D8\u91CF\u540D\u79F0\u5FC5\u987B\u586B\u5199\u4E3A "BUCKET"\uFF08\u5927\u5199\uFF09\uFF0C\u5E76\u9009\u62E9\u60A8\u7684 R2 \u6876\uFF08\u5982 ygg-storage\uFF09\u3002'},500);await t()});var we=e=>{let t=e.env?.APP_NAME?`${e.env.APP_NAME} - \u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3`:"Yggdrasil - \u5E94\u7528\u4E0E\u6587\u4EF6\u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3";return e.html(et(t))};x.get("/",we);x.get("/admin",we);x.get("/dashboard",we);x.route("/",J);x.route("/",q);x.route("/",z);x.route("/",T);x.route("/",L);x.route("/",M);x.route("/",j);x.get("/health",e=>e.json({status:"ok",system:"Yggdrasil (ygg)",timestamp:new Date().toISOString()}));x.notFound(e=>e.json({code:404,message:`Resource not found: ${e.req.method} ${e.req.url}`},404));x.onError((e,t)=>(console.error("[Yggdrasil Edge Error]:",e),t.json({code:500,message:"Internal Edge Server Error: "+(e.message||"Unknown")},500)));var Yn={fetch:x.fetch,async scheduled(e,t,a){a.waitUntil((async()=>{try{console.log("[Yggdrasil Cron] Starting scheduled auto-cleanup...");let n=await F.runCleanup(t.DB,t.BUCKET);console.log(`[Yggdrasil Cron] Cleanup complete: enabled=${n.enabled}, deleted=${n.deleted}, freedBytes=${n.freedBytes}`)}catch(n){console.error("[Yggdrasil Cron] Scheduled cleanup failed:",n)}})())}};export{Yn as default};
