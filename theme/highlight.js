// hljs compiled with: node tools/build.js -t browser dockerfile modusfile
/*!
  Highlight.js v11.5.0 (git: 3ea6652536)
  (c) 2006-2022 Ivan Sagalaev and other contributors
  License: BSD-3-Clause
 */
var hljs=function(){"use strict";var e={exports:{}};function t(e){
return e instanceof Map?e.clear=e.delete=e.set=()=>{
throw Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=()=>{
throw Error("set is read-only")
}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach((n=>{var s=e[n]
;"object"!=typeof s||Object.isFrozen(s)||t(s)})),e}
e.exports=t,e.exports.default=t;var n=e.exports;class s{constructor(e){
void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}
ignoreMatch(){this.isMatchIgnored=!0}}function i(e){
return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")
}function r(e,...t){const n=Object.create(null);for(const t in e)n[t]=e[t]
;return t.forEach((e=>{for(const t in e)n[t]=e[t]})),n}const o=e=>!!e.kind
;class a{constructor(e,t){
this.buffer="",this.classPrefix=t.classPrefix,e.walk(this)}addText(e){
this.buffer+=i(e)}openNode(e){if(!o(e))return;let t=e.kind
;t=e.sublanguage?"language-"+t:((e,{prefix:t})=>{if(e.includes(".")){
const n=e.split(".")
;return[`${t}${n.shift()}`,...n.map(((e,t)=>`${e}${"_".repeat(t+1)}`))].join(" ")
}return`${t}${e}`})(t,{prefix:this.classPrefix}),this.span(t)}closeNode(e){
o(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){
this.buffer+=`<span class="${e}">`}}class c{constructor(){this.rootNode={
children:[]},this.stack=[this.rootNode]}get top(){
return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){
this.top.children.push(e)}openNode(e){const t={kind:e,children:[]}
;this.add(t),this.stack.push(t)}closeNode(){
if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){
for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}
walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,t){
return"string"==typeof t?e.addText(t):t.children&&(e.openNode(t),
t.children.forEach((t=>this._walk(e,t))),e.closeNode(t)),e}static _collapse(e){
"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{
c._collapse(e)})))}}class l extends c{constructor(e){super(),this.options=e}
addKeyword(e,t){""!==e&&(this.openNode(t),this.addText(e),this.closeNode())}
addText(e){""!==e&&this.add(e)}addSublanguage(e,t){const n=e.root
;n.kind=t,n.sublanguage=!0,this.add(n)}toHTML(){
return new a(this,this.options).value()}finalize(){return!0}}function d(e){
return e?"string"==typeof e?e:e.source:null}function g(e){return p("(?=",e,")")}
function u(e){return p("(?:",e,")*")}function h(e){return p("(?:",e,")?")}
function p(...e){return e.map((e=>d(e))).join("")}function f(...e){const t=(e=>{
const t=e[e.length-1]
;return"object"==typeof t&&t.constructor===Object?(e.splice(e.length-1,1),t):{}
})(e);return"("+(t.capture?"":"?:")+e.map((e=>d(e))).join("|")+")"}
function b(e){return RegExp(e.toString()+"|").exec("").length-1}
const m=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./
;function _(e,{joinWith:t}){let n=0;return e.map((e=>{n+=1;const t=n
;let s=d(e),i="";for(;s.length>0;){const e=m.exec(s);if(!e){i+=s;break}
i+=s.substring(0,e.index),
s=s.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?i+="\\"+(Number(e[1])+t):(i+=e[0],
"("===e[0]&&n++)}return i})).map((e=>`(${e})`)).join(t)}
const E="[a-zA-Z]\\w*",w="[a-zA-Z_]\\w*",y="\\b\\d+(\\.\\d+)?",x="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",k="\\b(0b[01]+)",v={
begin:"\\\\[\\s\\S]",relevance:0},O={scope:"string",begin:"'",end:"'",
illegal:"\\n",contains:[v]},N={scope:"string",begin:'"',end:'"',illegal:"\\n",
contains:[v]},M=(e,t,n={})=>{const s=r({scope:"comment",begin:e,end:t,
contains:[]},n);s.contains.push({scope:"doctag",
begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0})
;const i=f("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/)
;return s.contains.push({begin:p(/[ ]+/,"(",i,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),s
},A=M("//","$"),S=M("/\\*","\\*/"),R=M("#","$");var j=Object.freeze({
__proto__:null,MATCH_NOTHING_RE:/\b\B/,IDENT_RE:E,UNDERSCORE_IDENT_RE:w,
NUMBER_RE:y,C_NUMBER_RE:x,BINARY_NUMBER_RE:k,
RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
SHEBANG:(e={})=>{const t=/^#![ ]*\//
;return e.binary&&(e.begin=p(t,/.*\b/,e.binary,/\b.*/)),r({scope:"meta",begin:t,
end:/$/,relevance:0,"on:begin":(e,t)=>{0!==e.index&&t.ignoreMatch()}},e)},
BACKSLASH_ESCAPE:v,APOS_STRING_MODE:O,QUOTE_STRING_MODE:N,PHRASAL_WORDS_MODE:{
begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
},COMMENT:M,C_LINE_COMMENT_MODE:A,C_BLOCK_COMMENT_MODE:S,HASH_COMMENT_MODE:R,
NUMBER_MODE:{scope:"number",begin:y,relevance:0},C_NUMBER_MODE:{scope:"number",
begin:x,relevance:0},BINARY_NUMBER_MODE:{scope:"number",begin:k,relevance:0},
REGEXP_MODE:{begin:/(?=\/[^/\n]*\/)/,contains:[{scope:"regexp",begin:/\//,
end:/\/[gimuy]*/,illegal:/\n/,contains:[v,{begin:/\[/,end:/\]/,relevance:0,
contains:[v]}]}]},TITLE_MODE:{scope:"title",begin:E,relevance:0},
UNDERSCORE_TITLE_MODE:{scope:"title",begin:w,relevance:0},METHOD_GUARD:{
begin:"\\.\\s*[a-zA-Z_]\\w*",relevance:0},END_SAME_AS_BEGIN:e=>Object.assign(e,{
"on:begin":(e,t)=>{t.data._beginMatch=e[1]},"on:end":(e,t)=>{
t.data._beginMatch!==e[1]&&t.ignoreMatch()}})});function T(e,t){
"."===e.input[e.index-1]&&t.ignoreMatch()}function I(e,t){
void 0!==e.className&&(e.scope=e.className,delete e.className)}function B(e,t){
t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",
e.__beforeBegin=T,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,
void 0===e.relevance&&(e.relevance=0))}function L(e,t){
Array.isArray(e.illegal)&&(e.illegal=f(...e.illegal))}function z(e,t){
if(e.match){
if(e.begin||e.end)throw Error("begin & end are not supported with match")
;e.begin=e.match,delete e.match}}function H(e,t){
void 0===e.relevance&&(e.relevance=1)}const D=(e,t)=>{if(!e.beforeMatch)return
;if(e.starts)throw Error("beforeMatch cannot be used with starts")
;const n=Object.assign({},e);Object.keys(e).forEach((t=>{delete e[t]
})),e.keywords=n.keywords,e.begin=p(n.beforeMatch,g(n.begin)),e.starts={
relevance:0,contains:[Object.assign(n,{endsParent:!0})]
},e.relevance=0,delete n.beforeMatch
},C=["of","and","for","in","not","or","if","then","parent","list","value"]
;function P(e,t,n="keyword"){const s=Object.create(null)
;return"string"==typeof e?i(n,e.split(" ")):Array.isArray(e)?i(n,e):Object.keys(e).forEach((n=>{
Object.assign(s,P(e[n],t,n))})),s;function i(e,n){
t&&(n=n.map((e=>e.toLowerCase()))),n.forEach((t=>{const n=t.split("|")
;s[n[0]]=[e,$(n[0],n[1])]}))}}function $(e,t){
return t?Number(t):(e=>C.includes(e.toLowerCase()))(e)?0:1}const U={},Z=e=>{
console.error(e)},K=(e,...t)=>{console.log("WARN: "+e,...t)},G=(e,t)=>{
U[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),U[`${e}/${t}`]=!0)
},W=Error();function X(e,t,{key:n}){let s=0;const i=e[n],r={},o={}
;for(let e=1;e<=t.length;e++)o[e+s]=i[e],r[e+s]=!0,s+=b(t[e-1])
;e[n]=o,e[n]._emit=r,e[n]._multi=!0}function q(e){(e=>{
e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,
delete e.scope)})(e),"string"==typeof e.beginScope&&(e.beginScope={
_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope
}),(e=>{if(Array.isArray(e.begin)){
if(e.skip||e.excludeBegin||e.returnBegin)throw Z("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),
W
;if("object"!=typeof e.beginScope||null===e.beginScope)throw Z("beginScope must be object"),
W;X(e,e.begin,{key:"beginScope"}),e.begin=_(e.begin,{joinWith:""})}})(e),(e=>{
if(Array.isArray(e.end)){
if(e.skip||e.excludeEnd||e.returnEnd)throw Z("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
W
;if("object"!=typeof e.endScope||null===e.endScope)throw Z("endScope must be object"),
W;X(e,e.end,{key:"endScope"}),e.end=_(e.end,{joinWith:""})}})(e)}function F(e){
function t(t,n){
return RegExp(d(t),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(n?"g":""))
}class n{constructor(){
this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}
addRule(e,t){
t.position=this.position++,this.matchIndexes[this.matchAt]=t,this.regexes.push([t,e]),
this.matchAt+=b(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null)
;const e=this.regexes.map((e=>e[1]));this.matcherRe=t(_(e,{joinWith:"|"
}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex
;const t=this.matcherRe.exec(e);if(!t)return null
;const n=t.findIndex(((e,t)=>t>0&&void 0!==e)),s=this.matchIndexes[n]
;return t.splice(0,n),Object.assign(t,s)}}class s{constructor(){
this.rules=[],this.multiRegexes=[],
this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){
if(this.multiRegexes[e])return this.multiRegexes[e];const t=new n
;return this.rules.slice(e).forEach((([e,n])=>t.addRule(e,n))),
t.compile(),this.multiRegexes[e]=t,t}resumingScanAtSamePosition(){
return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,t){
this.rules.push([e,t]),"begin"===t.type&&this.count++}exec(e){
const t=this.getMatcher(this.regexIndex);t.lastIndex=this.lastIndex
;let n=t.exec(e)
;if(this.resumingScanAtSamePosition())if(n&&n.index===this.lastIndex);else{
const t=this.getMatcher(0);t.lastIndex=this.lastIndex+1,n=t.exec(e)}
return n&&(this.regexIndex+=n.position+1,
this.regexIndex===this.count&&this.considerAll()),n}}
if(e.compilerExtensions||(e.compilerExtensions=[]),
e.contains&&e.contains.includes("self"))throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.")
;return e.classNameAliases=r(e.classNameAliases||{}),function n(i,o){const a=i
;if(i.isCompiled)return a
;[I,z,q,D].forEach((e=>e(i,o))),e.compilerExtensions.forEach((e=>e(i,o))),
i.__beforeBegin=null,[B,L,H].forEach((e=>e(i,o))),i.isCompiled=!0;let c=null
;return"object"==typeof i.keywords&&i.keywords.$pattern&&(i.keywords=Object.assign({},i.keywords),
c=i.keywords.$pattern,
delete i.keywords.$pattern),c=c||/\w+/,i.keywords&&(i.keywords=P(i.keywords,e.case_insensitive)),
a.keywordPatternRe=t(c,!0),
o&&(i.begin||(i.begin=/\B|\b/),a.beginRe=t(a.begin),i.end||i.endsWithParent||(i.end=/\B|\b/),
i.end&&(a.endRe=t(a.end)),
a.terminatorEnd=d(a.end)||"",i.endsWithParent&&o.terminatorEnd&&(a.terminatorEnd+=(i.end?"|":"")+o.terminatorEnd)),
i.illegal&&(a.illegalRe=t(i.illegal)),
i.contains||(i.contains=[]),i.contains=[].concat(...i.contains.map((e=>(e=>(e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((t=>r(e,{
variants:null},t)))),e.cachedVariants?e.cachedVariants:V(e)?r(e,{
starts:e.starts?r(e.starts):null
}):Object.isFrozen(e)?r(e):e))("self"===e?i:e)))),i.contains.forEach((e=>{n(e,a)
})),i.starts&&n(i.starts,o),a.matcher=(e=>{const t=new s
;return e.contains.forEach((e=>t.addRule(e.begin,{rule:e,type:"begin"
}))),e.terminatorEnd&&t.addRule(e.terminatorEnd,{type:"end"
}),e.illegal&&t.addRule(e.illegal,{type:"illegal"}),t})(a),a}(e)}function V(e){
return!!e&&(e.endsWithParent||V(e.starts))}class Q extends Error{
constructor(e,t){super(e),this.name="HTMLInjectionError",this.html=t}}
const J=i,Y=r,ee=Symbol("nomatch");var te=(e=>{
const t=Object.create(null),i=Object.create(null),r=[];let o=!0
;const a="Could not find the language '{}', did you forget to load/include a language module?",c={
disableAutodetect:!0,name:"Plain text",contains:[]};let d={
ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,
languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",
cssSelector:"pre code",languages:null,__emitter:l};function b(e){
return d.noHighlightRe.test(e)}function m(e,t,n){let s="",i=""
;"object"==typeof t?(s=e,
n=t.ignoreIllegals,i=t.language):(G("10.7.0","highlight(lang, code, ...args) has been deprecated."),
G("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),
i=e,s=t),void 0===n&&(n=!0);const r={code:s,language:i};N("before:highlight",r)
;const o=r.result?r.result:_(r.language,r.code,n)
;return o.code=r.code,N("after:highlight",o),o}function _(e,n,i,r){
const c=Object.create(null);function l(){if(!O.keywords)return void M.addText(A)
;let e=0;O.keywordPatternRe.lastIndex=0;let t=O.keywordPatternRe.exec(A),n=""
;for(;t;){n+=A.substring(e,t.index)
;const i=y.case_insensitive?t[0].toLowerCase():t[0],r=(s=i,O.keywords[s]);if(r){
const[e,s]=r
;if(M.addText(n),n="",c[i]=(c[i]||0)+1,c[i]<=7&&(S+=s),e.startsWith("_"))n+=t[0];else{
const n=y.classNameAliases[e]||e;M.addKeyword(t[0],n)}}else n+=t[0]
;e=O.keywordPatternRe.lastIndex,t=O.keywordPatternRe.exec(A)}var s
;n+=A.substr(e),M.addText(n)}function g(){null!=O.subLanguage?(()=>{
if(""===A)return;let e=null;if("string"==typeof O.subLanguage){
if(!t[O.subLanguage])return void M.addText(A)
;e=_(O.subLanguage,A,!0,N[O.subLanguage]),N[O.subLanguage]=e._top
}else e=E(A,O.subLanguage.length?O.subLanguage:null)
;O.relevance>0&&(S+=e.relevance),M.addSublanguage(e._emitter,e.language)
})():l(),A=""}function u(e,t){let n=1;const s=t.length-1;for(;n<=s;){
if(!e._emit[n]){n++;continue}const s=y.classNameAliases[e[n]]||e[n],i=t[n]
;s?M.addKeyword(i,s):(A=i,l(),A=""),n++}}function h(e,t){
return e.scope&&"string"==typeof e.scope&&M.openNode(y.classNameAliases[e.scope]||e.scope),
e.beginScope&&(e.beginScope._wrap?(M.addKeyword(A,y.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),
A=""):e.beginScope._multi&&(u(e.beginScope,t),A="")),O=Object.create(e,{parent:{
value:O}}),O}function p(e,t,n){let i=((e,t)=>{const n=e&&e.exec(t)
;return n&&0===n.index})(e.endRe,n);if(i){if(e["on:end"]){const n=new s(e)
;e["on:end"](t,n),n.isMatchIgnored&&(i=!1)}if(i){
for(;e.endsParent&&e.parent;)e=e.parent;return e}}
if(e.endsWithParent)return p(e.parent,t,n)}function f(e){
return 0===O.matcher.regexIndex?(A+=e[0],1):(T=!0,0)}function b(e){
const t=e[0],s=n.substr(e.index),i=p(O,e,s);if(!i)return ee;const r=O
;O.endScope&&O.endScope._wrap?(g(),
M.addKeyword(t,O.endScope._wrap)):O.endScope&&O.endScope._multi?(g(),
u(O.endScope,e)):r.skip?A+=t:(r.returnEnd||r.excludeEnd||(A+=t),
g(),r.excludeEnd&&(A=t));do{
O.scope&&M.closeNode(),O.skip||O.subLanguage||(S+=O.relevance),O=O.parent
}while(O!==i.parent);return i.starts&&h(i.starts,e),r.returnEnd?0:t.length}
let m={};function w(t,r){const a=r&&r[0];if(A+=t,null==a)return g(),0
;if("begin"===m.type&&"end"===r.type&&m.index===r.index&&""===a){
if(A+=n.slice(r.index,r.index+1),!o){const t=Error(`0 width match regex (${e})`)
;throw t.languageName=e,t.badRule=m.rule,t}return 1}
if(m=r,"begin"===r.type)return(e=>{
const t=e[0],n=e.rule,i=new s(n),r=[n.__beforeBegin,n["on:begin"]]
;for(const n of r)if(n&&(n(e,i),i.isMatchIgnored))return f(t)
;return n.skip?A+=t:(n.excludeBegin&&(A+=t),
g(),n.returnBegin||n.excludeBegin||(A=t)),h(n,e),n.returnBegin?0:t.length})(r)
;if("illegal"===r.type&&!i){
const e=Error('Illegal lexeme "'+a+'" for mode "'+(O.scope||"<unnamed>")+'"')
;throw e.mode=O,e}if("end"===r.type){const e=b(r);if(e!==ee)return e}
if("illegal"===r.type&&""===a)return 1
;if(j>1e5&&j>3*r.index)throw Error("potential infinite loop, way more iterations than matches")
;return A+=a,a.length}const y=k(e)
;if(!y)throw Z(a.replace("{}",e)),Error('Unknown language: "'+e+'"')
;const x=F(y);let v="",O=r||x;const N={},M=new d.__emitter(d);(()=>{const e=[]
;for(let t=O;t!==y;t=t.parent)t.scope&&e.unshift(t.scope)
;e.forEach((e=>M.openNode(e)))})();let A="",S=0,R=0,j=0,T=!1;try{
for(O.matcher.considerAll();;){
j++,T?T=!1:O.matcher.considerAll(),O.matcher.lastIndex=R
;const e=O.matcher.exec(n);if(!e)break;const t=w(n.substring(R,e.index),e)
;R=e.index+t}return w(n.substr(R)),M.closeAllNodes(),M.finalize(),v=M.toHTML(),{
language:e,value:v,relevance:S,illegal:!1,_emitter:M,_top:O}}catch(t){
if(t.message&&t.message.includes("Illegal"))return{language:e,value:J(n),
illegal:!0,relevance:0,_illegalBy:{message:t.message,index:R,
context:n.slice(R-100,R+100),mode:t.mode,resultSoFar:v},_emitter:M};if(o)return{
language:e,value:J(n),illegal:!1,relevance:0,errorRaised:t,_emitter:M,_top:O}
;throw t}}function E(e,n){n=n||d.languages||Object.keys(t);const s=(e=>{
const t={value:J(e),illegal:!1,relevance:0,_top:c,_emitter:new d.__emitter(d)}
;return t._emitter.addText(e),t})(e),i=n.filter(k).filter(O).map((t=>_(t,e,!1)))
;i.unshift(s);const r=i.sort(((e,t)=>{
if(e.relevance!==t.relevance)return t.relevance-e.relevance
;if(e.language&&t.language){if(k(e.language).supersetOf===t.language)return 1
;if(k(t.language).supersetOf===e.language)return-1}return 0})),[o,a]=r,l=o
;return l.secondBest=a,l}function w(e){let t=null;const n=(e=>{
let t=e.className+" ";t+=e.parentNode?e.parentNode.className:""
;const n=d.languageDetectRe.exec(t);if(n){const t=k(n[1])
;return t||(K(a.replace("{}",n[1])),
K("Falling back to no-highlight mode for this block.",e)),t?n[1]:"no-highlight"}
return t.split(/\s+/).find((e=>b(e)||k(e)))})(e);if(b(n))return
;if(N("before:highlightElement",{el:e,language:n
}),e.children.length>0&&(d.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),
console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),
console.warn("The element with unescaped HTML:"),
console.warn(e)),d.throwUnescapedHTML))throw new Q("One of your code blocks includes unescaped HTML.",e.innerHTML)
;t=e;const s=t.textContent,r=n?m(s,{language:n,ignoreIllegals:!0}):E(s)
;e.innerHTML=r.value,((e,t,n)=>{const s=t&&i[t]||n
;e.classList.add("hljs"),e.classList.add("language-"+s)
})(e,n,r.language),e.result={language:r.language,re:r.relevance,
relevance:r.relevance},r.secondBest&&(e.secondBest={
language:r.secondBest.language,relevance:r.secondBest.relevance
}),N("after:highlightElement",{el:e,result:r,text:s})}let y=!1;function x(){
"loading"!==document.readyState?document.querySelectorAll(d.cssSelector).forEach(w):y=!0
}function k(e){return e=(e||"").toLowerCase(),t[e]||t[i[e]]}
function v(e,{languageName:t}){"string"==typeof e&&(e=[e]),e.forEach((e=>{
i[e.toLowerCase()]=t}))}function O(e){const t=k(e)
;return t&&!t.disableAutodetect}function N(e,t){const n=e;r.forEach((e=>{
e[n]&&e[n](t)}))}
"undefined"!=typeof window&&window.addEventListener&&window.addEventListener("DOMContentLoaded",(()=>{
y&&x()}),!1),Object.assign(e,{highlight:m,highlightAuto:E,highlightAll:x,
highlightElement:w,
highlightBlock:e=>(G("10.7.0","highlightBlock will be removed entirely in v12.0"),
G("10.7.0","Please use highlightElement now."),w(e)),configure:e=>{d=Y(d,e)},
initHighlighting:()=>{
x(),G("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},
initHighlightingOnLoad:()=>{
x(),G("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")
},registerLanguage:(n,s)=>{let i=null;try{i=s(e)}catch(e){
if(Z("Language definition for '{}' could not be registered.".replace("{}",n)),
!o)throw e;Z(e),i=c}
i.name||(i.name=n),t[n]=i,i.rawDefinition=s.bind(null,e),i.aliases&&v(i.aliases,{
languageName:n})},unregisterLanguage:e=>{delete t[e]
;for(const t of Object.keys(i))i[t]===e&&delete i[t]},
listLanguages:()=>Object.keys(t),getLanguage:k,registerAliases:v,
autoDetection:O,inherit:Y,addPlugin:e=>{(e=>{
e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=t=>{
e["before:highlightBlock"](Object.assign({block:t.el},t))
}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=t=>{
e["after:highlightBlock"](Object.assign({block:t.el},t))})})(e),r.push(e)}
}),e.debugMode=()=>{o=!1},e.safeMode=()=>{o=!0
},e.versionString="11.5.0",e.regex={concat:p,lookahead:g,either:f,optional:h,
anyNumberOfTimes:u};for(const e in j)"object"==typeof j[e]&&n(j[e])
;return Object.assign(e,j),e})({}),ne=Object.freeze({__proto__:null,
grmr_bash:e=>{const t=e.regex,n={},s={begin:/\$\{/,end:/\}/,contains:["self",{
begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{
begin:t.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},s]});const i={
className:"subst",begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]},r={
begin:/<<-?\s*(?=\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,
end:/(\w+)/,className:"string"})]}},o={className:"string",begin:/"/,end:/"/,
contains:[e.BACKSLASH_ESCAPE,n,i]};i.contains.push(o);const a={begin:/\$\(\(/,
end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},e.NUMBER_MODE,n]
},c=e.SHEBANG({binary:"(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",relevance:10
}),l={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,
contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0};return{
name:"Bash",aliases:["sh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,
keyword:["if","then","else","elif","fi","for","while","in","do","done","case","esac","function"],
literal:["true","false"],
built_in:["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset","alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","type","typeset","ulimit","unalias","set","shopt","autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp","chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"]
},contains:[c,e.SHEBANG(),l,a,e.HASH_COMMENT_MODE,r,{match:/(\/[a-z._-]+)+/},o,{
className:"",begin:/\\"/},{className:"string",begin:/'/,end:/'/},n]}},
grmr_dockerfile:e=>({name:"Dockerfile",aliases:["docker"],case_insensitive:!0,
keywords:["from","maintainer","expose","env","arg","user","onbuild","stopsignal"],
contains:[e.HASH_COMMENT_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.NUMBER_MODE,{
beginKeywords:"run cmd entrypoint volume add copy workdir label healthcheck shell",
starts:{end:/[^\\]$/,subLanguage:"bash"}}],illegal:"</"}),grmr_modusfile:e=>{
const t={
built_in:["from","run","merge","copy","string_concat","string_eq","in_workdir","set_workdir","set_entrypoint","set_cmd","in_env","set_env","set_label","append_path","number_eq","number_gt","number_lt","number_geq","number_leq"]
},n={match:/[a-zA-Z0-9][a-zA-Z0-9_]*/,scope:"variable",relevance:0},s=[{
scope:"string",begin:/f"/,end:/"/,relevance:0,contains:[e.BACKSLASH_ESCAPE,{
scope:"meta",begin:/\$\{/,end:/\}/,contains:[n]}]},n,e.QUOTE_STRING_MODE],i={
begin:/[a-zA-Z0-9][a-zA-Z0-9_]*\s*\(/,end:/\)/,keywords:t,relevance:0,
scope:"title.function.invoke",contains:[...s,e.HASH_COMMENT_MODE]},r={
match:/[a-zA-Z0-9][a-zA-Z0-9_]*/,keywords:t,relevance:0,scope:"title.function"}
;return{name:"Modusfile",aliases:["modus"],case_insensitive:!1,
contains:[e.HASH_COMMENT_MODE,i,{match:/[a-zA-Z0-9][a-zA-Z0-9_]*\s*(?==)/,
scope:"variable",relevance:0},{match:/(?<==)\s*[a-zA-Z0-9][a-zA-Z0-9_]*/,
scope:"variable",relevance:0},r,...s],illegal:""}}});const se=te
;for(const e of Object.keys(ne)){const t=e.replace("grmr_","").replace("_","-")
;se.registerLanguage(t,ne[e])}return se}()
;"object"==typeof exports&&"undefined"!=typeof module&&(module.exports=hljs);
