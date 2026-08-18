var oe=(e,t,a)=>(n,r)=>{let s=-1;return i(0);async function i(o){if(o<=s)throw new Error("next() called multiple times");s=o;let l,d=!1,p;if(e[o]?(p=e[o][0][0],n.req.routeIndex=o):p=o===e.length&&r||void 0,p)try{l=await p(n,()=>i(o+1))}catch(c){if(c instanceof Error&&t)n.error=c,l=await t(c,n),d=!0;else throw c}else n.finalized===!1&&a&&(l=await a(n));return l&&(n.finalized===!1||d)&&(n.res=l),n}};var xe=Symbol();var Te=(e,t)=>new Response(e,{headers:{"Content-Type":t.replace(/^[^;]+/,n=>n.toLowerCase())}}).formData();var Q=e=>"headers"in e,ke=async(e,t=Object.create(null))=>{let{all:a=!1,dot:n=!1}=t,i=(Q(e)?e.headers:e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();return i==="multipart/form-data"||i==="application/x-www-form-urlencoded"?at(e,{all:a,dot:n}):{}};async function at(e,t){if(!Q(e)&&e.bodyCache.formData)return Re(await e.bodyCache.formData,t);let a=Q(e)?e.headers:e.raw.headers,n=await e.arrayBuffer(),r=Te(n,a.get("Content-Type")||"");Q(e)||(e.bodyCache.formData=r);let s=await r;return s?Re(s,t):{}}function Re(e,t){let a=Object.create(null);return e.forEach((n,r)=>{t.all||r.endsWith("[]")?nt(a,r,n):a[r]=n}),t.dot&&Object.entries(a).forEach(([n,r])=>{n.includes(".")&&(rt(a,n,r),delete a[n])}),a}var nt=(e,t,a)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(a):e[t]=[e[t],a]:t.endsWith("[]")?e[t]=[a]:e[t]=a},rt=(e,t,a)=>{if(/(?:^|\.)__proto__\./.test(t))return;let n=e,r=t.split(".");r.forEach((s,i)=>{i===r.length-1?n[s]=a:((!n[s]||typeof n[s]!="object"||Array.isArray(n[s])||n[s]instanceof File)&&(n[s]=Object.create(null)),n=n[s])})};var de=e=>{let t=e.split("/");return t[0]===""&&t.shift(),t},Ae=e=>{let{groups:t,path:a}=st(e),n=de(a);return it(n,t)},st=e=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(a,n)=>{let r=`@${n}`;return t.push([r,a]),r}),{groups:t,path:e}},it=(e,t)=>{for(let a=t.length-1;a>=0;a--){let[n]=t[a];for(let r=e.length-1;r>=0;r--)if(e[r].includes(n)){e[r]=e[r].replace(n,t[a][1]);break}}return e},X={},Ie=(e,t)=>{if(e==="*")return"*";let a=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(a){let n=`${e}#${t}`;return X[n]||(a[2]?X[n]=t&&t[0]!==":"&&t[0]!=="*"?[n,a[1],new RegExp(`^${a[2]}(?=/${t})`)]:[e,a[1],new RegExp(`^${a[2]}$`)]:X[n]=[e,a[1],!0]),X[n]}return null},Se=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,a=>{try{return t(a)}catch{return a}})}},ot=e=>Se(e,decodeURI),ce=e=>{let t=e.url,a=t.indexOf("/",t.indexOf(":")+4),n=a;for(;n<t.length;n++){let r=t.charCodeAt(n);if(r===37){let s=t.indexOf("?",n),i=t.indexOf("#",n),o=s===-1?i===-1?void 0:i:i===-1?s:Math.min(s,i),l=t.slice(a,o);return ot(l.includes("%25")?l.replace(/%25/g,"%2525"):l)}else if(r===63||r===35)break}return t.slice(a,n)};var De=e=>{let t=ce(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},O=(e,t,...a)=>(a.length&&(t=O(t,...a)),`${e?.[0]==="/"?"":"/"}${e}${t==="/"?"":`${e?.at(-1)==="/"?"":"/"}${t?.[0]==="/"?t.slice(1):t}`}`),Z=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;let t=e.split("/"),a=[],n="";return t.forEach(r=>{if(r!==""&&!/\:/.test(r))n+="/"+r;else if(/\:/.test(r))if(r.charCodeAt(r.length-1)===63){a.length===0&&n===""?a.push("/"):a.push(n);let s=r.slice(0,-1);n+="/"+s,a.push(n)}else n+="/"+r}),a.filter((r,s,i)=>i.indexOf(r)===s)},ee=e=>e.indexOf("%")!==-1?Se(e,lt):e,le=e=>(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),ee(e)),Ce=(e,t,a)=>{let n;if(!a&&t&&t.indexOf("%")===-1&&t.indexOf("+")===-1){let i=e.indexOf("?",8);if(i===-1)return;for(e.startsWith(t,i+1)||(i=e.indexOf(`&${t}`,i+1));i!==-1;){let o=e.charCodeAt(i+t.length+1);if(o===61){let l=i+t.length+2,d=e.indexOf("&",l);return le(e.slice(l,d===-1?void 0:d))}else if(o==38||isNaN(o))return"";i=e.indexOf(`&${t}`,i+1)}if(n=/[%+]/.test(e),!n)return}let r=Object.create(null);n??=/[%+]/.test(e);let s=e.indexOf("?",8);for(;s!==-1;){let i=e.indexOf("&",s+1),o=e.indexOf("=",s);o>i&&i!==-1&&(o=-1);let l=e.slice(s+1,o===-1?i===-1?void 0:i:o);if(n&&(l=le(l)),s=i,l==="")continue;let d;o===-1?d="":(d=e.slice(o+1,i===-1?void 0:i),n&&(d=le(d))),a?(r[l]&&Array.isArray(r[l])||(r[l]=[]),r[l].push(d)):r[l]??=d}return t?r[t]:r},Oe=Ce,Be=(e,t)=>Ce(e,t,!0),lt=decodeURIComponent;var Pe=class{raw;#t;#e;routeIndex=0;path;bodyCache={};constructor(e,t="/",a=[[]]){this.raw=e,this.path=t,this.#e=a}param(e){return e?this.#a(e):this.#s()}#a(e){let t=this.#e[0][this.routeIndex][1][e],a=this.#n(t);return a&&ee(a)}#s(){let e={},t=Object.keys(this.#e[0][this.routeIndex][1]);for(let a of t){let n=this.#n(this.#e[0][this.routeIndex][1][a]);n!==void 0&&(e[a]=ee(n))}return e}#n(e){return this.#e[1]?this.#e[1][e]:e}query(e){return Oe(this.url,e)}queries(e){return Be(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t=Object.create(null);return this.raw.headers.forEach((a,n)=>{t[n]=a}),t}async parseBody(e){return ke(this,e)}#r=e=>{let{bodyCache:t,raw:a}=this,n=t[e];if(n)return n;for(let r in t)return t[r].then(s=>(r==="json"&&(s=JSON.stringify(s)),new Response(s)[e]()));return t[e]=a[e]()};json(){return this.#r("text").then(e=>JSON.parse(e))}text(){return this.#r("text")}arrayBuffer(){return this.#r("arrayBuffer")}bytes(){return this.#r("arrayBuffer").then(e=>new Uint8Array(e))}blob(){return this.#r("blob")}formData(){return this.#r("formData")}addValidatedData(e,t){(this.#t??={})[e]=t}valid(e){return this.#t?.[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[xe](){return this.#e}get matchedRoutes(){return this.#e[0].map(([[,e]])=>e)}get routePath(){return this.#e[0].map(([[,e]])=>e)[this.routeIndex].path}};var Me={Stringify:1,BeforeStream:2,Stream:3},dt=(e,t)=>{let a=new String(e);return a.isEscaped=!0,a.callbacks=t,a};var pe=async(e,t,a,n,r)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));let s=e.callbacks;if(!s?.length)return Promise.resolve(e);r?r[0]+=e:r=[e];let i=Promise.all(s.map(o=>o({phase:t,buffer:r,context:n}))).then(o=>Promise.all(o.filter(Boolean).map(l=>pe(l,t,!1,n,r))).then(()=>r[0]));return a?dt(await i,s):i};var ct="text/plain; charset=UTF-8",me=(e,t)=>({"Content-Type":e,...t}),V=(e,t)=>new Response(e,t),ue=class{#t;#e;env={};#a;finalized=!1;error;#s;#n;#r;#c;#l;#d;#o;#p;#m;constructor(e,t){this.#t=e,t&&(this.#n=t.executionCtx,this.env=t.env,this.#d=t.notFoundHandler,this.#m=t.path,this.#p=t.matchResult)}get req(){return this.#e??=new Pe(this.#t,this.#m,this.#p),this.#e}get event(){if(this.#n&&"respondWith"in this.#n)return this.#n;throw Error("This context has no FetchEvent")}get executionCtx(){if(this.#n)return this.#n;throw Error("This context has no ExecutionContext")}get res(){return this.#r||=V(null,{headers:this.#o??=new Headers})}set res(e){if(this.#r&&e){e=V(e.body,e);for(let[t,a]of this.#r.headers.entries())if(t!=="content-type")if(t==="set-cookie"){let n=this.#r.headers.getSetCookie();e.headers.delete("set-cookie");for(let r of n)e.headers.append("set-cookie",r)}else e.headers.set(t,a)}this.#r=e,this.finalized=!0}render=(...e)=>(this.#l??=t=>this.html(t),this.#l(...e));setLayout=e=>this.#c=e;getLayout=()=>this.#c;setRenderer=e=>{this.#l=e};header=(e,t,a)=>{this.finalized&&(this.#r=V(this.#r.body,this.#r));let n=this.#r?this.#r.headers:this.#o??=new Headers;t===void 0?n.delete(e):a?.append?n.append(e,t):n.set(e,t)};status=e=>{this.#s=e};set=(e,t)=>{this.#a??=new Map,this.#a.set(e,t)};get=e=>this.#a?this.#a.get(e):void 0;get var(){return this.#a?Object.fromEntries(this.#a):{}}#i(e,t,a){let n=this.#r?new Headers(this.#r.headers):this.#o;if(typeof t=="object"&&t.headers){n??=new Headers;for(let[s,i]of new Headers(t.headers))s==="set-cookie"?n.append(s,i):n.set(s,i)}if(a){if(!n){let s=0;for(let i in a)if(++s>1||typeof a[i]!="string"){n=new Headers;break}}if(n)for(let s in a){let i=a[s];if(typeof i=="string")n.set(s,i);else{n.delete(s);for(let o of i)n.append(s,o)}}}let r=typeof t=="number"?t:t?.status??this.#s;return V(e,{status:r,headers:n??a})}newResponse=(...e)=>this.#i(...e);body=(e,t,a)=>this.#i(e,t,a);text=(e,t,a)=>!this.#o&&!this.#s&&!t&&!a&&!this.finalized?new Response(e):this.#i(e,t,me(ct,a));json=(e,t,a)=>this.#i(JSON.stringify(e),t,me("application/json",a));html=(e,t,a)=>{let n=r=>this.#i(r,t,me("text/html; charset=UTF-8",a));return typeof e=="object"?pe(e,Me.Stringify,!1,{}).then(n):n(e)};redirect=(e,t)=>{let a=String(e);return this.header("Location",/[^\x00-\xFF]/.test(a)?encodeURI(a):a),this.newResponse(null,t??302)};notFound=()=>(this.#d??=()=>V(),this.#d(this))};var g="ALL",Le="all",je=["get","post","put","delete","options","patch","query"],te="Can not add a route since the matcher is already built.",ae=class extends Error{};var Ne="__COMPOSED_HANDLER";var pt=e=>e.text("404 Not Found",404),Ue=(e,t)=>{if("getResponse"in e){let a=e.getResponse();return t.newResponse(a.body,a)}return console.error(e),t.text("Internal Server Error",500)},Fe=class $e{get;post;put;delete;options;patch;query;all;on;use;router;getPath;_basePath="/";#t="/";routes=[];constructor(t={}){[...je,Le].forEach(s=>{this[s]=(i,...o)=>(typeof i=="string"?this.#t=i:this.#s(s,this.#t,i),o.forEach(l=>{this.#s(s,this.#t,l)}),this)}),this.on=(s,i,...o)=>{for(let l of[i].flat()){this.#t=l;for(let d of[s].flat())o.map(p=>{this.#s(d.toUpperCase(),this.#t,p)})}return this},this.use=(s,...i)=>(typeof s=="string"?this.#t=s:(this.#t="*",i.unshift(s)),i.forEach(o=>{this.#s(g,this.#t,o)}),this);let{strict:n,...r}=t;Object.assign(this,r),this.getPath=n??!0?t.getPath??ce:De}#e(){let t=new $e({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,t.#a=this.#a,t.routes=this.routes,t}#a=pt;errorHandler=Ue;route(t,a){let n=this.basePath(t);return a.routes.map(r=>{let s;a.errorHandler===Ue?s=r.handler:(s=async(i,o)=>(await oe([],a.errorHandler)(i,()=>r.handler(i,o))).res,s[Ne]=r.handler),n.#s(r.method,r.path,s,r.basePath)}),this}basePath(t){let a=this.#e();return a._basePath=O(this._basePath,t),a}onError=t=>(this.errorHandler=t,this);notFound=t=>(this.#a=t,this);mount(t,a,n){let r,s;n&&(typeof n=="function"?s=n:(s=n.optionHandler,n.replaceRequest===!1?r=l=>l:r=n.replaceRequest));let i=s?l=>{let d=s(l);return Array.isArray(d)?d:[d]}:l=>{let d;try{d=l.executionCtx}catch{}return[l.env,d]};r||=(()=>{let l=O(this._basePath,t),d=l==="/"?0:l.length;return p=>{let c=new URL(p.url);return c.pathname=this.getPath(p).slice(d)||"/",new Request(c,p)}})();let o=async(l,d)=>{let p=await a(r(l.req.raw),...i(l));if(p)return p;await d()};return this.#s(g,O(t,"*"),o),this}#s(t,a,n,r){t=t.toUpperCase(),a=O(this._basePath,a);let s={basePath:r!==void 0?O(this._basePath,r):this._basePath,path:a,method:t,handler:n};this.router.add(t,a,[n,s]),this.routes.push(s)}#n(t,a){if(t instanceof Error)return this.errorHandler(t,a);throw t}#r(t,a,n,r){if(r==="HEAD")return(async()=>new Response(null,await this.#r(t,a,n,"GET")))();let s=this.getPath(t,{env:n}),i=this.router.match(r,s),o=new ue(t,{path:s,matchResult:i,env:n,executionCtx:a,notFoundHandler:this.#a});if(i[0].length===1){let d;try{d=i[0][0][0][0](o,async()=>{o.res=await this.#a(o)})}catch(p){return this.#n(p,o)}return d instanceof Promise?d.then(p=>p||(o.finalized?o.res:this.#a(o))).catch(p=>this.#n(p,o)):d??this.#a(o)}let l=oe(i[0],this.errorHandler,this.#a);return(async()=>{try{let d=await l(o);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return this.#n(d,o)}})()}fetch=(t,...a)=>this.#r(t,a[1],a[0],t.method);request=(t,a,n,r)=>t instanceof Request?this.fetch(a?new Request(t,a):t,n,r):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${O("/",t)}`,a),n,r));fire=()=>{addEventListener("fetch",t=>{t.respondWith(this.#r(t.request,t,void 0,t.request.method))})}};var ne=[];function fe(e,t){let a=this.buildAllMatchers(),n=((r,s)=>{let i=a[r]||a[g],o=i[2][s];if(o)return o;let l=s.match(i[0]);if(!l)return[[],ne];let d=l.indexOf("",1);return[i[1][d],l]});return this.match=n,n(e,t)}var re="[^/]+",U=".*",N="(?:|/.*)",B=Symbol(),qe=new Set(".\\+*[^]$()");function mt(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1?1:e===U||e===N?t===N?-1:1:t===U||t===N?-1:e===re?1:t===re?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var He=class ge{#t;#e;#a=Object.create(null);insert(t,a,n,r,s){let i=this;for(let o=0,l=t.length;o<l;o++){let d=t[o],p=d.length===1?d==="*"?o===l-1?["","",U]:["","",re]:null:d==="/*"?["","",N]:d.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),c;if(p){let m=p[1],u=p[2]||re;if(m&&p[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))||u.length===1&&qe.has(u)))throw B;if(c=i.#a[u],!c){if(u!==U&&u!==N){for(let y in i.#a)if((u.length>1||y.length>1)&&y!==U&&y!==N)throw B}c=i.#a[u]=new ge}m!==""&&(c.#e??=r.varIndex++,n.push([m,c.#e]))}else if(c=i.#a[d],!c){for(let m in i.#a)if(m.length>1&&m!==U&&m!==N)throw B;c=i.#a[d]=new ge}i=c}if(i.#t!==void 0)throw B;i.#t=s?-1:a}buildRegExpStr(){let a=Object.keys(this.#a).sort(mt).map(n=>{let r=this.#a[n],s=r.buildRegExpStr();return s===""?"":(typeof r.#e=="number"?`(${n})@${r.#e}`:qe.has(n)?`\\${n}`:n)+s}).filter(Boolean);return typeof this.#t=="number"&&this.#t!==-1&&a.unshift(`#${this.#t}`),a.length===0?"":a.length===1?a[0]:"(?:"+a.join("|")+")"}};var he=class{#t={varIndex:0};#e=new He;#a=0;paths=Object.create(null);insert(e,t){if(t){this.#e.insert(e.split(""),0,[],this.#t,!0);return}let a=[],n=[],r=e;for(let i=0;;){let o=!1;if(r=r.replace(/\{[^}]+\}/g,l=>{let d=`@\\${i}`;return n[i]=[d,l],i++,o=!0,d}),!o)break}let s=r.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let i=n.length-1;i>=0;i--){let[o]=n[i];for(let l=s.length-1;l>=0;l--)if(s[l].indexOf(o)!==-1){s[l]=s[l].replace(o,n[i][1]);break}}this.#e.insert(s,this.#a,a,this.#t,!1),this.paths[e]=[this.#a++,a]}buildRegExp(){let e=this.#e.buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0,a=[],n=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(r,s,i)=>s!==void 0?(a[++t]=Number(s),"$()"):(i!==void 0&&(n[Number(i)]=++t),"")),[new RegExp(`^${e}`),a,n]}};var ze=Object.create(null);function Ke(e){return ze[e]??=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,a)=>a?`\\${a}`:"(?:|/.*)")}$`)}function ut(){ze=Object.create(null)}function se(e,t){if(e){for(let a of Object.keys(e).sort((n,r)=>r.length-n.length))if(Ke(a).test(t))return[...e[a]]}}var ie=class{name="RegExpRouter";#t;#e;#a;constructor(){this.#t={[g]:Object.create(null)},this.#e={[g]:Object.create(null)},this.#a={[g]:new he}}#s(e,t){try{this.#a[e].insert(t,!/\*|\/:/.test(t))}catch(a){throw a===B?new ae(t):a}}add(e,t,a){let n=this.#t,r=this.#e;if(!n||!r)throw new Error(te);n[e]||(this.#a[e]=new he,[n,r].forEach(o=>{o[e]=Object.create(null),Object.keys(o[g]).forEach(l=>{o[e][l]=[...o[g][l]],this.#s(e,l)})})),t==="/*"&&(t="*");let s=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){let o=Ke(t);Object.keys(n).forEach(l=>{(e===g||e===l)&&!n[l][t]&&(this.#s(l,t),n[l][t]=se(n[l],t)||se(n[g],t)||[])}),Object.keys(n).forEach(l=>{(e===g||e===l)&&Object.keys(n[l]).forEach(d=>{o.test(d)&&n[l][d].push([a,s])})}),Object.keys(r).forEach(l=>{(e===g||e===l)&&Object.keys(r[l]).forEach(d=>o.test(d)&&r[l][d].push([a,s]))});return}let i=Z(t)||[t];for(let o=0,l=i.length;o<l;o++){let d=i[o];Object.keys(r).forEach(p=>{(e===g||e===p)&&(r[p][d]||(this.#s(p,d),r[p][d]=[...se(n[p],d)||se(n[g],d)||[]]),r[p][d].push([a,s-l+o+1]))})}}match=fe;buildAllMatchers(){let e=Object.create(null);return Object.keys(this.#e).concat(Object.keys(this.#t)).forEach(t=>{e[t]||=this.#n(t)}),this.#t=this.#e=this.#a=void 0,ut(),e}#n(e){let t=this.#t[e],a=this.#e[e],n=this.#a[e],r=Object.create(null),s=[];[t,a].forEach(p=>{for(let c in p){let m=p[c],u=n.paths[c];if(!u){r[c]=[m.map(([R])=>[R,Object.create(null)]),ne];continue}let y=u[1];s[u[0]]=m.map(([R,k])=>{let f=Object.create(null);for(k-=1;k>=0;k--){let[C,H]=y[k];f[C]=H}return[R,f]})}});let[i,o,l]=n.buildRegExp();for(let p=0,c=s.length;p<c;p++)for(let m=0,u=s[p].length;m<u;m++){let y=s[p][m]?.[1];if(!y)continue;let R=Object.keys(y);for(let k=0,f=R.length;k<f;k++)y[R[k]]=l[y[R[k]]]}let d=[];for(let p in o)d[p]=s[o[p]];return[i,d,r]}};var ve=class{name="SmartRouter";#t=[];#e=[];constructor(e){this.#t=e.routers}add(e,t,a){if(!this.#e)throw new Error(te);this.#e.push([e,t,a])}match(e,t){if(!this.#e)throw new Error("Fatal error");let a=this.#t,n=this.#e,r=a.length,s=0,i;for(;s<r;s++){let o=a[s];try{for(let l=0,d=n.length;l<d;l++)o.add(...n[l]);i=o.match(e,t)}catch(l){if(l instanceof ae)continue;throw l}this.match=o.match.bind(o),this.#t=[o],this.#e=void 0;break}if(s===r)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,i}get activeRouter(){if(this.#e||this.#t.length!==1)throw new Error("No active router has been determined yet.");return this.#t[0]}};var W=Object.create(null),ft=e=>{for(let t in e)return!0;return!1},Ve=class We{#t;#e;#a;#s=0;#n=W;constructor(t,a,n){if(this.#e=n||Object.create(null),this.#t=[],t&&a){let r=Object.create(null);r[t]={handler:a,possibleKeys:[],score:0},this.#t=[r]}this.#a=[]}insert(t,a,n){this.#s=++this.#s;let r=this,s=Ae(a),i=[];for(let o=0,l=s.length;o<l;o++){let d=s[o],p=s[o+1],c=Ie(d,p),m=Array.isArray(c)?c[0]:d;if(m in r.#e){r=r.#e[m],c&&i.push(c[1]);continue}r.#e[m]=new We,c&&(r.#a.push(c),i.push(c[1])),r=r.#e[m]}return r.#t.push({[t]:{handler:n,possibleKeys:i.filter((o,l,d)=>d.indexOf(o)===l),score:this.#s}}),r}#r(t,a,n,r,s){for(let i=0,o=a.#t.length;i<o;i++){let l=a.#t[i],d=l[n]||l[g],p={};if(d!==void 0&&(d.params=Object.create(null),t.push(d),r!==W||s&&s!==W))for(let c=0,m=d.possibleKeys.length;c<m;c++){let u=d.possibleKeys[c],y=p[d.score];d.params[u]=s?.[u]&&!y?s[u]:r[u]??s?.[u],p[d.score]=!0}}}search(t,a){let n=[];this.#n=W;let s=[this],i=de(a),o=[],l=i.length,d=null;for(let p=0;p<l;p++){let c=i[p],m=p===l-1,u=[];for(let R=0,k=s.length;R<k;R++){let f=s[R],C=f.#e[c];C&&(C.#n=f.#n,m?(C.#e["*"]&&this.#r(n,C.#e["*"],t,f.#n),this.#r(n,C,t,f.#n)):u.push(C));for(let H=0,et=f.#a.length;H<et;H++){let we=f.#a[H],S=f.#n===W?{}:{...f.#n};if(we==="*"){let j=f.#e["*"];j&&(this.#r(n,j,t,f.#n),j.#n=S,u.push(j));continue}let[tt,Ee,z]=we;if(!c&&!(z instanceof RegExp))continue;let A=f.#e[tt];if(z instanceof RegExp){if(d===null){d=new Array(l);let G=a[0]==="/"?1:0;for(let K=0;K<l;K++)d[K]=G,G+=i[K].length+1}let j=a.substring(d[p]),Y=z.exec(j);if(Y){if(S[Ee]=Y[0],this.#r(n,A,t,f.#n,S),Y[0].length===j.length&&A.#e["*"]&&this.#r(n,A.#e["*"],t,f.#n,S),ft(A.#e)){A.#n=S;let G=Y[0].match(/\//g)?.length??0;(o[G]||=[]).push(A)}continue}}(z===!0||z.test(c))&&(S[Ee]=c,m?(this.#r(n,A,t,S,f.#n),A.#e["*"]&&this.#r(n,A.#e["*"],t,S,f.#n)):(A.#n=S,u.push(A)))}}let y=o.shift();s=y?u.concat(y):u}return n.length>1&&n.sort((p,c)=>p.score-c.score),[n.map(({handler:p,params:c})=>[p,c])]}};var ye=class{name="TrieRouter";#t;constructor(){this.#t=new Ve}add(e,t,a){let n=Z(t);if(n){for(let r=0,s=n.length;r<s;r++)this.#t.insert(e,n[r],a);return}this.#t.insert(e,t,a)}match(e,t){return this.#t.search(e,t)}};var b=class extends Fe{constructor(e={}){super(e),this.router=e.router??new ve({routers:[new ie,new ye]})}};var Je=async(e,t)=>{if(e.req.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS, HEAD","Access-Control-Allow-Headers":"Content-Type, Authorization, X-Ygg-Token, Range","Access-Control-Expose-Headers":"Content-Range, Accept-Ranges, Content-Length, Content-Disposition, ETag","Access-Control-Max-Age":"86400"}});await t(),e.res.headers.set("Access-Control-Allow-Origin","*"),e.res.headers.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS, HEAD"),e.res.headers.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Ygg-Token, Range"),e.res.headers.set("Access-Control-Expose-Headers","Content-Range, Accept-Ranges, Content-Length, Content-Disposition, ETag")};var h=class{static generateFileKey(t,a){let n=t.replace(/[^a-zA-Z0-9_-]/g,"")||"general",r=Date.now(),s=Math.random().toString(36).substring(2,8),i=a.replace(/[^a-zA-Z0-9._-]/g,"_");return`${n}/${r}_${s}_${i}`}static async serveFileWithRange(t,a,n,r,s){let i;if(r&&r.startsWith("bytes=")){let c=r.substring(6).trim().split("-");if(c.length===2){if(c[0]!==""&&c[1]!==""){let m=parseInt(c[0],10),u=parseInt(c[1],10);!isNaN(m)&&!isNaN(u)&&u>=m&&(i={offset:m,length:u-m+1})}else if(c[0]!==""&&c[1]===""){let m=parseInt(c[0],10);isNaN(m)||(i={offset:m})}else if(c[0]===""&&c[1]!==""){let m=parseInt(c[1],10);isNaN(m)||(i={suffix:m})}}}let o=await t.get(a,i?{range:i}:void 0);if(!o)return new Response(JSON.stringify({code:404,message:"File object not found in R2 storage"}),{status:404,headers:{"Content-Type":"application/json"}});let l=new Headers;o.writeHttpMetadata(l),l.set("ETag",o.httpEtag),l.set("Accept-Ranges","bytes");let d=encodeURIComponent(n).replace(/['()]/g,escape);if(l.set("Content-Disposition",`attachment; filename="${n}"; filename*=UTF-8''${d}`),s?l.set("Content-Type",s):l.has("Content-Type")||(n.endsWith(".apk")?l.set("Content-Type","application/vnd.android.package-archive"):l.set("Content-Type","application/octet-stream")),o.range){let p=0,c=o.size;if("offset"in o.range&&o.range.offset!==void 0)p=o.range.offset,c=o.range.length!==void 0?o.range.length:o.size-p;else if("suffix"in o.range&&o.range.suffix!==void 0){let u=o.range.suffix;p=Math.max(0,o.size-u),c=o.size-p}let m=p+c-1;return l.set("Content-Range",`bytes ${p}-${m}/${o.size}`),l.set("Content-Length",`${c}`),new Response(o.body,{status:206,headers:l})}else return l.set("Content-Length",`${o.size}`),new Response(o.body,{status:200,headers:l})}static async putObject(t,a,n,r){return await t.put(a,n,r)}static async deleteObject(t,a){try{await t.delete(a)}catch(n){console.warn(`[StorageService] Failed to delete R2 object ${a}:`,n)}}static async createMultipartUpload(t,a,n){return await t.createMultipartUpload(a,{httpMetadata:n})}static resumeMultipartUpload(t,a,n){return t.resumeMultipartUpload(a,n)}};var _=class{static async listApps(t){let{results:a}=await t.prepare(`
      SELECT 
        a.*,
        (SELECT COUNT(1) FROM app_versions v WHERE v.app_id = a.app_id) AS version_count,
        (SELECT SUM(download_count) FROM app_versions v WHERE v.app_id = a.app_id) AS total_downloads,
        (SELECT version_name FROM app_versions v WHERE v.app_id = a.app_id AND v.is_published = 1 ORDER BY v.version_code DESC LIMIT 1) AS latest_version_name,
        (SELECT version_code FROM app_versions v WHERE v.app_id = a.app_id AND v.is_published = 1 ORDER BY v.version_code DESC LIMIT 1) AS latest_version_code
      FROM apps a
      ORDER BY a.created_at DESC
    `).all();return a||[]}static async getAppByAppId(t,a){return await t.prepare("SELECT * FROM apps WHERE app_id = ?").bind(a).first()||null}static async createApp(t,a){let n="app_"+Date.now().toString(36)+Math.random().toString(36).substring(2,6),r=new Date().toISOString();return await t.prepare(`
      INSERT INTO apps (id, app_id, name, icon_url, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(n,a.app_id.trim(),a.name.trim(),a.icon_url?.trim()||null,a.description?.trim()||null,r,r).run(),{id:n,app_id:a.app_id.trim(),name:a.name.trim(),icon_url:a.icon_url||null,description:a.description||null,created_at:r,updated_at:r}}static async updateApp(t,a,n){let r=new Date().toISOString();await t.prepare(`
      UPDATE apps 
      SET name = COALESCE(?, name),
          icon_url = COALESCE(?, icon_url),
          description = COALESCE(?, description),
          updated_at = ?
      WHERE app_id = ?
    `).bind(n.name?.trim()||null,n.icon_url?.trim()||null,n.description?.trim()||null,r,a).run()}static async deleteApp(t,a,n){let{results:r}=await t.prepare("SELECT file_key FROM app_versions WHERE app_id = ?").bind(n).all();if(r&&r.length>0)for(let s of r)s.file_key&&await h.deleteObject(a,s.file_key);await t.prepare("DELETE FROM app_versions WHERE app_id = ?").bind(n).run(),await t.prepare("DELETE FROM apps WHERE app_id = ?").bind(n).run()}static async listVersions(t,a){let{results:n}=await t.prepare(`
      SELECT * FROM app_versions 
      WHERE app_id = ? 
      ORDER BY version_code DESC, created_at DESC
    `).bind(a).all();return n||[]}static async createVersion(t,a){let n="ver_"+Date.now().toString(36)+Math.random().toString(36).substring(2,6),r=new Date().toISOString(),s=a.channel?.trim()||"default",i=a.min_version_code!==void 0?a.min_version_code:0,o=a.is_force_update?1:0,l=a.is_published!==void 0?a.is_published:1;return await t.prepare(`
      INSERT INTO app_versions (
        id, app_id, version_code, version_name, min_version_code, channel, 
        changelog, file_key, file_name, file_size, file_md5, file_sha256, 
        is_force_update, is_published, download_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).bind(n,a.app_id,a.version_code,a.version_name.trim(),i,s,a.changelog?.trim()||"",a.file_key,a.file_name,a.file_size,a.file_md5||null,a.file_sha256||null,o,l,r).run(),{id:n,app_id:a.app_id,version_code:a.version_code,version_name:a.version_name.trim(),min_version_code:i,channel:s,changelog:a.changelog||"",file_key:a.file_key,file_name:a.file_name,file_size:a.file_size,file_md5:a.file_md5||null,file_sha256:a.file_sha256||null,is_force_update:o,is_published:l,download_count:0,created_at:r}}static async updateVersion(t,a,n){await t.prepare(`
      UPDATE app_versions 
      SET version_name = COALESCE(?, version_name),
          min_version_code = COALESCE(?, min_version_code),
          channel = COALESCE(?, channel),
          changelog = COALESCE(?, changelog),
          is_force_update = COALESCE(?, is_force_update),
          is_published = COALESCE(?, is_published)
      WHERE id = ?
    `).bind(n.version_name?.trim()||null,n.min_version_code!==void 0?n.min_version_code:null,n.channel?.trim()||null,n.changelog!==void 0?n.changelog:null,n.is_force_update!==void 0?n.is_force_update:null,n.is_published!==void 0?n.is_published:null,a).run()}static async deleteVersion(t,a,n){let r=await t.prepare("SELECT file_key FROM app_versions WHERE id = ?").bind(n).first();r&&r.file_key&&await h.deleteObject(a,r.file_key),await t.prepare("DELETE FROM app_versions WHERE id = ?").bind(n).run()}static async getLatestPublishedVersion(t,a,n="default"){let r=await t.prepare(`
      SELECT * FROM app_versions 
      WHERE app_id = ? AND channel = ? AND is_published = 1 
      ORDER BY version_code DESC, created_at DESC 
      LIMIT 1
    `).bind(a,n).first();return!r&&n!=="default"&&(r=await t.prepare(`
        SELECT * FROM app_versions 
        WHERE app_id = ? AND channel = 'default' AND is_published = 1 
        ORDER BY version_code DESC, created_at DESC 
        LIMIT 1
      `).bind(a).first()),r||null}static async getVersionForDownload(t,a,n,r="default"){if(n!==void 0&&!isNaN(n)&&n>0){let s=await t.prepare(`
        SELECT * FROM app_versions 
        WHERE app_id = ? AND version_code = ? AND is_published = 1 
        ORDER BY created_at DESC LIMIT 1
      `).bind(a,n).first();if(s)return s}return await this.getLatestPublishedVersion(t,a,r)}static async incrementDownloadCount(t,a){try{await t.prepare("UPDATE app_versions SET download_count = download_count + 1 WHERE id = ?").bind(a).run()}catch(n){console.warn("[AppService] Failed to increment download count:",n)}}static async checkAppUpdate(t,a,n=0,r="default",s){let i=await this.getAppByAppId(t,a);if(!i)return null;let o=await this.getLatestPublishedVersion(t,a,r);if(!o)return null;let l=o.version_code>n,d=!1;l&&(o.is_force_update===1||o.min_version_code>0&&n<o.min_version_code)&&(d=!0);let p=`${s}/api/v1/app/download?app_id=${encodeURIComponent(a)}&version_code=${o.version_code}&channel=${encodeURIComponent(o.channel)}`;return{has_update:l,is_force:d,app_id:i.app_id,app_name:i.name,icon_url:i.icon_url,current_version_code:n>0?n:void 0,latest_version_code:o.version_code,latest_version_name:o.version_name,min_version_code:o.min_version_code,channel:o.channel,changelog:o.changelog||"",download_url:p,file_name:o.file_name,file_size:o.file_size,file_md5:o.file_md5,file_sha256:o.file_sha256,release_time:o.created_at}}};var w={APP_NAME:"Yggdrasil",DEFAULT_ADMIN_PASSWORD:"admin",DEFAULT_JWT_SECRET:"ygg_secret_jwt_sign_key_default_2026",JWT_EXPIRES_IN_SECONDS:604800,DEFAULT_API_TOKEN:"ygg_secret_token_default_2026",TOKEN_HEADER_NAME:"x-ygg-token",TOKEN_QUERY_NAME:"token",COOKIE_NAME:"ygg_admin_session"},x={API_TOKEN_ENABLED:"api_token_enabled",API_FIXED_TOKEN:"api_fixed_token",APP_CHECK_REQUIRE_TOKEN:"app_check_require_token",APP_DOWNLOAD_REQUIRE_TOKEN:"app_download_require_token",FILE_DOWNLOAD_REQUIRE_TOKEN:"file_download_require_token",SITE_TITLE:"site_title"};var P=class{static async getSetting(t,a,n=""){try{let r=await t.prepare("SELECT value FROM system_settings WHERE key = ?").bind(a).first();return r?r.value:n}catch(r){return console.warn(`[SettingService] Failed to read setting ${a}:`,r),n}}static async getAllSettings(t){let a={[x.API_TOKEN_ENABLED]:"false",[x.API_FIXED_TOKEN]:w.DEFAULT_API_TOKEN,[x.APP_CHECK_REQUIRE_TOKEN]:"false",[x.APP_DOWNLOAD_REQUIRE_TOKEN]:"false",[x.FILE_DOWNLOAD_REQUIRE_TOKEN]:"false",[x.SITE_TITLE]:"Yggdrasil - \u5E94\u7528\u4E0E\u6587\u4EF6\u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3"};try{let{results:n}=await t.prepare("SELECT key, value FROM system_settings").all();if(n&&n.length>0)for(let r of n)a[r.key]=r.value}catch(n){console.warn("[SettingService] Failed to query system_settings table:",n)}return a}static async setSetting(t,a,n,r){let s=new Date().toISOString();await t.prepare(`
      INSERT INTO system_settings (key, value, description, updated_at) 
      VALUES (?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(a,n,r||null,s).run()}static async updateSettings(t,a){let n=Object.entries(a).map(([r,s])=>{let i=new Date().toISOString();return t.prepare(`
        INSERT INTO system_settings (key, value, updated_at) 
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind(r,String(s),i)});n.length>0&&await t.batch(n)}static async checkAuthRequirement(t,a){let n=await this.getAllSettings(t),r=n[x.API_TOKEN_ENABLED]==="true",s=n[x.API_FIXED_TOKEN]||w.DEFAULT_API_TOKEN;if(!r)return{required:!1,fixedToken:s};let i="";return a==="app_check"?i=x.APP_CHECK_REQUIRE_TOKEN:a==="app_download"?i=x.APP_DOWNLOAD_REQUIRE_TOKEN:a==="file_download"&&(i=x.FILE_DOWNLOAD_REQUIRE_TOKEN),{required:n[i]==="true",fixedToken:s}}};function D(e){return async(t,a)=>{let{required:n,fixedToken:r}=await P.checkAuthRequirement(t.env.DB,e);if(!n)return await a();let s=t.req.header(w.TOKEN_HEADER_NAME);if(!s){let i=t.req.header("authorization");i&&i.startsWith("Bearer ")&&(s=i.substring(7).trim())}if(s||(s=t.req.query(w.TOKEN_QUERY_NAME)),!s||s.trim()!==r.trim())return t.json({code:401,message:"Unauthorized: Invalid or missing API Token. Please provide valid token in X-Ygg-Token header or ?token= query parameter."},401);await a()}}var J=new b,Ye=async e=>{let t=e.req.query("app_id")||e.req.query("appId")||e.req.query("package_name");if(!t)return e.json({code:400,message:"Missing required query parameter: app_id (e.g. ?app_id=com.example.app)"},400);let a=e.req.query("version_code")||e.req.query("versionCode")||"0",n=parseInt(a,10)||0,r=e.req.query("channel")||"default",s=new URL(e.req.url).origin,i=await _.checkAppUpdate(e.env.DB,t,n,r,s);return i?e.json({code:0,message:"success",data:i}):e.json({code:404,message:`App '${t}' or published version not found for channel '${r}'`},404)};J.get("/api/v1/app/latest",D("app_check"),Ye);J.get("/api/v1/version/check",D("app_check"),Ye);J.get("/api/v1/app/download",D("app_download"),async e=>{let t=e.req.query("app_id")||e.req.query("appId");if(!t)return e.json({code:400,message:"Missing required query parameter: app_id"},400);let a=e.req.query("version_code")||e.req.query("versionCode"),n=a?parseInt(a,10):void 0,r=e.req.query("channel")||"default",s=await _.getVersionForDownload(e.env.DB,t,n,r);if(!s)return e.json({code:404,message:"Requested APK version not found or not published"},404);e.executionCtx.waitUntil(_.incrementDownloadCount(e.env.DB,s.id));let i=e.req.header("range");return await h.serveFileWithRange(e.env.BUCKET,s.file_key,s.file_name,i,"application/vnd.android.package-archive")});var v=class{static async listFiles(t,a){let n="SELECT * FROM files WHERE 1=1",r="SELECT COUNT(1) as total FROM files WHERE 1=1",s=[],i=[];if(a?.category&&a.category!=="all"&&(n+=" AND category = ?",r+=" AND category = ?",s.push(a.category),i.push(a.category)),a?.search){let c=`%${a.search}%`;n+=" AND (name LIKE ? OR file_name LIKE ? OR alias LIKE ?)",r+=" AND (name LIKE ? OR file_name LIKE ? OR alias LIKE ?)",s.push(c,c,c),i.push(c,c,c)}n+=" ORDER BY created_at DESC";let o=a?.limit||50,l=a?.offset||0;n+=" LIMIT ? OFFSET ?",s.push(o,l);let d=await t.prepare(r).bind(...i).first(),{results:p}=await t.prepare(n).bind(...s).all();return{files:p||[],total:d?.total||0}}static async getFileById(t,a){return await t.prepare("SELECT * FROM files WHERE id = ?").bind(a).first()||null}static async getFileByAlias(t,a){return await t.prepare("SELECT * FROM files WHERE alias = ?").bind(a).first()||null}static async createFile(t,a){let n="f_"+Date.now().toString(36)+Math.random().toString(36).substring(2,6),r=new Date().toISOString(),s=a.category?.trim()||"general",i=a.is_public!==void 0?a.is_public:1,o=a.alias?.trim()||null;return await t.prepare(`
      INSERT INTO files (
        id, name, category, file_key, file_name, file_size, 
        mime_type, file_md5, alias, is_public, download_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).bind(n,a.name.trim(),s,a.file_key,a.file_name,a.file_size,a.mime_type||null,a.file_md5||null,o,i,r).run(),{id:n,name:a.name.trim(),category:s,file_key:a.file_key,file_name:a.file_name,file_size:a.file_size,mime_type:a.mime_type||null,file_md5:a.file_md5||null,alias:o,is_public:i,download_count:0,created_at:r}}static async updateFile(t,a,n){await t.prepare(`
      UPDATE files 
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          alias = COALESCE(?, alias),
          is_public = COALESCE(?, is_public)
      WHERE id = ?
    `).bind(n.name?.trim()||null,n.category?.trim()||null,n.alias!==void 0&&n.alias?.trim()||null,n.is_public!==void 0?n.is_public:null,a).run()}static async deleteFile(t,a,n){let r=await this.getFileById(t,n);r&&r.file_key&&await h.deleteObject(a,r.file_key),await t.prepare("DELETE FROM files WHERE id = ?").bind(n).run()}static async incrementDownloadCount(t,a){try{await t.prepare("UPDATE files SET download_count = download_count + 1 WHERE id = ?").bind(a).run()}catch(n){console.warn("[FileService] Failed to increment download count:",n)}}static async getCategories(t){let{results:a}=await t.prepare("SELECT DISTINCT category FROM files WHERE category IS NOT NULL").all();return(a||[]).map(n=>n.category).filter(Boolean)}};var F=new b;F.get("/api/v1/files/check",D("file_download"),async e=>{let t=e.req.query("alias"),a=e.req.query("id"),n=null;if(t)n=await v.getFileByAlias(e.env.DB,t);else if(a)n=await v.getFileById(e.env.DB,a);else return e.json({code:400,message:"Missing alias or id query parameter"},400);if(!n)return e.json({code:404,message:"File not found"},404);let r=new URL(e.req.url).origin,s=n.alias?`${r}/f/${n.alias}`:`${r}/api/v1/files/${n.id}/download`;return e.json({code:0,message:"success",data:{id:n.id,name:n.name,category:n.category,file_name:n.file_name,file_size:n.file_size,mime_type:n.mime_type,file_md5:n.file_md5,alias:n.alias,download_count:n.download_count,download_url:s,created_at:n.created_at}})});F.get("/api/v1/files/:id/check",D("file_download"),async e=>{let t=e.req.param("id"),a=await v.getFileById(e.env.DB,t);if(!a)return e.json({code:404,message:"File not found"},404);let n=new URL(e.req.url).origin,r=a.alias?`${n}/f/${a.alias}`:`${n}/api/v1/files/${a.id}/download`;return e.json({code:0,message:"success",data:{id:a.id,name:a.name,category:a.category,file_name:a.file_name,file_size:a.file_size,mime_type:a.mime_type,file_md5:a.file_md5,alias:a.alias,download_count:a.download_count,download_url:r,created_at:a.created_at}})});F.get("/api/v1/files/:id/download",D("file_download"),async e=>{let t=e.req.param("id"),a=await v.getFileById(e.env.DB,t);if(!a)return e.json({code:404,message:"File not found"},404);e.executionCtx.waitUntil(v.incrementDownloadCount(e.env.DB,a.id));let n=e.req.header("range");return await h.serveFileWithRange(e.env.BUCKET,a.file_key,a.file_name,n,a.mime_type)});F.get("/f/:alias",D("file_download"),async e=>{let t=e.req.param("alias"),a=await v.getFileByAlias(e.env.DB,t);if(!a)return e.json({code:404,message:"File not found by alias"},404);e.executionCtx.waitUntil(v.incrementDownloadCount(e.env.DB,a.id));let n=e.req.header("range");return await h.serveFileWithRange(e.env.BUCKET,a.file_key,a.file_name,n,a.mime_type)});function be(e){return btoa(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Ge(e){for(e=e.replace(/-/g,"+").replace(/_/g,"/");e.length%4;)e+="=";return atob(e)}async function Qe(e){let t=new TextEncoder;return await crypto.subtle.importKey("raw",t.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign","verify"])}async function Xe(e,t){let n=be(JSON.stringify({alg:"HS256",typ:"JWT"})),r=be(JSON.stringify(e)),s=`${n}.${r}`,i=await Qe(t),o=await crypto.subtle.sign("HMAC",i,new TextEncoder().encode(s)),l=String.fromCharCode(...new Uint8Array(o)),d=be(l);return`${s}.${d}`}async function gt(e,t){try{let a=e.split(".");if(a.length!==3)return null;let[n,r,s]=a,i=`${n}.${r}`,o=await Qe(t),l=Ge(s),d=new Uint8Array(l.length);for(let u=0;u<l.length;u++)d[u]=l.charCodeAt(u);if(!await crypto.subtle.verify("HMAC",o,d,new TextEncoder().encode(i)))return null;let c=Ge(r),m=JSON.parse(c);return m.exp&&Date.now()/1e3>m.exp?null:m}catch{return null}}var I=async(e,t)=>{let a=e.req.header("authorization"),n="";if(a&&a.startsWith("Bearer "))n=a.substring(7).trim();else{let i=e.req.header("cookie");if(i){let o=i.match(new RegExp(`(?:^|;\\s*)${w.COOKIE_NAME}=([^;]+)`));o&&(n=o[1])}}if(!n)return e.json({code:401,message:"Unauthorized: Admin authentication token required"},401);let r=e.env.JWT_SECRET||w.DEFAULT_JWT_SECRET,s=await gt(n,r);if(!s||s.role!=="admin")return e.json({code:401,message:"Unauthorized: Invalid or expired session"},401);e.set("adminUser",s),await t()};var $=new b;$.post("/api/admin/login",async e=>{try{let t=await e.req.json(),a=e.env.ADMIN_PASSWORD||w.DEFAULT_ADMIN_PASSWORD;if(!t.password||t.password!==a)return e.json({code:401,message:"Invalid admin password"},401);let n=e.env.JWT_SECRET||w.DEFAULT_JWT_SECRET,r=Math.floor(Date.now()/1e3),s={sub:"admin",role:"admin",iat:r,exp:r+w.JWT_EXPIRES_IN_SECONDS},i=await Xe(s,n),o=new URL(e.req.url).protocol==="https:",l=[`${w.COOKIE_NAME}=${i}`,"Path=/",`Max-Age=${w.JWT_EXPIRES_IN_SECONDS}`,"HttpOnly","SameSite=Lax"];o&&l.push("Secure");let d=e.json({code:0,message:"Login successful",data:{token:i,expiresIn:w.JWT_EXPIRES_IN_SECONDS}});return d.headers.set("Set-Cookie",l.join("; ")),d}catch(t){return e.json({code:400,message:"Bad request: "+(t.message||"Unknown error")},400)}});$.post("/api/admin/logout",async e=>{let t=e.json({code:0,message:"Logged out successfully"});return t.headers.set("Set-Cookie",`${w.COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`),t});$.get("/api/admin/me",I,async e=>e.json({code:0,message:"Authenticated",data:{user:"admin",role:"admin"}}));$.get("/api/admin/stats",I,async e=>{try{let t=await e.env.DB.prepare(`
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
    `).first(),n=t?.total_apps||0,r=t?.total_versions||0,s=a?.total_files||0,i=(t?.app_storage_bytes||0)+(a?.file_storage_bytes||0),o=(t?.app_downloads||0)+(a?.file_downloads||0);return e.json({code:0,message:"success",data:{totalApps:n,totalVersions:r,totalFiles:s,totalStorageBytes:i,totalDownloads:o}})}catch(t){return e.json({code:500,message:"Failed to query system stats: "+t.message},500)}});var T=new b;T.use("/api/admin/*",I);T.get("/api/admin/apps",async e=>{let t=await _.listApps(e.env.DB);return e.json({code:0,message:"success",data:t})});T.get("/api/admin/apps/:appId",async e=>{let t=e.req.param("appId"),a=await _.getAppByAppId(e.env.DB,t);return a?e.json({code:0,message:"success",data:a}):e.json({code:404,message:"App not found"},404)});T.post("/api/admin/apps",async e=>{try{let t=await e.req.json();if(!t.app_id||!t.name)return e.json({code:400,message:"app_id and name are required"},400);if(await _.getAppByAppId(e.env.DB,t.app_id))return e.json({code:409,message:`App with app_id '${t.app_id}' already exists`},409);let n=await _.createApp(e.env.DB,t);return e.json({code:0,message:"App created successfully",data:n})}catch(t){return e.json({code:500,message:"Failed to create app: "+t.message},500)}});T.put("/api/admin/apps/:appId",async e=>{try{let t=e.req.param("appId"),a=await e.req.json();return await _.updateApp(e.env.DB,t,a),e.json({code:0,message:"App updated successfully"})}catch(t){return e.json({code:500,message:"Failed to update app: "+t.message},500)}});T.delete("/api/admin/apps/:appId",async e=>{try{let t=e.req.param("appId");return await _.deleteApp(e.env.DB,e.env.BUCKET,t),e.json({code:0,message:"App and associated versions deleted successfully"})}catch(t){return e.json({code:500,message:"Failed to delete app: "+t.message},500)}});T.get("/api/admin/apps/:appId/versions",async e=>{let t=e.req.param("appId"),a=await _.listVersions(e.env.DB,t);return e.json({code:0,message:"success",data:a})});T.post("/api/admin/apps/:appId/versions",async e=>{try{let t=e.req.param("appId"),a=await e.req.json();if(!a.version_code||!a.version_name||!a.file_key||!a.file_name||!a.file_size)return e.json({code:400,message:"Missing required version fields (version_code, version_name, file_key, file_name, file_size)"},400);let n=await _.createVersion(e.env.DB,{...a,app_id:t});return e.json({code:0,message:"Version published successfully",data:n})}catch(t){return e.json({code:500,message:"Failed to publish version: "+t.message},500)}});T.put("/api/admin/versions/:id",async e=>{try{let t=e.req.param("id"),a=await e.req.json();return await _.updateVersion(e.env.DB,t,a),e.json({code:0,message:"Version updated successfully"})}catch(t){return e.json({code:500,message:"Failed to update version: "+t.message},500)}});T.delete("/api/admin/versions/:id",async e=>{try{let t=e.req.param("id");return await _.deleteVersion(e.env.DB,e.env.BUCKET,t),e.json({code:0,message:"Version deleted successfully"})}catch(t){return e.json({code:500,message:"Failed to delete version: "+t.message},500)}});var M=new b;M.use("/api/admin/*",I);M.get("/api/admin/files",async e=>{let t=e.req.query("category"),a=e.req.query("search"),n=parseInt(e.req.query("limit")||"50",10),r=parseInt(e.req.query("offset")||"0",10),s=await v.listFiles(e.env.DB,{category:t,search:a,limit:n,offset:r});return e.json({code:0,message:"success",data:s})});M.get("/api/admin/categories",async e=>{let t=await v.getCategories(e.env.DB);return e.json({code:0,message:"success",data:t})});M.post("/api/admin/files",async e=>{try{let t=await e.req.json();if(!t.name||!t.file_key||!t.file_name||!t.file_size)return e.json({code:400,message:"Missing required file fields (name, file_key, file_name, file_size)"},400);if(t.alias&&await v.getFileByAlias(e.env.DB,t.alias))return e.json({code:409,message:`File alias '${t.alias}' is already in use`},409);let a=await v.createFile(e.env.DB,t);return e.json({code:0,message:"File created successfully",data:a})}catch(t){return e.json({code:500,message:"Failed to create file: "+t.message},500)}});M.put("/api/admin/files/:id",async e=>{try{let t=e.req.param("id"),a=await e.req.json();if(a.alias){let n=await v.getFileByAlias(e.env.DB,a.alias);if(n&&n.id!==t)return e.json({code:409,message:`File alias '${a.alias}' is already in use`},409)}return await v.updateFile(e.env.DB,t,a),e.json({code:0,message:"File updated successfully"})}catch(t){return e.json({code:500,message:"Failed to update file: "+t.message},500)}});M.delete("/api/admin/files/:id",async e=>{try{let t=e.req.param("id");return await v.deleteFile(e.env.DB,e.env.BUCKET,t),e.json({code:0,message:"File deleted successfully"})}catch(t){return e.json({code:500,message:"Failed to delete file: "+t.message},500)}});var L=new b;L.use("/api/admin/*",I);L.post("/api/admin/upload/direct",async e=>{try{let t=await e.req.formData(),a=t.get("file"),n=t.get("category")||"apk",r=t.get("md5")||"";if(!a||typeof a=="string")return e.json({code:400,message:"No file provided in form-data (field: file)"},400);let s=a,i=s.name||"upload.bin",o=s.size,l=s.type||(i.endsWith(".apk")?"application/vnd.android.package-archive":"application/octet-stream"),d=h.generateFileKey(n,i),p=await s.arrayBuffer(),c=r;if(!c){let u=await crypto.subtle.digest("MD5",p).catch(()=>null);u&&(c=Array.from(new Uint8Array(u)).map(y=>y.toString(16).padStart(2,"0")).join(""))}let m=await h.putObject(e.env.BUCKET,d,p,{httpMetadata:{contentType:l},customMetadata:{originalName:i,md5:c||""}});return e.json({code:0,message:"Upload successful",data:{file_key:d,file_name:i,file_size:o,mime_type:l,file_md5:c||m.httpEtag.replace(/"/g,"")}})}catch(t){return e.json({code:500,message:"Upload failed: "+t.message},500)}});L.post("/api/admin/upload/multipart/init",async e=>{try{let t=await e.req.json();if(!t.fileName)return e.json({code:400,message:"fileName is required"},400);let a=t.category||"apk",n=t.mimeType||(t.fileName.endsWith(".apk")?"application/vnd.android.package-archive":"application/octet-stream"),r=h.generateFileKey(a,t.fileName),s=await h.createMultipartUpload(e.env.BUCKET,r,{contentType:n});return e.json({code:0,message:"Multipart upload initialized",data:{upload_id:s.uploadId,file_key:r,file_name:t.fileName}})}catch(t){return e.json({code:500,message:"Failed to init multipart upload: "+t.message},500)}});L.put("/api/admin/upload/multipart/part",async e=>{try{let t=e.req.query("uploadId")||e.req.query("upload_id"),a=e.req.query("fileKey")||e.req.query("file_key"),n=e.req.query("partNumber")||e.req.query("part_number");if(!t||!a||!n)return e.json({code:400,message:"Missing uploadId, fileKey or partNumber query parameter"},400);let r=parseInt(n,10),s=await e.req.arrayBuffer(),o=await h.resumeMultipartUpload(e.env.BUCKET,a,t).uploadPart(r,s);return e.json({code:0,message:"Part uploaded",data:{partNumber:o.partNumber,etag:o.etag}})}catch(t){return e.json({code:500,message:"Failed to upload part: "+t.message},500)}});L.post("/api/admin/upload/multipart/complete",async e=>{try{let t=await e.req.json();if(!t.upload_id||!t.file_key||!t.parts||t.parts.length===0)return e.json({code:400,message:"Missing upload_id, file_key or parts array"},400);let a=[...t.parts].sort((s,i)=>s.partNumber-i.partNumber),r=await h.resumeMultipartUpload(e.env.BUCKET,t.file_key,t.upload_id).complete(a);return e.json({code:0,message:"Multipart upload completed",data:{file_key:t.file_key,file_name:t.file_name,file_size:t.file_size||r.size,file_md5:t.file_md5||r.httpEtag.replace(/"/g,"")}})}catch(t){return e.json({code:500,message:"Failed to complete multipart upload: "+t.message},500)}});L.post("/api/admin/upload/multipart/abort",async e=>{try{let t=await e.req.json();return!t.upload_id||!t.file_key?e.json({code:400,message:"Missing upload_id or file_key"},400):(await h.resumeMultipartUpload(e.env.BUCKET,t.file_key,t.upload_id).abort(),e.json({code:0,message:"Multipart upload aborted successfully"}))}catch(t){return e.json({code:500,message:"Failed to abort multipart upload: "+t.message},500)}});var q=new b;q.use("/api/admin/*",I);q.get("/api/admin/settings",async e=>{let t=await P.getAllSettings(e.env.DB);return e.json({code:0,message:"success",data:t})});q.put("/api/admin/settings",async e=>{try{let t=await e.req.json();if(!t||typeof t!="object")return e.json({code:400,message:"Invalid payload, expected settings key-value object"},400);await P.updateSettings(e.env.DB,t);let a=await P.getAllSettings(e.env.DB);return e.json({code:0,message:"Settings saved successfully",data:a})}catch(t){return e.json({code:500,message:"Failed to update settings: "+t.message},500)}});q.post("/api/admin/settings/generate-token",async e=>{let t=new Uint8Array(24);crypto.getRandomValues(t);let a="ygg_"+Array.from(t,n=>n.toString(16).padStart(2,"0")).join("");return e.json({code:0,message:"Token generated",data:{token:a}})});function Ze(e="Yggdrasil - \u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3"){return`<!DOCTYPE html>
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
      </nav>

      <div class="nav-user">
        <button class="btn btn-secondary btn-sm" onclick="handleLogout()">\u767B\u51FA</button>
      </div>
    </header>

    <main class="content">
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
      ['apps', 'files', 'settings', 'playground'].forEach(t => {
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
        file_download_require_token: document.getElementById('cfg-file-download-token').checked ? 'true' : 'false'
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
</html>`}var E=new b;E.use("*",Je);var _e=e=>{let t=e.env?.APP_NAME?`${e.env.APP_NAME} - \u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3`:"Yggdrasil - \u5E94\u7528\u4E0E\u6587\u4EF6\u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3";return e.html(Ze(t))};E.get("/",_e);E.get("/admin",_e);E.get("/dashboard",_e);E.route("/",J);E.route("/",F);E.route("/",$);E.route("/",T);E.route("/",M);E.route("/",L);E.route("/",q);E.get("/health",e=>e.json({status:"ok",system:"Yggdrasil (ygg)",timestamp:new Date().toISOString()}));E.notFound(e=>e.json({code:404,message:`Resource not found: ${e.req.method} ${e.req.url}`},404));E.onError((e,t)=>(console.error("[Yggdrasil Edge Error]:",e),t.json({code:500,message:"Internal Edge Server Error: "+(e.message||"Unknown")},500)));var $n=E;export{$n as default};
