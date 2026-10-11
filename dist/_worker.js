var ge=(e,t,n)=>(a,i)=>{let r=-1;return s(0);async function s(o){if(o<=r)throw new Error("next() called multiple times");r=o;let l,d=!1,c;if(e[o]?(c=e[o][0][0],a.req.routeIndex=o):c=o===e.length&&i||void 0,c)try{l=await c(a,()=>s(o+1))}catch(p){if(p instanceof Error&&t)a.error=p,l=await t(p,a),d=!0;else throw p}else a.finalized===!1&&n&&(l=await n(a));return l&&(a.finalized===!1||d)&&(a.res=l),a}};var Se=Symbol();var Ce=(e,t)=>new Response(e,{headers:{"Content-Type":t.replace(/^[^;]+/,a=>a.toLowerCase())}}).formData();var re=e=>"headers"in e,De=async(e,t=Object.create(null))=>{let{all:n=!1,dot:a=!1}=t,s=(re(e)?e.headers:e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();return s==="multipart/form-data"||s==="application/x-www-form-urlencoded"?ct(e,{all:n,dot:a}):{}};async function ct(e,t){if(!re(e)&&e.bodyCache.formData)return Pe(await e.bodyCache.formData,t);let n=re(e)?e.headers:e.raw.headers,a=await e.arrayBuffer(),i=Ce(a,n.get("Content-Type")||"");re(e)||(e.bodyCache.formData=i);let r=await i;return r?Pe(r,t):{}}function Pe(e,t){let n=Object.create(null);return e.forEach((a,i)=>{t.all||i.endsWith("[]")?pt(n,i,a):n[i]=a}),t.dot&&Object.entries(n).forEach(([a,i])=>{a.includes(".")&&(mt(n,a,i),delete n[a])}),n}var pt=(e,t,n)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(n):e[t]=[e[t],n]:t.endsWith("[]")?e[t]=[n]:e[t]=n},mt=(e,t,n)=>{if(/(?:^|\.)__proto__\./.test(t))return;let a=e,i=t.split(".");i.forEach((r,s)=>{s===i.length-1?a[r]=n:((!a[r]||typeof a[r]!="object"||Array.isArray(a[r])||a[r]instanceof File)&&(a[r]=Object.create(null)),a=a[r])})};var he=e=>{let t=e.split("/");return t[0]===""&&t.shift(),t},Be=e=>{let{groups:t,path:n}=ut(e),a=he(n);return gt(a,t)},ut=e=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(n,a)=>{let i=`@${a}`;return t.push([i,n]),i}),{groups:t,path:e}},gt=(e,t)=>{for(let n=t.length-1;n>=0;n--){let[a]=t[n];for(let i=e.length-1;i>=0;i--)if(e[i].includes(a)){e[i]=e[i].replace(a,t[n][1]);break}}return e},ie={},Me=(e,t)=>{if(e==="*")return"*";let n=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(n){let a=`${e}#${t}`;return ie[a]||(n[2]?ie[a]=t&&t[0]!==":"&&t[0]!=="*"?[a,n[1],new RegExp(`^${n[2]}(?=/${t})`)]:[e,n[1],new RegExp(`^${n[2]}$`)]:ie[a]=[e,n[1],!0]),ie[a]}return null},Oe=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,n=>{try{return t(n)}catch{return n}})}},ft=e=>Oe(e,decodeURI),ve=e=>{let t=e.url,n=t.indexOf("/",t.indexOf(":")+4),a=n;for(;a<t.length;a++){let i=t.charCodeAt(a);if(i===37){let r=t.indexOf("?",a),s=t.indexOf("#",a),o=r===-1?s===-1?void 0:s:s===-1?r:Math.min(r,s),l=t.slice(n,o);return ft(l.includes("%25")?l.replace(/%25/g,"%2525"):l)}else if(i===63||i===35)break}return t.slice(n,a)};var Le=e=>{let t=ve(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},$=(e,t,...n)=>(n.length&&(t=$(t,...n)),`${e?.[0]==="/"?"":"/"}${e}${t==="/"?"":`${e?.at(-1)==="/"?"":"/"}${t?.[0]==="/"?t.slice(1):t}`}`),oe=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;let t=e.split("/"),n=[],a="";return t.forEach(i=>{if(i!==""&&!/\:/.test(i))a+="/"+i;else if(/\:/.test(i))if(i.charCodeAt(i.length-1)===63){n.length===0&&a===""?n.push("/"):n.push(a);let r=i.slice(0,-1);a+="/"+r,n.push(a)}else a+="/"+i}),n.filter((i,r,s)=>s.indexOf(i)===r)},se=e=>e.indexOf("%")!==-1?Oe(e,ht):e,fe=e=>(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),se(e)),Ue=(e,t,n)=>{let a;if(!n&&t&&t.indexOf("%")===-1&&t.indexOf("+")===-1){let s=e.indexOf("?",8);if(s===-1)return;for(e.startsWith(t,s+1)||(s=e.indexOf(`&${t}`,s+1));s!==-1;){let o=e.charCodeAt(s+t.length+1);if(o===61){let l=s+t.length+2,d=e.indexOf("&",l);return fe(e.slice(l,d===-1?void 0:d))}else if(o==38||isNaN(o))return"";s=e.indexOf(`&${t}`,s+1)}if(a=/[%+]/.test(e),!a)return}let i=Object.create(null);a??=/[%+]/.test(e);let r=e.indexOf("?",8);for(;r!==-1;){let s=e.indexOf("&",r+1),o=e.indexOf("=",r);o>s&&s!==-1&&(o=-1);let l=e.slice(r+1,o===-1?s===-1?void 0:s:o);if(a&&(l=fe(l)),r=s,l==="")continue;let d;o===-1?d="":(d=e.slice(o+1,s===-1?void 0:s),a&&(d=fe(d))),n?(i[l]&&Array.isArray(i[l])||(i[l]=[]),i[l].push(d)):i[l]??=d}return t?i[t]:i},Ne=Ue,$e=(e,t)=>Ue(e,t,!0),ht=decodeURIComponent;var je=class{raw;#t;#e;routeIndex=0;path;bodyCache={};constructor(e,t="/",n=[[]]){this.raw=e,this.path=t,this.#e=n}param(e){return e?this.#a(e):this.#i()}#a(e){let t=this.#e[0][this.routeIndex][1][e],n=this.#n(t);return n&&se(n)}#i(){let e={},t=Object.keys(this.#e[0][this.routeIndex][1]);for(let n of t){let a=this.#n(this.#e[0][this.routeIndex][1][n]);a!==void 0&&(e[n]=se(a))}return e}#n(e){return this.#e[1]?this.#e[1][e]:e}query(e){return Ne(this.url,e)}queries(e){return $e(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t=Object.create(null);return this.raw.headers.forEach((n,a)=>{t[a]=n}),t}async parseBody(e){return De(this,e)}#r=e=>{let{bodyCache:t,raw:n}=this,a=t[e];if(a)return a;for(let i in t)return t[i].then(r=>(i==="json"&&(r=JSON.stringify(r)),new Response(r)[e]()));return t[e]=n[e]()};json(){return this.#r("text").then(e=>JSON.parse(e))}text(){return this.#r("text")}arrayBuffer(){return this.#r("arrayBuffer")}bytes(){return this.#r("arrayBuffer").then(e=>new Uint8Array(e))}blob(){return this.#r("blob")}formData(){return this.#r("formData")}addValidatedData(e,t){(this.#t??={})[e]=t}valid(e){return this.#t?.[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Se](){return this.#e}get matchedRoutes(){return this.#e[0].map(([[,e]])=>e)}get routePath(){return this.#e[0].map(([[,e]])=>e)[this.routeIndex].path}};var ze={Stringify:1,BeforeStream:2,Stream:3},vt=(e,t)=>{let n=new String(e);return n.isEscaped=!0,n.callbacks=t,n};var ye=async(e,t,n,a,i)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));let r=e.callbacks;if(!r?.length)return Promise.resolve(e);i?i[0]+=e:i=[e];let s=Promise.all(r.map(o=>o({phase:t,buffer:i,context:a}))).then(o=>Promise.all(o.filter(Boolean).map(l=>ye(l,t,!1,a,i))).then(()=>i[0]));return n?vt(await s,r):s};var yt="text/plain; charset=UTF-8",_e=(e,t)=>({"Content-Type":e,...t}),te=(e,t)=>new Response(e,t),be=class{#t;#e;env={};#a;finalized=!1;error;#i;#n;#r;#c;#l;#d;#s;#p;#m;constructor(e,t){this.#t=e,t&&(this.#n=t.executionCtx,this.env=t.env,this.#d=t.notFoundHandler,this.#m=t.path,this.#p=t.matchResult)}get req(){return this.#e??=new je(this.#t,this.#m,this.#p),this.#e}get event(){if(this.#n&&"respondWith"in this.#n)return this.#n;throw Error("This context has no FetchEvent")}get executionCtx(){if(this.#n)return this.#n;throw Error("This context has no ExecutionContext")}get res(){return this.#r||=te(null,{headers:this.#s??=new Headers})}set res(e){if(this.#r&&e){e=te(e.body,e);for(let[t,n]of this.#r.headers.entries())if(t!=="content-type")if(t==="set-cookie"){let a=this.#r.headers.getSetCookie();e.headers.delete("set-cookie");for(let i of a)e.headers.append("set-cookie",i)}else e.headers.set(t,n)}this.#r=e,this.finalized=!0}render=(...e)=>(this.#l??=t=>this.html(t),this.#l(...e));setLayout=e=>this.#c=e;getLayout=()=>this.#c;setRenderer=e=>{this.#l=e};header=(e,t,n)=>{this.finalized&&(this.#r=te(this.#r.body,this.#r));let a=this.#r?this.#r.headers:this.#s??=new Headers;t===void 0?a.delete(e):n?.append?a.append(e,t):a.set(e,t)};status=e=>{this.#i=e};set=(e,t)=>{this.#a??=new Map,this.#a.set(e,t)};get=e=>this.#a?this.#a.get(e):void 0;get var(){return this.#a?Object.fromEntries(this.#a):{}}#o(e,t,n){let a=this.#r?new Headers(this.#r.headers):this.#s;if(typeof t=="object"&&t.headers){a??=new Headers;for(let[r,s]of new Headers(t.headers))r==="set-cookie"?a.append(r,s):a.set(r,s)}if(n){if(!a){let r=0;for(let s in n)if(++r>1||typeof n[s]!="string"){a=new Headers;break}}if(a)for(let r in n){let s=n[r];if(typeof s=="string")a.set(r,s);else{a.delete(r);for(let o of s)a.append(r,o)}}}let i=typeof t=="number"?t:t?.status??this.#i;return te(e,{status:i,headers:a??n})}newResponse=(...e)=>this.#o(...e);body=(e,t,n)=>this.#o(e,t,n);text=(e,t,n)=>!this.#s&&!this.#i&&!t&&!n&&!this.finalized?new Response(e):this.#o(e,t,_e(yt,n));json=(e,t,n)=>this.#o(JSON.stringify(e),t,_e("application/json",n));html=(e,t,n)=>{let a=i=>this.#o(i,t,_e("text/html; charset=UTF-8",n));return typeof e=="object"?ye(e,ze.Stringify,!1,{}).then(a):a(e)};redirect=(e,t)=>{let n=String(e);return this.header("Location",/[^\x00-\xFF]/.test(n)?encodeURI(n):n),this.newResponse(null,t??302)};notFound=()=>(this.#d??=()=>te(),this.#d(this))};var k="ALL",Fe="all",qe=["get","post","put","delete","options","patch","query"],le="Can not add a route since the matcher is already built.",de=class extends Error{};var He="__COMPOSED_HANDLER";var _t=e=>e.text("404 Not Found",404),We=(e,t)=>{if("getResponse"in e){let n=e.getResponse();return t.newResponse(n.body,n)}return console.error(e),t.text("Internal Server Error",500)},Ve=class Ke{get;post;put;delete;options;patch;query;all;on;use;router;getPath;_basePath="/";#t="/";routes=[];constructor(t={}){[...qe,Fe].forEach(r=>{this[r]=(s,...o)=>(typeof s=="string"?this.#t=s:this.#i(r,this.#t,s),o.forEach(l=>{this.#i(r,this.#t,l)}),this)}),this.on=(r,s,...o)=>{for(let l of[s].flat()){this.#t=l;for(let d of[r].flat())o.map(c=>{this.#i(d.toUpperCase(),this.#t,c)})}return this},this.use=(r,...s)=>(typeof r=="string"?this.#t=r:(this.#t="*",s.unshift(r)),s.forEach(o=>{this.#i(k,this.#t,o)}),this);let{strict:a,...i}=t;Object.assign(this,i),this.getPath=a??!0?t.getPath??ve:Le}#e(){let t=new Ke({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,t.#a=this.#a,t.routes=this.routes,t}#a=_t;errorHandler=We;route(t,n){let a=this.basePath(t);return n.routes.map(i=>{let r;n.errorHandler===We?r=i.handler:(r=async(s,o)=>(await ge([],n.errorHandler)(s,()=>i.handler(s,o))).res,r[He]=i.handler),a.#i(i.method,i.path,r,i.basePath)}),this}basePath(t){let n=this.#e();return n._basePath=$(this._basePath,t),n}onError=t=>(this.errorHandler=t,this);notFound=t=>(this.#a=t,this);mount(t,n,a){let i,r;a&&(typeof a=="function"?r=a:(r=a.optionHandler,a.replaceRequest===!1?i=l=>l:i=a.replaceRequest));let s=r?l=>{let d=r(l);return Array.isArray(d)?d:[d]}:l=>{let d;try{d=l.executionCtx}catch{}return[l.env,d]};i||=(()=>{let l=$(this._basePath,t),d=l==="/"?0:l.length;return c=>{let p=new URL(c.url);return p.pathname=this.getPath(c).slice(d)||"/",new Request(p,c)}})();let o=async(l,d)=>{let c=await n(i(l.req.raw),...s(l));if(c)return c;await d()};return this.#i(k,$(t,"*"),o),this}#i(t,n,a,i){t=t.toUpperCase(),n=$(this._basePath,n);let r={basePath:i!==void 0?$(this._basePath,i):this._basePath,path:n,method:t,handler:a};this.router.add(t,n,[a,r]),this.routes.push(r)}#n(t,n){if(t instanceof Error)return this.errorHandler(t,n);throw t}#r(t,n,a,i){if(i==="HEAD")return(async()=>new Response(null,await this.#r(t,n,a,"GET")))();let r=this.getPath(t,{env:a}),s=this.router.match(i,r),o=new be(t,{path:r,matchResult:s,env:a,executionCtx:n,notFoundHandler:this.#a});if(s[0].length===1){let d;try{d=s[0][0][0][0](o,async()=>{o.res=await this.#a(o)})}catch(c){return this.#n(c,o)}return d instanceof Promise?d.then(c=>c||(o.finalized?o.res:this.#a(o))).catch(c=>this.#n(c,o)):d??this.#a(o)}let l=ge(s[0],this.errorHandler,this.#a);return(async()=>{try{let d=await l(o);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return this.#n(d,o)}})()}fetch=(t,...n)=>this.#r(t,n[1],n[0],t.method);request=(t,n,a,i)=>t instanceof Request?this.fetch(n?new Request(t,n):t,a,i):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${$("/",t)}`,n),a,i));fire=()=>{addEventListener("fetch",t=>{t.respondWith(this.#r(t.request,t,void 0,t.request.method))})}};var ce=[];function we(e,t){let n=this.buildAllMatchers(),a=((i,r)=>{let s=n[i]||n[k],o=s[2][r];if(o)return o;let l=r.match(s[0]);if(!l)return[[],ce];let d=l.indexOf("",1);return[s[1][d],l]});return this.match=a,a(e,t)}var pe="[^/]+",Y=".*",V="(?:|/.*)",j=Symbol(),Ge=new Set(".\\+*[^]$()");function bt(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1?1:e===Y||e===V?t===V?-1:1:t===Y||t===V?-1:e===pe?1:t===pe?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var Ye=class xe{#t;#e;#a=Object.create(null);insert(t,n,a,i,r){let s=this;for(let o=0,l=t.length;o<l;o++){let d=t[o],c=d.length===1?d==="*"?o===l-1?["","",Y]:["","",pe]:null:d==="/*"?["","",V]:d.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),p;if(c){let m=c[1],u=c[2]||pe;if(m&&c[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))||u.length===1&&Ge.has(u)))throw j;if(p=s.#a[u],!p){if(u!==Y&&u!==V){for(let h in s.#a)if((u.length>1||h.length>1)&&h!==Y&&h!==V)throw j}p=s.#a[u]=new xe}m!==""&&(p.#e??=i.varIndex++,a.push([m,p.#e]))}else if(p=s.#a[d],!p){for(let m in s.#a)if(m.length>1&&m!==Y&&m!==V)throw j;p=s.#a[d]=new xe}s=p}if(s.#t!==void 0)throw j;s.#t=r?-1:n}buildRegExpStr(){let n=Object.keys(this.#a).sort(bt).map(a=>{let i=this.#a[a],r=i.buildRegExpStr();return r===""?"":(typeof i.#e=="number"?`(${a})@${i.#e}`:Ge.has(a)?`\\${a}`:a)+r}).filter(Boolean);return typeof this.#t=="number"&&this.#t!==-1&&n.unshift(`#${this.#t}`),n.length===0?"":n.length===1?n[0]:"(?:"+n.join("|")+")"}};var Ee=class{#t={varIndex:0};#e=new Ye;#a=0;paths=Object.create(null);insert(e,t){if(t){this.#e.insert(e.split(""),0,[],this.#t,!0);return}let n=[],a=[],i=e;for(let s=0;;){let o=!1;if(i=i.replace(/\{[^}]+\}/g,l=>{let d=`@\\${s}`;return a[s]=[d,l],s++,o=!0,d}),!o)break}let r=i.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let s=a.length-1;s>=0;s--){let[o]=a[s];for(let l=r.length-1;l>=0;l--)if(r[l].indexOf(o)!==-1){r[l]=r[l].replace(o,a[s][1]);break}}this.#e.insert(r,this.#a,n,this.#t,!1),this.paths[e]=[this.#a++,n]}buildRegExp(){let e=this.#e.buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0,n=[],a=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(i,r,s)=>r!==void 0?(n[++t]=Number(r),"$()"):(s!==void 0&&(a[Number(s)]=++t),"")),[new RegExp(`^${e}`),n,a]}};var Je=Object.create(null);function Xe(e){return Je[e]??=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,n)=>n?`\\${n}`:"(?:|/.*)")}$`)}function wt(){Je=Object.create(null)}function me(e,t){if(e){for(let n of Object.keys(e).sort((a,i)=>i.length-a.length))if(Xe(n).test(t))return[...e[n]]}}var ue=class{name="RegExpRouter";#t;#e;#a;constructor(){this.#t={[k]:Object.create(null)},this.#e={[k]:Object.create(null)},this.#a={[k]:new Ee}}#i(e,t){try{this.#a[e].insert(t,!/\*|\/:/.test(t))}catch(n){throw n===j?new de(t):n}}add(e,t,n){let a=this.#t,i=this.#e;if(!a||!i)throw new Error(le);a[e]||(this.#a[e]=new Ee,[a,i].forEach(o=>{o[e]=Object.create(null),Object.keys(o[k]).forEach(l=>{o[e][l]=[...o[k][l]],this.#i(e,l)})})),t==="/*"&&(t="*");let r=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){let o=Xe(t);Object.keys(a).forEach(l=>{(e===k||e===l)&&!a[l][t]&&(this.#i(l,t),a[l][t]=me(a[l],t)||me(a[k],t)||[])}),Object.keys(a).forEach(l=>{(e===k||e===l)&&Object.keys(a[l]).forEach(d=>{o.test(d)&&a[l][d].push([n,r])})}),Object.keys(i).forEach(l=>{(e===k||e===l)&&Object.keys(i[l]).forEach(d=>o.test(d)&&i[l][d].push([n,r]))});return}let s=oe(t)||[t];for(let o=0,l=s.length;o<l;o++){let d=s[o];Object.keys(i).forEach(c=>{(e===k||e===c)&&(i[c][d]||(this.#i(c,d),i[c][d]=[...me(a[c],d)||me(a[k],d)||[]]),i[c][d].push([n,r-l+o+1]))})}}match=we;buildAllMatchers(){let e=Object.create(null);return Object.keys(this.#e).concat(Object.keys(this.#t)).forEach(t=>{e[t]||=this.#n(t)}),this.#t=this.#e=this.#a=void 0,wt(),e}#n(e){let t=this.#t[e],n=this.#e[e],a=this.#a[e],i=Object.create(null),r=[];[t,n].forEach(c=>{for(let p in c){let m=c[p],u=a.paths[p];if(!u){i[p]=[m.map(([_])=>[_,Object.create(null)]),ce];continue}let h=u[1];r[u[0]]=m.map(([_,E])=>{let v=Object.create(null);for(E-=1;E>=0;E--){let[f,I]=h[E];v[f]=I}return[_,v]})}});let[s,o,l]=a.buildRegExp();for(let c=0,p=r.length;c<p;c++)for(let m=0,u=r[c].length;m<u;m++){let h=r[c][m]?.[1];if(!h)continue;let _=Object.keys(h);for(let E=0,v=_.length;E<v;E++)h[_[E]]=l[h[_[E]]]}let d=[];for(let c in o)d[c]=r[o[c]];return[s,d,i]}};var ke=class{name="SmartRouter";#t=[];#e=[];constructor(e){this.#t=e.routers}add(e,t,n){if(!this.#e)throw new Error(le);this.#e.push([e,t,n])}match(e,t){if(!this.#e)throw new Error("Fatal error");let n=this.#t,a=this.#e,i=n.length,r=0,s;for(;r<i;r++){let o=n[r];try{for(let l=0,d=a.length;l<d;l++)o.add(...a[l]);s=o.match(e,t)}catch(l){if(l instanceof de)continue;throw l}this.match=o.match.bind(o),this.#t=[o],this.#e=void 0;break}if(r===i)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,s}get activeRouter(){if(this.#e||this.#t.length!==1)throw new Error("No active router has been determined yet.");return this.#t[0]}};var ae=Object.create(null),xt=e=>{for(let t in e)return!0;return!1},Qe=class Ze{#t;#e;#a;#i=0;#n=ae;constructor(t,n,a){if(this.#e=a||Object.create(null),this.#t=[],t&&n){let i=Object.create(null);i[t]={handler:n,possibleKeys:[],score:0},this.#t=[i]}this.#a=[]}insert(t,n,a){this.#i=++this.#i;let i=this,r=Be(n),s=[];for(let o=0,l=r.length;o<l;o++){let d=r[o],c=r[o+1],p=Me(d,c),m=Array.isArray(p)?p[0]:d;if(m in i.#e){i=i.#e[m],p&&s.push(p[1]);continue}i.#e[m]=new Ze,p&&(i.#a.push(p),s.push(p[1])),i=i.#e[m]}return i.#t.push({[t]:{handler:a,possibleKeys:s.filter((o,l,d)=>d.indexOf(o)===l),score:this.#i}}),i}#r(t,n,a,i,r){for(let s=0,o=n.#t.length;s<o;s++){let l=n.#t[s],d=l[a]||l[k],c={};if(d!==void 0&&(d.params=Object.create(null),t.push(d),i!==ae||r&&r!==ae))for(let p=0,m=d.possibleKeys.length;p<m;p++){let u=d.possibleKeys[p],h=c[d.score];d.params[u]=r?.[u]&&!h?r[u]:i[u]??r?.[u],c[d.score]=!0}}}search(t,n){let a=[];this.#n=ae;let r=[this],s=he(n),o=[],l=s.length,d=null;for(let c=0;c<l;c++){let p=s[c],m=c===l-1,u=[];for(let _=0,E=r.length;_<E;_++){let v=r[_],f=v.#e[p];f&&(f.#n=v.#n,m?(f.#e["*"]&&this.#r(a,f.#e["*"],t,v.#n),this.#r(a,f,t,v.#n)):u.push(f));for(let I=0,G=v.#a.length;I<G;I++){let Z=v.#a[I],R=v.#n===ae?{}:{...v.#n};if(Z==="*"){let M=v.#e["*"];M&&(this.#r(a,M,t,v.#n),M.#n=R,u.push(M));continue}let[H,U,W]=Z;if(!p&&!(W instanceof RegExp))continue;let P=v.#e[H];if(W instanceof RegExp){if(d===null){d=new Array(l);let ee=n[0]==="/"?1:0;for(let N=0;N<l;N++)d[N]=ee,ee+=s[N].length+1}let M=n.substring(d[c]),O=W.exec(M);if(O){if(R[U]=O[0],this.#r(a,P,t,v.#n,R),O[0].length===M.length&&P.#e["*"]&&this.#r(a,P.#e["*"],t,v.#n,R),xt(P.#e)){P.#n=R;let ee=O[0].match(/\//g)?.length??0;(o[ee]||=[]).push(P)}continue}}(W===!0||W.test(p))&&(R[U]=p,m?(this.#r(a,P,t,R,v.#n),P.#e["*"]&&this.#r(a,P.#e["*"],t,R,v.#n)):(P.#n=R,u.push(P)))}}let h=o.shift();r=h?u.concat(h):u}return a.length>1&&a.sort((c,p)=>c.score-p.score),[a.map(({handler:c,params:p})=>[c,p])]}};var Te=class{name="TrieRouter";#t;constructor(){this.#t=new Qe}add(e,t,n){let a=oe(t);if(a){for(let i=0,r=a.length;i<r;i++)this.#t.insert(e,a[i],n);return}this.#t.insert(e,t,n)}match(e,t){return this.#t.search(e,t)}};var T=class extends Ve{constructor(e={}){super(e),this.router=e.router??new ke({routers:[new ue,new Te]})}};var et=async(e,t)=>{if(e.req.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PUT, DELETE, OPTIONS, HEAD","Access-Control-Allow-Headers":"Content-Type, Authorization, X-Ygg-Token, Range","Access-Control-Expose-Headers":"Content-Range, Accept-Ranges, Content-Length, Content-Disposition, ETag","Access-Control-Max-Age":"86400"}});await t(),e.res.headers.set("Access-Control-Allow-Origin","*"),e.res.headers.set("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS, HEAD"),e.res.headers.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Ygg-Token, Range"),e.res.headers.set("Access-Control-Expose-Headers","Content-Range, Accept-Ranges, Content-Length, Content-Disposition, ETag")};var y=class{static generateFileKey(t,n){let a=t.replace(/[^a-zA-Z0-9_-]/g,"")||"general",i=Date.now(),r=Math.random().toString(36).substring(2,8),s=n.replace(/[^a-zA-Z0-9._-]/g,"_");return`${a}/${i}_${r}_${s}`}static async serveFileWithRange(t,n,a,i,r){let s;if(i&&i.startsWith("bytes=")){let p=i.substring(6).trim().split("-");if(p.length===2){if(p[0]!==""&&p[1]!==""){let m=parseInt(p[0],10),u=parseInt(p[1],10);!isNaN(m)&&!isNaN(u)&&u>=m&&(s={offset:m,length:u-m+1})}else if(p[0]!==""&&p[1]===""){let m=parseInt(p[0],10);isNaN(m)||(s={offset:m})}else if(p[0]===""&&p[1]!==""){let m=parseInt(p[1],10);isNaN(m)||(s={suffix:m})}}}let o=await t.get(n,s?{range:s}:void 0);if(!o)return new Response(JSON.stringify({code:404,message:"File object not found in R2 storage"}),{status:404,headers:{"Content-Type":"application/json"}});let l=new Headers;o.writeHttpMetadata(l),l.set("ETag",o.httpEtag),l.set("Accept-Ranges","bytes");let d=encodeURIComponent(a).replace(/['()]/g,escape);if(l.set("Content-Disposition",`attachment; filename="${a}"; filename*=UTF-8''${d}`),r?l.set("Content-Type",r):l.has("Content-Type")||(a.endsWith(".apk")?l.set("Content-Type","application/vnd.android.package-archive"):l.set("Content-Type","application/octet-stream")),o.range){let c=0,p=o.size;if("offset"in o.range&&o.range.offset!==void 0)c=o.range.offset,p=o.range.length!==void 0?o.range.length:o.size-c;else if("suffix"in o.range&&o.range.suffix!==void 0){let u=o.range.suffix;c=Math.max(0,o.size-u),p=o.size-c}let m=c+p-1;return l.set("Content-Range",`bytes ${c}-${m}/${o.size}`),l.set("Content-Length",`${p}`),new Response(o.body,{status:206,headers:l})}else return l.set("Content-Length",`${o.size}`),new Response(o.body,{status:200,headers:l})}static async putObject(t,n,a,i){return await t.put(n,a,i)}static async deleteObject(t,n){try{await t.delete(n)}catch(a){console.warn(`[StorageService] Failed to delete R2 object ${n}:`,a)}}static async createMultipartUpload(t,n,a){return await t.createMultipartUpload(n,{httpMetadata:a})}static resumeMultipartUpload(t,n,a){return t.resumeMultipartUpload(n,a)}};var g=class{static async listApps(t){let{results:n}=await t.prepare(`
      SELECT 
        a.*,
        (SELECT COUNT(1) FROM app_versions v WHERE v.app_id = a.app_id) AS version_count,
        (SELECT SUM(download_count) FROM app_versions v WHERE v.app_id = a.app_id) AS total_downloads,
        (SELECT version_name FROM app_versions v WHERE v.app_id = a.app_id AND v.is_published = 1 ORDER BY v.version_code DESC LIMIT 1) AS latest_version_name,
        (SELECT version_code FROM app_versions v WHERE v.app_id = a.app_id AND v.is_published = 1 ORDER BY v.version_code DESC LIMIT 1) AS latest_version_code
      FROM apps a
      ORDER BY a.created_at DESC
    `).all();return n||[]}static async getAppByAppId(t,n){return await t.prepare("SELECT * FROM apps WHERE app_id = ?").bind(n).first()||null}static async createApp(t,n){let a="app_"+Date.now().toString(36)+Math.random().toString(36).substring(2,6),i=new Date().toISOString();return await t.prepare(`
      INSERT INTO apps (id, app_id, name, icon_url, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(a,n.app_id.trim(),n.name.trim(),n.icon_url?.trim()||null,n.description?.trim()||null,i,i).run(),{id:a,app_id:n.app_id.trim(),name:n.name.trim(),icon_url:n.icon_url||null,description:n.description||null,created_at:i,updated_at:i}}static async updateApp(t,n,a){let i=new Date().toISOString();await t.prepare(`
      UPDATE apps 
      SET name = COALESCE(?, name),
          icon_url = COALESCE(?, icon_url),
          description = COALESCE(?, description),
          updated_at = ?
      WHERE app_id = ?
    `).bind(a.name?.trim()||null,a.icon_url?.trim()||null,a.description?.trim()||null,i,n).run()}static async deleteApp(t,n,a){let{results:i}=await t.prepare("SELECT file_key FROM app_versions WHERE app_id = ?").bind(a).all();if(i&&i.length>0)for(let r of i)r.file_key&&await y.deleteObject(n,r.file_key);try{let{results:r}=await t.prepare("SELECT file_key FROM version_packages WHERE app_id = ?").bind(a).all();if(r&&r.length>0)for(let s of r)s.file_key&&await y.deleteObject(n,s.file_key);await t.prepare("DELETE FROM version_packages WHERE app_id = ?").bind(a).run()}catch{}await t.prepare("DELETE FROM app_versions WHERE app_id = ?").bind(a).run(),await t.prepare("DELETE FROM apps WHERE app_id = ?").bind(a).run()}static schemaEnsured=!1;static async ensureSchema(t){if(!this.schemaEnsured){try{await t.prepare("ALTER TABLE app_versions ADD COLUMN external_url TEXT").run()}catch{}try{await t.prepare("ALTER TABLE app_versions ADD COLUMN use_proxy INTEGER DEFAULT 0").run()}catch{}try{await t.prepare("ALTER TABLE app_versions ADD COLUMN is_cleaned INTEGER DEFAULT 0").run()}catch{}try{await t.prepare('ALTER TABLE app_versions ADD COLUMN platform TEXT DEFAULT "android"').run()}catch{}try{await t.prepare('ALTER TABLE app_versions ADD COLUMN arch TEXT DEFAULT "universal"').run()}catch{}try{await t.prepare(`
        CREATE TABLE IF NOT EXISTS version_packages (
          id TEXT PRIMARY KEY,
          version_id TEXT NOT NULL,
          app_id TEXT NOT NULL,
          platform TEXT NOT NULL DEFAULT 'android',
          arch TEXT NOT NULL DEFAULT 'universal',
          file_key TEXT,
          file_name TEXT NOT NULL,
          file_size INTEGER NOT NULL DEFAULT 0,
          file_md5 TEXT,
          file_sha256 TEXT,
          external_url TEXT,
          use_proxy INTEGER DEFAULT 0,
          is_cleaned INTEGER DEFAULT 0,
          download_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(version_id) REFERENCES app_versions(id) ON DELETE CASCADE
        )
      `).run()}catch{}try{await t.prepare("CREATE INDEX IF NOT EXISTS idx_version_packages_lookup ON version_packages(version_id, platform, arch)").run()}catch{}try{await t.prepare("CREATE INDEX IF NOT EXISTS idx_version_packages_app ON version_packages(app_id, platform, arch)").run()}catch{}this.schemaEnsured=!0}}static async listVersions(t,n,a){await this.ensureSchema(t);let{results:i}=await t.prepare(`
      SELECT * FROM app_versions 
      WHERE app_id = ? 
      ORDER BY version_code DESC, created_at DESC
    `).bind(n).all();if(!i||i.length===0)return[];let r=[];try{r=(await t.prepare(`
        SELECT * FROM version_packages 
        WHERE app_id = ? 
        ORDER BY created_at ASC
      `).bind(n).all()).results||[]}catch{}let s=new Map;for(let o of r){a&&(o.download_url=`${a}/api/v1/app/download?app_id=${encodeURIComponent(o.app_id)}&version_code=${i.find(d=>d.id===o.version_id)?.version_code||0}&package_id=${o.id}`);let l=s.get(o.version_id)||[];l.push(o),s.set(o.version_id,l)}for(let o of i){let l=s.get(o.id);(!l||l.length===0)&&(l=[{id:"pkg_def_"+o.id,version_id:o.id,app_id:o.app_id,platform:o.platform||"android",arch:o.arch||"universal",file_key:o.file_key||null,file_name:o.file_name||"app.apk",file_size:o.file_size||0,file_md5:o.file_md5||null,file_sha256:o.file_sha256||null,external_url:o.external_url||null,use_proxy:o.use_proxy||0,is_cleaned:o.is_cleaned||0,download_count:o.download_count||0,created_at:o.created_at,download_url:a?`${a}/api/v1/app/download?app_id=${encodeURIComponent(o.app_id)}&version_code=${o.version_code}&channel=${encodeURIComponent(o.channel)}`:void 0}]),o.packages=l}return i}static async createVersion(t,n){await this.ensureSchema(t);let a="ver_"+Date.now().toString(36)+Math.random().toString(36).substring(2,6),i=new Date().toISOString(),r=n.channel?.trim()||"default",s=n.min_version_code!==void 0?n.min_version_code:0,o=n.is_force_update?1:0,l=n.is_published!==void 0?n.is_published:1,d=n.external_url?.trim()||null,c=n.use_proxy?1:0,p=n.file_key?.trim()||"",m=n.platform?.trim().toLowerCase()||"android",u=n.arch?.trim().toLowerCase()||"universal",h=n.file_name?.trim()||(d?`app-v${n.version_name}-${m}-${u}`:"app.apk"),_=n.file_size||0;await t.prepare(`
      INSERT INTO app_versions (
        id, app_id, version_code, version_name, min_version_code, channel, 
        changelog, file_key, file_name, file_size, file_md5, file_sha256, 
        is_force_update, is_published, download_count, external_url, use_proxy, is_cleaned, platform, arch, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 0, ?, ?, ?)
    `).bind(a,n.app_id,n.version_code,n.version_name.trim(),s,r,n.changelog?.trim()||"",p,h,_,n.file_md5||null,n.file_sha256||null,o,l,d,c,m,u,i).run();let v=[await this.createPackage(t,{version_id:a,app_id:n.app_id,platform:m,arch:u,file_key:p||void 0,file_name:h,file_size:_,file_md5:n.file_md5,file_sha256:n.file_sha256,external_url:d||void 0,use_proxy:c})];if(n.packages&&Array.isArray(n.packages))for(let f of n.packages){if(!f)continue;let I=await this.createPackage(t,{version_id:a,app_id:n.app_id,platform:f.platform||"universal",arch:f.arch||"universal",file_key:f.file_key,file_name:f.file_name,file_size:f.file_size,file_md5:f.file_md5,file_sha256:f.file_sha256,external_url:f.external_url,use_proxy:f.use_proxy});v.push(I)}return{id:a,app_id:n.app_id,version_code:n.version_code,version_name:n.version_name.trim(),min_version_code:s,channel:r,changelog:n.changelog||"",file_key:p,file_name:h,file_size:_,file_md5:n.file_md5||null,file_sha256:n.file_sha256||null,is_force_update:o,is_published:l,download_count:0,external_url:d,use_proxy:c,is_cleaned:0,platform:m,arch:u,packages:v,created_at:i}}static async createPackage(t,n){await this.ensureSchema(t);let a="pkg_"+Date.now().toString(36)+Math.random().toString(36).substring(2,6),i=new Date().toISOString(),r=n.platform?.trim().toLowerCase()||"android",s=n.arch?.trim().toLowerCase()||"universal",o=n.external_url?.trim()||null,l=n.use_proxy?1:0,d=n.file_key?.trim()||null,c=n.file_name?.trim()||(o?`app-${r}-${s}`:"package.bin"),p=n.file_size||0;return await t.prepare(`
      INSERT INTO version_packages (
        id, version_id, app_id, platform, arch, file_key, file_name, file_size,
        file_md5, file_sha256, external_url, use_proxy, is_cleaned, download_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
    `).bind(a,n.version_id,n.app_id,r,s,d,c,p,n.file_md5||null,n.file_sha256||null,o,l,i,i).run(),{id:a,version_id:n.version_id,app_id:n.app_id,platform:r,arch:s,file_key:d,file_name:c,file_size:p,file_md5:n.file_md5||null,file_sha256:n.file_sha256||null,external_url:o,use_proxy:l,is_cleaned:0,download_count:0,created_at:i,updated_at:i}}static async updatePackage(t,n,a){await this.ensureSchema(t);let i=[],r=[],s=new Date().toISOString();a.platform!==void 0&&(i.push("platform = ?"),r.push(a.platform.trim().toLowerCase()||"android")),a.arch!==void 0&&(i.push("arch = ?"),r.push(a.arch.trim().toLowerCase()||"universal")),a.file_name!==void 0&&(i.push("file_name = ?"),r.push(a.file_name.trim())),a.file_size!==void 0&&(i.push("file_size = ?"),r.push(Number(a.file_size)||0)),a.file_md5!==void 0&&(i.push("file_md5 = ?"),r.push(a.file_md5.trim()||null)),a.file_sha256!==void 0&&(i.push("file_sha256 = ?"),r.push(a.file_sha256.trim()||null)),a.external_url!==void 0&&(i.push("external_url = ?"),r.push(a.external_url.trim()||null)),a.use_proxy!==void 0&&(i.push("use_proxy = ?"),r.push(a.use_proxy?1:0)),i.length!==0&&(i.push("updated_at = ?"),r.push(s),r.push(n),await t.prepare(`UPDATE version_packages SET ${i.join(", ")} WHERE id = ?`).bind(...r).run())}static async deletePackage(t,n,a){let i=await t.prepare("SELECT file_key FROM version_packages WHERE id = ?").bind(a).first();i&&i.file_key&&await y.deleteObject(n,i.file_key),await t.prepare("DELETE FROM version_packages WHERE id = ?").bind(a).run()}static async listPackagesByVersionId(t,n){await this.ensureSchema(t);let{results:a}=await t.prepare("SELECT * FROM version_packages WHERE version_id = ? ORDER BY created_at ASC").bind(n).all();return a||[]}static async getPackageById(t,n){return await this.ensureSchema(t),await t.prepare("SELECT * FROM version_packages WHERE id = ?").bind(n).first()||null}static async incrementPackageDownloadCount(t,n){try{await t.prepare("UPDATE version_packages SET download_count = download_count + 1 WHERE id = ?").bind(n).run()}catch{}}static async getVersionById(t,n){return await this.ensureSchema(t),await t.prepare("SELECT * FROM app_versions WHERE id = ?").bind(n).first()||null}static async updateVersion(t,n,a){await this.ensureSchema(t);let i=[],r=[];a.version_name!==void 0&&(i.push("version_name = ?"),r.push(a.version_name.trim())),a.min_version_code!==void 0&&(i.push("min_version_code = ?"),r.push(a.min_version_code)),a.channel!==void 0&&(i.push("channel = ?"),r.push(a.channel.trim()||"default")),a.changelog!==void 0&&(i.push("changelog = ?"),r.push(a.changelog)),a.is_force_update!==void 0&&(i.push("is_force_update = ?"),r.push(a.is_force_update)),a.is_published!==void 0&&(i.push("is_published = ?"),r.push(a.is_published)),a.external_url!==void 0&&(i.push("external_url = ?"),r.push(a.external_url.trim()||null)),a.use_proxy!==void 0&&(i.push("use_proxy = ?"),r.push(a.use_proxy)),a.file_name!==void 0&&(i.push("file_name = ?"),r.push(a.file_name.trim()||null)),i.length!==0&&(r.push(n),await t.prepare(`UPDATE app_versions SET ${i.join(", ")} WHERE id = ?`).bind(...r).run())}static async deleteVersion(t,n,a){try{let{results:r}=await t.prepare("SELECT file_key FROM version_packages WHERE version_id = ?").bind(a).all();if(r&&r.length>0)for(let s of r)s.file_key&&await y.deleteObject(n,s.file_key);await t.prepare("DELETE FROM version_packages WHERE version_id = ?").bind(a).run()}catch{}let i=await t.prepare("SELECT file_key FROM app_versions WHERE id = ?").bind(a).first();i&&i.file_key&&await y.deleteObject(n,i.file_key),await t.prepare("DELETE FROM app_versions WHERE id = ?").bind(a).run()}static async getLatestPublishedVersion(t,n,a="default"){let i=await t.prepare(`
      SELECT * FROM app_versions 
      WHERE app_id = ? AND channel = ? AND is_published = 1 
      ORDER BY version_code DESC, created_at DESC 
      LIMIT 1
    `).bind(n,a).first();return!i&&a!=="default"&&(i=await t.prepare(`
        SELECT * FROM app_versions 
        WHERE app_id = ? AND channel = 'default' AND is_published = 1 
        ORDER BY version_code DESC, created_at DESC 
        LIMIT 1
      `).bind(n).first()),i||null}static async getVersionForDownload(t,n,a,i="default"){if(a!==void 0&&!isNaN(a)&&a>0){let r=await t.prepare(`
        SELECT * FROM app_versions 
        WHERE app_id = ? AND version_code = ? AND is_published = 1 
        ORDER BY created_at DESC LIMIT 1
      `).bind(n,a).first();if(r)return r}return await this.getLatestPublishedVersion(t,n,i)}static async getPackageForDownload(t,n,a,i,r){if(await this.ensureSchema(t),r){let o=await this.getPackageById(t,r);if(o&&o.version_id===n.id)return o}let s=await this.listPackagesByVersionId(t,n.id);if(s&&s.length>0){let o=a?.trim().toLowerCase(),l=i?.trim().toLowerCase();if(o&&l){let d=s.find(c=>c.platform.toLowerCase()===o&&c.arch.toLowerCase()===l);if(d)return d}if(o){let d=s.find(p=>p.platform.toLowerCase()===o&&(p.arch.toLowerCase()==="universal"||p.arch.toLowerCase()==="all"));if(d)return d;let c=s.find(p=>p.platform.toLowerCase()===o);if(c)return c}if(l){let d=s.find(c=>c.arch.toLowerCase()===l);if(d)return d}return s[0]}return{id:"pkg_def_"+n.id,version_id:n.id,app_id:n.app_id,platform:n.platform||"android",arch:n.arch||"universal",file_key:n.file_key||null,file_name:n.file_name||"app.apk",file_size:n.file_size||0,file_md5:n.file_md5||null,file_sha256:n.file_sha256||null,external_url:n.external_url||null,use_proxy:n.use_proxy||0,is_cleaned:n.is_cleaned||0,download_count:n.download_count||0,created_at:n.created_at}}static async incrementDownloadCount(t,n){try{await t.prepare("UPDATE app_versions SET download_count = download_count + 1 WHERE id = ?").bind(n).run()}catch(a){console.warn("[AppService] Failed to increment download count:",a)}}static async checkAppUpdate(t,n,a=0,i="default",r,s,o){let l=await this.getAppByAppId(t,n);if(!l)return null;let d=await this.getLatestPublishedVersion(t,n,i);if(!d)return null;let c=d.version_code>a,p=!1;c&&(d.is_force_update===1||d.min_version_code>0&&a<d.min_version_code)&&(p=!0);let m=await this.getPackageForDownload(t,d,s,o),u=await this.listPackagesByVersionId(t,d.id),h=u&&u.length>0?u.map(E=>({...E,download_url:`${r}/api/v1/app/download?app_id=${encodeURIComponent(n)}&version_code=${d.version_code}&channel=${encodeURIComponent(d.channel)}&package_id=${E.id}`})):[{...m,download_url:`${r}/api/v1/app/download?app_id=${encodeURIComponent(n)}&version_code=${d.version_code}&channel=${encodeURIComponent(d.channel)}`}],_=`${r}/api/v1/app/download?app_id=${encodeURIComponent(n)}&version_code=${d.version_code}&channel=${encodeURIComponent(d.channel)}`;return s&&(_+=`&platform=${encodeURIComponent(s.trim().toLowerCase())}`),o&&(_+=`&arch=${encodeURIComponent(o.trim().toLowerCase())}`),m.id&&!m.id.startsWith("pkg_def_")&&(_+=`&package_id=${encodeURIComponent(m.id)}`),{has_update:c,is_force:p,app_id:l.app_id,app_name:l.name,icon_url:l.icon_url,current_version_code:a>0?a:void 0,latest_version_code:d.version_code,latest_version_name:d.version_name,min_version_code:d.min_version_code,channel:d.channel,changelog:d.changelog||"",download_url:_,file_name:m.file_name,file_size:m.file_size,file_md5:m.file_md5,file_sha256:m.file_sha256,platform:m.platform,arch:m.arch,packages:h,release_time:d.created_at}}};var w={APP_NAME:"Yggdrasil",DEFAULT_ADMIN_PASSWORD:"admin",DEFAULT_JWT_SECRET:"ygg_secret_jwt_sign_key_default_2026",JWT_EXPIRES_IN_SECONDS:604800,DEFAULT_API_TOKEN:"ygg_secret_token_default_2026",TOKEN_HEADER_NAME:"x-ygg-token",TOKEN_QUERY_NAME:"token",COOKIE_NAME:"ygg_admin_session"},b={API_TOKEN_ENABLED:"api_token_enabled",API_FIXED_TOKEN:"api_fixed_token",APP_CHECK_REQUIRE_TOKEN:"app_check_require_token",APP_DOWNLOAD_REQUIRE_TOKEN:"app_download_require_token",FILE_DOWNLOAD_REQUIRE_TOKEN:"file_download_require_token",SITE_TITLE:"site_title",AUTO_CLEANUP_ENABLED:"auto_cleanup_enabled",AUTO_CLEANUP_DAYS:"auto_cleanup_days",AUTO_CLEANUP_KEEP_LATEST:"auto_cleanup_keep_latest",GITHUB_TOKEN:"github_token"};var C=class{static async getSetting(t,n,a=""){try{let i=await t.prepare("SELECT value FROM system_settings WHERE key = ?").bind(n).first();return i?i.value:a}catch(i){return console.warn(`[SettingService] Failed to read setting ${n}:`,i),a}}static async getAllSettings(t){let n={[b.API_TOKEN_ENABLED]:"false",[b.API_FIXED_TOKEN]:w.DEFAULT_API_TOKEN,[b.APP_CHECK_REQUIRE_TOKEN]:"false",[b.APP_DOWNLOAD_REQUIRE_TOKEN]:"false",[b.FILE_DOWNLOAD_REQUIRE_TOKEN]:"false",[b.SITE_TITLE]:"Yggdrasil - \u5E94\u7528\u4E0E\u6587\u4EF6\u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3",[b.AUTO_CLEANUP_ENABLED]:"false",[b.AUTO_CLEANUP_DAYS]:"90",[b.AUTO_CLEANUP_KEEP_LATEST]:"3",[b.GITHUB_TOKEN]:""};try{let{results:a}=await t.prepare("SELECT key, value FROM system_settings").all();if(a&&a.length>0)for(let i of a)n[i.key]=i.value}catch(a){console.warn("[SettingService] Failed to query system_settings table:",a)}return n}static async setSetting(t,n,a,i){let r=new Date().toISOString();await t.prepare(`
      INSERT INTO system_settings (key, value, description, updated_at) 
      VALUES (?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(n,a,i||null,r).run()}static async updateSettings(t,n){let a=Object.entries(n).map(([i,r])=>{let s=new Date().toISOString();return t.prepare(`
        INSERT INTO system_settings (key, value, updated_at) 
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind(i,String(r),s)});a.length>0&&await t.batch(a)}static async checkAuthRequirement(t,n){let a=await this.getAllSettings(t),i=a[b.API_TOKEN_ENABLED]==="true",r=a[b.API_FIXED_TOKEN]||w.DEFAULT_API_TOKEN;if(!i)return{required:!1,fixedToken:r};let s="";return n==="app_check"?s=b.APP_CHECK_REQUIRE_TOKEN:n==="app_download"?s=b.APP_DOWNLOAD_REQUIRE_TOKEN:n==="file_download"&&(s=b.FILE_DOWNLOAD_REQUIRE_TOKEN),{required:a[s]==="true",fixedToken:r}}};function L(e){return async(t,n)=>{let{required:a,fixedToken:i}=await C.checkAuthRequirement(t.env.DB,e);if(!a)return await n();let r=t.req.header(w.TOKEN_HEADER_NAME);if(!r){let s=t.req.header("authorization");s&&s.startsWith("Bearer ")&&(r=s.substring(7).trim())}if(r||(r=t.req.query(w.TOKEN_QUERY_NAME)),!r||r.trim()!==i.trim())return t.json({code:401,message:"Unauthorized: Invalid or missing API Token. Please provide valid token in X-Ygg-Token header or ?token= query parameter."},401);await n()}}var ne=new T;function tt(e){let t=(e||"").toLowerCase();return t.endsWith(".apk")?"application/vnd.android.package-archive":t.endsWith(".ipa")?"application/octet-stream":t.endsWith(".exe")?"application/x-msdownload":t.endsWith(".msi")?"application/x-msi":t.endsWith(".dmg")?"application/x-apple-diskimage":t.endsWith(".pkg")?"application/octet-stream":t.endsWith(".deb")?"application/vnd.debian.binary-package":t.endsWith(".rpm")?"application/x-rpm":t.endsWith(".appimage")?"application/octet-stream":t.endsWith(".zip")?"application/zip":t.endsWith(".tar.gz")||t.endsWith(".tgz")?"application/gzip":"application/octet-stream"}var at=async e=>{let t=e.req.query("app_id")||e.req.query("appId")||e.req.query("package_name");if(!t)return e.json({code:400,message:"Missing required query parameter: app_id (e.g. ?app_id=com.example.app)"},400);let n=e.req.query("version_code")||e.req.query("versionCode")||"0",a=parseInt(n,10)||0,i=e.req.query("channel")||"default",r=e.req.query("platform"),s=e.req.query("arch"),o=new URL(e.req.url).origin,l=await g.checkAppUpdate(e.env.DB,t,a,i,o,r,s);return l?e.json({code:0,message:"success",data:l}):e.json({code:404,message:`App '${t}' or published version not found for channel '${i}'`},404)};ne.get("/api/v1/app/latest",L("app_check"),at);ne.get("/api/v1/version/check",L("app_check"),at);ne.get("/api/v1/app/download",L("app_download"),async e=>{let t=e.req.query("app_id")||e.req.query("appId");if(!t)return e.json({code:400,message:"Missing required query parameter: app_id"},400);let n=e.req.query("version_code")||e.req.query("versionCode"),a=n?parseInt(n,10):void 0,i=e.req.query("channel")||"default",r=e.req.query("platform"),s=e.req.query("arch"),o=e.req.query("package_id")||e.req.query("packageId"),l=await g.getVersionForDownload(e.env.DB,t,a,i);if(!l)return e.json({code:404,message:"Requested App version not found or not published"},404);let d=await g.getPackageForDownload(e.env.DB,l,r,s,o);try{e.executionCtx.waitUntil(Promise.all([g.incrementDownloadCount(e.env.DB,l.id),d.id&&!d.id.startsWith("pkg_def_")?g.incrementPackageDownloadCount(e.env.DB,d.id):Promise.resolve()]))}catch{g.incrementDownloadCount(e.env.DB,l.id).catch(()=>{}),d.id&&!d.id.startsWith("pkg_def_")&&g.incrementPackageDownloadCount(e.env.DB,d.id).catch(()=>{})}if(d.is_cleaned===1&&!d.external_url)return e.json({code:410,message:`\u7248\u672C ${l.version_name} (Code: ${l.version_code}, \u5E73\u53F0: ${d.platform}, \u67B6\u6784: ${d.arch}) \u7684\u5386\u53F2\u5B89\u88C5\u5305\u5DF2\u88AB\u5B58\u50A8\u81EA\u52A8\u6E05\u7406\u7B56\u7565\u5F52\u6863\u6E05\u7406\u3002\u8BF7\u4E0B\u8F7D\u6700\u65B0\u7248\u672C\u3002`},410);if(d.external_url&&d.external_url.trim()){let m=d.external_url.trim(),u=new URL(e.req.url).origin;if(m.startsWith(u)||m.includes("/api/v1/app/download"))return e.json({code:400,message:"\u914D\u7F6E\u9519\u8BEF\uFF1A\u7B2C\u4E09\u65B9\u5916\u94FE (external_url) \u4E0D\u80FD\u6307\u5411\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684\u4E0B\u8F7D\u63A5\u53E3 (/api/v1/app/download)\uFF0C\u5426\u5219\u4F1A\u9020\u6210\u65E0\u9650\u91CD\u5B9A\u5411\u5FAA\u73AF\u3002\u8BF7\u5728\u540E\u53F0\u7BA1\u7406\u754C\u9762\u4FEE\u6539\u6B64\u5B89\u88C5\u5305\u7684\u5916\u90E8\u4E0B\u8F7D\u76F4\u94FE\u3002"},400);if(d.use_proxy===1){let h=new Headers,_=e.req.header("range");_&&h.set("Range",_),h.set("User-Agent",e.req.header("user-agent")||"Yggdrasil-Edge-Proxy/1.0");try{let E=m,v=m.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)$/);if(v){let R=await C.getSetting(e.env.DB,b.GITHUB_TOKEN,"");if(R&&R.trim()){let[,H,U,W,P]=v,M=decodeURIComponent(P);try{let O=await fetch(`https://api.github.com/repos/${H}/${U}/releases/tags/${encodeURIComponent(W)}`,{headers:{Authorization:`Bearer ${R.trim()}`,"User-Agent":"Yggdrasil-Edge-Proxy/1.0",Accept:"application/vnd.github+json"}});if(O.ok){let N=(await O.json()).assets?.find(dt=>dt.name===M);N&&(E=`https://api.github.com/repos/${H}/${U}/releases/assets/${N.id}`,h.set("Authorization",`Bearer ${R.trim()}`),h.set("Accept","application/octet-stream"))}}catch(O){console.warn("[Proxy] Failed to query GitHub Release Asset API:",O)}}}let f=await fetch(E,{method:"GET",headers:h,redirect:"follow"});if(!f.ok){let R=(e.req.header("accept")||"").includes("text/html"),H=m.includes("github.com"),U="";return f.status===404&&H&&(U="\uFF08\u63D0\u793A\uFF1AGitHub \u79C1\u6709\u4ED3\u5E93\u672A\u914D\u7F6E\u6709\u6548 Token \u4F1A\u8FD4\u56DE 404\u3002\u8BF7\u5728\u300C\u7CFB\u7EDF\u8BBE\u7F6E\u300D\u4E2D\u914D\u7F6E GitHub Access Token\uFF0C\u6216\u5C06\u4ED3\u5E93\u8BBE\u4E3A Public\uFF0C\u6216\u76F4\u63A5\u5728\u63A7\u5236\u53F0\u4E0A\u4F20\u6587\u4EF6\u5230 R2 \u5B58\u50A8\uFF09"),R?e.html(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u53CD\u5411\u4EE3\u7406\u4E0B\u8F7D\u5931\u8D25 - Yggdrasil</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box; }
    .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; padding: 2rem; max-width: 600px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    h2 { color: #f87171; margin-top: 0; display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; }
    .msg { color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 1rem 0; }
    .box { background: #080c14; border: 1px solid #1e293b; border-radius: 8px; padding: 0.875rem 1rem; margin: 1rem 0; font-size: 0.85rem; color: #38bdf8; word-break: break-all; font-family: monospace; }
    .hint { background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 6px; color: #fbbf24; font-size: 0.875rem; margin: 1.25rem 0; line-height: 1.6; }
    .hint strong { color: #fef08a; }
    .btn { display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 0.65rem 1.5rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; margin-top: 0.5rem; transition: background 0.2s; }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h2>\u26A0\uFE0F \u53CD\u5411\u4EE3\u7406\u4E0B\u8F7D\u5931\u8D25</h2>
    <div class="msg">Edge \u8282\u70B9\u5C1D\u8BD5\u4EE3\u7406\u62C9\u53D6\u7B2C\u4E09\u65B9\u5B89\u88C5\u5305\u65F6\uFF0C\u6E90\u7AD9\u8FD4\u56DE\u4E86\u5F02\u5E38\u72B6\u6001\uFF1A<strong>HTTP ${f.status} (${f.statusText})</strong></div>
    <div class="box">${m}</div>
    ${H?`
    <div class="hint">
      <strong>\u{1F4A1} \u6392\u67E5\u539F\u56E0\uFF1AGitHub \u79C1\u6709\u4ED3\u5E93\u9650\u5236</strong><br>
      \u68C0\u6D4B\u5230\u76EE\u6807\u4E3A GitHub Release \u94FE\u63A5\u3002\u82E5\u4ED3\u5E93\u4E3A <strong>Private\uFF08\u79C1\u6709\uFF09</strong>\uFF0CGitHub \u4E25\u7981\u4EFB\u4F55\u672A\u767B\u5F55\u7684\u5916\u90E8\u8BF7\u6C42\u76F4\u63A5\u4E0B\u8F7D Release \u8D44\u6E90\u5E76\u56FA\u5B9A\u8FD4\u56DE 404\u3002<br><br>
      <strong>\u5EFA\u8BAE\u89E3\u51B3\u65B9\u6848\uFF08\u4E09\u9009\u4E00\uFF09\uFF1A</strong><br>
      1. <strong>\u5728 Yggdrasil \u914D\u7F6E GitHub Token\uFF08\u5F3A\u70C8\u63A8\u8350\uFF09\uFF1A</strong>\u5728 Yggdrasil\u300C\u7CFB\u7EDF\u8BBE\u7F6E\u300D\u4E2D\u586B\u5165 GitHub Personal Access Token (PAT)\uFF0CEdge \u8282\u70B9\u5373\u53EF\u81EA\u52A8\u89E3\u9501\u5E76\u4EE3\u7406\u4E0B\u8F7D\u79C1\u6709 Release \u5B89\u88C5\u5305\uFF0C\u4EE3\u7801\u4F9D\u7136\u4FDD\u6301 100% \u95ED\u6E90\u4FDD\u5BC6\uFF01<br>
      2. <strong>\u76F4\u63A5\u5728\u540E\u53F0\u4E0A\u4F20 APK \u81F3 R2\uFF1A</strong>\u5728 Yggdrasil \u63A7\u5236\u53F0\u9009\u62E9\u300C\u4E0A\u4F20 APK \u5230 R2 \u5B58\u50A8\u300D\uFF08\u652F\u6301\u5927\u6587\u4EF6\u5206\u7247\u76F4\u4F20\uFF09\uFF0C\u65E0\u9700\u4F9D\u8D56 GitHub \u4E14\u56FD\u5185\u5916\u4E0B\u8F7D\u901F\u5EA6\u66F4\u5FEB\uFF1B<br>
      3. <strong>\u5C06 GitHub \u4ED3\u5E93\u8BBE\u4E3A Public \u516C\u5F00\uFF1A</strong>\u5728 GitHub \u4ED3\u5E93 Settings &rarr; Danger Zone \u5C06\u53EF\u89C1\u6027\u6539\u4E3A Public\uFF0C\u516C\u5F00\u540E\u76F4\u94FE\u53CA\u53CD\u4EE3\u5747\u53EF\u79D2\u7EA7\u751F\u6548\u4E0B\u8F7D\u3002
    </div>`:""}
    <a href="/admin" class="btn">\u8FD4\u56DE\u540E\u53F0\u7BA1\u7406</a>
  </div>
</body>
</html>`,404):e.json({code:404,message:`\u53CD\u5411\u4EE3\u7406\u4E0B\u8F7D\u7B2C\u4E09\u65B9\u5B89\u88C5\u5305\u5931\u8D25: \u7B2C\u4E09\u65B9\u6E90\u7AD9\u8FD4\u56DE HTTP ${f.status} (${f.statusText})\u3002${U}`,data:{status:f.status,upstream_url:m}},404)}let I=new Headers,G=f.headers.get("content-type"),Z=d.file_name||`app-v${l.version_name}-${d.platform}-${d.arch}`;return G&&!G.includes("text/html")&&!G.includes("text/plain")?I.set("Content-Type",G):I.set("Content-Type",tt(Z)),I.set("Content-Disposition",`attachment; filename="${encodeURIComponent(Z)}"`),I.set("Accept-Ranges","bytes"),I.set("Cache-Control","public, max-age=3600"),f.headers.has("etag")&&I.set("ETag",f.headers.get("etag")),f.headers.has("last-modified")&&I.set("Last-Modified",f.headers.get("last-modified")),f.status===206&&f.headers.has("content-range")&&I.set("Content-Range",f.headers.get("content-range")),!f.headers.has("content-encoding")&&f.headers.has("content-length")&&I.set("Content-Length",f.headers.get("content-length")),new Response(f.body,{status:f.status,statusText:f.statusText,headers:I})}catch(E){return e.json({code:500,message:"\u53CD\u5411\u4EE3\u7406\u4E0B\u8F7D\u7B2C\u4E09\u65B9\u5B89\u88C5\u5305\u7F51\u7EDC\u5F02\u5E38: "+E.message},500)}}return e.redirect(m,302)}let c=e.req.header("range"),p=d.file_name||`app-v${l.version_name}-${d.platform}-${d.arch}`;return await y.serveFileWithRange(e.env.BUCKET,d.file_key||"",p,c,tt(p))});var x=class{static async listFiles(t,n){let a="SELECT * FROM files WHERE 1=1",i="SELECT COUNT(1) as total FROM files WHERE 1=1",r=[],s=[];if(n?.category&&n.category!=="all"&&(a+=" AND category = ?",i+=" AND category = ?",r.push(n.category),s.push(n.category)),n?.search){let p=`%${n.search}%`;a+=" AND (name LIKE ? OR file_name LIKE ? OR alias LIKE ?)",i+=" AND (name LIKE ? OR file_name LIKE ? OR alias LIKE ?)",r.push(p,p,p),s.push(p,p,p)}a+=" ORDER BY created_at DESC";let o=n?.limit||50,l=n?.offset||0;a+=" LIMIT ? OFFSET ?",r.push(o,l);let d=await t.prepare(i).bind(...s).first(),{results:c}=await t.prepare(a).bind(...r).all();return{files:c||[],total:d?.total||0}}static async getFileById(t,n){return await t.prepare("SELECT * FROM files WHERE id = ?").bind(n).first()||null}static async getFileByAlias(t,n){return await t.prepare("SELECT * FROM files WHERE alias = ?").bind(n).first()||null}static async createFile(t,n){let a="f_"+Date.now().toString(36)+Math.random().toString(36).substring(2,6),i=new Date().toISOString(),r=n.category?.trim()||"general",s=n.is_public!==void 0?n.is_public:1,o=n.alias?.trim()||null;return await t.prepare(`
      INSERT INTO files (
        id, name, category, file_key, file_name, file_size, 
        mime_type, file_md5, alias, is_public, download_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).bind(a,n.name.trim(),r,n.file_key,n.file_name,n.file_size,n.mime_type||null,n.file_md5||null,o,s,i).run(),{id:a,name:n.name.trim(),category:r,file_key:n.file_key,file_name:n.file_name,file_size:n.file_size,mime_type:n.mime_type||null,file_md5:n.file_md5||null,alias:o,is_public:s,download_count:0,created_at:i}}static async updateFile(t,n,a){await t.prepare(`
      UPDATE files 
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          alias = COALESCE(?, alias),
          is_public = COALESCE(?, is_public)
      WHERE id = ?
    `).bind(a.name?.trim()||null,a.category?.trim()||null,a.alias!==void 0&&a.alias?.trim()||null,a.is_public!==void 0?a.is_public:null,n).run()}static async deleteFile(t,n,a){let i=await this.getFileById(t,a);i&&i.file_key&&await y.deleteObject(n,i.file_key),await t.prepare("DELETE FROM files WHERE id = ?").bind(a).run()}static async incrementDownloadCount(t,n){try{await t.prepare("UPDATE files SET download_count = download_count + 1 WHERE id = ?").bind(n).run()}catch(a){console.warn("[FileService] Failed to increment download count:",a)}}static async getCategories(t){let{results:n}=await t.prepare("SELECT DISTINCT category FROM files WHERE category IS NOT NULL").all();return(n||[]).map(a=>a.category).filter(Boolean)}};var J=new T;J.get("/api/v1/files/check",L("file_download"),async e=>{let t=e.req.query("alias"),n=e.req.query("id"),a=null;if(t)a=await x.getFileByAlias(e.env.DB,t);else if(n)a=await x.getFileById(e.env.DB,n);else return e.json({code:400,message:"Missing alias or id query parameter"},400);if(!a)return e.json({code:404,message:"File not found"},404);let i=new URL(e.req.url).origin,r=a.alias?`${i}/f/${a.alias}`:`${i}/api/v1/files/${a.id}/download`;return e.json({code:0,message:"success",data:{id:a.id,name:a.name,category:a.category,file_name:a.file_name,file_size:a.file_size,mime_type:a.mime_type,file_md5:a.file_md5,alias:a.alias,download_count:a.download_count,download_url:r,created_at:a.created_at}})});J.get("/api/v1/files/:id/check",L("file_download"),async e=>{let t=e.req.param("id"),n=await x.getFileById(e.env.DB,t);if(!n)return e.json({code:404,message:"File not found"},404);let a=new URL(e.req.url).origin,i=n.alias?`${a}/f/${n.alias}`:`${a}/api/v1/files/${n.id}/download`;return e.json({code:0,message:"success",data:{id:n.id,name:n.name,category:n.category,file_name:n.file_name,file_size:n.file_size,mime_type:n.mime_type,file_md5:n.file_md5,alias:n.alias,download_count:n.download_count,download_url:i,created_at:n.created_at}})});J.get("/api/v1/files/:id/download",L("file_download"),async e=>{let t=e.req.param("id"),n=await x.getFileById(e.env.DB,t);if(!n)return e.json({code:404,message:"File not found"},404);try{e.executionCtx.waitUntil(x.incrementDownloadCount(e.env.DB,n.id))}catch{x.incrementDownloadCount(e.env.DB,n.id).catch(()=>{})}let a=e.req.header("range");return await y.serveFileWithRange(e.env.BUCKET,n.file_key,n.file_name,a,n.mime_type)});J.get("/f/:alias",L("file_download"),async e=>{let t=e.req.param("alias"),n=await x.getFileByAlias(e.env.DB,t);if(!n)return e.json({code:404,message:"File not found by alias"},404);try{e.executionCtx.waitUntil(x.incrementDownloadCount(e.env.DB,n.id))}catch{x.incrementDownloadCount(e.env.DB,n.id).catch(()=>{})}let a=e.req.header("range");return await y.serveFileWithRange(e.env.BUCKET,n.file_key,n.file_name,a,n.mime_type)});function Ie(e){return btoa(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function nt(e){for(e=e.replace(/-/g,"+").replace(/_/g,"/");e.length%4;)e+="=";return atob(e)}async function rt(e){let t=new TextEncoder;return await crypto.subtle.importKey("raw",t.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign","verify"])}async function it(e,t){let a=Ie(JSON.stringify({alg:"HS256",typ:"JWT"})),i=Ie(JSON.stringify(e)),r=`${a}.${i}`,s=await rt(t),o=await crypto.subtle.sign("HMAC",s,new TextEncoder().encode(r)),l=String.fromCharCode(...new Uint8Array(o)),d=Ie(l);return`${r}.${d}`}async function Ae(e,t){try{let n=e.split(".");if(n.length!==3)return null;let[a,i,r]=n,s=`${a}.${i}`,o=await rt(t),l=nt(r),d=new Uint8Array(l.length);for(let u=0;u<l.length;u++)d[u]=l.charCodeAt(u);if(!await crypto.subtle.verify("HMAC",o,d,new TextEncoder().encode(s)))return null;let p=nt(i),m=JSON.parse(p);return m.exp&&Date.now()/1e3>m.exp?null:m}catch{return null}}var D=async(e,t)=>{let n=e.req.header("authorization"),a="";if(n&&n.startsWith("Bearer "))a=n.substring(7).trim();else{let s=e.req.header("cookie");if(s){let o=s.match(new RegExp(`(?:^|;\\s*)${w.COOKIE_NAME}=([^;]+)`));o&&(a=o[1])}}if(!a)return e.json({code:401,message:"Unauthorized: Admin authentication token required"},401);let i=e.env.JWT_SECRET||w.DEFAULT_JWT_SECRET,r=await Ae(a,i);if(!r||r.role!=="admin")return e.json({code:401,message:"Unauthorized: Invalid or expired session"},401);e.set("adminUser",r),await t()};var X=new T;X.post("/api/admin/login",async e=>{try{let t=await e.req.json(),n=e.env.ADMIN_PASSWORD||w.DEFAULT_ADMIN_PASSWORD;if(!t.password||t.password!==n)return e.json({code:401,message:"Invalid admin password"},401);let a=e.env.JWT_SECRET||w.DEFAULT_JWT_SECRET,i=Math.floor(Date.now()/1e3),r={sub:"admin",role:"admin",iat:i,exp:i+w.JWT_EXPIRES_IN_SECONDS},s=await it(r,a),o=new URL(e.req.url).protocol==="https:",l=[`${w.COOKIE_NAME}=${s}`,"Path=/",`Max-Age=${w.JWT_EXPIRES_IN_SECONDS}`,"HttpOnly","SameSite=Lax"];o&&l.push("Secure");let d=e.json({code:0,message:"Login successful",data:{token:s,expiresIn:w.JWT_EXPIRES_IN_SECONDS}});return d.headers.set("Set-Cookie",l.join("; ")),d}catch(t){return e.json({code:400,message:"Bad request: "+(t.message||"Unknown error")},400)}});X.post("/api/admin/logout",async e=>{let t=e.json({code:0,message:"Logged out successfully"});return t.headers.set("Set-Cookie",`${w.COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`),t});X.get("/api/admin/me",D,async e=>e.json({code:0,message:"Authenticated",data:{user:"admin",role:"admin"}}));X.get("/api/admin/stats",D,async e=>{try{let t=await e.env.DB.prepare(`
      SELECT 
        (SELECT COUNT(1) FROM apps) AS total_apps,
        (SELECT COUNT(1) FROM app_versions) AS total_versions,
        (SELECT COALESCE(SUM(file_size), 0) FROM app_versions) AS app_storage_bytes,
        (SELECT COALESCE(SUM(download_count), 0) FROM app_versions) AS app_downloads
    `).first(),n=await e.env.DB.prepare(`
      SELECT 
        (SELECT COUNT(1) FROM files) AS total_files,
        (SELECT COALESCE(SUM(file_size), 0) FROM files) AS file_storage_bytes,
        (SELECT COALESCE(SUM(download_count), 0) FROM files) AS file_downloads
    `).first(),a=t?.total_apps||0,i=t?.total_versions||0,r=n?.total_files||0,s=(t?.app_storage_bytes||0)+(n?.file_storage_bytes||0),o=(t?.app_downloads||0)+(n?.file_downloads||0);return e.json({code:0,message:"success",data:{totalApps:a,totalVersions:i,totalFiles:r,totalStorageBytes:s,totalDownloads:o}})}catch(t){return e.json({code:500,message:"Failed to query system stats: "+t.message},500)}});var S=new T;S.use("/api/admin/*",D);S.get("/api/admin/apps",async e=>{let t=await g.listApps(e.env.DB);return e.json({code:0,message:"success",data:t})});S.get("/api/admin/apps/:appId",async e=>{let t=e.req.param("appId"),n=await g.getAppByAppId(e.env.DB,t);return n?e.json({code:0,message:"success",data:n}):e.json({code:404,message:"App not found"},404)});S.post("/api/admin/apps",async e=>{try{let t=await e.req.json();if(!t.app_id||!t.name)return e.json({code:400,message:"app_id and name are required"},400);if(await g.getAppByAppId(e.env.DB,t.app_id))return e.json({code:409,message:`App with app_id '${t.app_id}' already exists`},409);let a=await g.createApp(e.env.DB,t);return e.json({code:0,message:"App created successfully",data:a})}catch(t){return e.json({code:500,message:"Failed to create app: "+t.message},500)}});S.put("/api/admin/apps/:appId",async e=>{try{let t=e.req.param("appId"),n=await e.req.json();return await g.updateApp(e.env.DB,t,n),e.json({code:0,message:"App updated successfully"})}catch(t){return e.json({code:500,message:"Failed to update app: "+t.message},500)}});S.delete("/api/admin/apps/:appId",async e=>{try{let t=e.req.param("appId");return await g.deleteApp(e.env.DB,e.env.BUCKET,t),e.json({code:0,message:"App and associated versions deleted successfully"})}catch(t){return e.json({code:500,message:"Failed to delete app: "+t.message},500)}});S.get("/api/admin/apps/:appId/versions",async e=>{let t=e.req.param("appId"),n=await g.listVersions(e.env.DB,t);return e.json({code:0,message:"success",data:n})});S.post("/api/admin/apps/:appId/versions",async e=>{try{let t=e.req.param("appId"),n=await e.req.json();if(!n.version_code||!n.version_name||!n.file_key&&!n.external_url)return e.json({code:400,message:"\u5FC5\u987B\u586B\u5199\u7248\u672C\u53F7\u3001\u7248\u672C\u540D\u79F0\uFF0C\u5E76\u9009\u62E9\u4E0A\u4F20\u5B89\u88C5\u5305\u6587\u4EF6\u6216\u586B\u5199\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE"},400);if(n.external_url&&n.external_url.trim()){let i=n.external_url.trim();if(!i.startsWith("http://")&&!i.startsWith("https://"))return e.json({code:400,message:"\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE\u5FC5\u987B\u4EE5 http:// \u6216 https:// \u5F00\u5934"},400);if(i.includes("/api/v1/app/download"))return e.json({code:400,message:"\u7B2C\u4E09\u65B9\u76F4\u94FE\u4E0D\u80FD\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684 /api/v1/app/download \u5730\u5740\uFF0C\u5FC5\u987B\u4E3A\u5916\u90E8\u6E90\u7AD9\u771F\u5B9E\u4E0B\u8F7D\u94FE\u63A5\uFF01"},400)}let a=await g.createVersion(e.env.DB,{...n,app_id:t});return e.json({code:0,message:"Version published successfully",data:a})}catch(t){return e.json({code:500,message:"Failed to publish version: "+t.message},500)}});S.put("/api/admin/versions/:id",async e=>{try{let t=e.req.param("id"),n=await e.req.json();if(n.external_url&&n.external_url.trim()){let a=n.external_url.trim();if(!a.startsWith("http://")&&!a.startsWith("https://"))return e.json({code:400,message:"\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE\u5FC5\u987B\u4EE5 http:// \u6216 https:// \u5F00\u5934"},400);if(a.includes("/api/v1/app/download"))return e.json({code:400,message:"\u7B2C\u4E09\u65B9\u76F4\u94FE\u4E0D\u80FD\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684 /api/v1/app/download \u5730\u5740\uFF0C\u5FC5\u987B\u4E3A\u5916\u90E8\u6E90\u7AD9\u771F\u5B9E\u4E0B\u8F7D\u94FE\u63A5\uFF01"},400)}return await g.updateVersion(e.env.DB,t,n),e.json({code:0,message:"Version updated successfully"})}catch(t){return e.json({code:500,message:"Failed to update version: "+t.message},500)}});S.delete("/api/admin/versions/:id",async e=>{try{let t=e.req.param("id");return await g.deleteVersion(e.env.DB,e.env.BUCKET,t),e.json({code:0,message:"Version deleted successfully"})}catch(t){return e.json({code:500,message:"Failed to delete version: "+t.message},500)}});S.get("/api/admin/versions/:versionId/packages",async e=>{let t=e.req.param("versionId"),n=await g.listPackagesByVersionId(e.env.DB,t);return e.json({code:0,message:"success",data:n})});S.post("/api/admin/versions/:versionId/packages",async e=>{try{let t=e.req.param("versionId"),n=await g.getVersionById(e.env.DB,t);if(!n)return e.json({code:404,message:"Version not found"},404);let a=await e.req.json();if(!a.file_key&&!a.external_url)return e.json({code:400,message:"\u5FC5\u987B\u9009\u62E9\u4E0A\u4F20\u5B89\u88C5\u5305\u6587\u4EF6\u6216\u586B\u5199\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE"},400);if(a.external_url&&a.external_url.trim()){let r=a.external_url.trim();if(!r.startsWith("http://")&&!r.startsWith("https://"))return e.json({code:400,message:"\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE\u5FC5\u987B\u4EE5 http:// \u6216 https:// \u5F00\u5934"},400);if(r.includes("/api/v1/app/download"))return e.json({code:400,message:"\u7B2C\u4E09\u65B9\u76F4\u94FE\u4E0D\u80FD\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684 /api/v1/app/download \u5730\u5740"},400)}let i=await g.createPackage(e.env.DB,{...a,version_id:t,app_id:n.app_id});return e.json({code:0,message:"Package added successfully",data:i})}catch(t){return e.json({code:500,message:"Failed to add package: "+t.message},500)}});S.put("/api/admin/packages/:packageId",async e=>{try{let t=e.req.param("packageId"),n=await e.req.json();if(n.external_url&&n.external_url.trim()){let a=n.external_url.trim();if(!a.startsWith("http://")&&!a.startsWith("https://"))return e.json({code:400,message:"\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE\u5FC5\u987B\u4EE5 http:// \u6216 https:// \u5F00\u5934"},400);if(a.includes("/api/v1/app/download"))return e.json({code:400,message:"\u7B2C\u4E09\u65B9\u76F4\u94FE\u4E0D\u80FD\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684 /api/v1/app/download \u5730\u5740"},400)}return await g.updatePackage(e.env.DB,t,n),e.json({code:0,message:"Package updated successfully"})}catch(t){return e.json({code:500,message:"Failed to update package: "+t.message},500)}});S.delete("/api/admin/packages/:packageId",async e=>{try{let t=e.req.param("packageId");return await g.deletePackage(e.env.DB,e.env.BUCKET,t),e.json({code:0,message:"Package deleted successfully"})}catch(t){return e.json({code:500,message:"Failed to delete package: "+t.message},500)}});var z=new T;z.use("/api/admin/*",D);z.get("/api/admin/files",async e=>{let t=e.req.query("category"),n=e.req.query("search"),a=parseInt(e.req.query("limit")||"50",10),i=parseInt(e.req.query("offset")||"0",10),r=await x.listFiles(e.env.DB,{category:t,search:n,limit:a,offset:i});return e.json({code:0,message:"success",data:r})});z.get("/api/admin/categories",async e=>{let t=await x.getCategories(e.env.DB);return e.json({code:0,message:"success",data:t})});z.post("/api/admin/files",async e=>{try{let t=await e.req.json();if(!t.name||!t.file_key||!t.file_name||!t.file_size)return e.json({code:400,message:"Missing required file fields (name, file_key, file_name, file_size)"},400);if(t.alias&&await x.getFileByAlias(e.env.DB,t.alias))return e.json({code:409,message:`File alias '${t.alias}' is already in use`},409);let n=await x.createFile(e.env.DB,t);return e.json({code:0,message:"File created successfully",data:n})}catch(t){return e.json({code:500,message:"Failed to create file: "+t.message},500)}});z.put("/api/admin/files/:id",async e=>{try{let t=e.req.param("id"),n=await e.req.json();if(n.alias){let a=await x.getFileByAlias(e.env.DB,n.alias);if(a&&a.id!==t)return e.json({code:409,message:`File alias '${n.alias}' is already in use`},409)}return await x.updateFile(e.env.DB,t,n),e.json({code:0,message:"File updated successfully"})}catch(t){return e.json({code:500,message:"Failed to update file: "+t.message},500)}});z.delete("/api/admin/files/:id",async e=>{try{let t=e.req.param("id");return await x.deleteFile(e.env.DB,e.env.BUCKET,t),e.json({code:0,message:"File deleted successfully"})}catch(t){return e.json({code:500,message:"Failed to delete file: "+t.message},500)}});var F=new T;F.use("/api/admin/*",D);F.post("/api/admin/upload/direct",async e=>{try{let t=await e.req.formData(),n=t.get("file"),a=t.get("category")||"apk",i=t.get("md5")||"";if(!n||typeof n=="string")return e.json({code:400,message:"No file provided in form-data (field: file)"},400);let r=n,s=r.name||"upload.bin",o=r.size,l=r.type||(s.endsWith(".apk")?"application/vnd.android.package-archive":"application/octet-stream"),d=y.generateFileKey(a,s),c=await r.arrayBuffer(),p=i;if(!p){let u=await crypto.subtle.digest("MD5",c).catch(()=>null);u&&(p=Array.from(new Uint8Array(u)).map(h=>h.toString(16).padStart(2,"0")).join(""))}let m=await y.putObject(e.env.BUCKET,d,c,{httpMetadata:{contentType:l},customMetadata:{originalName:s,md5:p||""}});return e.json({code:0,message:"Upload successful",data:{file_key:d,file_name:s,file_size:o,mime_type:l,file_md5:p||m.httpEtag.replace(/"/g,"")}})}catch(t){return e.json({code:500,message:"Upload failed: "+t.message},500)}});F.post("/api/admin/upload/multipart/init",async e=>{try{let t=await e.req.json();if(!t.fileName)return e.json({code:400,message:"fileName is required"},400);let n=t.category||"apk",a=t.mimeType||(t.fileName.endsWith(".apk")?"application/vnd.android.package-archive":"application/octet-stream"),i=y.generateFileKey(n,t.fileName),r=await y.createMultipartUpload(e.env.BUCKET,i,{contentType:a});return e.json({code:0,message:"Multipart upload initialized",data:{upload_id:r.uploadId,file_key:i,file_name:t.fileName}})}catch(t){return e.json({code:500,message:"Failed to init multipart upload: "+t.message},500)}});F.put("/api/admin/upload/multipart/part",async e=>{try{let t=e.req.query("uploadId")||e.req.query("upload_id"),n=e.req.query("fileKey")||e.req.query("file_key"),a=e.req.query("partNumber")||e.req.query("part_number");if(!t||!n||!a)return e.json({code:400,message:"Missing uploadId, fileKey or partNumber query parameter"},400);let i=parseInt(a,10),r=await e.req.arrayBuffer(),o=await y.resumeMultipartUpload(e.env.BUCKET,n,t).uploadPart(i,r);return e.json({code:0,message:"Part uploaded",data:{partNumber:o.partNumber,etag:o.etag}})}catch(t){return e.json({code:500,message:"Failed to upload part: "+t.message},500)}});F.post("/api/admin/upload/multipart/complete",async e=>{try{let t=await e.req.json();if(!t.upload_id||!t.file_key||!t.parts||t.parts.length===0)return e.json({code:400,message:"Missing upload_id, file_key or parts array"},400);let n=[...t.parts].sort((r,s)=>r.partNumber-s.partNumber),i=await y.resumeMultipartUpload(e.env.BUCKET,t.file_key,t.upload_id).complete(n);return e.json({code:0,message:"Multipart upload completed",data:{file_key:t.file_key,file_name:t.file_name,file_size:t.file_size||i.size,file_md5:t.file_md5||i.httpEtag.replace(/"/g,"")}})}catch(t){return e.json({code:500,message:"Failed to complete multipart upload: "+t.message},500)}});F.post("/api/admin/upload/multipart/abort",async e=>{try{let t=await e.req.json();return!t.upload_id||!t.file_key?e.json({code:400,message:"Missing upload_id or file_key"},400):(await y.resumeMultipartUpload(e.env.BUCKET,t.file_key,t.upload_id).abort(),e.json({code:0,message:"Multipart upload aborted successfully"}))}catch(t){return e.json({code:500,message:"Failed to abort multipart upload: "+t.message},500)}});var B=class{static async runCleanup(t,n){let a=await C.getAllSettings(t);if(!(a[b.AUTO_CLEANUP_ENABLED]==="true"))return{enabled:!1,deleted:0,freedBytes:0,details:[]};let r=parseInt(a[b.AUTO_CLEANUP_DAYS]||"90",10)||90,s=parseInt(a[b.AUTO_CLEANUP_KEEP_LATEST]||"3",10)||3;return await this.executeCleanup(t,n,r,s)}static async forceCleanup(t,n,a,i){return await this.executeCleanup(t,n,a,i)}static async executeCleanup(t,n,a,i){let r=new Date(Date.now()-a*24*60*60*1e3).toISOString(),s={enabled:!0,deleted:0,freedBytes:0,details:[]};try{let{results:o}=await t.prepare("SELECT DISTINCT app_id, channel FROM app_versions").all();if(!o||o.length===0)return s;for(let l of o){let{results:d}=await t.prepare(`SELECT id FROM app_versions 
           WHERE app_id = ? AND channel = ? 
           ORDER BY version_code DESC, created_at DESC 
           LIMIT ?`).bind(l.app_id,l.channel,i).all(),c=new Set((d||[]).map(m=>m.id)),{results:p}=await t.prepare(`SELECT id, app_id, version_name, version_code, channel, file_key, file_size, created_at 
           FROM app_versions 
           WHERE app_id = ? AND channel = ? AND created_at < ? AND (is_cleaned = 0 OR is_cleaned IS NULL) AND (file_key IS NOT NULL AND file_key != '')
           ORDER BY version_code ASC`).bind(l.app_id,l.channel,r).all();if(!(!p||p.length===0)){for(let m of p)if(!c.has(m.id)){if(m.file_key)try{await y.deleteObject(n,m.file_key)}catch(u){console.warn(`[CleanupService] Failed to delete R2 object ${m.file_key}:`,u)}try{let{results:u}=await t.prepare('SELECT id, file_key, file_size FROM version_packages WHERE version_id = ? AND (is_cleaned = 0 OR is_cleaned IS NULL) AND (file_key IS NOT NULL AND file_key != "")').bind(m.id).all();if(u&&u.length>0){for(let h of u)if(h.file_key&&h.file_key!==m.file_key)try{await y.deleteObject(n,h.file_key),s.freedBytes+=h.file_size||0}catch(_){console.warn(`[CleanupService] Failed to delete package R2 object ${h.file_key}:`,_)}}await t.prepare('UPDATE version_packages SET is_cleaned = 1, file_key = "" WHERE version_id = ?').bind(m.id).run()}catch{}await t.prepare('UPDATE app_versions SET is_cleaned = 1, file_key = "" WHERE id = ?').bind(m.id).run(),s.deleted++,s.freedBytes+=m.file_size||0,s.details.push({app_id:m.app_id,version_name:m.version_name,version_code:m.version_code,channel:m.channel,file_size:m.file_size||0,created_at:m.created_at||""})}}}}catch(o){console.error("[CleanupService] Cleanup execution error:",o)}return s}};var q=new T;q.use("/api/admin/*",D);q.get("/api/admin/settings",async e=>{let t=await C.getAllSettings(e.env.DB);return e.json({code:0,message:"success",data:t})});q.put("/api/admin/settings",async e=>{try{let t=await e.req.json();if(!t||typeof t!="object")return e.json({code:400,message:"Invalid payload, expected settings key-value object"},400);await C.updateSettings(e.env.DB,t);let n=await C.getAllSettings(e.env.DB);return e.json({code:0,message:"Settings saved successfully",data:n})}catch(t){return e.json({code:500,message:"Failed to update settings: "+t.message},500)}});q.post("/api/admin/settings/generate-token",async e=>{let t=new Uint8Array(24);crypto.getRandomValues(t);let n="ygg_"+Array.from(t,a=>a.toString(16).padStart(2,"0")).join("");return e.json({code:0,message:"Token generated",data:{token:n}})});q.post("/api/admin/cleanup",async e=>{try{let t=await B.runCleanup(e.env.DB,e.env.BUCKET);return e.json({code:0,message:`Cleanup completed: ${t.deleted} versions removed`,data:t})}catch(t){return e.json({code:500,message:"Cleanup failed: "+t.message},500)}});q.post("/api/admin/cleanup/force",async e=>{try{let t=await e.req.json(),n=t.days||90,a=t.keep_latest||3,i=await B.forceCleanup(e.env.DB,e.env.BUCKET,n,a);return e.json({code:0,message:`Force cleanup completed: ${i.deleted} versions removed`,data:i})}catch(t){return e.json({code:500,message:"Force cleanup failed: "+t.message},500)}});var Q=[{name:"ygg_list_apps",description:"\u5217\u51FA Yggdrasil \u4E2D\u7BA1\u7406\u7684\u6240\u6709\u79FB\u52A8\u5E94\u7528\uFF0C\u5305\u542B\u5E94\u7528\u540D\u79F0\u3001\u5305\u540D(app_id)\u3001\u6700\u65B0\u7248\u672C\u53F7\u3001\u6700\u65B0\u7248\u672C\u540D\u79F0\u3001\u5386\u53F2\u7248\u672C\u603B\u6570\u53CA\u7D2F\u8BA1\u603B\u4E0B\u8F7D\u91CF\u3002",inputSchema:{type:"object",properties:{search:{type:"string",description:"\u53EF\u9009\u7684\u5E94\u7528\u540D\u79F0\u6216\u5305\u540D\u5173\u952E\u5B57\u8FC7\u6EE4\u641C\u7D22"}}}},{name:"ygg_get_app_details",description:"\u83B7\u53D6\u6307\u5B9A\u5E94\u7528\uFF08\u901A\u8FC7 app_id / \u5305\u540D\uFF09\u7684\u8BE6\u7EC6\u914D\u7F6E\u4E0E\u6240\u6709\u5386\u53F2\u7248\u672C\u53D1\u5E03\u5217\u8868\uFF08\u5305\u62EC\u7248\u672C\u53F7\u3001\u6E20\u9053\u3001\u66F4\u65B0\u65E5\u5FD7\u3001\u76F4\u94FE\u3001\u53CD\u4EE3\u8BBE\u7F6E\u53CA\u6587\u4EF6\u5927\u5C0F\uFF09\u3002",inputSchema:{type:"object",properties:{app_id:{type:"string",description:"\u5E94\u7528\u7684\u552F\u4E00\u5305\u540D (\u5982 com.norns.valhalla)"}},required:["app_id"]}},{name:"ygg_check_update",description:"\u5BA2\u6237\u7AEF\u68C0\u6D4B\u66F4\u65B0\u6A21\u62DF\uFF1A\u4F20\u5165\u5E94\u7528 app_id\u3001\u5BA2\u6237\u7AEF\u5F53\u524D\u7248\u672C\u53F7 version_code\u3001\u53D1\u5E03\u6E20\u9053 channel\u3001\u76EE\u6807\u5E73\u53F0 platform \u53CA\u67B6\u6784 arch\uFF0C\u68C0\u6D4B\u662F\u5426\u6709\u65B0\u7248\u672C\u53EF\u4F9B\u5347\u7EA7\uFF0C\u5E76\u8FD4\u56DE\u6700\u9002\u5408\u5F53\u524D\u7CFB\u7EDF\u7684\u4E0B\u8F7D\u76F4\u94FE\u4E0E\u5168\u5E73\u53F0\u5B89\u88C5\u5305\u5217\u8868\u3002",inputSchema:{type:"object",properties:{app_id:{type:"string",description:"\u5E94\u7528\u5305\u540D (\u5982 com.norns.valhalla)"},current_version_code:{type:"number",description:"\u5BA2\u6237\u7AEF\u5F53\u524D\u7248\u672C\u53F7 (\u5982 10000\uFF0C\u9ED8\u8BA4\u4E3A 0)"},channel:{type:"string",description:"\u53D1\u5E03\u6E20\u9053 (\u5982 default, beta, googleplay\uFF0C\u9ED8\u8BA4\u4E3A default)"},platform:{type:"string",description:"\u5BA2\u6237\u7AEF\u64CD\u4F5C\u7CFB\u7EDF\u5E73\u53F0 (\u5982 android, windows, macos, linux, ios\uFF0C\u9ED8\u8BA4\u4E3A universal/android)"},arch:{type:"string",description:"\u5BA2\u6237\u7AEF CPU \u67B6\u6784 (\u5982 universal, arm64-v8a, x86_64, apple-silicon)"}},required:["app_id"]}},{name:"ygg_create_app",description:"\u5728 Yggdrasil \u4E2D\u521B\u5EFA\u6216\u6CE8\u518C\u4E00\u4E2A\u65B0\u7684\u5E94\u7528\u9879\u76EE\u3002",inputSchema:{type:"object",properties:{app_id:{type:"string",description:"\u5E94\u7528\u552F\u4E00\u5305\u540D/Bundle ID (\u5982 com.example.game)"},name:{type:"string",description:"\u5E94\u7528\u5C55\u793A\u540D\u79F0 (\u5982 Valhalla)"},icon_url:{type:"string",description:"\u53EF\u9009\u7684\u5E94\u7528\u56FE\u6807\u56FE\u7247 URL"},description:{type:"string",description:"\u53EF\u9009\u7684\u5E94\u7528\u7B80\u4ECB\u63CF\u8FF0"}},required:["app_id","name"]}},{name:"ygg_update_app",description:"\u66F4\u65B0\u5DF2\u6709\u5E94\u7528\u7684\u57FA\u672C\u4FE1\u606F\uFF08\u5982\u4FEE\u6539\u5E94\u7528\u540D\u79F0\u3001\u56FE\u6807\u94FE\u63A5\u6216\u7B80\u4ECB\uFF09\u3002",inputSchema:{type:"object",properties:{app_id:{type:"string",description:"\u76EE\u6807\u5E94\u7528\u5305\u540D"},name:{type:"string",description:"\u65B0\u7684\u5E94\u7528\u5C55\u793A\u540D\u79F0"},icon_url:{type:"string",description:"\u65B0\u7684\u56FE\u6807 URL"},description:{type:"string",description:"\u65B0\u7684\u7B80\u4ECB\u63CF\u8FF0"}},required:["app_id"]}},{name:"ygg_delete_app",description:"\u5220\u9664\u6307\u5B9A\u5E94\u7528\u53CA\u5176\u540D\u4E0B\u6240\u6709\u5386\u53F2\u7248\u672C\u548C R2 \u5B58\u50A8\u6587\u4EF6\uFF08\u64CD\u4F5C\u4E0D\u53EF\u9006\uFF0C\u8BF7\u8C28\u614E\uFF09\u3002",inputSchema:{type:"object",properties:{app_id:{type:"string",description:"\u9700\u8981\u5220\u9664\u7684\u5E94\u7528\u5305\u540D"}},required:["app_id"]}},{name:"ygg_publish_version",description:"\u4E3A\u5E94\u7528\u53D1\u5E03\u65B0\u7248\u672C\u3002\u652F\u6301\u6307\u5B9A\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE\uFF08\u514D\u4E0A\u4F20\u5230 R2\uFF0C\u53EF\u914D\u7F6E\u8FB9\u7F18\u53CD\u4EE3\u6D41\u5F0F\u52A0\u901F\uFF09\u6216\u5DF2\u4E0A\u4F20\u5230 R2 \u7684\u6587\u4EF6 key\u3002",inputSchema:{type:"object",properties:{app_id:{type:"string",description:"\u5E94\u7528\u5305\u540D"},version_code:{type:"number",description:"\u7248\u672C\u53F7\u6574\u6570 (\u5FC5\u987B\u9012\u589E\uFF0C\u5982 2)"},version_name:{type:"string",description:"\u7248\u672C\u663E\u793A\u540D\u79F0 (\u5982 1.2.0)"},external_url:{type:"string",description:"\u7B2C\u4E09\u65B9 APK/ZIP \u4E0B\u8F7D\u76F4\u94FE (\u5982 GitHub Release \u76F4\u94FE\u3001CDN \u76F4\u94FE)"},use_proxy:{type:"boolean",description:"\u662F\u5426\u5F00\u542F\u8FB9\u7F18\u53CD\u5411\u4EE3\u7406\u6D41\u5F0F\u52A0\u901F (true=\u7531 Worker \u4EE3\u7406\u6D41\u5F0F\u4F20\u8F93\u9690\u85CF\u6E90\u7AD9\u5E76\u652F\u6301\u65AD\u70B9\u7EED\u4F20\uFF0Cfalse=302 \u91CD\u5B9A\u5411)"},channel:{type:"string",description:"\u53D1\u5E03\u6E20\u9053 (\u9ED8\u8BA4 default)"},changelog:{type:"string",description:"\u7248\u672C\u66F4\u65B0\u65E5\u5FD7\u8BF4\u660E"},min_version_code:{type:"number",description:"\u6700\u4F4E\u517C\u5BB9\u7248\u672C\u53F7 (\u4F4E\u4E8E\u6B64\u7248\u672C\u53F7\u7684\u65E7\u5BA2\u6237\u7AEF\u5C06\u88AB\u5F3A\u5236\u66F4\u65B0\uFF0C\u9ED8\u8BA4 0)"},is_force_update:{type:"boolean",description:"\u662F\u5426\u6807\u8BB0\u4E3A\u5168\u91CF\u5F3A\u5236\u66F4\u65B0"},file_name:{type:"string",description:"\u5BA2\u6237\u7AEF\u4E0B\u8F7D\u65F6\u4FDD\u5B58\u7684\u6587\u4EF6\u540D (\u5982 app-v1.2.apk)"},file_size:{type:"number",description:"\u6587\u4EF6\u5927\u5C0F (\u5B57\u8282\u6570)"},platform:{type:"string",description:"\u4E3B\u5305\u5E73\u53F0\u6807\u8BC6 (\u5982 android, windows, macos, linux, ios\uFF0C\u9ED8\u8BA4\u4E3A android)"},arch:{type:"string",description:"\u4E3B\u5305 CPU \u67B6\u6784 (\u5982 universal, arm64-v8a, x86_64\uFF0C\u9ED8\u8BA4\u4E3A universal)"}},required:["app_id","version_code","version_name"]}},{name:"ygg_update_version",description:"\u4FEE\u6539\u5DF2\u6709\u53D1\u5E03\u7248\u672C\u7684\u5C5E\u6027\uFF08\u5982\u4FEE\u6539\u66F4\u65B0\u65E5\u5FD7\u3001\u8C03\u6574\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE\u3001\u5207\u6362\u53CD\u4EE3\u52A0\u901F\u5F00\u5173\u3001\u4FEE\u6539\u4E0A\u4E0B\u67B6\u72B6\u6001\u7B49\uFF09\u3002",inputSchema:{type:"object",properties:{version_id:{type:"string",description:"\u7248\u672C\u552F\u4E00 ID (\u5982 ver_xxx\uFF0C\u53EF\u901A\u8FC7 ygg_get_app_details \u83B7\u53D6)"},version_name:{type:"string",description:"\u4FEE\u6539\u7248\u672C\u663E\u793A\u540D\u79F0"},channel:{type:"string",description:"\u4FEE\u6539\u53D1\u5E03\u6E20\u9053"},min_version_code:{type:"number",description:"\u4FEE\u6539\u6700\u4F4E\u517C\u5BB9\u7248\u672C\u53F7"},changelog:{type:"string",description:"\u4FEE\u6539\u7248\u672C\u66F4\u65B0\u65E5\u5FD7"},external_url:{type:"string",description:"\u4FEE\u6539\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE (\u586B\u7A7A\u5B57\u7B26\u4E32\u53EF\u6E05\u9664\u5916\u94FE)"},use_proxy:{type:"boolean",description:"\u4FEE\u6539\u662F\u5426\u5F00\u542F\u53CD\u5411\u4EE3\u7406\u52A0\u901F"},is_force_update:{type:"boolean",description:"\u4FEE\u6539\u662F\u5426\u5F3A\u5236\u66F4\u65B0"},is_published:{type:"boolean",description:"\u4FEE\u6539\u4E0A\u67B6/\u53D1\u5E03\u72B6\u6001 (false \u4E3A\u5DF2\u4E0B\u67B6)"},file_name:{type:"string",description:"\u4FEE\u6539\u4E0B\u8F7D\u4FDD\u5B58\u6587\u4EF6\u540D"}},required:["version_id"]}},{name:"ygg_delete_version",description:"\u5220\u9664\u6307\u5B9A\u7248\u672C\u8BB0\u5F55\u53CA\u5BF9\u5E94\u7684 R2 \u5B58\u50A8\u6587\u4EF6\u3002",inputSchema:{type:"object",properties:{version_id:{type:"string",description:"\u9700\u8981\u5220\u9664\u7684\u7248\u672C\u552F\u4E00 ID"}},required:["version_id"]}},{name:"ygg_get_system_stats",description:"\u83B7\u53D6 Yggdrasil \u7CFB\u7EDF\u7684\u5168\u5C40\u8FD0\u884C\u6982\u51B5\uFF08\u603B\u5E94\u7528\u6570\u3001\u603B\u7248\u672C\u6570\u3001\u7D2F\u8BA1\u603B\u4E0B\u8F7D\u91CF\u3001\u5B58\u50A8\u5360\u7528\u91CF\uFF09\u3002",inputSchema:{type:"object",properties:{}}},{name:"ygg_trigger_cleanup",description:"\u624B\u52A8\u89E6\u53D1\u6216\u5F3A\u5236\u6267\u884C\u65E7\u7248\u672C\u5B89\u88C5\u5305\u6E05\u7406\u7B56\u7565\uFF0C\u626B\u63CF\u8D85\u671F\u65E7\u7248\u672C\u7269\u7406\u6E05\u7406 R2 \u5B58\u50A8\uFF0C\u91CA\u653E\u7A7A\u95F4\u5E76\u4FDD\u7559\u5B8C\u6574\u5386\u53F2\u8BB0\u5F55\u3002",inputSchema:{type:"object",properties:{days:{type:"number",description:"\u4FDD\u7559\u5929\u6570 (\u8D85\u8FC7\u6B64\u5929\u6570\u7684\u65E7\u7248\u672C\u5C06\u88AB\u6E05\u7406\uFF0C\u9ED8\u8BA4 90)"},keep_latest:{type:"number",description:"\u6BCF\u4E2A\u6E20\u9053\u81F3\u5C11\u4FDD\u7559\u7684\u6700\u65B0\u7248\u672C\u6570 (\u9ED8\u8BA4 3)"},force:{type:"boolean",description:"\u662F\u5426\u5F3A\u5236\u6267\u884C (\u5FFD\u7565\u7CFB\u7EDF\u81EA\u52A8\u6E05\u7406\u5F00\u5173\uFF0C\u76F4\u63A5\u6309\u6240\u4F20\u5929\u6570\u6267\u884C)"}}}},{name:"ygg_list_files",description:"\u5217\u51FA\u901A\u7528\u6587\u4EF6\u7BA1\u7406\u5217\u8868\u4E2D\u7684\u6240\u6709\u6587\u4EF6\u8D44\u6E90\uFF08\u914D\u7F6E\u3001\u6587\u6863\u3001\u901A\u7528\u5B89\u88C5\u5305\u7B49\uFF09\u3002",inputSchema:{type:"object",properties:{category:{type:"string",description:"\u6587\u4EF6\u5206\u7C7B\u8FC7\u6EE4 (\u5982 general, config, apk)"}}}},{name:"ygg_add_version_package",description:"\u4E3A\u6307\u5B9A\u5E94\u7528\u7248\u672C\u9644\u52A0\u65B0\u7684\u591A\u5E73\u53F0\u6216\u591A\u67B6\u6784\u5206\u53D1\u5B89\u88C5\u5305\uFF08\u5982 Windows x86_64\u3001Android arm64-v8a\u3001macOS Apple Silicon \u7B49\uFF09\u3002",inputSchema:{type:"object",properties:{version_id:{type:"string",description:"\u6240\u5C5E\u7248\u672C\u7684\u552F\u4E00 ID (\u5982 ver_xxx)"},platform:{type:"string",description:"\u76EE\u6807\u64CD\u4F5C\u7CFB\u7EDF\u5E73\u53F0 (android, windows, macos, linux, ios, universal)"},arch:{type:"string",description:"\u76EE\u6807 CPU \u67B6\u6784 (universal, arm64-v8a, armeabi-v7a, x86_64, x86, apple-silicon)"},external_url:{type:"string",description:"\u7B2C\u4E09\u65B9\u5B89\u88C5\u5305\u4E0B\u8F7D\u76F4\u94FE (\u514D\u4E0A\u4F20)"},use_proxy:{type:"boolean",description:"\u662F\u5426\u5F00\u542F\u8FB9\u7F18\u53CD\u5411\u4EE3\u7406\u6D41\u5F0F\u52A0\u901F"},file_key:{type:"string",description:"\u5DF2\u4E0A\u4F20\u81F3 R2 \u7684\u5B58\u50A8 Key"},file_name:{type:"string",description:"\u4E0B\u8F7D\u65F6\u4FDD\u5B58\u7684\u6587\u4EF6\u540D"},file_size:{type:"number",description:"\u6587\u4EF6\u5927\u5C0F (\u5B57\u8282\u6570)"},file_md5:{type:"string",description:"MD5 \u6821\u9A8C\u548C"},file_sha256:{type:"string",description:"SHA256 \u6821\u9A8C\u548C"}},required:["version_id","platform","arch"]}},{name:"ygg_delete_version_package",description:"\u5220\u9664\u6307\u5B9A\u5E94\u7528\u7248\u672C\u540D\u4E0B\u7684\u67D0\u4E2A\u5206\u53D1\u5B89\u88C5\u5305\u5E76\u7269\u7406\u5220\u9664\u5BF9\u5E94 R2 \u5B58\u50A8\u3002",inputSchema:{type:"object",properties:{package_id:{type:"string",description:"\u9700\u8981\u5220\u9664\u7684\u5206\u53D1\u5B89\u88C5\u5305\u552F\u4E00 ID (\u5982 pkg_xxx)"}},required:["package_id"]}}];async function ot(e,t,n,a,i){switch(n){case"ygg_list_apps":{let r=await g.listApps(e),s=a.search?String(a.search).trim().toLowerCase():"",o=s?r.filter(l=>l.app_id&&l.app_id.toLowerCase().includes(s)||l.name&&l.name.toLowerCase().includes(s)||l.description&&l.description.toLowerCase().includes(s)):r;return{total:o.length,apps:o.map(l=>({app_id:l.app_id,name:l.name,icon_url:l.icon_url,description:l.description,version_count:l.version_count||0,total_downloads:l.total_downloads||0,latest_version_code:l.latest_version_code||null,latest_version_name:l.latest_version_name||null,created_at:l.created_at,updated_at:l.updated_at}))}}case"ygg_get_app_details":{let r=a.app_id?String(a.app_id).trim():"";if(!r)throw new Error("Missing required argument: app_id");let s=await g.getAppByAppId(e,r);if(!s)throw new Error(`App not found: ${r}`);let o=await g.listVersions(e,r);return{app:s,total_versions:o.length,versions:o.map(l=>({id:l.id,app_id:l.app_id,version_code:l.version_code,version_name:l.version_name,min_version_code:l.min_version_code,channel:l.channel,changelog:l.changelog,external_url:l.external_url||null,use_proxy:!!l.use_proxy,is_cleaned:!!l.is_cleaned,is_force_update:!!l.is_force_update,is_published:!!l.is_published,download_count:l.download_count,file_name:l.file_name,file_size:l.file_size,created_at:l.created_at,download_url:`${i}/api/v1/app/download?app_id=${encodeURIComponent(l.app_id)}&version_code=${l.version_code}&channel=${encodeURIComponent(l.channel)}`}))}}case"ygg_check_update":{let r=a.app_id?String(a.app_id).trim():"";if(!r)throw new Error("Missing required argument: app_id");let s=Number(a.current_version_code)||0,o=a.channel?String(a.channel).trim():"default",l=a.platform?String(a.platform).trim():void 0,d=a.arch?String(a.arch).trim():void 0,c=await g.checkAppUpdate(e,r,s,o,i,l,d);return c||{has_update:!1,message:`No published version found for app '${r}' in channel '${o}'`}}case"ygg_create_app":{let r=a.app_id?String(a.app_id).trim():"",s=a.name?String(a.name).trim():"";if(!r||!s)throw new Error("Missing required arguments: app_id and name");if(await g.getAppByAppId(e,r))throw new Error(`App with app_id '${r}' already exists`);return{message:"App created successfully",app:await g.createApp(e,{app_id:r,name:s,icon_url:a.icon_url?String(a.icon_url).trim():void 0,description:a.description?String(a.description).trim():void 0})}}case"ygg_update_app":{let r=a.app_id?String(a.app_id).trim():"";if(!r)throw new Error("Missing required argument: app_id");if(!await g.getAppByAppId(e,r))throw new Error(`App not found: ${r}`);return await g.updateApp(e,r,{name:a.name!==void 0?String(a.name).trim():void 0,icon_url:a.icon_url!==void 0?String(a.icon_url).trim():void 0,description:a.description!==void 0?String(a.description).trim():void 0}),{message:"App updated successfully",app:await g.getAppByAppId(e,r)}}case"ygg_delete_app":{let r=a.app_id?String(a.app_id).trim():"";if(!r)throw new Error("Missing required argument: app_id");if(!await g.getAppByAppId(e,r))throw new Error(`App not found: ${r}`);return await g.deleteApp(e,t,r),{message:`App '${r}' and all its versions were deleted successfully`}}case"ygg_publish_version":{let r=a.app_id?String(a.app_id).trim():"",s=Number(a.version_code),o=a.version_name?String(a.version_name).trim():"";if(!r||isNaN(s)||!o)throw new Error("Missing required arguments: app_id, version_code, version_name");if(!await g.getAppByAppId(e,r))throw new Error(`App not found: ${r}`);if(a.external_url&&String(a.external_url).trim()){let u=String(a.external_url).trim();if(!u.startsWith("http://")&&!u.startsWith("https://"))throw new Error("external_url must start with http:// or https://");if(u.includes("/api/v1/app/download"))throw new Error("external_url cannot point to the gateway download endpoint")}let d=a.platform?String(a.platform).trim():void 0,c=a.arch?String(a.arch).trim():void 0,p=await g.createVersion(e,{app_id:r,version_code:s,version_name:o,min_version_code:a.min_version_code!==void 0?Number(a.min_version_code):0,channel:a.channel?String(a.channel).trim():"default",changelog:a.changelog?String(a.changelog).trim():"",external_url:a.external_url?String(a.external_url).trim():void 0,use_proxy:a.use_proxy?1:0,is_force_update:a.is_force_update?1:0,file_name:a.file_name?String(a.file_name).trim():void 0,file_size:a.file_size?Number(a.file_size):0,platform:d,arch:c,is_published:1}),m=`${i}/api/v1/app/download?app_id=${encodeURIComponent(p.app_id)}&version_code=${p.version_code}&channel=${encodeURIComponent(p.channel)}`;return d&&(m+=`&platform=${encodeURIComponent(d)}`),c&&(m+=`&arch=${encodeURIComponent(c)}`),{message:"Version published successfully",version:p,download_url:m}}case"ygg_update_version":{let r=a.version_id?String(a.version_id).trim():"";if(!r)throw new Error("Missing required argument: version_id");if(a.external_url&&String(a.external_url).trim()){let s=String(a.external_url).trim();if(!s.startsWith("http://")&&!s.startsWith("https://"))throw new Error("external_url must start with http:// or https://");if(s.includes("/api/v1/app/download"))throw new Error("external_url cannot point to the gateway download endpoint")}return await g.updateVersion(e,r,{version_name:a.version_name!==void 0?String(a.version_name).trim():void 0,channel:a.channel!==void 0?String(a.channel).trim():void 0,min_version_code:a.min_version_code!==void 0?Number(a.min_version_code):void 0,changelog:a.changelog!==void 0?String(a.changelog):void 0,external_url:a.external_url!==void 0?String(a.external_url).trim():void 0,use_proxy:a.use_proxy!==void 0?a.use_proxy?1:0:void 0,is_force_update:a.is_force_update!==void 0?a.is_force_update?1:0:void 0,is_published:a.is_published!==void 0?a.is_published?1:0:void 0,file_name:a.file_name!==void 0?String(a.file_name).trim():void 0}),{message:`Version '${r}' updated successfully`}}case"ygg_delete_version":{let r=a.version_id?String(a.version_id).trim():"";if(!r)throw new Error("Missing required argument: version_id");return await g.deleteVersion(e,t,r),{message:`Version '${r}' deleted successfully`}}case"ygg_get_system_stats":{let r=await e.prepare(`
        SELECT 
          (SELECT COUNT(1) FROM apps) AS total_apps,
          (SELECT COUNT(1) FROM app_versions) AS total_versions,
          (SELECT COALESCE(SUM(file_size), 0) FROM app_versions) AS app_storage_bytes,
          (SELECT COALESCE(SUM(download_count), 0) FROM app_versions) AS app_downloads
      `).first(),s=await e.prepare(`
        SELECT 
          (SELECT COUNT(1) FROM files) AS total_files,
          (SELECT COALESCE(SUM(file_size), 0) FROM files) AS file_storage_bytes,
          (SELECT COALESCE(SUM(download_count), 0) FROM files) AS file_downloads
      `).first(),o=r?.total_apps||0,l=r?.total_versions||0,d=s?.total_files||0,c=(r?.app_storage_bytes||0)+(s?.file_storage_bytes||0),p=(r?.app_downloads||0)+(s?.file_downloads||0);return{total_apps:o,total_versions:l,total_files:d,total_storage_bytes:c,total_storage_mb:(c/(1024*1024)).toFixed(2),total_downloads:p}}case"ygg_trigger_cleanup":{let r=Number(a.days)||90,s=Number(a.keep_latest)||3,o;return a.force?o=await B.forceCleanup(e,t,r,s):o=await B.runCleanup(e,t),{message:`Cleanup completed: ${o.deleted} old version package(s) cleaned, ${(o.freedBytes/(1024*1024)).toFixed(2)} MB freed`,result:o}}case"ygg_list_files":{let r=a.category?String(a.category).trim():void 0,s=await x.listFiles(e,{category:r});return{total:s.total,files:s.files.map(o=>({id:o.id,name:o.name,category:o.category,file_name:o.file_name,file_size:o.file_size,mime_type:o.mime_type,alias:o.alias,download_count:o.download_count,is_public:!!o.is_public,created_at:o.created_at,download_url:o.alias?`${i}/f/${o.alias}`:`${i}/api/v1/files/download/${o.id}`}))}}case"ygg_add_version_package":{let r=a.version_id?String(a.version_id).trim():"",s=a.platform?String(a.platform).trim().toLowerCase():"",o=a.arch?String(a.arch).trim().toLowerCase():"";if(!r||!s||!o)throw new Error("Missing required arguments: version_id, platform, arch");let l=await g.getVersionById(e,r);if(!l)throw new Error(`Version not found: ${r}`);if(a.external_url&&String(a.external_url).trim()){let c=String(a.external_url).trim();if(!c.startsWith("http://")&&!c.startsWith("https://"))throw new Error("external_url must start with http:// or https://");if(c.includes("/api/v1/app/download"))throw new Error("external_url cannot point to the gateway download endpoint")}let d=await g.createPackage(e,{version_id:r,app_id:l.app_id,platform:s,arch:o,file_key:a.file_key?String(a.file_key).trim():void 0,file_name:a.file_name?String(a.file_name).trim():void 0,file_size:a.file_size?Number(a.file_size):0,file_md5:a.file_md5?String(a.file_md5).trim():void 0,file_sha256:a.file_sha256?String(a.file_sha256).trim():void 0,external_url:a.external_url?String(a.external_url).trim():void 0,use_proxy:a.use_proxy?1:0});return{message:"Package added successfully",package:d,download_url:`${i}/api/v1/app/download?app_id=${encodeURIComponent(l.app_id)}&version_code=${l.version_code}&channel=${encodeURIComponent(l.channel)}&package_id=${d.id}`}}case"ygg_delete_version_package":{let r=a.package_id?String(a.package_id).trim():"";if(!r)throw new Error("Missing required argument: package_id");return await g.deletePackage(e,t,r),{message:`Package '${r}' deleted successfully`}}default:throw new Error(`Unknown MCP tool: ${n}`)}}var K=new T;async function Et(e){let t=e.env.DB;if(!t)return{authorized:!1,message:"D1 Database binding missing"};let n=await C.getAllSettings(t),a=n[b.API_TOKEN_ENABLED]==="true",i=n[b.API_FIXED_TOKEN]||w.DEFAULT_API_TOKEN,r=e.env.ADMIN_PASSWORD||w.DEFAULT_ADMIN_PASSWORD,s=e.req.header(w.TOKEN_HEADER_NAME);if(!s){let l=e.req.header("authorization");l&&l.startsWith("Bearer ")&&(s=l.substring(7).trim())}s||(s=e.req.query(w.TOKEN_QUERY_NAME));let o=e.req.header("x-ygg-admin-password")||e.req.query("admin_password");if(s){if(s.trim()===i.trim()||s.trim()===r.trim())return{authorized:!0};let l=e.env.JWT_SECRET||w.DEFAULT_JWT_SECRET,d=await Ae(s,l);if(d&&d.role==="admin")return{authorized:!0}}return o&&o.trim()===r.trim()?{authorized:!0}:a?{authorized:!1,message:"Unauthorized: Invalid or missing API token. Please supply token via X-Ygg-Token header or ?token= query parameter."}:{authorized:!0}}async function st(e){let t;try{t=await e.req.json()}catch{return e.json({jsonrpc:"2.0",id:null,error:{code:-32700,message:"Parse error: Invalid JSON payload"}},400)}let n=t?.id!==void 0?t.id:null,a=t?.method;if(!a||typeof a!="string")return e.json({jsonrpc:"2.0",id:n,error:{code:-32600,message:"Invalid Request: Missing method name"}},400);if(a==="initialize")return e.json({jsonrpc:"2.0",id:n,result:{protocolVersion:"2024-11-05",capabilities:{tools:{listChanged:!1}},serverInfo:{name:"yggdrasil",version:"1.0.0"},instructions:"Yggdrasil App Release & File Management MCP Server. Use available tools to inspect apps, versions, stats, and trigger cleanup."}});if(a==="notifications/initialized")return e.body(null,204);if(a==="ping")return e.json({jsonrpc:"2.0",id:n,result:{}});if(a==="tools/list")return e.json({jsonrpc:"2.0",id:n,result:{tools:Q}});if(a==="tools/call"){let i=await Et(e);if(!i.authorized)return e.json({jsonrpc:"2.0",id:n,error:{code:-32e3,message:i.message||"Unauthorized"}},401);let{name:r,arguments:s}=t.params||{};if(!r)return e.json({jsonrpc:"2.0",id:n,error:{code:-32602,message:"Invalid params: tool name is required"}},400);let o=new URL(e.req.url).origin;try{let l=await ot(e.env.DB,e.env.BUCKET,r,s||{},o),d=typeof l=="string"?l:JSON.stringify(l,null,2);return e.json({jsonrpc:"2.0",id:n,result:{content:[{type:"text",text:d}]}})}catch(l){return e.json({jsonrpc:"2.0",id:n,result:{isError:!0,content:[{type:"text",text:`Tool execution failed: ${l.message||String(l)}`}]}})}}return e.json({jsonrpc:"2.0",id:n,error:{code:-32601,message:`Method '${a}' not found`}},404)}K.post("/api/mcp",st);K.post("/mcp",st);K.get("/api/mcp/tools",e=>e.json({code:0,message:"success",data:{server:"Yggdrasil MCP Server",version:"1.0.0",total_tools:Q.length,tools:Q}}));K.get("/api/mcp",e=>{let t=new URL(e.req.url).origin;return e.json({system:"Yggdrasil Model Context Protocol (MCP) Server",version:"1.0.0",protocol:"JSON-RPC 2.0",endpoints:{http_rpc:`${t}/api/mcp`,tools_list:`${t}/api/mcp/tools`},tools_count:Q.length,tools:Q.map(n=>({name:n.name,description:n.description})),usage:{description:"AI agents can invoke tools directly over HTTP JSON-RPC or via local stdio mcp-server.",desktop_config_example:{mcpServers:{yggdrasil:{command:"node",args:["dist/mcp-server.js"],env:{YGG_ENDPOINT:t,YGG_TOKEN:"your_api_token_here"}}}}}})});K.get("/mcp",e=>e.redirect("/api/mcp",301));function lt(e="Yggdrasil - \u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3"){return`<!DOCTYPE html>
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

    /* MCP Hub Styles */
    .mcp-hero-banner {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.25rem;
    }
    .mcp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .mcp-tool-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      transition: all 0.15s ease;
    }
    .mcp-tool-card:hover {
      border-color: rgba(168, 85, 247, 0.45);
      background: rgba(255, 255, 255, 0.02);
    }
    .mcp-client-tabs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .mcp-client-btn {
      padding: 0.45rem 0.9rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.825rem;
      font-weight: 600;
      transition: all 0.15s ease;
    }
    .mcp-client-btn:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.05);
    }
    .mcp-client-btn.active {
      color: #c084fc;
      border-color: rgba(168, 85, 247, 0.5);
      background: rgba(168, 85, 247, 0.12);
    }

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
        <div class="nav-tab" data-tab="mcp" onclick="switchTab('mcp')">
          <span>\u{1F916}</span> <span>MCP / AI \u534F\u8BAE</span>
          <span class="badge" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; font-size: 0.65rem; padding: 0.1rem 0.35rem; margin-left: 0.2rem; border-radius: 999px;">\u65B0</span>
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
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="switchTab('mcp')" style="border-color: rgba(168, 85, 247, 0.4); color: #c084fc;">
              \u{1F916} AI / MCP \u52A9\u624B
            </button>
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
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem;">\u{1F419} GitHub \u79C1\u6709\u4ED3\u5E93 Release \u4EE3\u7406\u9274\u6743 (\u53EF\u9009)</h3>
          <p style="color: var(--text-muted); font-size: 0.825rem; margin-bottom: 1rem;">\u82E5\u60A8\u7684\u9879\u76EE\u4EE3\u7801\u4E3A <strong>Private\uFF08\u79C1\u6709\uFF09</strong>\uFF0C\u53C8\u5E0C\u671B\u5C06 Release \u6587\u4EF6\u5BF9\u5916\u516C\u5F00\u4E0B\u8F7D\uFF0C\u53EF\u5728\u6B64\u586B\u5165 GitHub Personal Access Token (PAT)\u3002\u53CD\u5411\u4EE3\u7406\u65F6\uFF0C\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u643A\u5E26\u8BE5\u51ED\u8BC1\u901A\u8FC7 GitHub API \u5B89\u5168\u62C9\u53D6\u5BF9\u5E94\u79C1\u6709\u8D44\u4EA7\u5E76\u63D0\u4F9B\u4E0B\u8F7D\uFF0C\u800C\u4EE3\u7801\u4ED3\u5E93\u4FDD\u6301 100% \u95ED\u6E90\u4FDD\u5BC6\u3002</p>
          
          <div class="form-group">
            <label class="form-label">GitHub Personal Access Token (PAT)</label>
            <input type="password" id="cfg-github-token" class="form-control mono" placeholder="ghp_xxxxxxxxxxxx \u6216 github_pat_xxxxxxxxxxxx" />
            <div class="form-help">Token \u4EC5\u4FDD\u5B58\u5728\u60A8\u7684 Cloudflare D1 \u6570\u636E\u5E93\u4E2D\u3002\u5EFA\u8BAE\u5728 GitHub \u4E2D\u751F\u6210 Fine-grained Token\uFF0C\u6743\u9650\u4EC5\u9700\u8D4B\u4E88\u5BF9\u5E94\u79C1\u6709\u4ED3\u5E93\u7684\u300CContents: Read-only\u300D\u3002\u7559\u7A7A\u5219\u4EE3\u8868\u4EC5\u4EE3\u7406\u516C\u5F00\u94FE\u63A5\u3002</div>
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

            <div class="form-row">
              <div class="form-col form-group">
                <label class="form-label">\u64CD\u4F5C\u7CFB\u7EDF\u5E73\u53F0 (Platform)</label>
                <select id="pg-platform" class="form-control" onchange="updatePlaygroundCurl()">
                  <option value="">\u5168\u90E8 / \u81EA\u52A8\u5339\u914D</option>
                  <option value="android">Android</option>
                  <option value="windows">Windows</option>
                  <option value="macos">macOS</option>
                  <option value="linux">Linux</option>
                  <option value="ios">iOS</option>
                  <option value="universal">Universal</option>
                </select>
              </div>
              <div class="form-col form-group">
                <label class="form-label">CPU \u67B6\u6784 (Arch)</label>
                <select id="pg-arch" class="form-control" onchange="updatePlaygroundCurl()">
                  <option value="">\u5168\u90E8 / \u81EA\u52A8\u5339\u914D</option>
                  <option value="universal">Universal</option>
                  <option value="arm64-v8a">arm64-v8a</option>
                  <option value="armeabi-v7a">armeabi-v7a</option>
                  <option value="x86_64">x86_64</option>
                  <option value="x86">x86</option>
                  <option value="apple-silicon">apple-silicon</option>
                </select>
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

        <!-- MCP \u5FEB\u901F\u8DF3\u8F6C\u6A2A\u5E45 -->
        <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">\u{1F916}</span>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem; color: #c084fc;">\u9700\u8981\u4F7F\u7528 Cursor\u3001Claude Desktop \u7B49 AI \u52A9\u624B\u76F4\u63A5\u8C03\u7528\uFF1F</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Yggdrasil \u73B0\u5DF2\u5168\u9762\u652F\u6301 Model Context Protocol (MCP) \u5F00\u653E\u6807\u51C6\uFF0C\u63D0\u4F9B 14 \u9879\u539F\u751F\u7BA1\u7406 Tools</div>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="switchTab('mcp')">\u524D\u5F80 MCP \u534F\u8BAE\u4E2D\u5FC3 \u2794</button>
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
                <td class="mono">platform</td>
                <td>String</td>
                <td>\u5426</td>
                <td>\u76EE\u6807\u64CD\u4F5C\u7CFB\u7EDF\u5E73\u53F0 (android, windows, macos, linux, ios, universal)\uFF0C\u7528\u4E8E\u81EA\u52A8\u5339\u914D\u6700\u4F73\u5B89\u88C5\u5305</td>
                <td class="mono">windows / android</td>
              </tr>
              <tr>
                <td class="mono">arch</td>
                <td>String</td>
                <td>\u5426</td>
                <td>\u5BA2\u6237\u7AEF CPU \u67B6\u6784 (universal, arm64-v8a, armeabi-v7a, x86_64, x86, apple-silicon)</td>
                <td class="mono">x86_64</td>
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
    "platform": "windows",
    "arch": "x86_64",
    "changelog": "- \u4F18\u5316\u6587\u4EF6\u4E0B\u8F7D\u901F\u5EA6
- \u4FEE\u590D\u5DF2\u77E5\u5D29\u6E83Bug",
    "download_url": "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&version_code=10200&platform=windows&arch=x86_64",
    "file_name": "app-v1.2.0-windows-x86_64.zip",
    "file_size": 45829104,
    "file_md5": "e10adc3949ba59abbe56e057f20f883e",
    "packages": [
      {
        "id": "pkg_win64",
        "platform": "windows",
        "arch": "x86_64",
        "file_name": "app-windows-x64.zip",
        "file_size": 45829104,
        "download_url": "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&version_code=10200&package_id=pkg_win64"
      },
      {
        "id": "pkg_arm64",
        "platform": "android",
        "arch": "arm64-v8a",
        "file_name": "app-android-arm64.apk",
        "file_size": 38401920,
        "download_url": "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&version_code=10200&package_id=pkg_arm64"
      }
    ],
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
            \u5B89\u88C5\u5305\u4E0B\u8F7D\u63A5\u53E3\u3002\u652F\u6301 <code class="mono">platform</code>\u3001<code class="mono">arch</code> \u667A\u80FD\u8C03\u5EA6\u6216 <code class="mono">package_id</code> \u7CBE\u51C6\u5B9A\u4F4D\uFF0C\u539F\u751F\u652F\u6301 <b>HTTP Range 206 \u65AD\u70B9\u7EED\u4F20</b>\uFF0C\u517C\u5BB9 Windows\u3001Android\u3001macOS\u3001iOS\u3001Linux \u7B49\u5404\u5927\u4E3B\u6D41\u4E0B\u8F7D\u5668\u3002
          </p>
          <div class="code-box"># \u65AD\u70B9\u7EED\u4F20\u6D4B\u8BD5 (\u5206\u7247\u8BF7\u6C42 Range: bytes=0-1023)
curl -i -H "Range: bytes=0-1023" "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&platform=windows&arch=x86_64"

# \u8FD4\u56DE\u54CD\u5E94\u5934:
HTTP/1.1 206 Partial Content
Content-Type: application/zip
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

        <!-- \u63A5\u53E3 4: MCP AI \u52A9\u624B\u63A5\u5165 -->
        <div class="stat-card" style="margin-top: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc; font-weight: 700;">MCP</span>
              <span class="mono" style="font-size: 1rem; font-weight: 700;">/api/mcp</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="copyText(window.location.origin + '/api/mcp', 'MCP URL \u5DF2\u590D\u5236')">\u590D\u5236 MCP URL</button>
          </div>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.75rem;">
            \u539F\u751F\u652F\u6301 <b>Model Context Protocol (MCP)</b> \u534F\u8BAE\u3002Cursor\u3001Claude Desktop\u3001Antigravity CLI\u3001Windsurf \u7B49 AI \u52A9\u624B\u53EF\u76F4\u63A5\u8FDE\u63A5\u5E76\u8C03\u7528 14 \u9879\u7BA1\u7406\u5DE5\u5177\u3002
          </p>
          <div class="code-box"># Cursor / Claude Desktop \u914D\u7F6E\u6A21\u7248 (claude_desktop_config.json / mcp.json):
{
  "mcpServers": {
    "yggdrasil": {
      "command": "node",
      "args": ["dist/mcp-server.js"],
      "env": {
        "YGG_ENDPOINT": "https://your-worker.workers.dev",
        "YGG_TOKEN": "your_token_here"
      }
    }
  }
}</div>
        </div>
      </section>

      <!-- TAB 6: MCP (Model Context Protocol) \u534F\u8BAE\u63A5\u5165\u4E2D\u5FC3 -->
      <section id="tab-mcp" class="hidden">
        <div class="mcp-hero-banner">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
              <span style="font-size: 1.4rem;">\u{1F916}</span>
              <h2 style="font-size: 1.3rem; font-weight: 800; margin: 0; letter-spacing: -0.02em;">Model Context Protocol (MCP) \u667A\u80FD\u8C03\u7528\u4E2D\u5FC3</h2>
              <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #6ee7b7; font-weight: 700;">\u{1F7E2} \u670D\u52A1\u5DF2\u5C31\u7EEA</span>
              <span class="badge" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; font-weight: 700;">14 \u9879\u539F\u751F Tools</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0; max-width: 720px; line-height: 1.6;">
              Yggdrasil \u73B0\u5DF2\u5168\u9762\u63A5\u5165 MCP \u5F00\u653E\u534F\u8BAE\u6807\u51C6\uFF01AI \u52A9\u624B\uFF08Cursor\u3001Claude Desktop\u3001Antigravity CLI\u3001Windsurf\u3001Cline \u7B49\uFF09\u53EF\u539F\u751F\u611F\u77E5\u5E76\u76F4\u63A5\u63A7\u5236\u5E94\u7528\u53D1\u7248\u3001\u7248\u672C\u68C0\u6D4B\u3001\u5B58\u50A8\u76D1\u63A7\u4E0E\u65E7\u5305\u6E05\u7406\u3002
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="testMcpHandshake()">\u26A1 \u5B9E\u65F6\u6D4B\u8BD5 MCP \u63E1\u624B</button>
            <button class="btn btn-primary" onclick="copyCurrentMcpConfig()">\u{1F4CB} \u590D\u5236\u5BA2\u6237\u7AEF\u914D\u7F6E</button>
          </div>
        </div>

        <!-- \u670D\u52A1\u7AEF\u70B9\u6982\u89C8\u5361\u7247 -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">\u{1F310} \u6838\u5FC3\u8FDE\u63A5\u7AEF\u70B9\u4E0E\u53C2\u6570</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
            <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">\u8FDC\u7A0B HTTP JSON-RPC \u7AEF\u70B9</div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                <code class="mono" id="mcp-endpoint-val" style="color: var(--primary); font-size: 0.85rem; word-break: break-all;">/api/mcp</code>
                <button class="btn btn-secondary btn-sm" onclick="copyText(document.getElementById('mcp-endpoint-val').innerText, '\u7AEF\u70B9 URL \u5DF2\u590D\u5236')">\u590D\u5236</button>
              </div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">\u672C\u5730 STDIO CLI \u6267\u884C\u547D\u4EE4</div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                <code class="mono" style="color: #c084fc; font-size: 0.85rem;">node dist/mcp-server.js</code>
                <button class="btn btn-secondary btn-sm" onclick="copyText('node dist/mcp-server.js', '\u547D\u4EE4\u5DF2\u590D\u5236')">\u590D\u5236</button>
              </div>
            </div>
          </div>
        </div>

        <!-- \u5BA2\u6237\u7AEF\u4E00\u952E\u914D\u7F6E\u5361\u7247 -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.2rem;">\u{1F5A5}\uFE0F AI \u5BA2\u6237\u7AEF\u914D\u7F6E\u5411\u5BFC</h3>
              <p style="color: var(--text-muted); font-size: 0.825rem; margin: 0;">\u70B9\u51FB\u4E0B\u65B9\u6807\u7B7E\u5207\u6362\u4E0D\u540C AI \u5BA2\u6237\u7AEF\uFF0C\u83B7\u53D6\u81EA\u52A8\u6CE8\u5165\u5F53\u524D\u7AD9\u70B9\u57DF\u540D\u4E0E Token \u7684\u4E13\u5C5E\u914D\u7F6E</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="copyCurrentMcpConfig()">\u{1F4CB} \u590D\u5236\u5F53\u524D\u4EE3\u7801</button>
          </div>

          <div class="mcp-client-tabs">
            <button class="mcp-client-btn active" data-client="cursor" onclick="selectMcpClient('cursor')">\u{1F5A5}\uFE0F Cursor</button>
            <button class="mcp-client-btn" data-client="claude" onclick="selectMcpClient('claude')">\u{1F4AC} Claude Desktop</button>
            <button class="mcp-client-btn" data-client="agy" onclick="selectMcpClient('agy')">\u{1F680} Antigravity CLI</button>
            <button class="mcp-client-btn" data-client="windsurf" onclick="selectMcpClient('windsurf')">\u{1F3C4} Windsurf / Cline</button>
            <button class="mcp-client-btn" data-client="http" onclick="selectMcpClient('http')">\u{1F310} cURL / HTTP RPC</button>
          </div>

          <div id="mcp-config-guide" style="color: var(--text-muted); font-size: 0.825rem; margin-bottom: 0.65rem; line-height: 1.5;"></div>
          <div class="code-box" id="mcp-config-code" style="max-height: 280px; margin: 0; white-space: pre-wrap;"></div>
        </div>

        <!-- \u5728\u7EBF\u6D4B\u8BD5 MCP \u5DE5\u5177\u8C03\u7528 -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">\u{1F9EA} \u5728\u7EBF MCP \u5DE5\u5177\u8C03\u7528\u8C03\u8BD5\u5668</h3>
          <p style="color: var(--text-muted); font-size: 0.825rem; margin-bottom: 1rem;">\u76F4\u63A5\u5728\u6D4F\u89C8\u5668\u4E2D\u5B9E\u65F6\u8C03\u7528 14 \u9879 MCP Tools\uFF0C\u9A8C\u8BC1\u8FB9\u7F18\u6267\u884C\u4E0E\u54CD\u5E94\u7ED3\u679C</p>

          <div class="form-row">
            <div class="form-col form-group">
              <label class="form-label">\u9009\u62E9\u6D4B\u8BD5\u5DE5\u5177</label>
              <select id="mcp-test-tool-select" class="form-control" onchange="onMcpToolSelectChange()">
                <option value="ygg_list_apps">ygg_list_apps (\u5217\u51FA\u6240\u6709\u5E94\u7528\u4E0E\u53D1\u7248\u6982\u51B5)</option>
                <option value="ygg_get_app_details">ygg_get_app_details (\u83B7\u53D6\u6307\u5B9A\u5E94\u7528\u8BE6\u60C5\u4E0E\u7248\u672C\u5386\u53F2)</option>
                <option value="ygg_get_system_stats">ygg_get_system_stats (\u83B7\u53D6\u5168\u5C40\u7CFB\u7EDF\u7EDF\u8BA1\u4E0E\u5B58\u50A8\u5360\u7528)</option>
                <option value="ygg_check_update">ygg_check_update (\u68C0\u6D4B\u7248\u672C\u66F4\u65B0\u6A21\u62DF)</option>
                <option value="ygg_add_version_package">ygg_add_version_package (\u4E3A\u7248\u672C\u65B0\u589E\u5206\u53D1\u5B89\u88C5\u5305)</option>
                <option value="ygg_delete_version_package">ygg_delete_version_package (\u5220\u9664\u6307\u5B9A\u5206\u53D1\u5B89\u88C5\u5305)</option>
                <option value="ygg_list_files">ygg_list_files (\u5217\u51FA\u901A\u7528\u6587\u4EF6)</option>
                <option value="ygg_trigger_cleanup">ygg_trigger_cleanup (\u6267\u884C\u65E7\u7248\u672C\u5B58\u50A8\u6E05\u7406)</option>
              </select>
            </div>
            <div class="form-col form-group">
              <label class="form-label">\u8C03\u7528\u53C2\u6570 JSON (arguments)</label>
              <input type="text" id="mcp-test-tool-args" class="form-control mono" value="{}" placeholder="{}" />
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="runOnlineMcpToolTest()">\u{1F680} \u53D1\u9001\u8C03\u7528\u8BF7\u6C42</button>
            <span id="mcp-test-status" style="font-size: 0.825rem; color: var(--text-muted);"></span>
          </div>

          <div style="margin-top: 1rem;">
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.4rem;">\u8FD4\u56DE\u7ED3\u679C (JSON-RPC 2.0 Response)</div>
            <div class="code-box" id="mcp-test-result" style="max-height: 240px; color: #a7f3d0;">// \u70B9\u51FB\u4E0A\u65B9\u201C\u53D1\u9001\u8C03\u7528\u8BF7\u6C42\u201D\u6D4B\u8BD5\u5DE5\u5177\u8FD4\u56DE\u7ED3\u679C</div>
          </div>
        </div>

        <!-- 14 \u9879 MCP \u5DE5\u5177\u5168\u89C8 (\u5361\u7247 Bento \u5217\u8868) -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.2rem;">\u{1F6E0}\uFE0F \u539F\u751F\u53EF\u7528 MCP Tools \u5168\u89C8 (\u5171 14 \u9879)</h3>
              <p style="color: var(--text-muted); font-size: 0.825rem; margin: 0;">AI \u4EE3\u7406\u8FDE\u63A5\u540E\u5C06\u81EA\u52A8\u8BC6\u522B\u4EE5\u4E0B\u80FD\u529B\uFF0C\u53EF\u5728\u5BF9\u8BDD\u4E2D\u76F4\u63A5\u6307\u793A AI \u8C03\u7528</p>
            </div>
            <input type="text" id="mcp-tool-filter" class="form-control" style="width: 240px;" placeholder="\u{1F50D} \u5FEB\u901F\u8FC7\u6EE4\u5DE5\u5177\u540D\u79F0..." oninput="filterMcpToolCards(this.value)" />
          </div>

          <div class="mcp-grid" id="mcp-tools-container">
            <!-- \u52A8\u6001\u6E32\u67D3 14 \u9879\u5DE5\u5177\u5361\u7247 -->
          </div>
        </div>

        <!-- \u5B9E\u7528 AI \u5BF9\u8BDD Prompt \u573A\u666F\u6A21\u7248 -->
        <div class="stat-card">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">\u{1F4A1} \u5E38\u7528 AI \u6307\u4EE4\u6A21\u7248 (\u5F00\u7BB1\u5373\u7528)</h3>
          <p style="color: var(--text-muted); font-size: 0.825rem; margin-bottom: 1rem;">\u914D\u7F6E\u5B8C\u6210\u540E\uFF0C\u60A8\u53EF\u4EE5\u76F4\u63A5\u5728\u4E0E AI \u5BF9\u8BDD\u4E2D\u53D1\u51FA\u4EE5\u4E0B\u6307\u4EE4\uFF1A</p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 0.85rem; color: #c084fc; margin-bottom: 0.25rem;">\u{1F4E6} \u81EA\u52A8\u5316\u7248\u672C\u53D1\u5E03</div>
                <div class="mono" style="font-size: 0.825rem; color: var(--text-main);">\u201C\u5E2E\u6211\u5C06 Valhalla (com.norns.valhalla) \u53D1\u5E03\u65B0\u7248\u672C 1.0.2\uFF0C\u7248\u672C\u53F7\u4E3A 10002\uFF0C\u4E0B\u8F7D\u94FE\u63A5\u6307\u5411 GitHub Release \u8D44\u4EA7\u5E76\u5F00\u542F\u8FB9\u7F18\u53CD\u4EE3\u52A0\u901F\uFF0C\u66F4\u65B0\u65E5\u5FD7\u5199\u2018\u4FEE\u590D\u6E32\u67D3\u5361\u987F\u2019\u201D</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="copyText('\u5E2E\u6211\u5C06 Valhalla (com.norns.valhalla) \u53D1\u5E03\u65B0\u7248\u672C 1.0.2\uFF0C\u7248\u672C\u53F7\u4E3A 10002\uFF0C\u4E0B\u8F7D\u94FE\u63A5\u6307\u5411 GitHub Release \u8D44\u4EA7\u5E76\u5F00\u542F\u8FB9\u7F18\u53CD\u4EE3\u52A0\u901F\uFF0C\u66F4\u65B0\u65E5\u5FD7\u5199\u2018\u4FEE\u590D\u6E32\u67D3\u5361\u987F\u2019', 'Prompt \u5DF2\u590D\u5236')">\u590D\u5236 Prompt</button>
            </div>

            <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 0.85rem; color: #60a5fa; margin-bottom: 0.25rem;">\u{1F50D} \u72B6\u6001\u5DE1\u68C0\u4E0E\u7248\u672C\u4F53\u68C0</div>
                <div class="mono" style="font-size: 0.825rem; color: var(--text-main);">\u201C\u67E5\u8BE2 Yggdrasil \u5F53\u524D\u7BA1\u7406\u7684\u6240\u6709\u79FB\u52A8\u5E94\u7528\uFF0C\u5217\u51FA\u6BCF\u4E2A\u5E94\u7528\u6700\u65B0\u7248\u672C\u540D\u79F0\u3001\u7248\u672C\u53F7\u4E0E\u7D2F\u8BA1\u4E0B\u8F7D\u91CF\u201D</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="copyText('\u67E5\u8BE2 Yggdrasil \u5F53\u524D\u7BA1\u7406\u7684\u6240\u6709\u79FB\u52A8\u5E94\u7528\uFF0C\u5217\u51FA\u6BCF\u4E2A\u5E94\u7528\u6700\u65B0\u7248\u672C\u540D\u79F0\u3001\u7248\u672C\u53F7\u4E0E\u7D2F\u8BA1\u4E0B\u8F7D\u91CF', 'Prompt \u5DF2\u590D\u5236')">\u590D\u5236 Prompt</button>
            </div>

            <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 0.85rem; color: #34d399; margin-bottom: 0.25rem;">\u{1F9F9} \u5B58\u50A8\u5783\u573E\u56DE\u6536\u6E05\u7406</div>
                <div class="mono" style="font-size: 0.825rem; color: var(--text-main);">\u201C\u5E2E\u6211\u67E5\u770B\u5F53\u524D\u7CFB\u7EDF\u7684\u5B58\u50A8\u5360\u7528\u60C5\u51B5\uFF0C\u5E76\u89E6\u53D1\u6E05\u7406 60 \u5929\u524D\u7684\u5386\u53F2\u65E7\u7248\u672C\uFF0C\u6BCF\u4E2A\u6E20\u9053\u81F3\u5C11\u4FDD\u7559\u6700\u65B0\u7684 2 \u4E2A\u7248\u672C\u201D</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="copyText('\u5E2E\u6211\u67E5\u770B\u5F53\u524D\u7CFB\u7EDF\u7684\u5B58\u50A8\u5360\u7528\u60C5\u51B5\uFF0C\u5E76\u89E6\u53D1\u6E05\u7406 60 \u5929\u524D\u7684\u5386\u53F2\u65E7\u7248\u672C\uFF0C\u6BCF\u4E2A\u6E20\u9053\u81F3\u5C11\u4FDD\u7559\u6700\u65B0\u7684 2 \u4E2A\u7248\u672C', 'Prompt \u5DF2\u590D\u5236')">\u590D\u5236 Prompt</button>
            </div>
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
        
        <!-- \u5B89\u88C5\u5305\u6765\u6E90\u5207\u6362 -->
        <div class="form-group">
          <label class="form-label">\u5B89\u88C5\u5305\u6765\u6E90\u65B9\u5F0F *</label>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" id="pkg-mode-upload" class="btn btn-primary btn-sm" onclick="switchPackageMode('upload')" style="flex: 1;">\u{1F4E6} \u4E0A\u4F20 APK \u5230 R2 \u5B58\u50A8</button>
            <button type="button" id="pkg-mode-external" class="btn btn-secondary btn-sm" onclick="switchPackageMode('external')" style="flex: 1;">\u{1F310} \u586B\u5199\u7B2C\u4E09\u65B9\u76F4\u94FE (\u514D\u4E0A\u4F20)</button>
          </div>
        </div>

        <!-- \u6A21\u5F0F 1: R2 \u672C\u5730\u6587\u4EF6\u4E0A\u4F20 -->
        <div id="pkg-sec-upload" class="form-group">
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

        <!-- \u6A21\u5F0F 2: \u7B2C\u4E09\u65B9\u76F4\u94FE\u4E0E\u53CD\u4EE3\u8BBE\u7F6E -->
        <div id="pkg-sec-external" class="form-group hidden">
          <label class="form-label">\u7B2C\u4E09\u65B9 APK \u4E0B\u8F7D\u76F4\u94FE (URL) *</label>
          <input type="url" id="ver-form-exturl" class="form-control mono" placeholder="https://cdn.example.com/apps/app-v1.2.0.apk" oninput="checkReleaseSubmitReady()" />
          <div class="form-help" style="color: #fbbf24;">\u26A0\uFE0F \u8BF7\u586B\u5199\u5916\u90E8\u6E90\u7AD9\u771F\u5B9E\u516C\u5F00\u6587\u4EF6\u76F4\u94FE\uFF08\u5982 GitHub Release\u3001\u81EA\u5EFA CDN\u3001\u5BF9\u8C61\u5B58\u50A8\u7B49\uFF09\u3002\u5207\u52FF\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684 /api/v1/app/download \u5730\u5740\uFF01</div>

          <div class="switch-wrap" style="margin-top: 0.75rem;">
            <div class="switch-info">
              <span class="switch-title">\u5F00\u542F\u8FB9\u7F18\u53CD\u5411\u4EE3\u7406\u52A0\u901F (Reverse Proxy)</span>
              <span class="switch-desc">\u9ED8\u8BA4\u5173\u95ED\u4E3A 302 \u91CD\u5B9A\u5411\u8DF3\u8F6C\u5230\u7B2C\u4E09\u65B9\u4E0B\u8F7D\uFF1B\u5F00\u542F\u540E\u7531\u5F53\u524D Worker \u8282\u70B9\u4EE3\u7406\u6D41\u5F0F\u4F20\u8F93\uFF0C\u9690\u85CF\u6E90\u7AD9\u771F\u5B9E IP \u5E76\u652F\u6301\u65AD\u70B9\u7EED\u4F20</span>
            </div>
            <input type="checkbox" id="ver-form-useproxy" class="switch-checkbox" />
          </div>

          <div class="form-row" style="margin-top: 0.75rem;">
            <div class="form-col form-group">
              <label class="form-label">\u6587\u4EF6\u540D (\u53EF\u9009)</label>
              <input type="text" id="ver-form-extfilename" class="form-control" placeholder="\u5982 app-v1.2.0.apk" />
            </div>
            <div class="form-col form-group">
              <label class="form-label">\u6587\u4EF6\u5927\u5C0F (\u5B57\u8282\uFF0C\u53EF\u9009)</label>
              <input type="number" id="ver-form-extsize" class="form-control mono" placeholder="\u5982 45829104" />
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">\u5206\u53D1\u5E73\u53F0 (Platform)</label>
            <select id="ver-form-platform" class="form-control">
              <option value="android" selected>\u{1F916} Android (\u5B89\u5353)</option>
              <option value="windows">\u{1F4BB} Windows (\u5FAE\u8F6F\u684C\u9762)</option>
              <option value="macos">\u{1F34E} macOS (\u82F9\u679C\u684C\u9762)</option>
              <option value="linux">\u{1F427} Linux (\u684C\u9762/\u670D\u52A1\u7AEF)</option>
              <option value="ios">\u{1F4F1} iOS (\u82F9\u679C\u624B\u673A)</option>
              <option value="universal">\u{1F310} Universal (\u8DE8\u5E73\u53F0\u901A\u7528)</option>
            </select>
          </div>
          <div class="form-col form-group">
            <label class="form-label">CPU \u67B6\u6784 (Architecture)</label>
            <select id="ver-form-arch" class="form-control">
              <option value="universal" selected>\u{1F310} Universal (\u5168\u67B6\u6784\u901A\u7528)</option>
              <option value="arm64-v8a">ARM64 (arm64-v8a / aarch64)</option>
              <option value="armeabi-v7a">ARM32 (armeabi-v7a)</option>
              <option value="x86_64">x86_64 (Intel / AMD 64\u4F4D)</option>
              <option value="x86">x86 (Intel 32\u4F4D)</option>
              <option value="apple-silicon">Apple Silicon (M1/M2/M3/M4)</option>
            </select>
          </div>
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

  <!-- MODAL: \u7F16\u8F91\u5386\u53F2\u7248\u672C\u4FE1\u606F -->
  <div id="modal-edit-version" class="modal-overlay">
    <div class="modal-card" style="max-width: 650px;">
      <div class="modal-header">
        <h3 class="modal-title" id="edit-ver-modal-title">\u7F16\u8F91\u7248\u672C\u4FE1\u606F</h3>
        <button class="modal-close" onclick="closeModal('modal-edit-version')">&times;</button>
      </div>
      <form id="form-edit-version" onsubmit="handleUpdateVersion(event)">
        <input type="hidden" id="edit-ver-id" />
        <input type="hidden" id="edit-ver-appid" />

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">\u7248\u672C\u540D\u79F0 (versionName) *</label>
            <input type="text" id="edit-ver-name" class="form-control" placeholder="1.2.0" required />
          </div>
          <div class="form-col form-group">
            <label class="form-label">\u7248\u672C\u53F7 (versionCode \u6574\u6570)</label>
            <input type="number" id="edit-ver-code" class="form-control mono" readonly disabled style="opacity: 0.7; cursor: not-allowed;" />
            <div class="form-help">\u7248\u672C\u53F7\u4F5C\u4E3A\u552F\u4E00\u6807\u8BC6\u4E0D\u53EF\u4FEE\u6539</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">\u53D1\u5E03\u6E20\u9053 (channel)</label>
            <input type="text" id="edit-ver-channel" class="form-control" placeholder="default / beta" />
          </div>
          <div class="form-col form-group">
            <label class="form-label">\u6700\u4F4E\u517C\u5BB9\u7248\u672C\u53F7 (minVersionCode)</label>
            <input type="number" id="edit-ver-mincode" class="form-control mono" placeholder="\u4F4E\u4E8E\u6B64\u7248\u672C\u5C06\u5F3A\u5236\u66F4\u65B0" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">\u4E0B\u8F7D\u4FDD\u5B58\u6587\u4EF6\u540D (fileName)</label>
          <input type="text" id="edit-ver-filename" class="form-control" placeholder="app-v1.2.0.apk" />
        </div>

        <div class="form-group">
          <label class="form-label">\u7B2C\u4E09\u65B9 APK \u4E0B\u8F7D\u76F4\u94FE (URL)</label>
          <input type="url" id="edit-ver-exturl" class="form-control mono" placeholder="https://cdn.example.com/apps/app-v1.2.0.apk" />
          <div class="form-help" style="color: #fbbf24;">\u26A0\uFE0F \u586B\u5199\u5916\u90E8\u6E90\u7AD9\u771F\u5B9E\u516C\u5F00\u6587\u4EF6\u76F4\u94FE\uFF1B\u5207\u52FF\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684 /api/v1/app/download \u5730\u5740\u3002\u7559\u7A7A\u4EE3\u8868\u4F7F\u7528 R2 \u5B58\u50A8\u539F\u5B89\u88C5\u5305\u3002</div>
        </div>

        <div class="switch-wrap" style="margin-bottom: 1rem;">
          <div class="switch-info">
            <span class="switch-title">\u5F00\u542F\u8FB9\u7F18\u53CD\u5411\u4EE3\u7406\u52A0\u901F (Reverse Proxy)</span>
            <span class="switch-desc">\u9ED8\u8BA4\u5173\u95ED\u4E3A 302 \u91CD\u5B9A\u5411\u5230\u7B2C\u4E09\u65B9\u76F4\u94FE\uFF1B\u5F00\u542F\u540E\u7531 Edge \u8282\u70B9\u4EE3\u7406\u6D41\u5F0F\u4F20\u8F93\uFF0C\u9690\u85CF\u6E90\u7AD9\u5E76\u652F\u6301\u65AD\u70B9\u7EED\u4F20</span>
          </div>
          <input type="checkbox" id="edit-ver-useproxy" class="switch-checkbox" />
        </div>

        <div class="form-group">
          <label class="form-label">\u7248\u672C\u66F4\u65B0\u65E5\u5FD7 (Changelog)</label>
          <textarea id="edit-ver-log" class="form-control" style="min-height: 80px;" placeholder="- \u4F18\u5316\u4E0B\u8F7D\u6027\u80FD\u4E0E\u65AD\u70B9\u7EED\u4F20&#10;- \u4FEE\u590D\u5DF2\u77E5Bug"></textarea>
        </div>

        <div class="form-row">
          <div class="form-col switch-wrap">
            <div class="switch-info">
              <span class="switch-title">\u5F3A\u5236\u66F4\u65B0</span>
            </div>
            <input type="checkbox" id="edit-ver-force" class="switch-checkbox" />
          </div>
          <div class="form-col switch-wrap">
            <div class="switch-info">
              <span class="switch-title">\u4E0A\u67B6\u53D1\u5E03\u72B6\u6001</span>
            </div>
            <input type="checkbox" id="edit-ver-published" class="switch-checkbox" />
          </div>
        </div>

        <div class="modal-footer" style="margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-edit-version')">\u53D6\u6D88</button>
          <button type="submit" class="btn btn-primary" id="btn-edit-ver-submit">\u4FDD\u5B58\u4FEE\u6539</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: \u4E3A\u7248\u672C\u6DFB\u52A0\u5206\u53D1\u5B89\u88C5\u5305 -->
  <div id="modal-add-package" class="modal-overlay">
    <div class="modal-card" style="max-width: 650px;">
      <div class="modal-header">
        <h3 class="modal-title" id="add-pkg-modal-title">\u6DFB\u52A0\u5206\u53D1\u5B89\u88C5\u5305</h3>
        <button class="modal-close" onclick="closeModal('modal-add-package')">&times;</button>
      </div>
      <form id="form-add-package" onsubmit="handleAddPackage(event)">
        <input type="hidden" id="add-pkg-verid" />
        <input type="hidden" id="add-pkg-appid" />

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">\u76EE\u6807\u5E73\u53F0 (Platform) *</label>
            <select id="add-pkg-platform" class="form-control" required>
              <option value="android">\u{1F916} Android (\u5B89\u5353)</option>
              <option value="windows" selected>\u{1F4BB} Windows (\u5FAE\u8F6F\u684C\u9762)</option>
              <option value="macos">\u{1F34E} macOS (\u82F9\u679C\u684C\u9762)</option>
              <option value="linux">\u{1F427} Linux (\u684C\u9762/\u670D\u52A1\u7AEF)</option>
              <option value="ios">\u{1F4F1} iOS (\u82F9\u679C\u624B\u673A)</option>
              <option value="universal">\u{1F310} Universal (\u8DE8\u5E73\u53F0\u901A\u7528)</option>
            </select>
          </div>
          <div class="form-col form-group">
            <label class="form-label">CPU \u67B6\u6784 (Architecture) *</label>
            <select id="add-pkg-arch" class="form-control" required>
              <option value="universal">\u{1F310} Universal (\u5168\u67B6\u6784\u901A\u7528)</option>
              <option value="x86_64" selected>x86_64 (Intel / AMD 64\u4F4D)</option>
              <option value="x86">x86 (Intel 32\u4F4D)</option>
              <option value="arm64-v8a">ARM64 (arm64-v8a / aarch64)</option>
              <option value="armeabi-v7a">ARM32 (armeabi-v7a)</option>
              <option value="apple-silicon">Apple Silicon (M1/M2/M3/M4)</option>
            </select>
          </div>
        </div>

        <!-- \u5B89\u88C5\u5305\u6765\u6E90\u5207\u6362 -->
        <div class="form-group">
          <label class="form-label">\u5B89\u88C5\u5305\u6765\u6E90\u65B9\u5F0F *</label>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" id="add-pkg-mode-upload" class="btn btn-secondary btn-sm" onclick="switchAddPkgMode('upload')" style="flex: 1;">\u{1F4E6} \u4E0A\u4F20\u6587\u4EF6\u5230 R2 \u5B58\u50A8</button>
            <button type="button" id="add-pkg-mode-external" class="btn btn-primary btn-sm" onclick="switchAddPkgMode('external')" style="flex: 1;">\u{1F310} \u586B\u5199\u7B2C\u4E09\u65B9\u76F4\u94FE (\u514D\u4E0A\u4F20)</button>
          </div>
        </div>

        <!-- \u6A21\u5F0F 1: R2 \u672C\u5730\u6587\u4EF6\u4E0A\u4F20 -->
        <div id="add-pkg-sec-upload" class="form-group hidden">
          <label class="form-label">\u9009\u62E9\u5B89\u88C5\u5305\u6587\u4EF6 *</label>
          <div id="drop-add-pkg-zone" class="upload-zone" onclick="document.getElementById('file-add-pkg-input').click()">
            <div class="upload-icon">\u{1F4E6}</div>
            <div class="upload-text" id="drop-add-pkg-text">\u70B9\u51FB\u6216\u5C06\u5B89\u88C5\u5305\u62D6\u62FD\u81F3\u6B64\u533A\u57DF</div>
            <div class="upload-hint">\u652F\u6301 .apk, .exe, .msi, .dmg, .pkg, .deb, .zip, .tar.gz \u7B49\u6587\u4EF6\u683C\u5F0F</div>
            <input type="file" id="file-add-pkg-input" style="display: none;" onchange="onAddPkgFileSelected(this)" />
          </div>
          <div id="add-pkg-progress-wrap" class="progress-bar-wrap">
            <div id="add-pkg-progress-bar" class="progress-bar-inner"></div>
          </div>
          <div id="add-pkg-upload-status" class="form-help" style="margin-top: 6px;"></div>
        </div>

        <!-- \u6A21\u5F0F 2: \u7B2C\u4E09\u65B9\u76F4\u94FE\u4E0E\u53CD\u4EE3\u8BBE\u7F6E -->
        <div id="add-pkg-sec-external" class="form-group">
          <label class="form-label">\u7B2C\u4E09\u65B9\u5B89\u88C5\u5305\u4E0B\u8F7D\u76F4\u94FE (URL) *</label>
          <input type="url" id="add-pkg-exturl" class="form-control mono" placeholder="https://github.com/.../valhalla-windows-x64.zip" oninput="checkAddPkgSubmitReady()" />
          <div class="form-help" style="color: #fbbf24;">\u26A0\uFE0F \u8BF7\u586B\u5199\u5916\u90E8\u6E90\u7AD9\u771F\u5B9E\u516C\u5F00\u6587\u4EF6\u76F4\u94FE\uFF08\u5982 GitHub Release\u3001\u81EA\u5EFA CDN\u3001\u7F51\u76D8\u76F4\u94FE\u7B49\uFF09\u3002\u5207\u52FF\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u63A5\u53E3\uFF01</div>

          <div class="switch-wrap" style="margin-top: 0.75rem;">
            <div class="switch-info">
              <span class="switch-title">\u5F00\u542F\u8FB9\u7F18\u53CD\u5411\u4EE3\u7406\u52A0\u901F (Reverse Proxy)</span>
              <span class="switch-desc">\u5173\u95ED\u4E3A 302 \u91CD\u5B9A\u5411\uFF1B\u5F00\u542F\u540E\u7531\u5F53\u524D Worker \u8282\u70B9\u4EE3\u7406\u6D41\u5F0F\u4F20\u8F93\uFF0C\u9690\u85CF\u6E90\u7AD9\u5E76\u652F\u6301\u65AD\u70B9\u7EED\u4F20</span>
            </div>
            <input type="checkbox" id="add-pkg-useproxy" class="switch-checkbox" />
          </div>

          <div class="form-row" style="margin-top: 0.75rem;">
            <div class="form-col form-group">
              <label class="form-label">\u6587\u4EF6\u540D (\u53EF\u9009)</label>
              <input type="text" id="add-pkg-filename" class="form-control" placeholder="\u5982 valhalla-windows-x64.zip" />
            </div>
            <div class="form-col form-group">
              <label class="form-label">\u6587\u4EF6\u5927\u5C0F (\u5B57\u8282\uFF0C\u53EF\u9009)</label>
              <input type="number" id="add-pkg-filesize" class="form-control mono" placeholder="\u5982 52428800" />
            </div>
          </div>
        </div>

        <div class="modal-footer" style="margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-add-package')">\u53D6\u6D88</button>
          <button type="submit" id="btn-add-pkg-submit" class="btn btn-primary">\u786E\u8BA4\u6DFB\u52A0\u5B89\u88C5\u5305</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: \u7F16\u8F91\u5206\u53D1\u5B89\u88C5\u5305 -->
  <div id="modal-edit-package" class="modal-overlay">
    <div class="modal-card" style="max-width: 600px;">
      <div class="modal-header">
        <h3 class="modal-title" id="edit-pkg-modal-title">\u7F16\u8F91\u5206\u53D1\u5B89\u88C5\u5305</h3>
        <button class="modal-close" onclick="closeModal('modal-edit-package')">&times;</button>
      </div>
      <form id="form-edit-package" onsubmit="handleUpdatePackage(event)">
        <input type="hidden" id="edit-pkg-id" />
        <input type="hidden" id="edit-pkg-appid" />

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">\u76EE\u6807\u5E73\u53F0 (Platform)</label>
            <select id="edit-pkg-platform" class="form-control">
              <option value="android">\u{1F916} Android</option>
              <option value="windows">\u{1F4BB} Windows</option>
              <option value="macos">\u{1F34E} macOS</option>
              <option value="linux">\u{1F427} Linux</option>
              <option value="ios">\u{1F4F1} iOS</option>
              <option value="universal">\u{1F310} Universal</option>
            </select>
          </div>
          <div class="form-col form-group">
            <label class="form-label">CPU \u67B6\u6784 (Architecture)</label>
            <select id="edit-pkg-arch" class="form-control">
              <option value="universal">Universal</option>
              <option value="x86_64">x86_64</option>
              <option value="x86">x86</option>
              <option value="arm64-v8a">ARM64</option>
              <option value="armeabi-v7a">ARM32</option>
              <option value="apple-silicon">Apple Silicon</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">\u6587\u4EF6\u540D</label>
          <input type="text" id="edit-pkg-filename" class="form-control" />
        </div>

        <div class="form-group">
          <label class="form-label">\u6587\u4EF6\u5927\u5C0F (\u5B57\u8282)</label>
          <input type="number" id="edit-pkg-filesize" class="form-control mono" />
        </div>

        <div class="form-group">
          <label class="form-label">\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE (\u53EF\u9009)</label>
          <input type="url" id="edit-pkg-exturl" class="form-control mono" />
        </div>

        <div class="switch-wrap">
          <div class="switch-info">
            <span class="switch-title">\u5F00\u542F\u8FB9\u7F18\u53CD\u5411\u4EE3\u7406\u52A0\u901F</span>
            <span class="switch-desc">\u7531 Worker \u4EE3\u7406\u6D41\u5F0F\u4F20\u8F93\uFF0C\u9690\u85CF\u6E90\u7AD9\u5E76\u652F\u6301\u65AD\u70B9\u7EED\u4F20</span>
          </div>
          <input type="checkbox" id="edit-pkg-useproxy" class="switch-checkbox" />
        </div>

        <div class="modal-footer" style="margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-edit-package')">\u53D6\u6D88</button>
          <button type="submit" class="btn btn-primary" id="btn-edit-pkg-submit">\u4FDD\u5B58\u4FEE\u6539</button>
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
      ['apps', 'files', 'settings', 'playground', 'docs', 'mcp'].forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) el.classList.toggle('hidden', t !== tabId);
      });

      if (tabId === 'apps') loadApps();
      if (tabId === 'files') loadFiles();
      if (tabId === 'settings') loadSettings();
      if (tabId === 'playground') setupPlayground();
      if (tabId === 'mcp') renderMcpTab();
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
          window.__appVersions = window.__appVersions || {};
          window.__appVersions[appId] = versions;

          if (!versions.length) {
            content.innerHTML = '<div style="color: var(--text-dim); font-size: 0.85rem;">\u8BE5\u5E94\u7528\u6682\u65E0\u53D1\u5E03\u4EFB\u4F55\u7248\u672C</div>';
            return;
          }

          content.innerHTML = versions.map(v => {
            const defaultDlUrl = \`\${window.location.origin}/api/v1/app/download?app_id=\${encodeURIComponent(v.app_id)}&version_code=\${v.version_code}\`;
            const isCleaned = v.is_cleaned === 1;
            const isExternal = !!v.external_url;
            const useProxy = v.use_proxy === 1;
            const pkgs = v.packages || [];

            const pkgsHtml = pkgs.length > 0 ? \`
              <div style="margin-top: 0.85rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.35rem;">
                  <span style="font-size: 0.8rem; font-weight: 700; color: #cbd5e1;">\u{1F4E6} \u591A\u5E73\u53F0 / \u67B6\u6784\u5B89\u88C5\u5305\u5206\u53D1\u6E05\u5355 (\${pkgs.length} \u4E2A)</span>
                  <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;" onclick="openAddPackageModal('\${v.id}', '\${v.app_id}', '\${v.version_name}', \${v.version_code})">\u2795 \u9644\u52A0\u5B89\u88C5\u5305</button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  \${pkgs.map(p => {
                    const pDownloadUrl = p.download_url || \`\${window.location.origin}/api/v1/app/download?app_id=\${encodeURIComponent(v.app_id)}&version_code=\${v.version_code}&package_id=\${p.id}\`;
                    const pCleaned = p.is_cleaned === 1;
                    const pExternal = !!p.external_url;
                    let pIcon = '\u{1F310}';
                    if (p.platform === 'windows') pIcon = '\u{1F4BB}';
                    else if (p.platform === 'macos') pIcon = '\u{1F34E}';
                    else if (p.platform === 'linux') pIcon = '\u{1F427}';
                    else if (p.platform === 'ios') pIcon = '\u{1F4F1}';
                    else if (p.platform === 'android') pIcon = '\u{1F916}';

                    return \`
                      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(30, 41, 59, 0.45); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.45rem 0.65rem; border-radius: 6px; font-size: 0.8rem; flex-wrap: wrap; gap: 0.4rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                          <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc; font-weight: 700;">\${pIcon} \${p.platform} \xB7 \${p.arch}</span>
                          <span class="mono" style="color: #f1f5f9; font-size: 0.8rem;">\${p.file_name}</span>
                          <span style="color: var(--text-muted); font-size: 0.75rem;">\${p.file_size ? formatBytes(p.file_size) : ''}</span>
                          \${pCleaned ? '<span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; font-size: 0.7rem;">\u5B89\u88C5\u5305\u5DF2\u6E05\u7406</span>' : ''}
                          \${pExternal ? \`<span class="badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 0.7rem;">\u{1F310} \${p.use_proxy ? '\u53CD\u4EE3\u5916\u94FE' : '302\u5916\u94FE'}</span>\` : '<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.7rem;">R2\u5B58\u50A8</span>'}
                          <span style="color: var(--text-muted); font-size: 0.75rem;">\u4E0B\u8F7D: \${p.download_count || 0} \u6B21</span>
                        </div>
                        <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
                          \${pCleaned ? '' : \`<button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.45rem;" onclick="copyText('\${pDownloadUrl}', '\${p.platform} (\${p.arch}) \u4E0B\u8F7D\u94FE\u63A5\u5DF2\u590D\u5236')">\u590D\u5236\u76F4\u94FE</button>\`}
                          \${pCleaned ? '' : \`<a href="\${pDownloadUrl}" target="_blank" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.45rem; text-decoration: none;">\u76F4\u63A5\u4E0B\u8F7D</a>\`}
                          \${p.id && !p.id.startsWith('pkg_def_') ? \`
                            <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.45rem;" onclick="openEditPackageModal('\${p.id}', '\${v.app_id}')">\u7F16\u8F91\u5305</button>
                            <button class="btn btn-danger btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.45rem;" onclick="deletePackage('\${p.id}', '\${v.app_id}')">\u5220\u9664\u5305</button>
                          \` : ''}
                        </div>
                      </div>
                    \`;
                  }).join('')}
                </div>
              </div>
            \` : \`
              <div style="margin-top: 0.6rem;">
                <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem;" onclick="openAddPackageModal('\${v.id}', '\${v.app_id}', '\${v.version_name}', \${v.version_code})">\u2795 \u6DFB\u52A0\u4E0D\u540C\u5E73\u53F0/\u67B6\u6784\u5B89\u88C5\u5305</button>
              </div>
            \`;

            return \`
              <div class="version-item" style="\${isCleaned ? 'opacity: 0.9; border-left: 3px solid #f59e0b;' : ''}">
                <div class="ver-left" style="width: 100%;">
                  <div class="ver-header">
                    <span class="ver-title">v\${v.version_name}</span>
                    <span class="ver-code">(Code: \${v.version_code})</span>
                    <span class="badge badge-accent">\${v.channel}</span>
                    \${v.platform ? \`<span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc;">\${v.platform} \xB7 \${v.arch || 'universal'}</span>\` : ''}
                    \${v.is_force_update ? '<span class="badge badge-warning">\u5F3A\u5236\u66F4\u65B0</span>' : ''}
                    \${v.is_published ? '<span class="badge badge-success">\u5DF2\u53D1\u5E03</span>' : '<span class="badge">\u5DF2\u4E0B\u67B6</span>'}
                    \${isCleaned ? '<span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">\u{1F4E6} \u5B89\u88C5\u5305\u5DF2\u6E05\u7406</span>' : ''}
                    \${isExternal ? \`<span class="badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">\u{1F310} \${useProxy ? '\u53CD\u4EE3\u5916\u94FE' : '302\u5916\u94FE'}</span>\` : ''}
                  </div>
                  \${v.changelog ? \`<div class="ver-log">\${v.changelog}</div>\` : ''}
                  <div class="ver-meta">
                    <span>\u4E3B\u6587\u4EF6: \${v.file_name || 'app.apk'} \${v.file_size ? \`(\${formatBytes(v.file_size)})\` : ''}</span>
                    <span>\u603B\u4E0B\u8F7D: \${v.download_count} \u6B21</span>
                    <span>\u53D1\u5E03\u4E8E: \${v.created_at ? v.created_at.substring(0, 19).replace('T', ' ') : ''}</span>
                    \${v.file_md5 ? \`<span>MD5: \${v.file_md5}</span>\` : ''}
                    \${isExternal ? \`<span style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\u5916\u94FE: <a href="\${v.external_url}" target="_blank" style="color: #38bdf8;">\${v.external_url}</a></span>\` : ''}
                  </div>
                  \${isCleaned ? '<div style="font-size: 0.75rem; color: #fbbf24; margin-top: 4px;">\u26A0\uFE0F \u8BE5\u7248\u672C\u5386\u53F2 APK \u5DF2\u88AB\u5B58\u50A8\u81EA\u52A8\u6E05\u7406\u7B56\u7565\u7269\u7406\u6E05\u7406\uFF0C\u5386\u53F2\u53D1\u5E03\u8BB0\u5F55\u5B8C\u6574\u4FDD\u7559\u3002</div>' : ''}
                  \${pkgsHtml}
                </div>

                <div style="display: flex; gap: 0.5rem; align-items: flex-start; flex-wrap: wrap; margin-top: 0.5rem;">
                  <button class="btn btn-secondary btn-sm" onclick="openAddPackageModal('\${v.id}', '\${v.app_id}', '\${v.version_name}', \${v.version_code})">\u2795 \u6DFB\u52A0\u5B89\u88C5\u5305</button>
                  <button class="btn btn-secondary btn-sm" onclick="openEditVersionModal('\${v.id}', '\${v.app_id}')">\u7F16\u8F91\u7248\u672C</button>
                  \${isCleaned 
                    ? '<button class="btn btn-secondary btn-sm" disabled style="opacity: 0.5; cursor: not-allowed;" title="\u5B89\u88C5\u5305\u5DF2\u88AB\u81EA\u52A8\u7B56\u7565\u6E05\u7406">\u5B89\u88C5\u5305\u5DF2\u6E05\u7406</button>'
                    : \`<button class="btn btn-secondary btn-sm" onclick="copyText('\${defaultDlUrl}', '\u6307\u5B9A\u7248\u672C\u9ED8\u8BA4\u4E0B\u8F7D\u94FE\u63A5\u5DF2\u590D\u5236')">\u590D\u5236\u9ED8\u8BA4\u4E0B\u8F7D\u94FE\u63A5</button>\`
                  }
                  <button class="btn btn-danger btn-sm" onclick="deleteVersion('\${v.id}', '\${v.app_id}')">\u5220\u9664\u8BB0\u5F55</button>
                </div>
              </div>
            \`;
          }).join('');
        }
      } catch (err) {
        content.innerHTML = '<div style="color: var(--danger);">\u52A0\u8F7D\u5931\u8D25</div>';
      }
    }

    function openEditVersionModal(versionId, appId) {
      const versions = (window.__appVersions && window.__appVersions[appId]) || [];
      const v = versions.find(item => item.id === versionId);
      if (!v) {
        showToast('\u672A\u627E\u5230\u8BE5\u7248\u672C\u8BB0\u5F55', 'error');
        return;
      }

      document.getElementById('edit-ver-modal-title').innerText = \`\u7F16\u8F91\u7248\u672C - v\${v.version_name} (Code: \${v.version_code})\`;
      document.getElementById('edit-ver-id').value = v.id;
      document.getElementById('edit-ver-appid').value = v.app_id;
      document.getElementById('edit-ver-name').value = v.version_name || '';
      document.getElementById('edit-ver-code').value = v.version_code || 0;
      document.getElementById('edit-ver-channel').value = v.channel || 'default';
      document.getElementById('edit-ver-mincode').value = v.min_version_code || 0;
      document.getElementById('edit-ver-filename').value = v.file_name || '';
      document.getElementById('edit-ver-exturl').value = v.external_url || '';
      document.getElementById('edit-ver-useproxy').checked = v.use_proxy === 1;
      document.getElementById('edit-ver-log').value = v.changelog || '';
      document.getElementById('edit-ver-force').checked = v.is_force_update === 1;
      document.getElementById('edit-ver-published').checked = v.is_published === 1;

      openModal('modal-edit-version');
    }

    async function handleUpdateVersion(e) {
      e.preventDefault();
      const versionId = document.getElementById('edit-ver-id').value;
      const appId = document.getElementById('edit-ver-appid').value;
      const extUrl = document.getElementById('edit-ver-exturl').value.trim();

      if (extUrl && (extUrl.startsWith(window.location.origin) || extUrl.includes('/api/v1/app/download'))) {
        showToast('\u7B2C\u4E09\u65B9\u76F4\u94FE\u4E0D\u80FD\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684 /api/v1/app/download \u5730\u5740\uFF0C\u5426\u5219\u4F1A\u9020\u6210\u6B7B\u5FAA\u73AF\uFF01', 'error');
        return;
      }

      const payload = {
        version_name: document.getElementById('edit-ver-name').value.trim(),
        channel: document.getElementById('edit-ver-channel').value.trim() || 'default',
        min_version_code: parseInt(document.getElementById('edit-ver-mincode').value, 10) || 0,
        file_name: document.getElementById('edit-ver-filename').value.trim(),
        external_url: extUrl,
        use_proxy: document.getElementById('edit-ver-useproxy').checked ? 1 : 0,
        changelog: document.getElementById('edit-ver-log').value.trim(),
        is_force_update: document.getElementById('edit-ver-force').checked ? 1 : 0,
        is_published: document.getElementById('edit-ver-published').checked ? 1 : 0
      };

      const btn = document.getElementById('btn-edit-ver-submit');
      btn.disabled = true;
      btn.innerText = '\u6B63\u5728\u4FDD\u5B58...';

      try {
        const res = await apiRequest('/api/admin/versions/' + encodeURIComponent(versionId), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u7248\u672C\u4FE1\u606F\u66F4\u65B0\u6210\u529F\uFF01');
          closeModal('modal-edit-version');
          // \u91CD\u65B0\u5237\u65B0\u7248\u672C\u62BD\u5C49\u548C\u5E94\u7528\u5217\u8868
          const safeId = appId.replace(/\\./g, '_');
          const box = document.getElementById('versions-box-' + safeId);
          if (box) box.classList.add('hidden');
          await toggleVersionsDrawer(appId);
          loadApps();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u66F4\u65B0\u5931\u8D25: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerText = '\u4FDD\u5B58\u4FEE\u6539';
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

    // Package Management Functions
    let currentAddPkgMode = 'external';
    let pendingAddPkgUploadResult = null;

    function switchAddPkgMode(mode) {
      currentAddPkgMode = mode;
      const btnUpload = document.getElementById('add-pkg-mode-upload');
      const btnExt = document.getElementById('add-pkg-mode-external');
      const secUpload = document.getElementById('add-pkg-sec-upload');
      const secExt = document.getElementById('add-pkg-sec-external');

      if (btnUpload && btnExt && secUpload && secExt) {
        if (mode === 'upload') {
          btnUpload.className = 'btn btn-primary btn-sm';
          btnExt.className = 'btn btn-secondary btn-sm';
          secUpload.classList.remove('hidden');
          secExt.classList.add('hidden');
        } else {
          btnUpload.className = 'btn btn-secondary btn-sm';
          btnExt.className = 'btn btn-primary btn-sm';
          secUpload.classList.add('hidden');
          secExt.classList.remove('hidden');
        }
      }
      checkAddPkgSubmitReady();
    }

    function checkAddPkgSubmitReady() {
      const btn = document.getElementById('btn-add-pkg-submit');
      if (!btn) return;
      if (currentAddPkgMode === 'external') {
        const extUrl = document.getElementById('add-pkg-exturl')?.value.trim();
        btn.disabled = !extUrl;
      } else {
        btn.disabled = !pendingAddPkgUploadResult;
      }
    }

    async function onAddPkgFileSelected(input) {
      const file = input.files[0];
      if (!file) return;
      document.getElementById('drop-add-pkg-text').innerText = \`\u5DF2\u9009\u62E9: \${file.name} (\${formatBytes(file.size)})\`;
      if (!document.getElementById('add-pkg-filename').value) {
        document.getElementById('add-pkg-filename').value = file.name;
      }
      await uploadFileToR2(file, 'general', 'add-pkg-progress-wrap', 'add-pkg-progress-bar', 'add-pkg-upload-status', 'btn-add-pkg-submit');
      pendingAddPkgUploadResult = pendingUploadResult;
      checkAddPkgSubmitReady();
    }

    function openAddPackageModal(versionId, appId, versionName, versionCode) {
      pendingAddPkgUploadResult = null;
      document.getElementById('add-pkg-modal-title').innerText = \`\u6DFB\u52A0\u5206\u53D1\u5B89\u88C5\u5305 - v\${versionName} (Code: \${versionCode})\`;
      document.getElementById('add-pkg-verid').value = versionId;
      document.getElementById('add-pkg-appid').value = appId;
      document.getElementById('add-pkg-platform').value = 'windows';
      document.getElementById('add-pkg-arch').value = 'x86_64';
      document.getElementById('add-pkg-exturl').value = '';
      document.getElementById('add-pkg-useproxy').checked = false;
      document.getElementById('add-pkg-filename').value = '';
      document.getElementById('add-pkg-filesize').value = '';
      document.getElementById('drop-add-pkg-text').innerText = '\u70B9\u51FB\u6216\u5C06\u5B89\u88C5\u5305\u62D6\u62FD\u81F3\u6B64\u533A\u57DF';
      document.getElementById('add-pkg-progress-wrap').style.display = 'none';
      document.getElementById('add-pkg-upload-status').innerText = '';
      document.getElementById('file-add-pkg-input').value = '';
      switchAddPkgMode('external');
      openModal('modal-add-package');
    }

    async function handleAddPackage(e) {
      e.preventDefault();
      const versionId = document.getElementById('add-pkg-verid').value;
      const appId = document.getElementById('add-pkg-appid').value;
      const platform = document.getElementById('add-pkg-platform').value;
      const arch = document.getElementById('add-pkg-arch').value;
      const isExternalMode = currentAddPkgMode === 'external';
      const extUrl = document.getElementById('add-pkg-exturl')?.value.trim();
      const useProxy = document.getElementById('add-pkg-useproxy')?.checked ? 1 : 0;
      const fileName = document.getElementById('add-pkg-filename')?.value.trim();
      const fileSize = parseInt(document.getElementById('add-pkg-filesize')?.value, 10) || 0;

      if (isExternalMode) {
        if (!extUrl) {
          showToast('\u8BF7\u586B\u5199\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE', 'error');
          return;
        }
        if (extUrl.startsWith(window.location.origin) || extUrl.includes('/api/v1/app/download')) {
          showToast('\u7B2C\u4E09\u65B9\u76F4\u94FE\u4E0D\u80FD\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684 /api/v1/app/download \u5730\u5740\uFF01', 'error');
          return;
        }
      } else {
        if (!pendingAddPkgUploadResult) {
          showToast('\u8BF7\u5148\u9009\u62E9\u5E76\u4E0A\u4F20\u5B89\u88C5\u5305\u6587\u4EF6', 'error');
          return;
        }
      }

      const payload = {
        platform,
        arch,
        file_key: isExternalMode ? '' : pendingAddPkgUploadResult.file_key,
        file_name: fileName || (isExternalMode ? \`app-\${platform}-\${arch}\` : pendingAddPkgUploadResult.file_name),
        file_size: isExternalMode ? fileSize : pendingAddPkgUploadResult.file_size,
        file_md5: isExternalMode ? undefined : pendingAddPkgUploadResult.file_md5,
        external_url: isExternalMode ? extUrl : undefined,
        use_proxy: isExternalMode ? useProxy : 0
      };

      const btn = document.getElementById('btn-add-pkg-submit');
      btn.disabled = true;
      btn.innerText = '\u6B63\u5728\u6DFB\u52A0...';

      try {
        const res = await apiRequest(\`/api/admin/versions/\${encodeURIComponent(versionId)}/packages\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u5B89\u88C5\u5305\u6DFB\u52A0\u6210\u529F\uFF01');
          closeModal('modal-add-package');
          const safeId = appId.replace(/\\./g, '_');
          const box = document.getElementById('versions-box-' + safeId);
          if (box) box.classList.add('hidden');
          await toggleVersionsDrawer(appId);
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u6DFB\u52A0\u5B89\u88C5\u5305\u5931\u8D25: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerText = '\u786E\u8BA4\u6DFB\u52A0\u5B89\u88C5\u5305';
      }
    }

    function openEditPackageModal(packageId, appId) {
      const versions = (window.__appVersions && window.__appVersions[appId]) || [];
      let foundPkg = null;
      for (const v of versions) {
        if (v.packages) {
          const p = v.packages.find(item => item.id === packageId);
          if (p) {
            foundPkg = p;
            break;
          }
        }
      }
      if (!foundPkg) {
        showToast('\u672A\u627E\u5230\u8BE5\u5B89\u88C5\u5305\u8BB0\u5F55', 'error');
        return;
      }

      document.getElementById('edit-pkg-modal-title').innerText = \`\u7F16\u8F91\u5206\u53D1\u5305 - \${foundPkg.platform} \xB7 \${foundPkg.arch}\`;
      document.getElementById('edit-pkg-id').value = foundPkg.id;
      document.getElementById('edit-pkg-appid').value = appId;
      document.getElementById('edit-pkg-platform').value = foundPkg.platform || 'universal';
      document.getElementById('edit-pkg-arch').value = foundPkg.arch || 'universal';
      document.getElementById('edit-pkg-filename').value = foundPkg.file_name || '';
      document.getElementById('edit-pkg-filesize').value = foundPkg.file_size || 0;
      document.getElementById('edit-pkg-exturl').value = foundPkg.external_url || '';
      document.getElementById('edit-pkg-useproxy').checked = foundPkg.use_proxy === 1;

      openModal('modal-edit-package');
    }

    async function handleUpdatePackage(e) {
      e.preventDefault();
      const packageId = document.getElementById('edit-pkg-id').value;
      const appId = document.getElementById('edit-pkg-appid').value;
      const extUrl = document.getElementById('edit-pkg-exturl').value.trim();

      if (extUrl && (extUrl.startsWith(window.location.origin) || extUrl.includes('/api/v1/app/download'))) {
        showToast('\u7B2C\u4E09\u65B9\u76F4\u94FE\u4E0D\u80FD\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684 /api/v1/app/download \u5730\u5740\uFF01', 'error');
        return;
      }

      const payload = {
        platform: document.getElementById('edit-pkg-platform').value,
        arch: document.getElementById('edit-pkg-arch').value,
        file_name: document.getElementById('edit-pkg-filename').value.trim(),
        file_size: parseInt(document.getElementById('edit-pkg-filesize').value, 10) || 0,
        external_url: extUrl || undefined,
        use_proxy: document.getElementById('edit-pkg-useproxy').checked ? 1 : 0
      };

      const btn = document.getElementById('btn-edit-pkg-submit');
      btn.disabled = true;
      btn.innerText = '\u6B63\u5728\u4FDD\u5B58...';

      try {
        const res = await apiRequest(\`/api/admin/packages/\${encodeURIComponent(packageId)}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u5B89\u88C5\u5305\u66F4\u65B0\u6210\u529F\uFF01');
          closeModal('modal-edit-package');
          const safeId = appId.replace(/\\./g, '_');
          const box = document.getElementById('versions-box-' + safeId);
          if (box) box.classList.add('hidden');
          await toggleVersionsDrawer(appId);
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u66F4\u65B0\u5931\u8D25: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerText = '\u4FDD\u5B58\u4FEE\u6539';
      }
    }

    async function deletePackage(packageId, appId) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u8BE5\u5206\u53D1\u5B89\u88C5\u5305\u5417\uFF1F\u82E5\u6587\u4EF6\u4FDD\u5B58\u5728 R2 \u5B58\u50A8\u4E2D\u4E5F\u5C06\u4E00\u5E76\u6E05\u7406\u3002')) return;
      try {
        const res = await apiRequest('/api/admin/packages/' + packageId, { method: 'DELETE' });
        const data = await res.json();
        if (data.code === 0) {
          showToast('\u5B89\u88C5\u5305\u5DF2\u5220\u9664');
          const safeId = appId.replace(/\\./g, '_');
          const box = document.getElementById('versions-box-' + safeId);
          if (box) box.classList.add('hidden');
          await toggleVersionsDrawer(appId);
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('\u5220\u9664\u5931\u8D25: ' + err.message, 'error');
      }
    }

    // Release Version Modal & Upload
    let currentPkgMode = 'upload';
    function switchPackageMode(mode) {
      currentPkgMode = mode;
      const btnUpload = document.getElementById('pkg-mode-upload');
      const btnExt = document.getElementById('pkg-mode-external');
      const secUpload = document.getElementById('pkg-sec-upload');
      const secExt = document.getElementById('pkg-sec-external');

      if (btnUpload && btnExt && secUpload && secExt) {
        if (mode === 'upload') {
          btnUpload.className = 'btn btn-primary btn-sm';
          btnExt.className = 'btn btn-secondary btn-sm';
          secUpload.classList.remove('hidden');
          secExt.classList.add('hidden');
        } else {
          btnUpload.className = 'btn btn-secondary btn-sm';
          btnExt.className = 'btn btn-primary btn-sm';
          secUpload.classList.add('hidden');
          secExt.classList.remove('hidden');
        }
      }
      checkReleaseSubmitReady();
    }

    function checkReleaseSubmitReady() {
      const submitBtn = document.getElementById('btn-release-submit');
      if (!submitBtn) return;
      if (currentPkgMode === 'external') {
        const url = document.getElementById('ver-form-exturl')?.value.trim();
        submitBtn.disabled = !url;
        submitBtn.innerText = '\u53D1\u5E03\u65B0\u7248\u672C (\u7B2C\u4E09\u65B9\u76F4\u94FE)';
      } else {
        submitBtn.disabled = !pendingUploadResult;
        submitBtn.innerText = '\u4E0A\u4F20\u5E76\u53D1\u5E03\u65B0\u7248\u672C';
      }
    }

    function openReleaseModal(appId, appName) {
      pendingUploadResult = null;
      document.getElementById('ver-modal-title').innerText = \`\u53D1\u5E03\u65B0\u7248\u672C - \${appName}\`;
      document.getElementById('ver-form-appid').value = appId;
      if (document.getElementById('ver-form-platform')) document.getElementById('ver-form-platform').value = 'android';
      if (document.getElementById('ver-form-arch')) document.getElementById('ver-form-arch').value = 'universal';
      document.getElementById('ver-form-name').value = '';
      document.getElementById('ver-form-code').value = '';
      document.getElementById('ver-form-mincode').value = '0';
      document.getElementById('ver-form-channel').value = 'default';
      document.getElementById('ver-form-log').value = '';
      document.getElementById('ver-form-force').checked = false;
      document.getElementById('ver-form-exturl').value = '';
      document.getElementById('ver-form-useproxy').checked = false;
      document.getElementById('ver-form-extfilename').value = '';
      document.getElementById('ver-form-extsize').value = '';
      document.getElementById('drop-apk-text').innerText = '\u70B9\u51FB\u6216\u5C06 APK \u6587\u4EF6\u62D6\u62FD\u81F3\u6B64\u533A\u57DF';
      document.getElementById('apk-progress-wrap').style.display = 'none';
      document.getElementById('apk-upload-status').innerText = '';
      document.getElementById('file-apk-input').value = '';
      switchPackageMode('upload');
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
        showToast('\u6587\u4EF6\u5DF2\u4E0A\u4F20\u81F3 R2');
        checkReleaseSubmitReady();
      } catch (err) {
        if (statusTextId) document.getElementById(statusTextId).innerText = '\u274C \u4E0A\u4F20\u5931\u8D25: ' + err.message;
        showToast('\u4E0A\u4F20\u5931\u8D25: ' + err.message, 'error');
      }
    }

    async function handleReleaseVersion(e) {
      e.preventDefault();
      const isExternalMode = currentPkgMode === 'external';
      const extUrl = document.getElementById('ver-form-exturl')?.value.trim();
      const useProxy = document.getElementById('ver-form-useproxy')?.checked ? 1 : 0;
      const extFileName = document.getElementById('ver-form-extfilename')?.value.trim();
      const extSize = parseInt(document.getElementById('ver-form-extsize')?.value, 10) || 0;

      if (isExternalMode) {
        if (!extUrl) {
          showToast('\u8BF7\u586B\u5199\u7B2C\u4E09\u65B9\u4E0B\u8F7D\u76F4\u94FE', 'error');
          return;
        }
        if (extUrl.startsWith(window.location.origin) || extUrl.includes('/api/v1/app/download')) {
          showToast('\u7B2C\u4E09\u65B9\u76F4\u94FE\u4E0D\u80FD\u586B\u5199\u5F53\u524D\u7F51\u5173\u81EA\u8EAB\u7684 /api/v1/app/download \u5730\u5740\uFF0C\u5426\u5219\u4F1A\u9020\u6210\u6B7B\u5FAA\u73AF\uFF01', 'error');
          return;
        }
      } else {
        if (!pendingUploadResult) {
          showToast('\u8BF7\u5148\u9009\u62E9\u5E76\u4E0A\u4F20 APK \u6587\u4EF6', 'error');
          return;
        }
      }

      const appId = document.getElementById('ver-form-appid').value;
      const versionName = document.getElementById('ver-form-name').value.trim();
      const versionCode = parseInt(document.getElementById('ver-form-code').value, 10);
      const minVersionCode = parseInt(document.getElementById('ver-form-mincode').value, 10) || 0;
      const channel = document.getElementById('ver-form-channel').value.trim() || 'default';
      const changelog = document.getElementById('ver-form-log').value.trim();
      const isForce = document.getElementById('ver-form-force').checked ? 1 : 0;
      const platform = document.getElementById('ver-form-platform')?.value || 'android';
      const arch = document.getElementById('ver-form-arch')?.value || 'universal';

      const payload = {
        version_name: versionName,
        version_code: versionCode,
        min_version_code: minVersionCode,
        channel,
        changelog,
        is_force_update: isForce,
        is_published: 1,
        platform,
        arch,
        external_url: isExternalMode ? extUrl : undefined,
        use_proxy: isExternalMode ? useProxy : 0,
        file_key: isExternalMode ? '' : pendingUploadResult.file_key,
        file_name: isExternalMode ? (extFileName || (\`app-v\${versionName}-\${platform}-\${arch}\` + (platform === 'windows' ? '.zip' : '.apk'))) : pendingUploadResult.file_name,
        file_size: isExternalMode ? extSize : pendingUploadResult.file_size,
        file_md5: isExternalMode ? null : pendingUploadResult.file_md5
      };

      try {
        const res = await apiRequest('/api/admin/apps/' + encodeURIComponent(appId) + '/versions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
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
          document.getElementById('cfg-github-token').value = settingsData['github_token'] || '';
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
        auto_cleanup_keep_latest: document.getElementById('cfg-auto-cleanup-keep').value.trim() || '3',
        github_token: document.getElementById('cfg-github-token').value.trim()
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
      const platform = document.getElementById('pg-platform')?.value;
      const arch = document.getElementById('pg-arch')?.value;
      const token = document.getElementById('pg-token').value.trim();

      const origin = window.location.origin;
      let url = \`\${origin}/api/v1/app/latest?app_id=\${encodeURIComponent(appId)}&version_code=\${curVersion}&channel=\${encodeURIComponent(channel)}\`;
      if (platform) url += \`&platform=\${encodeURIComponent(platform)}\`;
      if (arch) url += \`&arch=\${encodeURIComponent(arch)}\`;
      
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
      const platform = document.getElementById('pg-platform')?.value;
      const arch = document.getElementById('pg-arch')?.value;
      const token = document.getElementById('pg-token').value.trim();

      let url = \`/api/v1/app/latest?app_id=\${encodeURIComponent(appId)}&version_code=\${curVersion}&channel=\${encodeURIComponent(channel)}\`;
      if (platform) url += \`&platform=\${encodeURIComponent(platform)}\`;
      if (arch) url += \`&arch=\${encodeURIComponent(arch)}\`;

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

    // MCP Hub Functionality
    let currentMcpClient = 'cursor';
    const MCP_TOOLS_LIST = [
      { name: 'ygg_list_apps', desc: '\u5217\u51FA\u6240\u6709\u6258\u7BA1\u5E94\u7528\u4E0E\u5404\u6E20\u9053\u6700\u65B0\u7248\u672C\u53CA\u4E0B\u8F7D\u7EDF\u8BA1', params: 'search? (string)' },
      { name: 'ygg_get_app_details', desc: '\u67E5\u770B\u6307\u5B9A\u5305\u540D\u5E94\u7528\u7684\u8BE6\u7EC6\u914D\u7F6E\u4E0E\u5B8C\u6574\u5386\u53F2\u53D1\u5E03\u7248\u672C', params: 'app_id* (string)' },
      { name: 'ygg_check_update', desc: '\u5BA2\u6237\u7AEF\u66F4\u65B0\u68C0\u6D4B\u6A21\u62DF\uFF0C\u652F\u6301\u5E73\u53F0\u4E0E\u67B6\u6784\u5339\u914D\uFF0C\u8FD4\u56DE\u76F4\u94FE\u4E0E\u5168\u5305\u5217\u8868', params: 'app_id* (string), current_version_code? (number), channel? (string), platform? (string), arch? (string)' },
      { name: 'ygg_create_app', desc: '\u6CE8\u518C\u521B\u5EFA\u65B0\u5E94\u7528\u9879\u76EE', params: 'app_id* (string), name* (string), icon_url? (string), description? (string)' },
      { name: 'ygg_update_app', desc: '\u66F4\u65B0\u5E94\u7528\u5C55\u793A\u540D\u79F0\u3001\u56FE\u6807\u94FE\u63A5\u6216\u7B80\u4ECB', params: 'app_id* (string), name? (string), icon_url? (string), description? (string)' },
      { name: 'ygg_delete_app', desc: '\u5F7B\u5E95\u5220\u9664\u5E94\u7528\u53CA\u540D\u4E0B\u6240\u6709\u5386\u53F2\u7248\u672C\u548C R2 \u5B58\u50A8\u6587\u4EF6', params: 'app_id* (string)' },
      { name: 'ygg_publish_version', desc: '\u53D1\u5E03\u65B0\u7248\u672C\uFF08\u652F\u6301\u591A\u5E73\u53F0/\u67B6\u6784\u3001GitHub/CDN \u76F4\u94FE\u514D\u4E0A\u4F20\u4E0E\u8FB9\u7F18\u53CD\u4EE3\u52A0\u901F\uFF09', params: 'app_id* (string), version_code* (number), version_name* (string), platform? (string), arch? (string), external_url? (string), use_proxy? (boolean)' },
      { name: 'ygg_update_version', desc: '\u4FEE\u6539\u5DF2\u6709\u7248\u672C\u5C5E\u6027\uFF08\u66F4\u65B0\u65E5\u5FD7\u3001\u5916\u94FE\u3001\u53CD\u4EE3\u3001\u4E0A\u67B6\u72B6\u6001\uFF09', params: 'version_id* (string), changelog? (string), external_url? (string), use_proxy? (boolean)' },
      { name: 'ygg_delete_version', desc: '\u7269\u7406\u5220\u9664\u6307\u5B9A\u7248\u672C\u8BB0\u5F55\u53CA\u5BF9\u5E94\u7684 R2 \u5B58\u50A8\u6587\u4EF6', params: 'version_id* (string)' },
      { name: 'ygg_add_version_package', desc: '\u4E3A\u6307\u5B9A\u7248\u672C\u65B0\u589E\u4E0D\u540C\u5E73\u53F0\u6216\u67B6\u6784\u7684\u5206\u53D1\u5B89\u88C5\u5305\uFF08\u5982 Windows x64\u3001Android ARM64\uFF09', params: 'version_id* (string), platform* (string), arch* (string), external_url? (string), use_proxy? (boolean)' },
      { name: 'ygg_delete_version_package', desc: '\u5220\u9664\u6307\u5B9A\u7248\u672C\u540D\u4E0B\u7684\u67D0\u4E2A\u5206\u53D1\u5B89\u88C5\u5305\u5E76\u7269\u7406\u5220\u9664 R2 \u5B58\u50A8', params: 'package_id* (string)' },
      { name: 'ygg_get_system_stats', desc: '\u83B7\u53D6\u5168\u5C40\u8FD0\u884C\u6982\u51B5\uFF08\u603B\u5E94\u7528\u6570\u3001\u603B\u7248\u672C\u6570\u3001\u7D2F\u8BA1\u4E0B\u8F7D\u91CF\u3001\u5B58\u50A8\u5360\u7528\uFF09', params: '\u65E0\u53C2\u6570' },
      { name: 'ygg_trigger_cleanup', desc: '\u89E6\u53D1\u65E7\u7248\u672C\u5B58\u50A8\u6E05\u7406\uFF08\u91CA\u653E R2 \u7A7A\u95F4\u5E76\u4FDD\u7559\u5386\u53F2\u8BB0\u5F55\uFF09', params: 'days? (number), keep_latest? (number), force? (boolean)' },
      { name: 'ygg_list_files', desc: '\u67E5\u8BE2\u901A\u7528\u6587\u4EF6\u7BA1\u7406\u5217\u8868\u4E2D\u7684\u6240\u6709\u8D44\u6E90', params: 'category? (string)' }
    ];

    function renderMcpTab() {
      const origin = window.location.origin;
      const endpointEl = document.getElementById('mcp-endpoint-val');
      if (endpointEl) endpointEl.innerText = origin + '/api/mcp';
      selectMcpClient(currentMcpClient);
      renderMcpToolCards(MCP_TOOLS_LIST);
    }

    function renderMcpToolCards(tools) {
      const container = document.getElementById('mcp-tools-container');
      if (!container) return;
      container.innerHTML = tools.map(t => \`
        <div class="mcp-tool-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
            <div>
              <span class="badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc; font-weight: 700; font-size: 0.7rem;">Tool</span>
              <div class="mono" style="font-weight: 700; font-size: 0.925rem; color: #a7f3d0; margin-top: 0.25rem;">\${t.name}</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="copyText('\${t.name}', '\u5DE5\u5177\u540D\u5DF2\u590D\u5236')">\u590D\u5236\u540D</button>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-main); line-height: 1.5;">\${t.desc}</div>
          <div style="font-size: 0.725rem; color: var(--text-muted); background: rgba(0,0,0,0.25); padding: 0.35rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <span style="color: #93c5fd; font-weight: 600;">\u53C2\u6570:</span> <span class="mono">\${t.params}</span>
          </div>
        </div>
      \`).join('');
    }

    function filterMcpToolCards(keyword) {
      const kw = (keyword || '').trim().toLowerCase();
      if (!kw) {
        renderMcpToolCards(MCP_TOOLS_LIST);
        return;
      }
      const filtered = MCP_TOOLS_LIST.filter(t => t.name.toLowerCase().includes(kw) || t.desc.toLowerCase().includes(kw));
      renderMcpToolCards(filtered);
    }

    function selectMcpClient(client) {
      currentMcpClient = client;
      document.querySelectorAll('.mcp-client-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-client') === client);
      });

      const origin = window.location.origin;
      const token = (settingsData && settingsData['api_fixed_token']) || 'ygg_secret_token_default_2026';
      const codeEl = document.getElementById('mcp-config-code');
      const guideEl = document.getElementById('mcp-config-guide');
      if (!codeEl || !guideEl) return;

      if (client === 'cursor') {
        guideEl.innerHTML = '\u5728 <b>Cursor</b> \u8BBE\u7F6E\u4E2D\u70B9\u51FB <b>Settings -> Features -> MCP</b>\uFF0C\u70B9\u51FB <b>+ Add New MCP Server</b>\uFF0C\u9009\u62E9 <b>command</b> \u7C7B\u578B\uFF0C\u6216\u5728 <code class="mono">~/.cursor/mcp.json</code> \u4E2D\u7C98\u8D34\uFF1A';
        codeEl.innerText = JSON.stringify({
          mcpServers: {
            yggdrasil: {
              command: "node",
              args: ["/\u7EDD\u5BF9\u8DEF\u5F84/dist/mcp-server.js"],
              env: {
                YGG_ENDPOINT: origin,
                YGG_TOKEN: token
              }
            }
          }
        }, null, 2);
      } else if (client === 'claude') {
        guideEl.innerHTML = '\u5728 <b>Claude Desktop</b> \u914D\u7F6E\u6587\u4EF6\u4E2D\u914D\u7F6E\uFF08macOS: <code class="mono">~/Library/Application Support/Claude/claude_desktop_config.json</code>\uFF0CWindows: <code class="mono">%APPDATA%\\\\Claude\\\\claude_desktop_config.json</code>\uFF09\uFF1A';
        codeEl.innerText = JSON.stringify({
          mcpServers: {
            yggdrasil: {
              command: "node",
              args: ["/\u7EDD\u5BF9\u8DEF\u5F84/dist/mcp-server.js"],
              env: {
                YGG_ENDPOINT: origin,
                YGG_TOKEN: token
              }
            }
          }
        }, null, 2);
      } else if (client === 'agy') {
        guideEl.innerHTML = '\u5728 <b>Google Antigravity CLI</b> \u914D\u7F6E\u6587\u4EF6\u4E2D\u58F0\u660E\uFF08\u652F\u6301\u5168\u5C40\u6216\u9879\u76EE\u7EA7\u522B mcpServers \u914D\u7F6E\uFF09\uFF1A';
        codeEl.innerText = JSON.stringify({
          mcpServers: {
            yggdrasil: {
              command: "node",
              args: ["dist/mcp-server.js"],
              env: {
                YGG_ENDPOINT: origin,
                YGG_TOKEN: token
              }
            }
          }
        }, null, 2);
      } else if (client === 'windsurf') {
        guideEl.innerHTML = '\u5728 <b>Windsurf</b> \u6216 <b>Cline</b> \u6269\u5C55\u7684 MCP \u914D\u7F6E\u6587\u4EF6\u4E2D\u6DFB\u52A0\uFF1A';
        codeEl.innerText = JSON.stringify({
          mcpServers: {
            yggdrasil: {
              command: "node",
              args: ["dist/mcp-server.js"],
              env: {
                YGG_ENDPOINT: origin,
                YGG_TOKEN: token
              }
            }
          }
        }, null, 2);
      } else if (client === 'http') {
        guideEl.innerHTML = '\u76F4\u63A5\u901A\u8FC7 <b>HTTP POST</b> \u8FDC\u7A0B\u8C03\u7528\u8FB9\u7F18\u7AEF\u70B9\uFF0C\u534F\u8BAE\u683C\u5F0F\u4E3A\u6807\u51C6 <b>JSON-RPC 2.0</b>\uFF1A';
        codeEl.innerText = \`curl -X POST \${origin}/api/mcp \\\\
  -H "Content-Type: application/json" \\\\
  -H "X-Ygg-Token: \${token}" \\\\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "ygg_list_apps",
      "arguments": {}
    }
  }'\`;
      }
    }

    function copyCurrentMcpConfig() {
      const code = document.getElementById('mcp-config-code').innerText;
      copyText(code, '\u5BA2\u6237\u7AEF MCP \u914D\u7F6E\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F');
    }

    async function testMcpHandshake() {
      showToast('\u6B63\u5728\u5411 /api/mcp \u53D1\u9001\u534F\u8BAE\u63E1\u624B\u6D4B\u8BD5...');
      try {
        const res = await fetch('/api/mcp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'initialize',
            params: {
              protocolVersion: '2024-11-05',
              capabilities: {},
              clientInfo: { name: 'Yggdrasil-Dashboard', version: '1.0.0' }
            }
          })
        });
        const data = await res.json();
        if (data.result && data.result.serverInfo) {
          showToast(\`\u2705 MCP \u63E1\u624B\u6210\u529F\uFF01\u670D\u52A1: \${data.result.serverInfo.name} v\${data.result.serverInfo.version}\`);
        } else {
          showToast('\u26A0\uFE0F MCP \u54CD\u5E94\u683C\u5F0F\u5F02\u5E38: ' + JSON.stringify(data), 'error');
        }
      } catch (e) {
        showToast('\u274C MCP \u63E1\u624B\u5931\u8D25: ' + e.message, 'error');
      }
    }

    function onMcpToolSelectChange() {
      const tool = document.getElementById('mcp-test-tool-select').value;
      const argsInput = document.getElementById('mcp-test-tool-args');
      if (tool === 'ygg_list_apps') argsInput.value = '{}';
      else if (tool === 'ygg_get_app_details') argsInput.value = '{"app_id": "com.norns.valhalla"}';
      else if (tool === 'ygg_get_system_stats') argsInput.value = '{}';
      else if (tool === 'ygg_check_update') argsInput.value = '{"app_id": "com.norns.valhalla", "current_version_code": 0}';
      else if (tool === 'ygg_list_files') argsInput.value = '{"category": "general"}';
      else if (tool === 'ygg_trigger_cleanup') argsInput.value = '{"days": 90, "keep_latest": 3, "force": false}';
    }

    async function runOnlineMcpToolTest() {
      const tool = document.getElementById('mcp-test-tool-select').value;
      const rawArgs = document.getElementById('mcp-test-tool-args').value.trim() || '{}';
      const statusEl = document.getElementById('mcp-test-status');
      const resultEl = document.getElementById('mcp-test-result');

      let argsObj = {};
      try {
        argsObj = JSON.parse(rawArgs);
      } catch (e) {
        showToast('\u53C2\u6570 JSON \u683C\u5F0F\u89E3\u6790\u9519\u8BEF', 'error');
        return;
      }

      statusEl.innerText = '\u23F3 \u8BF7\u6C42\u4E2D...';
      resultEl.innerText = '// \u6267\u884C\u4E2D...';

      const token = (settingsData && settingsData['api_fixed_token']) || '';
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['X-Ygg-Token'] = token;

      try {
        const res = await fetch('/api/mcp', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: {
              name: tool,
              arguments: argsObj
            }
          })
        });

        const data = await res.json();
        statusEl.innerText = \`HTTP \${res.status}\`;
        resultEl.innerText = JSON.stringify(data, null, 2);
        showToast('MCP \u5DE5\u5177\u8C03\u7528\u6210\u529F');
      } catch (err) {
        statusEl.innerText = '\u8C03\u7528\u5931\u8D25';
        resultEl.innerText = 'Error: ' + err.message;
        showToast('\u8C03\u7528\u5931\u8D25: ' + err.message, 'error');
      }
    }

    // Init
    window.addEventListener('DOMContentLoaded', () => {
      checkAuth();
    });
  <\/script>
</body>
</html>`}var A=new T;A.use("*",et);A.use("/api/*",async(e,t)=>{if(e.req.path==="/api/admin/login"||e.req.path==="/api/admin/logout"||e.req.path==="/api/admin/me"||e.req.path==="/health"||e.req.method==="GET"&&(e.req.path==="/api/mcp"||e.req.path==="/api/mcp/tools"))return await t();if(!e.env||!e.env.DB)return e.json({code:500,message:'\u3010Cloudflare \u7ED1\u5B9A\u7F3A\u5931\u3011\u672A\u68C0\u6D4B\u5230 D1 \u6570\u636E\u5E93\u7ED1\u5B9A\u3002\u8BF7\u524D\u5F80 Cloudflare \u63A7\u5236\u53F0 -> Workers -> yggdrasil -> Settings -> Bindings -> \u6DFB\u52A0 D1 \u6570\u636E\u5E93\u7ED1\u5B9A\uFF0C\u53D8\u91CF\u540D\u79F0\u5FC5\u987B\u586B\u5199\u4E3A "DB"\uFF08\u5927\u5199\uFF09\uFF0C\u5E76\u9009\u62E9\u60A8\u7684 D1 \u6570\u636E\u5E93\uFF08\u5982 ygg-db\uFF09\u3002'},500);if(e.req.path.startsWith("/api/admin/upload")&&!e.env.BUCKET)return e.json({code:500,message:'\u3010Cloudflare \u7ED1\u5B9A\u7F3A\u5931\u3011\u672A\u68C0\u6D4B\u5230 R2 \u5B58\u50A8\u6876\u7ED1\u5B9A\u3002\u8BF7\u524D\u5F80 Cloudflare \u63A7\u5236\u53F0 -> Workers -> yggdrasil -> Settings -> Bindings -> \u6DFB\u52A0 R2 \u5B58\u50A8\u6876\u7ED1\u5B9A\uFF0C\u53D8\u91CF\u540D\u79F0\u5FC5\u987B\u586B\u5199\u4E3A "BUCKET"\uFF08\u5927\u5199\uFF09\uFF0C\u5E76\u9009\u62E9\u60A8\u7684 R2 \u6876\uFF08\u5982 ygg-storage\uFF09\u3002'},500);await t()});var Re=e=>{let t=e.env?.APP_NAME?`${e.env.APP_NAME} - \u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3`:"Yggdrasil - \u5E94\u7528\u4E0E\u6587\u4EF6\u5206\u53D1\u7BA1\u7406\u4E2D\u5FC3";return e.html(lt(t))};A.get("/",Re);A.get("/admin",Re);A.get("/dashboard",Re);A.route("/",ne);A.route("/",J);A.route("/",X);A.route("/",S);A.route("/",z);A.route("/",F);A.route("/",q);A.route("/",K);A.get("/health",e=>e.json({status:"ok",system:"Yggdrasil (ygg)",timestamp:new Date().toISOString()}));A.notFound(e=>e.json({code:404,message:`Resource not found: ${e.req.method} ${e.req.url}`},404));A.onError((e,t)=>(console.error("[Yggdrasil Edge Error]:",e),t.json({code:500,message:"Internal Edge Server Error: "+(e.message||"Unknown")},500)));var hr={fetch:A.fetch,async scheduled(e,t,n){n.waitUntil((async()=>{try{console.log("[Yggdrasil Cron] Starting scheduled auto-cleanup...");let a=await B.runCleanup(t.DB,t.BUCKET);console.log(`[Yggdrasil Cron] Cleanup complete: enabled=${a.enabled}, deleted=${a.deleted}, freedBytes=${a.freedBytes}`)}catch(a){console.error("[Yggdrasil Cron] Scheduled cleanup failed:",a)}})())}};export{hr as default};
