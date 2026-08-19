(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}})();const bo="185",zc=0,ul=1,Oc=2,Ts=1,Bc=2,Ms=3,nn=0,Xe=1,Qe=2,Ai=0,en=1,ki=2,fl=3,pl=4,kc=5,dn=100,Gc=101,Vc=102,Hc=103,Wc=104,Xc=200,qc=201,Yc=202,$c=203,Pr=204,Lr=205,Kc=206,Zc=207,Jc=208,Qc=209,jc=210,td=211,ed=212,id=213,nd=214,Dr=0,Ir=1,Ur=2,Kn=3,Fr=4,Nr=5,zr=6,Or=7,qh=0,sd=1,ad=2,Ri=0,To=1,Eo=2,Ao=3,Ca=4,Ro=5,Co=6,Po=7,Yh=300,gn=301,Zn=302,Oa=303,Ba=304,Pa=306,_i=1e3,zi=1001,Br=1002,ke=1003,rd=1004,Us=1005,Re=1006,ka=1007,gi=1008,si=1009,$h=1010,Kh=1011,Rs=1012,Lo=1013,Pi=1014,vi=1015,je=1016,Do=1017,Io=1018,Cs=1020,Zh=35902,Jh=35899,Qh=1021,jh=1022,Ke=1023,Gi=1026,fn=1027,Uo=1028,Fo=1029,vn=1030,No=1031,zo=1033,fa=33776,pa=33777,ma=33778,ga=33779,kr=35840,Gr=35841,Vr=35842,Hr=35843,Wr=36196,Xr=37492,qr=37496,Yr=37488,$r=37489,xa=37490,Kr=37491,Zr=37808,Jr=37809,Qr=37810,jr=37811,to=37812,eo=37813,io=37814,no=37815,so=37816,ao=37817,ro=37818,oo=37819,lo=37820,ho=37821,co=36492,uo=36494,fo=36495,po=36283,mo=36284,ya=36285,go=36286,od=3200,vo=0,ld=1,ji="",Ne="srgb",Ma="srgb-linear",wa="linear",ie="srgb",Tn=7680,ml=519,hd=512,cd=513,dd=514,Oo=515,ud=516,fd=517,Bo=518,pd=519,_o=35044,md=35048,gl="300 es",Ti=2e3,Ps=2001;function gd(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Sa(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function vd(){const s=Sa("canvas");return s.style.display="block",s}const vl={};function ba(...s){const t="THREE."+s.shift();console.log(t,...s)}function tc(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Nt(...s){s=tc(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Qt(...s){s=tc(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function qn(...s){const t=s.join(" ");t in vl||(vl[t]=!0,Nt(...s))}function _d(s,t,e){return new Promise(function(i,n){function a(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}const xd={[Dr]:Ir,[Ur]:zr,[Fr]:Or,[Kn]:Nr,[Ir]:Dr,[zr]:Ur,[Or]:Fr,[Nr]:Kn};class xn{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const n=i[t];if(n!==void 0){const a=n.indexOf(e);a!==-1&&n.splice(a,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const n=i.slice(0);for(let a=0,r=n.length;a<r;a++)n[a].call(this,t);t.target=null}}}const Ve=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let _l=1234567;const Es=Math.PI/180,Jn=180/Math.PI;function Oi(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ve[s&255]+Ve[s>>8&255]+Ve[s>>16&255]+Ve[s>>24&255]+"-"+Ve[t&255]+Ve[t>>8&255]+"-"+Ve[t>>16&15|64]+Ve[t>>24&255]+"-"+Ve[e&63|128]+Ve[e>>8&255]+"-"+Ve[e>>16&255]+Ve[e>>24&255]+Ve[i&255]+Ve[i>>8&255]+Ve[i>>16&255]+Ve[i>>24&255]).toLowerCase()}function Kt(s,t,e){return Math.max(t,Math.min(e,s))}function ko(s,t){return(s%t+t)%t}function yd(s,t,e,i,n){return i+(s-t)*(n-i)/(e-t)}function Md(s,t,e){return s!==t?(e-s)/(t-s):0}function As(s,t,e){return(1-e)*s+e*t}function wd(s,t,e,i){return As(s,t,1-Math.exp(-e*i))}function Sd(s,t=1){return t-Math.abs(ko(s,t*2)-t)}function bd(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Td(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Ed(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Ad(s,t){return s+Math.random()*(t-s)}function Rd(s){return s*(.5-Math.random())}function Cd(s){s!==void 0&&(_l=s);let t=_l+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Pd(s){return s*Es}function Ld(s){return s*Jn}function Dd(s){return(s&s-1)===0&&s!==0}function Id(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Ud(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Fd(s,t,e,i,n){const a=Math.cos,r=Math.sin,o=a(e/2),l=r(e/2),h=a((t+i)/2),c=r((t+i)/2),u=a((t-i)/2),d=r((t-i)/2),f=a((i-t)/2),g=r((i-t)/2);switch(n){case"XYX":s.set(o*c,l*u,l*d,o*h);break;case"YZY":s.set(l*d,o*c,l*u,o*h);break;case"ZXZ":s.set(l*u,l*d,o*c,o*h);break;case"XZX":s.set(o*c,l*g,l*f,o*h);break;case"YXY":s.set(l*f,o*c,l*g,o*h);break;case"ZYZ":s.set(l*g,l*f,o*c,o*h);break;default:Nt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function mi(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function se(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const ye={DEG2RAD:Es,RAD2DEG:Jn,generateUUID:Oi,clamp:Kt,euclideanModulo:ko,mapLinear:yd,inverseLerp:Md,lerp:As,damp:wd,pingpong:Sd,smoothstep:bd,smootherstep:Td,randInt:Ed,randFloat:Ad,randFloatSpread:Rd,seededRandom:Cd,degToRad:Pd,radToDeg:Ld,isPowerOfTwo:Dd,ceilPowerOfTwo:Id,floorPowerOfTwo:Ud,setQuaternionFromProperEuler:Fd,normalize:se,denormalize:mi},Qo=class Qo{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Kt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Kt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),n=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*i-r*n+t.x,this.y=a*n+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Qo.prototype.isVector2=!0;let gt=Qo;class xe{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,a,r,o){let l=i[n+0],h=i[n+1],c=i[n+2],u=i[n+3],d=a[r+0],f=a[r+1],g=a[r+2],v=a[r+3];if(u!==v||l!==d||h!==f||c!==g){let p=l*d+h*f+c*g+u*v;p<0&&(d=-d,f=-f,g=-g,v=-v,p=-p);let m=1-o;if(p<.9995){const b=Math.acos(p),C=Math.sin(b);m=Math.sin(m*b)/C,o=Math.sin(o*b)/C,l=l*m+d*o,h=h*m+f*o,c=c*m+g*o,u=u*m+v*o}else{l=l*m+d*o,h=h*m+f*o,c=c*m+g*o,u=u*m+v*o;const b=1/Math.sqrt(l*l+h*h+c*c+u*u);l*=b,h*=b,c*=b,u*=b}}t[e]=l,t[e+1]=h,t[e+2]=c,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,n,a,r){const o=i[n],l=i[n+1],h=i[n+2],c=i[n+3],u=a[r],d=a[r+1],f=a[r+2],g=a[r+3];return t[e]=o*g+c*u+l*f-h*d,t[e+1]=l*g+c*d+h*u-o*f,t[e+2]=h*g+c*f+o*d-l*u,t[e+3]=c*g-o*u-l*d-h*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,n=t._y,a=t._z,r=t._order,o=Math.cos,l=Math.sin,h=o(i/2),c=o(n/2),u=o(a/2),d=l(i/2),f=l(n/2),g=l(a/2);switch(r){case"XYZ":this._x=d*c*u+h*f*g,this._y=h*f*u-d*c*g,this._z=h*c*g+d*f*u,this._w=h*c*u-d*f*g;break;case"YXZ":this._x=d*c*u+h*f*g,this._y=h*f*u-d*c*g,this._z=h*c*g-d*f*u,this._w=h*c*u+d*f*g;break;case"ZXY":this._x=d*c*u-h*f*g,this._y=h*f*u+d*c*g,this._z=h*c*g+d*f*u,this._w=h*c*u-d*f*g;break;case"ZYX":this._x=d*c*u-h*f*g,this._y=h*f*u+d*c*g,this._z=h*c*g-d*f*u,this._w=h*c*u+d*f*g;break;case"YZX":this._x=d*c*u+h*f*g,this._y=h*f*u+d*c*g,this._z=h*c*g-d*f*u,this._w=h*c*u-d*f*g;break;case"XZY":this._x=d*c*u-h*f*g,this._y=h*f*u-d*c*g,this._z=h*c*g+d*f*u,this._w=h*c*u+d*f*g;break;default:Nt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],n=e[4],a=e[8],r=e[1],o=e[5],l=e[9],h=e[2],c=e[6],u=e[10],d=i+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(c-l)*f,this._y=(a-h)*f,this._z=(r-n)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(c-l)/f,this._x=.25*f,this._y=(n+r)/f,this._z=(a+h)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(a-h)/f,this._x=(n+r)/f,this._y=.25*f,this._z=(l+c)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(r-n)/f,this._x=(a+h)/f,this._y=(l+c)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Kt(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,n=t._y,a=t._z,r=t._w,o=e._x,l=e._y,h=e._z,c=e._w;return this._x=i*c+r*o+n*h-a*l,this._y=n*c+r*l+a*o-i*h,this._z=a*c+r*h+i*l-n*o,this._w=r*c-i*o-n*l-a*h,this._onChangeCallback(),this}slerp(t,e){let i=t._x,n=t._y,a=t._z,r=t._w,o=this.dot(t);o<0&&(i=-i,n=-n,a=-a,r=-r,o=-o);let l=1-e;if(o<.9995){const h=Math.acos(o),c=Math.sin(h);l=Math.sin(l*h)/c,e=Math.sin(e*h)/c,this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+a*e,this._w=this._w*l+r*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+a*e,this._w=this._w*l+r*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const jo=class jo{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(xl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(xl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,n=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*n,this.y=a[1]*e+a[4]*i+a[7]*n,this.z=a[2]*e+a[5]*i+a[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,a=t.elements,r=1/(a[3]*e+a[7]*i+a[11]*n+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*n+a[12])*r,this.y=(a[1]*e+a[5]*i+a[9]*n+a[13])*r,this.z=(a[2]*e+a[6]*i+a[10]*n+a[14])*r,this}applyQuaternion(t){const e=this.x,i=this.y,n=this.z,a=t.x,r=t.y,o=t.z,l=t.w,h=2*(r*n-o*i),c=2*(o*e-a*n),u=2*(a*i-r*e);return this.x=e+l*h+r*u-o*c,this.y=i+l*c+o*h-a*u,this.z=n+l*u+a*c-r*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,n=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n,this.y=a[1]*e+a[5]*i+a[9]*n,this.z=a[2]*e+a[6]*i+a[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this.z=Kt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this.z=Kt(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Kt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,n=t.y,a=t.z,r=e.x,o=e.y,l=e.z;return this.x=n*l-a*o,this.y=a*r-i*l,this.z=i*o-n*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ga.copy(this).projectOnVector(t),this.sub(Ga)}reflect(t){return this.sub(Ga.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Kt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};jo.prototype.isVector3=!0;let S=jo;const Ga=new S,xl=new xe,tl=class tl{constructor(t,e,i,n,a,r,o,l,h){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,a,r,o,l,h)}set(t,e,i,n,a,r,o,l,h){const c=this.elements;return c[0]=t,c[1]=n,c[2]=o,c[3]=e,c[4]=a,c[5]=l,c[6]=i,c[7]=r,c[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,a=this.elements,r=i[0],o=i[3],l=i[6],h=i[1],c=i[4],u=i[7],d=i[2],f=i[5],g=i[8],v=n[0],p=n[3],m=n[6],b=n[1],C=n[4],y=n[7],A=n[2],M=n[5],R=n[8];return a[0]=r*v+o*b+l*A,a[3]=r*p+o*C+l*M,a[6]=r*m+o*y+l*R,a[1]=h*v+c*b+u*A,a[4]=h*p+c*C+u*M,a[7]=h*m+c*y+u*R,a[2]=d*v+f*b+g*A,a[5]=d*p+f*C+g*M,a[8]=d*m+f*y+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],n=t[2],a=t[3],r=t[4],o=t[5],l=t[6],h=t[7],c=t[8];return e*r*c-e*o*h-i*a*c+i*o*l+n*a*h-n*r*l}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],a=t[3],r=t[4],o=t[5],l=t[6],h=t[7],c=t[8],u=c*r-o*h,d=o*l-c*a,f=h*a-r*l,g=e*u+i*d+n*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(n*h-c*i)*v,t[2]=(o*i-n*r)*v,t[3]=d*v,t[4]=(c*e-n*l)*v,t[5]=(n*a-o*e)*v,t[6]=f*v,t[7]=(i*l-h*e)*v,t[8]=(r*e-i*a)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,a,r,o){const l=Math.cos(a),h=Math.sin(a);return this.set(i*l,i*h,-i*(l*r+h*o)+r+t,-n*h,n*l,-n*(-h*r+l*o)+o+e,0,0,1),this}scale(t,e){return qn("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Va.makeScale(t,e)),this}rotate(t){return qn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Va.makeRotation(-t)),this}translate(t,e){return qn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Va.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};tl.prototype.isMatrix3=!0;let Bt=tl;const Va=new Bt,yl=new Bt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ml=new Bt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Nd(){const s={enabled:!0,workingColorSpace:Ma,spaces:{},convert:function(n,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===ie&&(n.r=Bi(n.r),n.g=Bi(n.g),n.b=Bi(n.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(n.applyMatrix3(this.spaces[a].toXYZ),n.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===ie&&(n.r=Yn(n.r),n.g=Yn(n.g),n.b=Yn(n.b))),n},workingToColorSpace:function(n,a){return this.convert(n,this.workingColorSpace,a)},colorSpaceToWorking:function(n,a){return this.convert(n,a,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===ji?wa:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,a=this.workingColorSpace){return n.fromArray(this.spaces[a].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,a,r){return n.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,a){return qn("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(n,a)},toWorkingColorSpace:function(n,a){return qn("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(n,a)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[Ma]:{primaries:t,whitePoint:i,transfer:wa,toXYZ:yl,fromXYZ:Ml,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ne},outputColorSpaceConfig:{drawingBufferColorSpace:Ne}},[Ne]:{primaries:t,whitePoint:i,transfer:ie,toXYZ:yl,fromXYZ:Ml,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ne}}}),s}const Jt=Nd();function Bi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Yn(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let En;class zd{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{En===void 0&&(En=Sa("canvas")),En.width=t.width,En.height=t.height;const n=En.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),i=En}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Sa("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const n=i.getImageData(0,0,t.width,t.height),a=n.data;for(let r=0;r<a.length;r++)a[r]=Bi(a[r]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Bi(e[i]/255)*255):e[i]=Bi(e[i]);return{data:e,width:t.width,height:t.height}}else return Nt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Od=0;class Go{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Od++}),this.uuid=Oi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let a;if(Array.isArray(n)){a=[];for(let r=0,o=n.length;r<o;r++)n[r].isDataTexture?a.push(Ha(n[r].image)):a.push(Ha(n[r]))}else a=Ha(n);i.url=a}return e||(t.images[this.uuid]=i),i}}function Ha(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?zd.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Nt("Texture: Unable to serialize Texture."),{})}let Bd=0;const Wa=new S;class qe extends xn{constructor(t=qe.DEFAULT_IMAGE,e=qe.DEFAULT_MAPPING,i=zi,n=zi,a=Re,r=gi,o=Ke,l=si,h=qe.DEFAULT_ANISOTROPY,c=ji){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bd++}),this.uuid=Oi(),this.name="",this.source=new Go(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=a,this.minFilter=r,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new gt(0,0),this.repeat=new gt(1,1),this.center=new gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Bt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Wa).x}get height(){return this.source.getSize(Wa).y}get depth(){return this.source.getSize(Wa).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){Nt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){Nt(`Texture.setValues(): property '${e}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Yh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case _i:t.x=t.x-Math.floor(t.x);break;case zi:t.x=t.x<0?0:1;break;case Br:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case _i:t.y=t.y-Math.floor(t.y);break;case zi:t.y=t.y<0?0:1;break;case Br:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}qe.DEFAULT_IMAGE=null;qe.DEFAULT_MAPPING=Yh;qe.DEFAULT_ANISOTROPY=1;const el=class el{constructor(t=0,e=0,i=0,n=1){this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*n+r[12]*a,this.y=r[1]*e+r[5]*i+r[9]*n+r[13]*a,this.z=r[2]*e+r[6]*i+r[10]*n+r[14]*a,this.w=r[3]*e+r[7]*i+r[11]*n+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,a;const l=t.elements,h=l[0],c=l[4],u=l[8],d=l[1],f=l[5],g=l[9],v=l[2],p=l[6],m=l[10];if(Math.abs(c-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(c+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+p)<.1&&Math.abs(h+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const C=(h+1)/2,y=(f+1)/2,A=(m+1)/2,M=(c+d)/4,R=(u+v)/4,_=(g+p)/4;return C>y&&C>A?C<.01?(i=0,n=.707106781,a=.707106781):(i=Math.sqrt(C),n=M/i,a=R/i):y>A?y<.01?(i=.707106781,n=0,a=.707106781):(n=Math.sqrt(y),i=M/n,a=_/n):A<.01?(i=.707106781,n=.707106781,a=0):(a=Math.sqrt(A),i=R/a,n=_/a),this.set(i,n,a,e),this}let b=Math.sqrt((p-g)*(p-g)+(u-v)*(u-v)+(d-c)*(d-c));return Math.abs(b)<.001&&(b=1),this.x=(p-g)/b,this.y=(u-v)/b,this.z=(d-c)/b,this.w=Math.acos((h+f+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this.z=Kt(this.z,t.z,e.z),this.w=Kt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this.z=Kt(this.z,t,e),this.w=Kt(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Kt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};el.prototype.isVector4=!0;let pe=el;class kd extends xn{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Re,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e),this.textures=[];const n={width:t,height:e,depth:i.depth},a=new qe(n),r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:Re,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,a=this.textures.length;n<a;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const n=Object.assign({},t.textures[e].image);this.textures[e].source=new Go(n)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ze extends kd{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class ec extends qe{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=ke,this.minFilter=ke,this.wrapR=zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Gd extends qe{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=ke,this.minFilter=ke,this.wrapR=zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ra=class Ra{constructor(t,e,i,n,a,r,o,l,h,c,u,d,f,g,v,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,a,r,o,l,h,c,u,d,f,g,v,p)}set(t,e,i,n,a,r,o,l,h,c,u,d,f,g,v,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=n,m[1]=a,m[5]=r,m[9]=o,m[13]=l,m[2]=h,m[6]=c,m[10]=u,m[14]=d,m[3]=f,m[7]=g,m[11]=v,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ra().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,i=t.elements,n=1/An.setFromMatrixColumn(t,0).length(),a=1/An.setFromMatrixColumn(t,1).length(),r=1/An.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*r,e[9]=i[9]*r,e[10]=i[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,n=t.y,a=t.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(n),h=Math.sin(n),c=Math.cos(a),u=Math.sin(a);if(t.order==="XYZ"){const d=r*c,f=r*u,g=o*c,v=o*u;e[0]=l*c,e[4]=-l*u,e[8]=h,e[1]=f+g*h,e[5]=d-v*h,e[9]=-o*l,e[2]=v-d*h,e[6]=g+f*h,e[10]=r*l}else if(t.order==="YXZ"){const d=l*c,f=l*u,g=h*c,v=h*u;e[0]=d+v*o,e[4]=g*o-f,e[8]=r*h,e[1]=r*u,e[5]=r*c,e[9]=-o,e[2]=f*o-g,e[6]=v+d*o,e[10]=r*l}else if(t.order==="ZXY"){const d=l*c,f=l*u,g=h*c,v=h*u;e[0]=d-v*o,e[4]=-r*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=r*c,e[9]=v-d*o,e[2]=-r*h,e[6]=o,e[10]=r*l}else if(t.order==="ZYX"){const d=r*c,f=r*u,g=o*c,v=o*u;e[0]=l*c,e[4]=g*h-f,e[8]=d*h+v,e[1]=l*u,e[5]=v*h+d,e[9]=f*h-g,e[2]=-h,e[6]=o*l,e[10]=r*l}else if(t.order==="YZX"){const d=r*l,f=r*h,g=o*l,v=o*h;e[0]=l*c,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=r*c,e[9]=-o*c,e[2]=-h*c,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=r*l,f=r*h,g=o*l,v=o*h;e[0]=l*c,e[4]=-u,e[8]=h*c,e[1]=d*u+v,e[5]=r*c,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*c,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Vd,t,Hd)}lookAt(t,e,i){const n=this.elements;return ii.subVectors(t,e),ii.lengthSq()===0&&(ii.z=1),ii.normalize(),qi.crossVectors(i,ii),qi.lengthSq()===0&&(Math.abs(i.z)===1?ii.x+=1e-4:ii.z+=1e-4,ii.normalize(),qi.crossVectors(i,ii)),qi.normalize(),Fs.crossVectors(ii,qi),n[0]=qi.x,n[4]=Fs.x,n[8]=ii.x,n[1]=qi.y,n[5]=Fs.y,n[9]=ii.y,n[2]=qi.z,n[6]=Fs.z,n[10]=ii.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,a=this.elements,r=i[0],o=i[4],l=i[8],h=i[12],c=i[1],u=i[5],d=i[9],f=i[13],g=i[2],v=i[6],p=i[10],m=i[14],b=i[3],C=i[7],y=i[11],A=i[15],M=n[0],R=n[4],_=n[8],E=n[12],D=n[1],L=n[5],I=n[9],k=n[13],q=n[2],B=n[6],Y=n[10],H=n[14],J=n[3],et=n[7],at=n[11],rt=n[15];return a[0]=r*M+o*D+l*q+h*J,a[4]=r*R+o*L+l*B+h*et,a[8]=r*_+o*I+l*Y+h*at,a[12]=r*E+o*k+l*H+h*rt,a[1]=c*M+u*D+d*q+f*J,a[5]=c*R+u*L+d*B+f*et,a[9]=c*_+u*I+d*Y+f*at,a[13]=c*E+u*k+d*H+f*rt,a[2]=g*M+v*D+p*q+m*J,a[6]=g*R+v*L+p*B+m*et,a[10]=g*_+v*I+p*Y+m*at,a[14]=g*E+v*k+p*H+m*rt,a[3]=b*M+C*D+y*q+A*J,a[7]=b*R+C*L+y*B+A*et,a[11]=b*_+C*I+y*Y+A*at,a[15]=b*E+C*k+y*H+A*rt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],n=t[8],a=t[12],r=t[1],o=t[5],l=t[9],h=t[13],c=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],p=t[11],m=t[15],b=l*f-h*d,C=o*f-h*u,y=o*d-l*u,A=r*f-h*c,M=r*d-l*c,R=r*u-o*c;return e*(v*b-p*C+m*y)-i*(g*b-p*A+m*M)+n*(g*C-v*A+m*R)-a*(g*y-v*M+p*R)}determinantAffine(){const t=this.elements,e=t[0],i=t[4],n=t[8],a=t[1],r=t[5],o=t[9],l=t[2],h=t[6],c=t[10];return e*(r*c-o*h)-i*(a*c-o*l)+n*(a*h-r*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],a=t[3],r=t[4],o=t[5],l=t[6],h=t[7],c=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],p=t[14],m=t[15],b=e*o-i*r,C=e*l-n*r,y=e*h-a*r,A=i*l-n*o,M=i*h-a*o,R=n*h-a*l,_=c*v-u*g,E=c*p-d*g,D=c*m-f*g,L=u*p-d*v,I=u*m-f*v,k=d*m-f*p,q=b*k-C*I+y*L+A*D-M*E+R*_;if(q===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/q;return t[0]=(o*k-l*I+h*L)*B,t[1]=(n*I-i*k-a*L)*B,t[2]=(v*R-p*M+m*A)*B,t[3]=(d*M-u*R-f*A)*B,t[4]=(l*D-r*k-h*E)*B,t[5]=(e*k-n*D+a*E)*B,t[6]=(p*y-g*R-m*C)*B,t[7]=(c*R-d*y+f*C)*B,t[8]=(r*I-o*D+h*_)*B,t[9]=(i*D-e*I-a*_)*B,t[10]=(g*M-v*y+m*b)*B,t[11]=(u*y-c*M-f*b)*B,t[12]=(o*E-r*L-l*_)*B,t[13]=(e*L-i*E+n*_)*B,t[14]=(v*C-g*A-p*b)*B,t[15]=(c*A-u*C+d*b)*B,this}scale(t){const e=this.elements,i=t.x,n=t.y,a=t.z;return e[0]*=i,e[4]*=n,e[8]*=a,e[1]*=i,e[5]*=n,e[9]*=a,e[2]*=i,e[6]*=n,e[10]*=a,e[3]*=i,e[7]*=n,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),n=Math.sin(e),a=1-i,r=t.x,o=t.y,l=t.z,h=a*r,c=a*o;return this.set(h*r+i,h*o-n*l,h*l+n*o,0,h*o+n*l,c*o+i,c*l-n*r,0,h*l-n*o,c*l+n*r,a*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,a,r){return this.set(1,i,a,0,t,1,r,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){const n=this.elements,a=e._x,r=e._y,o=e._z,l=e._w,h=a+a,c=r+r,u=o+o,d=a*h,f=a*c,g=a*u,v=r*c,p=r*u,m=o*u,b=l*h,C=l*c,y=l*u,A=i.x,M=i.y,R=i.z;return n[0]=(1-(v+m))*A,n[1]=(f+y)*A,n[2]=(g-C)*A,n[3]=0,n[4]=(f-y)*M,n[5]=(1-(d+m))*M,n[6]=(p+b)*M,n[7]=0,n[8]=(g+C)*R,n[9]=(p-b)*R,n[10]=(1-(d+v))*R,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){const n=this.elements;t.x=n[12],t.y=n[13],t.z=n[14];const a=this.determinantAffine();if(a===0)return i.set(1,1,1),e.identity(),this;let r=An.set(n[0],n[1],n[2]).length();const o=An.set(n[4],n[5],n[6]).length(),l=An.set(n[8],n[9],n[10]).length();a<0&&(r=-r),di.copy(this);const h=1/r,c=1/o,u=1/l;return di.elements[0]*=h,di.elements[1]*=h,di.elements[2]*=h,di.elements[4]*=c,di.elements[5]*=c,di.elements[6]*=c,di.elements[8]*=u,di.elements[9]*=u,di.elements[10]*=u,e.setFromRotationMatrix(di),i.x=r,i.y=o,i.z=l,this}makePerspective(t,e,i,n,a,r,o=Ti,l=!1){const h=this.elements,c=2*a/(e-t),u=2*a/(i-n),d=(e+t)/(e-t),f=(i+n)/(i-n);let g,v;if(l)g=a/(r-a),v=r*a/(r-a);else if(o===Ti)g=-(r+a)/(r-a),v=-2*r*a/(r-a);else if(o===Ps)g=-r/(r-a),v=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=c,h[4]=0,h[8]=d,h[12]=0,h[1]=0,h[5]=u,h[9]=f,h[13]=0,h[2]=0,h[6]=0,h[10]=g,h[14]=v,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(t,e,i,n,a,r,o=Ti,l=!1){const h=this.elements,c=2/(e-t),u=2/(i-n),d=-(e+t)/(e-t),f=-(i+n)/(i-n);let g,v;if(l)g=1/(r-a),v=r/(r-a);else if(o===Ti)g=-2/(r-a),v=-(r+a)/(r-a);else if(o===Ps)g=-1/(r-a),v=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=c,h[4]=0,h[8]=0,h[12]=d,h[1]=0,h[5]=u,h[9]=0,h[13]=f,h[2]=0,h[6]=0,h[10]=g,h[14]=v,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};Ra.prototype.isMatrix4=!0;let Wt=Ra;const An=new S,di=new Wt,Vd=new S(0,0,0),Hd=new S(1,1,1),qi=new S,Fs=new S,ii=new S,wl=new Wt,Sl=new xe;class ze{constructor(t=0,e=0,i=0,n=ze.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const n=t.elements,a=n[0],r=n[4],o=n[8],l=n[1],h=n[5],c=n[9],u=n[2],d=n[6],f=n[10];switch(e){case"XYZ":this._y=Math.asin(Kt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,f),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Kt(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Kt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,h)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-Kt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,h));break;case"YZX":this._z=Math.asin(Kt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,h),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Kt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-c,f),this._y=0);break;default:Nt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return wl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(wl,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Sl.setFromEuler(this),this.setFromQuaternion(Sl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ze.DEFAULT_ORDER="XYZ";class Vo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Wd=0;const bl=new S,Rn=new xe,Li=new Wt,Ns=new S,ss=new S,Xd=new S,qd=new xe,Tl=new S(1,0,0),El=new S(0,1,0),Al=new S(0,0,1),Rl={type:"added"},Yd={type:"removed"},Cn={type:"childadded",child:null},Xa={type:"childremoved",child:null};class ae extends xn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=Oi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ae.DEFAULT_UP.clone();const t=new S,e=new ze,i=new xe,n=new S(1,1,1);function a(){i.setFromEuler(e,!1)}function r(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new Wt},normalMatrix:{value:new Bt}}),this.matrix=new Wt,this.matrixWorld=new Wt,this.matrixAutoUpdate=ae.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Rn.setFromAxisAngle(t,e),this.quaternion.multiply(Rn),this}rotateOnWorldAxis(t,e){return Rn.setFromAxisAngle(t,e),this.quaternion.premultiply(Rn),this}rotateX(t){return this.rotateOnAxis(Tl,t)}rotateY(t){return this.rotateOnAxis(El,t)}rotateZ(t){return this.rotateOnAxis(Al,t)}translateOnAxis(t,e){return bl.copy(t).applyQuaternion(this.quaternion),this.position.add(bl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Tl,t)}translateY(t){return this.translateOnAxis(El,t)}translateZ(t){return this.translateOnAxis(Al,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Li.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Ns.copy(t):Ns.set(t,e,i);const n=this.parent;this.updateWorldMatrix(!0,!1),ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Li.lookAt(ss,Ns,this.up):Li.lookAt(Ns,ss,this.up),this.quaternion.setFromRotationMatrix(Li),n&&(Li.extractRotation(n.matrixWorld),Rn.setFromRotationMatrix(Li),this.quaternion.premultiply(Rn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Qt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Rl),Cn.child=t,this.dispatchEvent(Cn),Cn.child=null):Qt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Yd),Xa.child=t,this.dispatchEvent(Xa),Xa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Li.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Li.multiply(t.parent.matrixWorld)),t.applyMatrix4(Li),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Rl),Cn.child=t,this.dispatchEvent(Cn),Cn.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){const r=this.children[i].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const n=this.children;for(let a=0,r=n.length;a<r;a++)n[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,t,Xd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,qd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,i=t.y,n=t.z,a=this.matrix.elements;a[12]+=e-a[0]*e-a[4]*i-a[8]*n,a[13]+=i-a[1]*e-a[5]*i-a[9]*n,a[14]+=n-a[2]*e-a[6]*i-a[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){const a=this.children;for(let r=0,o=a.length;r<o;r++)a[r].updateWorldMatrix(!1,!0,i)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),this.static!==!1&&(n.static=this.static),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(t),n.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let h=0,c=l.length;h<c;h++){const u=l[h];a(t.shapes,u)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(a(t.materials,this.material[l]));n.material=o}else n.material=a(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(a(t.animations,l))}}if(e){const o=r(t.geometries),l=r(t.materials),h=r(t.textures),c=r(t.images),u=r(t.shapes),d=r(t.skeletons),f=r(t.animations),g=r(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),h.length>0&&(i.textures=h),c.length>0&&(i.images=c),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=n,i;function r(o){const l=[];for(const h in o){const c=o[h];delete c.metadata,l.push(c)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const n=t.children[i];this.add(n.clone())}return this}}ae.DEFAULT_UP=new S(0,1,0);ae.DEFAULT_MATRIX_AUTO_UPDATE=!0;ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class $t extends ae{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $d={type:"move"};class qa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $t,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $t,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new S,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new S),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $t,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new S,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new S,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,a=null,r=null;const o=this._targetRay,l=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){r=!0;for(const v of t.hand.values()){const p=e.getJointPose(v,i),m=this._getHandJoint(h,v);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const c=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],d=c.position.distanceTo(u.position),f=.02,g=.005;h.inputState.pinching&&d>f+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&d<=f-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&a!==null&&(n=a),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent($d)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=a!==null),h!==null&&(h.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new $t;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const ic={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yi={h:0,s:0,l:0},zs={h:0,s:0,l:0};function Ya(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Ct{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ne){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Jt.colorSpaceToWorking(this,e),this}setRGB(t,e,i,n=Jt.workingColorSpace){return this.r=t,this.g=e,this.b=i,Jt.colorSpaceToWorking(this,n),this}setHSL(t,e,i,n=Jt.workingColorSpace){if(t=ko(t,1),e=Kt(e,0,1),i=Kt(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,r=2*i-a;this.r=Ya(r,a,t+1/3),this.g=Ya(r,a,t),this.b=Ya(r,a,t-1/3)}return Jt.colorSpaceToWorking(this,n),this}setStyle(t,e=Ne){function i(a){a!==void 0&&parseFloat(a)<1&&Nt("Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=n[1],o=n[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:Nt("Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=n[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);Nt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ne){const i=ic[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Nt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Bi(t.r),this.g=Bi(t.g),this.b=Bi(t.b),this}copyLinearToSRGB(t){return this.r=Yn(t.r),this.g=Yn(t.g),this.b=Yn(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ne){return Jt.workingToColorSpace(He.copy(this),t),Math.round(Kt(He.r*255,0,255))*65536+Math.round(Kt(He.g*255,0,255))*256+Math.round(Kt(He.b*255,0,255))}getHexString(t=Ne){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Jt.workingColorSpace){Jt.workingToColorSpace(He.copy(this),e);const i=He.r,n=He.g,a=He.b,r=Math.max(i,n,a),o=Math.min(i,n,a);let l,h;const c=(o+r)/2;if(o===r)l=0,h=0;else{const u=r-o;switch(h=c<=.5?u/(r+o):u/(2-r-o),r){case i:l=(n-a)/u+(n<a?6:0);break;case n:l=(a-i)/u+2;break;case a:l=(i-n)/u+4;break}l/=6}return t.h=l,t.s=h,t.l=c,t}getRGB(t,e=Jt.workingColorSpace){return Jt.workingToColorSpace(He.copy(this),e),t.r=He.r,t.g=He.g,t.b=He.b,t}getStyle(t=Ne){Jt.workingToColorSpace(He.copy(this),t);const e=He.r,i=He.g,n=He.b;return t!==Ne?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(Yi),this.setHSL(Yi.h+t,Yi.s+e,Yi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Yi),t.getHSL(zs);const i=As(Yi.h,zs.h,e),n=As(Yi.s,zs.s,e),a=As(Yi.l,zs.l,e);return this.setHSL(i,n,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,n=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*n,this.g=a[1]*e+a[4]*i+a[7]*n,this.b=a[2]*e+a[5]*i+a[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const He=new Ct;Ct.NAMES=ic;class Ho{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ct(t),this.density=e}clone(){return new Ho(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class xo extends ae{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ze,this.environmentIntensity=1,this.environmentRotation=new ze,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const ui=new S,Di=new S,$a=new S,Ii=new S,Pn=new S,Ln=new S,Cl=new S,Ka=new S,Za=new S,Ja=new S,Qa=new pe,ja=new pe,tr=new pe;class hi{constructor(t=new S,e=new S,i=new S){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),ui.subVectors(t,e),n.cross(ui);const a=n.lengthSq();return a>0?n.multiplyScalar(1/Math.sqrt(a)):n.set(0,0,0)}static getBarycoord(t,e,i,n,a){ui.subVectors(n,e),Di.subVectors(i,e),$a.subVectors(t,e);const r=ui.dot(ui),o=ui.dot(Di),l=ui.dot($a),h=Di.dot(Di),c=Di.dot($a),u=r*h-o*o;if(u===0)return a.set(0,0,0),null;const d=1/u,f=(h*l-o*c)*d,g=(r*c-o*l)*d;return a.set(1-f-g,g,f)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,Ii)===null?!1:Ii.x>=0&&Ii.y>=0&&Ii.x+Ii.y<=1}static getInterpolation(t,e,i,n,a,r,o,l){return this.getBarycoord(t,e,i,n,Ii)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Ii.x),l.addScaledVector(r,Ii.y),l.addScaledVector(o,Ii.z),l)}static getInterpolatedAttribute(t,e,i,n,a,r){return Qa.setScalar(0),ja.setScalar(0),tr.setScalar(0),Qa.fromBufferAttribute(t,e),ja.fromBufferAttribute(t,i),tr.fromBufferAttribute(t,n),r.setScalar(0),r.addScaledVector(Qa,a.x),r.addScaledVector(ja,a.y),r.addScaledVector(tr,a.z),r}static isFrontFacing(t,e,i,n){return ui.subVectors(i,e),Di.subVectors(t,e),ui.cross(Di).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ui.subVectors(this.c,this.b),Di.subVectors(this.a,this.b),ui.cross(Di).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return hi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return hi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,a){return hi.getInterpolation(t,this.a,this.b,this.c,e,i,n,a)}containsPoint(t){return hi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return hi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,n=this.b,a=this.c;let r,o;Pn.subVectors(n,i),Ln.subVectors(a,i),Ka.subVectors(t,i);const l=Pn.dot(Ka),h=Ln.dot(Ka);if(l<=0&&h<=0)return e.copy(i);Za.subVectors(t,n);const c=Pn.dot(Za),u=Ln.dot(Za);if(c>=0&&u<=c)return e.copy(n);const d=l*u-c*h;if(d<=0&&l>=0&&c<=0)return r=l/(l-c),e.copy(i).addScaledVector(Pn,r);Ja.subVectors(t,a);const f=Pn.dot(Ja),g=Ln.dot(Ja);if(g>=0&&f<=g)return e.copy(a);const v=f*h-l*g;if(v<=0&&h>=0&&g<=0)return o=h/(h-g),e.copy(i).addScaledVector(Ln,o);const p=c*g-f*u;if(p<=0&&u-c>=0&&f-g>=0)return Cl.subVectors(a,n),o=(u-c)/(u-c+(f-g)),e.copy(n).addScaledVector(Cl,o);const m=1/(p+v+d);return r=v*m,o=d*m,e.copy(i).addScaledVector(Pn,r).addScaledVector(Ln,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class sn{constructor(t=new S(1/0,1/0,1/0),e=new S(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(fi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(fi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=fi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,fi):fi.fromBufferAttribute(a,r),fi.applyMatrix4(t.matrixWorld),this.expandByPoint(fi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Os.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Os.copy(i.boundingBox)),Os.applyMatrix4(t.matrixWorld),this.union(Os)}const n=t.children;for(let a=0,r=n.length;a<r;a++)this.expandByObject(n[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,fi),fi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(as),Bs.subVectors(this.max,as),Dn.subVectors(t.a,as),In.subVectors(t.b,as),Un.subVectors(t.c,as),$i.subVectors(In,Dn),Ki.subVectors(Un,In),rn.subVectors(Dn,Un);let e=[0,-$i.z,$i.y,0,-Ki.z,Ki.y,0,-rn.z,rn.y,$i.z,0,-$i.x,Ki.z,0,-Ki.x,rn.z,0,-rn.x,-$i.y,$i.x,0,-Ki.y,Ki.x,0,-rn.y,rn.x,0];return!er(e,Dn,In,Un,Bs)||(e=[1,0,0,0,1,0,0,0,1],!er(e,Dn,In,Un,Bs))?!1:(ks.crossVectors($i,Ki),e=[ks.x,ks.y,ks.z],er(e,Dn,In,Un,Bs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,fi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(fi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ui),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Ui=[new S,new S,new S,new S,new S,new S,new S,new S],fi=new S,Os=new sn,Dn=new S,In=new S,Un=new S,$i=new S,Ki=new S,rn=new S,as=new S,Bs=new S,ks=new S,on=new S;function er(s,t,e,i,n){for(let a=0,r=s.length-3;a<=r;a+=3){on.fromArray(s,a);const o=n.x*Math.abs(on.x)+n.y*Math.abs(on.y)+n.z*Math.abs(on.z),l=t.dot(on),h=e.dot(on),c=i.dot(on);if(Math.max(-Math.max(l,h,c),Math.min(l,h,c))>o)return!1}return!0}const Ee=new S,Gs=new gt;let Kd=0;class ti extends xn{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Kd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=_o,this.updateRanges=[],this.gpuType=vi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,a=this.itemSize;n<a;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Gs.fromBufferAttribute(this,e),Gs.applyMatrix3(t),this.setXY(e,Gs.x,Gs.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=mi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=se(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=mi(e,this.array)),e}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=mi(e,this.array)),e}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=mi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=mi(e,this.array)),e}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),i=se(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),i=se(i,this.array),n=se(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,a){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),i=se(i,this.array),n=se(n,this.array),a=se(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==_o&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class nc extends ti{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class sc extends ti{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class me extends ti{constructor(t,e,i){super(new Float32Array(t),e,i)}}const Zd=new sn,rs=new S,ir=new S;class es{constructor(t=new S,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Zd.setFromPoints(t).getCenter(i);let n=0;for(let a=0,r=t.length;a<r;a++)n=Math.max(n,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;rs.subVectors(t,this.center);const e=rs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(rs,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ir.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(rs.copy(t.center).add(ir)),this.expandByPoint(rs.copy(t.center).sub(ir))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let Jd=0;const ri=new Wt,nr=new ae,Fn=new S,ni=new sn,os=new sn,Fe=new S;class Le extends xn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Jd++}),this.uuid=Oi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(gd(t)?sc:nc)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Bt().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return ri.makeRotationFromQuaternion(t),this.applyMatrix4(ri),this}rotateX(t){return ri.makeRotationX(t),this.applyMatrix4(ri),this}rotateY(t){return ri.makeRotationY(t),this.applyMatrix4(ri),this}rotateZ(t){return ri.makeRotationZ(t),this.applyMatrix4(ri),this}translate(t,e,i){return ri.makeTranslation(t,e,i),this.applyMatrix4(ri),this}scale(t,e,i){return ri.makeScale(t,e,i),this.applyMatrix4(ri),this}lookAt(t){return nr.lookAt(t),nr.updateMatrix(),this.applyMatrix4(nr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fn).negate(),this.translate(Fn.x,Fn.y,Fn.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let n=0,a=t.length;n<a;n++){const r=t[n];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new me(i,3))}else{const i=Math.min(t.length,e.count);for(let n=0;n<i;n++){const a=t[n];e.setXYZ(n,a.x,a.y,a.z||0)}t.length>e.count&&Nt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Qt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new S(-1/0,-1/0,-1/0),new S(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){const a=e[i];ni.setFromBufferAttribute(a),this.morphTargetsRelative?(Fe.addVectors(this.boundingBox.min,ni.min),this.boundingBox.expandByPoint(Fe),Fe.addVectors(this.boundingBox.max,ni.max),this.boundingBox.expandByPoint(Fe)):(this.boundingBox.expandByPoint(ni.min),this.boundingBox.expandByPoint(ni.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Qt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new es);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Qt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new S,1/0);return}if(t){const i=this.boundingSphere.center;if(ni.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];os.setFromBufferAttribute(o),this.morphTargetsRelative?(Fe.addVectors(ni.min,os.min),ni.expandByPoint(Fe),Fe.addVectors(ni.max,os.max),ni.expandByPoint(Fe)):(ni.expandByPoint(os.min),ni.expandByPoint(os.max))}ni.getCenter(i);let n=0;for(let a=0,r=t.count;a<r;a++)Fe.fromBufferAttribute(t,a),n=Math.max(n,i.distanceToSquared(Fe));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],l=this.morphTargetsRelative;for(let h=0,c=o.count;h<c;h++)Fe.fromBufferAttribute(o,h),l&&(Fn.fromBufferAttribute(t,h),Fe.add(Fn)),n=Math.max(n,i.distanceToSquared(Fe))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&Qt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Qt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,n=e.normal,a=e.uv;let r=this.getAttribute("tangent");(r===void 0||r.count!==i.count)&&(r=new ti(new Float32Array(4*i.count),4),this.setAttribute("tangent",r));const o=[],l=[];for(let _=0;_<i.count;_++)o[_]=new S,l[_]=new S;const h=new S,c=new S,u=new S,d=new gt,f=new gt,g=new gt,v=new S,p=new S;function m(_,E,D){h.fromBufferAttribute(i,_),c.fromBufferAttribute(i,E),u.fromBufferAttribute(i,D),d.fromBufferAttribute(a,_),f.fromBufferAttribute(a,E),g.fromBufferAttribute(a,D),c.sub(h),u.sub(h),f.sub(d),g.sub(d);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(v.copy(c).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(L),p.copy(u).multiplyScalar(f.x).addScaledVector(c,-g.x).multiplyScalar(L),o[_].add(v),o[E].add(v),o[D].add(v),l[_].add(p),l[E].add(p),l[D].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let _=0,E=b.length;_<E;++_){const D=b[_],L=D.start,I=D.count;for(let k=L,q=L+I;k<q;k+=3)m(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const C=new S,y=new S,A=new S,M=new S;function R(_){A.fromBufferAttribute(n,_),M.copy(A);const E=o[_];C.copy(E),C.sub(A.multiplyScalar(A.dot(E))).normalize(),y.crossVectors(M,E);const L=y.dot(l[_])<0?-1:1;r.setXYZW(_,C.x,C.y,C.z,L)}for(let _=0,E=b.length;_<E;++_){const D=b[_],L=D.start,I=D.count;for(let k=L,q=L+I;k<q;k+=3)R(t.getX(k+0)),R(t.getX(k+1)),R(t.getX(k+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new ti(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const n=new S,a=new S,r=new S,o=new S,l=new S,h=new S,c=new S,u=new S;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),p=t.getX(d+2);n.fromBufferAttribute(e,g),a.fromBufferAttribute(e,v),r.fromBufferAttribute(e,p),c.subVectors(r,a),u.subVectors(n,a),c.cross(u),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,v),h.fromBufferAttribute(i,p),o.add(c),l.add(c),h.add(c),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(p,h.x,h.y,h.z)}else for(let d=0,f=e.count;d<f;d+=3)n.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),r.fromBufferAttribute(e,d+2),c.subVectors(r,a),u.subVectors(n,a),c.cross(u),i.setXYZ(d+0,c.x,c.y,c.z),i.setXYZ(d+1,c.x,c.y,c.z),i.setXYZ(d+2,c.x,c.y,c.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Fe.fromBufferAttribute(t,e),Fe.normalize(),t.setXYZ(e,Fe.x,Fe.y,Fe.z)}toNonIndexed(){function t(o,l){const h=o.array,c=o.itemSize,u=o.normalized,d=new h.constructor(l.length*c);let f=0,g=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*c;for(let m=0;m<c;m++)d[g++]=h[f++]}return new ti(d,c,u)}if(this.index===null)return Nt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],h=t(l,i);e.setAttribute(o,h)}const a=this.morphAttributes;for(const o in a){const l=[],h=a[o];for(let c=0,u=h.length;c<u;c++){const d=h[c],f=t(d,i);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const h=r[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const h in l)l[h]!==void 0&&(t[h]=l[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const h=i[l];t.data.attributes[l]=h.toJSON(t.data)}const n={};let a=!1;for(const l in this.morphAttributes){const h=this.morphAttributes[l],c=[];for(let u=0,d=h.length;u<d;u++){const f=h[u];c.push(f.toJSON(t.data))}c.length>0&&(n[l]=c,a=!0)}a&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const n=t.attributes;for(const h in n){const c=n[h];this.setAttribute(h,c.clone(e))}const a=t.morphAttributes;for(const h in a){const c=[],u=a[h];for(let d=0,f=u.length;d<f;d++)c.push(u[d].clone(e));this.morphAttributes[h]=c}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let h=0,c=r.length;h<c;h++){const u=r[h];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Qd{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=_o,this.updateRanges=[],this.version=0,this.uuid=Oi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let n=0,a=this.stride;n<a;n++)this.array[t+n]=e.array[i+n];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Oi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Oi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ye=new S;class Ta{constructor(t,e,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.applyMatrix4(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.applyNormalMatrix(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ye.fromBufferAttribute(this,e),Ye.transformDirection(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=mi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=se(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=mi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=mi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=mi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=mi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),i=se(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),i=se(i,this.array),n=se(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this}setXYZW(t,e,i,n,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),i=se(i,this.array),n=se(n,this.array),a=se(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this.data.array[t+3]=a,this}clone(t){if(t===void 0){ba("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[n+a])}return new ti(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ta(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){ba("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[n+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let jd=0;class yn extends xn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jd++}),this.uuid=Oi(),this.name="",this.type="Material",this.blending=en,this.side=nn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Pr,this.blendDst=Lr,this.blendEquation=dn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ct(0,0,0),this.blendAlpha=0,this.depthFunc=Kn,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ml,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Tn,this.stencilZFail=Tn,this.stencilZPass=Tn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){Nt(`Material: parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){Nt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==en&&(i.blending=this.blending),this.side!==nn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Pr&&(i.blendSrc=this.blendSrc),this.blendDst!==Lr&&(i.blendDst=this.blendDst),this.blendEquation!==dn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Kn&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ml&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Tn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Tn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Tn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(e){const a=n(t.textures),r=n(t.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Ct().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new gt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new gt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const n=e.length;i=new Array(n);for(let a=0;a!==n;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ac extends yn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ct(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Nn;const ls=new S,zn=new S,On=new S,Bn=new gt,hs=new gt,rc=new Wt,Vs=new S,cs=new S,Hs=new S,Pl=new gt,sr=new gt,Ll=new gt;class tu extends ae{constructor(t=new ac){if(super(),this.isSprite=!0,this.type="Sprite",Nn===void 0){Nn=new Le;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Qd(e,5);Nn.setIndex([0,1,2,0,2,3]),Nn.setAttribute("position",new Ta(i,3,0,!1)),Nn.setAttribute("uv",new Ta(i,2,3,!1))}this.geometry=Nn,this.material=t,this.center=new gt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&Qt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),zn.setFromMatrixScale(this.matrixWorld),rc.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),On.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&zn.multiplyScalar(-On.z);const i=this.material.rotation;let n,a;i!==0&&(a=Math.cos(i),n=Math.sin(i));const r=this.center;Ws(Vs.set(-.5,-.5,0),On,r,zn,n,a),Ws(cs.set(.5,-.5,0),On,r,zn,n,a),Ws(Hs.set(.5,.5,0),On,r,zn,n,a),Pl.set(0,0),sr.set(1,0),Ll.set(1,1);let o=t.ray.intersectTriangle(Vs,cs,Hs,!1,ls);if(o===null&&(Ws(cs.set(-.5,.5,0),On,r,zn,n,a),sr.set(0,1),o=t.ray.intersectTriangle(Vs,Hs,cs,!1,ls),o===null))return;const l=t.ray.origin.distanceTo(ls);l<t.near||l>t.far||e.push({distance:l,point:ls.clone(),uv:hi.getInterpolation(ls,Vs,cs,Hs,Pl,sr,Ll,new gt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ws(s,t,e,i,n,a){Bn.subVectors(s,e).addScalar(.5).multiply(i),n!==void 0?(hs.x=a*Bn.x-n*Bn.y,hs.y=n*Bn.x+a*Bn.y):hs.copy(Bn),s.copy(t),s.x+=hs.x,s.y+=hs.y,s.applyMatrix4(rc)}const Fi=new S,ar=new S,Xs=new S,Zi=new S,rr=new S,qs=new S,or=new S;class Wo{constructor(t=new S,e=new S(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Fi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Fi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Fi.copy(this.origin).addScaledVector(this.direction,e),Fi.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){ar.copy(t).add(e).multiplyScalar(.5),Xs.copy(e).sub(t).normalize(),Zi.copy(this.origin).sub(ar);const a=t.distanceTo(e)*.5,r=-this.direction.dot(Xs),o=Zi.dot(this.direction),l=-Zi.dot(Xs),h=Zi.lengthSq(),c=Math.abs(1-r*r);let u,d,f,g;if(c>0)if(u=r*l-o,d=r*o-l,g=a*c,u>=0)if(d>=-g)if(d<=g){const v=1/c;u*=v,d*=v,f=u*(u+r*d+2*o)+d*(r*u+d+2*l)+h}else d=a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+h;else d=-a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+h;else d<=-g?(u=Math.max(0,-(-r*a+o)),d=u>0?-a:Math.min(Math.max(-a,-l),a),f=-u*u+d*(d+2*l)+h):d<=g?(u=0,d=Math.min(Math.max(-a,-l),a),f=d*(d+2*l)+h):(u=Math.max(0,-(r*a+o)),d=u>0?a:Math.min(Math.max(-a,-l),a),f=-u*u+d*(d+2*l)+h);else d=r>0?-a:a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,u),n&&n.copy(ar).addScaledVector(Xs,d),f}intersectSphere(t,e){Fi.subVectors(t.center,this.origin);const i=Fi.dot(this.direction),n=Fi.dot(Fi)-i*i,a=t.radius*t.radius;if(n>a)return null;const r=Math.sqrt(a-n),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,a,r,o,l;const h=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,d=this.origin;return h>=0?(i=(t.min.x-d.x)*h,n=(t.max.x-d.x)*h):(i=(t.max.x-d.x)*h,n=(t.min.x-d.x)*h),c>=0?(a=(t.min.y-d.y)*c,r=(t.max.y-d.y)*c):(a=(t.max.y-d.y)*c,r=(t.min.y-d.y)*c),i>r||a>n||((a>i||isNaN(i))&&(i=a),(r<n||isNaN(n))&&(n=r),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,Fi)!==null}intersectTriangle(t,e,i,n,a){rr.subVectors(e,t),qs.subVectors(i,t),or.crossVectors(rr,qs);let r=this.direction.dot(or),o;if(r>0){if(n)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Zi.subVectors(this.origin,t);const l=o*this.direction.dot(qs.crossVectors(Zi,qs));if(l<0)return null;const h=o*this.direction.dot(rr.cross(Zi));if(h<0||l+h>r)return null;const c=-o*Zi.dot(or);return c<0?null:this.at(c/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ei extends yn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ze,this.combine=qh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Dl=new Wt,ln=new Wo,Ys=new es,Il=new S,$s=new S,Ks=new S,Zs=new S,lr=new S,Js=new S,Ul=new S,Qs=new S;class U extends ae{constructor(t=new Le,e=new Ei){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=n.length;a<r;a++){const o=n[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const i=this.geometry,n=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;e.fromBufferAttribute(n,t);const o=this.morphTargetInfluences;if(a&&o){Js.set(0,0,0);for(let l=0,h=a.length;l<h;l++){const c=o[l],u=a[l];c!==0&&(lr.fromBufferAttribute(u,t),r?Js.addScaledVector(lr,c):Js.addScaledVector(lr.sub(e),c))}e.add(Js)}return e}raycast(t,e){const i=this.geometry,n=this.material,a=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ys.copy(i.boundingSphere),Ys.applyMatrix4(a),ln.copy(t.ray).recast(t.near),!(Ys.containsPoint(ln.origin)===!1&&(ln.intersectSphere(Ys,Il)===null||ln.origin.distanceToSquared(Il)>(t.far-t.near)**2))&&(Dl.copy(a).invert(),ln.copy(t.ray).applyMatrix4(Dl),!(i.boundingBox!==null&&ln.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ln)))}_computeIntersections(t,e,i){let n;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,h=a.attributes.uv,c=a.attributes.uv1,u=a.attributes.normal,d=a.groups,f=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,v=d.length;g<v;g++){const p=d[g],m=r[p.materialIndex],b=Math.max(p.start,f.start),C=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let y=b,A=C;y<A;y+=3){const M=o.getX(y),R=o.getX(y+1),_=o.getX(y+2);n=js(this,m,t,i,h,c,u,M,R,_),n&&(n.faceIndex=Math.floor(y/3),n.face.materialIndex=p.materialIndex,e.push(n))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){const b=o.getX(p),C=o.getX(p+1),y=o.getX(p+2);n=js(this,r,t,i,h,c,u,b,C,y),n&&(n.faceIndex=Math.floor(p/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,v=d.length;g<v;g++){const p=d[g],m=r[p.materialIndex],b=Math.max(p.start,f.start),C=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let y=b,A=C;y<A;y+=3){const M=y,R=y+1,_=y+2;n=js(this,m,t,i,h,c,u,M,R,_),n&&(n.faceIndex=Math.floor(y/3),n.face.materialIndex=p.materialIndex,e.push(n))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){const b=p,C=p+1,y=p+2;n=js(this,r,t,i,h,c,u,b,C,y),n&&(n.faceIndex=Math.floor(p/3),e.push(n))}}}}function eu(s,t,e,i,n,a,r,o){let l;if(t.side===Xe?l=i.intersectTriangle(r,a,n,!0,o):l=i.intersectTriangle(n,a,r,t.side===nn,o),l===null)return null;Qs.copy(o),Qs.applyMatrix4(s.matrixWorld);const h=e.ray.origin.distanceTo(Qs);return h<e.near||h>e.far?null:{distance:h,point:Qs.clone(),object:s}}function js(s,t,e,i,n,a,r,o,l,h){s.getVertexPosition(o,$s),s.getVertexPosition(l,Ks),s.getVertexPosition(h,Zs);const c=eu(s,t,e,i,$s,Ks,Zs,Ul);if(c){const u=new S;hi.getBarycoord(Ul,$s,Ks,Zs,u),n&&(c.uv=hi.getInterpolatedAttribute(n,o,l,h,u,new gt)),a&&(c.uv1=hi.getInterpolatedAttribute(a,o,l,h,u,new gt)),r&&(c.normal=hi.getInterpolatedAttribute(r,o,l,h,u,new S),c.normal.dot(i.direction)>0&&c.normal.multiplyScalar(-1));const d={a:o,b:l,c:h,normal:new S,materialIndex:0};hi.getNormal($s,Ks,Zs,d.normal),c.face=d,c.barycoord=u}return c}class is extends qe{constructor(t=null,e=1,i=1,n,a,r,o,l,h=ke,c=ke,u,d){super(null,r,o,l,h,c,n,a,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ci extends ti{constructor(t,e,i,n=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const kn=new Wt,Fl=new Wt,ta=[],Nl=new sn,iu=new Wt,ds=new U,us=new es;class oc extends U{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ci(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,iu)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new sn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,kn),Nl.copy(t.boundingBox).applyMatrix4(kn),this.boundingBox.union(Nl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new es),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,kn),us.copy(t.boundingSphere).applyMatrix4(kn),this.boundingSphere.union(us)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,n=this.morphTexture.source.data.data,a=i.length+1,r=t*a+1;for(let o=0;o<i.length;o++)i[o]=n[r+o]}raycast(t,e){const i=this.matrixWorld,n=this.count;if(ds.geometry=this.geometry,ds.material=this.material,ds.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),us.copy(this.boundingSphere),us.applyMatrix4(i),t.ray.intersectsSphere(us)!==!1))for(let a=0;a<n;a++){this.getMatrixAt(a,kn),Fl.multiplyMatrices(i,kn),ds.matrixWorld=Fl,ds.raycast(t,ta);for(let r=0,o=ta.length;r<o;r++){const l=ta[r];l.instanceId=a,l.object=this,e.push(l)}ta.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Ci(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const i=e.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new is(new Float32Array(n*this.count),n,this.count,Uo,vi));const a=this.morphTexture.source.data.data;let r=0;for(let h=0;h<i.length;h++)r+=i[h];const o=this.geometry.morphTargetsRelative?1:1-r,l=n*t;return a[l]=o,a.set(i,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const hr=new S,nu=new S,su=new Bt;class cn{constructor(t=new S(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const n=hr.subVectors(i,e).cross(nu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){const n=t.delta(hr),a=this.normal.dot(n);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/a;return i===!0&&(r<0||r>1)?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||su.getNormalMatrix(t),n=this.coplanarPoint(hr).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const hn=new es,au=new gt(.5,.5),ea=new S;class Xo{constructor(t=new cn,e=new cn,i=new cn,n=new cn,a=new cn,r=new cn){this.planes=[t,e,i,n,a,r]}set(t,e,i,n,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Ti,i=!1){const n=this.planes,a=t.elements,r=a[0],o=a[1],l=a[2],h=a[3],c=a[4],u=a[5],d=a[6],f=a[7],g=a[8],v=a[9],p=a[10],m=a[11],b=a[12],C=a[13],y=a[14],A=a[15];if(n[0].setComponents(h-r,f-c,m-g,A-b).normalize(),n[1].setComponents(h+r,f+c,m+g,A+b).normalize(),n[2].setComponents(h+o,f+u,m+v,A+C).normalize(),n[3].setComponents(h-o,f-u,m-v,A-C).normalize(),i)n[4].setComponents(l,d,p,y).normalize(),n[5].setComponents(h-l,f-d,m-p,A-y).normalize();else if(n[4].setComponents(h-l,f-d,m-p,A-y).normalize(),e===Ti)n[5].setComponents(h+l,f+d,m+p,A+y).normalize();else if(e===Ps)n[5].setComponents(l,d,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),hn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),hn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(hn)}intersectsSprite(t){hn.center.set(0,0,0);const e=au.distanceTo(t.center);return hn.radius=.7071067811865476+e,hn.applyMatrix4(t.matrixWorld),this.intersectsSphere(hn)}intersectsSphere(t){const e=this.planes,i=t.center,n=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const n=e[i];if(ea.x=n.normal.x>0?t.max.x:t.min.x,ea.y=n.normal.y>0?t.max.y:t.min.y,ea.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(ea)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class lc extends yn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ct(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ea=new S,Aa=new S,zl=new Wt,fs=new Wo,ia=new es,cr=new S,Ol=new S;class ru extends ae{constructor(t=new Le,e=new lc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let n=1,a=e.count;n<a;n++)Ea.fromBufferAttribute(e,n-1),Aa.fromBufferAttribute(e,n),i[n]=i[n-1],i[n]+=Ea.distanceTo(Aa);t.setAttribute("lineDistance",new me(i,1))}else Nt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,n=this.matrixWorld,a=t.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ia.copy(i.boundingSphere),ia.applyMatrix4(n),ia.radius+=a,t.ray.intersectsSphere(ia)===!1)return;zl.copy(n).invert(),fs.copy(t.ray).applyMatrix4(zl);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,h=this.isLineSegments?2:1,c=i.index,d=i.attributes.position;if(c!==null){const f=Math.max(0,r.start),g=Math.min(c.count,r.start+r.count);for(let v=f,p=g-1;v<p;v+=h){const m=c.getX(v),b=c.getX(v+1),C=na(this,t,fs,l,m,b,v);C&&e.push(C)}if(this.isLineLoop){const v=c.getX(g-1),p=c.getX(f),m=na(this,t,fs,l,v,p,g-1);m&&e.push(m)}}else{const f=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let v=f,p=g-1;v<p;v+=h){const m=na(this,t,fs,l,v,v+1,v);m&&e.push(m)}if(this.isLineLoop){const v=na(this,t,fs,l,g-1,f,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=n.length;a<r;a++){const o=n[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function na(s,t,e,i,n,a,r){const o=s.geometry.attributes.position;if(Ea.fromBufferAttribute(o,n),Aa.fromBufferAttribute(o,a),e.distanceSqToSegment(Ea,Aa,cr,Ol)>i)return;cr.applyMatrix4(s.matrixWorld);const h=t.ray.origin.distanceTo(cr);if(!(h<t.near||h>t.far))return{distance:h,point:Ol.clone().applyMatrix4(s.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:s}}class hc extends qe{constructor(t=[],e=gn,i,n,a,r,o,l,h,c){super(t,e,i,n,a,r,o,l,h,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Vi extends qe{constructor(t,e,i,n,a,r,o,l,h){super(t,e,i,n,a,r,o,l,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Qn extends qe{constructor(t,e,i=Pi,n,a,r,o=ke,l=ke,h,c=Gi,u=1){if(c!==Gi&&c!==fn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,n,a,r,o,l,c,i,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Go(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ou extends Qn{constructor(t,e=Pi,i=gn,n,a,r=ke,o=ke,l,h=Gi){const c={width:t,height:t,depth:1},u=[c,c,c,c,c,c];super(t,t,e,i,n,a,r,o,l,h),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class cc extends qe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Rt extends Le{constructor(t=1,e=1,i=1,n=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:a,depthSegments:r};const o=this;n=Math.floor(n),a=Math.floor(a),r=Math.floor(r);const l=[],h=[],c=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,i,e,t,r,a,0),g("z","y","x",1,-1,i,e,-t,r,a,1),g("x","z","y",1,1,t,i,e,n,r,2),g("x","z","y",1,-1,t,i,-e,n,r,3),g("x","y","z",1,-1,t,e,i,n,a,4),g("x","y","z",-1,-1,t,e,-i,n,a,5),this.setIndex(l),this.setAttribute("position",new me(h,3)),this.setAttribute("normal",new me(c,3)),this.setAttribute("uv",new me(u,2));function g(v,p,m,b,C,y,A,M,R,_,E){const D=y/R,L=A/_,I=y/2,k=A/2,q=M/2,B=R+1,Y=_+1;let H=0,J=0;const et=new S;for(let at=0;at<Y;at++){const rt=at*L-k;for(let _t=0;_t<B;_t++){const Yt=_t*D-I;et[v]=Yt*b,et[p]=rt*C,et[m]=q,h.push(et.x,et.y,et.z),et[v]=0,et[p]=0,et[m]=M>0?1:-1,c.push(et.x,et.y,et.z),u.push(_t/R),u.push(1-at/_),H+=1}}for(let at=0;at<_;at++)for(let rt=0;rt<R;rt++){const _t=d+rt+B*at,Yt=d+rt+B*(at+1),Ot=d+(rt+1)+B*(at+1),Ut=d+(rt+1)+B*at;l.push(_t,Yt,Ut),l.push(Yt,Ot,Ut),J+=6}o.addGroup(f,J,E),f+=J,d+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rt(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class qo extends Le{constructor(t=1,e=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:n},e=Math.max(3,e);const a=[],r=[],o=[],l=[],h=new S,c=new gt;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*n;h.x=t*Math.cos(f),h.y=t*Math.sin(f),r.push(h.x,h.y,h.z),o.push(0,0,1),c.x=(r[d]/t+1)/2,c.y=(r[d+1]/t+1)/2,l.push(c.x,c.y)}for(let u=1;u<=e;u++)a.push(u,u+1,0);this.setIndex(a),this.setAttribute("position",new me(r,3)),this.setAttribute("normal",new me(o,3)),this.setAttribute("uv",new me(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ht extends Le{constructor(t=1,e=1,i=1,n=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const h=this;n=Math.floor(n),a=Math.floor(a);const c=[],u=[],d=[],f=[];let g=0;const v=[],p=i/2;let m=0;b(),r===!1&&(t>0&&C(!0),e>0&&C(!1)),this.setIndex(c),this.setAttribute("position",new me(u,3)),this.setAttribute("normal",new me(d,3)),this.setAttribute("uv",new me(f,2));function b(){const y=new S,A=new S;let M=0;const R=(e-t)/i;for(let _=0;_<=a;_++){const E=[],D=_/a,L=D*(e-t)+t;for(let I=0;I<=n;I++){const k=I/n,q=k*l+o,B=Math.sin(q),Y=Math.cos(q);A.x=L*B,A.y=-D*i+p,A.z=L*Y,u.push(A.x,A.y,A.z),y.set(B,R,Y).normalize(),d.push(y.x,y.y,y.z),f.push(k,1-D),E.push(g++)}v.push(E)}for(let _=0;_<n;_++)for(let E=0;E<a;E++){const D=v[E][_],L=v[E+1][_],I=v[E+1][_+1],k=v[E][_+1];(t>0||E!==0)&&(c.push(D,L,k),M+=3),(e>0||E!==a-1)&&(c.push(L,I,k),M+=3)}h.addGroup(m,M,0),m+=M}function C(y){const A=g,M=new gt,R=new S;let _=0;const E=y===!0?t:e,D=y===!0?1:-1;for(let I=1;I<=n;I++)u.push(0,p*D,0),d.push(0,D,0),f.push(.5,.5),g++;const L=g;for(let I=0;I<=n;I++){const q=I/n*l+o,B=Math.cos(q),Y=Math.sin(q);R.x=E*Y,R.y=p*D,R.z=E*B,u.push(R.x,R.y,R.z),d.push(0,D,0),M.x=B*.5+.5,M.y=Y*.5*D+.5,f.push(M.x,M.y),g++}for(let I=0;I<n;I++){const k=A+I,q=L+I;y===!0?c.push(q,q+1,k):c.push(q+1,q,k),_+=3}h.addGroup(m,_,y===!0?1:2),m+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ht(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Yo extends Ht{constructor(t=1,e=1,i=32,n=1,a=!1,r=0,o=Math.PI*2){super(0,t,e,i,n,a,r,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(t){return new Yo(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Be extends Le{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};const a=t/2,r=e/2,o=Math.floor(i),l=Math.floor(n),h=o+1,c=l+1,u=t/o,d=e/l,f=[],g=[],v=[],p=[];for(let m=0;m<c;m++){const b=m*d-r;for(let C=0;C<h;C++){const y=C*u-a;g.push(y,-b,0),v.push(0,0,1),p.push(C/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let b=0;b<o;b++){const C=b+h*m,y=b+h*(m+1),A=b+1+h*(m+1),M=b+1+h*m;f.push(C,y,M),f.push(y,A,M)}this.setIndex(f),this.setAttribute("position",new me(g,3)),this.setAttribute("normal",new me(v,3)),this.setAttribute("uv",new me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Be(t.width,t.height,t.widthSegments,t.heightSegments)}}class Pe extends Le{constructor(t=1,e=32,i=16,n=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:a,thetaStart:r,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(r+o,Math.PI);let h=0;const c=[],u=new S,d=new S,f=[],g=[],v=[],p=[];for(let m=0;m<=i;m++){const b=[],C=m/i,y=r+C*o,A=t*Math.cos(y),M=Math.sqrt(t*t-A*A);let R=0;m===0&&r===0?R=.5/e:m===i&&l===Math.PI&&(R=-.5/e);for(let _=0;_<=e;_++){const E=_/e,D=n+E*a;u.x=-M*Math.cos(D),u.y=A,u.z=M*Math.sin(D),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),p.push(E+R,1-C),b.push(h++)}c.push(b)}for(let m=0;m<i;m++)for(let b=0;b<e;b++){const C=c[m][b+1],y=c[m][b],A=c[m+1][b],M=c[m+1][b+1];(m!==0||r>0)&&f.push(C,y,M),(m!==i-1||l<Math.PI)&&f.push(y,A,M)}this.setIndex(f),this.setAttribute("position",new me(g,3)),this.setAttribute("normal",new me(v,3)),this.setAttribute("uv",new me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pe(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class mn extends Le{constructor(t=1,e=.4,i=12,n=48,a=Math.PI*2,r=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:n,arc:a,thetaStart:r,thetaLength:o},i=Math.floor(i),n=Math.floor(n);const l=[],h=[],c=[],u=[],d=new S,f=new S,g=new S;for(let v=0;v<=i;v++){const p=r+v/i*o;for(let m=0;m<=n;m++){const b=m/n*a;f.x=(t+e*Math.cos(p))*Math.cos(b),f.y=(t+e*Math.cos(p))*Math.sin(b),f.z=e*Math.sin(p),h.push(f.x,f.y,f.z),d.x=t*Math.cos(b),d.y=t*Math.sin(b),g.subVectors(f,d).normalize(),c.push(g.x,g.y,g.z),u.push(m/n),u.push(v/i)}}for(let v=1;v<=i;v++)for(let p=1;p<=n;p++){const m=(n+1)*v+p-1,b=(n+1)*(v-1)+p-1,C=(n+1)*(v-1)+p,y=(n+1)*v+p;l.push(m,b,y),l.push(b,C,y)}this.setIndex(l),this.setAttribute("position",new me(h,3)),this.setAttribute("normal",new me(c,3)),this.setAttribute("uv",new me(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}function jn(s){const t={};for(const e in s){t[e]={};for(const i in s[e]){const n=s[e][i];if(Bl(n))n.isRenderTargetTexture?(Nt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone();else if(Array.isArray(n))if(Bl(n[0])){const a=[];for(let r=0,o=n.length;r<o;r++)a[r]=n[r].clone();t[e][i]=a}else t[e][i]=n.slice();else t[e][i]=n}}return t}function $e(s){const t={};for(let e=0;e<s.length;e++){const i=jn(s[e]);for(const n in i)t[n]=i[n]}return t}function Bl(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function lu(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function dc(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Jt.workingColorSpace}const Ls={clone:jn,merge:$e};var hu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class re extends yn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=hu,this.fragmentShader=cu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=jn(t.uniforms),this.uniformsGroups=lu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const n in this.uniforms){const r=this.uniforms[n].value;r&&r.isTexture?e.uniforms[n]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[n]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[n]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[n]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[n]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[n]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[n]={type:"m4",value:r.toArray()}:e.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const i in t.uniforms){const n=t.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=e[n.value]||null;break;case"c":this.uniforms[i].value=new Ct().setHex(n.value);break;case"v2":this.uniforms[i].value=new gt().fromArray(n.value);break;case"v3":this.uniforms[i].value=new S().fromArray(n.value);break;case"v4":this.uniforms[i].value=new pe().fromArray(n.value);break;case"m3":this.uniforms[i].value=new Bt().fromArray(n.value);break;case"m4":this.uniforms[i].value=new Wt().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class uc extends re{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class zt extends yn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ct(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ct(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=vo,this.normalScale=new gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ze,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class du extends zt{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new gt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Kt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ct(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ct(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ct(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class uu extends yn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=od,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class fu extends yn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class La extends ae{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ct(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class fc extends La{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ae.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ct(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const dr=new Wt,kl=new S,Gl=new S;class $o{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new gt(512,512),this.mapType=si,this.map=null,this.mapPass=null,this.matrix=new Wt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xo,this._frameExtents=new gt(1,1),this._viewportCount=1,this._viewports=[new pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;kl.setFromMatrixPosition(t.matrixWorld),e.position.copy(kl),Gl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Gl),e.updateMatrixWorld(),dr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(dr,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===Ps||e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(dr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const sa=new S,aa=new xe,wi=new S;class pc extends ae{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Wt,this.projectionMatrix=new Wt,this.projectionMatrixInverse=new Wt,this.coordinateSystem=Ti,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(sa,aa,wi),wi.x===1&&wi.y===1&&wi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(sa,aa,wi.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(sa,aa,wi),wi.x===1&&wi.y===1&&wi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(sa,aa,wi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Ji=new S,Vl=new gt,Hl=new gt;class We extends pc{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Jn*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Es*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Jn*2*Math.atan(Math.tan(Es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ji.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ji.x,Ji.y).multiplyScalar(-t/Ji.z),Ji.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ji.x,Ji.y).multiplyScalar(-t/Ji.z)}getViewSize(t,e){return this.getViewBounds(t,Vl,Hl),e.subVectors(Hl,Vl)}setViewOffset(t,e,i,n,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Es*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,a=-.5*n;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,h=r.fullHeight;a+=r.offsetX*n/l,e-=r.offsetY*i/h,n*=r.width/l,i*=r.height/h}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+n,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class pu extends $o{constructor(){super(new We(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,i=Jn*2*t.angle*this.focus,n=this.mapSize.width/this.mapSize.height*this.aspect,a=t.distance||e.far;(i!==e.fov||n!==e.aspect||a!==e.far)&&(e.fov=i,e.aspect=n,e.far=a,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class mu extends La{constructor(t,e,i=0,n=Math.PI/3,a=0,r=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ae.DEFAULT_UP),this.updateMatrix(),this.target=new ae,this.distance=i,this.angle=n,this.penumbra=a,this.decay=r,this.map=null,this.shadow=new pu}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class gu extends $o{constructor(){super(new We(90,1,.5,500)),this.isPointLightShadow=!0}}class mc extends La{constructor(t,e,i=0,n=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new gu}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class Da extends pc{constructor(t=-1,e=1,i=1,n=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let a=i-t,r=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=h*this.view.offsetX,r=a+h*this.view.width,o-=c*this.view.offsetY,l=o-c*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class vu extends $o{constructor(){super(new Da(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ws extends La{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ae.DEFAULT_UP),this.updateMatrix(),this.target=new ae,this.shadow=new vu}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class Ko extends Le{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}const Gn=-90,Vn=1;class _u extends ae{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new We(Gn,Vn,t,e);n.layers=this.layers,this.add(n);const a=new We(Gn,Vn,t,e);a.layers=this.layers,this.add(a);const r=new We(Gn,Vn,t,e);r.layers=this.layers,this.add(r);const o=new We(Gn,Vn,t,e);o.layers=this.layers,this.add(o);const l=new We(Gn,Vn,t,e);l.layers=this.layers,this.add(l);const h=new We(Gn,Vn,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,n,a,r,o,l]=e;for(const h of e)this.remove(h);if(t===Ti)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ps)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,h,c]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(i,0,n),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,1,n),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,2,n),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,3,n),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,n),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,n),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),t.setRenderTarget(u,d,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class xu extends We{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class yu{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Mu.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Mu(){this._document.hidden===!1&&this.reset()}const Wl=new Wt;class Zo{constructor(t,e,i=0,n=1/0){this.ray=new Wo(t,e),this.near=i,this.far=n,this.camera=null,this.layers=new Vo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Qt("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Wl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Wl),this}intersectObject(t,e=!0,i=[]){return yo(t,this,i,e),i.sort(Xl),i}intersectObjects(t,e=!0,i=[]){for(let n=0,a=t.length;n<a;n++)yo(t[n],this,i,e);return i.sort(Xl),i}}function Xl(s,t){return s.distance-t.distance}function yo(s,t,e,i){let n=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(n=!1),n===!0&&i===!0){const a=s.children;for(let r=0,o=a.length;r<o;r++)yo(a[r],t,e,!0)}}const il=class il{constructor(t,e,i,n){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,n)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,n){const a=this.elements;return a[0]=t,a[2]=e,a[1]=i,a[3]=n,this}};il.prototype.isMatrix2=!0;let ql=il;function Yl(s,t,e,i){const n=wu(i);switch(e){case Qh:return s*t;case Uo:return s*t/n.components*n.byteLength;case Fo:return s*t/n.components*n.byteLength;case vn:return s*t*2/n.components*n.byteLength;case No:return s*t*2/n.components*n.byteLength;case jh:return s*t*3/n.components*n.byteLength;case Ke:return s*t*4/n.components*n.byteLength;case zo:return s*t*4/n.components*n.byteLength;case fa:case pa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ma:case ga:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Gr:case Hr:return Math.max(s,16)*Math.max(t,8)/4;case kr:case Vr:return Math.max(s,8)*Math.max(t,8)/2;case Wr:case Xr:case Yr:case $r:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case qr:case xa:case Kr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Zr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Jr:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Qr:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case jr:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case to:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case eo:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case io:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case no:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case so:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case ao:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case ro:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case oo:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case lo:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case ho:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case co:case uo:case fo:return Math.ceil(s/4)*Math.ceil(t/4)*16;case po:case mo:return Math.ceil(s/4)*Math.ceil(t/4)*8;case ya:case go:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function wu(s){switch(s){case si:case $h:return{byteLength:1,components:1};case Rs:case Kh:case je:return{byteLength:2,components:1};case Do:case Io:return{byteLength:2,components:4};case Pi:case Lo:case vi:return{byteLength:4,components:1};case Zh:case Jh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:bo}}));typeof window<"u"&&(window.__THREE__?Nt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=bo);function gc(){let s=null,t=!1,e=null,i=null;function n(a,r){e(a,r),i=s.requestAnimationFrame(n)}return{start:function(){t!==!0&&e!==null&&s!==null&&(i=s.requestAnimationFrame(n),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){s=a}}}function Su(s){const t=new WeakMap;function e(o,l){const h=o.array,c=o.usage,u=h.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,h,c),o.onUploadCallback();let f;if(h instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)f=s.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(h instanceof Int16Array)f=s.SHORT;else if(h instanceof Uint32Array)f=s.UNSIGNED_INT;else if(h instanceof Int32Array)f=s.INT;else if(h instanceof Int8Array)f=s.BYTE;else if(h instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:f,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,h){const c=l.array,u=l.updateRanges;if(s.bindBuffer(h,o),u.length===0)s.bufferSubData(h,0,c);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];s.bufferSubData(h,v.start*c.BYTES_PER_ELEMENT,c,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const c=t.get(o);(!c||c.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=t.get(o);if(h===void 0)t.set(o,e(o,l));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,l),h.version=o.version}}return{get:n,remove:a,update:r}}var bu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Tu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Eu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Au=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ru=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Lu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Du=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Iu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Uu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Fu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Nu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,zu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ou=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Bu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ku=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Gu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Wu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Xu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,qu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Yu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,$u=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ku=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Zu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ju=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Qu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ju=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,tf="gl_FragColor = linearToOutputTexel( gl_FragColor );",ef=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,nf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,sf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,af=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,rf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,of=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,lf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,hf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,cf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,df=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,uf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ff=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,pf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,mf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,gf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,vf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,_f=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,xf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,yf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Mf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,wf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Sf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,bf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Tf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ef=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Af=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Rf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Cf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Df=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,If=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Uf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ff=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Of=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Bf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,kf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Vf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Hf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Wf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Xf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,$f=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Kf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Jf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Qf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,jf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,ep=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ip=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,np=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ap=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,rp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,op=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,lp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,hp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,cp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,dp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,up=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,fp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,pp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,mp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,_p=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,xp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,yp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Mp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Sp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,bp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Tp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ep=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ap=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Dp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ip=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Up=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Fp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Np=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Op=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Bp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,kp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Wp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,qp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Yp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$p=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Zp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,t0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,e0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,i0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,n0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,s0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xt={alphahash_fragment:bu,alphahash_pars_fragment:Tu,alphamap_fragment:Eu,alphamap_pars_fragment:Au,alphatest_fragment:Ru,alphatest_pars_fragment:Cu,aomap_fragment:Pu,aomap_pars_fragment:Lu,batching_pars_vertex:Du,batching_vertex:Iu,begin_vertex:Uu,beginnormal_vertex:Fu,bsdfs:Nu,iridescence_fragment:zu,bumpmap_pars_fragment:Ou,clipping_planes_fragment:Bu,clipping_planes_pars_fragment:ku,clipping_planes_pars_vertex:Gu,clipping_planes_vertex:Vu,color_fragment:Hu,color_pars_fragment:Wu,color_pars_vertex:Xu,color_vertex:qu,common:Yu,cube_uv_reflection_fragment:$u,defaultnormal_vertex:Ku,displacementmap_pars_vertex:Zu,displacementmap_vertex:Ju,emissivemap_fragment:Qu,emissivemap_pars_fragment:ju,colorspace_fragment:tf,colorspace_pars_fragment:ef,envmap_fragment:nf,envmap_common_pars_fragment:sf,envmap_pars_fragment:af,envmap_pars_vertex:rf,envmap_physical_pars_fragment:vf,envmap_vertex:of,fog_vertex:lf,fog_pars_vertex:hf,fog_fragment:cf,fog_pars_fragment:df,gradientmap_pars_fragment:uf,lightmap_pars_fragment:ff,lights_lambert_fragment:pf,lights_lambert_pars_fragment:mf,lights_pars_begin:gf,lights_toon_fragment:_f,lights_toon_pars_fragment:xf,lights_phong_fragment:yf,lights_phong_pars_fragment:Mf,lights_physical_fragment:wf,lights_physical_pars_fragment:Sf,lights_fragment_begin:bf,lights_fragment_maps:Tf,lights_fragment_end:Ef,lightprobes_pars_fragment:Af,logdepthbuf_fragment:Rf,logdepthbuf_pars_fragment:Cf,logdepthbuf_pars_vertex:Pf,logdepthbuf_vertex:Lf,map_fragment:Df,map_pars_fragment:If,map_particle_fragment:Uf,map_particle_pars_fragment:Ff,metalnessmap_fragment:Nf,metalnessmap_pars_fragment:zf,morphinstance_vertex:Of,morphcolor_vertex:Bf,morphnormal_vertex:kf,morphtarget_pars_vertex:Gf,morphtarget_vertex:Vf,normal_fragment_begin:Hf,normal_fragment_maps:Wf,normal_pars_fragment:Xf,normal_pars_vertex:qf,normal_vertex:Yf,normalmap_pars_fragment:$f,clearcoat_normal_fragment_begin:Kf,clearcoat_normal_fragment_maps:Zf,clearcoat_pars_fragment:Jf,iridescence_pars_fragment:Qf,opaque_fragment:jf,packing:tp,premultiplied_alpha_fragment:ep,project_vertex:ip,dithering_fragment:np,dithering_pars_fragment:sp,roughnessmap_fragment:ap,roughnessmap_pars_fragment:rp,shadowmap_pars_fragment:op,shadowmap_pars_vertex:lp,shadowmap_vertex:hp,shadowmask_pars_fragment:cp,skinbase_vertex:dp,skinning_pars_vertex:up,skinning_vertex:fp,skinnormal_vertex:pp,specularmap_fragment:mp,specularmap_pars_fragment:gp,tonemapping_fragment:vp,tonemapping_pars_fragment:_p,transmission_fragment:xp,transmission_pars_fragment:yp,uv_pars_fragment:Mp,uv_pars_vertex:wp,uv_vertex:Sp,worldpos_vertex:bp,background_vert:Tp,background_frag:Ep,backgroundCube_vert:Ap,backgroundCube_frag:Rp,cube_vert:Cp,cube_frag:Pp,depth_vert:Lp,depth_frag:Dp,distance_vert:Ip,distance_frag:Up,equirect_vert:Fp,equirect_frag:Np,linedashed_vert:zp,linedashed_frag:Op,meshbasic_vert:Bp,meshbasic_frag:kp,meshlambert_vert:Gp,meshlambert_frag:Vp,meshmatcap_vert:Hp,meshmatcap_frag:Wp,meshnormal_vert:Xp,meshnormal_frag:qp,meshphong_vert:Yp,meshphong_frag:$p,meshphysical_vert:Kp,meshphysical_frag:Zp,meshtoon_vert:Jp,meshtoon_frag:Qp,points_vert:jp,points_frag:t0,shadow_vert:e0,shadow_frag:i0,sprite_vert:n0,sprite_frag:s0},ft={common:{diffuse:{value:new Ct(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Bt}},envmap:{envMap:{value:null},envMapRotation:{value:new Bt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Bt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Bt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Bt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Bt},normalScale:{value:new gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Bt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Bt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Bt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Bt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ct(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new S},probesMax:{value:new S},probesResolution:{value:new S}},points:{diffuse:{value:new Ct(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0},uvTransform:{value:new Bt}},sprite:{diffuse:{value:new Ct(16777215)},opacity:{value:1},center:{value:new gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}}},bi={basic:{uniforms:$e([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:$e([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Ct(0)},envMapIntensity:{value:1}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:$e([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Ct(0)},specular:{value:new Ct(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:$e([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new Ct(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:$e([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new Ct(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:$e([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:$e([ft.points,ft.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:$e([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:$e([ft.common,ft.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:$e([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:$e([ft.sprite,ft.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Bt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Bt}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distance:{uniforms:$e([ft.common,ft.displacementmap,{referencePosition:{value:new S},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distance_vert,fragmentShader:Xt.distance_frag},shadow:{uniforms:$e([ft.lights,ft.fog,{color:{value:new Ct(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};bi.physical={uniforms:$e([bi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Bt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Bt},clearcoatNormalScale:{value:new gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Bt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Bt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Bt},sheen:{value:0},sheenColor:{value:new Ct(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Bt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Bt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Bt},transmissionSamplerSize:{value:new gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Bt},attenuationDistance:{value:0},attenuationColor:{value:new Ct(0)},specularColor:{value:new Ct(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Bt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Bt},anisotropyVector:{value:new gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Bt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const ra={r:0,b:0,g:0},a0=new Wt,vc=new Bt;vc.set(-1,0,0,0,1,0,0,0,1);function r0(s,t,e,i,n,a){const r=new Ct(0);let o=n===!0?0:1,l,h,c=null,u=0,d=null;function f(b){let C=b.isScene===!0?b.background:null;if(C&&C.isTexture){const y=b.backgroundBlurriness>0;C=t.get(C,y)}return C}function g(b){let C=!1;const y=f(b);y===null?p(r,o):y&&y.isColor&&(p(y,1),C=!0);const A=s.xr.getEnvironmentBlendMode();A==="additive"?e.buffers.color.setClear(0,0,0,1,a):A==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,a),(s.autoClear||C)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(b,C){const y=f(C);y&&(y.isCubeTexture||y.mapping===Pa)?(h===void 0&&(h=new U(new Rt(1,1,1),new re({name:"BackgroundCubeMaterial",uniforms:jn(bi.backgroundCube.uniforms),vertexShader:bi.backgroundCube.vertexShader,fragmentShader:bi.backgroundCube.fragmentShader,side:Xe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,M,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=y,h.material.uniforms.backgroundBlurriness.value=C.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(a0.makeRotationFromEuler(C.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&h.material.uniforms.backgroundRotation.value.premultiply(vc),h.material.toneMapped=Jt.getTransfer(y.colorSpace)!==ie,(c!==y||u!==y.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,c=y,u=y.version,d=s.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new U(new Be(2,2),new re({name:"BackgroundMaterial",uniforms:jn(bi.background.uniforms),vertexShader:bi.background.vertexShader,fragmentShader:bi.background.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,l.material.toneMapped=Jt.getTransfer(y.colorSpace)!==ie,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(c!==y||u!==y.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,c=y,u=y.version,d=s.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,C){b.getRGB(ra,dc(s)),e.buffers.color.setClear(ra.r,ra.g,ra.b,C,a)}function m(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(b,C=1){r.set(b),o=C,p(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,p(r,o)},render:g,addToRenderList:v,dispose:m}}function o0(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=d(null);let a=n,r=!1;function o(L,I,k,q,B){let Y=!1;const H=u(L,q,k,I);a!==H&&(a=H,h(a.object)),Y=f(L,q,k,B),Y&&g(L,q,k,B),B!==null&&t.update(B,s.ELEMENT_ARRAY_BUFFER),(Y||r)&&(r=!1,y(L,I,k,q),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return s.createVertexArray()}function h(L){return s.bindVertexArray(L)}function c(L){return s.deleteVertexArray(L)}function u(L,I,k,q){const B=q.wireframe===!0;let Y=i[I.id];Y===void 0&&(Y={},i[I.id]=Y);const H=L.isInstancedMesh===!0?L.id:0;let J=Y[H];J===void 0&&(J={},Y[H]=J);let et=J[k.id];et===void 0&&(et={},J[k.id]=et);let at=et[B];return at===void 0&&(at=d(l()),et[B]=at),at}function d(L){const I=[],k=[],q=[];for(let B=0;B<e;B++)I[B]=0,k[B]=0,q[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:k,attributeDivisors:q,object:L,attributes:{},index:null}}function f(L,I,k,q){const B=a.attributes,Y=I.attributes;let H=0;const J=k.getAttributes();for(const et in J)if(J[et].location>=0){const rt=B[et];let _t=Y[et];if(_t===void 0&&(et==="instanceMatrix"&&L.instanceMatrix&&(_t=L.instanceMatrix),et==="instanceColor"&&L.instanceColor&&(_t=L.instanceColor)),rt===void 0||rt.attribute!==_t||_t&&rt.data!==_t.data)return!0;H++}return a.attributesNum!==H||a.index!==q}function g(L,I,k,q){const B={},Y=I.attributes;let H=0;const J=k.getAttributes();for(const et in J)if(J[et].location>=0){let rt=Y[et];rt===void 0&&(et==="instanceMatrix"&&L.instanceMatrix&&(rt=L.instanceMatrix),et==="instanceColor"&&L.instanceColor&&(rt=L.instanceColor));const _t={};_t.attribute=rt,rt&&rt.data&&(_t.data=rt.data),B[et]=_t,H++}a.attributes=B,a.attributesNum=H,a.index=q}function v(){const L=a.newAttributes;for(let I=0,k=L.length;I<k;I++)L[I]=0}function p(L){m(L,0)}function m(L,I){const k=a.newAttributes,q=a.enabledAttributes,B=a.attributeDivisors;k[L]=1,q[L]===0&&(s.enableVertexAttribArray(L),q[L]=1),B[L]!==I&&(s.vertexAttribDivisor(L,I),B[L]=I)}function b(){const L=a.newAttributes,I=a.enabledAttributes;for(let k=0,q=I.length;k<q;k++)I[k]!==L[k]&&(s.disableVertexAttribArray(k),I[k]=0)}function C(L,I,k,q,B,Y,H){H===!0?s.vertexAttribIPointer(L,I,k,B,Y):s.vertexAttribPointer(L,I,k,q,B,Y)}function y(L,I,k,q){v();const B=q.attributes,Y=k.getAttributes(),H=I.defaultAttributeValues;for(const J in Y){const et=Y[J];if(et.location>=0){let at=B[J];if(at===void 0&&(J==="instanceMatrix"&&L.instanceMatrix&&(at=L.instanceMatrix),J==="instanceColor"&&L.instanceColor&&(at=L.instanceColor)),at!==void 0){const rt=at.normalized,_t=at.itemSize,Yt=t.get(at);if(Yt===void 0)continue;const Ot=Yt.buffer,Ut=Yt.type,Z=Yt.bytesPerElement,st=Ut===s.INT||Ut===s.UNSIGNED_INT||at.gpuType===Lo;if(at.isInterleavedBufferAttribute){const it=at.data,Mt=it.stride,Tt=at.offset;if(it.isInstancedInterleavedBuffer){for(let Et=0;Et<et.locationSize;Et++)m(et.location+Et,it.meshPerAttribute);L.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let Et=0;Et<et.locationSize;Et++)p(et.location+Et);s.bindBuffer(s.ARRAY_BUFFER,Ot);for(let Et=0;Et<et.locationSize;Et++)C(et.location+Et,_t/et.locationSize,Ut,rt,Mt*Z,(Tt+_t/et.locationSize*Et)*Z,st)}else{if(at.isInstancedBufferAttribute){for(let it=0;it<et.locationSize;it++)m(et.location+it,at.meshPerAttribute);L.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let it=0;it<et.locationSize;it++)p(et.location+it);s.bindBuffer(s.ARRAY_BUFFER,Ot);for(let it=0;it<et.locationSize;it++)C(et.location+it,_t/et.locationSize,Ut,rt,_t*Z,_t/et.locationSize*it*Z,st)}}else if(H!==void 0){const rt=H[J];if(rt!==void 0)switch(rt.length){case 2:s.vertexAttrib2fv(et.location,rt);break;case 3:s.vertexAttrib3fv(et.location,rt);break;case 4:s.vertexAttrib4fv(et.location,rt);break;default:s.vertexAttrib1fv(et.location,rt)}}}}b()}function A(){E();for(const L in i){const I=i[L];for(const k in I){const q=I[k];for(const B in q){const Y=q[B];for(const H in Y)c(Y[H].object),delete Y[H];delete q[B]}}delete i[L]}}function M(L){if(i[L.id]===void 0)return;const I=i[L.id];for(const k in I){const q=I[k];for(const B in q){const Y=q[B];for(const H in Y)c(Y[H].object),delete Y[H];delete q[B]}}delete i[L.id]}function R(L){for(const I in i){const k=i[I];for(const q in k){const B=k[q];if(B[L.id]===void 0)continue;const Y=B[L.id];for(const H in Y)c(Y[H].object),delete Y[H];delete B[L.id]}}}function _(L){for(const I in i){const k=i[I],q=L.isInstancedMesh===!0?L.id:0,B=k[q];if(B!==void 0){for(const Y in B){const H=B[Y];for(const J in H)c(H[J].object),delete H[J];delete B[Y]}delete k[q],Object.keys(k).length===0&&delete i[I]}}}function E(){D(),r=!0,a!==n&&(a=n,h(a.object))}function D(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:E,resetDefaultState:D,dispose:A,releaseStatesOfGeometry:M,releaseStatesOfObject:_,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:p,disableUnusedAttributes:b}}function l0(s,t,e){let i;function n(l){i=l}function a(l,h){s.drawArrays(i,l,h),e.update(h,i,1)}function r(l,h,c){c!==0&&(s.drawArraysInstanced(i,l,h,c),e.update(h,i,c))}function o(l,h,c){if(c===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,c);let d=0;for(let f=0;f<c;f++)d+=h[f];e.update(d,i,1)}this.setMode=n,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function h0(s,t,e,i){let n;function a(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(R){return!(R!==Ke&&i.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const _=R===je&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==si&&i.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==vi&&!_)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp";const c=l(h);c!==h&&(Nt("WebGLRenderer:",h,"not supported, using",c,"instead."),h=c);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&d===!1&&Nt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),b=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),C=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),A=s.getParameter(s.MAX_SAMPLES),M=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:b,maxVaryings:C,maxFragmentUniforms:y,maxSamples:A,samples:M}}function c0(s){const t=this;let e=null,i=0,n=!1,a=!1;const r=new cn,o=new Bt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||n;return n=d,i=u.length,f},this.beginShadows=function(){a=!0,c(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,d){e=c(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,p=u.clipShadows,m=s.get(u);if(!n||g===null||g.length===0||a&&!p)a?c(null):h();else{const b=a?0:i,C=b*4;let y=m.clippingState||null;l.value=y,y=c(g,d,C,f);for(let A=0;A!==C;++A)y[A]=e[A];m.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function h(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function c(u,d,f,g){const v=u!==null?u.length:0;let p=null;if(v!==0){if(p=l.value,g!==!0||p===null){const m=f+v*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(p===null||p.length<m)&&(p=new Float32Array(m));for(let C=0,y=f;C!==v;++C,y+=4)r.copy(u[C]).applyMatrix4(b,o),r.normal.toArray(p,y),p[y+3]=r.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}const tn=4,$l=[.125,.215,.35,.446,.526,.582],un=20,d0=256,ps=new Da,Kl=new Ct;let ur=null,fr=0,pr=0,mr=!1;const u0=new S;class Mo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,n=100,a={}){const{size:r=256,position:o=u0}=a;ur=this._renderer.getRenderTarget(),fr=this._renderer.getActiveCubeFace(),pr=this._renderer.getActiveMipmapLevel(),mr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,n,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ql(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ur,fr,pr),this._renderer.xr.enabled=mr,t.scissorTest=!1,Hn(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===gn||t.mapping===Zn?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ur=this._renderer.getRenderTarget(),fr=this._renderer.getActiveCubeFace(),pr=this._renderer.getActiveMipmapLevel(),mr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Re,minFilter:Re,generateMipmaps:!1,type:je,format:Ke,colorSpace:Ma,depthBuffer:!1},n=Zl(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Zl(t,e,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=f0(a)),this._blurMaterial=m0(a,t,e),this._ggxMaterial=p0(a,t,e)}return n}_compileMaterial(t){const e=new U(new Le,t);this._renderer.compile(e,ps)}_sceneToCubeUV(t,e,i,n,a){const l=new We(90,1,e,i),h=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Kl),u.toneMapping=Ri,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(n),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new U(new Rt,new Ei({name:"PMREM.Background",side:Xe,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,p=v.material;let m=!1;const b=t.background;b?b.isColor&&(p.color.copy(b),t.background=null,m=!0):(p.color.copy(Kl),m=!0);for(let C=0;C<6;C++){const y=C%3;y===0?(l.up.set(0,h[C],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+c[C],a.y,a.z)):y===1?(l.up.set(0,0,h[C]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+c[C],a.z)):(l.up.set(0,h[C],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+c[C]));const A=this._cubeSize;Hn(n,y*A,C>2?A:0,A,A),u.setRenderTarget(n),m&&u.render(v,l),u.render(t,l)}u.toneMapping=f,u.autoClear=d,t.background=b}_textureToCubeUV(t,e){const i=this._renderer,n=t.mapping===gn||t.mapping===Zn;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ql()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Jl());const a=n?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;const o=a.uniforms;o.envMap.value=t;const l=this._cubeSize;Hn(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(r,ps)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const n=this._lodMeshes.length;for(let a=1;a<n;a++)this._applyGGXFilter(t,a-1,a);e.autoClear=i}_applyGGXFilter(t,e,i){const n=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;const l=r.uniforms,h=i/(this._lodMeshes.length-1),c=e/(this._lodMeshes.length-1),u=Math.sqrt(h*h-c*c),d=0+h*1.25,f=u*d,{_lodMax:g}=this,v=this._sizeLods[i],p=3*v*(i>g-tn?i-g+tn:0),m=4*(this._cubeSize-v);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=g-e,Hn(a,p,m,3*v,2*v),n.setRenderTarget(a),n.render(o,ps),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=g-i,Hn(t,p,m,3*v,2*v),n.setRenderTarget(t),n.render(o,ps)}_blur(t,e,i,n,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,i,n,"latitudinal",a),this._halfBlur(r,t,i,i,n,"longitudinal",a)}_halfBlur(t,e,i,n,a,r,o){const l=this._renderer,h=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&Qt("blur direction must be either latitudinal or longitudinal!");const c=3,u=this._lodMeshes[n];u.material=h;const d=h.uniforms,f=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*f):2*Math.PI/(2*un-1),v=a/g,p=isFinite(a)?1+Math.floor(c*v):un;p>un&&Nt(`sigmaRadians, ${a}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${un}`);const m=[];let b=0;for(let R=0;R<un;++R){const _=R/v,E=Math.exp(-_*_/2);m.push(E),R===0?b+=E:R<p&&(b+=2*E)}for(let R=0;R<m.length;R++)m[R]=m[R]/b;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=r==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:C}=this;d.dTheta.value=g,d.mipInt.value=C-i;const y=this._sizeLods[n],A=3*y*(n>C-tn?n-C+tn:0),M=4*(this._cubeSize-y);Hn(e,A,M,3*y,2*y),l.setRenderTarget(e),l.render(u,ps)}}function f0(s){const t=[],e=[],i=[];let n=s;const a=s-tn+1+$l.length;for(let r=0;r<a;r++){const o=Math.pow(2,n);t.push(o);let l=1/o;r>s-tn?l=$l[r-s+tn-1]:r===0&&(l=0),e.push(l);const h=1/(o-2),c=-h,u=1+h,d=[c,c,u,c,u,u,c,c,u,u,c,u],f=6,g=6,v=3,p=2,m=1,b=new Float32Array(v*g*f),C=new Float32Array(p*g*f),y=new Float32Array(m*g*f);for(let M=0;M<f;M++){const R=M%3*2/3-1,_=M>2?0:-1,E=[R,_,0,R+2/3,_,0,R+2/3,_+1,0,R,_,0,R+2/3,_+1,0,R,_+1,0];b.set(E,v*g*M),C.set(d,p*g*M);const D=[M,M,M,M,M,M];y.set(D,m*g*M)}const A=new Le;A.setAttribute("position",new ti(b,v)),A.setAttribute("uv",new ti(C,p)),A.setAttribute("faceIndex",new ti(y,m)),i.push(new U(A,null)),n>tn&&n--}return{lodMeshes:i,sizeLods:t,sigmas:e}}function Zl(s,t,e){const i=new Ze(s,t,e);return i.texture.mapping=Pa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Hn(s,t,e,i,n){s.viewport.set(t,e,i,n),s.scissor.set(t,e,i,n)}function p0(s,t,e){return new re({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:d0,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ia(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function m0(s,t,e){const i=new Float32Array(un),n=new S(0,1,0);return new re({name:"SphericalGaussianBlur",defines:{n:un,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:Ia(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Jl(){return new re({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ia(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Ql(){return new re({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ia(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Ia(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class _c extends Ze{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new hc(n),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new Rt(5,5,5),a=new re({name:"CubemapFromEquirect",uniforms:jn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Xe,blending:Ai});a.uniforms.tEquirect.value=e;const r=new U(n,a),o=e.minFilter;return e.minFilter===gi&&(e.minFilter=Re),new _u(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e=!0,i=!0,n=!0){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,i,n);t.setRenderTarget(a)}}function g0(s){let t=new WeakMap,e=new WeakMap,i=null;function n(d,f=!1){return d==null?null:f?r(d):a(d)}function a(d){if(d&&d.isTexture){const f=d.mapping;if(f===Oa||f===Ba)if(t.has(d)){const g=t.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const v=new _c(g.height);return v.fromEquirectangularTexture(s,d),t.set(d,v),d.addEventListener("dispose",h),o(v.texture,d.mapping)}else return null}}return d}function r(d){if(d&&d.isTexture){const f=d.mapping,g=f===Oa||f===Ba,v=f===gn||f===Zn;if(g||v){let p=e.get(d);const m=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return i===null&&(i=new Mo(s)),p=g?i.fromEquirectangular(d,p):i.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,e.set(d,p),p.texture;if(p!==void 0)return p.texture;{const b=d.image;return g&&b&&b.height>0||v&&b&&l(b)?(i===null&&(i=new Mo(s)),p=g?i.fromEquirectangular(d):i.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,e.set(d,p),d.addEventListener("dispose",c),p.texture):null}}}return d}function o(d,f){return f===Oa?d.mapping=gn:f===Ba&&(d.mapping=Zn),d}function l(d){let f=0;const g=6;for(let v=0;v<g;v++)d[v]!==void 0&&f++;return f===g}function h(d){const f=d.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function c(d){const f=d.target;f.removeEventListener("dispose",c);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function u(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:u}}function v0(s){const t={};function e(i){if(t[i]!==void 0)return t[i];const n=s.getExtension(i);return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const n=e(i);return n===null&&qn("WebGLRenderer: "+i+" extension not supported."),n}}}function _0(s,t,e,i){const n={},a=new WeakMap;function r(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",r),delete n[d.id];const f=a.get(d);f&&(t.remove(f),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return n[d.id]===!0||(d.addEventListener("dispose",r),n[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)t.update(d[f],s.ARRAY_BUFFER)}function h(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(g===void 0)return;if(f!==null){const b=f.array;v=f.version;for(let C=0,y=b.length;C<y;C+=3){const A=b[C+0],M=b[C+1],R=b[C+2];d.push(A,M,M,R,R,A)}}else{const b=g.array;v=g.version;for(let C=0,y=b.length/3-1;C<y;C+=3){const A=C+0,M=C+1,R=C+2;d.push(A,M,M,R,R,A)}}const p=new(g.count>=65535?sc:nc)(d,1);p.version=v;const m=a.get(u);m&&t.remove(m),a.set(u,p)}function c(u){const d=a.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&h(u)}else h(u);return a.get(u)}return{get:o,update:l,getWireframeAttribute:c}}function x0(s,t,e){let i;function n(u){i=u}let a,r;function o(u){a=u.type,r=u.bytesPerElement}function l(u,d){s.drawElements(i,d,a,u*r),e.update(d,i,1)}function h(u,d,f){f!==0&&(s.drawElementsInstanced(i,d,a,u*r,f),e.update(d,i,f))}function c(u,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,a,u,0,f);let v=0;for(let p=0;p<f;p++)v+=d[p];e.update(v,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=h,this.renderMultiDraw=c}function y0(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(e.calls++,r){case s.TRIANGLES:e.triangles+=o*(a/3);break;case s.LINES:e.lines+=o*(a/2);break;case s.LINE_STRIP:e.lines+=o*(a-1);break;case s.LINE_LOOP:e.lines+=o*a;break;case s.POINTS:e.points+=o*a;break;default:Qt("WebGLInfo: Unknown draw mode:",r);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function M0(s,t,e){const i=new WeakMap,n=new pe;function a(r,o,l){const h=r.morphTargetInfluences,c=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=c!==void 0?c.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let D=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",D)};var f=D;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],C=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),p===!0&&(y=3);let A=o.attributes.position.count*y,M=1;A>t.maxTextureSize&&(M=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);const R=new Float32Array(A*M*4*u),_=new ec(R,A,M,u);_.type=vi,_.needsUpdate=!0;const E=y*4;for(let L=0;L<u;L++){const I=m[L],k=b[L],q=C[L],B=A*M*4*L;for(let Y=0;Y<I.count;Y++){const H=Y*E;g===!0&&(n.fromBufferAttribute(I,Y),R[B+H+0]=n.x,R[B+H+1]=n.y,R[B+H+2]=n.z,R[B+H+3]=0),v===!0&&(n.fromBufferAttribute(k,Y),R[B+H+4]=n.x,R[B+H+5]=n.y,R[B+H+6]=n.z,R[B+H+7]=0),p===!0&&(n.fromBufferAttribute(q,Y),R[B+H+8]=n.x,R[B+H+9]=n.y,R[B+H+10]=n.z,R[B+H+11]=q.itemSize===4?n.w:1)}}d={count:u,texture:_,size:new gt(A,M)},i.set(o,d),o.addEventListener("dispose",D)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",r.morphTexture,e);else{let g=0;for(let p=0;p<h.length;p++)g+=h[p];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",v),l.getUniforms().setValue(s,"morphTargetInfluences",h)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:a}}function w0(s,t,e,i,n){let a=new WeakMap;function r(h){const c=n.render.frame,u=h.geometry,d=t.get(h,u);if(a.get(d)!==c&&(t.update(d),a.set(d,c)),h.isInstancedMesh&&(h.hasEventListener("dispose",l)===!1&&h.addEventListener("dispose",l),a.get(h)!==c&&(e.update(h.instanceMatrix,s.ARRAY_BUFFER),h.instanceColor!==null&&e.update(h.instanceColor,s.ARRAY_BUFFER),a.set(h,c))),h.isSkinnedMesh){const f=h.skeleton;a.get(f)!==c&&(f.update(),a.set(f,c))}return d}function o(){a=new WeakMap}function l(h){const c=h.target;c.removeEventListener("dispose",l),i.releaseStatesOfObject(c),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}const S0={[To]:"LINEAR_TONE_MAPPING",[Eo]:"REINHARD_TONE_MAPPING",[Ao]:"CINEON_TONE_MAPPING",[Ca]:"ACES_FILMIC_TONE_MAPPING",[Co]:"AGX_TONE_MAPPING",[Po]:"NEUTRAL_TONE_MAPPING",[Ro]:"CUSTOM_TONE_MAPPING"};function b0(s,t,e,i,n,a){const r=new Ze(t,e,{type:s,depthBuffer:n,stencilBuffer:a,samples:i?4:0,depthTexture:n?new Qn(t,e):void 0}),o=new Ze(t,e,{type:je,depthBuffer:!1,stencilBuffer:!1}),l=new Le;l.setAttribute("position",new me([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new me([0,2,0,0,2,0],2));const h=new uc({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new U(l,h),u=new Da(-1,1,1,-1,0,1);let d=null,f=null,g=!1,v,p=null,m=[],b=!1;this.setSize=function(C,y){r.setSize(C,y),o.setSize(C,y);for(let A=0;A<m.length;A++){const M=m[A];M.setSize&&M.setSize(C,y)}},this.setEffects=function(C){m=C,b=m.length>0&&m[0].isRenderPass===!0;const y=r.width,A=r.height;for(let M=0;M<m.length;M++){const R=m[M];R.setSize&&R.setSize(y,A)}},this.begin=function(C,y){if(g||C.toneMapping===Ri&&m.length===0)return!1;if(p=y,y!==null){const A=y.width,M=y.height;(r.width!==A||r.height!==M)&&this.setSize(A,M)}return b===!1&&C.setRenderTarget(r),v=C.toneMapping,C.toneMapping=Ri,!0},this.hasRenderPass=function(){return b},this.end=function(C,y){C.toneMapping=v,g=!0;let A=r,M=o;for(let R=0;R<m.length;R++){const _=m[R];if(_.enabled!==!1&&(_.render(C,M,A,y),_.needsSwap!==!1)){const E=A;A=M,M=E}}if(d!==C.outputColorSpace||f!==C.toneMapping){d=C.outputColorSpace,f=C.toneMapping,h.defines={},Jt.getTransfer(d)===ie&&(h.defines.SRGB_TRANSFER="");const R=S0[f];R&&(h.defines[R]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=A.texture,C.setRenderTarget(p),C.render(c,u),p=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){r.depthTexture&&r.depthTexture.dispose(),r.dispose(),o.dispose(),l.dispose(),h.dispose()}}const xc=new qe,wo=new Qn(1,1),yc=new ec,Mc=new Gd,wc=new hc,jl=[],th=[],eh=new Float32Array(16),ih=new Float32Array(9),nh=new Float32Array(4);function ns(s,t,e){const i=s[0];if(i<=0||i>0)return s;const n=t*e;let a=jl[n];if(a===void 0&&(a=new Float32Array(n),jl[n]=a),t!==0){i.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,s[r].toArray(a,o)}return a}function De(s,t){if(s.length!==t.length)return!1;for(let e=0,i=s.length;e<i;e++)if(s[e]!==t[e])return!1;return!0}function Ie(s,t){for(let e=0,i=t.length;e<i;e++)s[e]=t[e]}function Ua(s,t){let e=th[t];e===void 0&&(e=new Int32Array(t),th[t]=e);for(let i=0;i!==t;++i)e[i]=s.allocateTextureUnit();return e}function T0(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function E0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;s.uniform2fv(this.addr,t),Ie(e,t)}}function A0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(De(e,t))return;s.uniform3fv(this.addr,t),Ie(e,t)}}function R0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;s.uniform4fv(this.addr,t),Ie(e,t)}}function C0(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(De(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,i))return;nh.set(i),s.uniformMatrix2fv(this.addr,!1,nh),Ie(e,i)}}function P0(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(De(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,i))return;ih.set(i),s.uniformMatrix3fv(this.addr,!1,ih),Ie(e,i)}}function L0(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(De(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,i))return;eh.set(i),s.uniformMatrix4fv(this.addr,!1,eh),Ie(e,i)}}function D0(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function I0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;s.uniform2iv(this.addr,t),Ie(e,t)}}function U0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;s.uniform3iv(this.addr,t),Ie(e,t)}}function F0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;s.uniform4iv(this.addr,t),Ie(e,t)}}function N0(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function z0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;s.uniform2uiv(this.addr,t),Ie(e,t)}}function O0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;s.uniform3uiv(this.addr,t),Ie(e,t)}}function B0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;s.uniform4uiv(this.addr,t),Ie(e,t)}}function k0(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let a;this.type===s.SAMPLER_2D_SHADOW?(wo.compareFunction=e.isReversedDepthBuffer()?Bo:Oo,a=wo):a=xc,e.setTexture2D(t||a,n)}function G0(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||Mc,n)}function V0(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTextureCube(t||wc,n)}function H0(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||yc,n)}function W0(s){switch(s){case 5126:return T0;case 35664:return E0;case 35665:return A0;case 35666:return R0;case 35674:return C0;case 35675:return P0;case 35676:return L0;case 5124:case 35670:return D0;case 35667:case 35671:return I0;case 35668:case 35672:return U0;case 35669:case 35673:return F0;case 5125:return N0;case 36294:return z0;case 36295:return O0;case 36296:return B0;case 35678:case 36198:case 36298:case 36306:case 35682:return k0;case 35679:case 36299:case 36307:return G0;case 35680:case 36300:case 36308:case 36293:return V0;case 36289:case 36303:case 36311:case 36292:return H0}}function X0(s,t){s.uniform1fv(this.addr,t)}function q0(s,t){const e=ns(t,this.size,2);s.uniform2fv(this.addr,e)}function Y0(s,t){const e=ns(t,this.size,3);s.uniform3fv(this.addr,e)}function $0(s,t){const e=ns(t,this.size,4);s.uniform4fv(this.addr,e)}function K0(s,t){const e=ns(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Z0(s,t){const e=ns(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function J0(s,t){const e=ns(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Q0(s,t){s.uniform1iv(this.addr,t)}function j0(s,t){s.uniform2iv(this.addr,t)}function tm(s,t){s.uniform3iv(this.addr,t)}function em(s,t){s.uniform4iv(this.addr,t)}function im(s,t){s.uniform1uiv(this.addr,t)}function nm(s,t){s.uniform2uiv(this.addr,t)}function sm(s,t){s.uniform3uiv(this.addr,t)}function am(s,t){s.uniform4uiv(this.addr,t)}function rm(s,t,e){const i=this.cache,n=t.length,a=Ua(e,n);De(i,a)||(s.uniform1iv(this.addr,a),Ie(i,a));let r;this.type===s.SAMPLER_2D_SHADOW?r=wo:r=xc;for(let o=0;o!==n;++o)e.setTexture2D(t[o]||r,a[o])}function om(s,t,e){const i=this.cache,n=t.length,a=Ua(e,n);De(i,a)||(s.uniform1iv(this.addr,a),Ie(i,a));for(let r=0;r!==n;++r)e.setTexture3D(t[r]||Mc,a[r])}function lm(s,t,e){const i=this.cache,n=t.length,a=Ua(e,n);De(i,a)||(s.uniform1iv(this.addr,a),Ie(i,a));for(let r=0;r!==n;++r)e.setTextureCube(t[r]||wc,a[r])}function hm(s,t,e){const i=this.cache,n=t.length,a=Ua(e,n);De(i,a)||(s.uniform1iv(this.addr,a),Ie(i,a));for(let r=0;r!==n;++r)e.setTexture2DArray(t[r]||yc,a[r])}function cm(s){switch(s){case 5126:return X0;case 35664:return q0;case 35665:return Y0;case 35666:return $0;case 35674:return K0;case 35675:return Z0;case 35676:return J0;case 5124:case 35670:return Q0;case 35667:case 35671:return j0;case 35668:case 35672:return tm;case 35669:case 35673:return em;case 5125:return im;case 36294:return nm;case 36295:return sm;case 36296:return am;case 35678:case 36198:case 36298:case 36306:case 35682:return rm;case 35679:case 36299:case 36307:return om;case 35680:case 36300:case 36308:case 36293:return lm;case 36289:case 36303:case 36311:case 36292:return hm}}class dm{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=W0(e.type)}}class um{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=cm(e.type)}}class fm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const n=this.seq;for(let a=0,r=n.length;a!==r;++a){const o=n[a];o.setValue(t,e[o.id],i)}}}const gr=/(\w+)(\])?(\[|\.)?/g;function sh(s,t){s.seq.push(t),s.map[t.id]=t}function pm(s,t,e){const i=s.name,n=i.length;for(gr.lastIndex=0;;){const a=gr.exec(i),r=gr.lastIndex;let o=a[1];const l=a[2]==="]",h=a[3];if(l&&(o=o|0),h===void 0||h==="["&&r+2===n){sh(e,h===void 0?new dm(o,s,t):new um(o,s,t));break}else{let u=e.map[o];u===void 0&&(u=new fm(o),sh(e,u)),e=u}}}class va{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const o=t.getActiveUniform(e,r),l=t.getUniformLocation(e,o.name);pm(o,l,this)}const n=[],a=[];for(const r of this.seq)r.type===t.SAMPLER_2D_SHADOW||r.type===t.SAMPLER_CUBE_SHADOW||r.type===t.SAMPLER_2D_ARRAY_SHADOW?n.push(r):a.push(r);n.length>0&&(this.seq=n.concat(a))}setValue(t,e,i,n){const a=this.map[e];a!==void 0&&a.setValue(t,i,n)}setOptional(t,e,i){const n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let a=0,r=e.length;a!==r;++a){const o=e[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){const i=[];for(let n=0,a=t.length;n!==a;++n){const r=t[n];r.id in e&&i.push(r)}return i}}function ah(s,t,e){const i=s.createShader(t);return s.shaderSource(i,e),s.compileShader(i),i}const mm=37297;let gm=0;function vm(s,t){const e=s.split(`
`),i=[],n=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=n;r<a;r++){const o=r+1;i.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return i.join(`
`)}const rh=new Bt;function _m(s){Jt._getMatrix(rh,Jt.workingColorSpace,s);const t=`mat3( ${rh.elements.map(e=>e.toFixed(4))} )`;switch(Jt.getTransfer(s)){case wa:return[t,"LinearTransferOETF"];case ie:return[t,"sRGBTransferOETF"];default:return Nt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function oh(s,t,e){const i=s.getShaderParameter(t,s.COMPILE_STATUS),a=(s.getShaderInfoLog(t)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+a+`

`+vm(s.getShaderSource(t),o)}else return a}function xm(s,t){const e=_m(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const ym={[To]:"Linear",[Eo]:"Reinhard",[Ao]:"Cineon",[Ca]:"ACESFilmic",[Co]:"AgX",[Po]:"Neutral",[Ro]:"Custom"};function Mm(s,t){const e=ym[t];return e===void 0?(Nt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const oa=new S;function wm(){Jt.getLuminanceCoefficients(oa);const s=oa.x.toFixed(4),t=oa.y.toFixed(4),e=oa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Sm(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ss).join(`
`)}function bm(s){const t=[];for(const e in s){const i=s[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Tm(s,t){const e={},i=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const a=s.getActiveAttrib(t,n),r=a.name;let o=1;a.type===s.FLOAT_MAT2&&(o=2),a.type===s.FLOAT_MAT3&&(o=3),a.type===s.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:s.getAttribLocation(t,r),locationSize:o}}return e}function Ss(s){return s!==""}function lh(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function hh(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Em=/^[ \t]*#include +<([\w\d./]+)>/gm;function So(s){return s.replace(Em,Rm)}const Am=new Map;function Rm(s,t){let e=Xt[t];if(e===void 0){const i=Am.get(t);if(i!==void 0)e=Xt[i],Nt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return So(e)}const Cm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ch(s){return s.replace(Cm,Pm)}function Pm(s,t,e,i){let n="";for(let a=parseInt(t);a<parseInt(e);a++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return n}function dh(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const Lm={[Ts]:"SHADOWMAP_TYPE_PCF",[Ms]:"SHADOWMAP_TYPE_VSM"};function Dm(s){return Lm[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Im={[gn]:"ENVMAP_TYPE_CUBE",[Zn]:"ENVMAP_TYPE_CUBE",[Pa]:"ENVMAP_TYPE_CUBE_UV"};function Um(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Im[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Fm={[Zn]:"ENVMAP_MODE_REFRACTION"};function Nm(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Fm[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const zm={[qh]:"ENVMAP_BLENDING_MULTIPLY",[sd]:"ENVMAP_BLENDING_MIX",[ad]:"ENVMAP_BLENDING_ADD"};function Om(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":zm[s.combine]||"ENVMAP_BLENDING_NONE"}function Bm(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function km(s,t,e,i){const n=s.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const l=Dm(e),h=Um(e),c=Nm(e),u=Om(e),d=Bm(e),f=Sm(e),g=bm(a),v=n.createProgram();let p,m,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ss).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ss).join(`
`),m.length>0&&(m+=`
`)):(p=[dh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ss).join(`
`),m=[dh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ri?"#define TONE_MAPPING":"",e.toneMapping!==Ri?Xt.tonemapping_pars_fragment:"",e.toneMapping!==Ri?Mm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,xm("linearToOutputTexel",e.outputColorSpace),wm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ss).join(`
`)),r=So(r),r=lh(r,e),r=hh(r,e),o=So(o),o=lh(o,e),o=hh(o,e),r=ch(r),o=ch(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===gl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===gl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const C=b+p+r,y=b+m+o,A=ah(n,n.VERTEX_SHADER,C),M=ah(n,n.FRAGMENT_SHADER,y);n.attachShader(v,A),n.attachShader(v,M),e.index0AttributeName!==void 0?n.bindAttribLocation(v,0,e.index0AttributeName):e.hasPositionAttribute===!0&&n.bindAttribLocation(v,0,"position"),n.linkProgram(v);function R(L){if(s.debug.checkShaderErrors){const I=n.getProgramInfoLog(v)||"",k=n.getShaderInfoLog(A)||"",q=n.getShaderInfoLog(M)||"",B=I.trim(),Y=k.trim(),H=q.trim();let J=!0,et=!0;if(n.getProgramParameter(v,n.LINK_STATUS)===!1)if(J=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,v,A,M);else{const at=oh(n,A,"vertex"),rt=oh(n,M,"fragment");Qt("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(v,n.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+B+`
`+at+`
`+rt)}else B!==""?Nt("WebGLProgram: Program Info Log:",B):(Y===""||H==="")&&(et=!1);et&&(L.diagnostics={runnable:J,programLog:B,vertexShader:{log:Y,prefix:p},fragmentShader:{log:H,prefix:m}})}n.deleteShader(A),n.deleteShader(M),_=new va(n,v),E=Tm(n,v)}let _;this.getUniforms=function(){return _===void 0&&R(this),_};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let D=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=n.getProgramParameter(v,mm)),D},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=gm++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=A,this.fragmentShader=M,this}let Gm=0;class Vm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){const n=this._getShaderCacheForMaterial(t);return n.has(e)===!1&&(n.add(e),e.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Hm(t),e.set(t,i)),i}}class Hm{constructor(t){this.id=Gm++,this.code=t,this.usedTimes=0}}function Wm(s){return s===vn||s===xa||s===ya}function Xm(s,t,e,i,n,a){const r=new Vo,o=new Vm,l=new Set,h=[],c=new Map,u=i.logarithmicDepthBuffer;let d=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function v(_,E,D,L,I,k){const q=L.fog,B=I.geometry,Y=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?L.environment:null,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,J=t.get(_.envMap||Y,H),et=J&&J.mapping===Pa?J.image.height:null,at=f[_.type];_.precision!==null&&(d=i.getMaxPrecision(_.precision),d!==_.precision&&Nt("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const rt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,_t=rt!==void 0?rt.length:0;let Yt=0;B.morphAttributes.position!==void 0&&(Yt=1),B.morphAttributes.normal!==void 0&&(Yt=2),B.morphAttributes.color!==void 0&&(Yt=3);let Ot,Ut,Z,st;if(at){const St=bi[at];Ot=St.vertexShader,Ut=St.fragmentShader}else{Ot=_.vertexShader,Ut=_.fragmentShader;const St=o.getVertexShaderStage(_),ve=o.getFragmentShaderStage(_);o.update(_,St,ve),Z=St.id,st=ve.id}const it=s.getRenderTarget(),Mt=s.state.buffers.depth.getReversed(),Tt=I.isInstancedMesh===!0,Et=I.isBatchedMesh===!0,Me=!!_.map,Zt=!!_.matcap,le=!!J,ee=!!_.aoMap,jt=!!_.lightMap,be=!!_.bumpMap&&_.wireframe===!1,Ce=!!_.normalMap,Ue=!!_.displacementMap,Oe=!!_.emissiveMap,ge=!!_.metalnessMap,Te=!!_.roughnessMap,N=_.anisotropy>0,Je=_.clearcoat>0,ne=_.dispersion>0,P=_.iridescence>0,x=_.sheen>0,O=_.transmission>0,W=N&&!!_.anisotropyMap,$=Je&&!!_.clearcoatMap,nt=Je&&!!_.clearcoatNormalMap,lt=Je&&!!_.clearcoatRoughnessMap,K=P&&!!_.iridescenceMap,j=P&&!!_.iridescenceThicknessMap,ht=x&&!!_.sheenColorMap,Pt=x&&!!_.sheenRoughnessMap,ut=!!_.specularMap,ct=!!_.specularColorMap,It=!!_.specularIntensityMap,Ft=O&&!!_.transmissionMap,Gt=O&&!!_.thicknessMap,F=!!_.gradientMap,ot=!!_.alphaMap,Q=_.alphaTest>0,dt=!!_.alphaHash,vt=!!_.extensions;let tt=Ri;_.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(tt=s.toneMapping);const At={shaderID:at,shaderType:_.type,shaderName:_.name,vertexShader:Ot,fragmentShader:Ut,defines:_.defines,customVertexShaderID:Z,customFragmentShaderID:st,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Et,batchingColor:Et&&I._colorsTexture!==null,instancing:Tt,instancingColor:Tt&&I.instanceColor!==null,instancingMorph:Tt&&I.morphTexture!==null,outputColorSpace:it===null?s.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:Jt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Me,matcap:Zt,envMap:le,envMapMode:le&&J.mapping,envMapCubeUVHeight:et,aoMap:ee,lightMap:jt,bumpMap:be,normalMap:Ce,displacementMap:Ue,emissiveMap:Oe,normalMapObjectSpace:Ce&&_.normalMapType===ld,normalMapTangentSpace:Ce&&_.normalMapType===vo,packedNormalMap:Ce&&_.normalMapType===vo&&Wm(_.normalMap.format),metalnessMap:ge,roughnessMap:Te,anisotropy:N,anisotropyMap:W,clearcoat:Je,clearcoatMap:$,clearcoatNormalMap:nt,clearcoatRoughnessMap:lt,dispersion:ne,iridescence:P,iridescenceMap:K,iridescenceThicknessMap:j,sheen:x,sheenColorMap:ht,sheenRoughnessMap:Pt,specularMap:ut,specularColorMap:ct,specularIntensityMap:It,transmission:O,transmissionMap:Ft,thicknessMap:Gt,gradientMap:F,opaque:_.transparent===!1&&_.blending===en&&_.alphaToCoverage===!1,alphaMap:ot,alphaTest:Q,alphaHash:dt,combine:_.combine,mapUv:Me&&g(_.map.channel),aoMapUv:ee&&g(_.aoMap.channel),lightMapUv:jt&&g(_.lightMap.channel),bumpMapUv:be&&g(_.bumpMap.channel),normalMapUv:Ce&&g(_.normalMap.channel),displacementMapUv:Ue&&g(_.displacementMap.channel),emissiveMapUv:Oe&&g(_.emissiveMap.channel),metalnessMapUv:ge&&g(_.metalnessMap.channel),roughnessMapUv:Te&&g(_.roughnessMap.channel),anisotropyMapUv:W&&g(_.anisotropyMap.channel),clearcoatMapUv:$&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:nt&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:lt&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:j&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:ht&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:Pt&&g(_.sheenRoughnessMap.channel),specularMapUv:ut&&g(_.specularMap.channel),specularColorMapUv:ct&&g(_.specularColorMap.channel),specularIntensityMapUv:It&&g(_.specularIntensityMap.channel),transmissionMapUv:Ft&&g(_.transmissionMap.channel),thicknessMapUv:Gt&&g(_.thicknessMap.channel),alphaMapUv:ot&&g(_.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(Ce||N),vertexNormals:!!B.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!B.attributes.uv&&(Me||ot),fog:!!q,useFog:_.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||B.attributes.normal===void 0&&Ce===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Mt,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:_t,morphTextureStride:Yt,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&D.length>0,shadowMapType:s.shadowMap.type,toneMapping:tt,decodeVideoTexture:Me&&_.map.isVideoTexture===!0&&Jt.getTransfer(_.map.colorSpace)===ie,decodeVideoTextureEmissive:Oe&&_.emissiveMap.isVideoTexture===!0&&Jt.getTransfer(_.emissiveMap.colorSpace)===ie,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Qe,flipSided:_.side===Xe,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:vt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vt&&_.extensions.multiDraw===!0||Et)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return At.vertexUv1s=l.has(1),At.vertexUv2s=l.has(2),At.vertexUv3s=l.has(3),l.clear(),At}function p(_){const E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(const D in _.defines)E.push(D),E.push(_.defines[D]);return _.isRawShaderMaterial===!1&&(m(E,_),b(E,_),E.push(s.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function m(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function b(_,E){r.disableAll(),E.instancing&&r.enable(0),E.instancingColor&&r.enable(1),E.instancingMorph&&r.enable(2),E.matcap&&r.enable(3),E.envMap&&r.enable(4),E.normalMapObjectSpace&&r.enable(5),E.normalMapTangentSpace&&r.enable(6),E.clearcoat&&r.enable(7),E.iridescence&&r.enable(8),E.alphaTest&&r.enable(9),E.vertexColors&&r.enable(10),E.vertexAlphas&&r.enable(11),E.vertexUv1s&&r.enable(12),E.vertexUv2s&&r.enable(13),E.vertexUv3s&&r.enable(14),E.vertexTangents&&r.enable(15),E.anisotropy&&r.enable(16),E.alphaHash&&r.enable(17),E.batching&&r.enable(18),E.dispersion&&r.enable(19),E.batchingColor&&r.enable(20),E.gradientMap&&r.enable(21),E.packedNormalMap&&r.enable(22),E.vertexNormals&&r.enable(23),_.push(r.mask),r.disableAll(),E.fog&&r.enable(0),E.useFog&&r.enable(1),E.flatShading&&r.enable(2),E.logarithmicDepthBuffer&&r.enable(3),E.reversedDepthBuffer&&r.enable(4),E.skinning&&r.enable(5),E.morphTargets&&r.enable(6),E.morphNormals&&r.enable(7),E.morphColors&&r.enable(8),E.premultipliedAlpha&&r.enable(9),E.shadowMapEnabled&&r.enable(10),E.doubleSided&&r.enable(11),E.flipSided&&r.enable(12),E.useDepthPacking&&r.enable(13),E.dithering&&r.enable(14),E.transmission&&r.enable(15),E.sheen&&r.enable(16),E.opaque&&r.enable(17),E.pointsUvs&&r.enable(18),E.decodeVideoTexture&&r.enable(19),E.decodeVideoTextureEmissive&&r.enable(20),E.alphaToCoverage&&r.enable(21),E.numLightProbeGrids>0&&r.enable(22),E.hasPositionAttribute&&r.enable(23),_.push(r.mask)}function C(_){const E=f[_.type];let D;if(E){const L=bi[E];D=Ls.clone(L.uniforms)}else D=_.uniforms;return D}function y(_,E){let D=c.get(E);return D!==void 0?++D.usedTimes:(D=new km(s,E,_,n),h.push(D),c.set(E,D)),D}function A(_){if(--_.usedTimes===0){const E=h.indexOf(_);h[E]=h[h.length-1],h.pop(),c.delete(_.cacheKey),_.destroy()}}function M(_){o.remove(_)}function R(){o.dispose()}return{getParameters:v,getProgramCacheKey:p,getUniforms:C,acquireProgram:y,releaseProgram:A,releaseShaderCache:M,programs:h,dispose:R}}function qm(){let s=new WeakMap;function t(r){return s.has(r)}function e(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function i(r){s.delete(r)}function n(r,o,l){s.get(r)[o]=l}function a(){s=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:a}}function Ym(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function uh(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function fh(){const s=[];let t=0;const e=[],i=[],n=[];function a(){t=0,e.length=0,i.length=0,n.length=0}function r(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,g,v,p,m){let b=s[t];return b===void 0?(b={id:d.id,object:d,geometry:f,material:g,materialVariant:r(d),groupOrder:v,renderOrder:d.renderOrder,z:p,group:m},s[t]=b):(b.id=d.id,b.object=d,b.geometry=f,b.material=g,b.materialVariant=r(d),b.groupOrder=v,b.renderOrder=d.renderOrder,b.z=p,b.group=m),t++,b}function l(d,f,g,v,p,m){const b=o(d,f,g,v,p,m);g.transmission>0?i.push(b):g.transparent===!0?n.push(b):e.push(b)}function h(d,f,g,v,p,m){const b=o(d,f,g,v,p,m);g.transmission>0?i.unshift(b):g.transparent===!0?n.unshift(b):e.unshift(b)}function c(d,f,g){e.length>1&&e.sort(d||Ym),i.length>1&&i.sort(f||uh),n.length>1&&n.sort(f||uh),g&&(e.reverse(),i.reverse(),n.reverse())}function u(){for(let d=t,f=s.length;d<f;d++){const g=s[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:i,transparent:n,init:a,push:l,unshift:h,finish:u,sort:c}}function $m(){let s=new WeakMap;function t(i,n){const a=s.get(i);let r;return a===void 0?(r=new fh,s.set(i,[r])):n>=a.length?(r=new fh,a.push(r)):r=a[n],r}function e(){s=new WeakMap}return{get:t,dispose:e}}function Km(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new S,color:new Ct};break;case"SpotLight":e={position:new S,direction:new S,color:new Ct,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new S,color:new Ct,distance:0,decay:0};break;case"HemisphereLight":e={direction:new S,skyColor:new Ct,groundColor:new Ct};break;case"RectAreaLight":e={color:new Ct,position:new S,halfWidth:new S,halfHeight:new S};break}return s[t.id]=e,e}}}function Zm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Jm=0;function Qm(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function jm(s){const t=new Km,e=Zm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new S);const n=new S,a=new Wt,r=new Wt;function o(h){let c=0,u=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let f=0,g=0,v=0,p=0,m=0,b=0,C=0,y=0,A=0,M=0,R=0;h.sort(Qm);for(let E=0,D=h.length;E<D;E++){const L=h[E],I=L.color,k=L.intensity,q=L.distance;let B=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===vn?B=L.shadow.map.texture:B=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)c+=I.r*k,u+=I.g*k,d+=I.b*k;else if(L.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(L.sh.coefficients[Y],k);R++}else if(L.isDirectionalLight){const Y=t.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const H=L.shadow,J=e.get(L);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,i.directionalShadow[f]=J,i.directionalShadowMap[f]=B,i.directionalShadowMatrix[f]=L.shadow.matrix,b++}i.directional[f]=Y,f++}else if(L.isSpotLight){const Y=t.get(L);Y.position.setFromMatrixPosition(L.matrixWorld),Y.color.copy(I).multiplyScalar(k),Y.distance=q,Y.coneCos=Math.cos(L.angle),Y.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Y.decay=L.decay,i.spot[v]=Y;const H=L.shadow;if(L.map&&(i.spotLightMap[A]=L.map,A++,H.updateMatrices(L),L.castShadow&&M++),i.spotLightMatrix[v]=H.matrix,L.castShadow){const J=e.get(L);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,i.spotShadow[v]=J,i.spotShadowMap[v]=B,y++}v++}else if(L.isRectAreaLight){const Y=t.get(L);Y.color.copy(I).multiplyScalar(k),Y.halfWidth.set(L.width*.5,0,0),Y.halfHeight.set(0,L.height*.5,0),i.rectArea[p]=Y,p++}else if(L.isPointLight){const Y=t.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),Y.distance=L.distance,Y.decay=L.decay,L.castShadow){const H=L.shadow,J=e.get(L);J.shadowIntensity=H.intensity,J.shadowBias=H.bias,J.shadowNormalBias=H.normalBias,J.shadowRadius=H.radius,J.shadowMapSize=H.mapSize,J.shadowCameraNear=H.camera.near,J.shadowCameraFar=H.camera.far,i.pointShadow[g]=J,i.pointShadowMap[g]=B,i.pointShadowMatrix[g]=L.shadow.matrix,C++}i.point[g]=Y,g++}else if(L.isHemisphereLight){const Y=t.get(L);Y.skyColor.copy(L.color).multiplyScalar(k),Y.groundColor.copy(L.groundColor).multiplyScalar(k),i.hemi[m]=Y,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ft.LTC_FLOAT_1,i.rectAreaLTC2=ft.LTC_FLOAT_2):(i.rectAreaLTC1=ft.LTC_HALF_1,i.rectAreaLTC2=ft.LTC_HALF_2)),i.ambient[0]=c,i.ambient[1]=u,i.ambient[2]=d;const _=i.hash;(_.directionalLength!==f||_.pointLength!==g||_.spotLength!==v||_.rectAreaLength!==p||_.hemiLength!==m||_.numDirectionalShadows!==b||_.numPointShadows!==C||_.numSpotShadows!==y||_.numSpotMaps!==A||_.numLightProbes!==R)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=p,i.point.length=g,i.hemi.length=m,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=C,i.pointShadowMap.length=C,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=C,i.spotLightMatrix.length=y+A-M,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=M,i.numLightProbes=R,_.directionalLength=f,_.pointLength=g,_.spotLength=v,_.rectAreaLength=p,_.hemiLength=m,_.numDirectionalShadows=b,_.numPointShadows=C,_.numSpotShadows=y,_.numSpotMaps=A,_.numLightProbes=R,i.version=Jm++)}function l(h,c){let u=0,d=0,f=0,g=0,v=0;const p=c.matrixWorldInverse;for(let m=0,b=h.length;m<b;m++){const C=h[m];if(C.isDirectionalLight){const y=i.directional[u];y.direction.setFromMatrixPosition(C.matrixWorld),n.setFromMatrixPosition(C.target.matrixWorld),y.direction.sub(n),y.direction.transformDirection(p),u++}else if(C.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(C.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(C.matrixWorld),n.setFromMatrixPosition(C.target.matrixWorld),y.direction.sub(n),y.direction.transformDirection(p),f++}else if(C.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(C.matrixWorld),y.position.applyMatrix4(p),r.identity(),a.copy(C.matrixWorld),a.premultiply(p),r.extractRotation(a),y.halfWidth.set(C.width*.5,0,0),y.halfHeight.set(0,C.height*.5,0),y.halfWidth.applyMatrix4(r),y.halfHeight.applyMatrix4(r),g++}else if(C.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(C.matrixWorld),y.position.applyMatrix4(p),d++}else if(C.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(C.matrixWorld),y.direction.transformDirection(p),v++}}}return{setup:o,setupView:l,state:i}}function ph(s){const t=new jm(s),e=[],i=[],n=[];function a(d){u.camera=d,e.length=0,i.length=0,n.length=0}function r(d){e.push(d)}function o(d){i.push(d)}function l(d){n.push(d)}function h(){t.setup(e)}function c(d){t.setupView(e,d)}const u={lightsArray:e,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:h,setupLightsView:c,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function tg(s){let t=new WeakMap;function e(n,a=0){const r=t.get(n);let o;return r===void 0?(o=new ph(s),t.set(n,[o])):a>=r.length?(o=new ph(s),r.push(o)):o=r[a],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const eg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ig=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ng=[new S(1,0,0),new S(-1,0,0),new S(0,1,0),new S(0,-1,0),new S(0,0,1),new S(0,0,-1)],sg=[new S(0,-1,0),new S(0,-1,0),new S(0,0,1),new S(0,0,-1),new S(0,-1,0),new S(0,-1,0)],mh=new Wt,ms=new S,vr=new S;function ag(s,t,e){let i=new Xo;const n=new gt,a=new gt,r=new pe,o=new uu,l=new fu,h={},c=e.maxTextureSize,u={[nn]:Xe,[Xe]:nn,[Qe]:Qe},d=new re({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new gt},radius:{value:4}},vertexShader:eg,fragmentShader:ig}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Le;g.setAttribute("position",new ti(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new U(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ts;let m=this.type;this.render=function(M,R,_){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||M.length===0)return;this.type===Bc&&(Nt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Ts);const E=s.getRenderTarget(),D=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),I=s.state;I.setBlending(Ai),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const k=m!==this.type;k&&R.traverse(function(q){q.material&&(Array.isArray(q.material)?q.material.forEach(B=>B.needsUpdate=!0):q.material.needsUpdate=!0)});for(let q=0,B=M.length;q<B;q++){const Y=M[q],H=Y.shadow;if(H===void 0){Nt("WebGLShadowMap:",Y,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;n.copy(H.mapSize);const J=H.getFrameExtents();n.multiply(J),a.copy(H.mapSize),(n.x>c||n.y>c)&&(n.x>c&&(a.x=Math.floor(c/J.x),n.x=a.x*J.x,H.mapSize.x=a.x),n.y>c&&(a.y=Math.floor(c/J.y),n.y=a.y*J.y,H.mapSize.y=a.y));const et=s.state.buffers.depth.getReversed();if(H.camera._reversedDepth=et,H.map===null||k===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Ms){if(Y.isPointLight){Nt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Ze(n.x,n.y,{format:vn,type:je,minFilter:Re,magFilter:Re,generateMipmaps:!1}),H.map.texture.name=Y.name+".shadowMap",H.map.depthTexture=new Qn(n.x,n.y,vi),H.map.depthTexture.name=Y.name+".shadowMapDepth",H.map.depthTexture.format=Gi,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=ke,H.map.depthTexture.magFilter=ke}else Y.isPointLight?(H.map=new _c(n.x),H.map.depthTexture=new ou(n.x,Pi)):(H.map=new Ze(n.x,n.y),H.map.depthTexture=new Qn(n.x,n.y,Pi)),H.map.depthTexture.name=Y.name+".shadowMap",H.map.depthTexture.format=Gi,this.type===Ts?(H.map.depthTexture.compareFunction=et?Bo:Oo,H.map.depthTexture.minFilter=Re,H.map.depthTexture.magFilter=Re):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=ke,H.map.depthTexture.magFilter=ke);H.camera.updateProjectionMatrix()}const at=H.map.isWebGLCubeRenderTarget?6:1;for(let rt=0;rt<at;rt++){if(H.map.isWebGLCubeRenderTarget)s.setRenderTarget(H.map,rt),s.clear();else{rt===0&&(s.setRenderTarget(H.map),s.clear());const _t=H.getViewport(rt);r.set(a.x*_t.x,a.y*_t.y,a.x*_t.z,a.y*_t.w),I.viewport(r)}if(Y.isPointLight){const _t=H.camera,Yt=H.matrix,Ot=Y.distance||_t.far;Ot!==_t.far&&(_t.far=Ot,_t.updateProjectionMatrix()),ms.setFromMatrixPosition(Y.matrixWorld),_t.position.copy(ms),vr.copy(_t.position),vr.add(ng[rt]),_t.up.copy(sg[rt]),_t.lookAt(vr),_t.updateMatrixWorld(),Yt.makeTranslation(-ms.x,-ms.y,-ms.z),mh.multiplyMatrices(_t.projectionMatrix,_t.matrixWorldInverse),H._frustum.setFromProjectionMatrix(mh,_t.coordinateSystem,_t.reversedDepth)}else H.updateMatrices(Y);i=H.getFrustum(),y(R,_,H.camera,Y,this.type)}H.isPointLightShadow!==!0&&this.type===Ms&&b(H,_),H.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(E,D,L)};function b(M,R){const _=t.update(v);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new Ze(n.x,n.y,{format:vn,type:je})),d.uniforms.shadow_pass.value=M.map.depthTexture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,s.setRenderTarget(M.mapPass),s.clear(),s.renderBufferDirect(R,null,_,d,v,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,s.setRenderTarget(M.map),s.clear(),s.renderBufferDirect(R,null,_,f,v,null)}function C(M,R,_,E){let D=null;const L=_.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(L!==void 0)D=L;else if(D=_.isPointLight===!0?l:o,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const I=D.uuid,k=R.uuid;let q=h[I];q===void 0&&(q={},h[I]=q);let B=q[k];B===void 0&&(B=D.clone(),q[k]=B,R.addEventListener("dispose",A)),D=B}if(D.visible=R.visible,D.wireframe=R.wireframe,E===Ms?D.side=R.shadowSide!==null?R.shadowSide:R.side:D.side=R.shadowSide!==null?R.shadowSide:u[R.side],D.alphaMap=R.alphaMap,D.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,D.map=R.map,D.clipShadows=R.clipShadows,D.clippingPlanes=R.clippingPlanes,D.clipIntersection=R.clipIntersection,D.displacementMap=R.displacementMap,D.displacementScale=R.displacementScale,D.displacementBias=R.displacementBias,D.wireframeLinewidth=R.wireframeLinewidth,D.linewidth=R.linewidth,_.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const I=s.properties.get(D);I.light=_}return D}function y(M,R,_,E,D){if(M.visible===!1)return;if(M.layers.test(R.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&D===Ms)&&(!M.frustumCulled||i.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,M.matrixWorld);const k=t.update(M),q=M.material;if(Array.isArray(q)){const B=k.groups;for(let Y=0,H=B.length;Y<H;Y++){const J=B[Y],et=q[J.materialIndex];if(et&&et.visible){const at=C(M,et,E,D);M.onBeforeShadow(s,M,R,_,k,at,J),s.renderBufferDirect(_,null,k,at,M,J),M.onAfterShadow(s,M,R,_,k,at,J)}}}else if(q.visible){const B=C(M,q,E,D);M.onBeforeShadow(s,M,R,_,k,B,null),s.renderBufferDirect(_,null,k,B,M,null),M.onAfterShadow(s,M,R,_,k,B,null)}}const I=M.children;for(let k=0,q=I.length;k<q;k++)y(I[k],R,_,E,D)}function A(M){M.target.removeEventListener("dispose",A);for(const _ in h){const E=h[_],D=M.target.uuid;D in E&&(E[D].dispose(),delete E[D])}}}function rg(s,t){function e(){let F=!1;const ot=new pe;let Q=null;const dt=new pe(0,0,0,0);return{setMask:function(vt){Q!==vt&&!F&&(s.colorMask(vt,vt,vt,vt),Q=vt)},setLocked:function(vt){F=vt},setClear:function(vt,tt,At,St,ve){ve===!0&&(vt*=St,tt*=St,At*=St),ot.set(vt,tt,At,St),dt.equals(ot)===!1&&(s.clearColor(vt,tt,At,St),dt.copy(ot))},reset:function(){F=!1,Q=null,dt.set(-1,0,0,0)}}}function i(){let F=!1,ot=!1,Q=null,dt=null,vt=null;return{setReversed:function(tt){if(ot!==tt){const At=t.get("EXT_clip_control");tt?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),ot=tt;const St=vt;vt=null,this.setClear(St)}},getReversed:function(){return ot},setTest:function(tt){tt?it(s.DEPTH_TEST):Mt(s.DEPTH_TEST)},setMask:function(tt){Q!==tt&&!F&&(s.depthMask(tt),Q=tt)},setFunc:function(tt){if(ot&&(tt=xd[tt]),dt!==tt){switch(tt){case Dr:s.depthFunc(s.NEVER);break;case Ir:s.depthFunc(s.ALWAYS);break;case Ur:s.depthFunc(s.LESS);break;case Kn:s.depthFunc(s.LEQUAL);break;case Fr:s.depthFunc(s.EQUAL);break;case Nr:s.depthFunc(s.GEQUAL);break;case zr:s.depthFunc(s.GREATER);break;case Or:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}dt=tt}},setLocked:function(tt){F=tt},setClear:function(tt){vt!==tt&&(vt=tt,ot&&(tt=1-tt),s.clearDepth(tt))},reset:function(){F=!1,Q=null,dt=null,vt=null,ot=!1}}}function n(){let F=!1,ot=null,Q=null,dt=null,vt=null,tt=null,At=null,St=null,ve=null;return{setTest:function(de){F||(de?it(s.STENCIL_TEST):Mt(s.STENCIL_TEST))},setMask:function(de){ot!==de&&!F&&(s.stencilMask(de),ot=de)},setFunc:function(de,xi,yi){(Q!==de||dt!==xi||vt!==yi)&&(s.stencilFunc(de,xi,yi),Q=de,dt=xi,vt=yi)},setOp:function(de,xi,yi){(tt!==de||At!==xi||St!==yi)&&(s.stencilOp(de,xi,yi),tt=de,At=xi,St=yi)},setLocked:function(de){F=de},setClear:function(de){ve!==de&&(s.clearStencil(de),ve=de)},reset:function(){F=!1,ot=null,Q=null,dt=null,vt=null,tt=null,At=null,St=null,ve=null}}}const a=new e,r=new i,o=new n,l=new WeakMap,h=new WeakMap;let c={},u={},d={},f=new WeakMap,g=[],v=null,p=!1,m=null,b=null,C=null,y=null,A=null,M=null,R=null,_=new Ct(0,0,0),E=0,D=!1,L=null,I=null,k=null,q=null,B=null;const Y=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,J=0;const et=s.getParameter(s.VERSION);et.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(et)[1]),H=J>=1):et.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(et)[1]),H=J>=2);let at=null,rt={};const _t=s.getParameter(s.SCISSOR_BOX),Yt=s.getParameter(s.VIEWPORT),Ot=new pe().fromArray(_t),Ut=new pe().fromArray(Yt);function Z(F,ot,Q,dt){const vt=new Uint8Array(4),tt=s.createTexture();s.bindTexture(F,tt),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let At=0;At<Q;At++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(ot,0,s.RGBA,1,1,dt,0,s.RGBA,s.UNSIGNED_BYTE,vt):s.texImage2D(ot+At,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,vt);return tt}const st={};st[s.TEXTURE_2D]=Z(s.TEXTURE_2D,s.TEXTURE_2D,1),st[s.TEXTURE_CUBE_MAP]=Z(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),st[s.TEXTURE_2D_ARRAY]=Z(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),st[s.TEXTURE_3D]=Z(s.TEXTURE_3D,s.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),it(s.DEPTH_TEST),r.setFunc(Kn),be(!1),Ce(ul),it(s.CULL_FACE),ee(Ai);function it(F){c[F]!==!0&&(s.enable(F),c[F]=!0)}function Mt(F){c[F]!==!1&&(s.disable(F),c[F]=!1)}function Tt(F,ot){return d[F]!==ot?(s.bindFramebuffer(F,ot),d[F]=ot,F===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ot),F===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ot),!0):!1}function Et(F,ot){let Q=g,dt=!1;if(F){Q=f.get(ot),Q===void 0&&(Q=[],f.set(ot,Q));const vt=F.textures;if(Q.length!==vt.length||Q[0]!==s.COLOR_ATTACHMENT0){for(let tt=0,At=vt.length;tt<At;tt++)Q[tt]=s.COLOR_ATTACHMENT0+tt;Q.length=vt.length,dt=!0}}else Q[0]!==s.BACK&&(Q[0]=s.BACK,dt=!0);dt&&s.drawBuffers(Q)}function Me(F){return v!==F?(s.useProgram(F),v=F,!0):!1}const Zt={[dn]:s.FUNC_ADD,[Gc]:s.FUNC_SUBTRACT,[Vc]:s.FUNC_REVERSE_SUBTRACT};Zt[Hc]=s.MIN,Zt[Wc]=s.MAX;const le={[Xc]:s.ZERO,[qc]:s.ONE,[Yc]:s.SRC_COLOR,[Pr]:s.SRC_ALPHA,[jc]:s.SRC_ALPHA_SATURATE,[Jc]:s.DST_COLOR,[Kc]:s.DST_ALPHA,[$c]:s.ONE_MINUS_SRC_COLOR,[Lr]:s.ONE_MINUS_SRC_ALPHA,[Qc]:s.ONE_MINUS_DST_COLOR,[Zc]:s.ONE_MINUS_DST_ALPHA,[td]:s.CONSTANT_COLOR,[ed]:s.ONE_MINUS_CONSTANT_COLOR,[id]:s.CONSTANT_ALPHA,[nd]:s.ONE_MINUS_CONSTANT_ALPHA};function ee(F,ot,Q,dt,vt,tt,At,St,ve,de){if(F===Ai){p===!0&&(Mt(s.BLEND),p=!1);return}if(p===!1&&(it(s.BLEND),p=!0),F!==kc){if(F!==m||de!==D){if((b!==dn||A!==dn)&&(s.blendEquation(s.FUNC_ADD),b=dn,A=dn),de)switch(F){case en:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ki:s.blendFunc(s.ONE,s.ONE);break;case fl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case pl:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Qt("WebGLState: Invalid blending: ",F);break}else switch(F){case en:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ki:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case fl:Qt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case pl:Qt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Qt("WebGLState: Invalid blending: ",F);break}C=null,y=null,M=null,R=null,_.set(0,0,0),E=0,m=F,D=de}return}vt=vt||ot,tt=tt||Q,At=At||dt,(ot!==b||vt!==A)&&(s.blendEquationSeparate(Zt[ot],Zt[vt]),b=ot,A=vt),(Q!==C||dt!==y||tt!==M||At!==R)&&(s.blendFuncSeparate(le[Q],le[dt],le[tt],le[At]),C=Q,y=dt,M=tt,R=At),(St.equals(_)===!1||ve!==E)&&(s.blendColor(St.r,St.g,St.b,ve),_.copy(St),E=ve),m=F,D=!1}function jt(F,ot){F.side===Qe?Mt(s.CULL_FACE):it(s.CULL_FACE);let Q=F.side===Xe;ot&&(Q=!Q),be(Q),F.blending===en&&F.transparent===!1?ee(Ai):ee(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),r.setFunc(F.depthFunc),r.setTest(F.depthTest),r.setMask(F.depthWrite),a.setMask(F.colorWrite);const dt=F.stencilWrite;o.setTest(dt),dt&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Oe(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?it(s.SAMPLE_ALPHA_TO_COVERAGE):Mt(s.SAMPLE_ALPHA_TO_COVERAGE)}function be(F){L!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),L=F)}function Ce(F){F!==zc?(it(s.CULL_FACE),F!==I&&(F===ul?s.cullFace(s.BACK):F===Oc?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Mt(s.CULL_FACE),I=F}function Ue(F){F!==k&&(H&&s.lineWidth(F),k=F)}function Oe(F,ot,Q){F?(it(s.POLYGON_OFFSET_FILL),(q!==ot||B!==Q)&&(q=ot,B=Q,r.getReversed()&&(ot=-ot),s.polygonOffset(ot,Q))):Mt(s.POLYGON_OFFSET_FILL)}function ge(F){F?it(s.SCISSOR_TEST):Mt(s.SCISSOR_TEST)}function Te(F){F===void 0&&(F=s.TEXTURE0+Y-1),at!==F&&(s.activeTexture(F),at=F)}function N(F,ot,Q){Q===void 0&&(at===null?Q=s.TEXTURE0+Y-1:Q=at);let dt=rt[Q];dt===void 0&&(dt={type:void 0,texture:void 0},rt[Q]=dt),(dt.type!==F||dt.texture!==ot)&&(at!==Q&&(s.activeTexture(Q),at=Q),s.bindTexture(F,ot||st[F]),dt.type=F,dt.texture=ot)}function Je(){const F=rt[at];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ne(){try{s.compressedTexImage2D(...arguments)}catch(F){Qt("WebGLState:",F)}}function P(){try{s.compressedTexImage3D(...arguments)}catch(F){Qt("WebGLState:",F)}}function x(){try{s.texSubImage2D(...arguments)}catch(F){Qt("WebGLState:",F)}}function O(){try{s.texSubImage3D(...arguments)}catch(F){Qt("WebGLState:",F)}}function W(){try{s.compressedTexSubImage2D(...arguments)}catch(F){Qt("WebGLState:",F)}}function $(){try{s.compressedTexSubImage3D(...arguments)}catch(F){Qt("WebGLState:",F)}}function nt(){try{s.texStorage2D(...arguments)}catch(F){Qt("WebGLState:",F)}}function lt(){try{s.texStorage3D(...arguments)}catch(F){Qt("WebGLState:",F)}}function K(){try{s.texImage2D(...arguments)}catch(F){Qt("WebGLState:",F)}}function j(){try{s.texImage3D(...arguments)}catch(F){Qt("WebGLState:",F)}}function ht(F){return u[F]!==void 0?u[F]:s.getParameter(F)}function Pt(F,ot){u[F]!==ot&&(s.pixelStorei(F,ot),u[F]=ot)}function ut(F){Ot.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),Ot.copy(F))}function ct(F){Ut.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),Ut.copy(F))}function It(F,ot){let Q=h.get(ot);Q===void 0&&(Q=new WeakMap,h.set(ot,Q));let dt=Q.get(F);dt===void 0&&(dt=s.getUniformBlockIndex(ot,F.name),Q.set(F,dt))}function Ft(F,ot){const dt=h.get(ot).get(F);l.get(ot)!==dt&&(s.uniformBlockBinding(ot,dt,F.__bindingPointIndex),l.set(ot,dt))}function Gt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),r.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),c={},u={},at=null,rt={},d={},f=new WeakMap,g=[],v=null,p=!1,m=null,b=null,C=null,y=null,A=null,M=null,R=null,_=new Ct(0,0,0),E=0,D=!1,L=null,I=null,k=null,q=null,B=null,Ot.set(0,0,s.canvas.width,s.canvas.height),Ut.set(0,0,s.canvas.width,s.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:it,disable:Mt,bindFramebuffer:Tt,drawBuffers:Et,useProgram:Me,setBlending:ee,setMaterial:jt,setFlipSided:be,setCullFace:Ce,setLineWidth:Ue,setPolygonOffset:Oe,setScissorTest:ge,activeTexture:Te,bindTexture:N,unbindTexture:Je,compressedTexImage2D:ne,compressedTexImage3D:P,texImage2D:K,texImage3D:j,pixelStorei:Pt,getParameter:ht,updateUBOMapping:It,uniformBlockBinding:Ft,texStorage2D:nt,texStorage3D:lt,texSubImage2D:x,texSubImage3D:O,compressedTexSubImage2D:W,compressedTexSubImage3D:$,scissor:ut,viewport:ct,reset:Gt}}function og(s,t,e,i,n,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new gt,c=new WeakMap,u=new Set;let d;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(P,x){return g?new OffscreenCanvas(P,x):Sa("canvas")}function p(P,x,O){let W=1;const $=ne(P);if(($.width>O||$.height>O)&&(W=O/Math.max($.width,$.height)),W<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const nt=Math.floor(W*$.width),lt=Math.floor(W*$.height);d===void 0&&(d=v(nt,lt));const K=x?v(nt,lt):d;return K.width=nt,K.height=lt,K.getContext("2d").drawImage(P,0,0,nt,lt),Nt("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+nt+"x"+lt+")."),K}else return"data"in P&&Nt("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),P;return P}function m(P){return P.generateMipmaps}function b(P){s.generateMipmap(P)}function C(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(P,x,O,W,$,nt=!1){if(P!==null){if(s[P]!==void 0)return s[P];Nt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let lt;W&&(lt=t.get("EXT_texture_norm16"),lt||Nt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=x;if(x===s.RED&&(O===s.FLOAT&&(K=s.R32F),O===s.HALF_FLOAT&&(K=s.R16F),O===s.UNSIGNED_BYTE&&(K=s.R8),O===s.UNSIGNED_SHORT&&lt&&(K=lt.R16_EXT),O===s.SHORT&&lt&&(K=lt.R16_SNORM_EXT)),x===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(K=s.R8UI),O===s.UNSIGNED_SHORT&&(K=s.R16UI),O===s.UNSIGNED_INT&&(K=s.R32UI),O===s.BYTE&&(K=s.R8I),O===s.SHORT&&(K=s.R16I),O===s.INT&&(K=s.R32I)),x===s.RG&&(O===s.FLOAT&&(K=s.RG32F),O===s.HALF_FLOAT&&(K=s.RG16F),O===s.UNSIGNED_BYTE&&(K=s.RG8),O===s.UNSIGNED_SHORT&&lt&&(K=lt.RG16_EXT),O===s.SHORT&&lt&&(K=lt.RG16_SNORM_EXT)),x===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(K=s.RG8UI),O===s.UNSIGNED_SHORT&&(K=s.RG16UI),O===s.UNSIGNED_INT&&(K=s.RG32UI),O===s.BYTE&&(K=s.RG8I),O===s.SHORT&&(K=s.RG16I),O===s.INT&&(K=s.RG32I)),x===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(K=s.RGB8UI),O===s.UNSIGNED_SHORT&&(K=s.RGB16UI),O===s.UNSIGNED_INT&&(K=s.RGB32UI),O===s.BYTE&&(K=s.RGB8I),O===s.SHORT&&(K=s.RGB16I),O===s.INT&&(K=s.RGB32I)),x===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(K=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(K=s.RGBA16UI),O===s.UNSIGNED_INT&&(K=s.RGBA32UI),O===s.BYTE&&(K=s.RGBA8I),O===s.SHORT&&(K=s.RGBA16I),O===s.INT&&(K=s.RGBA32I)),x===s.RGB&&(O===s.UNSIGNED_SHORT&&lt&&(K=lt.RGB16_EXT),O===s.SHORT&&lt&&(K=lt.RGB16_SNORM_EXT),O===s.UNSIGNED_INT_5_9_9_9_REV&&(K=s.RGB9_E5),O===s.UNSIGNED_INT_10F_11F_11F_REV&&(K=s.R11F_G11F_B10F)),x===s.RGBA){const j=nt?wa:Jt.getTransfer($);O===s.FLOAT&&(K=s.RGBA32F),O===s.HALF_FLOAT&&(K=s.RGBA16F),O===s.UNSIGNED_BYTE&&(K=j===ie?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT&&lt&&(K=lt.RGBA16_EXT),O===s.SHORT&&lt&&(K=lt.RGBA16_SNORM_EXT),O===s.UNSIGNED_SHORT_4_4_4_4&&(K=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(K=s.RGB5_A1)}return(K===s.R16F||K===s.R32F||K===s.RG16F||K===s.RG32F||K===s.RGBA16F||K===s.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function A(P,x){let O;return P?x===null||x===Pi||x===Cs?O=s.DEPTH24_STENCIL8:x===vi?O=s.DEPTH32F_STENCIL8:x===Rs&&(O=s.DEPTH24_STENCIL8,Nt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Pi||x===Cs?O=s.DEPTH_COMPONENT24:x===vi?O=s.DEPTH_COMPONENT32F:x===Rs&&(O=s.DEPTH_COMPONENT16),O}function M(P,x){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==ke&&P.minFilter!==Re?Math.log2(Math.max(x.width,x.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?x.mipmaps.length:1}function R(P){const x=P.target;x.removeEventListener("dispose",R),E(x),x.isVideoTexture&&c.delete(x),x.isHTMLTexture&&u.delete(x)}function _(P){const x=P.target;x.removeEventListener("dispose",_),L(x)}function E(P){const x=i.get(P);if(x.__webglInit===void 0)return;const O=P.source,W=f.get(O);if(W){const $=W[x.__cacheKey];$.usedTimes--,$.usedTimes===0&&D(P),Object.keys(W).length===0&&f.delete(O)}i.remove(P)}function D(P){const x=i.get(P);s.deleteTexture(x.__webglTexture);const O=P.source,W=f.get(O);delete W[x.__cacheKey],r.memory.textures--}function L(P){const x=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(x.__webglFramebuffer[W]))for(let $=0;$<x.__webglFramebuffer[W].length;$++)s.deleteFramebuffer(x.__webglFramebuffer[W][$]);else s.deleteFramebuffer(x.__webglFramebuffer[W]);x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer[W])}else{if(Array.isArray(x.__webglFramebuffer))for(let W=0;W<x.__webglFramebuffer.length;W++)s.deleteFramebuffer(x.__webglFramebuffer[W]);else s.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&s.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let W=0;W<x.__webglColorRenderbuffer.length;W++)x.__webglColorRenderbuffer[W]&&s.deleteRenderbuffer(x.__webglColorRenderbuffer[W]);x.__webglDepthRenderbuffer&&s.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const O=P.textures;for(let W=0,$=O.length;W<$;W++){const nt=i.get(O[W]);nt.__webglTexture&&(s.deleteTexture(nt.__webglTexture),r.memory.textures--),i.remove(O[W])}i.remove(P)}let I=0;function k(){I=0}function q(){return I}function B(P){I=P}function Y(){const P=I;return P>=n.maxTextures&&Nt("WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+n.maxTextures),I+=1,P}function H(P){const x=[];return x.push(P.wrapS),x.push(P.wrapT),x.push(P.wrapR||0),x.push(P.magFilter),x.push(P.minFilter),x.push(P.anisotropy),x.push(P.internalFormat),x.push(P.format),x.push(P.type),x.push(P.generateMipmaps),x.push(P.premultiplyAlpha),x.push(P.flipY),x.push(P.unpackAlignment),x.push(P.colorSpace),x.join()}function J(P,x){const O=i.get(P);if(P.isVideoTexture&&N(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&O.__version!==P.version){const W=P.image;if(W===null)Nt("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)Nt("WebGLRenderer: Texture marked for update but image is incomplete");else{Mt(O,P,x);return}}else P.isExternalTexture&&(O.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+x)}function et(P,x){const O=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&O.__version!==P.version){Mt(O,P,x);return}else P.isExternalTexture&&(O.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+x)}function at(P,x){const O=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&O.__version!==P.version){Mt(O,P,x);return}e.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+x)}function rt(P,x){const O=i.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&O.__version!==P.version){Tt(O,P,x);return}e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+x)}const _t={[_i]:s.REPEAT,[zi]:s.CLAMP_TO_EDGE,[Br]:s.MIRRORED_REPEAT},Yt={[ke]:s.NEAREST,[rd]:s.NEAREST_MIPMAP_NEAREST,[Us]:s.NEAREST_MIPMAP_LINEAR,[Re]:s.LINEAR,[ka]:s.LINEAR_MIPMAP_NEAREST,[gi]:s.LINEAR_MIPMAP_LINEAR},Ot={[hd]:s.NEVER,[pd]:s.ALWAYS,[cd]:s.LESS,[Oo]:s.LEQUAL,[dd]:s.EQUAL,[Bo]:s.GEQUAL,[ud]:s.GREATER,[fd]:s.NOTEQUAL};function Ut(P,x){if(x.type===vi&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Re||x.magFilter===ka||x.magFilter===Us||x.magFilter===gi||x.minFilter===Re||x.minFilter===ka||x.minFilter===Us||x.minFilter===gi)&&Nt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,_t[x.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,_t[x.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,_t[x.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,Yt[x.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,Yt[x.minFilter]),x.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,Ot[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===ke||x.minFilter!==Us&&x.minFilter!==gi||x.type===vi&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");s.texParameterf(P,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,n.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Z(P,x){let O=!1;P.__webglInit===void 0&&(P.__webglInit=!0,x.addEventListener("dispose",R));const W=x.source;let $=f.get(W);$===void 0&&($={},f.set(W,$));const nt=H(x);if(nt!==P.__cacheKey){$[nt]===void 0&&($[nt]={texture:s.createTexture(),usedTimes:0},r.memory.textures++,O=!0),$[nt].usedTimes++;const lt=$[P.__cacheKey];lt!==void 0&&($[P.__cacheKey].usedTimes--,lt.usedTimes===0&&D(x)),P.__cacheKey=nt,P.__webglTexture=$[nt].texture}return O}function st(P,x,O){return Math.floor(Math.floor(P/O)/x)}function it(P,x,O,W){const nt=P.updateRanges;if(nt.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,x.width,x.height,O,W,x.data);else{nt.sort((Pt,ut)=>Pt.start-ut.start);let lt=0;for(let Pt=1;Pt<nt.length;Pt++){const ut=nt[lt],ct=nt[Pt],It=ut.start+ut.count,Ft=st(ct.start,x.width,4),Gt=st(ut.start,x.width,4);ct.start<=It+1&&Ft===Gt&&st(ct.start+ct.count-1,x.width,4)===Ft?ut.count=Math.max(ut.count,ct.start+ct.count-ut.start):(++lt,nt[lt]=ct)}nt.length=lt+1;const K=e.getParameter(s.UNPACK_ROW_LENGTH),j=e.getParameter(s.UNPACK_SKIP_PIXELS),ht=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,x.width);for(let Pt=0,ut=nt.length;Pt<ut;Pt++){const ct=nt[Pt],It=Math.floor(ct.start/4),Ft=Math.ceil(ct.count/4),Gt=It%x.width,F=Math.floor(It/x.width),ot=Ft,Q=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,Gt),e.pixelStorei(s.UNPACK_SKIP_ROWS,F),e.texSubImage2D(s.TEXTURE_2D,0,Gt,F,ot,Q,O,W,x.data)}P.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,K),e.pixelStorei(s.UNPACK_SKIP_PIXELS,j),e.pixelStorei(s.UNPACK_SKIP_ROWS,ht)}}function Mt(P,x,O){let W=s.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(W=s.TEXTURE_2D_ARRAY),x.isData3DTexture&&(W=s.TEXTURE_3D);const $=Z(P,x),nt=x.source;e.bindTexture(W,P.__webglTexture,s.TEXTURE0+O);const lt=i.get(nt);if(nt.version!==lt.__version||$===!0){if(e.activeTexture(s.TEXTURE0+O),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const Q=Jt.getPrimaries(Jt.workingColorSpace),dt=x.colorSpace===ji?null:Jt.getPrimaries(x.colorSpace),vt=x.colorSpace===ji||Q===dt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt)}e.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment);let j=p(x.image,!1,n.maxTextureSize);j=Je(x,j);const ht=a.convert(x.format,x.colorSpace),Pt=a.convert(x.type);let ut=y(x.internalFormat,ht,Pt,x.normalized,x.colorSpace,x.isVideoTexture);Ut(W,x);let ct;const It=x.mipmaps,Ft=x.isVideoTexture!==!0,Gt=lt.__version===void 0||$===!0,F=nt.dataReady,ot=M(x,j);if(x.isDepthTexture)ut=A(x.format===fn,x.type),Gt&&(Ft?e.texStorage2D(s.TEXTURE_2D,1,ut,j.width,j.height):e.texImage2D(s.TEXTURE_2D,0,ut,j.width,j.height,0,ht,Pt,null));else if(x.isDataTexture)if(It.length>0){Ft&&Gt&&e.texStorage2D(s.TEXTURE_2D,ot,ut,It[0].width,It[0].height);for(let Q=0,dt=It.length;Q<dt;Q++)ct=It[Q],Ft?F&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,ct.width,ct.height,ht,Pt,ct.data):e.texImage2D(s.TEXTURE_2D,Q,ut,ct.width,ct.height,0,ht,Pt,ct.data);x.generateMipmaps=!1}else Ft?(Gt&&e.texStorage2D(s.TEXTURE_2D,ot,ut,j.width,j.height),F&&it(x,j,ht,Pt)):e.texImage2D(s.TEXTURE_2D,0,ut,j.width,j.height,0,ht,Pt,j.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ft&&Gt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,ot,ut,It[0].width,It[0].height,j.depth);for(let Q=0,dt=It.length;Q<dt;Q++)if(ct=It[Q],x.format!==Ke)if(ht!==null)if(Ft){if(F)if(x.layerUpdates.size>0){const vt=Yl(ct.width,ct.height,x.format,x.type);for(const tt of x.layerUpdates){const At=ct.data.subarray(tt*vt/ct.data.BYTES_PER_ELEMENT,(tt+1)*vt/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,tt,ct.width,ct.height,1,ht,At)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,ct.width,ct.height,j.depth,ht,ct.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Q,ut,ct.width,ct.height,j.depth,0,ct.data,0,0);else Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?F&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,ct.width,ct.height,j.depth,ht,Pt,ct.data):e.texImage3D(s.TEXTURE_2D_ARRAY,Q,ut,ct.width,ct.height,j.depth,0,ht,Pt,ct.data)}else{Ft&&Gt&&e.texStorage2D(s.TEXTURE_2D,ot,ut,It[0].width,It[0].height);for(let Q=0,dt=It.length;Q<dt;Q++)ct=It[Q],x.format!==Ke?ht!==null?Ft?F&&e.compressedTexSubImage2D(s.TEXTURE_2D,Q,0,0,ct.width,ct.height,ht,ct.data):e.compressedTexImage2D(s.TEXTURE_2D,Q,ut,ct.width,ct.height,0,ct.data):Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?F&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,ct.width,ct.height,ht,Pt,ct.data):e.texImage2D(s.TEXTURE_2D,Q,ut,ct.width,ct.height,0,ht,Pt,ct.data)}else if(x.isDataArrayTexture)if(Ft){if(Gt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,ot,ut,j.width,j.height,j.depth),F)if(x.layerUpdates.size>0){const Q=Yl(j.width,j.height,x.format,x.type);for(const dt of x.layerUpdates){const vt=j.data.subarray(dt*Q/j.data.BYTES_PER_ELEMENT,(dt+1)*Q/j.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,dt,j.width,j.height,1,ht,Pt,vt)}x.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ht,Pt,j.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,ut,j.width,j.height,j.depth,0,ht,Pt,j.data);else if(x.isData3DTexture)Ft?(Gt&&e.texStorage3D(s.TEXTURE_3D,ot,ut,j.width,j.height,j.depth),F&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ht,Pt,j.data)):e.texImage3D(s.TEXTURE_3D,0,ut,j.width,j.height,j.depth,0,ht,Pt,j.data);else if(x.isFramebufferTexture){if(Gt)if(Ft)e.texStorage2D(s.TEXTURE_2D,ot,ut,j.width,j.height);else{let Q=j.width,dt=j.height;for(let vt=0;vt<ot;vt++)e.texImage2D(s.TEXTURE_2D,vt,ut,Q,dt,0,ht,Pt,null),Q>>=1,dt>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in s){const Q=s.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),j.parentNode!==Q){Q.appendChild(j),u.add(x),Q.onpaint=dt=>{const vt=dt.changedElements;for(const tt of u)vt.includes(tt.image)&&(tt.needsUpdate=!0)},Q.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,j);else{const vt=s.RGBA,tt=s.RGBA,At=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,vt,tt,At,j)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(It.length>0){if(Ft&&Gt){const Q=ne(It[0]);e.texStorage2D(s.TEXTURE_2D,ot,ut,Q.width,Q.height)}for(let Q=0,dt=It.length;Q<dt;Q++)ct=It[Q],Ft?F&&e.texSubImage2D(s.TEXTURE_2D,Q,0,0,ht,Pt,ct):e.texImage2D(s.TEXTURE_2D,Q,ut,ht,Pt,ct);x.generateMipmaps=!1}else if(Ft){if(Gt){const Q=ne(j);e.texStorage2D(s.TEXTURE_2D,ot,ut,Q.width,Q.height)}F&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,ht,Pt,j)}else e.texImage2D(s.TEXTURE_2D,0,ut,ht,Pt,j);m(x)&&b(W),lt.__version=nt.version,x.onUpdate&&x.onUpdate(x)}P.__version=x.version}function Tt(P,x,O){if(x.image.length!==6)return;const W=Z(P,x),$=x.source;e.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+O);const nt=i.get($);if($.version!==nt.__version||W===!0){e.activeTexture(s.TEXTURE0+O);const lt=Jt.getPrimaries(Jt.workingColorSpace),K=x.colorSpace===ji?null:Jt.getPrimaries(x.colorSpace),j=x.colorSpace===ji||lt===K?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const ht=x.isCompressedTexture||x.image[0].isCompressedTexture,Pt=x.image[0]&&x.image[0].isDataTexture,ut=[];for(let tt=0;tt<6;tt++)!ht&&!Pt?ut[tt]=p(x.image[tt],!0,n.maxCubemapSize):ut[tt]=Pt?x.image[tt].image:x.image[tt],ut[tt]=Je(x,ut[tt]);const ct=ut[0],It=a.convert(x.format,x.colorSpace),Ft=a.convert(x.type),Gt=y(x.internalFormat,It,Ft,x.normalized,x.colorSpace),F=x.isVideoTexture!==!0,ot=nt.__version===void 0||W===!0,Q=$.dataReady;let dt=M(x,ct);Ut(s.TEXTURE_CUBE_MAP,x);let vt;if(ht){F&&ot&&e.texStorage2D(s.TEXTURE_CUBE_MAP,dt,Gt,ct.width,ct.height);for(let tt=0;tt<6;tt++){vt=ut[tt].mipmaps;for(let At=0;At<vt.length;At++){const St=vt[At];x.format!==Ke?It!==null?F?Q&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,At,0,0,St.width,St.height,It,St.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,At,Gt,St.width,St.height,0,St.data):Nt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,At,0,0,St.width,St.height,It,Ft,St.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,At,Gt,St.width,St.height,0,It,Ft,St.data)}}}else{if(vt=x.mipmaps,F&&ot){vt.length>0&&dt++;const tt=ne(ut[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,dt,Gt,tt.width,tt.height)}for(let tt=0;tt<6;tt++)if(Pt){F?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,ut[tt].width,ut[tt].height,It,Ft,ut[tt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,Gt,ut[tt].width,ut[tt].height,0,It,Ft,ut[tt].data);for(let At=0;At<vt.length;At++){const ve=vt[At].image[tt].image;F?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,At+1,0,0,ve.width,ve.height,It,Ft,ve.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,At+1,Gt,ve.width,ve.height,0,It,Ft,ve.data)}}else{F?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,It,Ft,ut[tt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,Gt,It,Ft,ut[tt]);for(let At=0;At<vt.length;At++){const St=vt[At];F?Q&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,At+1,0,0,It,Ft,St.image[tt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,At+1,Gt,It,Ft,St.image[tt])}}}m(x)&&b(s.TEXTURE_CUBE_MAP),nt.__version=$.version,x.onUpdate&&x.onUpdate(x)}P.__version=x.version}function Et(P,x,O,W,$,nt){const lt=a.convert(O.format,O.colorSpace),K=a.convert(O.type),j=y(O.internalFormat,lt,K,O.normalized,O.colorSpace),ht=i.get(x),Pt=i.get(O);if(Pt.__renderTarget=x,!ht.__hasExternalTextures){const ut=Math.max(1,x.width>>nt),ct=Math.max(1,x.height>>nt);$===s.TEXTURE_3D||$===s.TEXTURE_2D_ARRAY?e.texImage3D($,nt,j,ut,ct,x.depth,0,lt,K,null):e.texImage2D($,nt,j,ut,ct,0,lt,K,null)}e.bindFramebuffer(s.FRAMEBUFFER,P),Te(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,W,$,Pt.__webglTexture,0,ge(x)):($===s.TEXTURE_2D||$>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,W,$,Pt.__webglTexture,nt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Me(P,x,O){if(s.bindRenderbuffer(s.RENDERBUFFER,P),x.depthBuffer){const W=x.depthTexture,$=W&&W.isDepthTexture?W.type:null,nt=A(x.stencilBuffer,$),lt=x.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Te(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ge(x),nt,x.width,x.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,ge(x),nt,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,nt,x.width,x.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,lt,s.RENDERBUFFER,P)}else{const W=x.textures;for(let $=0;$<W.length;$++){const nt=W[$],lt=a.convert(nt.format,nt.colorSpace),K=a.convert(nt.type),j=y(nt.internalFormat,lt,K,nt.normalized,nt.colorSpace);Te(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ge(x),j,x.width,x.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,ge(x),j,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,j,x.width,x.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Zt(P,x,O){const W=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,P),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const $=i.get(x.depthTexture);if($.__renderTarget=x,(!$.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W){if($.__webglInit===void 0&&($.__webglInit=!0,x.depthTexture.addEventListener("dispose",R)),$.__webglTexture===void 0){$.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),Ut(s.TEXTURE_CUBE_MAP,x.depthTexture);const ht=a.convert(x.depthTexture.format),Pt=a.convert(x.depthTexture.type);let ut;x.depthTexture.format===Gi?ut=s.DEPTH_COMPONENT24:x.depthTexture.format===fn&&(ut=s.DEPTH24_STENCIL8);for(let ct=0;ct<6;ct++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,ut,x.width,x.height,0,ht,Pt,null)}}else J(x.depthTexture,0);const nt=$.__webglTexture,lt=ge(x),K=W?s.TEXTURE_CUBE_MAP_POSITIVE_X+O:s.TEXTURE_2D,j=x.depthTexture.format===fn?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(x.depthTexture.format===Gi)Te(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,j,K,nt,0,lt):s.framebufferTexture2D(s.FRAMEBUFFER,j,K,nt,0);else if(x.depthTexture.format===fn)Te(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,j,K,nt,0,lt):s.framebufferTexture2D(s.FRAMEBUFFER,j,K,nt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function le(P){const x=i.get(P),O=P.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==P.depthTexture){const W=P.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),W){const $=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,W.removeEventListener("dispose",$)};W.addEventListener("dispose",$),x.__depthDisposeCallback=$}x.__boundDepthTexture=W}if(P.depthTexture&&!x.__autoAllocateDepthBuffer)if(O)for(let W=0;W<6;W++)Zt(x.__webglFramebuffer[W],P,W);else{const W=P.texture.mipmaps;W&&W.length>0?Zt(x.__webglFramebuffer[0],P,0):Zt(x.__webglFramebuffer,P,0)}else if(O){x.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[W]),x.__webglDepthbuffer[W]===void 0)x.__webglDepthbuffer[W]=s.createRenderbuffer(),Me(x.__webglDepthbuffer[W],P,!1);else{const $=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,nt=x.__webglDepthbuffer[W];s.bindRenderbuffer(s.RENDERBUFFER,nt),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,nt)}}else{const W=P.texture.mipmaps;if(W&&W.length>0?e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=s.createRenderbuffer(),Me(x.__webglDepthbuffer,P,!1);else{const $=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,nt=x.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,nt),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,nt)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function ee(P,x,O){const W=i.get(P);x!==void 0&&Et(W.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&le(P)}function jt(P){const x=P.texture,O=i.get(P),W=i.get(x);P.addEventListener("dispose",_);const $=P.textures,nt=P.isWebGLCubeRenderTarget===!0,lt=$.length>1;if(lt||(W.__webglTexture===void 0&&(W.__webglTexture=s.createTexture()),W.__version=x.version,r.memory.textures++),nt){O.__webglFramebuffer=[];for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[K]=[];for(let j=0;j<x.mipmaps.length;j++)O.__webglFramebuffer[K][j]=s.createFramebuffer()}else O.__webglFramebuffer[K]=s.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let K=0;K<x.mipmaps.length;K++)O.__webglFramebuffer[K]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(lt)for(let K=0,j=$.length;K<j;K++){const ht=i.get($[K]);ht.__webglTexture===void 0&&(ht.__webglTexture=s.createTexture(),r.memory.textures++)}if(P.samples>0&&Te(P)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let K=0;K<$.length;K++){const j=$[K];O.__webglColorRenderbuffer[K]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[K]);const ht=a.convert(j.format,j.colorSpace),Pt=a.convert(j.type),ut=y(j.internalFormat,ht,Pt,j.normalized,j.colorSpace,P.isXRRenderTarget===!0),ct=ge(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,ct,ut,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+K,s.RENDERBUFFER,O.__webglColorRenderbuffer[K])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),Me(O.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(nt){e.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture),Ut(s.TEXTURE_CUBE_MAP,x);for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)Et(O.__webglFramebuffer[K][j],P,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+K,j);else Et(O.__webglFramebuffer[K],P,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);m(x)&&b(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(lt){for(let K=0,j=$.length;K<j;K++){const ht=$[K],Pt=i.get(ht);let ut=s.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ut=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ut,Pt.__webglTexture),Ut(ut,ht),Et(O.__webglFramebuffer,P,ht,s.COLOR_ATTACHMENT0+K,ut,0),m(ht)&&b(ut)}e.unbindTexture()}else{let K=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(K=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(K,W.__webglTexture),Ut(K,x),x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)Et(O.__webglFramebuffer[j],P,x,s.COLOR_ATTACHMENT0,K,j);else Et(O.__webglFramebuffer,P,x,s.COLOR_ATTACHMENT0,K,0);m(x)&&b(K),e.unbindTexture()}P.depthBuffer&&le(P)}function be(P){const x=P.textures;for(let O=0,W=x.length;O<W;O++){const $=x[O];if(m($)){const nt=C(P),lt=i.get($).__webglTexture;e.bindTexture(nt,lt),b(nt),e.unbindTexture()}}}const Ce=[],Ue=[];function Oe(P){if(P.samples>0){if(Te(P)===!1){const x=P.textures,O=P.width,W=P.height;let $=s.COLOR_BUFFER_BIT;const nt=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=i.get(P),K=x.length>1;if(K)for(let ht=0;ht<x.length;ht++)e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ht,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ht,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,lt.__webglMultisampledFramebuffer);const j=P.texture.mipmaps;j&&j.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,lt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,lt.__webglFramebuffer);for(let ht=0;ht<x.length;ht++){if(P.resolveDepthBuffer&&(P.depthBuffer&&($|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&($|=s.STENCIL_BUFFER_BIT)),K){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,lt.__webglColorRenderbuffer[ht]);const Pt=i.get(x[ht]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Pt,0)}s.blitFramebuffer(0,0,O,W,0,0,O,W,$,s.NEAREST),l===!0&&(Ce.length=0,Ue.length=0,Ce.push(s.COLOR_ATTACHMENT0+ht),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Ce.push(nt),Ue.push(nt),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ue)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ce))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),K)for(let ht=0;ht<x.length;ht++){e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ht,s.RENDERBUFFER,lt.__webglColorRenderbuffer[ht]);const Pt=i.get(x[ht]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,lt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ht,s.TEXTURE_2D,Pt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,lt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const x=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[x])}}}function ge(P){return Math.min(n.maxSamples,P.samples)}function Te(P){const x=i.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function N(P){const x=r.render.frame;c.get(P)!==x&&(c.set(P,x),P.update())}function Je(P,x){const O=P.colorSpace,W=P.format,$=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||O!==Ma&&O!==ji&&(Jt.getTransfer(O)===ie?(W!==Ke||$!==si)&&Nt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Qt("WebGLTextures: Unsupported texture color space:",O)),x}function ne(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(h.width=P.naturalWidth||P.width,h.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(h.width=P.displayWidth,h.height=P.displayHeight):(h.width=P.width,h.height=P.height),h}this.allocateTextureUnit=Y,this.resetTextureUnits=k,this.getTextureUnits=q,this.setTextureUnits=B,this.setTexture2D=J,this.setTexture2DArray=et,this.setTexture3D=at,this.setTextureCube=rt,this.rebindTextures=ee,this.setupRenderTarget=jt,this.updateRenderTargetMipmap=be,this.updateMultisampleRenderTarget=Oe,this.setupDepthRenderbuffer=le,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=Te,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function lg(s,t){function e(i,n=ji){let a;const r=Jt.getTransfer(n);if(i===si)return s.UNSIGNED_BYTE;if(i===Do)return s.UNSIGNED_SHORT_4_4_4_4;if(i===Io)return s.UNSIGNED_SHORT_5_5_5_1;if(i===Zh)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===Jh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===$h)return s.BYTE;if(i===Kh)return s.SHORT;if(i===Rs)return s.UNSIGNED_SHORT;if(i===Lo)return s.INT;if(i===Pi)return s.UNSIGNED_INT;if(i===vi)return s.FLOAT;if(i===je)return s.HALF_FLOAT;if(i===Qh)return s.ALPHA;if(i===jh)return s.RGB;if(i===Ke)return s.RGBA;if(i===Gi)return s.DEPTH_COMPONENT;if(i===fn)return s.DEPTH_STENCIL;if(i===Uo)return s.RED;if(i===Fo)return s.RED_INTEGER;if(i===vn)return s.RG;if(i===No)return s.RG_INTEGER;if(i===zo)return s.RGBA_INTEGER;if(i===fa||i===pa||i===ma||i===ga)if(r===ie)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===fa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===pa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ma)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ga)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===fa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===pa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ma)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ga)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===kr||i===Gr||i===Vr||i===Hr)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===kr)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Gr)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Vr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Hr)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Wr||i===Xr||i===qr||i===Yr||i===$r||i===xa||i===Kr)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===Wr||i===Xr)return r===ie?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===qr)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===Yr)return a.COMPRESSED_R11_EAC;if(i===$r)return a.COMPRESSED_SIGNED_R11_EAC;if(i===xa)return a.COMPRESSED_RG11_EAC;if(i===Kr)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Zr||i===Jr||i===Qr||i===jr||i===to||i===eo||i===io||i===no||i===so||i===ao||i===ro||i===oo||i===lo||i===ho)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Zr)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Jr)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Qr)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===jr)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===to)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===eo)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===io)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===no)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===so)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ao)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ro)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===oo)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===lo)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ho)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===co||i===uo||i===fo)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===co)return r===ie?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===uo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===fo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===po||i===mo||i===ya||i===go)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===po)return a.COMPRESSED_RED_RGTC1_EXT;if(i===mo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ya)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===go)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Cs?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:e}}const hg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,cg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class dg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new cc(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new re({vertexShader:hg,fragmentShader:cg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new U(new Be(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ug extends xn{constructor(t,e){super();const i=this;let n=null,a=1,r=null,o="local-floor",l=1,h=null,c=null,u=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",p=new dg,m={},b=e.getContextAttributes();let C=null,y=null;const A=[],M=[],R=new gt;let _=null;const E=new We;E.viewport=new pe;const D=new We;D.viewport=new pe;const L=[E,D],I=new xu;let k=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let st=A[Z];return st===void 0&&(st=new qa,A[Z]=st),st.getTargetRaySpace()},this.getControllerGrip=function(Z){let st=A[Z];return st===void 0&&(st=new qa,A[Z]=st),st.getGripSpace()},this.getHand=function(Z){let st=A[Z];return st===void 0&&(st=new qa,A[Z]=st),st.getHandSpace()};function B(Z){const st=M.indexOf(Z.inputSource);if(st===-1)return;const it=A[st];it!==void 0&&(it.update(Z.inputSource,Z.frame,h||r),it.dispatchEvent({type:Z.type,data:Z.inputSource}))}function Y(){n.removeEventListener("select",B),n.removeEventListener("selectstart",B),n.removeEventListener("selectend",B),n.removeEventListener("squeeze",B),n.removeEventListener("squeezestart",B),n.removeEventListener("squeezeend",B),n.removeEventListener("end",Y),n.removeEventListener("inputsourceschange",H);for(let Z=0;Z<A.length;Z++){const st=M[Z];st!==null&&(M[Z]=null,A[Z].disconnect(st))}k=null,q=null,p.reset();for(const Z in m)delete m[Z];t.setRenderTarget(C),f=null,d=null,u=null,n=null,y=null,Ut.stop(),i.isPresenting=!1,t.setPixelRatio(_),t.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){a=Z,i.isPresenting===!0&&Nt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,i.isPresenting===!0&&Nt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||r},this.setReferenceSpace=function(Z){h=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(n,e)),u},this.getFrame=function(){return g},this.getSession=function(){return n},this.setSession=async function(Z){if(n=Z,n!==null){if(C=t.getRenderTarget(),n.addEventListener("select",B),n.addEventListener("selectstart",B),n.addEventListener("selectend",B),n.addEventListener("squeeze",B),n.addEventListener("squeezestart",B),n.addEventListener("squeezeend",B),n.addEventListener("end",Y),n.addEventListener("inputsourceschange",H),b.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let it=null,Mt=null,Tt=null;b.depth&&(Tt=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=b.stencil?fn:Gi,Mt=b.stencil?Cs:Pi);const Et={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:a};u=this.getBinding(),d=u.createProjectionLayer(Et),n.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Ze(d.textureWidth,d.textureHeight,{format:Ke,type:si,depthTexture:new Qn(d.textureWidth,d.textureHeight,Mt,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const it={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(n,e,it),n.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Ze(f.framebufferWidth,f.framebufferHeight,{format:Ke,type:si,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),h=null,r=await n.requestReferenceSpace(o),Ut.setContext(n),Ut.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function H(Z){for(let st=0;st<Z.removed.length;st++){const it=Z.removed[st],Mt=M.indexOf(it);Mt>=0&&(M[Mt]=null,A[Mt].disconnect(it))}for(let st=0;st<Z.added.length;st++){const it=Z.added[st];let Mt=M.indexOf(it);if(Mt===-1){for(let Et=0;Et<A.length;Et++)if(Et>=M.length){M.push(it),Mt=Et;break}else if(M[Et]===null){M[Et]=it,Mt=Et;break}if(Mt===-1)break}const Tt=A[Mt];Tt&&Tt.connect(it)}}const J=new S,et=new S;function at(Z,st,it){J.setFromMatrixPosition(st.matrixWorld),et.setFromMatrixPosition(it.matrixWorld);const Mt=J.distanceTo(et),Tt=st.projectionMatrix.elements,Et=it.projectionMatrix.elements,Me=Tt[14]/(Tt[10]-1),Zt=Tt[14]/(Tt[10]+1),le=(Tt[9]+1)/Tt[5],ee=(Tt[9]-1)/Tt[5],jt=(Tt[8]-1)/Tt[0],be=(Et[8]+1)/Et[0],Ce=Me*jt,Ue=Me*be,Oe=Mt/(-jt+be),ge=Oe*-jt;if(st.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ge),Z.translateZ(Oe),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Tt[10]===-1)Z.projectionMatrix.copy(st.projectionMatrix),Z.projectionMatrixInverse.copy(st.projectionMatrixInverse);else{const Te=Me+Oe,N=Zt+Oe,Je=Ce-ge,ne=Ue+(Mt-ge),P=le*Zt/N*Te,x=ee*Zt/N*Te;Z.projectionMatrix.makePerspective(Je,ne,P,x,Te,N),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function rt(Z,st){st===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(st.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(n===null)return;let st=Z.near,it=Z.far;p.texture!==null&&(p.depthNear>0&&(st=p.depthNear),p.depthFar>0&&(it=p.depthFar)),I.near=D.near=E.near=st,I.far=D.far=E.far=it,(k!==I.near||q!==I.far)&&(n.updateRenderState({depthNear:I.near,depthFar:I.far}),k=I.near,q=I.far),I.layers.mask=Z.layers.mask|6,E.layers.mask=I.layers.mask&-5,D.layers.mask=I.layers.mask&-3;const Mt=Z.parent,Tt=I.cameras;rt(I,Mt);for(let Et=0;Et<Tt.length;Et++)rt(Tt[Et],Mt);Tt.length===2?at(I,E,D):I.projectionMatrix.copy(E.projectionMatrix),_t(Z,I,Mt)};function _t(Z,st,it){it===null?Z.matrix.copy(st.matrixWorld):(Z.matrix.copy(it.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(st.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(st.projectionMatrix),Z.projectionMatrixInverse.copy(st.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Jn*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(I)},this.getCameraTexture=function(Z){return m[Z]};let Yt=null;function Ot(Z,st){if(c=st.getViewerPose(h||r),g=st,c!==null){const it=c.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let Mt=!1;it.length!==I.cameras.length&&(I.cameras.length=0,Mt=!0);for(let Zt=0;Zt<it.length;Zt++){const le=it[Zt];let ee=null;if(f!==null)ee=f.getViewport(le);else{const be=u.getViewSubImage(d,le);ee=be.viewport,Zt===0&&(t.setRenderTargetTextures(y,be.colorTexture,be.depthStencilTexture),t.setRenderTarget(y))}let jt=L[Zt];jt===void 0&&(jt=new We,jt.layers.enable(Zt),jt.viewport=new pe,L[Zt]=jt),jt.matrix.fromArray(le.transform.matrix),jt.matrix.decompose(jt.position,jt.quaternion,jt.scale),jt.projectionMatrix.fromArray(le.projectionMatrix),jt.projectionMatrixInverse.copy(jt.projectionMatrix).invert(),jt.viewport.set(ee.x,ee.y,ee.width,ee.height),Zt===0&&(I.matrix.copy(jt.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Mt===!0&&I.cameras.push(jt)}const Tt=n.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&v){u=i.getBinding();const Zt=u.getDepthInformation(it[0]);Zt&&Zt.isValid&&Zt.texture&&p.init(Zt,n.renderState)}if(Tt&&Tt.includes("camera-access")&&v){t.state.unbindTexture(),u=i.getBinding();for(let Zt=0;Zt<it.length;Zt++){const le=it[Zt].camera;if(le){let ee=m[le];ee||(ee=new cc,m[le]=ee);const jt=u.getCameraImage(le);ee.sourceTexture=jt}}}}for(let it=0;it<A.length;it++){const Mt=M[it],Tt=A[it];Mt!==null&&Tt!==void 0&&Tt.update(Mt,st,h||r)}Yt&&Yt(Z,st),st.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:st}),g=null}const Ut=new gc;Ut.setAnimationLoop(Ot),this.setAnimationLoop=function(Z){Yt=Z},this.dispose=function(){}}}const fg=new Wt,Sc=new Bt;Sc.set(-1,0,0,0,1,0,0,0,1);function pg(s,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,dc(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function n(p,m,b,C,y){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?a(p,m):m.isMeshLambertMaterial?(a(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(a(p,m),u(p,m)):m.isMeshPhongMaterial?(a(p,m),c(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(a(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,y)):m.isMeshMatcapMaterial?(a(p,m),g(p,m)):m.isMeshDepthMaterial?a(p,m):m.isMeshDistanceMaterial?(a(p,m),v(p,m)):m.isMeshNormalMaterial?a(p,m):m.isLineBasicMaterial?(r(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,b,C):m.isSpriteMaterial?h(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function a(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Xe&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Xe&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const b=t.get(m),C=b.envMap,y=b.envMapRotation;C&&(p.envMap.value=C,p.envMapRotation.value.setFromMatrix4(fg.makeRotationFromEuler(y)).transpose(),C.isCubeTexture&&C.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Sc),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function r(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,b,C){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*b,p.scale.value=C*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,b){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Xe&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function v(p,m){const b=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function mg(s,t,e,i){let n={},a={},r=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,A){const M=A.program;i.uniformBlockBinding(y,M)}function h(y,A){let M=n[y.id];M===void 0&&(p(y),M=c(y),n[y.id]=M,y.addEventListener("dispose",b));const R=A.program;i.updateUBOMapping(y,R);const _=t.render.frame;a[y.id]!==_&&(d(y),a[y.id]=_)}function c(y){const A=u();y.__bindingPointIndex=A;const M=s.createBuffer(),R=y.__size,_=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,R,_),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,A,M),M}function u(){for(let y=0;y<o;y++)if(r.indexOf(y)===-1)return r.push(y),y;return Qt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const A=n[y.id],M=y.uniforms,R=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,A);for(let _=0,E=M.length;_<E;_++){const D=M[_];if(Array.isArray(D))for(let L=0,I=D.length;L<I;L++)f(D[L],_,L,R);else f(D,_,0,R)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,A,M,R){if(v(y,A,M,R)===!0){const _=y.__offset,E=y.value;if(Array.isArray(E)){let D=0;for(let L=0;L<E.length;L++){const I=E[L],k=m(I);g(I,y.__data,D),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(D+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(E,y.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,_,y.__data)}}function g(y,A,M){typeof y=="number"||typeof y=="boolean"?A[0]=y:y.isMatrix3?(A[0]=y.elements[0],A[1]=y.elements[1],A[2]=y.elements[2],A[3]=0,A[4]=y.elements[3],A[5]=y.elements[4],A[6]=y.elements[5],A[7]=0,A[8]=y.elements[6],A[9]=y.elements[7],A[10]=y.elements[8],A[11]=0):ArrayBuffer.isView(y)?A.set(new y.constructor(y.buffer,y.byteOffset,A.length)):y.toArray(A,M)}function v(y,A,M,R){const _=y.value,E=A+"_"+M;if(R[E]===void 0)return typeof _=="number"||typeof _=="boolean"?R[E]=_:ArrayBuffer.isView(_)?R[E]=_.slice():R[E]=_.clone(),!0;{const D=R[E];if(typeof _=="number"||typeof _=="boolean"){if(D!==_)return R[E]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(D.equals(_)===!1)return D.copy(_),!0}}return!1}function p(y){const A=y.uniforms;let M=0;const R=16;for(let E=0,D=A.length;E<D;E++){const L=Array.isArray(A[E])?A[E]:[A[E]];for(let I=0,k=L.length;I<k;I++){const q=L[I],B=Array.isArray(q.value)?q.value:[q.value];for(let Y=0,H=B.length;Y<H;Y++){const J=B[Y],et=m(J),at=M%R,rt=at%et.boundary,_t=at+rt;M+=rt,_t!==0&&R-_t<et.storage&&(M+=R-_t),q.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),q.__offset=M,M+=et.storage}}}const _=M%R;return _>0&&(M+=R-_),y.__size=M,y.__cache={},this}function m(y){const A={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(A.boundary=4,A.storage=4):y.isVector2?(A.boundary=8,A.storage=8):y.isVector3||y.isColor?(A.boundary=16,A.storage=12):y.isVector4?(A.boundary=16,A.storage=16):y.isMatrix3?(A.boundary=48,A.storage=48):y.isMatrix4?(A.boundary=64,A.storage=64):y.isTexture?Nt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(A.boundary=16,A.storage=y.byteLength):Nt("WebGLRenderer: Unsupported uniform value type.",y),A}function b(y){const A=y.target;A.removeEventListener("dispose",b);const M=r.indexOf(A.__bindingPointIndex);r.splice(M,1),s.deleteBuffer(n[A.id]),delete n[A.id],delete a[A.id]}function C(){for(const y in n)s.deleteBuffer(n[y]);r=[],n={},a={}}return{bind:l,update:h,dispose:C}}const gg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Si=null;function vg(){return Si===null&&(Si=new is(gg,16,16,vn,je),Si.name="DFG_LUT",Si.minFilter=Re,Si.magFilter=Re,Si.wrapS=zi,Si.wrapT=zi,Si.generateMipmaps=!1,Si.needsUpdate=!0),Si}class _g{constructor(t={}){const{canvas:e=vd(),context:i=null,depth:n=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:h=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=si}=t;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=r;const v=f,p=new Set([zo,No,Fo]),m=new Set([si,Pi,Rs,Cs,Do,Io]),b=new Uint32Array(4),C=new Int32Array(4),y=new S;let A=null,M=null;const R=[],_=[];let E=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const D=this;let L=!1,I=null,k=null,q=null,B=null;this._outputColorSpace=Ne;let Y=0,H=0,J=null,et=-1,at=null;const rt=new pe,_t=new pe;let Yt=null;const Ot=new Ct(0);let Ut=0,Z=e.width,st=e.height,it=1,Mt=null,Tt=null;const Et=new pe(0,0,Z,st),Me=new pe(0,0,Z,st);let Zt=!1;const le=new Xo;let ee=!1,jt=!1;const be=new Wt,Ce=new S,Ue=new pe,Oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ge=!1;function Te(){return J===null?it:1}let N=i;function Je(w,z){return e.getContext(w,z)}try{const w={alpha:!0,depth:n,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:h,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${bo}`),e.addEventListener("webglcontextlost",ve,!1),e.addEventListener("webglcontextrestored",de,!1),e.addEventListener("webglcontextcreationerror",xi,!1),N===null){const z="webgl2";if(N=Je(z,w),N===null)throw Je(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(w){throw Qt("WebGLRenderer: "+w.message),w}let ne,P,x,O,W,$,nt,lt,K,j,ht,Pt,ut,ct,It,Ft,Gt,F,ot,Q,dt,vt,tt;function At(){ne=new v0(N),ne.init(),dt=new lg(N,ne),P=new h0(N,ne,t,dt),x=new rg(N,ne),P.reversedDepthBuffer&&d&&x.buffers.depth.setReversed(!0),k=N.createFramebuffer(),q=N.createFramebuffer(),B=N.createFramebuffer(),O=new y0(N),W=new qm,$=new og(N,ne,x,W,P,dt,O),nt=new g0(D),lt=new Su(N),vt=new o0(N,lt),K=new _0(N,lt,O,vt),j=new w0(N,K,lt,vt,O),F=new M0(N,P,$),It=new c0(W),ht=new Xm(D,nt,ne,P,vt,It),Pt=new pg(D,W),ut=new $m,ct=new tg(ne),Gt=new r0(D,nt,x,j,g,l),Ft=new ag(D,j,P),tt=new mg(N,O,P,x),ot=new l0(N,ne,O),Q=new x0(N,ne,O),O.programs=ht.programs,D.capabilities=P,D.extensions=ne,D.properties=W,D.renderLists=ut,D.shadowMap=Ft,D.state=x,D.info=O}At(),v!==si&&(E=new b0(v,e.width,e.height,o,n,a));const St=new ug(D,N);this.xr=St,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const w=ne.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=ne.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return it},this.setPixelRatio=function(w){w!==void 0&&(it=w,this.setSize(Z,st,!1))},this.getSize=function(w){return w.set(Z,st)},this.setSize=function(w,z,X=!0){if(St.isPresenting){Nt("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=w,st=z,e.width=Math.floor(w*it),e.height=Math.floor(z*it),X===!0&&(e.style.width=w+"px",e.style.height=z+"px"),E!==null&&E.setSize(e.width,e.height),this.setViewport(0,0,w,z)},this.getDrawingBufferSize=function(w){return w.set(Z*it,st*it).floor()},this.setDrawingBufferSize=function(w,z,X){Z=w,st=z,it=X,e.width=Math.floor(w*X),e.height=Math.floor(z*X),this.setViewport(0,0,w,z)},this.setEffects=function(w){if(v===si){Qt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let z=0;z<w.length;z++)if(w[z].isOutputPass===!0){Nt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(rt)},this.getViewport=function(w){return w.copy(Et)},this.setViewport=function(w,z,X,G){w.isVector4?Et.set(w.x,w.y,w.z,w.w):Et.set(w,z,X,G),x.viewport(rt.copy(Et).multiplyScalar(it).round())},this.getScissor=function(w){return w.copy(Me)},this.setScissor=function(w,z,X,G){w.isVector4?Me.set(w.x,w.y,w.z,w.w):Me.set(w,z,X,G),x.scissor(_t.copy(Me).multiplyScalar(it).round())},this.getScissorTest=function(){return Zt},this.setScissorTest=function(w){x.setScissorTest(Zt=w)},this.setOpaqueSort=function(w){Mt=w},this.setTransparentSort=function(w){Tt=w},this.getClearColor=function(w){return w.copy(Gt.getClearColor())},this.setClearColor=function(){Gt.setClearColor(...arguments)},this.getClearAlpha=function(){return Gt.getClearAlpha()},this.setClearAlpha=function(){Gt.setClearAlpha(...arguments)},this.clear=function(w=!0,z=!0,X=!0){let G=0;if(w){let V=!1;if(J!==null){const mt=J.texture.format;V=p.has(mt)}if(V){const mt=J.texture.type,yt=m.has(mt),pt=Gt.getClearColor(),bt=Gt.getClearAlpha(),Lt=pt.r,Vt=pt.g,qt=pt.b;yt?(b[0]=Lt,b[1]=Vt,b[2]=qt,b[3]=bt,N.clearBufferuiv(N.COLOR,0,b)):(C[0]=Lt,C[1]=Vt,C[2]=qt,C[3]=bt,N.clearBufferiv(N.COLOR,0,C))}else G|=N.COLOR_BUFFER_BIT}z&&(G|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(G|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&N.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),I=w},this.dispose=function(){e.removeEventListener("webglcontextlost",ve,!1),e.removeEventListener("webglcontextrestored",de,!1),e.removeEventListener("webglcontextcreationerror",xi,!1),Gt.dispose(),ut.dispose(),ct.dispose(),W.dispose(),nt.dispose(),j.dispose(),vt.dispose(),tt.dispose(),ht.dispose(),St.dispose(),St.removeEventListener("sessionstart",sl),St.removeEventListener("sessionend",al),an.stop()};function ve(w){w.preventDefault(),ba("WebGLRenderer: Context Lost."),L=!0}function de(){ba("WebGLRenderer: Context Restored."),L=!1;const w=O.autoReset,z=Ft.enabled,X=Ft.autoUpdate,G=Ft.needsUpdate,V=Ft.type;At(),O.autoReset=w,Ft.enabled=z,Ft.autoUpdate=X,Ft.needsUpdate=G,Ft.type=V}function xi(w){Qt("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function yi(w){const z=w.target;z.removeEventListener("dispose",yi),Pc(z)}function Pc(w){Lc(w),W.remove(w)}function Lc(w){const z=W.get(w).programs;z!==void 0&&(z.forEach(function(X){ht.releaseProgram(X)}),w.isShaderMaterial&&ht.releaseShaderCache(w))}this.renderBufferDirect=function(w,z,X,G,V,mt){z===null&&(z=Oe);const yt=V.isMesh&&V.matrixWorld.determinantAffine()<0,pt=Uc(w,z,X,G,V);x.setMaterial(G,yt);let bt=X.index,Lt=1;if(G.wireframe===!0){if(bt=K.getWireframeAttribute(X),bt===void 0)return;Lt=2}const Vt=X.drawRange,qt=X.attributes.position;let Dt=Vt.start*Lt,oe=(Vt.start+Vt.count)*Lt;mt!==null&&(Dt=Math.max(Dt,mt.start*Lt),oe=Math.min(oe,(mt.start+mt.count)*Lt)),bt!==null?(Dt=Math.max(Dt,0),oe=Math.min(oe,bt.count)):qt!=null&&(Dt=Math.max(Dt,0),oe=Math.min(oe,qt.count));const we=oe-Dt;if(we<0||we===1/0)return;vt.setup(V,G,pt,X,bt);let _e,he=ot;if(bt!==null&&(_e=lt.get(bt),he=Q,he.setIndex(_e)),V.isMesh)G.wireframe===!0?(x.setLineWidth(G.wireframeLinewidth*Te()),he.setMode(N.LINES)):he.setMode(N.TRIANGLES);else if(V.isLine){let Ge=G.linewidth;Ge===void 0&&(Ge=1),x.setLineWidth(Ge*Te()),V.isLineSegments?he.setMode(N.LINES):V.isLineLoop?he.setMode(N.LINE_LOOP):he.setMode(N.LINE_STRIP)}else V.isPoints?he.setMode(N.POINTS):V.isSprite&&he.setMode(N.TRIANGLES);if(V.isBatchedMesh)if(ne.get("WEBGL_multi_draw"))he.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Ge=V._multiDrawStarts,xt=V._multiDrawCounts,ei=V._multiDrawCount,te=bt?lt.get(bt).bytesPerElement:1,ai=W.get(G).currentProgram.getUniforms();for(let Mi=0;Mi<ei;Mi++)ai.setValue(N,"_gl_DrawID",Mi),he.render(Ge[Mi]/te,xt[Mi])}else if(V.isInstancedMesh)he.renderInstances(Dt,we,V.count);else if(X.isInstancedBufferGeometry){const Ge=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,xt=Math.min(X.instanceCount,Ge);he.renderInstances(Dt,we,xt)}else he.render(Dt,we)};function nl(w,z,X){w.transparent===!0&&w.side===Qe&&w.forceSinglePass===!1?(w.side=Xe,w.needsUpdate=!0,Is(w,z,X),w.side=nn,w.needsUpdate=!0,Is(w,z,X),w.side=Qe):Is(w,z,X)}this.compile=function(w,z,X=null){X===null&&(X=w),M=ct.get(X),M.init(z),_.push(M),X.traverseVisible(function(V){V.isLight&&V.layers.test(z.layers)&&(M.pushLight(V),V.castShadow&&M.pushShadow(V))}),w!==X&&w.traverseVisible(function(V){V.isLight&&V.layers.test(z.layers)&&(M.pushLight(V),V.castShadow&&M.pushShadow(V))}),M.setupLights();const G=new Set;return w.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const mt=V.material;if(mt)if(Array.isArray(mt))for(let yt=0;yt<mt.length;yt++){const pt=mt[yt];nl(pt,X,V),G.add(pt)}else nl(mt,X,V),G.add(mt)}),M=_.pop(),G},this.compileAsync=function(w,z,X=null){const G=this.compile(w,z,X);return new Promise(V=>{function mt(){if(G.forEach(function(yt){W.get(yt).currentProgram.isReady()&&G.delete(yt)}),G.size===0){V(w);return}setTimeout(mt,10)}ne.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let Na=null;function Dc(w){Na&&Na(w)}function sl(){an.stop()}function al(){an.start()}const an=new gc;an.setAnimationLoop(Dc),typeof self<"u"&&an.setContext(self),this.setAnimationLoop=function(w){Na=w,St.setAnimationLoop(w),w===null?an.stop():an.start()},St.addEventListener("sessionstart",sl),St.addEventListener("sessionend",al),this.render=function(w,z){if(z!==void 0&&z.isCamera!==!0){Qt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;I!==null&&I.renderStart(w,z);const X=St.enabled===!0&&St.isPresenting===!0,G=E!==null&&(J===null||X)&&E.begin(D,J);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),St.enabled===!0&&St.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(St.cameraAutoUpdate===!0&&St.updateCamera(z),z=St.getCamera()),w.isScene===!0&&w.onBeforeRender(D,w,z,J),M=ct.get(w,_.length),M.init(z),M.state.textureUnits=$.getTextureUnits(),_.push(M),be.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),le.setFromProjectionMatrix(be,Ti,z.reversedDepth),jt=this.localClippingEnabled,ee=It.init(this.clippingPlanes,jt),A=ut.get(w,R.length),A.init(),R.push(A),St.enabled===!0&&St.isPresenting===!0){const yt=D.xr.getDepthSensingMesh();yt!==null&&za(yt,z,-1/0,D.sortObjects)}za(w,z,0,D.sortObjects),A.finish(),D.sortObjects===!0&&A.sort(Mt,Tt,z.reversedDepth),ge=St.enabled===!1||St.isPresenting===!1||St.hasDepthSensing()===!1,ge&&Gt.addToRenderList(A,w),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ee===!0&&It.beginShadows();const V=M.state.shadowsArray;if(Ft.render(V,w,z),ee===!0&&It.endShadows(),(G&&E.hasRenderPass())===!1){const yt=A.opaque,pt=A.transmissive;if(M.setupLights(),z.isArrayCamera){const bt=z.cameras;if(pt.length>0)for(let Lt=0,Vt=bt.length;Lt<Vt;Lt++){const qt=bt[Lt];ol(yt,pt,w,qt)}ge&&Gt.render(w);for(let Lt=0,Vt=bt.length;Lt<Vt;Lt++){const qt=bt[Lt];rl(A,w,qt,qt.viewport)}}else pt.length>0&&ol(yt,pt,w,z),ge&&Gt.render(w),rl(A,w,z)}J!==null&&H===0&&($.updateMultisampleRenderTarget(J),$.updateRenderTargetMipmap(J)),G&&E.end(D),w.isScene===!0&&w.onAfterRender(D,w,z),vt.resetDefaultState(),et=-1,at=null,_.pop(),_.length>0?(M=_[_.length-1],$.setTextureUnits(M.state.textureUnits),ee===!0&&It.setGlobalState(D.clippingPlanes,M.state.camera)):M=null,R.pop(),R.length>0?A=R[R.length-1]:A=null,I!==null&&I.renderEnd()};function za(w,z,X,G){if(w.visible===!1)return;if(w.layers.test(z.layers)){if(w.isGroup)X=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(z);else if(w.isLightProbeGrid)M.pushLightProbeGrid(w);else if(w.isLight)M.pushLight(w),w.castShadow&&M.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||le.intersectsSprite(w)){G&&Ue.setFromMatrixPosition(w.matrixWorld).applyMatrix4(be);const yt=j.update(w),pt=w.material;pt.visible&&A.push(w,yt,pt,X,Ue.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||le.intersectsObject(w))){const yt=j.update(w),pt=w.material;if(G&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ue.copy(w.boundingSphere.center)):(yt.boundingSphere===null&&yt.computeBoundingSphere(),Ue.copy(yt.boundingSphere.center)),Ue.applyMatrix4(w.matrixWorld).applyMatrix4(be)),Array.isArray(pt)){const bt=yt.groups;for(let Lt=0,Vt=bt.length;Lt<Vt;Lt++){const qt=bt[Lt],Dt=pt[qt.materialIndex];Dt&&Dt.visible&&A.push(w,yt,Dt,X,Ue.z,qt)}}else pt.visible&&A.push(w,yt,pt,X,Ue.z,null)}}const mt=w.children;for(let yt=0,pt=mt.length;yt<pt;yt++)za(mt[yt],z,X,G)}function rl(w,z,X,G){const{opaque:V,transmissive:mt,transparent:yt}=w;M.setupLightsView(X),ee===!0&&It.setGlobalState(D.clippingPlanes,X),G&&x.viewport(rt.copy(G)),V.length>0&&Ds(V,z,X),mt.length>0&&Ds(mt,z,X),yt.length>0&&Ds(yt,z,X),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function ol(w,z,X,G){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[G.id]===void 0){const Dt=ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[G.id]=new Ze(1,1,{generateMipmaps:!0,type:Dt?je:si,minFilter:gi,samples:Math.max(4,P.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Jt.workingColorSpace})}const mt=M.state.transmissionRenderTarget[G.id],yt=G.viewport||rt;mt.setSize(yt.z*D.transmissionResolutionScale,yt.w*D.transmissionResolutionScale);const pt=D.getRenderTarget(),bt=D.getActiveCubeFace(),Lt=D.getActiveMipmapLevel();D.setRenderTarget(mt),D.getClearColor(Ot),Ut=D.getClearAlpha(),Ut<1&&D.setClearColor(16777215,.5),D.clear(),ge&&Gt.render(X);const Vt=D.toneMapping;D.toneMapping=Ri;const qt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),M.setupLightsView(G),ee===!0&&It.setGlobalState(D.clippingPlanes,G),Ds(w,X,G),$.updateMultisampleRenderTarget(mt),$.updateRenderTargetMipmap(mt),ne.has("WEBGL_multisampled_render_to_texture")===!1){let Dt=!1;for(let oe=0,we=z.length;oe<we;oe++){const _e=z[oe],{object:he,geometry:Ge,material:xt,group:ei}=_e;if(xt.side===Qe&&he.layers.test(G.layers)){const te=xt.side;xt.side=Xe,xt.needsUpdate=!0,ll(he,X,G,Ge,xt,ei),xt.side=te,xt.needsUpdate=!0,Dt=!0}}Dt===!0&&($.updateMultisampleRenderTarget(mt),$.updateRenderTargetMipmap(mt))}D.setRenderTarget(pt,bt,Lt),D.setClearColor(Ot,Ut),qt!==void 0&&(G.viewport=qt),D.toneMapping=Vt}function Ds(w,z,X){const G=z.isScene===!0?z.overrideMaterial:null;for(let V=0,mt=w.length;V<mt;V++){const yt=w[V],{object:pt,geometry:bt,group:Lt}=yt;let Vt=yt.material;Vt.allowOverride===!0&&G!==null&&(Vt=G),pt.layers.test(X.layers)&&ll(pt,z,X,bt,Vt,Lt)}}function ll(w,z,X,G,V,mt){w.onBeforeRender(D,z,X,G,V,mt),w.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),V.onBeforeRender(D,z,X,G,w,mt),V.transparent===!0&&V.side===Qe&&V.forceSinglePass===!1?(V.side=Xe,V.needsUpdate=!0,D.renderBufferDirect(X,z,G,V,w,mt),V.side=nn,V.needsUpdate=!0,D.renderBufferDirect(X,z,G,V,w,mt),V.side=Qe):D.renderBufferDirect(X,z,G,V,w,mt),w.onAfterRender(D,z,X,G,V,mt)}function Is(w,z,X){z.isScene!==!0&&(z=Oe);const G=W.get(w),V=M.state.lights,mt=M.state.shadowsArray,yt=V.state.version,pt=ht.getParameters(w,V.state,mt,z,X,M.state.lightProbeGridArray),bt=ht.getProgramCacheKey(pt);let Lt=G.programs;G.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?z.environment:null,G.fog=z.fog;const Vt=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;G.envMap=nt.get(w.envMap||G.environment,Vt),G.envMapRotation=G.environment!==null&&w.envMap===null?z.environmentRotation:w.envMapRotation,Lt===void 0&&(w.addEventListener("dispose",yi),Lt=new Map,G.programs=Lt);let qt=Lt.get(bt);if(qt!==void 0){if(G.currentProgram===qt&&G.lightsStateVersion===yt)return cl(w,pt),qt}else pt.uniforms=ht.getUniforms(w),I!==null&&w.isNodeMaterial&&I.build(w,X,pt),w.onBeforeCompile(pt,D),qt=ht.acquireProgram(pt,bt),Lt.set(bt,qt),G.uniforms=pt.uniforms;const Dt=G.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Dt.clippingPlanes=It.uniform),cl(w,pt),G.needsLights=Nc(w),G.lightsStateVersion=yt,G.needsLights&&(Dt.ambientLightColor.value=V.state.ambient,Dt.lightProbe.value=V.state.probe,Dt.directionalLights.value=V.state.directional,Dt.directionalLightShadows.value=V.state.directionalShadow,Dt.spotLights.value=V.state.spot,Dt.spotLightShadows.value=V.state.spotShadow,Dt.rectAreaLights.value=V.state.rectArea,Dt.ltc_1.value=V.state.rectAreaLTC1,Dt.ltc_2.value=V.state.rectAreaLTC2,Dt.pointLights.value=V.state.point,Dt.pointLightShadows.value=V.state.pointShadow,Dt.hemisphereLights.value=V.state.hemi,Dt.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Dt.spotLightMatrix.value=V.state.spotLightMatrix,Dt.spotLightMap.value=V.state.spotLightMap,Dt.pointShadowMatrix.value=V.state.pointShadowMatrix),G.lightProbeGrid=M.state.lightProbeGridArray.length>0,G.currentProgram=qt,G.uniformsList=null,qt}function hl(w){if(w.uniformsList===null){const z=w.currentProgram.getUniforms();w.uniformsList=va.seqWithValue(z.seq,w.uniforms)}return w.uniformsList}function cl(w,z){const X=W.get(w);X.outputColorSpace=z.outputColorSpace,X.batching=z.batching,X.batchingColor=z.batchingColor,X.instancing=z.instancing,X.instancingColor=z.instancingColor,X.instancingMorph=z.instancingMorph,X.skinning=z.skinning,X.morphTargets=z.morphTargets,X.morphNormals=z.morphNormals,X.morphColors=z.morphColors,X.morphTargetsCount=z.morphTargetsCount,X.numClippingPlanes=z.numClippingPlanes,X.numIntersection=z.numClipIntersection,X.vertexAlphas=z.vertexAlphas,X.vertexTangents=z.vertexTangents,X.toneMapping=z.toneMapping}function Ic(w,z){if(w.length===0)return null;if(w.length===1)return w[0].texture!==null?w[0]:null;y.setFromMatrixPosition(z.matrixWorld);for(let X=0,G=w.length;X<G;X++){const V=w[X];if(V.texture!==null&&V.boundingBox.containsPoint(y))return V}return null}function Uc(w,z,X,G,V){z.isScene!==!0&&(z=Oe),$.resetTextureUnits();const mt=z.fog,yt=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?z.environment:null,pt=J===null?D.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Jt.workingColorSpace,bt=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Lt=nt.get(G.envMap||yt,bt),Vt=G.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,qt=!!X.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Dt=!!X.morphAttributes.position,oe=!!X.morphAttributes.normal,we=!!X.morphAttributes.color;let _e=Ri;G.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(_e=D.toneMapping);const he=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Ge=he!==void 0?he.length:0,xt=W.get(G),ei=M.state.lights;if(ee===!0&&(jt===!0||w!==at)){const ue=w===at&&G.id===et;It.setState(G,w,ue)}let te=!1;G.version===xt.__version?(xt.needsLights&&xt.lightsStateVersion!==ei.state.version||xt.outputColorSpace!==pt||V.isBatchedMesh&&xt.batching===!1||!V.isBatchedMesh&&xt.batching===!0||V.isBatchedMesh&&xt.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&xt.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&xt.instancing===!1||!V.isInstancedMesh&&xt.instancing===!0||V.isSkinnedMesh&&xt.skinning===!1||!V.isSkinnedMesh&&xt.skinning===!0||V.isInstancedMesh&&xt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&xt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&xt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&xt.instancingMorph===!1&&V.morphTexture!==null||xt.envMap!==Lt||G.fog===!0&&xt.fog!==mt||xt.numClippingPlanes!==void 0&&(xt.numClippingPlanes!==It.numPlanes||xt.numIntersection!==It.numIntersection)||xt.vertexAlphas!==Vt||xt.vertexTangents!==qt||xt.morphTargets!==Dt||xt.morphNormals!==oe||xt.morphColors!==we||xt.toneMapping!==_e||xt.morphTargetsCount!==Ge||!!xt.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(te=!0):(te=!0,xt.__version=G.version);let ai=xt.currentProgram;te===!0&&(ai=Is(G,z,V),I&&G.isNodeMaterial&&I.onUpdateProgram(G,ai,xt));let Mi=!1,Hi=!1,Sn=!1;const ce=ai.getUniforms(),Se=xt.uniforms;if(x.useProgram(ai.program)&&(Mi=!0,Hi=!0,Sn=!0),G.id!==et&&(et=G.id,Hi=!0),xt.needsLights){const ue=Ic(M.state.lightProbeGridArray,V);xt.lightProbeGrid!==ue&&(xt.lightProbeGrid=ue,Hi=!0)}if(Mi||at!==w){x.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),ce.setValue(N,"projectionMatrix",w.projectionMatrix),ce.setValue(N,"viewMatrix",w.matrixWorldInverse);const Xi=ce.map.cameraPosition;Xi!==void 0&&Xi.setValue(N,Ce.setFromMatrixPosition(w.matrixWorld)),P.logarithmicDepthBuffer&&ce.setValue(N,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ce.setValue(N,"isOrthographic",w.isOrthographicCamera===!0),at!==w&&(at=w,Hi=!0,Sn=!0)}if(xt.needsLights&&(ei.state.directionalShadowMap.length>0&&ce.setValue(N,"directionalShadowMap",ei.state.directionalShadowMap,$),ei.state.spotShadowMap.length>0&&ce.setValue(N,"spotShadowMap",ei.state.spotShadowMap,$),ei.state.pointShadowMap.length>0&&ce.setValue(N,"pointShadowMap",ei.state.pointShadowMap,$)),V.isSkinnedMesh){ce.setOptional(N,V,"bindMatrix"),ce.setOptional(N,V,"bindMatrixInverse");const ue=V.skeleton;ue&&(ue.boneTexture===null&&ue.computeBoneTexture(),ce.setValue(N,"boneTexture",ue.boneTexture,$))}V.isBatchedMesh&&(ce.setOptional(N,V,"batchingTexture"),ce.setValue(N,"batchingTexture",V._matricesTexture,$),ce.setOptional(N,V,"batchingIdTexture"),ce.setValue(N,"batchingIdTexture",V._indirectTexture,$),ce.setOptional(N,V,"batchingColorTexture"),V._colorsTexture!==null&&ce.setValue(N,"batchingColorTexture",V._colorsTexture,$));const Wi=X.morphAttributes;if((Wi.position!==void 0||Wi.normal!==void 0||Wi.color!==void 0)&&F.update(V,X,ai),(Hi||xt.receiveShadow!==V.receiveShadow)&&(xt.receiveShadow=V.receiveShadow,ce.setValue(N,"receiveShadow",V.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&z.environment!==null&&(Se.envMapIntensity.value=z.environmentIntensity),Se.dfgLUT!==void 0&&(Se.dfgLUT.value=vg()),Hi){if(ce.setValue(N,"toneMappingExposure",D.toneMappingExposure),xt.needsLights&&Fc(Se,Sn),mt&&G.fog===!0&&Pt.refreshFogUniforms(Se,mt),Pt.refreshMaterialUniforms(Se,G,it,st,M.state.transmissionRenderTarget[w.id]),xt.needsLights&&xt.lightProbeGrid){const ue=xt.lightProbeGrid;Se.probesSH.value=ue.texture,Se.probesMin.value.copy(ue.boundingBox.min),Se.probesMax.value.copy(ue.boundingBox.max),Se.probesResolution.value.copy(ue.resolution)}va.upload(N,hl(xt),Se,$)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(va.upload(N,hl(xt),Se,$),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ce.setValue(N,"center",V.center),ce.setValue(N,"modelViewMatrix",V.modelViewMatrix),ce.setValue(N,"normalMatrix",V.normalMatrix),ce.setValue(N,"modelMatrix",V.matrixWorld),G.uniformsGroups!==void 0){const ue=G.uniformsGroups;for(let Xi=0,bn=ue.length;Xi<bn;Xi++){const dl=ue[Xi];tt.update(dl,ai),tt.bind(dl,ai)}}return ai}function Fc(w,z){w.ambientLightColor.needsUpdate=z,w.lightProbe.needsUpdate=z,w.directionalLights.needsUpdate=z,w.directionalLightShadows.needsUpdate=z,w.pointLights.needsUpdate=z,w.pointLightShadows.needsUpdate=z,w.spotLights.needsUpdate=z,w.spotLightShadows.needsUpdate=z,w.rectAreaLights.needsUpdate=z,w.hemisphereLights.needsUpdate=z}function Nc(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(w,z,X){const G=W.get(w);G.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),W.get(w.texture).__webglTexture=z,W.get(w.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:X,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,z){const X=W.get(w);X.__webglFramebuffer=z,X.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(w,z=0,X=0){J=w,Y=z,H=X;let G=null,V=!1,mt=!1;if(w){const pt=W.get(w);if(pt.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(N.FRAMEBUFFER,pt.__webglFramebuffer),rt.copy(w.viewport),_t.copy(w.scissor),Yt=w.scissorTest,x.viewport(rt),x.scissor(_t),x.setScissorTest(Yt),et=-1;return}else if(pt.__webglFramebuffer===void 0)$.setupRenderTarget(w);else if(pt.__hasExternalTextures)$.rebindTextures(w,W.get(w.texture).__webglTexture,W.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Vt=w.depthTexture;if(pt.__boundDepthTexture!==Vt){if(Vt!==null&&W.has(Vt)&&(w.width!==Vt.image.width||w.height!==Vt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(w)}}const bt=w.texture;(bt.isData3DTexture||bt.isDataArrayTexture||bt.isCompressedArrayTexture)&&(mt=!0);const Lt=W.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Lt[z])?G=Lt[z][X]:G=Lt[z],V=!0):w.samples>0&&$.useMultisampledRTT(w)===!1?G=W.get(w).__webglMultisampledFramebuffer:Array.isArray(Lt)?G=Lt[X]:G=Lt,rt.copy(w.viewport),_t.copy(w.scissor),Yt=w.scissorTest}else rt.copy(Et).multiplyScalar(it).floor(),_t.copy(Me).multiplyScalar(it).floor(),Yt=Zt;if(X!==0&&(G=k),x.bindFramebuffer(N.FRAMEBUFFER,G)&&x.drawBuffers(w,G),x.viewport(rt),x.scissor(_t),x.setScissorTest(Yt),V){const pt=W.get(w.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+z,pt.__webglTexture,X)}else if(mt){const pt=z;for(let bt=0;bt<w.textures.length;bt++){const Lt=W.get(w.textures[bt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+bt,Lt.__webglTexture,X,pt)}}else if(w!==null&&X!==0){const pt=W.get(w.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,pt.__webglTexture,X)}et=-1},this.readRenderTargetPixels=function(w,z,X,G,V,mt,yt,pt=0){if(!(w&&w.isWebGLRenderTarget)){Qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let bt=W.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&yt!==void 0&&(bt=bt[yt]),bt){x.bindFramebuffer(N.FRAMEBUFFER,bt);try{const Lt=w.textures[pt],Vt=Lt.format,qt=Lt.type;if(w.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+pt),!P.textureFormatReadable(Vt)){Qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!P.textureTypeReadable(qt)){Qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=w.width-G&&X>=0&&X<=w.height-V&&N.readPixels(z,X,G,V,dt.convert(Vt),dt.convert(qt),mt)}finally{const Lt=J!==null?W.get(J).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(w,z,X,G,V,mt,yt,pt=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let bt=W.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&yt!==void 0&&(bt=bt[yt]),bt)if(z>=0&&z<=w.width-G&&X>=0&&X<=w.height-V){x.bindFramebuffer(N.FRAMEBUFFER,bt);const Lt=w.textures[pt],Vt=Lt.format,qt=Lt.type;if(w.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+pt),!P.textureFormatReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!P.textureTypeReadable(qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Dt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Dt),N.bufferData(N.PIXEL_PACK_BUFFER,mt.byteLength,N.STREAM_READ),N.readPixels(z,X,G,V,dt.convert(Vt),dt.convert(qt),0);const oe=J!==null?W.get(J).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,oe);const we=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await _d(N,we,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Dt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,mt),N.deleteBuffer(Dt),N.deleteSync(we),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,z=null,X=0){const G=Math.pow(2,-X),V=Math.floor(w.image.width*G),mt=Math.floor(w.image.height*G),yt=z!==null?z.x:0,pt=z!==null?z.y:0;$.setTexture2D(w,0),N.copyTexSubImage2D(N.TEXTURE_2D,X,0,0,yt,pt,V,mt),x.unbindTexture()},this.copyTextureToTexture=function(w,z,X=null,G=null,V=0,mt=0){let yt,pt,bt,Lt,Vt,qt,Dt,oe,we;const _e=w.isCompressedTexture?w.mipmaps[mt]:w.image;if(X!==null)yt=X.max.x-X.min.x,pt=X.max.y-X.min.y,bt=X.isBox3?X.max.z-X.min.z:1,Lt=X.min.x,Vt=X.min.y,qt=X.isBox3?X.min.z:0;else{const Se=Math.pow(2,-V);yt=Math.floor(_e.width*Se),pt=Math.floor(_e.height*Se),w.isDataArrayTexture?bt=_e.depth:w.isData3DTexture?bt=Math.floor(_e.depth*Se):bt=1,Lt=0,Vt=0,qt=0}G!==null?(Dt=G.x,oe=G.y,we=G.z):(Dt=0,oe=0,we=0);const he=dt.convert(z.format),Ge=dt.convert(z.type);let xt;z.isData3DTexture?($.setTexture3D(z,0),xt=N.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?($.setTexture2DArray(z,0),xt=N.TEXTURE_2D_ARRAY):($.setTexture2D(z,0),xt=N.TEXTURE_2D),x.activeTexture(N.TEXTURE0),x.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,z.flipY),x.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),x.pixelStorei(N.UNPACK_ALIGNMENT,z.unpackAlignment);const ei=x.getParameter(N.UNPACK_ROW_LENGTH),te=x.getParameter(N.UNPACK_IMAGE_HEIGHT),ai=x.getParameter(N.UNPACK_SKIP_PIXELS),Mi=x.getParameter(N.UNPACK_SKIP_ROWS),Hi=x.getParameter(N.UNPACK_SKIP_IMAGES);x.pixelStorei(N.UNPACK_ROW_LENGTH,_e.width),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,_e.height),x.pixelStorei(N.UNPACK_SKIP_PIXELS,Lt),x.pixelStorei(N.UNPACK_SKIP_ROWS,Vt),x.pixelStorei(N.UNPACK_SKIP_IMAGES,qt);const Sn=w.isDataArrayTexture||w.isData3DTexture,ce=z.isDataArrayTexture||z.isData3DTexture;if(w.isDepthTexture){const Se=W.get(w),Wi=W.get(z),ue=W.get(Se.__renderTarget),Xi=W.get(Wi.__renderTarget);x.bindFramebuffer(N.READ_FRAMEBUFFER,ue.__webglFramebuffer),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,Xi.__webglFramebuffer);for(let bn=0;bn<bt;bn++)Sn&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,W.get(w).__webglTexture,V,qt+bn),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,W.get(z).__webglTexture,mt,we+bn)),N.blitFramebuffer(Lt,Vt,yt,pt,Dt,oe,yt,pt,N.DEPTH_BUFFER_BIT,N.NEAREST);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(V!==0||w.isRenderTargetTexture||W.has(w)){const Se=W.get(w),Wi=W.get(z);x.bindFramebuffer(N.READ_FRAMEBUFFER,q),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,B);for(let ue=0;ue<bt;ue++)Sn?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Se.__webglTexture,V,qt+ue):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Se.__webglTexture,V),ce?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Wi.__webglTexture,mt,we+ue):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Wi.__webglTexture,mt),V!==0?N.blitFramebuffer(Lt,Vt,yt,pt,Dt,oe,yt,pt,N.COLOR_BUFFER_BIT,N.NEAREST):ce?N.copyTexSubImage3D(xt,mt,Dt,oe,we+ue,Lt,Vt,yt,pt):N.copyTexSubImage2D(xt,mt,Dt,oe,Lt,Vt,yt,pt);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else ce?w.isDataTexture||w.isData3DTexture?N.texSubImage3D(xt,mt,Dt,oe,we,yt,pt,bt,he,Ge,_e.data):z.isCompressedArrayTexture?N.compressedTexSubImage3D(xt,mt,Dt,oe,we,yt,pt,bt,he,_e.data):N.texSubImage3D(xt,mt,Dt,oe,we,yt,pt,bt,he,Ge,_e):w.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,mt,Dt,oe,yt,pt,he,Ge,_e.data):w.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,mt,Dt,oe,_e.width,_e.height,he,_e.data):N.texSubImage2D(N.TEXTURE_2D,mt,Dt,oe,yt,pt,he,Ge,_e);x.pixelStorei(N.UNPACK_ROW_LENGTH,ei),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,te),x.pixelStorei(N.UNPACK_SKIP_PIXELS,ai),x.pixelStorei(N.UNPACK_SKIP_ROWS,Mi),x.pixelStorei(N.UNPACK_SKIP_IMAGES,Hi),mt===0&&z.generateMipmaps&&N.generateMipmap(xt),x.unbindTexture()},this.initRenderTarget=function(w){W.get(w).__webglFramebuffer===void 0&&$.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?$.setTextureCube(w,0):w.isData3DTexture?$.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?$.setTexture2DArray(w,0):$.setTexture2D(w,0),x.unbindTexture()},this.resetState=function(){Y=0,H=0,J=null,x.reset(),vt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Jt._getUnpackColorSpace()}}class xg{constructor(){this.real=0,this.world=0,this.dtReal=0,this.dt=0,this.scale=1,this._layers=new Map}requestScale(t,e,i=1/0){this._layers.set(t,{scale:e,until:i===1/0?1/0:this.real+i})}releaseScale(t){this._layers.delete(t)}update(t){this.dtReal=Math.min(t,1/20),this.real+=this.dtReal;let e=1;for(const[i,n]of this._layers)this.real>=n.until?this._layers.delete(i):e*=n.scale;(!Number.isFinite(e)||Number.isNaN(e))&&(e=1),this.scale=Math.max(.02,Math.min(1,e)),this.dt=this.dtReal*this.scale,this.world+=this.dt}}const fe=new xg;class yg{constructor(t=49370){this.seed=t>>>0,this.s=t>>>0}reset(){this.s=this.seed>>>0}next(){let t=this.s+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}range(t,e){return t+(e-t)*this.next()}int(t,e){return Math.floor(this.range(t,e+1))}pick(t){return t[Math.floor(this.next()*t.length)]}gauss(t=0,e=1){const i=(this.next()+this.next()+this.next()+this.next()-2)*.7071;return t+i*e}sign(){return this.next()<.5?-1:1}}const T=new yg(49370),kt=(s,t,e)=>s<t?t:s>e?e:s,Mg=(s,t,e)=>s+(t-s)*e,Ae=(s,t,e,i)=>Mg(s,t,1-Math.exp(-e*i)),ci=s=>1-Math.pow(1-s,3),_n=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,Fa=s=>s*s,_r=(s,t=1.70158)=>1+(t+1)*Math.pow(s-1,3)+t*Math.pow(s-1,2);class pn{constructor(t=0,e=120,i=16){this.value=t,this.target=t,this.vel=0,this.k=e,this.c=i}update(t){if(t<=0)return this.value;const e=-this.k*(this.value-this.target)-this.c*this.vel;return this.vel+=e*t,this.value+=this.vel*t,Math.abs(this.value)<1e-6&&Math.abs(this.vel)<1e-6&&(this.value=this.target,this.vel=0),this.value}snap(t){this.value=t,this.target=t,this.vel=0}impulse(t){this.vel+=t}}function $n(s,t=0){return Math.sin(s*1.9873+t*12.9898)*.5+Math.sin(s*4.7411+t*78.233)*.3+Math.sin(s*9.3277+t*3.9917)*.2}const _a={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Mn{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const wg=new Da(-1,1,1,-1,0,1);class Sg extends Le{constructor(){super(),this.setAttribute("position",new me([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new me([0,2,0,0,2,0],2))}}const bg=new Sg;class Jo{constructor(t){this._mesh=new U(bg,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,wg)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class bc extends Mn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof re?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Ls.clone(t.uniforms),this.material=new re({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Jo(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class gh extends Mn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const n=t.getContext(),a=t.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),a.buffers.stencil.setFunc(n.ALWAYS,r,4294967295),a.buffers.stencil.setClear(o),a.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(n.EQUAL,1,4294967295),a.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),a.buffers.stencil.setLocked(!0)}}class Tg extends Mn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Eg{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new gt);this._width=i.width,this._height=i.height,e=new Ze(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:je}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new bc(_a),this.copyPass.material.blending=Ai,this.timer=new yu}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let n=0,a=this.passes.length;n<a;n++){const r=this.passes[n];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),r.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),r.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}gh!==void 0&&(r instanceof gh?i=!0:r instanceof Tg&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new gt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,n)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Ag extends Mn{constructor(t,e,i=null,n=null,a=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Ct}render(t,e,i){const n=t.autoClear;t.autoClear=!1;let a,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(a=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),t.autoClear=n}}const Rg={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ct(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class ts extends Mn{constructor(t,e=1,i,n){super(),this.strength=e,this.radius=i,this.threshold=n,this.resolution=t!==void 0?new gt(t.x,t.y):new gt(256,256),this.clearColor=new Ct(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new Ze(a,r,{type:je}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let c=0;c<this.nMips;c++){const u=new Ze(a,r,{type:je});u.texture.name="UnrealBloomPass.h"+c,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const d=new Ze(a,r,{type:je});d.texture.name="UnrealBloomPass.v"+c,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),a=Math.round(a/2),r=Math.round(r/2)}const o=Rg;this.highPassUniforms=Ls.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new re({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let c=0;c<this.nMips;c++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[c])),this.separableBlurMaterials[c].uniforms.invSize.value=new gt(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new S(1,1,1),new S(1,1,1),new S(1,1,1),new S(1,1,1),new S(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ls.clone(_a.uniforms),this.blendMaterial=new re({uniforms:this.copyUniforms,vertexShader:_a.vertexShader,fragmentShader:_a.fragmentShader,premultipliedAlpha:!0,blending:ki,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ct,this._oldClearAlpha=1,this._basic=new Ei,this._fsQuad=new Jo(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),n=Math.round(e/2);this.renderTargetBright.setSize(i,n);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,n),this.renderTargetsVertical[a].setSize(i,n),this.separableBlurMaterials[a].uniforms.invSize.value=new gt(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(t,e,i,n,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const r=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=ts.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=ts.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=r}_getSeparableBlurMaterial(t){const e=[],i=t/3;for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(i*i))/i);return new re({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new gt(.5,.5)},direction:{value:new gt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new re({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}ts.BlurDirectionX=new gt(1,0);ts.BlurDirectionY=new gt(0,1);const la={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Cg extends Mn{constructor(){super(),this.isOutputPass=!0,this.uniforms=Ls.clone(la.uniforms),this.material=new uc({name:la.name,uniforms:this.uniforms,vertexShader:la.vertexShader,fragmentShader:la.fragmentShader}),this._fsQuad=new Jo(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Jt.getTransfer(this._outputColorSpace)===ie&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===To?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Eo?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ao?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ca?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Co?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Po?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ro&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Pg={uniforms:{tDiffuse:{value:null},uAberration:{value:.0016},uAberrationBoost:{value:0},uVignette:{value:.42},uGrain:{value:.026},uTime:{value:0},uSmear:{value:new gt(0,0)},uDamage:{value:0},uDamageDir:{value:new gt(0,0)},uLowHp:{value:0},uFlash:{value:0},uOverdrive:{value:0},uResolution:{value:new gt(1,1)}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uAberration, uAberrationBoost, uVignette, uGrain, uTime;
    uniform float uDamage, uLowHp, uFlash, uOverdrive;
    uniform vec2 uSmear, uDamageDir, uResolution;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    void main() {
      vec2 uv = vUv;
      vec2 fromCenter = uv - 0.5;
      float r2 = dot(fromCenter, fromCenter);

      // chromatic aberration — radial, scaled up on damage/impact
      float ab = (uAberration + uAberrationBoost * (0.4 + r2 * 3.0)) * (0.35 + r2 * 2.2);
      vec2 dir = fromCenter * ab;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + dir).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - dir).b;

      // camera turn smear — 3 taps along rotation direction
      if (length(uSmear) > 1e-4) {
        vec3 acc = col;
        for (int i = 1; i <= 3; i++) {
          float w = float(i) * 0.28;
          acc += texture2D(tDiffuse, uv - uSmear * w).rgb;
        }
        col = mix(col, acc * 0.25, clamp(length(uSmear) * 34.0, 0.0, 0.65));
      }

      // teal-orange grade: cool the shadows, warm the highlights
      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      vec3 shadowTint = vec3(0.82, 0.95, 1.12);
      vec3 highTint = vec3(1.10, 1.03, 0.90);
      col *= mix(shadowTint, highTint, smoothstep(0.05, 0.65, lum));
      // gentle saturation lift
      col = mix(vec3(lum), col, 1.13);

      // overdrive amber edge glow
      if (uOverdrive > 0.001) {
        float edge = smoothstep(0.18, 0.62, r2);
        col += vec3(1.0, 0.55, 0.16) * edge * uOverdrive * 0.55;
        col *= 1.0 + uOverdrive * 0.12;
      }

      // low HP: desaturate + darken slightly
      if (uLowHp > 0.001) {
        col = mix(col, vec3(lum) * vec3(1.0, 0.72, 0.72), uLowHp * 0.55);
      }

      // damage vignette — directional bias + red
      if (uDamage > 0.001) {
        vec2 dv = fromCenter - uDamageDir * 0.35;
        float dr = smoothstep(0.12, 0.75, dot(dv, dv) * (2.4 - uDamage));
        col = mix(col, vec3(0.42, 0.02, 0.02), dr * uDamage * 0.8);
      }

      // base cool vignette
      col *= 1.0 - uVignette * smoothstep(0.14, 0.7, r2);

      // white flash
      col = mix(col, vec3(1.25, 1.22, 1.15), clamp(uFlash, 0.0, 1.0));

      // film grain — fine luma-dependent. Fades to zero in the darkest
      // (night-sky) luminances: the (1.15 - lum) gain made the sky the
      // grainiest region of the frame, which read as sensor noise stamped
      // over the aurora gradients. Midtones and highlights keep full grain.
      float g = hash(uv * uResolution + fract(uTime) * 173.7) - 0.5;
      col += g * uGrain * (1.15 - lum) * smoothstep(0.015, 0.09, lum);

      gl_FragColor = vec4(col, 1.0);
    }`};class Lg extends Mn{constructor(t,e){super(),this.scene=t,this.camera=e,this.needsSwap=!1,this.clear=!1}render(t,e,i){t.setRenderTarget(this.renderToScreen?null:i),t.clearDepth(),t.render(this.scene,this.camera)}}class Dg{constructor(t){this.renderer=new _g({antialias:!1,powerPreference:"high-performance",stencil:!1,preserveDrawingBuffer:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight);const e=Math.min(window.devicePixelRatio||1,2);this.renderer.setPixelRatio(e),this.renderer.toneMapping=Ca,this.renderer.toneMappingExposure=1.18,this.renderer.outputColorSpace=Ne,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ts,this.renderer.autoClear=!1,t.appendChild(this.renderer.domElement),this.worldScene=new xo,this.worldScene.fog=new Ho(1846090,.0075),this.worldCamera=new We(75,window.innerWidth/window.innerHeight,.05,700),this.vmScene=new xo,this.vmCamera=new We(58,window.innerWidth/window.innerHeight,.008,6);const i=new gt;this.renderer.getSize(i);const n=new Ze(i.x*e,i.y*e,{type:je});this.composer=new Eg(this.renderer,n),this.renderPass=new Ag(this.worldScene,this.worldCamera),this.vmPass=new Lg(this.vmScene,this.vmCamera),this.bloom=new ts(new gt(i.x,i.y),.5,.55,1.3),this.grade=new bc(Pg),this.output=new Cg,this.composer.addPass(this.renderPass),this.composer.addPass(this.vmPass),this.composer.addPass(this.bloom),this.composer.addPass(this.grade),this.composer.addPass(this.output),this.quality="high",this._msAvg=16,this._lowSince=0,this._highSince=0,window.addEventListener("resize",()=>this.onResize())}onResize(){const t=window.innerWidth,e=window.innerHeight,i=Math.min(window.devicePixelRatio||1,2);this.renderer.setPixelRatio(i),this.renderer.setSize(t,e),this.worldCamera.aspect=t/e,this.worldCamera.updateProjectionMatrix(),this.vmCamera.aspect=t/e,this.vmCamera.updateProjectionMatrix(),this.composer.setSize(t,e),this.grade.uniforms.uResolution.value.set(t,e)}setQuality(t){this.quality=t;const e=t==="low";this.bloom.enabled=!e,this.grade.uniforms.uGrain.value=e?0:.026,this.renderer.shadowMap.enabled=!e,this.renderer.setPixelRatio(e?1:Math.min(window.devicePixelRatio||1,2)),this.onResize()}monitor(t,e){this._msAvg=this._msAvg*.97+t*.03,this._msAvg>19.5?(this._highSince=0,this._lowSince===0?this._lowSince=bs.sec+2:bs.sec>this._lowSince&&this.quality==="high"&&this.setQuality("low")):this._msAvg<14&&this.quality==="low"&&(this._highSince===0?this._highSince=bs.sec+3:bs.sec>this._highSince&&(this.setQuality("high"),this._lowSince=0,this._highSince=0))}render(){this.composer.render()}}const bs={sec:0};function Ig(s){const t=new Mo(s),e=new xo,i=new Pe(10,24,16),n=new re({side:Xe,uniforms:{uAurora:{value:new Ct(.05,.22,.14)}},vertexShader:`
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,fragmentShader:`
      uniform vec3 uAurora;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        float h = clamp(d.y, -1.0, 1.0);
        // night sky gradient: deep zenith -> dusty blue horizon
        vec3 col = mix(vec3(0.045, 0.070, 0.115), vec3(0.008, 0.014, 0.030), smoothstep(0.0, 0.7, h));
        // snowfield bounce below the horizon
        col = mix(col, vec3(0.105, 0.120, 0.145), smoothstep(0.0, -0.22, h));
        // aurora curtain overhead (partial lon coverage — a band, not a dome)
        float band = exp(-pow((h - 0.55) * 3.0, 2.0));
        float lon = smoothstep(0.15, 0.6, sin(atan(d.z, d.x) * 1.7 + 1.3) * 0.5 + 0.5);
        col += uAurora * band * lon * 1.7;
        // one warm sodium pool low on the horizon (flood array side)
        vec2 sd = normalize(vec2(0.6, 0.8));
        float sody = exp(-pow((h + 0.05) * 5.5, 2.0)) * smoothstep(-0.1, 0.9, dot(normalize(d.xz), sd));
        col += vec3(0.45, 0.26, 0.10) * sody * 0.85;
        gl_FragColor = vec4(col, 1.0);
      }`});e.add(new U(i,n));const a=t.fromScene(e,.035);return t.dispose(),i.dispose(),n.dispose(),a.texture}class Ug{constructor(t){this.dom=t,this.keys=new Set,this.mouse={dx:0,dy:0,left:!1,right:!1,leftPressed:!1,rightPressed:!1},this.locked=!1,this.onLockChange=null,this.onPauseRequest=null,this._doubleTaps=new Map,this._presses=new Set,this._consumedFrame=!1,this._onKeyDown=e=>{if(e.repeat)return;const i=e.code;this.keys.add(i),this._presses.add(i);const n=fe.real;this._doubleTaps.has(i)&&n-this._doubleTaps.get(i)<.28?(this._doubleTaps.set(i,-999),this.doubleTapped=i):this._doubleTaps.set(i,n),i==="Escape"&&this.onPauseRequest&&this.onPauseRequest(),["Space","ControlLeft","ShiftLeft","Tab"].includes(i)&&e.preventDefault(),this.anyKeyEver=!0},this._onKeyUp=e=>this.keys.delete(e.code),this._onMouseMove=e=>{this.locked&&(this.mouse.dx+=e.movementX||0,this.mouse.dy+=e.movementY||0)},this._onMouseDown=e=>{if(!this.locked){this._desired&&e.button===0&&this.requestLock();return}e.button===0&&(this.mouse.left=!0,this.mouse.leftPressed=!0),e.button===2&&(this.mouse.right=!0,this.mouse.rightPressed=!0)},this._onMouseUp=e=>{e.button===0&&(this.mouse.left=!1),e.button===2&&(this.mouse.right=!1)},this._onLockEvent=()=>{this.locked=document.pointerLockElement===this.dom,this.locked||(this.keys.clear(),this.mouse.left=this.mouse.right=!1),this.onLockChange&&this.onLockChange(this.locked)},this._onLockError=()=>{this.lockFailed=!0},this._onContext=e=>e.preventDefault(),window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),window.addEventListener("mousemove",this._onMouseMove),window.addEventListener("mousedown",this._onMouseDown),window.addEventListener("mouseup",this._onMouseUp),document.addEventListener("pointerlockchange",this._onLockEvent),document.addEventListener("pointerlockerror",this._onLockError),this.dom.addEventListener("contextmenu",this._onContext),this.doubleTapped=null,this.anyKeyEver=!1,this.lockFailed=!1}requestLock(){if(this._desired=!0,this.locked)return;const t=this.dom.requestPointerLock();t&&t.catch&&t.catch(()=>{this.lockFailed=!0})}releaseLock(){this._desired=!1,this.locked&&document.exitPointerLock()}key(t){return this.keys.has(t)}pressed(t){return this._presses.has(t)}consumeDoubleTap(t){return this.doubleTapped===t?(this.doubleTapped=null,!0):!1}endFrame(){this.mouse.dx=0,this.mouse.dy=0,this.mouse.leftPressed=!1,this.mouse.rightPressed=!1,this.doubleTapped=null,this._presses.clear()}dispose(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("mousemove",this._onMouseMove),window.removeEventListener("mousedown",this._onMouseDown),window.removeEventListener("mouseup",this._onMouseUp),document.removeEventListener("pointerlockchange",this._onLockEvent),document.removeEventListener("pointerlockerror",this._onLockError),this.dom.removeEventListener("contextmenu",this._onContext)}}class Fg{constructor(t){this.group=new $t,this.time=0,this.tint=new Ct(.05,.22,.14),this.surge=1;const e=new re({side:Xe,depthWrite:!1,fog:!1,uniforms:{uHorizon:{value:new Ct(3360095)},uMid:{value:new Ct(1714765)},uZenith:{value:new Ct(857136)},uAuroraTint:{value:this.tint},uTime:{value:0},uIntensity:{value:1}},vertexShader:`
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,fragmentShader:`
        precision highp float;
        uniform vec3 uHorizon, uMid, uZenith, uAuroraTint;
        uniform float uTime, uIntensity;
        varying vec3 vPos;

        float starHash(vec2 p) {
          return fract(sin(dot(floor(p * 220.0), vec2(127.1, 311.7))) * 43758.5453);
        }
        float ridgeHash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
        float ridgeNoise(float x) {
          float i = floor(x), f = fract(x);
          float u = f * f * (3.0 - 2.0 * f);
          return mix(ridgeHash(i), ridgeHash(i + 1.0), u);
        }
        float hash21(vec2 p) {
          p = fract(p * vec2(234.34, 435.345));
          p += dot(p, p + 34.23);
          return fract(p.x * p.y);
        }
        float vnoise2(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
                     mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float vnoise1(float x) {
          float i = floor(x), f = fract(x);
          float u = f * f * (3.0 - 2.0 * f);
          return mix(ridgeHash(i), ridgeHash(i + 1.0), u);
        }
        float angDiff(float a, float c) { float d = a - c; return atan(sin(d), cos(d)); }
        // gaussian around centre c with half-width w. NEVER pow(): pow() with
        // a negative base is UNDEFINED in GLSL — on Metal/ANGLE it returns
        // NaN and the pixel renders black. (This poisoned the first version
        // of this shader: half the slab was silently NaN.)
        float gauss1(float x, float c, float w) { float d = (x - c) / w; return exp(-d * d); }

        // -------- aurora emission volume --------
        // March the view ray through the emission slab and integrate
        // chemically-ordered emission. ~16 noise fetches per step, 10 steps.
        vec3 aurora(vec3 dir, float time) {
          // smooth fade toward the horizon — never a hard cutoff (A5)
          float elevFade = smoothstep(0.0, 0.115, dir.y); // melts into the fog band, never a hard horizon line
          if (elevFade <= 0.002) return vec3(0.0);
          // emission slab: scene-unit stand-in for the 90-400km shell
          const float H0 = 74.0, H1 = 305.0;
          float t0 = H0 / dir.y;
          float t1 = min(H1 / dir.y, 2400.0);
          // mild distance extinction — far arcs read dimmer
          // 950: airmass extinction at grazing angles — the depth-stacked arcs
          // all contribute at once near the horizon and read as horizontal
          // streaks; real low-elevation aurora is heavily extinguished
          float ext = exp(-t0 * length(dir.xz) / 950.0);

          // magnetic field: zenith tilted north. Curtain noise lives in the
          // field-line map (plane perpendicular to F): emission runs in
          // field-aligned columns that converge in perspective on the
          // magnetic zenith — the corona — where a wall passes overhead.
          vec3 F = normalize(vec3(0.055, 1.0, -0.30));
          vec3 FX = normalize(vec3(1.0, 0.016, 0.185));
          vec3 FZ = normalize(cross(F, FX));
          // ray fields are 1D in easting (a filament stays lit through its
          // whole altitude). Viewed ALONG the wall that field projects to
          // long evenly-spaced streaks running across the frame — dozens of
          // fake comb lines at the frame edges where the arcs are edge-on.
          // Fade the ray CONTRAST to its mean there: the wall brightness
          // stays, only the fake comb dies. Face-on centre keeps full rays.
          float alongWall = abs(dot(normalize(dir.xz), normalize(FX.xz)));
          float faceOn = 1.0 - smoothstep(0.35, 0.65, alongWall);

          // view azimuth relative to north (-Z). Exactly overhead the
          // horizontal components vanish; atan(0,0) is NaN on some drivers
          // and would poison the whole dome — guard it.
          float ha = (abs(dir.x) + abs(dir.z) < 1e-4) ? 0.0 : atan(dir.x, -dir.z);

          // ---- arcs: azimuth envelopes. Wave bands travel ALONG each arc
          // (advected 1D noise at arc-specific speeds).
          float arcEnv = 0.0;
          {
            float dA = angDiff(ha, 0.0);
            float foldA = 0.55 + 0.45 * vnoise1(ha * 6.5 - time * 0.100 + 11.0)
                              + 0.16 * sin(ha * 13.0 - time * 0.170);
            arcEnv += exp(-dA * dA * 1.15) * foldA;
            float dB = angDiff(ha, 0.85);
            float foldB = 0.55 + 0.45 * vnoise1(ha * 8.0 + time * 0.062 + 47.0);
            arcEnv += 0.58 * exp(-dB * dB * 3.5) * foldB;
            float dC = angDiff(ha, -0.72);
            float foldC = 0.55 + 0.45 * vnoise1(-ha * 7.2 + time * 0.081 + 83.0);
            arcEnv += 0.40 * exp(-dC * dC * 3.2) * foldC;
            float dD = angDiff(ha, 2.9);
            float foldD = 0.55 + 0.45 * vnoise1(ha * 9.5 + time * 0.048 + 29.0);
            arcEnv += 0.34 * exp(-dD * dD * 4.0) * foldD;
          }
          if (arcEnv < 0.003) return vec3(0.0);

          vec3 acc = vec3(0.0);
          // geometry-only twin: the same integral WITHOUT the ray modulation.
          // At low elevation a march step sweeps several whole ray periods,
          // so the in-loop filaments average into mush (vision kept reading
          // 'diffuse glow, no discrete rays' below ~35°). Those pixels get
          // their ray pattern re-applied from a per-pixel reference plane
          // after the march — see the tail of this function.
          vec3 accG = vec3(0.0);
          const int N = 28;
          // cap per-sample path: grazing rays must not integrate forever
          float step = min((t1 - t0) / float(N), 85.0);
          // per-pixel jitter breaks the sample-quantisation banding that
          // would otherwise stack into visible horizontal strata
          // sub-step jitter decorrelates neighbours (kills march strata);
          // amplitude 0.3 — with sharp ray ridges the full ±0.5 step makes
          // the integral itself a per-pixel random variable (visible as
          // salt-and-pepper speckle on stills)
          float jit = (hash21(gl_FragCoord.xy) - 0.5) * 0.6;
          for (int i = 0; i < N; i++) {
            // uniform-in-ALTITUDE sampling: with uniform-in-t steps the
            // 85-unit cap and the 2400 t1 cap made the sample hh set jump
            // every screen row at low elevation — the emission law then
            // stepped per row and read as scanline banding right above the
            // roofline. Anchoring samples to fixed hh levels keeps the
            // colour integral row-stable; only the wall noise varies, and
            // it varies smoothly.
            float hhs = (float(i) + hash21(gl_FragCoord.xy * 1.37 + float(i) * 43.7)) / float(N);
            float t = (H0 + hhs * (H1 - H0)) / dir.y;
            if (t > 2400.0) continue;
            vec3 p = dir * t;
            float hh = clamp((p.y - H0) / (H1 - H0), 0.0, 1.0);

            // field-line map coordinates: qx ≈ easting, qy ≈ northing
            vec2 q = vec2(dot(p, FX), dot(p, FZ));

            // ---- arcs at MANY distances: gaussian windows in northing
            // (curtain at distance D projects to elevation atan(H/D)). The
            // window set is chosen so a viewer looking any azimuth sweeps
            // through several of them between horizon and zenith — three
            // windows left a black hole at mid elevations. Negative-qy
            // windows are the southern/western arcs, and the (-52) lobe is
            // the observer's OWN overhead band: the near curtain passing
            // the magnetic zenith, where its rays converge (corona).
            float bands =      gauss1(q.y,   40.0, 62.0)
                        +      gauss1(q.y,  -52.0, 42.0)
                        + 0.62 * gauss1(q.y, -140.0, 52.0)
                        + 0.72 * gauss1(q.y,  210.0, 70.0)
                        + 0.55 * gauss1(q.y, -240.0, 60.0)
                        + 0.85 * gauss1(q.y,  410.0, 62.0)
                        + 0.45 * gauss1(q.y, -360.0, 70.0)
                        + 0.45 * gauss1(q.y,  875.0, 58.0);
            if (bands < 0.01) continue;

            // CURTAIN FOLDS: the wall's northing position swings with easting
            // (large-amplitude, slow, travelling) — this bends each arc into
            // snakes and curls instead of horizontal stripes. The fold is
            // vertical-invariant (field-aligned) with a touch of shear.
            float foldA = (vnoise1(q.x * 0.0052 - time * 0.010) - 0.5) * 2.0;
            float foldB = (vnoise1(q.x * 0.0165 + time * 0.006 + 31.0) - 0.5) * 2.0;
            float qy = q.y + 195.0 * foldA + 65.0 * foldB + hh * 26.0;
            // WALLS = thin iso-lines of a slow 2D field (the 0.5 level set):
            // value-noise ridges are fat exactly where value noise
            // concentrates, but a narrow gaussian around the level set gives
            // the sharp, endlessly-wandering fold lines real curtains have.
            // Wall thickness itself breathes along the arc.
            float wallW = 0.024 + 0.030 * vnoise1(q.x * 0.004 - time * 0.011 + 7.0);
            // corona soften: at the apex the sheet iso-lines converge to a
            // single point (every direction maps to q->0) and the fold
            // streaks pinch into a razor vertex. Blur the wall there — the
            // crown melts into glow while folds still converge.
            wallW *= 1.0 + 2.2 * smoothstep(0.72, 0.95, dot(dir, F));
            // anti-speckle: the wall is thinner than one march step at low
            // elevations, so each jittered sample hits/misses randomly and
            // the curtain breaks into spray-paint stipple. Widen the wall by
            // the sampling error actually present along THIS ray (step × the
            // northing rate × the noise gradient) — the physics stays sharp
            // near the zenith where steps are short.
            float gradQ = abs(dot(dir, FZ));
            float blurN = step * gradQ * 0.0018;
            wallW = sqrt(wallW * wallW + blurN * blurN);
            float n2 = vnoise2(vec2(q.x * 0.0062 - time * 0.009, qy * 0.0011)) * 0.72
                     + vnoise2(vec2(q.x * 0.0155 + time * 0.004, qy * 0.0032 + 19.0)) * 0.28;
            float sheet = gauss1(n2, 0.5, wallW);
            // THE OVERHEAD WALL: a curtain anchored just north of the
            // observer's zenith, in UNFOLDED northing — the fold warps swing
            // qy by ±260 and would fling the overhead curtain off the zenith,
            // starving the corona pass (A1). Deterministic, so the pass is
            // guaranteed; brightness varies along easting, and its
            // field-aligned filaments converge on the magnetic zenith.
            float overhead = gauss1(q.y, -52.0, 54.0)
                           * (0.60 + 0.28 * vnoise1(q.x * 0.0035 - time * 0.008 + 53.0));
            sheet = max(sheet, overhead);

            // filaments: VERTICAL rays — a 1D field of easting only, so a
            // filament stays lit through the whole altitude range; they
            // drift across the wall independently of the folds and lean
            // slightly as they rise
            // filaments: VERTICAL rays. 1D field in easting only, so a
            // filament stays lit through the whole altitude range; they
            // drift across the wall independently of the folds and lean
            // slightly as they rise. Scale chosen so a ray is ~30 units
            // thick — coarse enough that a march step straddles at most
            // one or two, fine enough to read as a wall of separate rays.
            // per-curtain lean rate: neighbouring rays tilt differently
            // (a single shared lean made them read as parallel projection
            // lines rather than plasma following the field)
            float lean = 0.30 + 0.55 * vnoise1(q.x * 0.0093 + 5.0);
            // height-coupled wobble: without it every ray's edge is a
            // perfectly straight line (the field arg is linear in height)
            float wob = (vnoise1(q.x * 0.013 + hh * 1.5 + 9.0) - 0.5) * 0.7;
            // spatially varying ray frequency: a constant 0.034 makes
            // equidistant columns — real curtains bunch and splay
            float frq = 0.034 * (0.70 + 0.60 * vnoise1(q.x * 0.008 + 3.0));
            float filArg = q.x * frq - time * 0.016 + (hh - 0.35) * lean + wob + foldA * 1.4;
            // stratified 3-tap average over the step's easting span: the
            // straight single tap aliases into spray-paint stipple wherever
            // a step crosses more than one ray. Two octaves per tap, and a
            // SHARP ridge exponent: value noise dwells near its 0.5 mode,
            // so a gentle |2n-1| ridge comes out as fat bumps — pow 3
            // carves true dark gaps between narrow columns (walls of rays).
            float exRate = step * abs(dot(dir, FX)) * 0.034;
            float nA = 0.48 * vnoise1(filArg) + 0.36 * vnoise1(filArg * 2.63 + 17.0) + 0.16 * vnoise1(filArg * 5.9 + 31.0);
            float nB = 0.48 * vnoise1(filArg + exRate * 0.333) + 0.36 * vnoise1((filArg + exRate * 0.333) * 2.63 + 17.0) + 0.16 * vnoise1((filArg + exRate * 0.333) * 5.9 + 31.0);
            float nC = 0.48 * vnoise1(filArg + exRate * 0.667) + 0.36 * vnoise1((filArg + exRate * 0.667) * 2.63 + 17.0) + 0.16 * vnoise1((filArg + exRate * 0.667) * 5.9 + 31.0);
            float filS = (pow(1.0 - abs(2.0 * nA - 1.0), 3.6)
                        + pow(1.0 - abs(2.0 * nB - 1.0), 3.6)
                        + pow(1.0 - abs(2.0 * nC - 1.0), 3.6)) * (1.42 / 3.0);
            // zenith de-pinch: inside the top cap the compressed easting
            // drives ray frequency toward infinity, so every filament
            // converges into ONE razor point — it reads as a UV-pole
            // artefact, not a corona. Blend the fine rays into a broad
            // curl there: the corona still converges, without a singularity.
            float zen = smoothstep(0.62, 0.90, dot(dir, F));
            if (zen > 0.0) {
              float curl = 0.45 + 0.55 * vnoise1(foldA * 0.9 + hh * 2.2 + 4.0)
                         * (0.6 + 0.4 * vnoise1(q.x * 0.02 + 21.0));
              filS = mix(filS, curl, zen * 0.92);
            }

            float densG = sheet * bands;
            if (densG < 0.004) continue;
            float dens = densG * mix(1.0, filS, faceOn);

            // ---- vertical emission law (fixed by chemistry, not taste) ----
            // lower edge comparatively sharp, top fades over a long distance
            float bot = smoothstep(0.0, 0.045, hh);
            float topFade = pow(1.0 - hh, 1.0);
            // green oxygen body — the dominant emission. Hard cutoff at the
            // bottom: the O layer sits ~100km with its own lower edge, and a
            // green tail bleeding under the nitrogen hem turned the hem into
            // a muddy pink-green smear instead of a line.
            // hard top cutoff on the green: the O layer is a finite slab,
            // and the gaussian tail bleeding up through the crimson band
            // mixed the two into warm white — the fringe could never read
            // red while green was still strong underneath it
            float green = gauss1(hh, 0.28, 0.13) * smoothstep(0.0, 0.16, hh);
            // crimson oxygen fringe ABOVE the green slab top, soft and long
            float crimson = smoothstep(0.46, 0.82, hh) * pow(1.0 - hh, 0.45) * (1.0 - 0.22 * hh);
            // pink/violet nitrogen hem along the bottom edge, ONLY where the
            // curtain is bright and active
            float bright = dens * arcEnv * uIntensity;
            float hem = (1.0 - smoothstep(0.02, 0.13, hh)) * smoothstep(0.24, 0.48, bright);

            vec3 c = vec3(0.09, 0.80, 0.36) * green
                   + vec3(0.88, 0.18, 0.20) * crimson * 1.25 * (1.0 + (1.0 - topFade) * 1.6) // topFade compensation: the high-altitude red integrates over a far shorter path than the green body
                   + vec3(0.92, 0.30, 0.80) * hem * 1.30;

            acc += c * (dens * arcEnv * bot * topFade);
            accG += c * (densG * arcEnv * bot * topFade);
          }
          // ---- ray-plane substitution ----
          // Long-step (low-elevation) pixels: rebuild the filament pattern
          // on the plane through the green emission peak (hh = 0.24). That
          // crossing is unique per pixel and continuous across pixels, so
          // rays render as clean bands instead of the step-quantised mush
          // the integral produced. Blended in by how many ray periods one
          // step actually sweeps — near the zenith steps are short and the
          // in-march rays (already correct) stay.
          {
            float exSpan = step * abs(dot(dir, FX)) * 0.034;
            float m = smoothstep(0.18, 0.60, exSpan);
            // fade the substitution out toward the horizon: the ref-plane
            // pattern's screen frequency grows ~1/dir.y^2 and crosses
            // Nyquist a few degrees up, aliasing into horizontal lines.
            // Near the horizon real rays compress below a pixel anyway —
            // the march (uniform-in-hh, wide blurN) reads as smooth glow.
            m *= smoothstep(0.10, 0.22, dir.y);
            if (m > 0.001 && dot(accG, accG) > 4e-6) {
              const float hhR = 0.24;
              // dir.y floor 0.12: rows near the horizon shift the ref-plane pattern
              // by ~1/dir.y^2 per row; at 0.055 the noise frequency crossed
              // one period PER PIXEL and aliased into horizontal strata
              float tR = (H0 + hhR * (H1 - H0)) / max(dir.y, 0.12);
              vec3 pR = dir * tR;
              vec2 qR = vec2(dot(pR, FX), dot(pR, FZ));
              float foldAR = (vnoise1(qR.x * 0.0052 - time * 0.010) - 0.5) * 2.0;
              float foldBR = (vnoise1(qR.x * 0.0165 + time * 0.006 + 31.0) - 0.5) * 2.0;
              float qyR = qR.y + 195.0 * foldAR + 65.0 * foldBR + hhR * 26.0;
              float wallWR = 0.024 + 0.030 * vnoise1(qR.x * 0.004 - time * 0.011 + 7.0);
              float n2R = vnoise2(vec2(qR.x * 0.0062 - time * 0.009, qyR * 0.0011)) * 0.72
                        + vnoise2(vec2(qR.x * 0.0155 + time * 0.004, qyR * 0.0032 + 19.0)) * 0.28;
              float sheetR = gauss1(n2R, 0.5, wallWR);
              sheetR = max(sheetR, gauss1(qR.y, -52.0, 54.0)
                       * (0.72 + 0.28 * vnoise1(qR.x * 0.0035 - time * 0.008 + 53.0)));
              float leanR = 0.30 + 0.55 * vnoise1(qR.x * 0.0093 + 5.0);
              float wobR = (vnoise1(qR.x * 0.013 + hhR * 1.5 + 9.0) - 0.5) * 0.7;
              float frqR = 0.034 * (0.70 + 0.60 * vnoise1(qR.x * 0.008 + 3.0));
              float filArgR = qR.x * frqR - time * 0.016 + (hhR - 0.35) * leanR + wobR + foldAR * 1.4;
              float nAR = 0.48 * vnoise1(filArgR) + 0.36 * vnoise1(filArgR * 2.63 + 17.0) + 0.16 * vnoise1(filArgR * 5.9 + 31.0);
              float filSR = pow(1.0 - abs(2.0 * nAR - 1.0), 3.6) * 1.42;
              float zenR = smoothstep(0.62, 0.90, dot(dir, F));
              if (zenR > 0.0) {
                float curlR = 0.45 + 0.55 * vnoise1(foldAR * 0.9 + hhR * 2.2 + 4.0)
                           * (0.6 + 0.4 * vnoise1(qR.x * 0.02 + 21.0));
                filSR = mix(filSR, curlR, zenR * 0.92);
              }
              // no rays where the march itself found no wall — gate on the
              // geometry integral, not on re-evaluating the sheet (the ref
              // plane can fall off the wall while the visual crossing sits
              // at another altitude: rays vanished and the exposed accG
              // strata read as horizontal moire)
              float mEff = m * smoothstep(0.006, 0.05, dot(accG, vec3(0.333)));
              acc = mix(acc, accG * (0.10 + 1.15 * mix(1.0, filSR, faceOn)), mEff);
            }
          }
          // HDR accumulation -> LDR: exponential soft cap keeps the colour
          // ORDER intact where the display is bright instead of clipping to
          // a white sheet (overlaps still add before the map).
          // Weighting is per-SAMPLE, not per path length: a curtain's
          // surface brightness must not dim just because the observer's
          // line through the slab is shorter — that made the overhead corona
          // read black while the northern horizon blew out.
          acc *= ext * elevFade * uIntensity * 1.05;
          return vec3(1.0) - exp(-acc);
        }

        void main() {
          vec3 dir = normalize(vPos);
          float h = clamp(dir.y, -0.05, 1.0);
          vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.28, h));
          col = mix(col, uZenith, smoothstep(0.22, 0.85, h));
          // distant mountain ridgeline — two octaves around the azimuth,
          // fades the abrupt terrain/sky seam at the horizon
          float az = atan(dir.z, dir.x);
          float ridge = ridgeNoise(az * 5.0 + 13.7) * 0.6 + ridgeNoise(az * 11.0 + 41.2) * 0.25;
          ridge *= smoothstep(0.9, 0.15, abs(az - 1.9));   // tallest band NW
          float mTop = 0.035 + ridge * 0.11;               // max peak elevation
          float m = smoothstep(mTop + 0.012, mTop - 0.012, h);
          vec3 mountain = mix(vec3(0.16, 0.22, 0.33), uZenith * 0.85, smoothstep(0.0, 0.09, h));
          col = mix(col, mountain, m);
          // snow-capped glint on the tallest peaks
          col += vec3(0.30, 0.38, 0.48) * m * smoothstep(0.075, 0.1, mTop) * smoothstep(mTop - 0.004, mTop - 0.018, h);
          // stars high up, twinkling — the aurora below is ADDED to them
          float s = starHash(dir.xz / max(dir.y, 0.2));
          // magnitude + colour variation: s is uniform above the threshold,
          // so derive both from it — most stars faint, a few bright, each
          // warm or cool (identical white dots read as a decal overlay)
          float mag = fract(s * 997.0);
          vec3 starCol = mix(vec3(1.0, 0.82, 0.66), vec3(0.72, 0.83, 1.0), fract(s * 513.0));
          float star = step(0.9975, s) * smoothstep(0.25, 0.6, h) * (0.22 + 0.78 * mag * mag);
          // the aurora itself (computed first: bright emission washes the
          // stars out instead of letting white dots punch through it)
          vec3 au = aurora(dir, uTime);
          col += starCol * star * (0.5 + 0.5 * sin(uTime * 2.0 + s * 90.0))
               * (0.42 + 0.58 * exp(-dot(au, vec3(0.30, 0.55, 0.15)) * 2.6)); // A6: stars stay readable even inside bright curtains
          col += au;
          // wide faint bleed of the same light into the upper sky
          col += uAuroraTint * smoothstep(0.12, 0.8, h) * 0.18;
          // faint cold glow low on the horizon (dusk remnant)
          col += vec3(0.06, 0.055, 0.085) * pow(1.0 - abs(h), 9.0);
          // dither — kills banding across the long smooth gradients
          col += (hash21(gl_FragCoord.xy) - 0.5) * (1.6 / 255.0);
          gl_FragColor = vec4(col, 1.0);
        }`}),i=new U(new Pe(480,96,48),e);i.renderOrder=-100,this.group.add(i),this.skyMat=e,t.add(this.group)}_updateSurge(){const t=this.time,e=.5+.5*Math.sin(t*(Math.PI*2/23)+1.3),i=.6+.4*Math.sin(t*(Math.PI*2/57)),n=.72+.28*Math.sin(t*(Math.PI*2/41)+4.1);this.surge=.55+.45*(e*i*n*1.9),this.skyMat.uniforms.uIntensity.value=this.surge}update(t){this.time+=t,this.skyMat.uniforms.uTime.value=this.time,this._updateSurge();const e=.5+.5*(this.surge-.55)/.45;this.tint.setRGB(.03+.032*e,.13+.085*e,.085+.045*e)}}function wn(s,t,e){const i=document.createElement("canvas");i.width=s,i.height=t;const n=i.getContext("2d");e(n,s,t);const a=new Vi(i);return a.colorSpace=Ne,a.wrapS=a.wrapT=_i,a.anisotropy=4,a}function ha(s,t,e={}){const{scratches:i=90,grime:n=.35,ribs:a=0,label:r=null}=e;return wn(512,512,(o,l,h)=>{o.fillStyle=s,o.fillRect(0,0,l,h);for(let c=0;c<40;c++){o.fillStyle=`rgba(${t},${(.04+T.next()*.07).toFixed(3)})`;const u=T.range(40,220),d=T.range(20,120);o.fillRect(T.range(-20,l),T.range(-20,h),u,d)}if(a>0)for(let c=0;c<l;c+=l/a){const u=o.createLinearGradient(c,0,c+l/a,0);u.addColorStop(0,"rgba(0,0,0,0.22)"),u.addColorStop(.35,"rgba(255,255,255,0.10)"),u.addColorStop(.6,"rgba(0,0,0,0.05)"),u.addColorStop(1,"rgba(0,0,0,0.24)"),o.fillStyle=u,o.fillRect(c,0,l/a,h)}if(a>0)for(const c of[h*.18,h*.52,h*.86]){o.strokeStyle="rgba(0,0,0,0.34)",o.lineWidth=3,o.beginPath(),o.moveTo(0,c),o.lineTo(l,c),o.stroke(),o.strokeStyle="rgba(255,255,255,0.08)",o.lineWidth=1.4,o.beginPath(),o.moveTo(0,c+2.4),o.lineTo(l,c+2.4),o.stroke();for(let u=14;u<l;u+=46){const d=o.createRadialGradient(u,c,.5,u,c,4.2);d.addColorStop(0,"rgba(255,240,225,0.5)"),d.addColorStop(.55,"rgba(0,0,0,0.32)"),d.addColorStop(1,"rgba(0,0,0,0)"),o.fillStyle=d,o.beginPath(),o.arc(u,c,4.2,0,Math.PI*2),o.fill()}}o.strokeStyle="rgba(220,225,235,0.16)";for(let c=0;c<i;c++){o.lineWidth=T.range(.5,2.2),o.globalAlpha=T.range(.15,.5),o.beginPath();const u=T.next()*l,d=T.next()*h;o.moveTo(u,d),o.lineTo(u+T.gauss(0,34),d+T.gauss(0,34)),o.stroke()}o.globalAlpha=1;for(let c=0;c<22;c++){const u=T.next()*l,d=o.createLinearGradient(u,0,u,h);d.addColorStop(0,"rgba(60,32,18,0.0)"),d.addColorStop(T.range(.1,.4),`rgba(72,40,22,${(n*T.next()).toFixed(2)})`),d.addColorStop(1,"rgba(30,18,10,0.0)"),o.fillStyle=d,o.fillRect(u,0,T.range(3,14),h)}r&&(o.save(),o.translate(l*.5,h*.5),o.rotate(T.range(-.04,.04)),o.font="bold 44px monospace",o.textAlign="center",o.textBaseline="middle",o.fillStyle="rgba(235,235,230,0.75)",o.fillText(r,0,0),o.font="bold 20px monospace",o.fillText("ARCTIC RESUPPLY 7",0,40),o.restore())})}function Ng(){return wn(512,512,(s,t,e)=>{s.fillStyle="#7a5c39",s.fillRect(0,0,t,e);for(let i=0;i<e;i+=T.range(26,46)){const n=T.range(-18,18)|0;s.fillStyle=`rgb(${122+n},${92+n},${57+n})`,s.fillRect(0,i,t,T.range(22,40)),s.strokeStyle="rgba(40,26,12,0.25)";for(let a=0;a<6;a++){s.lineWidth=T.range(.5,1.5),s.beginPath();const r=i+T.next()*34;s.moveTo(0,r);for(let o=0;o<=t;o+=32)s.lineTo(o,r+Math.sin(o*.02+a)*3);s.stroke()}}s.fillStyle="rgba(20,12,6,0.55)";for(const i of[0,t/2,t-3])s.fillRect(i-2,0,5,e);s.strokeStyle="rgba(30,20,10,0.6)",s.lineWidth=10,s.strokeRect(5,5,t-10,e-10),s.fillStyle="rgba(220,210,190,0.5)",s.font="bold 40px monospace",s.textAlign="center",s.fillText("SUPPLY",t/2,e/2-10),s.font="bold 26px monospace",s.fillText("FRAGILE",t/2,e/2+30)})}function zg(){return wn(256,256,(s,t,e)=>{s.fillStyle="#a8332a",s.fillRect(0,0,t,e);for(let i=0;i<30;i++)s.fillStyle=`rgba(60,20,16,${(.05+T.next()*.1).toFixed(2)})`,s.fillRect(T.next()*t,T.next()*e,T.range(20,90),T.range(10,60));for(const i of[e*.22,e*.5,e*.78]){const n=s.createLinearGradient(0,i-10,0,i+10);n.addColorStop(0,"rgba(0,0,0,0.3)"),n.addColorStop(.5,"rgba(255,255,255,0.12)"),n.addColorStop(1,"rgba(0,0,0,0.3)"),s.fillStyle=n,s.fillRect(0,i-10,t,20)}for(const[i,n]of[[t*.3,e*.085],[t*.68,e*.085]])s.strokeStyle="rgba(30,20,16,0.5)",s.lineWidth=3,s.beginPath(),s.arc(i,n,11,0,Math.PI*2),s.stroke(),s.strokeStyle="rgba(255,220,190,0.25)",s.lineWidth=1.5,s.beginPath(),s.arc(i,n,7,0,Math.PI*2),s.stroke();s.save(),s.translate(t/2,e/2),s.rotate(Math.PI/4),s.fillStyle="rgba(240,230,120,0.9)",s.fillRect(-34,-34,68,68),s.strokeStyle="rgba(30,30,30,0.8)",s.lineWidth=4,s.strokeRect(-34,-34,68,68),s.restore(),s.fillStyle="#1c1c1c",s.font="bold 40px monospace",s.textAlign="center",s.textBaseline="middle",s.fillText("⚠",t/2,e/2-2)})}function vh(s=256){const t=new Uint8Array(s*s*4),e=new Float32Array(s*s);for(let a=0;a<s;a++)for(let r=0;r<s;r++){const o=a*s+r;e[o]=Math.sin(r*.42+Math.sin(a*.16)*2.6)*.5+Math.sin(a*.31+Math.sin(r*.1)*3.2)*.5+Math.sin((r+a)*.7)*.2+T.next()*.14}const i=2.2;for(let a=0;a<s;a++)for(let r=0;r<s;r++){const o=a*s+r,l=e[a*s+(r-1+s)%s],h=e[a*s+(r+1)%s],c=e[(a-1+s)%s*s+r],u=e[(a+1)%s*s+r],d=(l-h)*i,f=(c-u)*i,g=1,v=Math.hypot(d,f,g);t[o*4]=(d/v*.5+.5)*255,t[o*4+1]=(f/v*.5+.5)*255,t[o*4+2]=(g/v*.5+.5)*255,t[o*4+3]=255}const n=new is(t,s,s,Ke);return n.wrapS=n.wrapT=_i,n.magFilter=Re,n.minFilter=gi,n.generateMipmaps=!0,n.anisotropy=8,n.needsUpdate=!0,n}function Tc(s=64,t=2.2){const e=document.createElement("canvas");e.width=e.height=s;const i=e.getContext("2d"),n=i.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.4,`rgba(255,255,255,${Math.pow(.5,t).toFixed(3)})`),n.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=n,i.fillRect(0,0,s,s),new Vi(e)}function Og(){return wn(128,128,(s,t,e)=>{s.clearRect(0,0,t,e);const i=t/2,n=e/2;s.fillStyle="rgba(255,255,255,1)",s.beginPath();const a=26;for(let r=0;r<=a;r++){const o=r/a*Math.PI*2,l=34+Math.sin(o*5+T.next()*6)*9+T.next()*12,h=i+Math.cos(o)*l,c=n+Math.sin(o)*l*.9;r===0?s.moveTo(h,c):s.lineTo(h,c)}s.closePath(),s.fill();for(let r=0;r<16;r++){const o=T.next()*Math.PI*2,l=T.range(40,58),h=T.range(2,7);s.beginPath(),s.arc(i+Math.cos(o)*l,n+Math.sin(o)*l,h,0,Math.PI*2),s.fill()}for(let r=0;r<4;r++){const o=i+T.gauss(0,18);s.fillRect(o,n,T.range(2,4),T.range(14,34)),s.beginPath(),s.arc(o+1.5,n+T.range(14,34),3,0,Math.PI*2),s.fill()}})}function Bg(){return wn(64,64,(s,t,e)=>{s.clearRect(0,0,t,e);const i=t/2,n=e/2,a=s.createRadialGradient(i,n,2,i,n,26);a.addColorStop(0,"rgba(8,8,10,0.95)"),a.addColorStop(.35,"rgba(20,20,24,0.8)"),a.addColorStop(.7,"rgba(40,40,46,0.35)"),a.addColorStop(1,"rgba(40,40,46,0)"),s.fillStyle=a,s.beginPath(),s.arc(i,n,27,0,Math.PI*2),s.fill(),s.strokeStyle="rgba(10,10,12,0.7)";for(let r=0;r<10;r++){s.lineWidth=T.range(1,2.5),s.beginPath();const o=T.next()*Math.PI*2;s.moveTo(i+Math.cos(o)*9,n+Math.sin(o)*9),s.lineTo(i+Math.cos(o)*T.range(16,24),n+Math.sin(o)*T.range(16,24)),s.stroke()}})}function kg(){return wn(256,256,(s,t,e)=>{s.clearRect(0,0,t,e);const i=t/2,n=e/2,a=s.createRadialGradient(i,n,8,i,n,110);a.addColorStop(0,"rgba(6,5,5,0.95)"),a.addColorStop(.4,"rgba(14,11,9,0.75)"),a.addColorStop(.75,"rgba(22,18,14,0.4)"),a.addColorStop(1,"rgba(22,18,14,0)"),s.fillStyle=a,s.beginPath(),s.arc(i,n,110,0,Math.PI*2),s.fill();for(let r=0;r<26;r++){const o=T.next()*Math.PI*2;s.strokeStyle=`rgba(10,8,7,${T.range(.15,.4).toFixed(2)})`,s.lineWidth=T.range(2,7),s.beginPath(),s.moveTo(i+Math.cos(o)*30,n+Math.sin(o)*30),s.lineTo(i+Math.cos(o)*T.range(80,122),n+Math.sin(o)*T.range(80,122)),s.stroke()}})}function Gg(){const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d"),e=t.createRadialGradient(64,64,6,64,64,62);return e.addColorStop(0,"rgba(0,0,0,0.85)"),e.addColorStop(.55,"rgba(0,0,0,0.45)"),e.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),new Vi(s)}function Vg(){const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d");t.clearRect(0,0,128,128);const e=t.createRadialGradient(64,64,4,64,64,56);e.addColorStop(0,"rgba(12,10,8,0.8)"),e.addColorStop(.6,"rgba(18,14,10,0.45)"),e.addColorStop(1,"rgba(20,16,12,0)"),t.fillStyle=e,t.beginPath(),t.arc(64,64,56,0,Math.PI*2),t.fill();for(let n=0;n<9;n++){const a=T.next()*Math.PI*2,r=T.range(18,52);t.fillStyle=`rgba(10,8,6,${T.range(.25,.6).toFixed(2)})`,t.beginPath(),t.ellipse(64+Math.cos(a)*r,64+Math.sin(a)*r*.7,T.range(4,14),T.range(3,9),a,0,Math.PI*2),t.fill()}return new Vi(s)}function Hg(s,t){const e=document.createElement("canvas");e.width=256,e.height=112;const i=e.getContext("2d");i.fillStyle="#1d3a2f",i.fillRect(0,0,256,112),i.strokeStyle="rgba(220,228,220,0.75)",i.lineWidth=4,i.strokeRect(7,7,242,98),i.fillStyle="rgba(226,232,226,0.92)",i.textAlign="center",i.font="bold 34px monospace",i.fillText(s,128,52),i.font="bold 17px monospace",i.fillStyle="rgba(226,232,226,0.7)",i.fillText(t,128,82);for(let a=0;a<40;a++)i.fillStyle=`rgba(200,215,225,${T.range(.02,.1).toFixed(3)})`,i.fillRect(T.next()*256,T.next()*112,T.range(6,30),T.range(3,14));for(let a=0;a<8;a++){const r=T.next()*256,o=i.createLinearGradient(r,0,r,112);o.addColorStop(0,"rgba(30,40,35,0)"),o.addColorStop(1,`rgba(20,30,25,${T.range(.1,.3).toFixed(2)})`),i.fillStyle=o,i.fillRect(r,0,T.range(2,6),112)}const n=new Vi(e);return n.colorSpace=Ne,n}function Wg(s=128){let t=20967;const e=()=>(t=t*1664525+1013904223>>>0,t/4294967296),i=[],n=9;for(let f=0;f<=n;f++){i[f]=[];for(let g=0;g<=n;g++)i[f][g]=e()}const a=f=>f*f*(3-2*f),r=(f,g)=>{const v=f*n,p=g*n,m=Math.floor(v)%n,b=Math.floor(p)%n,C=a(v-Math.floor(v)),y=a(p-Math.floor(p)),A=i[b][m],M=i[b][m+1],R=i[(b+1)%n][m],_=i[(b+1)%n][(m+1)%n];return A+(M-A)*C+(R-A)*y+(A-M-R+_)*C*y},o=[];for(let f=0;f<s;f++){o[f]=[];for(let g=0;g<s;g++){const v=g/s,p=f/s;o[f][g]=r(v,p)*.6+r(v*3+.31,p*3+.17)*.28+r(v*7+.77,p*7+.53)*.12}}const l=document.createElement("canvas");l.width=l.height=s;const h=l.getContext("2d"),c=h.createImageData(s,s),u=(f,g)=>o[(g+s)%s][(f+s)%s];for(let f=0;f<s;f++)for(let g=0;g<s;g++){const v=(u(g+1,f)-u(g-1,f))*2.2,p=(u(g,f+1)-u(g,f-1))*2.2,m=Math.hypot(v,p,1),b=(f*s+g)*4;c.data[b]=(-v/m*.5+.5)*255,c.data[b+1]=(-p/m*.5+.5)*255,c.data[b+2]=(1/m*.5+.5)*255,c.data[b+3]=255}h.putImageData(c,0,0);const d=new Vi(l);return d.wrapS=d.wrapT=_i,d.repeat.set(2,2),d}function Xg(){return wn(512,256,(s,t,e)=>{s.fillStyle="#6e5940",s.fillRect(0,0,t,e);let i=0;for(;i<e;){const n=T.range(24,38),a=T.range(-16,12)|0;s.fillStyle=`rgb(${110+a},${89+a},${64+a})`,s.fillRect(0,i,t,Math.min(n,e-i)),s.strokeStyle="rgba(38,26,14,0.22)";for(let r=0;r<4;r++){s.lineWidth=T.range(.5,1.2),s.beginPath();const o=i+T.next()*n;s.moveTo(0,o);for(let l=0;l<=t;l+=48)s.lineTo(l,o+Math.sin(l*.015+r*2.1)*2.5);s.stroke()}s.fillStyle="rgba(18,12,6,0.6)",s.fillRect(0,i+n-2,t,3),T.next()<.4&&(s.fillStyle="rgba(40,26,12,0.5)",s.beginPath(),s.ellipse(T.next()*t,i+n/2,T.range(3,7),T.range(2,4),0,0,Math.PI*2),s.fill()),i+=n}for(let n=0;n<26;n++)s.fillStyle=`rgba(205,210,218,${T.range(.04,.12).toFixed(3)})`,s.fillRect(T.next()*t,T.next()*e,T.range(30,140),T.range(4,14))})}const Wn=130,oi=96;function xr(s,t,e){const i=Math.floor(s),n=Math.floor(t),a=s-i,r=t-n,o=(c,u)=>{let d=Math.sin(c*127.1+u*311.7+e*74.7)*43758.5453;return d-Math.floor(d)},l=a*a*(3-2*a),h=r*r*(3-2*r);return o(i,n)*(1-l)*(1-h)+o(i+1,n)*l*(1-h)+o(i,n+1)*(1-l)*h+o(i+1,n+1)*l*h}function qg(s,t){let e=0;e+=(xr(s*.017,t*.017,1)-.5)*2.6,e+=(xr(s*.055,t*.055,2)-.5)*.9,e+=(xr(s*.16,t*.16,3)-.5)*.22;const i=Math.max(Math.abs(s),Math.abs(t));return e+=ye.smoothstep(i,34,62)*2.8,e*=ye.lerp(.55,1,ye.smoothstep(i,8,26)),e}class Yg{constructor(t,e,i){this.heights=new Float32Array((oi+1)*(oi+1));const n=new Be(Wn,Wn,oi,oi);n.rotateX(-Math.PI/2);const a=n.attributes.position;for(let d=0;d<a.count;d++){const f=a.getX(d),g=a.getZ(d),v=qg(f,g);a.setY(d,v);const p=Math.round((f/Wn+.5)*oi),m=Math.round((g/Wn+.5)*oi);this.heights[m*(oi+1)+p]=v}n.computeVertexNormals();const r=vh(),o=Math.atan2(.3,.8);r.center.set(.5,.5),r.rotation=o,r.repeat.set(3,8),r.anisotropy=8;const l=$g();l.repeat.set(26,26);const h=vh(128);h.wrapS=h.wrapT=_i,h.anisotropy=8,this.material=new zt({color:14674422,roughness:.92,metalness:0,normalMap:r,normalScale:new gt(.17,.17),roughnessMap:l}),this.time=0;const c=i.map(d=>new pe(d.x,d.y,d.z,d.range)),u=this.material;u.onBeforeCompile=d=>{this.shader=d,d.uniforms.uTime={value:0},d.uniforms.uAuroraTint={value:e},d.uniforms.uWindDir={value:new gt(.8,.3)},d.uniforms.uWindPowder={value:.4},d.uniforms.uFloods={value:c},d.uniforms.uDetailN={value:h},d.uniforms.uRim={value:new Ct(3821424)},d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
          varying vec3 vWPos;
          varying vec3 vWNormal;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
          vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
          vWNormal = normalize(mat3(modelMatrix) * objectNormal);`),d.fragmentShader=d.fragmentShader.replace("#include <common>",`#include <common>
          uniform float uTime;
          uniform vec3 uAuroraTint;
          uniform vec2 uWindDir;
          uniform float uWindPowder;
          uniform vec4 uFloods[5];
          uniform sampler2D uDetailN;
          uniform vec3 uRim;
          varying vec3 vWPos;
          varying vec3 vWNormal;
          float glintHash(vec2 p) {
            return fract(sin(dot(floor(p), vec2(127.1, 311.7))) * 43758.5453);
          }
          vec3 glintHash3(vec2 p) {
            return vec3(
              fract(sin(dot(floor(p), vec2(127.1, 311.7))) * 43758.5453),
              fract(sin(dot(floor(p), vec2(269.5, 183.3))) * 43758.5453),
              fract(sin(dot(floor(p), vec2(419.2, 371.9))) * 43758.5453));
          }`).replace("#include <fog_fragment>",`#include <fog_fragment>
          // horizon dissolve: the terrain mesh ends at 65m and fog alone
          // never fully covers the terminator — blend the far field into
          // the sky's horizon tone so the rim melts instead of cutting
          float rimD = length(cameraPosition - vWPos);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, uRim, smoothstep(38.0, 61.0, rimD));`).replace("#include <color_fragment>",`#include <color_fragment>
          // ---- arctic snow character (G2/G6) ----
          // large-scale wind-packed tonal variation (distance-faded:
          // fixed cells shimmer into moiré once sub-pixel)
          float packDist = length(cameraPosition - vWPos);
          float packFade = 1.0 - smoothstep(10.0, 30.0, packDist);
          float packN = glintHash(floor(vWPos.xz * 0.35));
          diffuseColor.rgb *= 0.96 + 0.07 * packN * packFade;
          // aurora tint washing across the field, shifting with the sky
          diffuseColor.rgb += uAuroraTint * 0.5;
          // compacted trample paths: the routes people actually walk
          // (centre to each module + the fuel depot) are trodden darker
          // and denser. Distance-to-segment with a noisy soft edge.
          float pathN = glintHash(floor(vWPos.xz * 3.1)) * 0.5 + glintHash(floor(vWPos.xz * 9.7)) * 0.5;
          vec2 P = vWPos.xz;
          float trod = 0.0;
          vec2 pa, ba; float h;
          pa = P - vec2(-18.0, -9.0); ba = vec2(18.0, 9.0);
          h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          trod = max(trod, 1.0 - length(pa - ba * h) / (1.15 + pathN * 0.9));
          pa = P - vec2(17.0, -15.0); ba = vec2(-17.0, 15.0);
          h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          trod = max(trod, 1.0 - length(pa - ba * h) / (1.15 + pathN * 0.9));
          pa = P - vec2(-6.0, 17.0); ba = vec2(6.0, -17.0);
          h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          trod = max(trod, 1.0 - length(pa - ba * h) / (1.15 + pathN * 0.9));
          diffuseColor.rgb *= 1.0 - clamp(trod, 0.0, 1.0) * 0.16;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
          // distance-flatten the sastrugi detail: 13cm texels alias into
          // wavy moire bands once several land per pixel (the single worst
          // defect vision kept flagging on wide shots)
          float nFade = 1.0 - smoothstep(16.0, 40.0, length(cameraPosition - vWPos));
          normal = normalize(mix(vec3(0.0, 0.0, 1.0), normal, nFade));
          // metric-scale crust relief for the near/mid band (0.6m + 2m
          // samples), inverse-faded: covers exactly the 2-20m ground the
          // sastrugi scale leaves blank
          float dDist = length(cameraPosition - vWPos);
          float dFade = 1.0 - smoothstep(13.0, 32.0, dDist);
          vec2 duv1 = vWPos.xz * 1.65;
          vec2 duv2 = vec2(-vWPos.z, vWPos.x) * 0.51 + 0.37; // rotated 90°: two aligned axis samples cross-hatch
          vec2 dn = (texture2D(uDetailN, duv1).rg * 2.0 - 1.0) * 0.6
                  + (texture2D(uDetailN, duv2).rg * 2.0 - 1.0) * 0.9;
          normal = normalize(normal + vec3(dn.x, dn.y, 0.0) * 0.16 * dFade);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
          // sparkles live in the roughness: tiny glitter cells that only fire
          // when the view/light geometry aligns — they shift as you move.
          // Faded by view distance: fixed-frequency cells alias into moiré
          // rings once many land per pixel.
          vec3 vDir = normalize(cameraPosition - vWPos);
          float viewDist = length(cameraPosition - vWPos);
          float glintFade = 1.0 - smoothstep(9.0, 24.0, viewDist);
          vec2 gl = vWPos.xz * 26.0;
          vec2 cell = floor(gl);
          vec3 h3 = glintHash3(cell);
          vec3 sparkN = normalize(vWNormal + (h3 - 0.5) * 0.85);
          float inFlood = 0.0;
          float rough = roughnessFactor;
          for (int i = 0; i < 5; i++) {
            vec3 fd = uFloods[i].xyz - vWPos;
            float fdist = length(fd);
            float atten = clamp(1.0 - fdist / max(uFloods[i].w, 0.001), 0.0, 1.0);
            inFlood += atten * atten * 14.0 / (1.0 + fdist * 0.25);
          }
          float glint = pow(max(dot(reflect(-vDir, sparkN), normalize(vec3(-0.35, 0.8, -0.4))), 0.0), 260.0);
          glint += pow(max(dot(reflect(-vDir, sparkN), normalize(vec3(0.6, 0.7, 0.2))), 0.0), 300.0) * step(0.5, h3.x);
          glint *= glintFade;
          rough = clamp(rough - glint * (0.55 + inFlood * 0.06), 0.04, 1.0);
          roughnessFactor = rough;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
          // powder snow streaming off crests in the wind (W2) — moving
          // brightness bands aligned with wind direction on slope tops
          float slope = 1.0 - clamp(vWNormal.y, 0.0, 1.0);
          float waveline = sin(dot(vWPos.xz, uWindDir) * 1.4 - uTime * 2.2 + slope * 7.0);
          float powder = smoothstep(0.25, 0.95, waveline * 0.5 + 0.5) * slope * uWindPowder;
          totalEmissiveRadiance += vec3(0.7, 0.8, 1.0) * powder * 0.16;
          // sparkle emissive pop where floods hit — cool base + a warm
          // sodium glitter driven by the same glint cells, so pools read
          // crystalline from mid-distance too
          totalEmissiveRadiance += vec3(0.9, 0.95, 1.1) * pow(1.0 - roughnessFactor, 3.0) * 0.35 * min(inFlood, 1.0);
          totalEmissiveRadiance += vec3(1.0, 0.78, 0.5) * glint * min(inFlood, 2.0) * 0.55;`)},this.mesh=new U(n,this.material),this.mesh.receiveShadow=!0,this.mesh.name="terrain",t.add(this.mesh)}heightAt(t,e){const i=(t/Wn+.5)*oi,n=(e/Wn+.5)*oi,a=ye.clamp(Math.floor(i),0,oi-1),r=ye.clamp(Math.floor(n),0,oi-1),o=ye.clamp(i-a,0,1),l=ye.clamp(n-r,0,1),h=(c,u)=>this.heights[u*(oi+1)+c];return ye.lerp(ye.lerp(h(a,r),h(a+1,r),o),ye.lerp(h(a,r+1),h(a+1,r+1),o),l)}normalAt(t,e){const n=this.heightAt(t-.6,e),a=this.heightAt(t+.6,e),r=this.heightAt(t,e-.6),o=this.heightAt(t,e+.6);return new S(n-a,2*.6,r-o).normalize()}rayIntersect(t,e,i){const n=t.x,a=t.y,r=t.z;if(a-this.heightAt(n,r)<=0)return-1;const o=1.2;let l=0;for(;l<i;){const h=Math.min(l+o,i);if(a+e.y*h-this.heightAt(n+e.x*h,r+e.z*h)<0){let c=l,u=h;for(let d=0;d<10;d++){const f=(c+u)*.5;a+e.y*f-this.heightAt(n+e.x*f,r+e.z*f)<0?u=f:c=f}return(c+u)*.5}l=h}return-1}update(t,e,i){this.time+=t,this.shader&&(this.shader.uniforms.uTime.value=this.time,this.shader.uniforms.uWindDir.value.copy(e),this.shader.uniforms.uWindPowder.value=i)}}function $g(){let t=new Uint8Array(65536);for(let i=0;i<16384;i++){const n=200+Math.floor(T.next()*45);t[i*4]=t[i*4+1]=t[i*4+2]=n,t[i*4+3]=255}for(let i=0;i<2;i++){const n=new Uint8Array(t);for(let a=0;a<128;a++)for(let r=0;r<128;r++){let o=0;for(let c=-1;c<=1;c++)for(let u=-1;u<=1;u++)o+=n[((a+c+128)%128*128+(r+u+128)%128)*4];const l=Math.round(o/9),h=(a*128+r)*4;t[h]=t[h+1]=t[h+2]=l}}const e=new is(t,128,128,Ke);return e.wrapS=e.wrapT=_i,e.magFilter=Re,e.minFilter=gi,e.generateMipmaps=!0,e.anisotropy=8,e.needsUpdate=!0,e}function wt(s,t,e){return new Rt(s,t,e)}function Kg(s){return new re({uniforms:{uTime:{value:0},uAurora:{value:s},uDeep:{value:new Ct(532278)},uInner:{value:new Ct(1987974)},uBright:{value:new Ct(10473448)},uFresnelPower:{value:2.4}},vertexShader:`
      varying vec3 vN;
      varying vec3 vWPos;
      void main() {
        vN = normalize(normalMatrix * normal);
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      precision highp float;
      uniform float uTime, uFresnelPower;
      uniform vec3 uAurora, uDeep, uInner, uBright;
      varying vec3 vN;
      varying vec3 vWPos;
      float h21(vec2 p) { return fract(sin(dot(floor(p), vec2(127.1, 311.7))) * 43758.5453); }
      float vn(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y);
      }
      float fbm(vec2 p) {
        return vn(p) * 0.55 + vn(p * 2.3) * 0.28 + vn(p * 5.1) * 0.17;
      }
      void main() {
        vec3 vDir = normalize(cameraPosition - vWPos);
        float fres = pow(1.0 - max(dot(normalize(vN), vDir), 0.0), uFresnelPower);
        // fake inner depth: noise gradient reads as light scattering inside
        float inner = fbm(vWPos.xz * 1.3 + vec2(0.0, vWPos.y * 0.8) + uTime * 0.008);
        vec3 col = mix(uDeep, uInner, inner);
        col += uBright * fres * 0.42;
        // crack veins — bright scatter lines that catch light
        float cracks = smoothstep(0.492, 0.5, abs(fbm(vWPos.xz * 5.5 + vWPos.y * 2.6) - 0.5));
        col += uBright * cracks * 0.30;
        // layered fracture banding: lake ice splits in sub-parallel sheets —
        // without it every face read one uniform glowing tone at range
        float band = fbm(vec2(vWPos.y * 2.6, vWPos.x * 0.7 + vWPos.z * 0.6) * 1.8);
        col *= 0.66 + 0.52 * band;
        // wrap-light face separation: top vs side faces must differ tonally
        float wrap = clamp(dot(normalize(vN), normalize(vec3(-0.4, 0.75, -0.5))) * 0.5 + 0.5, 0.0, 1.0);
        col *= 0.42 + 0.72 * wrap;
        // aurora light washing the top faces
        col += uAurora * 0.45 * smoothstep(-0.2, 1.0, vN.y);
        // key light glint
        float key = pow(max(dot(normalize(vN), normalize(vec3(-0.4, 0.75, -0.5))), 0.0), 3.0);
        col += vec3(0.35, 0.5, 0.7) * key * 0.35;
        gl_FragColor = vec4(col, 1.0);
      }`})}function _h(s,t={}){const e=t.folds?`attribute float aFold;
`:"",i=t.folds?`vShade *= 0.40 + 0.85 * aFold; // drape slope faces the key light
`:"";return new re({transparent:!1,side:Qe,uniforms:{map:{value:s},uTime:{value:0},uWind:{value:new gt(.8,.3)},uGust:{value:.3},uImpulse:{value:0},uImpulseAt:{value:new gt(.5,.5)},uHoles:{value:Array.from({length:8},()=>new pe(0,0,0,0))},uTint:{value:new Ct(t.tint??16777215)}},vertexShader:`
      uniform float uTime, uGust, uImpulse;
      uniform vec2 uWind, uImpulseAt;
      ${e}varying vec2 vUv;
      varying float vShade;
      void main() {
        vUv = uv;
        vec3 p = position;
        // anchor along uv.x==0 edge; amplitude grows toward free edge.
        // Canopies (opts.both) are tied at BOTH edges — flutter peaks
        // mid-span instead of tearing free of the posts.
        float freedom = ${t.both?"uv.x * (1.0 - uv.x) * 4.0":"uv.x"};
        float w1 = sin(uv.x * 6.2831 - uTime * (5.0 + uGust * 6.0) + uv.y * 2.0);
        float w2 = sin(uv.x * 13.0 - uTime * 8.4 + uv.y * 4.5 + 1.7);
        float amp = (0.10 + uGust * 0.16) * freedom;
        p.z += (w1 * 0.7 + w2 * 0.3) * amp;
        p.y += w1 * amp * 0.18;
        // bullet impulse — radial ripple from hit point
        float d = distance(vUv, uImpulseAt);
        p.z += sin(d * 30.0 - uTime * 26.0) * uImpulse * exp(-d * 5.5) * freedom;
        // custom shader gets no scene lights — self-shade into the night
        // palette so flags/tarps don't glow at full texture brightness
        vShade = 0.36 + 0.26 * (w1 * 0.5 + 0.5);
        ${i}gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,fragmentShader:`
      uniform sampler2D map;
      uniform vec3 uTint;
      uniform vec4 uHoles[8];
      varying vec2 vUv;
      varying float vShade;
      void main() {
        vec4 tex = texture2D(map, vUv) * vec4(uTint, 1.0);
        // bullet holes (alpha cut)
        for (int i = 0; i < 8; i++) {
          float r = uHoles[i].z;
          if (r > 0.0) {
            float d = distance(vUv, uHoles[i].xy);
            if (d < r) { discard; }
            tex.rgb *= 1.0 + smoothstep(r, r * 2.2, d) * 0.0 - step(d, r * 2.0) * 0.35;
          }
        }
        gl_FragColor = vec4(tex.rgb * vShade, 1.0);
      }`})}class Zg{constructor(t,e,i){this.scene=t,this.terrain=e,this.group=new $t,t.add(this.group),this.colliders=[],this.rayTargets=[],this.drums=[],this.coverPoints=[],this.spawnPoints=[],this.windows=[],this.cloths=[],this.iceMaterials=[],this.dynamicGlows=[],this._buildMaterials(i),this._buildStation(),this._buildPerimeter(),this._collectCoverPoints(),this._finalizeInstances()}_buildMaterials(t){this.matContainer=[new zt({map:ha("#8a3324","200,80,50",{ribs:14,label:"K-77"}),roughness:.62,metalness:.55}),new zt({map:ha("#2a5f6b","90,180,190",{ribs:14,label:"ARX-04"}),roughness:.6,metalness:.55}),new zt({map:ha("#9c8a3c","220,200,120",{ribs:14,label:"D-19"}),roughness:.65,metalness:.5})],this.matCrate=new zt({map:Ng(),roughness:.88,metalness:0}),this.matDrum=new zt({map:zg(),roughness:.5,metalness:.3}),this.matMetalDark=new zt({color:3817801,roughness:.5,metalness:.7});const e=ha("#5d6a75","160,175,190",{ribs:8});e.wrapS=_i,e.repeat.set(2,1),this.matWall=new zt({map:e,roughness:.75,metalness:.3}),this.matIce=Kg(t),this.iceMaterials.push(this.matIce),this.flagTex=Jg(),this.tarpTex=Qg(),this.matGalv=new zt({color:10134444,roughness:.46,metalness:.78}),this.matConcrete=new zt({color:8685194,roughness:.96,metalness:.02}),this.matSnow=new zt({color:15660285,roughness:.94,metalness:0,normalMap:Wg(),normalScale:new gt(.55,.55)}),this.matDeck=new zt({map:Xg(),roughness:.85,metalness:0}),this.matRope=new zt({color:3813926,roughness:.95,metalness:0}),this.matHose=new zt({color:2303531,roughness:.9,metalness:.05}),this.aoTexture=Gg(),this.stainTexture=Vg(),this.matContainer.forEach(i=>{i.vertexColors=!0}),this.matWall.vertexColors=!0,this.matCrate.vertexColors=!0,this.matDrum.vertexColors=!0,this.matConcrete.vertexColors=!0,this._postMatrices=[],this._rungMatrices=[],this._railPosts=[],this._legMatrices=[],this._drumCaps=[],this._drumSnow=[],this._aoQuads=[],this._skirtMatrices=[],this._railBars=[],this._railMids=[],this._railSnow=[],this._wind=new gt(.8,.3).normalize()}_addCollider(t,e,i=0){t.updateWorldMatrix(!0,!1);const n=new sn().setFromObject(t);i&&n.expandByScalar(-i),t.userData.surface=e;const a={aabb:n,surface:e,mesh:t};return this.colliders.push(a),this.rayTargets.push(t),a}_ground(t,e){return this.terrain.heightAt(t,e)}_vTint(t,e=.13,i=.045){const n=t.geometry,a=n.attributes.position.count,r=new Float32Array(a*3),o=1+(T.next()-.5)*2*e,l=T.next()<.5?1:-1;for(let h=0;h<a;h++)r[h*3]=o*(1-l*i),r[h*3+1]=o,r[h*3+2]=o*(1+l*i);return n.setAttribute("color",new ti(r,3)),t}_buildStation(){this._module(-18,-9,.35),this._module(17,-15,-.6),this._container(-25,7,.15,0),this._container(10,24,-.35,1),this._container(25,-3,1.2,0),this._container(-14,-26,.08,2),this._containerStack(3,-27,.9),this._container(29,15,2.4,1),this._crateCluster(-8,5,4),this._crateCluster(12,8,5),this._crateCluster(-20,20,3),this._crateCluster(7,-18,4),this._drumCluster(-13,-3,3),this._drumCluster(21,6,2),this._drumCluster(-2,-13,3),this._drumCluster(-27,-8,2),this._drumCluster(14,30,3);const t=T.s;this._drumCluster(15.2,10.2,1),this._drumCluster(-11.4,4.2,1),T.s=t,this._mast(-27,-20),this._ice(22,25,2.6),this._ice(-30,18,3.1),this._ice(31,-18,2),this._barrels(2,12),this._barrels(-17,12),this._mainBuilding(-6,17,-.6),this._walkway([[-18,-9],[-16.4,4],[-9.2,19.3]]),this._depot(-8,-24,.15),this._antennaField(-27,-20),this._weatherMast(-1,22),this._sign(-12.8,23.2,.9,"OUTPOST K-7","RESEARCH STATION"),this._sign(30,4.5,-1.35,"SLOW","ICE / SLIPPERY"),this._pallet(9.5,21,.4),this._pallet(-19.5,13,-.8),this._shovel(-9.8,this._ground(-9.8,14.6),14.6,1.85),this._hose(-3.2,this._ground(-3.2,19.4),19.4);for(const e of[[-18,-9,7.2,4.2],[17,-15,7.2,4.2],[5,17,7,6],[-25,7,6.1,2.5],[10,24,6.1,2.5],[25,-3,6.1,2.5],[-14,-26,6.1,2.5],[29,15,6.1,2.5],[3,-27.5,7,3]])this._drift(e[0],e[1],e[2],e[3]);for(const e of[[-18,-9,7.2,4.2],[17,-15,7.2,4.2],[5,17,7,6],[-25,7,6.1,2.5],[10,24,6.1,2.5],[25,-3,6.1,2.5],[-14,-26,6.1,2.5,.08],[29,15,6.1,2.5,2.4],[3,-27.5,6.1,2.5,.9]])this._skirt(e[0],e[1],e[2],e[3],e[4]||0);for(const e of[[-18,-9,8.6,5.6],[17,-15,8.6,5.6],[-6,17,11.6,7.6],[-25,7,7.4,4],[10,24,7.4,4],[25,-3,7.4,4],[-14,-26,7.4,4],[29,15,7.4,4],[3,-27.5,8.4,4.6],[-8,-24,6.6,5.6],[-27,-20,4.5,4.5]])this._aoQuads.push({x:e[0],z:e[1],w:e[2],d:e[3]});this._stain(-6.6,-22.6,2.4),this._stain(21.8,6.4,1.6)}_module(t,e,i){const n=new $t,a=this._ground(t,e);n.position.set(t,a,e),n.rotation.y=i;const r=7.2,o=3.1,l=4.2,h=new U(wt(r,o,l),this.matWall);this._vTint(h),h.position.y=o/2-.15,h.castShadow=h.receiveShadow=!0,n.add(h),this._addCollider(h,"metal");const c=new U(new Pe(1,16,8),this.matSnow);this._vTint(c,.05),c.scale.set(r/2+.32,.3,l/2+.32),c.position.y=o+.08,c.castShadow=!0,n.add(c);const u=new re({uniforms:{uWarm:{value:new Ct(16761976)},uFlicker:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);}",fragmentShader:`
        uniform vec3 uWarm; uniform float uFlicker;
        varying vec2 vUv;
        void main() {
          float pane = step(0.08, fract(vUv.x * 2.0)) * step(0.08, fract(vUv.y * 2.0));
          float frost = 0.75 + 0.25 * sin(vUv.x * 21.0) * sin(vUv.y * 17.0);
          // interior silhouettes (racks/shelves) so the glass has depth (E2)
          float inside = 0.62 + 0.38 * step(0.5, sin(vUv.x * 8.0 + 1.3) * cos(vUv.y * 11.0 - 0.6));
          inside *= 0.84 + 0.26 * (1.0 - vUv.y);
          vec3 col = uWarm * (1.5 + uFlicker * 0.5) * frost * inside;
          gl_FragColor = vec4(col, 1.0) * pane + vec4(col * 0.25, 1.0) * (1.0 - pane);
        }`});for(const R of[-1,1])for(const _ of[1,-1]){const E=new U(new Be(1.7,1.05),u);E.position.set(R*1.6,1.7,_*(l/2+.02)),_<0&&(E.rotation.y=Math.PI),n.add(E),E.userData={surface:"glass",window:{group:n,broken:!1,mat:u,worldPos:new S}},E.getWorldPosition(E.userData.window.worldPos),this.windows.push(E),this.rayTargets.push(E)}const d=new U(wt(1.1,2.1,.12),this.matMetalDark);d.position.set(-2.4,1.15,l/2+.05),n.add(d);const f=new U(wt(.14,2.3,.2),this.matGalv);f.position.set(-3.02,1.15,l/2+.07),n.add(f);const g=f.clone();g.position.x=-1.78,n.add(g);const v=new U(wt(1.44,.16,.2),this.matGalv);v.position.set(-2.4,2.34,l/2+.07),n.add(v);for(const R of[.45,1.8]){const _=new U(new Ht(.045,.045,.16,6),this.matGalv);_.position.set(-2.92,R,l/2+.13),n.add(_)}const p=new U(wt(.16,.05,.07),this.matGalv);p.position.set(-1.95,1.1,l/2+.13),n.add(p);for(let R=0;R<3;R++){const _=new U(new Ht(.07,.07,l+.7,6),this.matMetalDark);_.rotation.x=Math.PI/2,_.position.set(2.2+R*.5,o-.4-R%2*.3,0),n.add(_);const E=new U(new Ht(.065,.065,.5,6),this.matMetalDark);E.position.set(2.2+R*.5,o-.4-R%2*.3-.22,l/2+.25),n.add(E)}const m=new U(new mn(.13,.028,5,12),this.matGalv);m.position.set(2.7,o-.1,l/2+.34),m.rotation.y=Math.PI/2,n.add(m);const b=new U(wt(r-1.6,.07,.26),this.matGalv);b.position.set(0,o-.72,-l/2-.13),n.add(b);const C=new U(wt(r-1.6,.2,.04),this.matGalv);C.position.set(0,o-.62,-l/2-.25),n.add(C);for(const R of[-r/2+.7,0,r/2-.7]){const _=new U(wt(.07,.06,.22),this.matGalv);_.position.set(R,o-.78,-l/2-.11),n.add(_)}const y=new U(wt(.5,.35,.5),this.matMetalDark);y.position.set(1.2,o+.55,-.8),n.add(y);const A=new U(wt(.62,.08,.62),this.matGalv);A.position.set(1.2,o+.78,-.8),n.add(A);const M=new U(wt(.6,.4,.06),this.matGalv);M.position.set(3,.9,l/2+.04),n.add(M),this._ladder(n,-r/2-.16,o,.8),this.group.add(n),this._flag(t+2.2,a+o+1.8,e-1.2,1.1)}_container(t,e,i,n,a=0){const r=this._ground(t,e),o=new $t;o.position.set(t,r,e),o.rotation.y=i;const l=6.1,h=2.6,c=2.5,u=new U(wt(l,h,c),this.matContainer[n]);this._vTint(u,.15),u.position.y=h/2-.18+a,u.castShadow=u.receiveShadow=!0,o.add(u),this._addCollider(u,"container");for(const f of[-1,1])for(const g of[-1,1]){const v=new U(wt(.16,h,.16),this.matMetalDark);v.position.set(f*(l/2-.05),h/2-.1+a,g*(c/2-.05)),o.add(v)}const d=new U(new Pe(1,12,7),this.matSnow);this._vTint(d,.05),d.scale.set(l/2-.25,.24,c/2-.25),d.position.y=h-.06+a,o.add(d),this.group.add(o)}_containerStack(t,e,i){this._container(t,e,i,1,0),this._container(t+.3,e-.2,i+.06,2,2.52)}_crateCluster(t,e,i){for(let n=0;n<i;n++){const a=T.range(.75,1.15),r=t+T.gauss(0,1.1),o=e+T.gauss(0,1.1),l=this._ground(r,o),h=new U(wt(a,a*.8,a),this.matCrate);this._vTint(h,.16),h.position.set(r,l+a*.4,o),h.rotation.y=T.next()*Math.PI,h.castShadow=h.receiveShadow=!0,this.group.add(h);const c=this._addCollider(h,"wood");c.thin=!0}i>=4&&this._tarp(t,e,2.6)}_drumCluster(t,e,i){for(let n=0;n<i;n++){const a=t+T.gauss(0,.75),r=e+T.gauss(0,.75),o=this._ground(a,r),l=new U(new Ht(.42,.42,1.15,14,1),this.matDrum);this._vTint(l,.14),l.position.set(a,o+.58,r),l.rotation.y=T.next()*Math.PI,l.castShadow=l.receiveShadow=!0,this.group.add(l);const h=this._addCollider(l,"drum");h.drum={mesh:l,exploded:!1,pos:l.position.clone()},l.userData={surface:"drum",collider:h},this.drums.push(h.drum);const c=l.rotation.y;this._drumCaps.push({x:a+Math.cos(c)*.17,y:o+1.17,z:r-Math.sin(c)*.17},{x:a-Math.cos(c)*.17,y:o+1.17,z:r+Math.sin(c)*.17}),this._drumSnow.push({x:a,y:o+1.18,z:r})}}_barrels(t,e){for(let i=0;i<3;i++){const n=t+i*.85,a=e+Math.sin(i*2.1)*.4,r=this._ground(n,a),o=new U(new Ht(.3,.3,.9,10),this.matMetalDark);o.position.set(n,r+.45,a),o.castShadow=!0,this.group.add(o),this._addCollider(o,"metal")}}_mast(t,e){const i=this._ground(t,e),n=new $t;n.position.set(t,i,e);const a=16;for(const[h,c]of[[.4,.4],[-.4,.4],[.4,-.4],[-.4,-.4]]){const u=new U(new Ht(.06,.09,a,6),this.matMetalDark);u.position.set(h*1,a/2,c*1),u.rotation.x=-c*.04,u.rotation.z=h*.04,u.castShadow=!0,n.add(u)}for(let h=1;h<6;h++){const c=new U(new mn(.62-h*.05,.03,4,12),this.matMetalDark);c.rotation.x=Math.PI/2,c.position.y=h*(a/6),n.add(c)}const r=new U(new Pe(.7,12,8,0,Math.PI*2,0,.5),this.matMetalDark);r.position.set(.5,a-1.2,0),r.rotation.z=-.8,n.add(r),this.beaconMat=new Ei({color:16720418});const o=new U(new Pe(.09,8,6),this.beaconMat);o.position.set(0,a+.15,0),n.add(o),this.beacon=o,this.group.add(n),this._addCollider(n.children[0],"metal"),this.wires=[];const l=new lc({color:8952234,transparent:!0,opacity:.6});for(let h=0;h<3;h++){const c=h/3*Math.PI*2+.5,u=new S(Math.cos(c)*7,i,Math.sin(c)*7).add(new S(t,0,e)),d=new S(t,i+a,e),f=[];for(let C=0;C<=16;C++){const y=C/16,A=new S().lerpVectors(d,u,y);A.y-=Math.sin(y*Math.PI)*.15,f.push(A)}const g=new Le().setFromPoints(f),v=new ru(g,l);this.group.add(v),this.wires.push({line:v,pts:f.map(C=>C.clone()),phase:T.next()*6});const p=this._ground(u.x,u.z),m=new U(wt(.5,.34,.5),this.matConcrete);this._vTint(m,.1),m.position.set(u.x,p+.17,u.z),m.castShadow=!0,this.group.add(m);const b=new U(new Ht(.035,.035,.5,6),this.matGalv);b.position.set(u.x,p+.5,u.z),b.rotation.z=Math.atan2(d.x-u.x,d.y-p)*.9,b.rotation.x=-Math.atan2(d.z-u.z,d.y-p)*.9,this.group.add(b)}this._flag(t+.8,i+a+.6,e,1.4)}_ice(t,e,i){const n=this._ground(t,e),a=new Rt(i*1.5,i*1.1,i,5,4,4),r=a.attributes.position,o=T.next()*20;for(let h=0;h<r.count;h++){const c=r.getX(h),u=r.getY(h),d=r.getZ(h),f=Math.sin(c*2.1+o)*Math.cos(u*1.7+d*1.3+o*2);r.setXYZ(h,c+f*.09*i,u*(.86+.14*Math.sin(d*1.9+o))-.12*i,d+Math.cos(c*1.5+u)*.07*i)}a.computeVertexNormals();const l=new U(a,this.matIce);l.position.set(t,n+i*.38,e),l.rotation.y=T.next()*Math.PI,l.castShadow=!0,this.group.add(l),this._addCollider(l,"ice")}_flag(t,e,i,n){const a=new $t;a.position.set(t,e,i);const r=new U(new Ht(.03,.03,n*.8,5),this.matMetalDark);r.position.y=-n*.2,a.add(r);const o=_h(this.flagTex),l=new U(new Be(n,n*.6,18,8),o);l.castShadow=!1,a.add(l),l.userData={surface:"tarp",cloth:o},this.group.add(a),this.rayTargets.push(l),this.cloths.push(o)}_tarp(t,e,i=2.6){const n=this._ground(t,e),a=T.next()*Math.PI,r=i*.78,o=new Be(i,r,24,12),l=o.attributes.position,h=T.next()*10,c=(M,R)=>{let _=-i*.13*(1-Math.pow(2*M-1,2));return _-=i*.075*Math.sin(R*Math.PI),_+=i*.3*(M-.5),_+=Math.sin(M*Math.PI*3+h)*.05*i*Math.sin(R*Math.PI),_+=Math.sin(M*8.7+R*6.1+h*2)*.016*i,_-=Math.pow(Math.abs(R-.5)*2,3)*.05*i,_};for(let M=0;M<l.count;M++){const R=l.getX(M),_=l.getY(M),E=R/i+.5,D=_/r+.5;l.setZ(M,c(E,D))}o.computeVertexNormals();const u=o.attributes.normal,d=new S(-.53,.72,-.42).normalize(),f=new Float32Array(l.count);for(let M=0;M<l.count;M++)f[M]=ye.clamp(u.getX(M)*d.x+u.getY(M)*d.y+u.getZ(M)*d.z,0,1);o.setAttribute("aFold",new ti(f,1));const g=_h(this.tarpTex,{tint:13225908,folds:!0,both:!0}),v=new U(o,g);v.position.set(t,n+1.58,e),v.rotation.order="YXZ",v.rotation.set(-Math.PI/2+.24,a,0),this.group.add(v),v.userData={surface:"tarp",cloth:g,thin:!0},this.rayTargets.push(v),this.cloths.push(g),v.updateMatrixWorld(!0);const p=(M,R)=>v.localToWorld(new S((M-.5)*i,(R-.5)*r,c(M,R))),m=p(1,.08),b=p(1,.92),C=p(0,.12),y=p(0,.88),A=[];for(const M of[m,b]){const R=this._ground(M.x,M.z),_=M.y-R+.55,E=new U(new Ht(.06,.07,_,7),this.matGalv);E.position.set(M.x,R+_/2,M.z),E.castShadow=!0,this.group.add(E),A.push(new S(M.x,R+_,M.z));const D=new S(M.x-t,0,M.z-e).setLength(.9).add(new S(M.x,0,M.z));this._rope(new S(M.x,M.y+.45,M.z),D,.013);const L=new U(wt(.06,.26,.06),this.matMetalDark);L.position.set(D.x,this._ground(D.x,D.z)+.1,D.z),this.group.add(L)}this._rope(A[0],A[1],.03);for(const M of[C,y]){const R=new S(M.x-Math.cos(a)*.5,0,M.z+Math.sin(a)*.5);R.y=this._ground(R.x,R.z),this._rope(M,R,.013);const _=new U(wt(.06,.26,.06),this.matMetalDark);_.position.set(R.x,R.y+.1,R.z),this.group.add(_)}}_rope(t,e,i){const n=new S().subVectors(e,t),a=n.length(),r=new U(new Ht(i,i,a,5),this.matRope);r.position.copy(t).addScaledVector(n,.5),r.quaternion.setFromUnitVectors(new S(0,1,0),n.normalize()),this.group.add(r)}_buildPerimeter(){this._buildPerimeterPosts();for(let t=0;t<8;t++){const e=t/8*Math.PI*2+.3;this.spawnPoints.push(new S(Math.cos(e)*33,0,Math.sin(e)*33))}}_buildPerimeterPosts(){for(let e=0;e<44;e++){const i=e/44*Math.PI*2;if(i>4.2&&i<5)continue;const n=Math.cos(i)*36,a=Math.sin(i)*36,r=this._ground(n,a),o=T.range(-.03,.03);this._postMatrices.push(new Wt().compose(new S(n,r+1,a),new xe().setFromEuler(new ze(o,i,T.range(-.03,.03))),new S(1,1,1)))}}_collectCoverPoints(){for(const t of this.colliders)if(t.surface==="wood"||t.surface==="container"||t.surface==="metal"){const e=new S;if(t.aabb.getSize(e),e.y>.7&&e.x+e.z>1.2){const i=new S;t.aabb.getCenter(i);for(const n of[[1,0],[-1,0],[0,1],[0,-1]]){const a=new S(n[0],0,n[1]);Math.abs(e.x*n[0])+Math.abs(e.z*n[1])<.5||this.coverPoints.push({pos:i.clone().add(a.clone().multiplyScalar(e.x*Math.abs(n[0])/2+e.z*Math.abs(n[1])/2+.7)),normal:a})}}}}_mainBuilding(t,e,i){const n=new $t,a=this._ground(t,e);n.position.set(t,a,e),n.rotation.y=i;const r=10,o=4.2,l=6,h=new U(wt(r,o,l),this.matWall);this._vTint(h,.08),h.position.y=o/2-.15,h.castShadow=h.receiveShadow=!0,n.add(h),this._addCollider(h,"metal");const c=this.matMetalDark;for(const D of[-1,1]){const L=new U(wt(r+.6,.18,l/2+.55),c);L.position.set(0,o+.42,D*(l/4+.05)),L.rotation.x=-D*.1,L.castShadow=!0,n.add(L)}const u=new U(wt(r+.72,.3,l+.72),this.matGalv);u.position.y=o+.12,n.add(u);for(const D of[-1,1]){const L=new U(new Pe(1,14,8),this.matSnow);this._vTint(L,.05),L.scale.set(r/2-.1,.2,l/4+.1),L.position.set(0,o+.56,D*(l/4+.05)),L.rotation.x=-D*.1,n.add(L)}const d=new U(new Pe(1,16,8),this.matSnow);d.scale.set(r/2+.05,.24,.55),d.position.y=o+.62,n.add(d);const f=new U(wt(r+.15,.16,l+.15),this.matSnow);f.position.y=o+.3,n.add(f);const g=new re({uniforms:{uWarm:{value:new Ct(16763274)},uFlicker:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);}",fragmentShader:`
        uniform vec3 uWarm; uniform float uFlicker;
        varying vec2 vUv;
        void main() {
          float pane = step(0.08, fract(vUv.x * 3.0)) * step(0.08, fract(vUv.y * 2.0));
          float frost = 0.75 + 0.25 * sin(vUv.x * 27.0) * sin(vUv.y * 19.0);
          // silhouettes inside: dark shapes of racks/people (lit interior)
          float inside = 0.60 + 0.40 * step(0.45, sin(vUv.x * 9.5 + vUv.y * 4.0) * cos(vUv.y * 13.0 - 1.7));
          inside *= 0.82 + 0.30 * (1.0 - vUv.y); // lamp-warm floor, cooler ceiling
          vec3 col = uWarm * (1.5 + uFlicker * 0.5) * frost * inside;
          gl_FragColor = vec4(col, 1.0) * pane + vec4(col * 0.25, 1.0) * (1.0 - pane);
        }`});for(const D of[-1,1])for(const L of[1,-1])for(let I=0;I<2;I++){const k=new U(new Be(1.75,1.35),g);k.position.set(D*(2+I*.1),1.6+I*1.5,L*(l/2+.02)),L<0&&(k.rotation.y=Math.PI),n.add(k),k.userData={surface:"glass",window:{group:n,broken:!1,mat:g,worldPos:new S}},k.getWorldPosition(k.userData.window.worldPos),this.windows.push(k),this.rayTargets.push(k)}const v=new U(wt(1.7,2.3,.14),this.matMetalDark);v.position.set(-3.1,1.27,l/2+.06),n.add(v);const p=new U(wt(.18,2.5,.22),this.matGalv);p.position.set(-4.02,1.25,l/2+.08),n.add(p);const m=p.clone();m.position.x=-2.18,n.add(m);const b=new U(wt(2.1,.18,.22),this.matGalv);b.position.set(-3.1,2.55,l/2+.08),n.add(b);const C=new Ei({color:16767392}),y=new U(new Pe(.11,8,6),C);y.position.set(-3.1,2.85,l/2+.3),n.add(y);const A=new U(wt(6.4,.34,2.4),this.matDeck);this._vTint(A,.07),A.position.set(-1.4,.17,l/2+1.3),A.castShadow=A.receiveShadow=!0,n.add(A),this._addCollider(A,"wood");const M=new U(wt(1.9,.17,.55),this.matDeck);this._vTint(M,.07),M.position.set(-1.4,.085,l/2+2.7),M.receiveShadow=!0,n.add(M);for(const D of[-1,1]){const L=new U(wt(2.6,.07,.07),this.matGalv);L.position.set(-1.4+D*2.95,1.22,l/2+1.3),n.add(L);const I=new U(wt(2.6,.16,.16),this.matSnow);I.position.set(-1.4+D*2.95,1.3,l/2+1.3),n.add(I);for(const k of[0,1.2,2.45]){const q=new U(wt(.08,1.05,.08),this.matGalv);q.position.set(-1.4+D*(1.7+k),.75,l/2+2.05),n.add(q)}}const R=new U(wt(r-2,.08,.28),this.matGalv);R.position.set(0,o-.9,-l/2-.14),n.add(R);for(const D of[-r/2+.8,0,r/2-.8]){const L=new U(wt(.07,.06,.24),this.matGalv);L.position.set(D,o-.97,-l/2-.12),n.add(L)}const _=new U(new Ht(.11,.11,o+.5,8),this.matGalv);_.position.set(r/2-.45,(o+.5)/2,-l/2-.35),n.add(_);const E=new U(new Ht(.1,.1,1.1,8),this.matGalv);E.rotation.z=Math.PI/2,E.position.set(r/2-1,o+.55,-l/2-.35),n.add(E),this._ladder(n,-r/2-.17,o+.3,-1.2),this.group.add(n),this._flag(t+4,a+o+.9,e-1.6,1.3)}_walkway(t){const i=[];for(let n=0;n<t.length-1;n++){const[a,r]=t[n],[o,l]=t[n+1],h=Math.hypot(o-a,l-r),c=Math.max(1,Math.round(h/2.2));for(let u=0;u<c;u++)i.push([a+(o-a)*(u/c),r+(l-r)*(u/c),a+(o-a)*((u+1)/c),r+(l-r)*((u+1)/c)])}for(const[n,[a,r,o,l]]of i.entries()){const h=n===i.length-1,c=o-a,u=l-r,d=Math.hypot(c,u),f=(a+o)/2,g=(r+l)/2,v=this._ground(a,r),p=this._ground(o,l);let m=Math.max(v,p);for(let M=1;M<5;M++)m=Math.max(m,this._ground(a+(o-a)*M/5,r+(l-r)*M/5));const b=new U(wt(d+.06,.26,1.6),this.matDeck);this._vTint(b,.07),b.position.set(f,m+.34,g),b.rotation.y=Math.atan2(-u,c),b.rotation.z=Math.atan2(p-v,d),b.castShadow=b.receiveShadow=!0,this.group.add(b),this._addCollider(b,"wood");for(const[M,R]of[[a,r],[o,l],[(a+o)/2,(r+l)/2]]){const _=this._ground(M,R),E=Math.max(.28,m+.24-_),D=new Wt;D.compose(new S(M,_+E/2,R),new xe,new S(1,E,1)),this._legMatrices.push(D)}const C=Math.max(.4,d-.18),y=Math.atan2(-u,c),A=Math.atan2(p-v,d);for(const M of h?[]:[-1,1]){const R=f+-u/d*M*.74,_=g+c/d*M*(1.6/2-.06),E=new xe().setFromEuler(new ze(0,y,A,"YXZ"));for(const[D,L,I]of[[this._railBars,1.06,[C,.08,.08]],[this._railMids,.62,[C,.06,.06]],[this._railSnow,1.13,[C,.15,.17]]])D.push(new Wt().compose(new S(R,m+L,_),E,new S(...I)));for(const[D,L,I]of[[a,r,v],[o,l,p]]){const k=new Wt;k.compose(new S(D+-u/d*M*(1.6/2-.06),I+.6,L+c/d*M*(1.6/2-.06)),new xe().setFromEuler(new ze(0,Math.atan2(-u,c),0)),new S(1,1,1)),this._railPosts.push(k)}}}}_depot(t,e,i){const n=new $t,a=this._ground(t,e);n.position.set(t,a,e),n.rotation.y=i;const r=4.6,o=3.6,l=.42,h=.3,c=[[0,o/2,r,h],[0,-o/2,r,h],[r/2,0,h,o-2*h],[-r/2,0,h,o-2*h]];for(const[d,f,g,v]of c){const p=new U(wt(g,l,v),this.matConcrete);this._vTint(p,.09),p.position.set(d,l/2,f),p.castShadow=p.receiveShadow=!0,n.add(p)}const u=new U(wt(2.3,.08,1.6),this.matCrate);this._vTint(u,.12),u.position.set(-.7,.14,0),u.castShadow=u.receiveShadow=!0,n.add(u);for(const d of[-1.5,-.7,.1]){const f=new U(wt(.16,.12,1.5),this.matCrate);this._vTint(f,.12),f.position.set(d,.06,0),n.add(f)}this.group.add(n),this._drumCluster(t-.8,e-.15,2),this._drumCluster(t-.7,e+.15,2),this._drumCluster(t+1.1,e,2),this._sign(t-2.9,e+2.2,i+.1,"FLAMMABLE","NO SMOKING / NO OPEN FLAME")}_antennaField(t,e){const i=this._ground(t,e),n=[[-3.2,1.5,6.5],[1.2,-4.2,4.8],[-1.5,-5,5.6]];for(const[h,c,u]of n){const d=t+h,f=e+c,g=this._ground(d,f),v=new U(wt(.6,.3,.6),this.matConcrete);this._vTint(v,.1),v.position.set(d,g+.15,f),v.castShadow=!0,this.group.add(v);const p=new U(new Ht(.022,.034,u,5),this.matGalv);p.position.set(d,g+.3+u/2,f),p.castShadow=!0,this.group.add(p);const m=new U(new Pe(.05,6,5),this.beaconMat);m.position.set(d,g+.3+u+.06,f),this.group.add(m);const b=new U(wt(.34,.05,.05),this.matGalv);b.position.set(d,g+.85,f),this.group.add(b)}const a=this._ground(t+4.5,e+3.5),r=new U(wt(.16,1.6,.16),this.matGalv);r.position.set(t+4.5,a+.8,e+3.5),r.castShadow=!0,this.group.add(r);const o=new U(new Pe(.55,12,8,0,Math.PI*2,0,.45),this.matMetalDark);o.position.set(t+4.5,a+1.75,e+3.5),o.rotation.z=-.9,o.rotation.y=.6,this.group.add(o);const l=new U(wt(1.2,.95,.6),this.matMetalDark);l.position.set(t+2.6,i+.48,e-2.6),l.castShadow=l.receiveShadow=!0,this.group.add(l),this._addCollider(l,"metal");for(let h=0;h<4;h++){const c=new U(wt(1,.05,.05),this.matGalv);c.position.set(t+2.6,i+.28+h*.18,e-2.28),this.group.add(c)}}_weatherMast(t,e){const i=this._ground(t,e),n=new $t;n.position.set(t,i,e);const a=4.6,r=new U(new Ht(.05,.07,a,6),this.matGalv);r.position.y=a/2,r.castShadow=!0,n.add(r);const o=new U(wt(1.1,.05,.05),this.matGalv);o.position.y=a-.25,n.add(o);const l=new $t;l.position.y=a+.1;const h=new U(new Pe(.06,6,5),this.matMetalDark);l.add(h),this._anoCups=[];for(let m=0;m<3;m++){const b=m/3*Math.PI*2,C=new U(wt(.34,.03,.03),this.matGalv);C.position.set(Math.cos(b)*.17,0,Math.sin(b)*.17),C.rotation.y=-b,l.add(C);const y=new U(new Pe(.07,7,5,0,Math.PI*1.35),this.matGalv);y.position.set(Math.cos(b)*.34,0,Math.sin(b)*.34),y.rotation.y=-b+Math.PI/2,l.add(y)}n.add(l),this.anemometer=l;const c=new $t;c.position.y=a-.25;const u=new U(wt(.34,.22,.02),this.matMetalDark);u.position.x=-.28,c.add(u);const d=new U(wt(.6,.03,.03),this.matGalv);c.add(d);const f=new U(new Yo(.05,.16,6),this.matMetalDark);f.rotation.z=-Math.PI/2,f.position.x=.35,c.add(f),n.add(c),this.vane=c;const g=new U(wt(.55,.5,.45),this.matMetalDark);g.position.y=1.15,g.castShadow=!0,n.add(g);for(let m=0;m<3;m++){const b=new U(wt(.62,.05,.52),this.matGalv);b.position.y=1+m*.15,n.add(b)}const v=new U(wt(.06,1,.06),this.matGalv);v.position.set(.18,.5,.18),n.add(v);const p=v.clone();p.position.set(-.18,.5,-.18),n.add(p),this.group.add(n)}_sign(t,e,i,n,a){const r=this._ground(t,e),o=new $t;o.position.set(t,r,e),o.rotation.y=i;for(const c of[-.62,.62]){const u=new U(wt(.08,1.9,.08),this.matMetalDark);u.position.set(c,.95,0),u.castShadow=!0,o.add(u)}const l=new U(wt(1.7,.78,.05),this.matMetalDark);l.position.set(0,1.42,.03),l.castShadow=!0,o.add(l);const h=new U(new Be(1.6,.68),new zt({map:Hg(n,a),roughness:.85}));h.position.set(0,1.42,.062),o.add(h),this.group.add(o)}_ladder(t,e,i,n){const a=i-.35+.5;for(const o of[-.21,.21]){const l=new U(wt(.055,a,.055),this.matGalv);l.position.set(e,a/2+.15-.5,n+o),t.add(l)}const r=Math.floor(a/.34);for(let o=0;o<=r;o++){const l=new Wt().makeTranslation(e,.32+o*.34-.5,n);this._rungMatrices.push({g:t,m:l})}}_drift(t,e,i,n){const a=new Pe(1,18,12),r=a.attributes.position,o=T.next()*100;for(let f=0;f<r.count;f++){const g=r.getX(f),v=r.getY(f),p=r.getZ(f),m=Math.sin(g*3.1+o)*Math.cos(p*2.7+o*1.3)+.5*Math.sin(v*5+g*4+o*2.1),b=1+m*.055*Math.max(0,v+.35);r.setXYZ(f,g*b,v*(1+m*.045*Math.max(0,v+.3)),p*b)}const l=Math.atan2(this._wind.y,this._wind.x),h=Math.max(i,n)/2+T.range(1.6,2.6),c=T.range(.55,.95),u=new Wt().compose(new S(t-this._wind.x*(Math.max(i,n)/4+.9),this._ground(t,e)+c*.32,e-this._wind.y*(Math.max(i,n)/4+.9)),new xe().setFromEuler(new ze(0,l,T.range(-.05,.05))),new S(h,c,Math.min(i,n)/2+T.range(.4,.9)));r.applyMatrix4(u);for(let f=0;f<r.count;f++){const g=r.getX(f),v=r.getZ(f),p=this._ground(g,v)+.03,m=r.getY(f);if(m<p+.35){const b=ye.smoothstep(m,p-.35,p+.35);r.setY(f,p+(m-p)*b)}}a.computeVertexNormals();const d=new U(a,this.matSnow);this._vTint(d,.06),d.receiveShadow=!0,this.group.add(d)}_skirt(t,e,i,n,a=0){const r=Math.cos(a),o=Math.sin(a),l=[{nx:1,nz:0,len:n},{nx:-1,nz:0,len:n},{nx:0,nz:1,len:i},{nx:0,nz:-1,len:i}];for(const h of l){const u=h.nx*this._wind.x+h.nz*this._wind.y<0?T.range(.45,.7):T.range(.2,.34),d=(h.nx?i:n)/2+T.range(.3,.55),f=h.nx*r-h.nz*o,g=h.nx*o+h.nz*r,v=t+f*d,p=e+g*d,m=T.range(.5,.85);this._skirtMatrices.push(new Wt().compose(new S(v,this._ground(v,p)+u*.22,p),new xe().setFromEuler(new ze(0,a,0)),new S(h.nx?m:h.len/2+T.range(.3,.8),u,h.nz?m:h.len/2+T.range(.3,.8))))}}_stain(t,e,i){const n=new Be(i,i*.7,5,3).rotateX(-Math.PI/2),a=n.attributes.position;for(let o=0;o<a.count;o++)a.setY(o,this._ground(t+a.getX(o),e+a.getZ(o))-this._ground(t,e)+.028);const r=new U(n,new Ei({map:this.stainTexture,transparent:!0,depthWrite:!1}));r.rotation.y=T.next()*Math.PI,r.position.set(t,this._ground(t,e),e),r.renderOrder=2,this.group.add(r)}_pallet(t,e,i){const n=this._ground(t,e),a=new $t;a.position.set(t,n,e),a.rotation.y=i;const r=new U(wt(1.9,.08,1.3),this.matCrate);this._vTint(r,.14),r.position.y=.14,r.castShadow=r.receiveShadow=!0,a.add(r);for(const h of[-.75,0,.75]){const c=new U(wt(.16,.12,1.2),this.matCrate);this._vTint(c,.14),c.position.set(h,.06,0),a.add(c)}const o=new U(wt(.85,.68,.85),this.matCrate);this._vTint(o,.14),o.position.set(-.4,.52,-.15),o.rotation.y=.15,o.castShadow=o.receiveShadow=!0,a.add(o);const l=new U(wt(.7,.55,.7),this.matCrate);this._vTint(l,.14),l.position.set(.5,.47,.2),l.rotation.y=-.3,l.castShadow=l.receiveShadow=!0,a.add(l),this.group.add(a),this._addCollider(o,"wood").thin=!0,this._addCollider(l,"wood").thin=!0}_shovel(t,e,i,n){const a=new $t;a.position.set(t,e,i),a.rotation.y=n;const r=new U(new Ht(.024,.028,1.35,6),this.matCrate);r.position.set(0,.62,.12),r.rotation.x=.2,a.add(r);const o=new U(wt(.24,.32,.035),this.matGalv);o.position.set(0,.08,.3),o.rotation.x=.35,a.add(o);const l=new U(wt(.3,.035,.035),this.matGalv);l.position.set(0,1.28,.02),a.add(l),this.group.add(a)}_hose(t,e,i){const n=new $t;n.position.set(t,e,i);const a=new U(wt(.34,.06,.08),this.matGalv);a.position.set(0,.92,-.36),n.add(a);for(let o=0;o<3;o++){const l=new U(new mn(.34-o*.012,.065,7,18),this.matHose);l.rotation.x=Math.PI/2+.06,l.position.set(0,1.05-o*.13,.1),l.castShadow=!0,n.add(l)}const r=new U(new Ht(.03,.045,.22,6),this.matGalv);r.rotation.z=1.2,r.position.set(.42,.78,.12),n.add(r),this.group.add(n)}_finalizeInstances(){new ae;const t=(n,a,r,{shadow:o=!0,color:l=null}={})=>{if(!r.length)return null;const h=new oc(n,a,r.length);for(let c=0;c<r.length;c++)h.setMatrixAt(c,r[c]);if(l){h.instanceColor=new Ci(new Float32Array(r.length*3),3);for(let c=0;c<r.length;c++){const u=.82+T.next()*.3;h.instanceColor.setXYZ(c,u*(1-T.next()*.1),u,u*(1+T.next()*.08))}}return h.castShadow=o,h.receiveShadow=!0,h.instanceMatrix.needsUpdate=!0,this.group.add(h),h},e=(n,a,r,o=0,l=1)=>new Wt().compose(new S(n,a,r),new xe().setFromEuler(new ze(0,o,0)),new S(l,l,l));t(wt(1,1,1),this.matGalv,this._railBars,{shadow:!0}),t(wt(1,1,1),this.matGalv,this._railMids,{shadow:!1}),t(wt(1,1,1),this.matSnow,this._railSnow,{shadow:!1,color:!0}),t(new Ht(.07,.09,2.2,6),this.matMetalDark,this._postMatrices,{color:!0});{const n=[],a=new S,r=new S,o=new S,l=new xe,h=new S(1,0,0);for(let c=0;c<this._postMatrices.length;c++){const u=this._postMatrices[c],d=this._postMatrices[(c+1)%this._postMatrices.length];a.setFromMatrixPosition(u),r.setFromMatrixPosition(d),o.subVectors(r,a);const f=o.length();if(!(f>8)){l.setFromUnitVectors(h,o.normalize());for(const g of[.62,1.5])n.push(new Wt().compose(new S((a.x+r.x)/2,(a.y+r.y)/2-1+g,(a.z+r.z)/2),l.clone(),new S(f,1,1)))}}t(wt(1,.045,.045),this.matGalv,n,{shadow:!1})}t(wt(.16,1,.16),this.matGalv,this._legMatrices),t(wt(.09,1.1,.09),this.matGalv,this._railPosts);const i=this._rungMatrices.map(({g:n,m:a})=>(n.updateWorldMatrix(!0,!1),a.clone().premultiply(n.matrixWorld)));if(t(wt(.36,.045,.045),this.matGalv,i,{shadow:!1}),t(new Ht(.085,.085,.05,8),this.matGalv,this._drumCaps.map(n=>e(n.x,n.y,n.z)),{shadow:!1}),t(new Ht(.3,.34,.09,10),this.matSnow,this._drumSnow.map(n=>e(n.x,n.y,n.z,T.next()*Math.PI)),{shadow:!1}),this._skirtMatrices.length){const n=new Pe(1,10,7),a=n.attributes.position;for(let r=0;r<a.count;r++){const o=a.getX(r),l=a.getY(r),h=a.getZ(r),c=Math.sin(o*4.2+h*3.1)*.06*Math.max(0,l);a.setXYZ(r,o*(1+c),l,h*(1+c))}n.computeVertexNormals(),t(n,this.matSnow,this._skirtMatrices,{shadow:!1,color:!0})}if(this._aoQuads.length){const n=new Ei({map:this.aoTexture,transparent:!0,depthWrite:!1,opacity:.78}),a=[],r=[],o=[];let l=0;for(const u of this._aoQuads){for(let g=0;g<=4;g++)for(let v=0;v<=6;v++){const p=u.x+(v/6-.5)*u.w,m=u.z+(g/4-.5)*u.d;a.push(p,this._ground(p,m)+.03,m),r.push(v/6,g/4)}for(let g=0;g<4;g++)for(let v=0;v<6;v++){const p=l+g*7+v;o.push(p,p+6+1,p+1,p+1,p+6+1,p+6+2)}l+=35}const h=new Le;h.setAttribute("position",new me(a,3)),h.setAttribute("uv",new me(r,2)),h.setIndex(o);const c=new U(h,n);c.renderOrder=1,this.group.add(c)}}update(t,e,i,n){for(const a of this.iceMaterials)a.uniforms.uTime.value=e;for(const a of this.cloths)a.uniforms.uTime.value=e,a.uniforms.uGust.value=n,a.uniforms.uWind.value.copy(i),a.uniforms.uImpulse.value=Math.max(0,a.uniforms.uImpulse.value-t*2.4);if(this.wires)for(const a of this.wires){const r=a.line.geometry.attributes.position;for(let o=0;o<a.pts.length;o++){const l=o/(a.pts.length-1),h=Math.sin(e*1.1+a.phase+l*3)*.09*l*(.5+n);r.setXYZ(o,a.pts[o].x+h*.7,a.pts[o].y,a.pts[o].z+h)}r.needsUpdate=!0}if(this.anemometer&&(this.anemometer.rotation.y+=t*(2.2+n*7.5)),this.vane){const a=Math.atan2(i.x,i.y||i.x*.01);this.vane.rotation.y+=(a-this.vane.rotation.y)*Math.min(1,t*1.4)}if(this.beacon){const a=e%2.4<.18?1:.04;this.beaconMat.color.setScalar(a).multiplyScalar(1).r*=a>.5?1:.2}}}function Jg(){const s=document.createElement("canvas");s.width=128,s.height=80;const t=s.getContext("2d");t.fillStyle="#b8452e",t.fillRect(0,0,128,80),t.fillStyle="#e8e2d0",t.fillRect(0,0,44,80),t.fillStyle="#2a3f6b",t.beginPath(),t.arc(84,40,17,0,Math.PI*2),t.fill(),t.fillStyle="#dfe8f2";for(let i=0;i<5;i++){const n=i/5*Math.PI*2-Math.PI/2;t.beginPath(),t.arc(84+Math.cos(n)*9,40+Math.sin(n)*9,2.6,0,Math.PI*2),t.fill()}for(let i=0;i<60;i++)t.fillStyle=`rgba(120,90,70,${(T.next()*.12).toFixed(3)})`,t.fillRect(T.next()*128,T.next()*80,T.range(3,14),T.range(2,8));const e=new Vi(s);return e.colorSpace=Ne,e}function Qg(){const s=document.createElement("canvas");s.width=256,s.height=256;const t=s.getContext("2d");t.fillStyle="#98a184",t.fillRect(0,0,256,256),t.strokeStyle="rgba(60,66,48,0.16)",t.lineWidth=1;for(let i=0;i<64;i++)t.beginPath(),t.moveTo(i*4,0),t.lineTo(i*4,256),t.stroke(),t.beginPath(),t.moveTo(0,i*4),t.lineTo(256,i*4),t.stroke();t.strokeStyle="rgba(52,58,42,0.5)",t.lineWidth=3;for(let i=0;i<=4;i++)t.beginPath(),t.moveTo(i*64,0),t.lineTo(i*64,256),t.stroke();t.strokeStyle="rgba(52,58,42,0.28)";for(let i=0;i<=4;i++)t.beginPath(),t.moveTo(0,i*64),t.lineTo(256,i*64),t.stroke();for(let i=0;i<40;i++)t.fillStyle=`rgba(44,48,34,${(T.next()*.14).toFixed(3)})`,t.fillRect(T.next()*256,T.next()*256,T.range(8,44),T.range(6,26));for(let i=0;i<14;i++)t.fillStyle=`rgba(226,233,240,${(.05+T.next()*.1).toFixed(3)})`,t.fillRect(T.next()*256,T.next()*256,T.range(10,60),T.range(8,30));for(const[i,n]of[[8,8],[248,8],[8,248],[248,248]]){const a=t.createRadialGradient(i,n,2,i,n,22);a.addColorStop(0,"rgba(96,62,38,0.55)"),a.addColorStop(1,"rgba(96,62,38,0)"),t.fillStyle=a,t.fillRect(i-24,n-24,48,48),t.fillStyle="#1c1c18",t.beginPath(),t.arc(i,n,5,0,Math.PI*2),t.fill()}const e=new Vi(s);return e.colorSpace=Ne,e}const jg=`
  precision mediump float;
  uniform vec3 uColor;
  uniform float uIntensity, uTime, uGust;
  varying vec2 vUv;
  varying float vY;
  varying vec3 vN;
  varying vec3 vV;
  float hash(vec2 p) { return fract(sin(dot(floor(p), vec2(127.1, 311.7))) * 43758.5453); }
  float vn(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  void main() {
    // radial soft edge, vertical gradient, drifting beam streaks (snow in beam)
    float r = length(vUv - vec2(0.5, 0.5)) * 2.0;
    // no plateau: a lit core with hard rim read as a hard-edged V/cone
    // silhouette against the sky — falloff starts at the centre
    float edge = pow(max(1.0 - r, 0.0), 1.55);
    // bright at the lamp head, ~15% at the pool: the wide open end of the
    // cone must dissolve, or it hangs in the sky like a curved dome shell
    float vert = mix(0.9, 0.15, pow(vY, 0.8)) * smoothstep(0.0, 0.14, vY); // apex dissolves too
    float streaks = 0.8 + 0.35 * vn(vec2(vUv.x * 9.0, vY * 2.0 - uTime * 0.55)) + 0.15 * vn(vec2(vUv.x * 22.0, vY * 3.0 - uTime * 1.3));
    float dust = 0.75 + 0.45 * vn(vec2(vUv.x * 14.0, vY * 5.0 - uTime * 0.9)) * uGust;
    // view-angle fade: at the silhouette rim (normal perpendicular to view)
    // an additive tube shows its hard geometric edge against the sky — the
    // classic "curved dome artifact" complaint. Kill alpha there.
    float rim = smoothstep(0.0, 0.45, abs(dot(normalize(vN), normalize(vV))));
    float a = edge * vert * streaks * dust * uIntensity * rim;
    gl_FragColor = vec4(uColor, a);
  }`,tv=`
  varying vec2 vUv;
  varying float vY;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vUv = uv;
    vY = 1.0 - uv.y;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;class ev{constructor(t,e){this.scene=t,this.terrain=e,this.group=new $t,t.add(this.group),this.time=0;const i=new ws(9414872,1.15);i.position.set(-38,52,-30),i.castShadow=!0,i.shadow.mapSize.set(2048,2048),i.shadow.camera.left=-55,i.shadow.camera.right=55,i.shadow.camera.top=55,i.shadow.camera.bottom=-55,i.shadow.camera.near=5,i.shadow.camera.far=140,i.shadow.bias=-6e-4,i.shadow.normalBias=.03,this.group.add(i),this.key=i,this.hemi=new fc(4875157,12110056,1.05),this.group.add(this.hemi),this.auroraMod=new Ct(1,1,1),this.floodDefs=[{x:-22,z:-14,h:7.5,tx:2,tz:2,range:26},{x:20,z:12,h:8,tx:-3,tz:-4,range:26},{x:14,z:-24,h:6.5,tx:-4,tz:5,range:24},{x:-12,z:24,h:7,tx:4,tz:-5,range:24},{x:30,z:-2,h:6,tx:-8,tz:2,range:20}],this.floods=[];for(const[n,a]of this.floodDefs.entries()){const r=e.heightAt(a.x,a.z),o=new $t;o.position.set(a.x,r,a.z);const l=new U(new Ht(.09,.14,a.h,8),new zt({color:3028027,roughness:.6,metalness:.6}));l.position.y=a.h/2,l.castShadow=!0,o.add(l);const h=new $t;h.position.y=a.h;const c=new U(new Rt(.55,.3,.4),new zt({color:2237996,roughness:.5,metalness:.7}));h.add(c);const u=new Ei({color:16767392}),d=new U(new Rt(.42,.08,.3),u);d.position.y=-.17,h.add(d),o.add(h),this.group.add(o);const f=new mu(16761469,190,a.range*2.4,.62,.78,1.6);f.position.set(a.x,r+a.h,a.z),f.target.position.set(a.x+a.tx,e.heightAt(a.x+a.tx,a.z+a.tz)+.5,a.z+a.tz),n<2&&(f.castShadow=!0,f.shadow.mapSize.set(1024,1024),f.shadow.bias=-.0015),this.group.add(f),this.group.add(f.target);const g=new S(a.x+a.tx,0,a.z+a.tz),v=e.heightAt(g.x,g.z),p=new S(g.x-a.x,v-(r+a.h),g.z-a.z),m=p.length(),b=m*1.15,C=Math.tan(.62)*b*.8,y=new Ht(C,C*.12,b,24,8,!0),A=new re({transparent:!0,depthWrite:!1,blending:ki,side:Qe,uniforms:{uColor:{value:new Ct(16760704)},uIntensity:{value:.13},uTime:{value:0},uGust:{value:.3}},vertexShader:tv,fragmentShader:jg}),M=new U(y,A);M.position.copy(new S(a.x,r+a.h,a.z)).add(p.clone().multiplyScalar(.5+.075*b/m)),M.quaternion.setFromUnitVectors(new S(0,1,0),p.clone().negate().normalize()),M.renderOrder=5,this.group.add(M),this.floods.push({mast:o,head:h,spot:f,cone:M,coneMat:A,baseIntensity:.13,phase:n*1.7,sway:n*.13})}this.dynamicPool=[];for(let n=0;n<6;n++){const a=new mc(16777215,0,20,1.8);a.visible=!1,this.group.add(a),this.dynamicPool.push({light:a,life:0,maxLife:1,baseIntensity:0,t:0})}}flashLight(t,e,i,n){let a=this.dynamicPool.find(r=>!r.light.visible);return a||(a=this.dynamicPool[0]),a.light.color.set(e),a.light.position.copy(t),a.light.visible=!0,a.baseIntensity=i,a.maxLife=n,a.life=n,a}update(t,e){this.time+=t;for(const i of this.floods){const n=Math.sin(this.time*.5+i.phase)*.012+Math.sin(this.time*1.9+i.phase*2)*.004*(.5+e);i.head.rotation.z=n,i.spot.position.x+=n*2,(i.spot.position.x-i.mast.position.x)*0,i.spot.position.x=i.mast.position.x+n*2,i.coneMat.uniforms.uTime.value=this.time,i.coneMat.uniforms.uGust.value=e,i.coneMat.uniforms.uIntensity.value=i.baseIntensity*(.85+e*.5),i.cone.rotation.z=n*1.4}for(const i of this.dynamicPool){if(!i.light.visible)continue;if(i.life-=t,i.life<=0){i.light.visible=!1,i.light.intensity=0;continue}const n=i.life/i.maxLife;i.light.intensity=i.baseIntensity*Math.min(1,n*4)}}}const iv=`
  precision highp float;
  attribute float aSeed;
  uniform float uTime;
  uniform vec3 uCenter;
  uniform vec3 uWind;      // wind velocity (world units/s)
  uniform vec3 uBox;       // xz half-extent, y height
  uniform float uPixelRatio;
  uniform float uSizeScale;
  varying float vFade;
  varying float vWarm;
  varying float vSeed;
  varying vec2 vUv;
  uniform vec4 uFloods[5];
  float h1(float n) { return fract(sin(n * 127.1) * 43758.5453); }
  void main() {
    vUv = uv;
    float s1 = h1(aSeed);
    float s2 = h1(aSeed + 17.31);
    float s3 = h1(aSeed + 43.7);
    // base scatter in the wrap box
    vec3 base = vec3((s1 - 0.5) * 2.0 * uBox.x, s2 * uBox.y, (s3 - 0.5) * 2.0 * uBox.x);
    // per-flake speed variance + fall + wind drift, wrapped into the box
    float spd = 0.5 + s3 * 1.2;
    vec3 p = base + uWind * uTime * spd;
    p.y -= uTime * (0.55 + s1 * 0.7);
    // gentle turbulence
    p.x += sin(uTime * (0.7 + s2) + aSeed) * 0.6;
    p.y += sin(uTime * (0.5 + s1) + aSeed * 2.0) * 0.35;
    p = mod(p + uBox.x, uBox * 2.0) - uBox; // wrap xz & y (vec ctor trick: uBox*2 - uBox)
    p.y = mod(p.y + uBox.y, uBox.y * 2.0) - uBox.y;
    vec3 world = p + vec3(uCenter.x, uCenter.y - uBox.y * 0.45, uCenter.z);
    vec4 mv = viewMatrix * vec4(world, 1.0);
    // warm tint when drifting through a floodlight pool
    float warm = 0.0;
    for (int i = 0; i < 5; i++) {
      float d = distance(world, uFloods[i].xyz);
      warm += clamp(1.0 - d / uFloods[i].w, 0.0, 1.0);
    }
    vWarm = clamp(warm, 0.0, 1.0);
    vSeed = s2;
    float dist = -mv.z;
    vFade = smoothstep(0.4, 2.2, dist) * (1.0 - smoothstep(uBox.x * 0.75, uBox.x * 1.4, dist));
    // size: near flakes bigger; ground-blizzard streaks stretch with wind
    float size = (0.018 + s1 * 0.03) * uSizeScale;
    vec3 bill = position;
    // stretch horizontally near the ground where the blizzard streams
    float nearGround = smoothstep(2.4, 0.2, world.y - (uCenter.y - uBox.y * 0.45));
    bill.x *= 1.0 + min(length(uWind) * 0.14, 3.0) * nearGround;
    // classic billboard: offset in view space, which is camera-aligned
    gl_Position = projectionMatrix * (mv + vec4(bill * size, 0.0));
  }`,nv=`
  precision mediump float;
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying float vFade;
  varying float vWarm;
  varying float vSeed;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    vec3 cold = vec3(0.62, 0.72, 0.92);
    vec3 warm = vec3(1.0, 0.78, 0.5);
    vec3 col = mix(cold, warm, vWarm * 0.85);
    float a = tex.a * uOpacity * vFade * (0.45 + vSeed * 0.55);
    if (a < 0.003) discard;
    gl_FragColor = vec4(col, a);
  }`;class sv{constructor(t,e,i){this.scene=t,this.time=0,this.windDirAngle=2.1,this.windDir=new gt(Math.cos(2.1),Math.sin(2.1)),this.windSpeed=3.2,this.gust=.25,this._gustTimer=4,this._gustActive=0,this.floodVecs=e.map(l=>new pe(l.x,l.y,l.z,15));const n=i==="low"?900:2400,a=new Ko,r=new Be(1,1);a.index=r.index,a.attributes.position=r.attributes.position,a.attributes.uv=r.attributes.uv;const o=new Float32Array(n);for(let l=0;l<n;l++)o[l]=l+.5;a.setAttribute("aSeed",new Ci(o,1)),a.instanceCount=n,this.box=new S(34,20,34),this.mat=new re({transparent:!0,depthWrite:!1,blending:en,uniforms:{uTime:{value:0},uCenter:{value:new S},uWind:{value:new S(2.5,.1,1.2)},uBox:{value:this.box},uMap:{value:Tc(32,1.4)},uOpacity:{value:.5},uPixelRatio:{value:1},uSizeScale:{value:1},uFloods:{value:this.floodVecs}},vertexShader:iv,fragmentShader:nv}),this.points=new U(a,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=8,t.add(this.points)}impulse(t,e){this._impulse={center:t.clone(),strength:e,t:0}}update(t,e){if(this.time+=t,this.windDirAngle+=$n(this.time*.05,3)*.0016,this.windDir.set(Math.cos(this.windDirAngle),Math.sin(this.windDirAngle)),this._gustTimer-=t,this._gustTimer<=0&&this._gustActive===0&&(this._gustActive=1,this._gustDur=2.5+($n(this.time,9)*.5+.5)*4),this._gustActive>0){this._gustActive+=t;const n=this._gustActive/this._gustDur,a=n<.3?xh(n/.3):n>.75?xh((1-n)/.25):1;this.gust=.22+a*.78,this.windSpeed=3.2+a*5.5,n>=1&&(this._gustActive=0,this._gustTimer=7+($n(this.time*.3,11)*.5+.5)*12)}else this.gust+=(.22-this.gust)*t*1.5,this.windSpeed+=(3.2-this.windSpeed)*t;const i=this.mat.uniforms;i.uTime.value=this.time,i.uCenter.value.copy(e),i.uWind.value.set(this.windDir.x*this.windSpeed,.12,this.windDir.y*this.windSpeed),i.uOpacity.value=.42+this.gust*.3}}function xh(s){return s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2}class av{constructor(t,e="high"){this.scene=t,this.sky=new Fg(t);const i=[{x:-22,z:-14},{x:20,z:12},{x:14,z:-24},{x:-12,z:24},{x:30,z:-2}].map(n=>({x:n.x,y:7,z:n.z,range:22}));this.terrain=new Yg(t,this.sky.tint,i),this.props=new Zg(t,this.terrain,this.sky.tint),this.lights=new ev(t,this.terrain),this.weather=new sv(t,this.lights.floods.map(n=>n.spot.position),e),this.terrain.mesh.userData.surface="snow",this.raycaster=new Zo,this.raycaster.far=400,this.time=0}raycast(t,e,i=400){this.raycaster.set(t,e),this.raycaster.far=i;const n=this.raycaster.intersectObjects(this.props.rayTargets,!1),a=n.length?n[0]:null,r=this.terrain.rayIntersect(t,e,a?Math.min(i,a.distance):i);if(r>=0&&(!a||r<a.distance)){const o=t.x+e.x*r,l=t.y+e.y*r,h=t.z+e.z*r;return{distance:r,point:new S(o,l,h),face:{normal:this.terrain.normalAt(o,h)},object:this.terrain.mesh}}return a}hasLOS(t,e){const i=rv.subVectors(e,t),n=i.length();return i.normalize(),this.raycaster.set(t,i),this.raycaster.far=n-.2,this.raycaster.intersectObjects(this.props.rayTargets,!1).length?!1:this.terrain.rayIntersect(t,i,n-.2)<0}update(t,e){this.time+=t,this.sky.update(t),this.weather.update(t,e),this.props.update(t,this.time,this.weather.windDir,this.weather.gust),this.lights.update(t,this.weather.gust),this.terrain.update(t,this.weather.windDir,this.weather.gust);const i=this.sky.tint;this.lights.hemi.color.setRGB(.29+i.g*.35,.39+i.g*.28,.58+i.b*.3)}}const rv=new S,ov=`
  attribute vec3 aPos;
  attribute vec3 aColor;
  attribute vec4 aData; // size, alpha, rot, stretch
  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vUv;
  void main() {
    vColor = aColor;
    vAlpha = aData.y;
    vec4 mv = viewMatrix * vec4(aPos, 1.0);
    float c = cos(aData.z), s = sin(aData.z);
    vec2 q = vec2(position.x * c - position.y * s, position.x * s + position.y * c);
    q.y *= aData.w; // stretch along motion (set by system)
    mv.xy += q * aData.x;
    vUv = position.xy + 0.5;
    gl_Position = projectionMatrix * mv;
  }`,lv=`
  uniform sampler2D uMap;
  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float a = tex.a * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
  }`;let hv=0;class yh{constructor(t,{capacity:e=1024,additive:i=!1,texture:n=null}={}){this.capacity=e,this.additive=i,this.data=new Array(e);for(let h=0;h<e;h++)this.data[h]={active:!1,x:0,y:0,z:0,vx:0,vy:0,vz:0,age:0,life:1,size:.1,sizeVel:0,alpha:1,alphaPow:1,r:1,g:1,b:1,grav:1,drag:0,bounce:0,spin:0,rot:0,stretch:1,windMult:0,collide:!0,groundY:null,onGround:null,id:hv++};this.free=[];for(let h=e-1;h>=0;h--)this.free.push(h);this.activeCount=0,this.wind=new S,this.groundFn=null;const a=new Be(1,1),r=new Ko;r.index=a.index,r.attributes.position=a.attributes.position;const o=e;this.aPos=new Ci(new Float32Array(o*3),3),this.aColor=new Ci(new Float32Array(o*3),3),this.aData=new Ci(new Float32Array(o*4),4),r.setAttribute("aPos",this.aPos),r.setAttribute("aColor",this.aColor),r.setAttribute("aData",this.aData),r.instanceCount=0,this.geo=r;const l=new re({transparent:!0,depthWrite:!1,blending:i?ki:en,uniforms:{uMap:{value:n??Tc(64,i?1.8:2.4)}},vertexShader:ov,fragmentShader:lv});this.mesh=new U(r,l),this.mesh.frustumCulled=!1,this.mesh.renderOrder=i?12:9,t.add(this.mesh)}spawn(t){let e=null;if(this.free.length)e=this.data[this.free.pop()];else{let i=-1,n=-1;for(let a=0;a<this.capacity;a++){const r=this.data[a].age/this.data[a].life;r>n&&(n=r,i=a)}e=this.data[i]}return e?(e.active=!0,e.x=t.x,e.y=t.y,e.z=t.z,e.vx=t.vx??0,e.vy=t.vy??0,e.vz=t.vz??0,e.age=0,e.life=t.life??1,e.size=t.size??.1,e.sizeVel=t.sizeVel??0,e.alpha=t.alpha??1,e.alphaPow=t.alphaPow??1,e.r=t.r??1,e.g=t.g??1,e.b=t.b??1,e.grav=t.grav??1,e.drag=t.drag??0,e.bounce=t.bounce??0,e.spin=t.spin??0,e.rot=t.rot??T.next()*6.28,e.stretch=t.stretch??1,e.windMult=t.windMult??0,e.collide=t.collide??!0,e.onGround=t.onGround??null,this.activeCount++,e):null}update(t){if(t<=0)return;const e=this.aPos.array,i=this.aColor.array,n=this.aData.array;let a=0;const r=this.wind.x,o=this.wind.y,l=this.wind.z;for(let h=0;h<this.capacity;h++){const c=this.data[h];if(!c.active)continue;if(c.age+=t,c.age>=c.life){c.active=!1,this.free.push(h),this.activeCount--;continue}const u=Math.exp(-c.drag*t);if(c.vx*=u,c.vz*=u,c.vy=c.vy*u-9.8*c.grav*t,c.vx+=r*c.windMult*t,c.vy+=o*c.windMult*t,c.vz+=l*c.windMult*t,c.x+=c.vx*t,c.y+=c.vy*t,c.z+=c.vz*t,c.rot+=c.spin*t,c.size=Math.max(.001,c.size+c.sizeVel*t),c.collide&&this.groundFn){const g=this.groundFn(c.x,c.z);if(c.y<g+.01)if(c.bounce>0&&Math.abs(c.vy)>.4)c.y=g+.01,c.vy=-c.vy*c.bounce,c.vx*=.6,c.vz*=.6;else{c.y=g+.005,c.active=!1,this.free.push(h),this.activeCount--,c.onGround&&c.onGround(c);continue}}const d=c.age/c.life,f=Math.pow(1-d,c.alphaPow);e[a*3]=c.x,e[a*3+1]=c.y,e[a*3+2]=c.z,i[a*3]=c.r,i[a*3+1]=c.g,i[a*3+2]=c.b,n[a*4]=c.size,n[a*4+1]=c.alpha*f,n[a*4+2]=c.rot,n[a*4+3]=c.stretch,a++}this.geo.instanceCount=a,this.aPos.needsUpdate=!0,this.aColor.needsUpdate=!0,this.aData.needsUpdate=!0}}class cv{constructor(t){this.layers={hole:this._makeLayer(t,Bg(),96,.16),blood:this._makeLayer(t,Og(),320,1,6622995),scorch:this._makeLayer(t,kg(),24,3.2)},this._growing=[],this._m=new Wt,this._q=new xe,this._e=new ze,this._s=new S,this._p=new S,this._up=new S(0,1,0),this._x=new S(1,0,0)}_makeLayer(t,e,i,n,a=16777215){const r=new Be(1,1),o=new Ei({map:e,color:a,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-8,opacity:1}),l=new oc(r,o,i);return l.instanceMatrix.setUsage(md),l.count=0,l.frustumCulled=!1,l.renderOrder=4,this._hideAll(l,i),t.add(l),{mesh:l,cap:i,baseSize:n,cursor:0,used:0}}_hideAll(t,e){const i=new Wt().makeScale(0,0,0);for(let n=0;n<e;n++)t.setMatrixAt(n,i);t.instanceMatrix.needsUpdate=!0}add(t,e,i,n={}){const a=this.layers[t];if(!a)return;let r;a.used<a.cap?(r=a.used,a.used++):(r=a.cursor%a.cap,a.cursor++);const o=n.size??a.baseSize*T.range(.75,1.3),l=T.next()*Math.PI*2,h=dv.copy(i).normalize(),c=Math.abs(h.y)>.95?fv.set(1,0,0):this._up,u=uv.crossVectors(h,c).normalize(),d=pv.crossVectors(u,h).normalize(),f=mv.makeBasis(d,u,h);return this._q.setFromRotationMatrix(f),this._q.multiply(gv.setFromAxisAngle(vv,l)),Mh.copy(i).normalize().multiplyScalar(.012+T.next()*.008),this._p.copy(e).add(Mh),this._s.setScalar(o),this._m.compose(this._p,this._q,this._s),a.mesh.setMatrixAt(r,this._m),a.mesh.instanceMatrix.needsUpdate=!0,a.mesh.count=a.used,n.grow&&this._growing.push({L:a,idx:r,t:0,dur:n.grow,target:o,m:this._m.clone()}),r}addGrowingPool(t,e,i,n){this.add("blood",t,e,{size:i*.15,grow:n}),this.layers.blood;const a=this._growing[this._growing.length-1];a&&(a.target=i)}clearBlood(){const t=this.layers.blood;this._hideAll(t.mesh,t.cap),t.used=0,t.cursor=0,t.mesh.count=0,this._growing.length=0}clearHoles(){const t=this.layers.hole;this._hideAll(t.mesh,t.cap),t.used=0,t.cursor=0,t.mesh.count=0}update(t){for(let e=this._growing.length-1;e>=0;e--){const i=this._growing[e];i.t+=t;const n=ci(Math.min(1,i.t/i.dur)),a=i.target*(.15+.85*n);i.m.decompose(this._p,this._q,this._s),this._s.setScalar(a),i.m.compose(this._p,this._q,this._s),i.L.mesh.setMatrixAt(i.idx,i.m),i.L.mesh.instanceMatrix.needsUpdate=!0,i.t>=i.dur&&this._growing.splice(e,1)}}}const dv=new S,uv=new S,fv=new S(1,0,0),pv=new S,mv=new Wt,gv=new xe,vv=new S(0,0,1),Mh=new S,wh={r:.74,g:.055,b:.065};class _v{constructor(t,e,i){this.p=t,this.decals=e,this.groundFn=i,this.up=new S(0,1,0)}spray(t,e,{headshot:i=!1,power:n=1}={}){const a=Math.round((i?80:54)*n),r=a>>1;for(let f=0;f<a;f++){const g=f<r,v=i?.72:.6,p=g?-.55:1,m=e.x*p+T.gauss(0,v),b=e.y*p+T.gauss(0,v)+(g?.5:.25),C=e.z*p+T.gauss(0,v),y=T.range(5,14)*(i?1.3:1)*(g?.8:1),A=g?-e.x*.12:e.x*.1;this.p.spawn({x:t.x+A,y:t.y+(g?-e.y*.12:e.y*.1),z:t.z+(g?-e.z*.12:e.z*.1),vx:m*y,vy:b*y,vz:C*y,life:T.range(.5,1.1),size:T.range(.16,.3),sizeVel:-.004,...wh,alpha:.95,alphaPow:.6,grav:1,drag:.35,bounce:0,onGround:M=>this.decals.add("blood",gs.set(M.x,M.y,M.z),vs.set(0,1,0),{size:T.range(.16,.42)*(i?1.6:1)})})}const o=t.x+e.x*.42,l=t.y+e.y*.42,h=t.z+e.z*.42;for(let f=0;f<(i?34:22);f++){const v=T.range(6,13);this.p.spawn({x:o,y:l,z:h,vx:(e.x+T.gauss(0,.65))*v,vy:(e.y+T.gauss(0,.65))*v+.6,vz:(e.z+T.gauss(0,.65))*v,life:T.range(.4,.9),size:T.range(.13,.24),sizeVel:-.004,...wh,alpha:.95,alphaPow:.6,grav:1.35,drag:.6,bounce:0,onGround:p=>this.decals.add("blood",gs.set(p.x,p.y,p.z),vs.set(0,1,0),{size:T.range(.16,.4)})})}for(let f=0;f<(i?14:9);f++)this.p.spawn({x:o,y:l,z:h,vx:e.x*1.6+T.gauss(0,.8),vy:T.gauss(0,.6)+.4,vz:e.z*1.6+T.gauss(0,.8),life:T.range(.5,1),size:T.range(.34,.8),sizeVel:.45,r:.62,g:.035,b:.045,alpha:.7,alphaPow:1.3,grav:.1,drag:2.4,collide:!1,windMult:.5});const c=t.x-e.x*.2,u=t.y-e.y*.2,d=t.z-e.z*.2;for(let f=0;f<(i?16:10);f++)this.p.spawn({x:c+T.gauss(0,.06),y:u+T.gauss(0,.06),z:d+T.gauss(0,.06),vx:e.x*.4+T.gauss(0,1.3),vy:T.gauss(0,.7)+.45,vz:e.z*.4+T.gauss(0,1.3),life:T.range(.45,.8),size:T.range(.28,.68),sizeVel:.35,r:.66,g:.04,b:.05,alpha:.85,alphaPow:1,grav:.1,drag:2.4,collide:!1,windMult:.5});for(let f=0;f<(i?12:8);f++)this.p.spawn({x:c,y:u,z:d,vx:e.x*T.range(1.5,3.2),vy:e.y*T.range(1.5,3.2)+.3,vz:e.z*T.range(1.5,3.2),life:T.range(.12,.2),size:T.range(.11,.18),sizeVel:-.1,stretch:4,r:.8,g:.07,b:.08,alpha:1,alphaPow:.8,grav:.2,drag:1.2,collide:!1})}pool(t){this.decals.addGrowingPool(gs.set(t.x,this.groundFn(t.x,t.z)+.02,t.z),vs.set(0,1,0),T.range(1.5,2.15),3.2),this.decals.add("blood",gs,vs,{size:1.85});const e=T.next()*Math.PI*2;for(let i=0;i<5;i++){const n=.55+T.next()*.8,a=t.x+Math.cos(e+T.gauss(0,.5))*n,r=t.z+Math.sin(e+T.gauss(0,.5))*n;this.decals.add("blood",xv.set(a,this.groundFn(a,r)+.02,r),yv.set(0,1,0),{size:T.range(.3,.7)})}}trail(t){this.decals.add("blood",gs.set(t.x,this.groundFn(t.x,t.z)+.02,t.z),vs.set(0,1,0),{size:T.range(.22,.4)})}clear(){this.decals.clearBlood()}}const gs=new S,vs=new S(0,1,0),xv=new S,yv=new S(0,1,0),Mv=`
  attribute vec3 aPos;
  attribute vec3 aVel;    // normalized direction
  attribute vec4 aData;   // length, width, alpha, heat
  varying vec2 vUv;
  varying float vHeat;
  void main() {
    vUv = uv;
    vHeat = aData.w;
    // cylindrical billboard: stretch x along velocity, offset y along the
    // axis-perpendicular that points at the camera — never seen edge-on
    vec3 axis = aVel;
    vec3 toCam = cameraPosition - aPos;
    vec3 side = cross(axis, normalize(toCam));
    float sl = length(side);
    side = sl > 1e-4 ? side / sl : normalize(cross(axis, vec3(0.0, 0.0, 1.0)));
    vec3 world = aPos + axis * position.x * aData.x + side * position.y * aData.y;
    gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
  }`,wv=`
  varying vec2 vUv;
  varying float vHeat;
  void main() {
    // hot white-blue core, warm falloff (G6)
    float core = smoothstep(0.5, 0.0, abs(vUv.y - 0.5)) * smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
    float glow = (1.0 - abs(vUv.y - 0.5) * 2.0) * (1.0 - abs(vUv.x - 0.5) * 2.0);
    vec3 hot = mix(vec3(1.0, 0.98, 0.9), vec3(1.0, 0.62, 0.18), vHeat);
    vec3 col = hot * core * 2.4 + hot * glow * 0.5;
    float a = clamp(core * 1.4 + glow * 0.4, 0.0, 1.0);
    if (a < 0.01) discard;
    gl_FragColor = vec4(col, a);
  }`;class Sv{constructor(t,e=64){this.capacity=e,this.items=[];for(let r=0;r<e;r++)this.items.push({active:!1,x:0,y:0,z:0,dx:0,dy:0,dz:0,speed:300,traveled:0,dist:50,heat:0});const i=new Be(1,1),n=new Ko;n.index=i.index,n.attributes.position=i.attributes.position,n.attributes.uv=i.attributes.uv,this.aPos=new Ci(new Float32Array(e*3),3),this.aVel=new Ci(new Float32Array(e*3),3),this.aData=new Ci(new Float32Array(e*4),4),n.setAttribute("aPos",this.aPos),n.setAttribute("aVel",this.aVel),n.setAttribute("aData",this.aData),n.instanceCount=0,this.geo=n;const a=new re({transparent:!0,depthWrite:!1,blending:ki,vertexShader:Mv,fragmentShader:wv});this.mesh=new U(n,a),this.mesh.frustumCulled=!1,this.mesh.renderOrder=11,t.add(this.mesh),this.activeCount=0}spawn(t,e,i,n=0){let a=null;for(const o of this.items)if(!o.active){a=o;break}a||(a=this.items[0]),a.active=!0,a.x=t.x,a.y=t.y,a.z=t.z;const r=Math.hypot(e.x,e.y,e.z)||1;a.dx=e.x/r,a.dy=e.y/r,a.dz=e.z/r,a.speed=340,a.traveled=0,a.dist=Math.min(i,120),a.heat=n,this.activeCount++}update(t){const e=this.aPos.array,i=this.aVel.array,n=this.aData.array;let a=0;for(const r of this.items){if(!r.active)continue;const o=r.speed*t;if(r.traveled+=o,r.x+=r.dx*o,r.y+=r.dy*o,r.z+=r.dz*o,r.traveled>=r.dist){r.active=!1,this.activeCount--;continue}const l=Math.min(r.traveled,4.2);e[a*3]=r.x-r.dx*l,e[a*3+1]=r.y-r.dy*l,e[a*3+2]=r.z-r.dz*l,i[a*3]=r.dx,i[a*3+1]=r.dy,i[a*3+2]=r.dz,n[a*4]=l,n[a*4+1]=.055,n[a*4+2]=1,n[a*4+3]=r.heat,a++}this.geo.instanceCount=a,this.aPos.needsUpdate=!0,this.aVel.needsUpdate=!0,this.aData.needsUpdate=!0}}class bv{constructor(t,e,i,n,a=28){this.capacity=a,this.groundFn=e,this.particles=i,this.audio=n;const r=new Ht(.0055,.0058,.028,8),o=new zt({color:13148746,roughness:.32,metalness:.9}),l=new Ht(.0098,.0098,.06,10),h=new zt({color:9316898,roughness:.5,metalness:.08}),c=new Ht(.0102,.0102,.01,10),u=new zt({color:11570504,roughness:.35,metalness:.85});this.items=[];for(let d=0;d<a;d++){const f=new $t,g=new U(r,o),v=new U(l,h),p=new U(c,u);p.position.y=.032,f.add(g,v,p),f.visible=!1,f.castShadow=!1,t.add(f),this.items.push({mesh:f,brass:g,hull:v,base:p,active:!1,shotgun:!1,vel:new S,spin:new S,life:0,onSnow:!1})}this.cursor=0,this.activeCount=0}eject(t,e,i,n){let a=null;for(const o of this.items)if(!o.active){a=o;break}a||(a=this.items[this.cursor%this.capacity],this.cursor++);const r=n==="shotgun";return a.active=!0,a.shotgun=r,a.brass.visible=!r,a.hull.visible=r,a.base.visible=r,a.mesh.visible=!0,a.mesh.position.copy(t),a.mesh.rotation.set(0,0,0),a.life=0,a.onSnow=!1,r?(a.vel.copy(e).multiplyScalar(T.range(1.1,1.7)).addScaledVector(i,T.range(1.2,1.9)).addScaledVector(e.clone().cross(i),T.range(-.4,.4)),a.spin.set(T.range(-16,16),T.range(-16,16),T.range(-10,10))):(a.vel.copy(e).multiplyScalar(T.range(1.6,2.4)).addScaledVector(i,T.range(1.4,2.1)).addScaledVector(e.clone().cross(i),T.range(-.3,.3)),a.spin.set(T.range(-20,20),T.range(-20,20),T.range(-14,14))),this.activeCount++,a}update(t){for(const e of this.items){if(!e.active)continue;e.life+=t,e.vel.y-=9.8*t,e.mesh.position.addScaledVector(e.vel,t),e.mesh.rotation.x+=e.spin.x*t,e.mesh.rotation.y+=e.spin.y*t,e.mesh.rotation.z+=e.spin.z*t;const i=this.groundFn(e.mesh.position.x,e.mesh.position.z)+(e.shotgun?.01:.006);e.mesh.position.y<i&&(e.mesh.position.y=i,!e.onSnow&&Math.abs(e.vel.y)>1.2&&(this.particles.spawn({x:e.mesh.position.x,y:i+.02,z:e.mesh.position.z,vx:.05,vy:.16,vz:.05,life:e.shotgun?1.1:.8,size:e.shotgun?.07:.05,sizeVel:.06,r:.8,g:.85,b:.92,alpha:.24,alphaPow:1.6,grav:-.12,collide:!1}),this.audio.shellSnow()),e.onSnow=!0,e.vel.y=Math.abs(e.vel.y)>.8?-e.vel.y*.28:0,e.vel.x*=.55,e.vel.z*=.55,e.spin.multiplyScalar(.5),e.mesh.rotation.x=Math.PI/2*.9,e.mesh.position.y=i-.002),e.life>7&&(e.active=!1,e.mesh.visible=!1,this.activeCount--)}}}const Tv=`
  precision mediump float;
  uniform float uProgress;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float edge = 1.0 - uProgress;
    float band = smoothstep(edge - 0.28, edge, r) * (1.0 - smoothstep(edge, edge + 0.05, r));
    float a = band * (1.0 - uProgress) * 0.4;
    vec3 col = mix(vec3(0.72, 0.56, 0.34), vec3(0.62, 0.66, 0.78), uProgress * 0.8);
    if (a < 0.01) discard;
    gl_FragColor = vec4(col, a);
  }`,Ec=`
  float h3(vec3 p) { return fract(sin(dot(floor(p), vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float vn(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(h3(i), h3(i + vec3(1, 0, 0)), f.x), mix(h3(i + vec3(0, 1, 0)), h3(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(h3(i + vec3(0, 0, 1)), h3(i + vec3(1, 0, 1)), f.x), mix(h3(i + vec3(0, 1, 1)), h3(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) { return vn(p) * 0.55 + vn(p * 2.3) * 0.28 + vn(p * 5.1) * 0.17; }`,Ev=`
  uniform float uProgress;
  varying vec3 vLocal;
  varying vec3 vNv;
  ${Ec}
  void main() {
    // lumpy radial displacement — the ball must not read as a sphere
    float d = fbm(position * 2.2 + vec3(0.0, -uProgress * 2.6, uProgress * 0.5));
    vec3 p = position * (1.0 + (d - 0.5) * 0.55);
    vLocal = p;
    vNv = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`,Av=`
  precision highp float;
  uniform float uProgress;
  varying vec3 vLocal;
  varying vec3 vNv;
  ${Ec}
  void main() {
    // rolling vortices: two noise fields, one domain-warping the other,
    // scrolling up through the sphere as the blast ages
    vec3 p = vLocal * 4.5 + vec3(0.0, -uProgress * 4.0, uProgress * 0.8);
    float warp = fbm(p * 1.7 + 3.1);
    float churn = fbm(p + warp * 1.4) * 0.72 + warp * 0.28;
    float fres = pow(1.0 - abs(vNv.z), 1.3);       // rim of the sphere (wide band)
    float t = clamp(churn * 1.2 + fres * 0.5 - uProgress * 0.8, 0.0, 1.0);
    // ramp: saturated orange core → deep orange → soot. Kept UNDER the bloom
    // threshold — anything above ~1.0 luminance blooms into a white flashbulb
    vec3 core = vec3(1.02, 0.4, 0.11);
    vec3 mid  = vec3(0.8, 0.24, 0.05);
    vec3 soot = vec3(0.12, 0.06, 0.05);
    vec3 col = mix(core, mid, smoothstep(0.22, 0.58, t));
    col = mix(col, soot, smoothstep(0.55, 0.82, t));
    // sparse white-hot tongues — tiny HDR glints bloom as glitter, not wash
    float tongue = pow(max(churn - 0.62, 0.0) / 0.38, 3.0) * (1.0 - uProgress * 0.8);
    col += vec3(0.6, 0.42, 0.22) * tongue;
    // alpha erosion: sooty regions burn away as the ball cools, and the rim
    // is fully feathered so the silhouette never reads as a hard sphere
    float burn = smoothstep(0.48, 0.78, t + uProgress * 0.45);
    float a = (1.0 - burn) * max(0.0, 1.0 - fres * 1.02);
    gl_FragColor = vec4(col, a);
  }`;class Rv{constructor(t,e,i,n,a,r,o,l,h){this.scene=t,this.pAdd=e,this.pAlpha=i,this.decals=n,this.lights=a,this.weather=r,this.audio=o,this.cameraRig=l,this.grade=h,this.active=[],this.up=new S(0,1,0),this.fireballs=[];for(let c=0;c<3;c++){const u=new U(new Pe(1,24,18),new re({transparent:!0,depthWrite:!1,uniforms:{uProgress:{value:0}},vertexShader:Ev,fragmentShader:Av}));u.visible=!1,t.add(u),this.fireballs.push(u)}this.rings=[];for(let c=0;c<3;c++){const u=new U(new Be(2,2),new re({transparent:!0,depthWrite:!1,blending:ki,side:Qe,uniforms:{uProgress:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:Tv}));u.rotation.x=-Math.PI/2,u.visible=!1,t.add(u),this.rings.push(u)}}explode(t,e={}){const i={t:0,pos:t.clone(),fireball:this.fireballs.find(r=>!r.visible)??this.fireballs[0],ring:this.rings.find(r=>!r.visible)??this.rings[0],peak:3.2+T.range(0,.8)};i.fireball.visible=!0,i.fireball.position.copy(t),i.ring.visible=!0,i.ring.position.set(t.x,t.y+.15,t.z),this.active.push(i),this.grade.uniforms.uFlash.value=.12,this.lights.flashLight(t.clone().setY(t.y+4),16757623,22,.6);const n=this.cameraRig.camera.position.distanceTo(t);this.cameraRig.addShake(ye.clamp(1.4-n/40,.3,1)),this.audio.explosion(n),this.weather.impulse(t,1);for(let r=0;r<42;r++){const o=T.next()*Math.PI*2,l=T.range(.1,1.2),h=T.range(6,17);this.pAdd.spawn({x:t.x,y:t.y+.5,z:t.z,vx:Math.cos(o)*h*Math.cos(l),vy:Math.sin(l)*h+3,vz:Math.sin(o)*h*Math.cos(l),life:T.range(.5,1.3),size:T.range(.03,.09),sizeVel:-.01,r:1,g:T.range(.5,.75),b:.2,alpha:1,alphaPow:.8,grav:1.1,drag:.35,bounce:.35,stretch:2.5})}for(let r=0;r<24;r++){const o=T.next()*Math.PI*2,l=T.range(3,9),h=T.next()<.35;this.pAlpha.spawn({x:t.x,y:t.y+.4,z:t.z,vx:Math.cos(o)*l,vy:T.range(1.5,4.5),vz:Math.sin(o)*l,life:T.range(1.6,3.2),size:T.range(.35,.75),sizeVel:.55,r:h?.09:.2,g:h?.09:.21,b:h?.1:.25,alpha:.85,alphaPow:.45,grav:.06,drag:1.4,collide:!1,windMult:.8})}const a=e.groundY??t.y;for(let r=0;r<30;r++){const o=r/30*Math.PI*2+T.next()*.2;this.pAlpha.spawn({x:t.x+Math.cos(o)*.6,y:a+.1,z:t.z+Math.sin(o)*.6,vx:Math.cos(o)*9,vy:T.range(.4,1.6),vz:Math.sin(o)*9,life:T.range(.7,1.4),size:T.range(.25,.55),sizeVel:.4,r:.82,g:.87,b:.95,alpha:.34,alphaPow:1.2,grav:.25,drag:2.2,collide:!1})}this.decals.add("scorch",t.clone().setY(a+.03),this.up,{size:T.range(3.4,4.2)}),this.decals.add("scorch",t.clone().setY(a+.045),this.up,{size:1.6}),e.onImpulse&&e.onImpulse(t,9.5)}update(t){this.grade.uniforms.uFlash.value=Math.max(0,this.grade.uniforms.uFlash.value-t*7);for(let e=this.active.length-1;e>=0;e--){const i=this.active[e];i.t+=t;const n=i.t/.75;if(n>=1){i.fireball.visible=!1,i.ring.visible=!1,this.active.splice(e,1);continue}const a=1-Math.pow(1-Math.min(1,n*1.6),3),r=i.peak*a;i.fireball.scale.setScalar(Math.max(.01,r)),i.fireball.position.y=i.pos.y+.4+n*1.6,i.fireball.material.uniforms.uProgress.value=n,i.fireball.material.opacity=Math.max(0,.95-n*1.1),i.ring.scale.setScalar(Math.max(.01,2+n*13)),i.ring.material.uniforms.uProgress.value=n}}}class Cv{constructor(){this.ctx=null,this.ready=!1,this._lastShot=0,this._voiceCount=0,this.maxVoices=34}init(){if(this.ready)return;this.ctx=new(window.AudioContext||window.webkitAudioContext);const t=this.ctx;this.master=t.createGain(),this.master.gain.value=.85;const e=t.createWaveShaper(),i=1024,n=new Float32Array(i);for(let l=0;l<i;l++){const h=l/(i-1)*2-1;n[l]=Math.tanh(h*1.8)/Math.tanh(1.8)}e.curve=n,e.oversample="2x";const a=t.createDynamicsCompressor();a.threshold.value=-14,a.knee.value=22,a.ratio.value=5,a.attack.value=.004,a.release.value=.24,this.master.connect(e),e.connect(a),a.connect(t.destination),this.outNode=a,this.sfxBus=t.createGain(),this.sfxBus.gain.value=1,this.musicBus=t.createGain(),this.musicBus.gain.value=.7,this.sfxBus.connect(this.master),this.musicBus.connect(this.master);const r=t.sampleRate*2;this.noiseBuf=t.createBuffer(1,r,t.sampleRate);const o=this.noiseBuf.getChannelData(0);for(let l=0;l<r;l++)o[l]=Math.random()*2-1;this.ready=!0,this._startAmbient()}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}suspend(){this.ctx&&this.ctx.state==="running"&&this.ctx.suspend()}_track(t,e){return this._voiceCount++,t.onended=()=>{this._voiceCount--;try{t.disconnect()}catch{}},t}get busy(){return this._voiceCount>this.maxVoices}_osc(t,e,i,n,a,{bendTo:r=null,bus:o=null,attack:l=.002,detune:h=0}={}){const c=this.ctx,u=c.createOscillator();u.type=t,u.frequency.setValueAtTime(e,i),r&&u.frequency.exponentialRampToValueAtTime(Math.max(1,r),i+n),h&&(u.detune.value=h);const d=c.createGain();return d.gain.setValueAtTime(0,i),d.gain.linearRampToValueAtTime(a,i+l),d.gain.exponentialRampToValueAtTime(1e-4,i+n),u.connect(d).connect(o??this.sfxBus),u.start(i),u.stop(i+n+.02),this._track(u)}_noise(t,e,i,{type:n="lowpass",freq:a=2e3,q:r=.8,bendTo:o=null,bus:l=null,attack:h=.001}={}){const c=this.ctx,u=c.createBufferSource();u.buffer=this.noiseBuf,u.loop=!0;const d=c.createBiquadFilter();d.type=n,d.frequency.setValueAtTime(a,t),o&&d.frequency.exponentialRampToValueAtTime(Math.max(20,o),t+e),d.Q.value=r;const f=c.createGain();return f.gain.setValueAtTime(0,t),f.gain.linearRampToValueAtTime(i,t+h),f.gain.exponentialRampToValueAtTime(1e-4,t+e),u.connect(d).connect(f).connect(l??this.sfxBus),u.start(t,Math.random()*1.5),u.stop(t+e+.02),this._track(u)}shot(t,e){if(!this.ready||this.busy)return;const n=this.ctx.currentTime+5e-4,a=e?1.14:1;this._noise(n,.035,.85*Math.min(1,.7+t*.5),{type:"highpass",freq:3e3*a,q:.5}),this._osc("sine",130*a,n,.11,.9,{bendTo:42,attack:.001}),this._osc("triangle",220*a,n,.05,.4,{bendTo:60}),this._noise(n+.012,.24,.3,{type:"lowpass",freq:1400,bendTo:300}),t>.3&&this._noise(n,.06,t*.2,{type:"bandpass",freq:4500,q:2}),this._lastShot=performance.now(),this.duckMusic()}enemyShot(t){if(!this.ready||this.busy)return;const i=this.ctx.currentTime,n=Math.max(.06,1-t/70);this._noise(i,.05,.4*n,{type:"highpass",freq:1800}),this._osc("sine",95,i,.13,.6*n,{bendTo:36}),this._noise(i+.01,.3,.22*n,{type:"lowpass",freq:900,bendTo:200})}sonicCrack(){if(!this.ready||this.busy)return;const t=this.ctx.currentTime;this._noise(t,.045,.5,{type:"bandpass",freq:3400,q:1.4}),this._noise(t+.012,.07,.2,{type:"bandpass",freq:1600,q:2,bendTo:900})}shotgunShot(t,e){if(!this.ready||this.busy)return;const n=this.ctx.currentTime+5e-4,a=e?1.1:1;this._noise(n,.06,.95,{type:"bandpass",freq:1600*a,q:.5,bendTo:500}),this._osc("sine",55*a,n,.52,1,{bendTo:20,attack:.001}),this._osc("triangle",140*a,n,.16,.55,{bendTo:44}),this._osc("sine",90*a,n+.012,.3,.4,{bendTo:30}),this._noise(n+.02,.85,.42,{type:"lowpass",freq:900,bendTo:110}),this._noise(n+.03,1.6,.16,{type:"lowpass",freq:420,bendTo:80}),t>.3&&this._noise(n,.07,t*.22,{type:"bandpass",freq:3600,q:2}),this.duckMusic()}pumpBack(){if(!this.ready)return;const t=this.ctx.currentTime;this._noise(t,.07,.34,{type:"bandpass",freq:2100,q:1.1,bendTo:900}),this._osc("square",800,t+.012,.035,.12,{bendTo:380}),this._noise(t,.05,.14,{type:"lowpass",freq:700,bendTo:200})}pumpForward(){if(!this.ready)return;const t=this.ctx.currentTime;this._noise(t,.05,.3,{type:"bandpass",freq:1700,q:1})}pumpClose(){if(!this.ready)return;const t=this.ctx.currentTime;this._osc("sine",240,t,.07,.5,{bendTo:88}),this._osc("square",1900,t+.006,.022,.12,{bendTo:700}),this._noise(t,.045,.36,{type:"bandpass",freq:2600,q:1.2,bendTo:1400}),this._osc("sine",130,t+.03,.09,.3,{bendTo:60})}shellPick(){if(!this.ready)return;const t=this.ctx.currentTime;this._noise(t,.05,.1,{type:"lowpass",freq:1300,bendTo:500}),this._osc("square",1500,t+.02,.015,.04,{bendTo:900})}shellInsert(t){if(!this.ready)return;const e=this.ctx.currentTime;this._osc("sine",t?210:180,e,.06,.4,{bendTo:64}),this._noise(e,.03,.2,{type:"bandpass",freq:t?3200:2600,q:1.2})}dryFire(){if(!this.ready)return;const t=this.ctx.currentTime;this._osc("square",1800,t,.02,.12,{bendTo:700}),this._noise(t,.02,.1,{type:"highpass",freq:4e3})}reloadStart(t){this.reloadClick(t)}reloadClick(t){if(!this.ready)return;const e=this.ctx.currentTime;this._osc("square",t?2400:1900,e,.03,.16,{bendTo:900}),this._noise(e,.025,.12,{type:"highpass",freq:3200})}magOut(t){if(!this.ready)return;const e=this.ctx.currentTime;this._osc("sine",t?480:380,e,.07,.2,{bendTo:160}),this._noise(e,.05,.1,{type:"bandpass",freq:1800,q:1})}magIn(t){if(!this.ready)return;const e=this.ctx.currentTime;this._osc("sine",150,e,.09,.55,{bendTo:55}),this._noise(e,.035,.3,{type:"lowpass",freq:2200,bendTo:500}),this._osc("square",t?2e3:1500,e+.012,.02,.08,{bendTo:800})}rackBack(t){if(!this.ready)return;const e=this.ctx.currentTime;this._noise(e,.05,.28,{type:"bandpass",freq:t?3200:2500,q:1.2,bendTo:1200}),this._osc("square",t?1300:1e3,e+.01,.03,.1,{bendTo:500})}rackForward(t){if(!this.ready)return;const e=this.ctx.currentTime;this._noise(e,.04,.34,{type:"bandpass",freq:2e3,q:1}),this._osc("sine",210,e,.06,.3,{bendTo:90}),this._osc("square",1600,e+.008,.02,.1,{bendTo:700})}reloadAbort(){if(!this.ready)return;const t=this.ctx.currentTime;this._noise(t,.06,.15,{type:"bandpass",freq:1400,q:1})}shellTinkle(){if(!this.ready)return;const t=this.ctx.currentTime,e=3800+Math.random()*2200;this._osc("sine",e,t,.05,.05),this._osc("sine",e*1.51,t+.01,.04,.03)}shellSnow(){if(!this.ready)return;const t=this.ctx.currentTime;this._noise(t,.09,.07,{type:"lowpass",freq:2600,bendTo:900}),this._noise(t+.05,.4,.03,{type:"highpass",freq:5e3})}hitTick(){if(!this.ready)return;const t=this.ctx.currentTime;this._osc("square",2300,t,.028,.14,{bendTo:2e3})}killThock(){if(!this.ready)return;const t=this.ctx.currentTime;this._osc("sine",190,t,.1,.5,{bendTo:70}),this._osc("square",1200,t,.03,.12,{bendTo:700})}headshotCrack(){if(!this.ready)return;const t=this.ctx.currentTime;this._noise(t,.06,.5,{type:"lowpass",freq:3200,bendTo:500}),this._osc("sine",120,t,.14,.6,{bendTo:44})}multikillSting(t){if(!this.ready)return;const e=this.ctx.currentTime,i=220*Math.pow(1.26,t);for(let n=0;n<3;n++)this._osc("square",i*Math.pow(1.5,n),e+n*.055,.16,.11,{bus:this.musicBus}),this._osc("sawtooth",i*Math.pow(1.5,n)*.5,e+n*.055,.2,.07,{bus:this.musicBus})}overdriveRiser(){if(!this.ready)return;const t=this.ctx.currentTime;this._noise(t,.7,.3,{type:"bandpass",freq:400,bendTo:5200,q:1.6,bus:this.musicBus}),this._osc("sawtooth",90,t,.7,.16,{bendTo:340,bus:this.musicBus})}waveSting(){if(!this.ready)return;const t=this.ctx.currentTime;this._osc("sawtooth",55,t,.9,.3,{bus:this.musicBus}),this._osc("sawtooth",55.4,t,.9,.22,{bus:this.musicBus}),this._noise(t,.5,.14,{type:"lowpass",freq:800,bus:this.musicBus})}explosion(t){if(!this.ready)return;const i=this.ctx.currentTime,n=Math.max(.15,1-t/90);this._noise(i,.4,1*n,{type:"lowpass",freq:3200,bendTo:120}),this._osc("sine",70,i,.9,1*n,{bendTo:24}),this._noise(i+.06,1.4,.4*n,{type:"lowpass",freq:700,bendTo:90}),this._osc("triangle",160,i+.02,.3,.3*n,{bendTo:40});for(let a=0;a<5;a++)this._noise(i+.25+a*.09+Math.random()*.05,.05,.06*n,{type:"bandpass",freq:900+Math.random()*900,q:2})}footstep(t,e){if(!this.ready||this.busy)return;const i=this.ctx.currentTime,n=(e?.045:.1)*Math.min(1,t/6);this._noise(i,.07,n,{type:"lowpass",freq:900+Math.random()*500,bendTo:300}),this._noise(i,.03,n*.6,{type:"highpass",freq:2400})}slideLoop(t){if(this.ready){if(t){if(this._slideNode)return;const e=this.ctx,i=e.createBufferSource();i.buffer=this.noiseBuf,i.loop=!0;const n=e.createBiquadFilter();n.type="bandpass",n.frequency.value=2400,n.Q.value=.7;const a=e.createGain();a.gain.setValueAtTime(0,e.currentTime),a.gain.linearRampToValueAtTime(.16,e.currentTime+.12),i.connect(n).connect(a).connect(this.sfxBus),i.start(),this._slideNode={src:i,g:a}}else if(this._slideNode){const{src:e,g:i}=this._slideNode;i.gain.linearRampToValueAtTime(0,this.ctx.currentTime+.18),e.stop(this.ctx.currentTime+.25),this._slideNode=null}}}jump(){this.ready&&this._noise(this.ctx.currentTime,.09,.08,{type:"lowpass",freq:700})}land(t){if(!this.ready)return;const e=this.ctx.currentTime;this._noise(e,.1,.2*t,{type:"lowpass",freq:500,bendTo:160}),this._osc("sine",90,e,.09,.2*t,{bendTo:40})}mantle(){if(!this.ready)return;const t=this.ctx.currentTime;this._noise(t,.08,.14,{type:"bandpass",freq:900,q:1}),this._noise(t+.12,.07,.1,{type:"bandpass",freq:1400,q:1})}hurt(){if(!this.ready)return;const t=this.ctx.currentTime;this._osc("sine",110,t,.16,.5,{bendTo:50}),this._noise(t,.1,.2,{type:"lowpass",freq:600})}heartbeat(){if(!this.ready)return;const t=this.ctx.currentTime;this._osc("sine",58,t,.12,.5,{bendTo:40}),this._osc("sine",52,t+.19,.1,.34,{bendTo:38})}nearMiss(){this.sonicCrack()}glassBreak(){if(!this.ready||this.busy)return;const t=this.ctx.currentTime;this._noise(t,.18,.42,{type:"highpass",freq:3400,bendTo:1600}),this._osc("square",2600,t,.03,.1,{bendTo:1400});for(let e=0;e<6;e++){const i=2400+Math.random()*3200;this._osc("sine",i,t+.05+Math.random()*.3,.05,.05,{bendTo:i*.6})}}uiClick(){if(!this.ready)return;const t=this.ctx.currentTime;this._osc("square",900,t,.035,.08,{bendTo:1300})}_startAmbient(){const t=this.ctx,e=t.createBufferSource();e.buffer=this.noiseBuf,e.loop=!0;const i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=420,i.Q.value=.4,this.windGain=t.createGain(),this.windGain.gain.value=.05;const n=t.createBiquadFilter();n.type="highpass",n.frequency.value=90,e.connect(i).connect(n).connect(this.windGain).connect(this.master),e.start();const a=t.createOscillator();a.frequency.value=.13;const r=t.createGain();r.gain.value=190,a.connect(r).connect(i.frequency),a.start(),this.windFilter=i;const o=t.createOscillator();o.type="sawtooth",o.frequency.value=118;const l=t.createBiquadFilter();l.type="lowpass",l.frequency.value=300;const h=t.createGain();h.gain.value=.012,o.connect(l).connect(h).connect(this.master),o.start()}setWind(t,e){if(!this.ready)return;const i=.035+t*.1+e*.004;this.windGain.gain.setTargetAtTime(i,this.ctx.currentTime,.4),this.windFilter.frequency.setTargetAtTime(340+t*480,this.ctx.currentTime,.5)}duckMusic(){!this.ready||this._musicDuckT}}class Pv{constructor(t){this.engine=t,this.intensity=0,this.targetIntensity=0,this.bpm=124,this.step=0,this.nextTime=0,this._lastGun=0,this.running=!1,this.overdriveLayer=!1,this.notes=[55,58.27,61.74,65.41,69.3,73.42,82.41],this.chordIdx=0}start(){!this.engine.ready||this.running||(this.running=!0,this.nextTime=this.engine.ctx.currentTime+.1)}stop(){this.running=!1}gunFired(){this._lastGun=performance.now()}update(){if(!this.running||!this.engine.ready)return;const t=this.engine.ctx;this.intensity+=(this.targetIntensity-this.intensity)*.02;const e=60/this.bpm/4;for(;this.nextTime<t.currentTime+.18;)this._schedule(this.nextTime,this.step),this.nextTime+=e,this.step++}_schedule(t,e){const i=this.engine,n=this.intensity,a=Math.floor(e/16),r=e%16,o=i.musicBus,h=(performance.now()-this._lastGun)/1e3<.35?.55:1,c=d=>d*h;if(r===0&&a%2===0){const d=this.notes[this.chordIdx%this.notes.length];this.chordIdx++;for(const[f,g]of[[1,0],[1.5,4],[2.4,-6]])i._osc("sawtooth",d*f,t,3.4,c(.028+n*.02),{bus:o,attack:.8,detune:g})}if((n>.66?[0,4,8,12]:n>.33?[0,8]:n>.15?[0]:[]).includes(r)&&i._osc("sine",120,t,.24,c(.5*(.4+n*.6)),{bendTo:38,bus:o}),n>.25&&r%2===1&&i._noise(t,.03,c(.05+n*.05),{type:"highpass",freq:8200,bus:o}),n>.7&&r%4===2&&i._noise(t,.05,c(.08),{type:"highpass",freq:6200,bus:o}),n>.4&&r%4===0){const d=this.notes[this.chordIdx%this.notes.length]*2;i._osc("sawtooth",d,t,.16,c(.22),{bus:o,bendTo:d*.99}),i._noise(t,.02,c(.04),{type:"lowpass",freq:300,bus:o})}if((n>.8||this.overdriveLayer)&&r%2===0){const d=this.notes[(this.chordIdx+r/2%3)%this.notes.length]*4;i._osc("square",d,t,.09,c(this.overdriveLayer?.085:.05),{bus:o})}}}const Qi={walk:4.7,sprint:6.9,tac:8.8,crouch:2.4,slide:9.2},pi=.36,yr=1.78,Sh=1.12,Lv=21,Dv=5.9;class Iv{constructor(t,e,i){this.world=t,this.input=e,this.events=i,this.pos=new S(0,t.terrain.heightAt(0,0),0),this.vel=new S,this.grounded=!0,this.crouch=0,this.crouching=!1,this.sprinting=!1,this.tacSprint=!1,this.sliding=!1,this.slideT=0,this.lean=0,this.leanT=0,this.mantle=null,this.airTime=0,this.fallSpeed=0,this.landImpact=0,this.lastGroundSpeed=0,this.wantJump=!1,this.enabled=!0,this.yaw=0,this.height=yr,this._stepAccum=0,this._coyote=0}get eyeHeight(){return ye.lerp(yr,Sh,this.crouch)-.12}update(t){if(!this.enabled){this._applyGravity(t);return}const e=this.input,i=(e.key("KeyW")?1:0)-(e.key("KeyS")?1:0),n=(e.key("KeyD")?1:0)-(e.key("KeyA")?1:0),a=this.yaw,r=Uv.set(Math.sin(a)*-i+Math.cos(a)*n,0,Math.cos(a)*-i-Math.sin(a)*n);r.lengthSq()>1&&r.normalize();const o=e.key("ShiftLeft")||e.key("ShiftRight");e.consumeDoubleTap("ShiftLeft")&&(this.tacSprint=!0);const l=r.lengthSq()>.01,h=e.key("ControlLeft")&&!this.sliding;if(this.crouching=h,e.key("ControlLeft")&&!this.sliding&&this.grounded&&this.lastGroundSpeed>5.4&&!h&&this.startSlide(),o||(this.tacSprint=!1),this.sprinting=o&&l&&!this.crouching&&!this.sliding&&this.grounded,(!l||this.crouching)&&(this.tacSprint=!1),this.sliding&&(this.slideT+=t,(this.slideT>.95||this.vel.length()<2.6||!this.grounded&&this.airTime>.4)&&(this.sliding=!1)),this.wantJump&&this.grounded&&!this.sliding){const v=this._findMantle();v&&(this._startMantle(v),this.wantJump=!1)}this.mantle?this._updateMantle(t):(this.wantJump&&(this.grounded||this._coyote>0)&&(this.vel.y=Dv,this.grounded=!1,this._coyote=0,this.events.jump&&this.events.jump()),this._applyGravity(t)),this.wantJump=!1;let c;this.sliding?c=0:this.crouching?c=Qi.crouch:this.tacSprint&&l?c=Qi.tac:this.sprinting?c=Qi.sprint:l?c=Qi.walk*(this.grounded?1:.95):c=0;const u=this.grounded?this.sliding?0:42:7.5;if(!this.sliding){Mr.copy(r).multiplyScalar(c);const v=bh.subVectors(Mr,this.vel).setY(0),p=u*t;v.length()>p&&v.setLength(p),!this.grounded&&v.dot(this.vel)<0&&this.vel.length()>c||(this.vel.x+=v.x,this.vel.z+=v.z)}if(this.grounded){const v=this.sliding?3.1:l&&!this.crouching?2.5:11,p=Math.exp(-v*t);!this.sliding&&(!l||this.crouching)&&(this.vel.x*=p,this.vel.z*=p),this.sliding&&(this.vel.x*=p,this.vel.z*=p)}const d=Math.hypot(this.vel.x,this.vel.z),f=this.sliding?Qi.slide+1:(this.tacSprint?Qi.tac:Qi.sprint)+.4;if(d>f&&!this.sliding){const v=f/d;this.vel.x*=v,this.vel.z*=v}this._moveWithCollisions(t);const g=(e.key("KeyE")?1:0)-(e.key("KeyQ")?1:0);if(this.lean=g,this.leanT=Ae(this.leanT,g,11,t),this.crouch=Ae(this.crouch,this.crouching?1:0,12,t),this.height=ye.lerp(yr,Sh,this.crouch),this.grounded&&d>1.2){this._stepAccum+=d*t;const v=this.sprinting||this.tacSprint?2.3:this.crouching?1.7:1.9;this._stepAccum>v&&(this._stepAccum=0,this.events.footstep&&this.events.footstep(d,this.crouching))}this.lastGroundSpeed=this.grounded?d:this.lastGroundSpeed,this.grounded?this._coyote=.12:this._coyote-=t}startSlide(){this.sliding=!0,this.slideT=0;const t=Math.hypot(this.vel.x,this.vel.z);if(t>.5){const i=Math.min(Qi.slide,t*1.18)/t;this.vel.x*=i,this.vel.z*=i}this.events.slideStart&&this.events.slideStart()}_applyGravity(t){this.vel.y-=Lv*t,this.vel.y<-30&&(this.vel.y=-30)}_supportHeight(){let t=this.world.terrain.heightAt(this.pos.x,this.pos.z);for(const e of this.world.props.colliders){const i=e.aabb;this.pos.x+pi>i.min.x&&this.pos.x-pi<i.max.x&&this.pos.z+pi>i.min.z&&this.pos.z-pi<i.max.z&&i.max.y<=this.pos.y-this.vel.y*.05+.55&&i.max.y>t&&(t=i.max.y)}return t}_moveWithCollisions(t){const e=this.world.props.colliders;for(const r of["x","z"]){const o=this.vel[r]*t;if(o===0)continue;this.pos[r]+=o;const l=this.pos.y+.25,h=this.pos.y+this.height-.15;for(const c of e){const u=c.aabb;u.max.y<l+.05||u.min.y>h||this._circleOverlapsBox(u)&&(r==="x"?this.pos.x=o>0?u.min.x-pi-.001:u.max.x+pi+.001:this.pos.z=o>0?u.min.z-pi-.001:u.max.z+pi+.001)}}this.pos.y+=this.vel.y*t;const i=this._supportHeight();if(this.pos.y<=i+.001&&this.vel.y<=0){const r=!this.grounded;this.pos.y=i,this.fallSpeed=-this.vel.y,r&&this.fallSpeed>3.2&&(this.landImpact=kt(this.fallSpeed/12,.25,1.4),this.events.land&&this.events.land(this.landImpact)),this.vel.y=0,this.grounded=!0,this.airTime=0}else this.grounded=!1,this.airTime+=t,this.fallSpeed=-this.vel.y;const n=33.5,a=Math.hypot(this.pos.x,this.pos.z);if(a>n){const r=n/a;this.pos.x*=r,this.pos.z*=r}}_circleOverlapsBox(t){const e=kt(this.pos.x,t.min.x,t.max.x),i=kt(this.pos.z,t.min.z,t.max.z),n=this.pos.x-e,a=this.pos.z-i;return n*n+a*a<pi*pi}_findMantle(){const t=this.yaw,e=Mr.set(-Math.sin(t),0,-Math.cos(t)),i=bh.copy(this.pos);i.y+=1.05;const n=this.world.raycast(i,e,1.15);if(!n)return null;const a=n.object.userData.collider?.aabb;let r=null;if(a?r=a.max.y:n.object===this.world.terrain.mesh&&(r=n.point.y),r===null)return null;const o=r-this.pos.y;if(o>-.1&&o<1.35){const l=Fv.copy(n.point).addScaledVector(e,pi+.42);return l.y=r+.02,l}return null}_startMantle(t){this.mantle={from:this.pos.clone(),to:t.clone(),t:0,dur:.38},this.vel.set(0,0,0),this.events.mantle&&this.events.mantle()}_updateMantle(t){const e=this.mantle;if(e.t+=t/e.dur,e.t>=1){this.pos.copy(e.to),this.mantle=null,this.grounded=!0;return}const i=_n(Math.min(1,e.t*1.15));this.pos.lerpVectors(e.from,e.to,i),this.pos.y+=Math.sin(Math.min(1,e.t)*Math.PI)*.55}}const Uv=new S,Mr=new S,bh=new S,Fv=new S;class Nv{constructor(t,e,i){this.camera=t,this.input=e,this.player=i,this.yaw=.5,this.pitch=0,this.sensitivity=.0021,this.adsSensScale=.62,this.recoilPitch=new pn(0,220,21),this.recoilYaw=new pn(0,220,21),this.trauma=0,this._shakeTime=0,this.fovKick=new pn(0,90,13),this.baseFov=75,this.leanRoll=0,this.slideCant=0,this.landingDip=0,this.landingDipVel=0,this.bobPhase=0,this.angularVel=new gt,this._lastYaw=0,this._lastPitch=0,this.eye=new S,this.killcam=null,this.reloadRoll=0}addShake(t){this.trauma=kt(this.trauma+t,0,1)}update(t,e,i){const n=this.input,a=this.sensitivity*(1+(this.adsSensScale-1)*e);n&&n.locked&&!this.killcam&&(this.yaw-=n.mouse.dx*a,this.pitch-=n.mouse.dy*a,this.pitch=kt(this.pitch,-1.45,1.45)),this.player.yaw=this.yaw,this.recoilPitch.update(i),this.recoilYaw.update(i),this.fovKick.update(t),this.trauma=Math.max(0,this.trauma-t*1.6),this._shakeTime+=t;const r=-this.landingDip*130-this.landingDipVel*13;this.landingDipVel+=r*t,this.landingDip+=this.landingDipVel*t;const o=this.player;this.leanRoll=Ae(this.leanRoll,o.leanT,12,t),this.slideCant=Ae(this.slideCant,o.sliding?1:0,10,t);const l=Math.hypot(o.vel.x,o.vel.z);o.grounded&&l>.5&&!o.sliding&&(this.bobPhase+=t*(6+l*.85));const h=kt(l/7,0,1)*(o.crouching?.012:.026),c=Math.sin(this.bobPhase*2)*h*(1-e*.8),u=Math.cos(this.bobPhase)*h*.7*(1-e*.8),d=this._shakeTime,f=this.trauma*this.trauma,g=$n(d*22,1)*.028*f,v=$n(d*19.4,7)*.028*f,p=$n(d*26,13)*.022*f,m=o.eyeHeight+this.landingDip+c;this.eye.set(o.pos.x,o.pos.y+m,o.pos.z);const b=zv.set(Math.cos(this.yaw),0,-Math.sin(this.yaw));if(this.eye.addScaledVector(b,this.leanRoll*.44+u),this.killcam)this.killcam.update(t);else{this.camera.position.copy(this.eye),this.camera.rotation.set(0,0,0),this.camera.rotateY(this.yaw+this.recoilYaw.value+v),this.camera.rotateX(this.pitch+this.recoilPitch.value+g);const C=this.slideCant*.2;this.camera.rotateZ(-this.leanRoll*.16+C+p)}if(!this.killcam){const C=(o.sprinting?5:0)+(o.tacSprint?3:0);this.fovKick.target=C,this.camera.fov=this.baseFov+this.fovKick.value-e*20,this.camera.updateProjectionMatrix()}this.angularVel.set((this.yaw-this._lastYaw)/Math.max(t,1e-4),(this.pitch-this._lastPitch)/Math.max(t,1e-4)),this._lastYaw=this.yaw,this._lastPitch=this.pitch}land(t){this.landingDipVel-=1.6*t,this.addShake(.12*t)}}const zv=new S;function Ov(s=128){let t=40503;const e=()=>(t=t*1664525+1013904223>>>0,t/4294967296),i=new Float32Array(s*s);for(let o=0;o<s;o++)for(let l=0;l<s;l++){const h=o*s+l;i[h]=Math.sin(o*.72+Math.sin(l*.11)*1.8)*.4+e()*.6}const n=new Uint8Array(s*s*4),a=1.35;for(let o=0;o<s;o++)for(let l=0;l<s;l++){const h=o*s+l,c=i[o*s+(l-1+s)%s],u=i[o*s+(l+1)%s],d=i[(o-1+s)%s*s+l],f=i[(o+1)%s*s+l],g=(c-u)*a,v=(d-f)*a,p=1,m=Math.hypot(g,v,p);n[h*4]=(g/m*.5+.5)*255,n[h*4+1]=(v/m*.5+.5)*255,n[h*4+2]=(p/m*.5+.5)*255,n[h*4+3]=255}const r=new is(n,s,s,Ke);return r.wrapS=r.wrapT=_i,r.magFilter=Re,r.minFilter=gi,r.generateMipmaps=!0,r.needsUpdate=!0,r}function Bv(){const s=new $t;s.name="rifle";const t=Ov(),e=new zt({color:2830131,roughness:.42,metalness:.82,normalMap:t,normalScale:new gt(.22,.22),envMapIntensity:.55}),i=new zt({color:1842720,roughness:.78,metalness:.08,envMapIntensity:.22}),n=new zt({color:1316119,roughness:.85,metalness:.05,envMapIntensity:.2}),a=new zt({color:4014922,roughness:.5,metalness:.6,normalMap:t,normalScale:new gt(.16,.16),envMapIntensity:.5}),r={},o=(Mt,Tt,Et=s)=>(Tt.name=Mt,Tt.castShadow=!1,Et.add(Tt),r[Mt]=Tt,Tt);o("receiver",new U(new Rt(.052,.072,.3),e)).position.set(0,0,-.19),o("rail",new U(new Rt(.03,.012,.52),e)).position.set(0,.042,-.33);for(let Mt=0;Mt<11;Mt++){const Tt=new U(new Rt(.031,.004,.008),n);Tt.position.set(0,.049,-.12-Mt*.043),s.add(Tt)}o("ejectionPort",new U(new Rt(.004,.03,.06),n)).position.set(.027,.005,-.16);const u=o("bufferTube",new U(new Ht(.017,.017,.14,10),e));u.rotation.x=Math.PI/2,u.position.set(0,.006,.06),o("stock",new U(new Rt(.044,.09,.11),i)).position.set(0,-.012,.145),o("buttPad",new U(new Rt(.048,.104,.016),n)).position.set(0,-.012,.205),o("cheekRiser",new U(new Rt(.04,.02,.09),n)).position.set(0,.038,.13);const v=o("grip",new U(new Rt(.036,.11,.05),i));v.position.set(0,-.075,.02),v.rotation.x=.32,o("triggerGuard",new U(new Rt(.03,.006,.055),n)).position.set(0,-.052,-.02),o("trigger",new U(new Rt(.008,.024,.006),e)).position.set(0,-.038,-.012);const b=new zt({color:6713463,roughness:.5,metalness:.38,emissive:1316636,emissiveIntensity:1,normalMap:t,normalScale:new gt(.18,.18),envMapIntensity:.5}),C=new zt({color:8226188,roughness:.42,metalness:.42,emissive:1777446,emissiveIntensity:1,normalMap:t,normalScale:new gt(.18,.18),envMapIntensity:.5}),y=o("magazine",new $t),A=new U(new Rt(.042,.15,.066),b);A.position.y=-.075;const M=new U(new Rt(.046,.024,.07),C);M.position.y=-.115;const R=new U(new Rt(.046,.024,.07),C);R.position.y=-.055;const _=new U(new Rt(.046,.012,.072),C);_.position.y=-.156,y.add(A,M,R,_),y.position.set(0,-.036,-.115),y.rotation.x=.06;const E=y.position.clone(),D=o("handguard",new U(new Ht(.026,.026,.26,8),i));D.rotation.x=Math.PI/2,D.position.set(0,.004,-.47);for(let Mt=0;Mt<5;Mt++)for(const Tt of[-1,1]){const Et=new U(new Rt(.004,.008,.03),n);Et.position.set(Tt*.0262,.004,-.38-Mt*.045),s.add(Et)}o("foregrip",new U(new Ht(.014,.017,.07,8),i)).position.set(0,-.04,-.5);const I=o("barrel",new U(new Ht(.0115,.0115,.2,10),e));I.rotation.x=Math.PI/2,I.position.set(0,.004,-.7);const k=o("muzzleBrake",new U(new Ht(.016,.014,.05,10),e));k.rotation.x=Math.PI/2,k.position.set(0,.004,-.795);for(let Mt=0;Mt<3;Mt++){const Tt=new U(new Rt(.004,.006,.02),e);Tt.position.set(0,.02,-.8+Mt*.014),s.add(Tt)}const q=o("chargingHandle",new $t),B=new U(new Rt(.03,.012,.05),e),Y=new U(new Rt(.05,.008,.016),n);Y.position.set(.03,-.002,-.02),q.add(B,Y),q.position.set(0,.056,-.045);const H=q.position.clone(),J=.098,et=-.155;o("opticMount",new U(new Rt(.03,.024,.06),e)).position.set(0,.058,et);const rt=o("opticHousing",new U(new Ht(.0165,.0125,.04,24,1,!0),a));rt.rotation.x=Math.PI/2,rt.position.set(0,J,et),rt.material=new zt({color:2830131,roughness:.42,metalness:.82,side:Qe,envMapIntensity:.55});for(const[Mt,Tt]of[[-.02,.0125],[.02,.0165]]){const Et=new U(new mn(Tt,.0016,8,24),e);Et.position.set(0,J,et+Mt),s.add(Et)}o("opticGlass",new U(new qo(.0118,24),new du({color:12441343,transparent:!0,opacity:.1,roughness:.28,metalness:0,emissive:1451582,emissiveIntensity:1,side:Qe,depthWrite:!1}))).position.set(0,J,et+.019);const Yt=o("opticDot",new U(new Pe(.0011,8,6),new Ei({color:16722458})));Yt.position.set(0,J,et-.004),Yt.userData.isAimPoint=!0;const Ot=new U(new Rt(.006,.006,.008),n);Ot.position.set(0,J-.0125,et-.026),s.add(Ot),o("backupFrontSight",new U(new Rt(.006,.018,.016),n)).position.set(0,.058,-.585);const Z=new ae;Z.position.set(0,J,et+.0238);const st=new ae;st.position.set(0,J,et-.004);const it=new ae;return it.position.set(0,.004,-.822),s.add(Z,st,it),s.traverse(Mt=>{Mt.frustumCulled=!1}),{root:s,parts:r,anchors:{rearSightAnchor:Z,frontSightAnchor:st,muzzleAnchor:it},mag:y,magHome:E,chargingHandle:q,chHome:H,eyeRelief:.105}}function kv(s=128){let t=40503;const e=()=>(t=t*1664525+1013904223>>>0,t/4294967296),i=new Float32Array(s*s);for(let o=0;o<s;o++)for(let l=0;l<s;l++){const h=o*s+l;i[h]=Math.sin(o*.72+Math.sin(l*.11)*1.8)*.4+e()*.6}const n=new Uint8Array(s*s*4),a=1.35;for(let o=0;o<s;o++)for(let l=0;l<s;l++){const h=o*s+l,c=i[o*s+(l-1+s)%s],u=i[o*s+(l+1)%s],d=i[(o-1+s)%s*s+l],f=i[(o+1)%s*s+l],g=(c-u)*a,v=(d-f)*a,p=1,m=Math.hypot(g,v,p);n[h*4]=(g/m*.5+.5)*255,n[h*4+1]=(v/m*.5+.5)*255,n[h*4+2]=(p/m*.5+.5)*255,n[h*4+3]=255}const r=new is(n,s,s,Ke);return r.wrapS=r.wrapT=_i,r.magFilter=Re,r.minFilter=gi,r.generateMipmaps=!0,r.needsUpdate=!0,r}const wr=.062,Sr=-.03,Th=-.775,Gv=.095;function Vv(){const s=new $t;s.name="shotgun";const t=kv(),e=new zt({color:2830131,roughness:.42,metalness:.82,normalMap:t,normalScale:new gt(.22,.22),envMapIntensity:.55}),i=new zt({color:2303531,roughness:.34,metalness:.88,normalMap:t,normalScale:new gt(.18,.18),envMapIntensity:.62}),n=new zt({color:4863271,roughness:.72,metalness:.04,envMapIntensity:.28});new zt({color:1842720,roughness:.78,metalness:.08,envMapIntensity:.22});const a=new zt({color:1316119,roughness:.85,metalness:.05,envMapIntensity:.2}),r=new zt({color:3027510,roughness:.86,metalness:.05,envMapIntensity:.18}),o={},l=(Ot,Ut,Z=s)=>(Ut.name=Ot,Ut.castShadow=!1,Z.add(Ut),o[Ot]=Ut,Ut);l("receiver",new U(new Rt(.052,.062,.26),e)).position.set(0,0,-.15),l("ejectionPort",new U(new Rt(.004,.026,.055),a)).position.set(.0255,.008,-.105),l("loadingPort",new U(new Rt(.03,.004,.06),a)).position.set(0,-.0295,-.105),l("triggerGuard",new U(new Rt(.028,.006,.06),i)).position.set(0,-.052,-.045),l("trigger",new U(new Rt(.007,.022,.005),e)).position.set(0,-.038,-.035),l("slideRelease",new U(new Rt(.006,.02,.01),i)).position.set(.0245,-.028,-.075);const v=l("barrel",new U(new Ht(.0125,.0125,.58,12),i));v.rotation.x=Math.PI/2,v.position.set(0,.01,-.5);for(let Ot=0;Ot<6;Ot++){const Ut=new U(new Rt(.011,.006,.07),e);Ut.position.set(0,.054,-.315-Ot*.078),s.add(Ut);const Z=new U(new Rt(.004,.03,.006),e);Z.position.set(0,.039,-.315-Ot*.078),s.add(Z)}const p=l("frontBead",new U(new Ht(.0016,.0019,.005,10),new zt({color:13615778,roughness:.5,metalness:.2,emissive:16767392,emissiveIntensity:.22})));p.position.set(0,wr-.0025,Th+.004),p.userData.isAimPoint=!0;const m=l("magTube",new U(new Ht(.0115,.0115,.3,10),i));m.rotation.x=Math.PI/2,m.position.set(0,-.006,-.42);const b=l("magCap",new U(new Ht(.014,.014,.026,10),e));b.rotation.x=Math.PI/2,b.position.set(0,-.006,-.582);const C=l("forend",new $t),y=new U(new Ht(.0185,.0185,.15,12),n);y.rotation.x=Math.PI/2,C.add(y);for(let Ot=0;Ot<5;Ot++){const Ut=new U(new mn(.0187,.0016,6,16),a);Ut.rotation.x=0,Ut.position.z=-.055+Ot*.028,C.add(Ut)}const A=new U(new Ht(.0195,.0195,.016,12),e);A.rotation.x=Math.PI/2,A.position.z=.08,C.add(A),C.position.set(0,-.006,-.4);const M=C.position.clone(),R=l("supportHand",new $t,C),_=new U(new Rt(.05,.052,.095),r);_.position.set(.002,-.028,.002),_.rotation.set(.06,.1,-.06),R.add(_);for(let Ot=0;Ot<3;Ot++){const Ut=new U(new Rt(.014,.03,.014),r);Ut.position.set(.024,-.024,-.021+Ot*.021),R.add(Ut)}const E=new U(new Rt(.016,.03,.024),r);E.position.set(-.028,-.016,-.014),E.rotation.set(.2,0,.42),R.add(E);const D=new U(new Rt(.055,.062,.42),r);D.position.set(-.04,-.182,.14),D.rotation.set(.8,-.4,.1),R.add(D);const L=l("wrist",new U(new Rt(.04,.062,.09),n));L.position.set(0,-.004,.02),L.rotation.x=-.18;const I=l("stockBody",new U(new Rt(.044,.086,.13),n));I.position.set(0,-.03,.115),I.rotation.x=-.3;const k=l("buttPad",new U(new Rt(.048,.102,.016),a));k.position.set(0,-.052,.185),k.rotation.x=-.3;const q=l("comb",new U(new Rt(.036,.012,.1),n));q.position.set(0,.016,.085),q.rotation.x=-.22,l("sightBase",new U(new Rt(.024,.012,.02),e)).position.set(0,.037,Sr);for(const Ot of[-1,1]){const Ut=new U(new Rt(.005,.026,.012),e);Ut.position.set(Ot*.019,.051,Sr),s.add(Ut)}const Y=l("loadShell",new $t),H=new U(new Ht(.0095,.0095,.058,10),new zt({color:9316898,roughness:.55,metalness:.05,envMapIntensity:.3})),J=new U(new Ht(.0102,.0102,.009,10),new zt({color:11570504,roughness:.35,metalness:.8,envMapIntensity:.5}));J.position.z=.028,Y.add(H,J),Y.rotation.x=Math.PI/2,Y.visible=!1;const et=new S(.012,-.075,-.105),at=new ae;at.position.set(0,wr,Sr);const rt=new ae;rt.position.set(0,wr,Th);const _t=new ae;_t.position.set(0,.01,-.792);const Yt=new ae;return Yt.position.set(.03,.01,-.105),s.add(at,rt,_t,Yt),s.traverse(Ot=>{Ot.frustumCulled=!1}),{root:s,parts:o,anchors:{rearSightAnchor:at,frontSightAnchor:rt,muzzleAnchor:_t,ejectAnchor:Yt},forend:C,forendHome:M,loadShell:Y,shellHome:et,eyeRelief:Gv}}const _s=new S,br=new S,Eh=new S,Ah=new Wt,Rh=new S,Ch=new S,Ph=new S;function Lh(s){const t=s.anchors.rearSightAnchor.position,e=s.anchors.frontSightAnchor.position;_s.subVectors(e,t).normalize(),br.set(0,1,0).addScaledVector(_s,-_s.y).normalize(),Eh.crossVectors(_s,br).normalize(),Rh.copy(_s).negate(),Ah.makeBasis(Eh,br,Rh).transpose();const i=new xe().setFromRotationMatrix(Ah);return Ch.set(0,0,-s.eyeRelief),Ph.copy(t).applyQuaternion(i),{position:Ch.sub(Ph).clone(),quaternion:i.clone()}}const Dh={position:new S(.148,-.148,-.315),quaternion:new xe().setFromEuler(new ze(.075,.09,.045,"ZYX"))};function Ac(s,t,e){return e.position.lerpVectors(Dh.position,s.position,t),e.quaternion.slerpQuaternions(Dh.quaternion,s.quaternion,t),e}class Hv{constructor(t,e,i){this.rifle=t,this.audio=e,this.clock=i,this.active=!1,this.empty=!1,this.t=0,this.dur=2,this.posOffset={x:0,y:0,z:0},this.rotOffset={x:0,y:0,z:0},this.cameraRoll=0,this._mag={pos:t.magHome.clone(),rot:0,visible:!0,t:-1},this._ch={z:0},this._fired={}}get progress(){return kt(this.t/this.dur,0,1)}start(t,e){this.active=!0,this.empty=t,this.t=0,this.dur=(t?2:1.55)*(e?.7:1),this.speed=e?1.35:1,this._fired={},this._mag.t=-1,this._ch.z=0}cancel(){this.active=!1}_once(t,e){this._fired[t]||(this._fired[t]=!0,e())}update(t){if(!this.active)return;this.t+=t;const e=this.t,i=this.dur,n=this.speed>1,a=.16,r=.34,o=.58,l=.72,h=.86,c=_n(kt(e/(i*.1),0,1)),u=this.empty?h:o,d=_n(kt((e/i-u)/(1-u),0,1)),f=c*(1-d);if(this.posOffset.y=-.012*f,this.posOffset.z=.065*f,this.posOffset.x=.028*f,this.rotOffset.x=.3*f,this.rotOffset.y=-.12*f,this.rotOffset.z=.55*f,this.cameraRoll=.045*f,e>=i*a){this._once("click",()=>this.audio.reloadClick(n));const g=kt((e-i*a)/(i*.24),0,1),v=ci(g),p=Math.pow(g,2.6)*.22;this._mag.pos.set(this.rifle.magHome.x-.15*v,this.rifle.magHome.y+.02*v+.05*Math.sin(g*Math.PI)-p,this.rifle.magHome.z-.04*v),this._mag.rot=-2.8*ci(g)+g*g*.9,this._mag.visible=g<1,g>=1&&this._once("magout",()=>this.audio.magOut(n))}else this._mag.pos.copy(this.rifle.magHome);if(e>=i*r){const g=kt((e-i*r)/(i*(o-r)),0,1),v=ci(g),p={x:this.rifle.magHome.x-.18,y:this.rifle.magHome.y-.08,z:this.rifle.magHome.z-.06};this._mag.visible=!0,this._mag.pos.set(p.x+(this.rifle.magHome.x-p.x)*v,p.y+(this.rifle.magHome.y-p.y)*v,p.z+(this.rifle.magHome.z-p.z)*v),this._mag.rot=-.45*(1-v),g>=1&&this._once("magin",()=>{this.audio.magIn(n),this.nudge=1})}if(this.nudge>0&&(this.nudge=Math.max(0,this.nudge-t*5)),this.empty&&e>=i*l){const g=kt((e-i*l)/(i*(h-l)),0,1);if(g<.45){const v=ci(g/.45);this._ch.z=.05*v,g/.45>.6&&this._once("rackback",()=>this.audio.rackBack(n))}else{const v=Fa((g-.45)/.55);this._ch.z=.05*(1-v),v>=1&&this._once("rackforward",()=>this.audio.rackForward(n))}}e>=i&&(this.active=!1)}apply(){const t=this.rifle.mag;t.visible=this._mag.visible,t.position.copy(this._mag.pos),t.rotation.set(this._mag.rot,0,this._mag.rot*.3),this.rifle.chargingHandle.position.z=this.rifle.chHome.z+this._ch.z}resetMeshes(){this.rifle.mag.visible=!0,this.rifle.mag.position.copy(this.rifle.magHome),this.rifle.mag.rotation.set(0,0,0),this.rifle.chargingHandle.position.z=this.rifle.chHome.z,this._ch.z=0}}const Ni=.88,Tr=.16,Ih=.34,Er=.4,Uh=.6;class Wv{constructor(t,e,i){this.shotgun=t,this.audio=e,this.events=i,this.active=!1,this.t=0,this.travel=0,this.posOffset={x:0,y:0,z:0},this.rotOffset={x:0,y:0,z:0},this.kick=0,this._fired={},this._onShell=null}get busy(){return this.active}get duration(){return Ni}start(t){this.active=!0,this.t=0,this._fired={},this._onShell=t||null}cancel(){this.active=!1,this.travel=0,this._applyOffsets(0),this.apply()}_once(t,e){this._fired[t]||(this._fired[t]=!0,e())}update(t){if(!this.active)return;this.t+=t;const e=this.t;if(e<Ni*Tr)this.travel=0;else if(e<Ni*Ih)this.travel=ci((e/Ni-Tr)/(Ih-Tr)),this._once("rackBack",()=>{this.audio.pumpBack(),this.kick-=.006});else if(e<Ni*Er)this.travel=1,this._once("eject",()=>{this._onShell&&this._onShell()});else if(e<Ni*Uh){const i=(e/Ni-Er)/(Uh-Er);this.travel=1-Fa(i),this._once("rackFwd",()=>{this.audio.pumpForward(),this.kick+=.004})}else this.travel=0,this._once("clack",()=>{this.audio.pumpClose(),this.kick+=.008});this._applyOffsets(e/Ni),e>=Ni&&(this.active=!1,this.travel=0,this._applyOffsets(0))}_applyOffsets(t){const e=Math.sin(Math.min(t/.6,1)*Math.PI),i=kt((.55-t)/.55,0,1);this.posOffset.y=-.018*e,this.posOffset.z=.028*e,this.posOffset.x=.014*e,this.rotOffset.x=-.2*e,this.rotOffset.y=-.1*e,this.rotOffset.z=-.34*i}apply(){this.shotgun.forend.position.z=this.shotgun.forendHome.z+this.travel*.092}resetMeshes(){this.travel=0,this.shotgun.forend.position.z=this.shotgun.forendHome.z,this._applyOffsets(0)}}const Fh=.55,xs=.33,ca=.36,Nh=.31;class Xv{constructor(t,e){this.shotgun=t,this.audio=e,this.active=!1,this.t=0,this.sinceStart=0,this.shellsLoaded=0,this.posOffset={x:0,y:0,z:0},this.rotOffset={x:0,y:0,z:0},this.cameraRoll=0,this.nudge=0,this._shellT=0,this._fired={}}get progress(){return this.active?kt(this.t/Fh,0,1):0}start(t){this.active=!0,this.t=0,this.sinceStart=0,this.fast=!!t,this.shellsLoaded=0,this._shellT=0,this._fired={},this.audio.reloadClick(this.fast)}cancel(){this.active=!1,this.sinceStart=0,this._hideShell(),this._offsets(0)}_hideShell(){this.shotgun.loadShell.visible=!1}_once(t,e){this._fired[t]||(this._fired[t]=!0,e())}update(t){if(!this.active)return;const e=this.fast?1/.7:1;this.t+=t*e,this.sinceStart+=t;const i=this.t,n=Fh;if(i<n*xs)this._shellT=.06,this._once("reach",()=>{this.audio.shellPick()});else if(i<n*(xs+ca)){const a=(i/n-xs)/ca;this._shellT=ci(a),this._once("insert",()=>{})}else if(i<n*(xs+ca+Nh)){const a=(i/n-xs-ca)/Nh;this._shellT=1+Fa(a),a>.25&&this._once("click",()=>{this.audio.shellInsert(this.fast),this.shellsLoaded++,this.nudge=1})}else this.t=0,this._shellT=0,this._fired={};this._offsets(kt(this.sinceStart/.22,0,1)),this.nudge>0&&(this.nudge=Math.max(0,this.nudge-t*5))}_offsets(t){const e=_n(kt(t/.15,0,1));this.posOffset.y=-.006*e,this.posOffset.z=.05*e,this.posOffset.x=.03*e,this.rotOffset.x=.34*e,this.rotOffset.y=-.38*e,this.rotOffset.z=.85*e,this.cameraRoll=.05*e}apply(){const t=this.shotgun.loadShell,e=this.shotgun.shellHome;if(!this.active||this._shellT<=0){t.visible=!1;return}t.visible=this._shellT<1;const i=kt(this._shellT,0,1);t.position.set(e.x+.02*(1-i),e.y-.05*(1-i),e.z-.03*(1-i))}resetMeshes(){this._hideShell(),this._shellT=0,this.sinceStart=0,this._offsets(0),this.nudge=0}}const qv=700,Yv=60/qv,Ar=30,$v=6,Kv=9,Zv=13,Jv=.95,ys=Math.sqrt(220),Qv=.35;class jv{constructor(t,e,i){this.vmScene=t,this.audio=e,this.events=i,this.rifle=Bv(),this.shotgun=Vv(),this.rig=new $t,this.rig.add(this.rifle.root),this.rig.add(this.shotgun.root),t.add(this.rig),this.shotgun.root.visible=!1,this.adsPoses={rifle:Lh(this.rifle),shotgun:Lh(this.shotgun)},this.adsPose=this.adsPoses.rifle,this.kind="rifle",this.magSizes={rifle:Ar,shotgun:$v},this._stash={rifle:null,shotgun:null},this.swapT=-1,this.swapTo=null,this.pump=new Wv(this.shotgun,e,i),this.shellReload=new Xv(this.shotgun,e),this.ammo=Ar,this.magSize=Ar,this.fireTimer=0,this.triggerHeld=!1,this.dryFired=!1,this.reloading=!1,this.rifleReload=new Hv(this.rifle,e,fe),this.reload=this.rifleReload,this._sgReloadStart=0,this.adsT=0,this.adsWant=!1,this._adsFromTac=!1,this.bloom=0,this.shotIndex=0,this.lastShot=-10,this.heat=0,this.kickPos=new pn(0,850,26),this.kickRot=new pn(0,850,26),this.kickYaw=new pn(0,850,26),this.kickRoll=new pn(0,700,22),this.reloadNudgeY=0,this.lagYaw=0,this.lagPitch=0,this.followYaw=0,this.followYawVel=0,this.followPitch=0,this.followPitchVel=0,this.lagStrafe=0,this.lagVert=0,this.swayX=0,this.swayY=0,this.swayRX=0,this.swayRY=0,this.bobPhase=0,this.breathPhase=T.next()*6,this.inspectT=-1,this.wallBump=0,this._wallRay=new Zo,this._wallRay.far=.62,this._pose={position:new S,quaternion:new xe},this._tmpQ=new xe,this._tmpE=new ze,this._tmpV=new S,this.muzzleWorld=new S,this.muzzleDir=new S(0,0,-1),this.overdrive=!1}get adsAmount(){return _n(this.adsT)}get model(){return this.kind==="shotgun"?this.shotgun:this.rifle}get isShotgun(){return this.kind==="shotgun"}get swapping(){return this.swapT>=0}requestSwitch(t){t===this.kind||this.swapping||(this.reloading&&(this.reloading=!1,this.reload.cancel(),this.reload.resetMeshes()),this.pump.cancel(),this.inspectT=-1,this._stash[this.kind]=this._snapshotState(),this.swapTo=t,this.swapT=0,this.audio.reloadClick(!1))}_snapshotState(){return{ammo:this.ammo,fireTimer:this.fireTimer,bloom:this.bloom,heat:this.heat,reloading:this.reloading,shotIndex:this.shotIndex,lastShot:this.lastShot,dryFired:this.dryFired,adsT:this.adsT}}_restoreState(t){this.ammo=t.ammo,this.fireTimer=t.fireTimer,this.bloom=t.bloom,this.heat=t.heat,this.reloading=t.reloading,this.shotIndex=t.shotIndex,this.lastShot=t.lastShot,this.dryFired=t.dryFired,this.adsT=t.adsT}_applyKind(t){this.kind=t,this.rifle.root.visible=t==="rifle",this.shotgun.root.visible=t==="shotgun",this.adsPose=this.adsPoses[t],this.magSize=this.magSizes[t],this.reload=t==="shotgun"?this.shellReload:this.rifleReload;const e=this._stash[t];this._restoreState(e||{ammo:this.magSize,fireTimer:0,bloom:0,heat:0,reloading:!1,shotIndex:0,lastShot:-10,dryFired:!1,adsT:0}),e||(this.ammo=this.magSize)}tryReload(){this.reloading||this.swapping||this.ammo>=this.magSize||(this.inspectT>=0&&(this.inspectT=-1),this.reloading=!0,this.kind==="shotgun"?(this._sgReloadStart=this.ammo,this.shellReload.start(this.overdrive)):(this.reload.start(this.ammo===0,this.overdrive),this.audio.reloadStart(this.overdrive)))}fire(){if(this.swapping||this.reloading||this.inspectT>=0)return!1;if(this.kind==="shotgun")return this._fireShotgun();if(this.ammo<=0)return this.dryFired||(this.audio.dryFire(),this.dryFired=!0),!1;this.ammo--,this.fireTimer=Yv,this.dryFired=!1;const t=fe.world-this.lastShot>.35;this.lastShot=fe.world,this.shotIndex++;const e=this.currentSpread();this.events.fireBullet({spread:e,first:t,shotIndex:this.shotIndex});const i=t?1.4:1,n=1-this.adsAmount*.5,a=Math.sqrt(850),r=.013*i*(1-this.adsAmount*.15),o=(Math.sin(this.shotIndex*.82)*.42+T.gauss(0,.12))*.0038;return this.events.cameraRig.recoilPitch.impulse(-r*.75*ys),this.events.cameraRig.recoilPitch.target=0,this.events.cameraRig.recoilYaw.impulse(o*.75*ys),this.events.player.pitch=kt(this.events.player.pitch-r*.35,-1.45,1.45),this.events.cameraRig.addShake(.1*i),this.kickPos.target=0,this.kickRot.impulse(.135*i*n*a),this.kickYaw.impulse(T.gauss(0,.05)*a*n),this.kickPos.impulse(.1*i*n*a),this.kickRoll.impulse(T.gauss(0,.042)*Math.sqrt(700)),this.bloom=Math.min(this.bloom+(this.adsAmount>.5?.055:.5),3.4),this.heat=Math.min(1,this.heat+.13),this.audio.shot(this.heat,this.overdrive),this.events.onShotFX(t),!0}_fireShotgun(){if(this.pump.busy)return!1;if(this.ammo<=0)return this.dryFired||(this.audio.dryFire(),this.dryFired=!0),!1;this.ammo--,this.fireTimer=Jv,this.dryFired=!1;const t=fe.world-this.lastShot>.6;this.lastShot=fe.world,this.shotIndex++;const e=this.currentSpread(),i=ye.lerp(.031,.012,this.adsAmount);this.events.firePellets({spread:e,pelletSpread:i,count:Kv,damage:Zv*(this.overdrive?1.15:1),first:t,shotIndex:this.shotIndex});const n=1-this.adsAmount*.5,a=Math.sqrt(850),r=.052*(1-this.adsAmount*.15),o=T.gauss(0,.3)*.01;return this.events.cameraRig.recoilPitch.impulse(-r*.75*ys),this.events.cameraRig.recoilPitch.target=0,this.events.cameraRig.recoilYaw.impulse(o*.75*ys),this.events.player.pitch=kt(this.events.player.pitch-r*.35,-1.45,1.45),this.events.cameraRig.addShake(.34),this.events.cameraRig.fovKick.impulse(2.6*Math.sqrt(90)),this.kickPos.target=0,this.kickRot.impulse(.42*n*a),this.kickYaw.impulse(T.gauss(0,.11)*a*n),this.kickPos.impulse(.3*n*a),this.kickRoll.impulse(T.gauss(0,.09)*Math.sqrt(700)),this.bloom=Math.min(this.bloom+1.4,3.4),this.heat=Math.min(1,this.heat+.34),this.audio.shotgunShot(this.heat,this.overdrive),this.events.onShotFX(t),this.pump.start(()=>this.events.onPumpShell?.()),!0}currentSpread(){const t=this.events.player;let i=(this.kind==="shotgun"?ye.lerp(.058,.006,this.adsAmount):ye.lerp(.052,.0038,this.adsAmount))+this.bloom*.01*(1-this.adsAmount*.8);const n=Math.hypot(t.vel.x,t.vel.z);return i+=n*.0022*(1-this.adsAmount*.7),t.grounded||(i+=.045),t.crouching&&(i*=.62),this.overdrive&&(i*=.55),i}update(t,e,i,n){const a=fe.dt;this.adsWant=e.mouse.right&&e.locked&&!i.tacSprint&&!this.reloading&&!this.swapping,e.mouse.right&&i.tacSprint&&(i.tacSprint=!1);const r=this._adsFromTac?1/.26:1/.15;this.adsWant&&this.adsT<1&&(this._adsFromTac=i.tacSprint),this.adsT=kt(this.adsT+(this.adsWant?t*r:-t*(1/.13)),0,1),e.pressed("Digit1")&&this.requestSwitch("rifle"),e.pressed("Digit2")&&this.requestSwitch("shotgun"),this.swapping&&(this.swapT+=a/Qv,this.swapT>=.5&&this.swapTo&&(this._applyKind(this.swapTo),this.swapTo=null),this.swapT>=1&&(this.swapT=-1)),this.triggerHeld=e.mouse.left&&e.locked,this.fireTimer-=a,this.triggerHeld&&this.fireTimer<=0&&this.fire(),this.pump.active&&(this.pump.update(a),this.pump.apply(),this.pump.kick!==0&&(n.recoilPitch.impulse(this.pump.kick*2*ys),this.pump.kick=0)),e.pressed("KeyR")&&this.tryReload(),this.reloading&&(this.reload.update(a),this.reload.apply(),this.kind==="shotgun"?(this.ammo=Math.min(this.magSize,this._sgReloadStart+this.shellReload.shellsLoaded),i.sprinting?(this.reloading=!1,this.reload.cancel(),this.reload.resetMeshes(),this.audio.reloadAbort()):(!this.reload.active||this.ammo>=this.magSize)&&(this.reloading=!1,this.reload.cancel(),this.reload.resetMeshes())):i.sprinting&&this.reload.progress<.85?(this.reloading=!1,this.reload.cancel(),this.reload.resetMeshes(),this.audio.reloadAbort()):this.reload.active||(this.reloading=!1,this.reload.resetMeshes(),this.ammo=this.reload.empty?this.magSize:this.magSize+(this.ammo>0?1:0),this.ammo=Math.min(this.ammo,this.magSize+1))),e.pressed("KeyI")&&this.inspectT<0&&!this.reloading&&!this.swapping&&!(this.kind==="shotgun"&&this.pump.busy)&&this.adsAmount<.2&&(this.inspectT=0),this.inspectT>=0&&(this.inspectT+=t,(this.inspectT>2.4||this.triggerHeld||this.adsWant)&&(this.inspectT=-1)),this.kickPos.update(a),this.kickRot.update(a),this.kickRoll.update(a),this.bloom=Math.max(0,this.bloom-a*4.2),this.heat=Math.max(0,this.heat-a*.055),this.reload.nudgeY!==void 0&&(this.reloadNudgeY=this.reload.nudge||0);const o=1-this.adsAmount*.85;this.swayX=Ae(this.swayX,kt(-e.mouse.dx*45e-5,-.03,.03)*o,9,t),this.swayY=Ae(this.swayY,kt(e.mouse.dy*4e-4,-.025,.025)*o,9,t);const l=170,h=2*Math.sqrt(170)*.82;this._followSnapped||(this.followYaw=n.yaw,this.followPitch=n.pitch,this.followYawVel=0,this.followPitchVel=0,this._followSnapped=!0);let c=n.yaw-this.followYaw;c=Math.atan2(Math.sin(c),Math.cos(c)),this.followYawVel+=(l*c-h*this.followYawVel)*t,this.followYaw+=this.followYawVel*t;let u=n.pitch-this.followPitch;this.followPitchVel+=(l*u-h*this.followPitchVel)*t,this.followPitch+=this.followPitchVel*t;const d=1-this.adsAmount*.55;this.lagYaw=kt((this.followYaw-n.yaw)*.6,-.42,.42)*d,this.lagPitch=kt((this.followPitch-n.pitch)*.6,-.3,.3)*d;const f=Math.cos(n.yaw),g=-Math.sin(n.yaw),v=i.vel.x*f+i.vel.z*g,p=1-this.adsAmount*.6;this.lagStrafe=Ae(this.lagStrafe,kt(-v*.006,-.045,.045)*p,8,t),this.lagVert=Ae(this.lagVert,kt(-i.vel.y*.005,-.05,.05)*p,8,t),this._assemblePose(t,i,n)}_wallBumpCheck(t,e){this._wallRay.set(e.eye,this._tmpV.set(0,0,-1).applyQuaternion(e.camera.quaternion));const i=this._wallRay.intersectObjects(this.events.world.props.rayTargets,!1);let n=i.length>0?i[0].distance:1/0;const a=this.events.world.terrain.rayIntersect(e.eye,this._tmpV,.62);a>=0&&(n=Math.min(n,a));const r=n===1/0?0:kt(1-n/.62,0,1);this.wallBump=Ae(this.wallBump,r,10,fe.dtReal)}_assemblePose(t,e,i){this._wallBumpCheck(e,i);const n=this.adsAmount;Ac(this.adsPose,n,this._pose);const a=Math.hypot(e.vel.x,e.vel.z),r=e.grounded;this.breathPhase+=t*1.35,this.bobPhase+=t*(5.2+a*.9)*(r&&a>.4?1:.25);const o=kt(a/7,0,1)*(1-n*.82),l=Math.cos(this.bobPhase)*.009*o,h=Math.sin(this.bobPhase*2)*.007*o,c=Math.sin(this.breathPhase)*.0016*(1-n*.7),u=Ae(this._sprintK??0,e.tacSprint?2:e.sprinting?1:0,8,t);this._sprintK=u;const d=e.tacSprint?Math.sin(this.bobPhase*1.6)*.016:0,f=Ae(this._slideK??0,e.sliding?1:0,10,t);this._slideK=f;const g=i.landingDip*.5,v=i.landingDip*.55,p=this.reloading?this.reload.posOffset:{x:0,y:0,z:0},m=this.reloading?this.reload.rotOffset:{x:0,y:0,z:0},b=this.reloading&&this.reload.nudge||0,C=this.pump.active?this.pump.posOffset:{x:0,y:0,z:0},y=this.pump.active?this.pump.rotOffset:{x:0,y:0,z:0};let A=0;if(this.swapping){const k=this.swapT;A=k<.5?Fa(k/.5):1-ci((k-.5)/.5)}const M=this.wallBump,R=this._pose.position.x+this.swayX+this.lagStrafe+l+u*.012+f*.04+p.x+C.x,_=this._pose.position.y+this.swayY+this.lagVert+h+c-u*.055+d*.4-this.kickPos.value*.35-f*.02+g+p.y+b*.012-M*.02+C.y-.3*A,E=this._pose.position.z+this.kickPos.value+u*.045+p.z+M*.03+C.z+.1*A,D=this.lagPitch+this.kickRot.value+v+u*.3+m.x-M*.18+f*.1+y.x-1.15*A,L=this.lagYaw+this.kickYaw.value+u*.26+m.y-M*.12+y.y+.28*A,I=this.kickRoll.value+u*.1+f*.42+m.z+this.swayX*1.6+y.z+.35*A;if(this.inspectT>=0){const k=this.inspectT/2.4,q=k<.22?ci(k/.22):k>.82?1-_n((k-.82)/.18):1,B=Math.sin(k*Math.PI*3)*.12*q;this._pose.position.y+=.02*q,this._pose.position.x-=.05*q,this.rig.position.set(R-.05*q,_+.02*q,E+.04*q),this._tmpE.set(D+.16*q+B,L+1.15*q+B*.7,I+.5*q,"ZYX");const Y=k>.45&&k<.6?Math.sin((k-.45)/.15*Math.PI):0;this.rifle.chargingHandle.position.z=this.rifle.chHome.z+Y*.045,Y>.9&&!this._inspFlick&&(this._inspFlick=!0,this.audio.rackBack(!1)),Y===0&&(this._inspFlick=!1),this._tmpQ.setFromEuler(this._tmpE),this.rig.quaternion.copy(this._tmpQ);return}this.rifle.chargingHandle.position.z=this.rifle.chHome.z,this.rig.position.set(R,_,E),this._tmpE.set(D,L,I,"ZYX"),this._tmpQ.setFromEuler(this._tmpE),this.rig.quaternion.copy(this._pose.quaternion).multiply(this._tmpQ),i.reloadRoll=this.reloading?this.reload.cameraRoll:0}updateMuzzleWorld(t){return this.model.anchors.muzzleAnchor.getWorldPosition(this.muzzleWorld),this.muzzleDir.set(0,0,-1).applyQuaternion(t.quaternion),this.muzzleWorld.applyMatrix4(t.matrixWorld)}get adsSensScale(){return ye.lerp(1,.62,this.adsAmount)}}const t_=17;class e_{constructor(t,e,i,n,a){this.root=t,this.groundFn=i,this.active=!0,this.frozen=!1,this.age=0,this.sinkT=-1,this.points=[],this.sticks=[],this.partLinks=[],this.scene=n,this.stolen=new Set,this.root.updateWorldMatrix(!0,!0);for(const A of Object.keys(e)){const M=e[A];!M||!M.mesh||(M.mesh.parent!==n&&n.attach(M.mesh),M.mesh.material=M.mesh.material.clone(),M.mesh.material.emissive&&(M.mesh.material.emissive.setHex(1448998),M.mesh.material.emissiveIntensity=1),this.stolen.add(M.mesh))}const r=A=>{const M=new S().copy(A.pivot);return this.root.localToWorld(M),M},o=(A,M)=>{const R={name:A,pos:r(M),prev:r(M),r:M.radius??.09,pinned:!1};return this.points.push(R),R};this.P=o;const l=o("pelvis",e.pelvis),h=o("chest",e.chest),c=o("head",e.head),u=o("elbowL",e.elbowL),d=o("handL",e.handL),f=o("elbowR",e.elbowR),g=o("handR",e.handR),v=o("kneeL",e.kneeL),p=o("footL",e.footL),m=o("kneeR",e.kneeR),b=o("footR",e.footR),C=(A,M,R=1)=>{this.sticks.push({a:A,b:M,len:A.pos.distanceTo(M.pos),stiff:R})};C(l,h),C(h,c),C(h,u),C(u,d),C(h,f),C(f,g),C(l,v),C(v,p),C(l,m),C(m,b),C(l,c,.08),C(h,v,.05),C(h,m,.05),C(u,f,.12);const y=(A,M,R)=>this.partLinks.push({mesh:A,a:M,b:R});y(e.head.mesh,h,c),y(e.torso.mesh,l,h),y(e.armUpperL.mesh,h,u),y(e.armLowerL.mesh,u,d),y(e.armUpperR.mesh,h,f),y(e.armLowerR.mesh,f,g),y(e.legUpperL.mesh,l,v),y(e.legLowerL.mesh,v,p),y(e.legUpperR.mesh,l,m),y(e.legLowerR.mesh,m,b),this.pelvis=l,this._buildSprawl(l,h,c,u,d,f,g,v,p,m,b,a)}_buildSprawl(t,e,i,n,a,r,o,l,h,c,u,d){const f=i_.set(d?d.x:0,0,d?d.z:-1).normalize().clone(),g=T.range(.9,1.35)*(T.next()<.5?1:-1),v=Math.cos(g),p=Math.sin(g),m=n_.set(f.x*v-f.z*p,0,f.z*v+f.x*p).normalize().clone(),b=new S().crossVectors(new S(0,1,0),m).normalize().multiplyScalar(T.next()<.5?1:-1),C=t.pos.clone(),y=(A,M,R,_)=>{const E=new S(C.x+m.x*M+b.x*_,0,C.z+m.z*M+b.z*_);E.y=this.groundFn(E.x,E.z)+Math.max(.04,R),A.sprawl=E};y(t,0,.09,0),y(e,.34,.11,0),y(i,.62,.05,.1),y(n,.36,.05,.26),y(a,.4,.05,.5),y(r,.28,.04,-.1),y(o,.42,.03,-.16),y(l,-.42,.06,.06),y(h,-.86,.04,.14),y(c,-.32,.17,.16),y(u,-.52,.05,.34),this._poseT=.55}impulse(t,e,i){const n=i*(this._step||.016666666666666666);for(const a of this.points){const r=a.pos.distanceTo(t),o=Math.exp(-r*r*1.2);a.prev.x-=e.x*n*o,a.prev.y-=e.y*n*o*.6+n*o*.1,a.prev.z-=e.z*n*o}this.frozen=!1,this._unfreezeT=0}update(t){if(this.age+=t,t>1e-5&&(this._step=t),this.sinkT>=0){this.sinkT+=t;for(const o of this.stolen)o.position.y-=t*.22,this.sinkT>2.2&&(o.visible=!1);this.sinkT>2.2&&(this.active=!1,this.root.visible=!1);return}if(this.frozen)return;let e=0;for(const o of this.points){const l=o.pos.x-o.prev.x,h=o.pos.y-o.prev.y,c=o.pos.z-o.prev.z;e+=l*l+h*h+c*c}e<2e-6&&this.age>.6&&(this.frozen=!0);const i=t*t;let n=0;this._poseT>0&&(this._poseT-=t,n=1-Math.exp(-t*9));for(const o of this.points){if(o.pinned)continue;const l=o.pos.x+(o.pos.x-o.prev.x)*.985,h=o.pos.y+(o.pos.y-o.prev.y)*.985-t_*i,c=o.pos.z+(o.pos.z-o.prev.z)*.985;o.prev.copy(o.pos),o.pos.set(l,h,c)}for(let o=0;o<4;o++){for(const h of this.sticks){const c=h.b.pos.x-h.a.pos.x,u=h.b.pos.y-h.a.pos.y,d=h.b.pos.z-h.a.pos.z,f=Math.hypot(c,u,d)||1e-6,g=(f-h.len)/f*.5*h.stiff;h.a.pos.x+=c*g,h.a.pos.y+=u*g,h.a.pos.z+=d*g,h.b.pos.x-=c*g,h.b.pos.y-=u*g,h.b.pos.z-=d*g}const l=o===3;for(const h of this.points){const c=this.groundFn(h.pos.x,h.pos.z)+h.r*.5;h.pos.y<c&&(h.pos.y=c,l&&(h.prev.x=h.pos.x+(h.prev.x-h.pos.x)*.55,h.prev.z=h.pos.z+(h.prev.z-h.pos.z)*.55,h.prev.y=h.pos.y+(h.pos.y-h.prev.y)*.25))}}if(n>0)for(const o of this.points)o.pos.lerp(o.sprawl,n);const a=s_,r=a_;for(const o of this.partLinks){o.mesh.position.copy(o.a.pos).add(o.b.pos).multiplyScalar(.5),a.copy(o.b.pos).sub(o.a.pos);const l=a.length()||1e-4;o.mesh.scale.set(1,l/(o.restLen??(o.restLen=l)),1),zh.setFromUnitVectors(r,a.multiplyScalar(1/l)),o.mesh.quaternion.copy(zh)}}beginSink(){this.sinkT<0&&(this.sinkT=0)}dispose(){for(const t of this.stolen)this.scene.remove(t),t.geometry?.dispose(),t.material?.dispose&&t.material.dispose();this.stolen.clear(),this.partLinks.length=0,this.active=!1}}const zh=new xe,i_=new S,n_=new S,s_=new S,a_=new S(0,1,0);class r_{constructor(t=8){this.max=t,this.list=[]}add(t){for(this.list.push(t);this.list.length>this.max;){const e=this.list.shift();e.dispose(),e.root.visible=!1}}update(t){for(let e=this.list.length-1;e>=0;e--){const i=this.list[e];if(!i.active){i.dispose(),this.list.splice(e,1);continue}i.age>4.2&&i.sinkT<0&&i.beginSink(),i.update(t)}}get activeCount(){return this.list.length}clear(){for(const t of this.list)t.dispose(),t.root.visible=!1;this.list.length=0}}const o_=3950681,Oh=9427199,l_={rusher:{hp:100,speed:5.6,scale:.97,color:5333370,dmg:16,range:2.4},gunner:{hp:150,speed:3.4,scale:1,color:4608875,dmg:9,range:60},heavy:{hp:420,speed:2.1,scale:1.12,color:4082270,dmg:12,range:60,plates:3}};let h_=0;class Rc{constructor(t,e,i){this.id=++h_,this.type=t,this.cfg=l_[t],this.ctx=i,this.scene=i.scene,this.hp=this.cfg.hp,this.maxHp=this.cfg.hp,this.dead=!1,this.state="advance",this.stateT=0,this.thinkT=T.next()*.3,this.pos=e.clone(),this.yaw=T.next()*Math.PI*2,this.vel=new S,this.walkPhase=T.next()*6,this.flinch=new S,this.staggerT=0,this.fireCd=T.range(.8,2),this.burst=0,this.burstCd=0,this.aimError=new S,this.coverPoint=null,this.pushMode=!1,this.flankSide=T.sign(),this.meleeT=0,this.trailT=0,this.plates=[],this.losCache=0,this.los=!1,this.spawnT=0,this._buildModel()}_buildModel(){const t=new $t;this.root=t;const e=new zt({color:this.cfg.color,roughness:.82,metalness:.08}),i=new zt({color:o_,roughness:.7,metalness:.15}),n=new zt({color:Oh,emissive:Oh,emissiveIntensity:1.6,roughness:.3,metalness:.1}),a=new zt({color:5923440,roughness:.9}),r=this.cfg.scale,o=(y,A,M,R,_,E,D,L)=>{const I=new U(new Rt(A*r,M*r,R*r),_);return I.position.set(E*r,D*r,L*r),I.castShadow=!0,I.userData={enemy:this,part:"torso"},I};this.torso=new $t,t.add(this.torso);const l=o("torso",.42,.52,.26,i,0,1.18,0);this.torso.add(l);const h=new U(new Rt(.44*r,.035*r,.02*r),n);h.position.set(0,1.32*r,.14*r),this.torso.add(h);const c=h.clone();c.position.y=1.1*r,this.torso.add(c);const u=o("pack",.3,.36,.16,e,0,1.2,-.2);this.torso.add(u),this.head=new $t,this.head.position.set(0,1.56*r,0);const d=o("head",.2,.24,.22,a,0,0,0);d.userData.part="head",this.head.add(d);const f=new U(new Rt(.19*r,.05*r,.02*r),new zt({color:790548,emissive:6740479,emissiveIntensity:1.4,roughness:.2}));f.position.set(0,.03*r,.115*r),this.head.add(f);const g=o("hood",.24,.2,.24,e,0,.08,-.01);this.head.add(g);const v=new zt({color:13228266,roughness:.9}),p=new U(new Rt(.23*r,.05*r,.23*r),v);p.position.set(0,.185*r,-.01),p.castShadow=!1,this.head.add(p);const m=new U(new Rt(.46*r,.05*r,.3*r),v);m.position.set(0,1.46*r,-.02*r),this.torso.add(m),this.torso.add(this.head);const b=o("pelvis",.36,.22,.24,e,0,.84,0);t.add(b);const C=(y,A,M,R)=>{const _=new $t,E=new U(new Rt(y*r,A*r,M*r),R);return E.position.y=-A*r/2,E.castShadow=!0,E.userData={enemy:this,part:"limb"},_.add(E),{grp:_,mesh:E}};if(this.armUL=C(.11,.32,.13,e),this.armUL.grp.position.set(-.27*r,1.4*r,0),this.armLL=C(.09,.3,.11,e),this.armUR=C(.11,.32,.13,e),this.armUR.grp.position.set(.27*r,1.4*r,0),this.armLR=C(.09,.3,.11,e),this.armUL.grp.add(this.armLL.grp),this.armLL.grp.position.set(0,-.32*r,0),this.armUR.grp.add(this.armLR.grp),this.armLR.grp.position.set(0,-.32*r,0),this.legUL=C(.15,.42,.16,e),this.legUL.grp.position.set(-.12*r,.82*r,0),this.legLL=C(.12,.42,.13,e),this.legUR=C(.15,.42,.16,e),this.legUR.grp.position.set(.12*r,.82*r,0),this.legLR=C(.12,.42,.13,e),this.legUL.grp.add(this.legLL.grp),this.legLL.grp.position.set(0,-.42*r,0),this.legUR.grp.add(this.legLR.grp),this.legLR.grp.position.set(0,-.42*r,0),this.torso.add(this.armUL.grp,this.armUR.grp),t.add(this.legUL.grp,this.legUR.grp),this.type==="rusher"){const y=new $t,A=new U(new Ht(.018*r,.022*r,.6*r,6),new zt({color:4866104,roughness:.8}));A.userData={enemy:this,part:"limb"},y.add(A);const M=new U(new Rt(.14*r,.1*r,.02*r),new zt({color:10465992,roughness:.35,metalness:.8,emissive:923170,emissiveIntensity:1}));M.position.set(.06*r,.28*r,0),M.userData={enemy:this,part:"limb"},y.add(M),this.weapon=y}else{const y=new $t,A=new U(new Rt(.06*r,.09*r,.72*r),new zt({color:1316636,roughness:.6,metalness:.5}));A.userData={enemy:this,part:"limb"},y.add(A);const M=new U(new Rt(.05*r,.16*r,.07*r),new zt({color:1053464,roughness:.7}));M.position.y=-.11*r,y.add(M),this.weapon=y}if(this.weapon.position.set(0,-.26*r,.1*r),this.armLR.grp.add(this.weapon),this.cfg.plates)for(let y=0;y<this.cfg.plates;y++){const A=new U(new Rt(.2*r,.26*r,.03*r),new zt({color:3818834,roughness:.45,metalness:.7}));A.position.set((y-1)*.15*r,1.22*r,.15*r),this.torso.add(A),this.plates.push(A)}this.scene.add(t),this.hitMeshes=[],t.traverse(y=>{y.isMesh&&y.userData.enemy===this&&this.hitMeshes.push(y)}),this.partDefs={head:{mesh:d,pivot:new S(0,1.56*r,0),radius:.12},torso:{mesh:l,pivot:new S(0,1.18*r,0)},pelvis:{mesh:b,pivot:new S(0,.84*r,0)},chest:{mesh:l,pivot:new S(0,1.4*r,0),radius:.14},elbowL:{mesh:this.armLL.mesh,pivot:new S(-.27*r,1.1*r,0)},handL:{mesh:this.armLL.mesh,pivot:new S(-.27*r,.8*r,.1*r)},elbowR:{mesh:this.armLR.mesh,pivot:new S(.27*r,1.1*r,0)},handR:{mesh:this.armLR.mesh,pivot:new S(.27*r,.8*r,.1*r)},kneeL:{mesh:this.legLL.mesh,pivot:new S(-.12*r,.42*r,0)},footL:{mesh:this.legLL.mesh,pivot:new S(-.12*r,.02*r,0)},kneeR:{mesh:this.legLR.mesh,pivot:new S(.12*r,.42*r,0)},footR:{mesh:this.legLR.mesh,pivot:new S(.12*r,.02*r,0)},armUpperL:{mesh:this.armUL.mesh,pivot:new S(-.27*r,1.4*r,0)},armLowerL:{mesh:this.armLL.mesh,pivot:new S(-.27*r,1.1*r,0)},armUpperR:{mesh:this.armUR.mesh,pivot:new S(.27*r,1.4*r,0)},armLowerR:{mesh:this.armLR.mesh,pivot:new S(.27*r,1.1*r,0)},legUpperL:{mesh:this.legUL.mesh,pivot:new S(-.12*r,.82*r,0)},legLowerL:{mesh:this.legLL.mesh,pivot:new S(-.12*r,.42*r,0)},legUpperR:{mesh:this.legUR.mesh,pivot:new S(.12*r,.82*r,0)},legLowerR:{mesh:this.legLR.mesh,pivot:new S(.12*r,.42*r,0)}}}get muzzleWorld(){return Bh.set(.25,1.35,.4).applyMatrix4(this.root.matrixWorld),Bh}hit(t,e,i){if(this.dead)return{killed:!1};const n=i==="head";let a=t*(n?2.4:i==="limb"?.75:1);if(this.plates.length>0){const r=this.plates[this.plates.length-1];a*=.35,this.hp-a<this.maxHp*(this.plates.length-1)/3*.999&&this._detachPlate(r,e)}return this.hp-=a,this.flinch.addScaledVector(e,n?.14:.07),t>45&&(this.staggerT=.5),this.wounded=this.hp<this.maxHp*.45,this.hp<=0?{killed:!0,headshot:n}:{killed:!1,headshot:n,dealt:a}}_detachPlate(t,e){const i=this.plates.indexOf(t);if(i<0)return;this.plates.splice(i,1),this.ctx.scene.attach(t),this.ctx.fx.flyingPlates.push({mesh:t,vel:new S(e.x*3+T.gauss(0,1.5),T.range(3,5),e.z*3+T.gauss(0,1.5)),spin:new S(T.gauss(0,9),T.gauss(0,9),T.gauss(0,9)),life:0});const n=t.getWorldPosition(new S);for(let a=0;a<12;a++)this.ctx.fx.particlesAdd.spawn({x:n.x,y:n.y,z:n.z,vx:T.gauss(0,2.5),vy:T.range(1,4),vz:T.gauss(0,2.5),life:T.range(.2,.5),size:T.range(.015,.03),r:1,g:.85,b:.5,alpha:1,grav:1,drag:.5});this.ctx.audio.shellTinkle()}die(t,e,i,n){this.dead=!0,this.state="dead";const a=new e_(this.root,this.partDefs,this.ctx.world.terrain.heightAt.bind(this.ctx.world.terrain),n,t);if(a.impulse(this.root.position.clone().setY(this.root.position.y+1.2),t,e),i.add(a),this.ragdoll=a,this.weapon){const r=this.weapon;n.attach(r),this.ctx.game.enemyManager.flyingPlates.push({mesh:r,stay:!0,life:0,vel:new S(t.x*1.3+T.gauss(0,.9),2.6+T.range(0,1.2),t.z*1.3+T.gauss(0,.9)),spin:new S(T.gauss(0,7),T.gauss(0,4),T.gauss(0,7))}),this.weapon=null}return this.root.visible=!1,a}dispose(){const t=new Set,e=new Set;this.root.traverse(i=>{i.isMesh&&(i.geometry&&t.add(i.geometry),i.material&&(Array.isArray(i.material)?i.material:[i.material]).forEach(n=>e.add(n)))});for(const i of t)i.dispose();for(const i of e)i.dispose();this.scene.remove(this.root)}think(t){if(this.thinkT-=t,this.stateT+=t,this.thinkT>0)return;this.thinkT=.14+T.next()*.1;const i=this.ctx.game.player,a=kh.subVectors(i.pos,this.pos).length();switch(this.los=this.ctx.world.hasLOS(Rr.copy(this.root.position).setY(this.root.position.y+1.4),Gh.copy(i.pos).setY(i.pos.y+1.3)),this.type){case"rusher":a<2.6?(this.state=this.meleeT>0?"melee":"meleeWindup",this.state==="meleeWindup"&&this.meleeT===0&&(this.meleeT=.42)):this.state="advance";break;case"gunner":{this.pushMode||a>46||!this.coverPoint?(this.state=(a<34,"advance"),!this.coverPoint&&this.stateT>1.2&&T.next()<.5&&this._pickCover()):this.state==="advance"&&this._nearCover()&&this.los?(this.state="cover",this.stateT=0):this.state==="cover"?this.stateT>2.2+T.next()&&(this.state="peek",this.stateT=0,this.burst=T.int(4,7)):this.state==="peek"&&this.burst<=0&&this.stateT>1.4&&(this.state="cover",this.stateT=0);break}case"heavy":this.state="advance";break}this.ctx.game.playerCamping&&a>14&&this.type!=="heavy"&&T.next()<.3&&(this.flanking=!0)}_pickCover(){const t=this.ctx.world.props.coverPoints;if(!t.length)return;let e=null,i=-1e9;const n=this.ctx.game.player.pos;for(let a=0;a<12;a++){const r=t[T.next()*t.length|0],o=r.pos.distanceTo(n),l=r.pos.distanceTo(this.pos);if(o<8||o>40)continue;const h=-Math.abs(o-18)-l*.3+T.next()*6;h>i&&(i=h,e=r)}e&&(this.coverPoint=e)}_nearCover(){return this.coverPoint&&this.pos.distanceTo(this.coverPoint.pos)<1.6}update(t,e){if(this.dead)return;this.think(t);const i=e.player;this.staggerT=Math.max(0,this.staggerT-t);const n=this.staggerT>0?.35:1;let a=null,r=this.cfg.speed*n;const o=kh.subVectors(i.pos,this.pos),l=o.length();if(this.flanking?(Vh.set(-o.z,0,o.x).normalize().multiplyScalar(this.flankSide*14),a=Gh.copy(i.pos).add(Vh),l<10&&(this.flanking=!1)):this.state==="cover"||this.state==="peek"?(a=this.coverPoint.pos,r=this.state==="cover"?this.cfg.speed*1.3:0):this.state==="meleeWindup"||this.state==="melee"?(a=i.pos,r=this.state==="melee"?0:this.cfg.speed*.4):this.pushMode?(a=i.pos,r*=1.25):a=i.pos,a&&r>0)if(li.subVectors(a,this.pos).setY(0),li.length()>.6){if(li.normalize(),Hh.copy(this.pos).setY(this.pos.y+.9),this.ctx.world.raycast(Hh,li,2.2)){const v=da.set(-li.z,0,li.x).multiplyScalar(this.avoidSide??(this.avoidSide=T.sign()));li.addScaledVector(v,1.4).normalize()}this.vel.x=Ae(this.vel.x,li.x*r,6,t),this.vel.z=Ae(this.vel.z,li.z*r,6,t)}else this.vel.x=Ae(this.vel.x,0,8,t),this.vel.z=Ae(this.vel.z,0,8,t);else this.vel.x=Ae(this.vel.x,0,8,t),this.vel.z=Ae(this.vel.z,0,8,t);this.pos.x+=this.vel.x*t,this.pos.z+=this.vel.z*t;const h=34.5,c=Math.hypot(this.pos.x,this.pos.z);if(c>h){const f=h/c;this.pos.x*=f,this.pos.z*=f}this.pos.y=this.ctx.world.terrain.heightAt(this.pos.x,this.pos.z);const u=this.state==="peek"||this.state==="cover"||l<6||this.type==="heavy"?i.pos:null,d=u?li.subVectors(u,this.pos):li.set(this.vel.x,0,this.vel.z);if(d.lengthSq()>.01){let g=Math.atan2(-d.x,-d.z)-this.yaw;for(;g>Math.PI;)g-=Math.PI*2;for(;g<-Math.PI;)g+=Math.PI*2;this.yaw+=g*Math.min(1,t*7)}if(this.fireCd-=t,this.burstCd-=t,this.type==="gunner"&&this.state==="peek"&&this.los&&this.burst>0&&this.burstCd<=0&&(this._shootAtPlayer(e),this.burst--,this.burstCd=.11+T.next()*.05),this.type==="heavy"&&this.los&&l<42&&this.fireCd<=0&&(this._shootAtPlayer(e,!0),this.fireCd=.14,this._heavyBurst=(this._heavyBurst??0)+1,this._heavyBurst>8&&(this._heavyBurst=0,this.fireCd=1.6+T.next())),this.type==="rusher")if(this.meleeT>0){const f=this.meleeT;this.meleeT-=t,f>.18&&this.meleeT<=.18&&l<2.8&&e.playerHit(this.cfg.dmg,li.subVectors(i.pos,this.pos).normalize().negate()),this.meleeT<=0&&(this.meleeT=0)}else l<2.4&&this.fireCd<=0&&(this.fireCd=1.1);this.wounded&&(this.trailT-=t,this.trailT<=0&&(this.trailT=.5+T.next()*.4,this.ctx.fx.blood.trail(this.pos))),this._animate(t,l),this.root.position.copy(this.pos),this.root.rotation.y=this.yaw}_shootAtPlayer(t,e=!1){const i=t.player,n=this.muzzleWorld.clone(),a=c_.copy(i.pos).setY(i.pos.y+1.25),r=a.distanceTo(n),o=Math.hypot(i.vel.x,i.vel.z),l=(e?2.2:1.15)+o*.12+(i.crouching?-.25:0);a.x+=T.gauss(0,l*.28),a.y+=T.gauss(0,l*.16),a.z+=T.gauss(0,l*.28);const h=d_.subVectors(a,n).normalize();this.ctx.fx.tracers.spawn(n,h,r+6,.2),this.ctx.audio.enemyShot(r),this.ctx.fx.lights.flashLight(n,16763296,60,.06);const u=this.ctx.world.raycast(n,h,r+4),d=t.cameraRig.eye;Rr.subVectors(d,n);const f=Rr.dot(h),v=u_.copy(n).addScaledVector(h,f).distanceTo(d);f>0&&v<.42&&(!u||u.distance>f-.3)?t.playerHit(this.cfg.dmg+T.range(-2,3),h.clone().negate()):(v<1.6&&f>0&&f<r&&t.nearMiss(),u&&t.surfaceImpact(u,h))}_animate(t,e){const i=Math.hypot(this.vel.x,this.vel.z);this.walkPhase+=t*(2.2+i*1.9);const n=Math.sin(this.walkPhase),a=Math.sin(this.walkPhase+Math.PI),r=kt(i/this.cfg.speed,.15,1);if(this.legUL.grp.rotation.x=n*.75*r,this.legLL.grp.rotation.x=Math.max(0,-n)*.9*r,this.legUR.grp.rotation.x=a*.75*r,this.legLR.grp.rotation.x=Math.max(0,-a)*.9*r,this.torso.position.y=Math.abs(Math.sin(this.walkPhase))*.045*r,this.torso.rotation.x=.1+r*.16,this.flinch.multiplyScalar(Math.exp(-t*7)),this.torso.rotation.x+=this.flinch.z*.4,this.torso.rotation.z=-this.flinch.x*.5,this.head.rotation.z=this.flinch.x*.3,this.type==="rusher"){const c=this.meleeT>0?Math.sin((.42-this.meleeT)/.42*Math.PI):0;this.armUR.grp.rotation.x=-.5-c*2.1+a*.3*r,this.armLR.grp.rotation.x=-.3-c*.5,this.armUL.grp.rotation.x=n*.55*r,this.armLL.grp.rotation.x=-.25}else{const c=kt(Math.atan2(this.ctx.game.player.pos.y+1.2-this.pos.y-1.3,e),-.7,.7);this.armUR.grp.rotation.x=-1.35-c+Math.abs(n)*.06*r,this.armLR.grp.rotation.x=-.3,this.armUL.grp.rotation.x=-1.1-c,this.armLL.grp.rotation.x=-.55,this.armUL.grp.rotation.z=.5,this.armUR.grp.rotation.z=-.35}const o=this.ctx.game.player.pos;da.set(o.x-this.pos.x,0,o.z-this.pos.z).normalize();let h=Math.atan2(-da.x,-da.z)-this.yaw;for(;h>Math.PI;)h-=Math.PI*2;for(;h<-Math.PI;)h+=Math.PI*2;this.head.rotation.y=Ae(this.head.rotation.y,kt(h,-.65,.65),6,t)}}const Bh=new S,kh=new S,Gh=new S,Vh=new S,li=new S,Hh=new S,da=new S,c_=new S,d_=new S,Rr=new S,u_=new S;class f_{constructor(t,e){this.game=t,this.scene=e,this.enemies=[],this.ragdolls=new r_(8),this.spawnQueue=[],this.spawnTimer=0,this.wave=0,this.flyingPlates=[],this._campTimer=0,this._lastPlayerPos=new S}get aliveCount(){return this.enemies.filter(t=>!t.dead).length}startWave(t){this.wave=t;const e=Math.min(6+t*4,38),i=t>=2?Math.min(1+Math.floor(t*.9),10):0,n=t>=3?Math.min(1+Math.floor((t-2)/2),5):0,a=e-i-n,r=[];for(let o=0;o<a;o++)r.push("rusher");for(let o=0;o<i;o++)r.push("gunner");for(let o=0;o<n;o++)r.push("heavy");for(let o=r.length-1;o>0;o--){const l=T.next()*(o+1)|0;[r[o],r[l]]=[r[l],r[o]]}this.spawnQueue=r,this.spawnTimer=1.2,this.maxConcurrent=Math.min(8+t,17)}clearAll(){for(const t of this.enemies)t.dispose();this.enemies.length=0,this.ragdolls.clear(),this.spawnQueue.length=0;for(const t of this.flyingPlates)this.scene.remove(t.mesh),t.mesh.traverse?.(e=>{e.isMesh&&(e.geometry?.dispose(),e.material?.dispose?.())});this.flyingPlates.length=0}alertPush(){for(const t of this.enemies)!t.dead&&t.type!=="heavy"&&(t.pushMode=!0)}update(t){const e=this.game.player.pos;if(e.distanceTo(this._lastPlayerPos)>2.5?(this._campTimer=0,this._lastPlayerPos.copy(e)):this._campTimer+=t,this.game.playerCamping=this._campTimer>8,this.spawnQueue.length>0&&(this.spawnTimer-=t,this.spawnTimer<=0&&this.aliveCount<this.maxConcurrent)){this.spawnTimer=Math.max(.6,2.2-this.wave*.18);const i=this.spawnQueue.shift(),a=this.game.world.props.spawnPoints[T.next()*this.game.world.props.spawnPoints.length|0].clone();a.y=this.game.world.terrain.heightAt(a.x,a.z),this.enemies.push(new Rc(i,a,{scene:this.scene,world:this.game.world,game:this.game,fx:this.game.fx,audio:this.game.audio}))}for(let i=this.enemies.length-1;i>=0;i--){const n=this.enemies[i];if(n.dead&&(!n.ragdoll||!n.ragdoll.active)&&n.deadRemoved!==!0){if(n.ragdoll&&(n.ragdoll.sinkT>2||!n.ragdoll.active)){n.deadRemoved=!0,n.dispose(),this.enemies.splice(i,1);continue}if(!n.ragdoll){n.dispose(),this.enemies.splice(i,1);continue}}n.update(t,this.game)}this.ragdolls.update(t);for(let i=this.flyingPlates.length-1;i>=0;i--){const n=this.flyingPlates[i];n.life+=t,n.vel.y-=12*t,n.mesh.position.addScaledVector(n.vel,t),n.mesh.rotation.x+=n.spin.x*t,n.mesh.rotation.y+=n.spin.y*t,n.mesh.rotation.z+=n.spin.z*t;const a=this.game.world.terrain.heightAt(n.mesh.position.x,n.mesh.position.z);n.mesh.position.y<a+.05&&(n.mesh.position.y=a+.05,n.vel.multiplyScalar(.3),n.vel.y=Math.abs(n.vel.y)>1?-n.vel.y*.4:0,n.spin.multiplyScalar(.4)),n.life>(n.stay?14:5)&&(this.scene.remove(n.mesh),n.mesh.traverse?.(r=>{r.isMesh&&(r.geometry?.dispose(),r.material?.dispose?.())}),this.flyingPlates.splice(i,1))}}raycastEnemies(t,e,i=200){this.game.enemyRaycaster.set(t,e),this.game.enemyRaycaster.far=i;const n=[];for(const r of this.enemies){if(r.dead){if(r.ragdoll)for(const o of r.ragdoll.partLinks)n.push(o.mesh);continue}for(const o of r.hitMeshes)n.push(o)}if(!n.length)return null;const a=this.game.enemyRaycaster.intersectObjects(n,!1);return a.length?a[0]:null}applyExplosion(t,e){for(const i of this.enemies){if(i.dead){if(i.ragdoll){const a=i.root.position.distanceTo(t);a<e&&i.ragdoll.impulse(i.root.position.clone().setY(i.root.position.y+1),Wh.subVectors(i.root.position,t).normalize(),6*(1-a/e))}continue}const n=i.root.position.distanceTo(t);if(n<e){const a=Wh.subVectors(i.root.position,t).normalize(),r=220*(1-n/e);i.hit(r,a,"torso").killed?this.game.onEnemyKilled(i,a,5*(1-n/e),!1,"explosion"):i.staggerT=.8}}}}const Wh=new S;class p_{constructor(t){this.game=t,this.combo=0,this.comboTimer=0,this.bestCombo=0,this.overdriveT=0,this.overdriveCd=0,this.multikillCount=0,this.multikillTimer=0}onKill(){fe.real,this.comboTimer=4,this.combo++,this.bestCombo=Math.max(this.bestCombo,this.combo),this.multikillCount++,this.multikillTimer=1.2,this.multikillCount===2?this.game.hud.announce("DOUBLE KILL",1):this.multikillCount===3?this.game.hud.announce("TRIPLE KILL",2):this.multikillCount>=4&&this.game.hud.announce("RAMPAGE",3),this.multikillCount>=2&&this.game.audio.multikillSting(Math.min(this.multikillCount,4)),this.combo>=5&&this.overdriveT<=0&&this.overdriveCd<=0&&(this.overdriveT=6,this.overdriveCd=14,this.game.weapon.overdrive=!0,this.game.music.overdriveLayer=!0,this.game.audio.overdriveRiser(),this.game.hud.announce("OVERDRIVE",3,!0),fe.requestScale("overdrive",.85,1/0),this.game.hud.setOverdrive(1))}update(t){this.comboTimer>0&&(this.comboTimer-=t,this.comboTimer<=0&&(this.combo=0)),this.multikillTimer>0&&(this.multikillTimer-=t,this.multikillTimer<=0&&(this.multikillCount=0)),this.overdriveT>0&&(this.overdriveT-=t,this.game.hud.setOverdrive(Math.min(1,this.overdriveT/6)),this.overdriveT<=0&&this.endOverdrive()),this.overdriveCd>0&&this.overdriveT<=0&&(this.overdriveCd-=t)}endOverdrive(){this.overdriveT=0,fe.releaseScale("overdrive"),this.game.weapon.overdrive=!1,this.game.music.overdriveLayer=!1,this.game.hud.setOverdrive(0)}reset(){this.combo=0,this.comboTimer=0,this.multikillCount=0,this.endOverdrive(),this.overdriveCd=0}}class m_{constructor(t){this.game=t,this.active=!1,this.t=0,this.dur=1.5,this.target=new S,this._returnPose=null}start(t){this.active||(this.active=!0,this.t=0,this.target.copy(t).add(new S(0,.7,0)),this.startAngle=this.game.cameraRig.yaw+Math.PI-.55,this.radius=4.2,fe.requestScale("killcam",.3,this.dur),this.game.cameraRig.killcam=this,this.game.hud.setKillcam(!0))}update(t){if(!this.active)return;this.t+=t;const e=this.t/this.dur;if(e>=1){this.end();return}const i=this.game.cameraRig.camera,n=_n(Math.min(1,e*1.15)),a=this.startAngle+n*1.1,r=this.radius*(1-.12*Math.sin(e*Math.PI));i.position.set(this.target.x+Math.cos(a)*r,this.target.y+1.1+Math.sin(e*Math.PI*2)*.15,this.target.z+Math.sin(a)*r),i.lookAt(this.target),i.fov=75-10*Math.sin(e*Math.PI),i.updateProjectionMatrix()}end(){this.active&&(this.active=!1,fe.releaseScale("killcam"),this.game.cameraRig.killcam=null,this.game.hud.setKillcam(!1),this.game.cameraRig.addShake(.25))}}const g_=`
#hud { position: fixed; inset: 0; pointer-events: none; z-index: 20;
  font-family: 'Rajdhani', 'Segoe UI', system-ui, sans-serif; color: #dfe9f5;
  text-shadow: 0 1px 3px rgba(0,0,0,0.55); user-select: none; }
#hud.hidden { display: none; }
/* killcam: gameplay HUD dissolves, only the tag (and damage feed) stay */
#hud.cine #topbar, #hud.cine #combo, #hud.cine #overdrive, #hud.cine #ammo, #hud.cine #wswitch,
#hud.cine #health, #hud.cine #godbadge, #hud.cine #controls, #hud.cine #prompt,
#hud.cine #crosshair { opacity: 0; transition: opacity 0.18s ease; }
#hud .mono { font-family: 'SF Mono', 'Cascadia Mono', Consolas, monospace; }

/* crosshair */
#crosshair { position: absolute; left: 50%; top: 50%; width: 0; height: 0; }
#crosshair .l { position: absolute; background: rgba(235,245,255,0.9);
  box-shadow: 0 0 3px rgba(0,0,0,0.6); }
#crosshair .dot { position: absolute; width: 3px; height: 3px; border-radius: 50%;
  background: rgba(235,245,255,0.95); left: -1.5px; top: -1.5px; }

/* hit marker */
#hitmarker { position: absolute; left: 50%; top: 50%; width: 44px; height: 44px;
  margin: -22px 0 0 -22px; opacity: 0; }
#hitmarker span { position: absolute; width: 14px; height: 3px; background: #fff;
  box-shadow: 0 0 4px rgba(0,0,0,0.7); left: 15px; top: 20px; }
#hitmarker.kill span { background: #ff4633; box-shadow: 0 0 6px rgba(255,60,40,0.9); }
#hitmarker span:nth-child(1) { transform: rotate(45deg) translateX(-9px); }
#hitmarker span:nth-child(2) { transform: rotate(-45deg) translateX(-9px); }
#hitmarker span:nth-child(3) { transform: rotate(135deg) translateX(-9px); }
#hitmarker span:nth-child(4) { transform: rotate(-135deg) translateX(-9px); }

/* weapon switch strip (S1) */
#wswitch { position: absolute; right: 42px; bottom: 132px; text-align: right;
  font-size: 14px; letter-spacing: 3px; }
#wswitch span { opacity: 0.38; margin-left: 18px; transition: opacity 0.15s ease, color 0.15s ease; }
#wswitch span.on { opacity: 1; color: #ffc46b; }
#wswitch b { font-weight: 600; font-size: 12px; opacity: 0.5; }

/* ammo */
#ammo { position: absolute; right: 42px; bottom: 34px; text-align: right; }
#ammo .count { font-size: 64px; font-weight: 700; line-height: 0.9;
  letter-spacing: 1px; display: inline-block; }
#ammo .reserve { font-size: 30px; opacity: 0.75; margin-left: 8px; }
#ammo .label { font-size: 13px; letter-spacing: 4px; opacity: 0.6; }
#ammo.low .count { color: #ff5a45; }
#ammo .reloadbar { height: 3px; background: rgba(255,255,255,0.18); margin-top: 6px;
  border-radius: 2px; overflow: hidden; opacity: 0; }
#ammo .reloadbar i { display: block; height: 100%; width: 0%; background: #ffc46b; }

/* health */
#health { position: absolute; left: 42px; bottom: 38px; width: 300px; }
#health .bar { height: 10px; background: rgba(10,16,26,0.55); border-radius: 3px;
  border: 1px solid rgba(180,200,230,0.25); overflow: hidden; }
#health .fill { height: 100%; width: 100%; background: linear-gradient(90deg,#67d89a,#9fe8b8);
  border-radius: 2px; transform-origin: left; }
#health.lowhp .fill { background: linear-gradient(90deg,#c23b2e,#ff7a5e); }
#health .hpnum { font-size: 15px; letter-spacing: 2px; opacity: 0.75; margin-bottom: 4px; }
#health.god .fill { background: linear-gradient(90deg,#e8c467,#fff0b8); }
#godbadge { position: absolute; left: 42px; bottom: 76px; font-size: 12px; letter-spacing: 3px;
  color: #ffe9a8; border: 1px solid rgba(255,233,168,0.5); padding: 3px 8px; border-radius: 3px;
  background: rgba(30,24,10,0.4); display: none; }

/* top center: wave + score */
#topbar { position: absolute; top: 26px; left: 50%; transform: translateX(-50%);
  text-align: center; }
#wave { font-size: 22px; letter-spacing: 6px; font-weight: 600; }
#score { font-size: 30px; font-weight: 700; letter-spacing: 2px; }
#enemiesleft { font-size: 13px; letter-spacing: 3px; opacity: 0.65; margin-top: 2px; }

/* combo */
#combo { position: absolute; right: 42px; top: 120px; text-align: right; opacity: 0; }
#combo .num { font-size: 46px; font-weight: 700; color: #ffc46b;
  text-shadow: 0 0 18px rgba(255,180,80,0.45); }
#combo .lbl { font-size: 13px; letter-spacing: 4px; opacity: 0.8; }
#combo .pips { display: flex; gap: 4px; justify-content: flex-end; margin-top: 4px; }
#combo .pips i { width: 16px; height: 4px; background: rgba(255,196,107,0.25); border-radius: 2px; }
#combo .pips i.on { background: #ffc46b; box-shadow: 0 0 8px rgba(255,196,107,0.7); }

/* overdrive */
#overdrive { position: absolute; left: 50%; bottom: 120px; transform: translateX(-50%);
  text-align: center; opacity: 0; }
#overdrive .lbl { font-size: 26px; letter-spacing: 10px; font-weight: 700; color: #ffb054;
  text-shadow: 0 0 24px rgba(255,150,60,0.8); }
#overdrive .bar { width: 260px; height: 5px; background: rgba(255,160,80,0.2);
  border-radius: 3px; margin: 8px auto 0; overflow: hidden; }
#overdrive .bar i { display: block; height: 100%; background: linear-gradient(90deg,#ff7a2e,#ffd08e); }

/* kill feed */
#killfeed { position: absolute; right: 42px; top: 200px; text-align: right; }
#killfeed .entry { font-size: 15px; letter-spacing: 1px; margin-bottom: 6px;
  background: rgba(8,14,24,0.45); padding: 4px 10px; border-radius: 3px;
  border-right: 3px solid #67d89a; transform: translateX(40px); opacity: 0;
  transition: transform 0.28s cubic-bezier(0.2,1.6,0.4,1), opacity 0.28s ease-out; }
#killfeed .entry.show { transform: translateX(0); opacity: 1; }
#killfeed .entry.fade { opacity: 0; transform: translateX(20px); transition: all 0.5s ease-in; }
#killfeed .entry .hs { color: #ffcf6b; }
#killfeed .entry .pts { color: #9fe8b8; }

/* announcements */
#announce { position: absolute; left: 50%; top: 30%; transform: translate(-50%,-50%);
  text-align: center; }
#announce .big { font-size: 54px; font-weight: 700; letter-spacing: 12px; opacity: 0; }
#announce .big.od { color: #ffb054; text-shadow: 0 0 30px rgba(255,150,60,0.9); }

/* wave banner */
#wavebanner { position: absolute; left: 0; right: 0; top: 38%; text-align: center; opacity: 0; }
#wavebanner .w1 { font-size: 20px; letter-spacing: 14px; opacity: 0.8; }
#wavebanner .w2 { font-size: 74px; font-weight: 700; letter-spacing: 18px;
  text-shadow: 0 4px 24px rgba(0,0,0,0.6); }

/* damage direction arcs */
#dmgdir { position: absolute; left: 50%; top: 50%; width: 0; height: 0; }
#dmgdir .arc { position: absolute; left: -90px; top: -90px; width: 180px; height: 180px;
  border-radius: 50%; border: 4px solid transparent; border-top-color: rgba(255,50,35,0.9);
  opacity: 0; }

/* damage numbers */
.dmgnum { position: absolute; font-size: 20px; font-weight: 700; color: #ffe9c9;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8); transform: translate(-50%,-50%); white-space: nowrap; }
.dmgnum.hs { color: #ffcf6b; font-size: 24px; }
.dmgnum.crit { color: #ff8a5e; }

/* prompts */
#prompt { position: absolute; left: 50%; top: 62%; transform: translateX(-50%);
  font-size: 16px; letter-spacing: 3px; opacity: 0; transition: opacity 0.25s ease-out; }
#prompt .key { display: inline-block; border: 1px solid rgba(220,235,255,0.5);
  border-radius: 4px; padding: 1px 7px; margin-right: 8px; font-size: 14px; }

/* controls card */
#controls { position: absolute; left: 42px; top: 90px; font-size: 14px; letter-spacing: 1px;
  background: rgba(8,14,24,0.5); border: 1px solid rgba(150,180,220,0.2); border-radius: 6px;
  padding: 14px 18px; line-height: 1.75; transition: opacity 0.6s ease, transform 0.6s ease; }
#controls.hidden { opacity: 0; transform: translateX(-30px); pointer-events: none; }
#controls .k { color: #ffc46b; }
#killcamtag { position: absolute; left: 50%; bottom: 60px; transform: translateX(-50%);
  letter-spacing: 6px; font-size: 15px; opacity: 0; transition: opacity 0.3s; }
`;class v_{constructor(){const t=document.createElement("style");t.textContent=g_,document.head.appendChild(t),this.el=document.createElement("div"),this.el.id="hud",this.el.innerHTML=`
      <div id="crosshair"></div>
      <div id="hitmarker"><span></span><span></span><span></span><span></span></div>
      <div id="topbar"><div id="wave">WAVE 1</div><div id="score">0</div><div id="enemiesleft"></div></div>
      <div id="combo"><div class="num">×2</div><div class="lbl">COMBO</div><div class="pips">${"<i></i>".repeat(5)}</div></div>
      <div id="overdrive"><div class="lbl">OVERDRIVE</div><div class="bar"><i></i></div></div>
      <div id="wswitch"><b>1</b> CARBINE&nbsp;&nbsp;<b>2</b> SHOTGUN</div>
      <div id="ammo">
        <div><span class="count">30</span><span class="reserve">∞</span></div>
        <div class="label">5.56 // RESERVE ∞</div>
        <div class="reloadbar"><i></i></div>
      </div>
      <div id="health"><div class="hpnum">100</div><div class="bar"><div class="fill"></div></div></div>
      <div id="godbadge">GOD MODE</div>
      <div id="killfeed"></div>
      <div id="announce"><div class="big"></div></div>
      <div id="wavebanner"><div class="w1">INCOMING</div><div class="w2">WAVE 1</div></div>
      <div id="dmgdir"></div>
      <div id="prompt"><span class="key">SPACE</span>MANTLE</div>
      <div id="controls">
        <div><span class="k">WASD</span> move · <span class="k">SHIFT</span> sprint · <span class="k">2×SHIFT</span> tac-sprint</div>
        <div><span class="k">CTRL</span> slide / crouch · <span class="k">SPACE</span> jump / mantle</div>
        <div><span class="k">LMB</span> fire · <span class="k">RMB</span> ADS · <span class="k">R</span> reload · <span class="k">I</span> inspect</div>
        <div><span class="k">1</span> carbine · <span class="k">2</span> shotgun</div>
        <div><span class="k">Q/E</span> lean · <span class="k">T</span> ADS self-test · <span class="k">\`</span> debug</div>
      </div>
      <div id="killcamtag">KILLCAM</div>
    `,document.body.appendChild(this.el),this.$=e=>this.el.querySelector(e),this.crossLines=[],this._buildCrosshair(),this._ammoSpring={v:1,vel:0},this._dmgNums=[],this._arcs=[],this._announceT=0,this._bannerT=0,this._promptT=0,this._hitT=0,this._v3=new S,this.hpShown=1}_buildCrosshair(){const t=this.$("#crosshair");for(let i=0;i<4;i++){const n=document.createElement("div");n.className="l",t.appendChild(n),this.crossLines.push(n)}const e=document.createElement("div");e.className="dot",t.appendChild(e),this.dot=e}setCrosshair(t,e,i){const n=kt(t,6,46),a=9-e*4,r=2-e*.8,o=(1-e)*(i?1:.92);this.el.style.setProperty("--xo",o);const l=this.crossLines;l[0].style.cssText=`width:${r}px;height:${a}px;left:${-r/2}px;top:${-n-a}px;opacity:${o}`,l[1].style.cssText=`width:${r}px;height:${a}px;left:${-r/2}px;top:${n}px;opacity:${o}`,l[2].style.cssText=`width:${a}px;height:${r}px;left:${-n-a}px;top:${-r/2}px;opacity:${o}`,l[3].style.cssText=`width:${a}px;height:${r}px;left:${n}px;top:${-r/2}px;opacity:${o}`,this.dot.style.opacity=o*.9}setAmmo(t,e,i,n,a){this.$("#ammo .count").textContent=t;const r=t<=Math.ceil(e*.25);this.$("#ammo").classList.toggle("low",r),a&&(this.$("#ammo .label").textContent=a);const o=this.$("#ammo .reloadbar");o.style.opacity=i?1:0,o.firstElementChild.style.width=`${(n*100).toFixed(1)}%`}setWeapon(t){if(this._wkind===t)return;this._wkind=t;const e=this.$("#wswitch");e.innerHTML=t==="shotgun"?'<b>1</b> CARBINE&nbsp;&nbsp;<span class="on"><b>2</b> SHOTGUN</span>':'<span class="on"><b>1</b> CARBINE</span>&nbsp;&nbsp;<b>2</b> SHOTGUN'}ammoPop(){this._ammoSpring.vel+=5.5}punchAmmo(t){const e=this._ammoSpring,i=-(e.v-1)*380-e.vel*16;e.vel+=i*t,e.v+=e.vel*t,this.$("#ammo .count").style.transform=`scale(${e.v.toFixed(3)})`}setHealth(t,e,i){const n=kt(t/e,0,1);this.hpShown=Ae(this.hpShown,i?1:n,8,fe.dtReal),this.$("#health .fill").style.width=`${(this.hpShown*100).toFixed(1)}%`,this.$("#health .hpnum").textContent=i?"LOCKED":`${Math.ceil(Math.max(0,t))}`,this.$("#health").classList.toggle("lowhp",!i&&t<35),this.$("#health").classList.toggle("god",i),this.$("#godbadge").style.display=i?"block":"none"}setWave(t,e){this.$("#wave").textContent=`WAVE ${t}`,this.$("#enemiesleft").textContent=e>0?`${e} HOSTILES`:"CLEAR"}setScore(t){this.$("#score").textContent=t.toLocaleString()}setCombo(t,e){const i=this.$("#combo");t>=2?(i.style.opacity=1,i.querySelector(".num").textContent=`×${t}`,i.querySelector(".num").style.transform=`scale(${(1+.35*_r(kt(e/4,0,1)*.3+.7)).toFixed(3)})`,i.querySelectorAll(".pips i").forEach((a,r)=>a.classList.toggle("on",r<Math.min(t,5)))):i.style.opacity=0}setOverdrive(t){const e=this.$("#overdrive");e.style.opacity=t>0?1:0,e.querySelector(".bar i").style.width=`${(t*100).toFixed(1)}%`}hitMarker(t){this._hitT=t?.3:.18,this.$("#hitmarker").classList.toggle("kill",t)}killFeed(t,e,i){const n=this.$("#killfeed"),a=document.createElement("div");for(a.className="entry",a.innerHTML=`${t.toUpperCase()}<span class="hs">${e?" ⌖ HEADSHOT":""}</span> <span class="pts">+${i}</span>`,n.appendChild(a),requestAnimationFrame(()=>a.classList.add("show"));n.children.length>5;)n.removeChild(n.firstChild);setTimeout(()=>{a.classList.add("fade"),setTimeout(()=>a.remove(),600)},3400)}announce(t,e=1,i=!1){const n=this.$("#announce .big");n.textContent=t,n.className=`big${i?" od":""}`,n.style.fontSize=`${44+e*9}px`,this._announceT=1.6}waveBanner(t){this.$("#wavebanner .w2").textContent=`WAVE ${t}`,this._bannerT=2.4}damageNumber(t,e,i,n){this._dmgNums.length>24&&this._dmgNums.shift().el.remove();const a=document.createElement("div");a.className=`dmgnum${i?" hs":""}`,a.textContent=i?`${e} ⌖`:`${e}`,this.el.appendChild(a);const r={el:a,pos:t.clone(),vy:60+Math.random()*30,t:0,dur:.9,offx:(Math.random()-.5)*40};this._dmgNums.push(r)}damageDirection(t,e){const n=Math.atan2(-t.x,-t.z)-e,a=document.createElement("div");for(a.className="arc",a.style.transform=`rotate(${(-n*180/Math.PI).toFixed(1)}deg)`,this.$("#dmgdir").appendChild(a),this._arcs.push({el:a,t:0}),requestAnimationFrame(()=>{a.style.opacity="1"});this._arcs.length>6;)this._arcs.shift().el.remove()}prompt(t){const e=this.$("#prompt");t&&(e.innerHTML=`<span class="key">${t.key}</span>${t.label}`,e.style.opacity=1,this._promptT=.4)}hideControls(){this.$("#controls").classList.add("hidden")}setVisible(t){this.el.classList.toggle("hidden",!t)}setKillcam(t){this.$("#killcamtag").style.opacity=t?1:0,this.el.classList.toggle("cine",t)}update(t,e,i,n){const r=i.currentSpread()*(180/Math.PI)*14;if(this.setCrosshair(r,i.adsAmount,Math.hypot(n.vel.x,n.vel.z)>.5),this.punchAmmo(t),this._hitT>0){this._hitT-=t;const o=this.$("#hitmarker");o.style.opacity=kt(this._hitT*6,0,1),o.style.transform=`scale(${1+(.3-Math.min(.3,this._hitT))})`}else this.$("#hitmarker").style.opacity=0;if(this._announceT>0){this._announceT-=t;const o=this.$("#announce .big"),l=kt((1.6-this._announceT)/.22,0,1),h=_r(l),c=kt(this._announceT/.4,0,1);o.style.opacity=c,o.style.transform=`scale(${(.6+.4*h).toFixed(3)})`}else this.$("#announce .big").style.opacity=0;if(this._bannerT>0){this._bannerT-=t;const o=this.$("#wavebanner"),l=kt((2.4-this._bannerT)/.3,0,1),h=_r(l),c=kt(this._bannerT/.5,0,1);o.style.opacity=c,o.style.transform=`scale(${(.7+.3*h).toFixed(3)})`}else this.$("#wavebanner").style.opacity=0;for(let o=this._dmgNums.length-1;o>=0;o--){const l=this._dmgNums[o];if(l.t+=t,l.t>=l.dur){l.el.remove(),this._dmgNums.splice(o,1);continue}if(this._v3.copy(l.pos),this._v3.y+=.25+ci(l.t/l.dur)*.6,this._v3.project(e),this._v3.z>1){l.el.style.opacity=0;continue}const h=(this._v3.x*.5+.5)*window.innerWidth+l.offx,c=(-this._v3.y*.5+.5)*window.innerHeight-l.vy*(l.t/l.dur),u=l.t/l.dur;l.el.style.left=`${h.toFixed(0)}px`,l.el.style.top=`${c.toFixed(0)}px`,l.el.style.opacity=(1-ci(u)).toFixed(2),l.el.style.transform=`translate(-50%,-50%) scale(${(1.25-.25*ci(Math.min(1,u*3))).toFixed(2)})`}for(let o=this._arcs.length-1;o>=0;o--){const l=this._arcs[o];if(l.t+=t,l.t>1.1){l.el.remove(),this._arcs.splice(o,1);continue}l.el.style.opacity=kt(1.3-l.t,0,1)}this._promptT>0&&(this._promptT-=t,this._promptT<=0&&(this.$("#prompt").style.opacity=0))}}const __=`
.screen { position: fixed; inset: 0; z-index: 50; display: flex; flex-direction: column;
  align-items: center; justify-content: center; pointer-events: auto;
  font-family: 'Rajdhani', 'Segoe UI', system-ui, sans-serif; color: #e8f0fa;
  background: radial-gradient(ellipse at 50% 40%, rgba(10,18,34,0.62), rgba(4,8,16,0.88));
  backdrop-filter: blur(3px); transition: opacity 0.45s ease; }
.screen.hidden { opacity: 0; pointer-events: none; }
.screen h1 { font-size: 74px; letter-spacing: 26px; margin: 0 0 6px; font-weight: 700;
  text-shadow: 0 0 40px rgba(110,190,255,0.35), 0 4px 18px rgba(0,0,0,0.8); }
.screen .sub { letter-spacing: 10px; font-size: 15px; opacity: 0.65; margin-bottom: 44px; }
.btn { font-family: inherit; font-size: 22px; letter-spacing: 8px; padding: 14px 52px;
  background: linear-gradient(180deg, rgba(120,190,255,0.16), rgba(120,190,255,0.05));
  color: #eaf4ff; border: 1px solid rgba(150,200,255,0.45); border-radius: 4px;
  cursor: pointer; transition: all 0.18s ease-out; text-transform: uppercase; }
.btn:hover { background: rgba(140,205,255,0.28); transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 30px rgba(90,170,255,0.25); }
.btn:active { transform: translateY(0) scale(0.98); }
.btn.god.on { background: linear-gradient(180deg, rgba(255,210,110,0.25), rgba(255,210,110,0.08));
  border-color: rgba(255,220,140,0.6); color: #ffedbe; }
.togglerow { margin-top: 20px; display: flex; gap: 14px; }
.screen .hint { margin-top: 30px; font-size: 13px; letter-spacing: 3px; opacity: 0.45; }
.screen .stats { display: flex; gap: 46px; margin: 26px 0 40px; }
.screen .stat { text-align: center; }
.screen .stat .v { font-size: 40px; font-weight: 700; color: #ffc46b; }
.screen .stat .k { font-size: 12px; letter-spacing: 3px; opacity: 0.6; }
#deathscreen h1 { color: #ff6a55; text-shadow: 0 0 50px rgba(255,80,60,0.5); }
#tally { position: fixed; left: 50%; top: 50%; transform: translate(-50%,-50%); z-index: 40;
  pointer-events: none; font-family: 'Rajdhani', system-ui, sans-serif; color: #e8f0fa;
  background: rgba(8,14,26,0.72); border: 1px solid rgba(150,200,255,0.25); border-radius: 8px;
  padding: 26px 44px; opacity: 0; text-align: center; }
#tally.show { animation: tallyIn 0.5s cubic-bezier(0.2,1.5,0.4,1) forwards; }
#tally.hide { animation: tallyOut 0.4s ease-in forwards; }
@keyframes tallyIn { from { opacity: 0; transform: translate(-50%,-42%) scale(0.85); }
  to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
@keyframes tallyOut { from { opacity: 1; } to { opacity: 0; transform: translate(-50%,-56%); } }
#tally .title { letter-spacing: 8px; font-size: 15px; opacity: 0.7; margin-bottom: 16px; }
#tally .row { display: flex; justify-content: space-between; gap: 60px; font-size: 18px;
  letter-spacing: 1px; margin: 7px 0; }
#tally .row b { color: #ffc46b; }
`;class x_{constructor(t,e){const i=document.createElement("style");i.textContent=__,document.head.appendChild(i),this.start=document.createElement("div"),this.start.className="screen",this.start.id="startscreen",this.start.innerHTML=`
      <h1>WHITEOUT</h1>
      <div class="sub">PROTOCOL // ARCTIC RESEARCH STATION</div>
      <button class="btn" id="startbtn">START</button>
      <div class="togglerow"><button class="btn god" id="godbtn">GOD MODE: OFF</button></div>
      <div class="hint">MOUSE + KEYBOARD · HEADPHONES RECOMMENDED</div>
    `,document.body.appendChild(this.start),this.death=document.createElement("div"),this.death.className="screen hidden",this.death.id="deathscreen",this.death.innerHTML=`
      <h1>K.I.A.</h1>
      <div class="sub" id="deathstats"></div>
      <button class="btn" id="restartbtn">REDEPLOY</button>
    `,document.body.appendChild(this.death),this.tally=document.createElement("div"),this.tally.id="tally",document.body.appendChild(this.tally),this.godMode=!1,this.start.querySelector("#godbtn").addEventListener("click",()=>{this.godMode=!this.godMode;const n=this.start.querySelector("#godbtn");n.textContent=`GOD MODE: ${this.godMode?"ON":"OFF"}`,n.classList.toggle("on",this.godMode)}),this.start.querySelector("#startbtn").addEventListener("click",()=>{this.start.classList.add("hidden"),t(this.godMode)}),this.death.querySelector("#restartbtn").addEventListener("click",()=>{this.death.classList.add("hidden"),this.start.classList.remove("hidden"),e()})}showDeath(t,e,i){this.death.querySelector("#deathstats").textContent=`WAVE ${t} · ${i} KILLS · ${e.toLocaleString()} PTS`,this.death.classList.remove("hidden")}showTally(t){this.tally.innerHTML=`
      <div class="title">WAVE ${t.wave} COMPLETE</div>
      <div class="row"><span>ACCURACY</span><b>${t.accuracy.toFixed(0)}%</b></div>
      <div class="row"><span>HEADSHOTS</span><b>${t.headshotPct.toFixed(0)}%</b></div>
      <div class="row"><span>BEST COMBO</span><b>×${t.bestCombo}</b></div>
      <div class="row"><span>WAVE SCORE</span><b>+${t.waveScore.toLocaleString()}</b></div>
    `,this.tally.classList.remove("hide"),this.tally.classList.add("show"),clearTimeout(this._t),this._t=setTimeout(()=>{this.tally.classList.remove("show"),this.tally.classList.add("hide")},3800)}}class y_{constructor(t,e){this.renderer=t,this.game=e,this.visible=!1,this.frames=0,this.acc=0,this.fps=0,this.ms=0,this.el=document.createElement("div"),this.el.id="debug",this.el.style.cssText=`position: fixed; left: 12px; bottom: 12px; z-index: 60;
      font: 12px/1.65 'SF Mono', Consolas, monospace; color: #9fd8b8;
      background: rgba(4,10,18,0.72); padding: 10px 14px; border-radius: 6px;
      border: 1px solid rgba(120,220,160,0.25); display: none; white-space: pre;
      pointer-events: none;`,document.body.appendChild(this.el),this._lines=[]}toggle(){this.visible=!this.visible,this.el.style.display=this.visible?"block":"none"}frame(t){this.frames++,this.acc+=t,this.acc>=500&&(this.fps=Math.round(this.frames*1e3/this.acc),this.ms=this.acc/this.frames,this.frames=0,this.acc=0)}update(){if(!this.visible||this.frames%2)return;const t=this.game,e=this.renderer.renderer.info,i=[`WHITEOUT PROTOCOL — debug (quality: ${this.renderer.quality})`,`fps ${this.fps.toString().padStart(3)} · frame ${this.ms.toFixed(2)}ms · draws ${e.render.calls} · tris ${(e.render.triangles/1e3).toFixed(0)}k`,`particles add ${t.particlesAdd?.activeCount??0}/${t.particlesAdd?.capacity??0} · alpha ${t.particlesAlpha?.activeCount??0}/${t.particlesAlpha?.capacity??0}`,`snow ${t.world?.weather.mat.uniforms?"gpu":"-"} · tracers ${t.tracers?.activeCount??0} · shells ${t.shells?.activeCount??0}`,`decals ${t.decals?.layers.hole.used??0}/${t.decals?.layers.hole.cap} holes · ${t.decals?.layers.blood.used??0}/${t.decals?.layers.blood.cap} blood`,`ragdolls ${t.enemyManager?.ragdolls.activeCount??0} · ai ${t.enemyManager?.aliveCount??0} · queue ${t.enemyManager?.spawnQueue.length??0}`,`dmgnums ${t.hud?._dmgNums.length??0} · timeScale ${t.clock.scale.toFixed(2)}`,`PRNG seed 0xC0DA · wave ${t.enemyManager?.wave??0} · score ${t.score??0}`,`pos ${t.player?.pos.x.toFixed(1)??0} ${t.player?.pos.y.toFixed(1)??0} ${t.player?.pos.z.toFixed(1)??0}`];this.el.textContent=i.join(`
`)}}const M_=8,ua=2;class w_{constructor(t){this.game=t,this._v=new S,this._v2=new S,this._pose={position:new S,quaternion:new xe}}run(){const t=[75,65,55],e=this.game.renderer.vmCamera,i=e.fov;let n=!0;const a=["[SELFTEST] ADS verification — seed rig, no pointer lock needed"],r=[{kind:"rifle",tag:"rifle   ",midPump:!1},{kind:"shotgun",tag:"shotgun",midPump:!1},{kind:"shotgun",tag:"shotgun",midPump:!0}];for(const o of r)for(const l of t){const h=this.checkRayAlignment(l),c=this.checkSightProjection(l,o.kind,o.midPump),u=this.checkClearance(l,o.kind,o.midPump),d=h.pass&&c.pass&&u.pass;n&&=d,a.push(`[SELFTEST] ${o.tag}${o.midPump?" mid-pump":"         "} FOV ${l} — ${d?"PASS":"FAIL"} · ray±${h.err.toFixed(2)}px ${h.pass?"ok":"FAIL"} · sight±${c.err.toFixed(2)}px ${c.pass?"ok":"FAIL"} · clearance min ${u.minDeg.toFixed(2)}° ${u.pass?"ok":"FAIL ("+u.worst+")"}`)}this._restoreWeapon(),e.fov=i,e.updateProjectionMatrix(),a.push(`[SELFTEST] ${n?"✅ ALL PASS":"❌ FAILURES PRESENT"} (ray alignment / sight projection / sight-line clearance × both weapons × FOV 75/65/55, shotgun incl. mid-pump)`);for(const o of a)console.log(o);return this.game.hud.announce(n?"ADS CHECK: PASS":"ADS CHECK: FAIL",1),n}_selectWeapon(t){const e=this.game.weapon;this._visSaved||(this._visSaved={rifle:e.rifle.root.visible,shotgun:e.shotgun.root.visible,kind:e.kind,forendZ:e.shotgun.forend.position.z},e.rifle.root.visible=t==="rifle",e.shotgun.root.visible=t==="shotgun",e.kind=t,this._pose.adsPose=e.adsPoses[t])}_restoreWeapon(){if(!this._visSaved)return;const t=this.game.weapon,e=this._visSaved;t.rifle.root.visible=e.rifle,t.shotgun.root.visible=e.shotgun,t.kind=e.kind,t.shotgun.forend.position.z=e.forendZ,this._visSaved=null}_setupAds(t,e="rifle",i=!1){const n=this.game,a=n.renderer.vmCamera;a.fov=t,a.updateProjectionMatrix(),this._selectWeapon(e),i&&(n.weapon.shotgun.forend.position.z=n.weapon.shotgun.forendHome.z+.092),Ac(this._pose.adsPose,1,this._pose),n.weapon.rig.position.copy(this._pose.position),n.weapon.rig.quaternion.copy(this._pose.quaternion),n.renderer.vmScene.updateMatrixWorld(!0)}checkRayAlignment(t){const e=this.game,i=e.cameraRig;this._cam||(this._cam=new We);const n=this._cam;n.fov=t,n.aspect=e.renderer.worldCamera.aspect,n.near=.05,n.far=700,n.position.copy(i.eye),n.quaternion.setFromEuler(new ze(i.pitch,i.yaw,0,"YXZ")),n.updateProjectionMatrix(),n.updateMatrixWorld(!0),n.matrixWorldInverse.copy(n.matrixWorld).invert();const a=this._v.set(0,0,-1).applyQuaternion(n.quaternion),r=e.world.raycast(i.eye,a,300),o=r?r.distance:250,l=this._v2.copy(i.eye).addScaledVector(a,o).project(n),h=Math.hypot(l.x,l.y)*.5*window.innerWidth;return{pass:h<=ua,err:h}}checkSightProjection(t,e="rifle",i=!1){const n=this.game;this._setupAds(t,e,i);const a=n.renderer.vmCamera,r=n.weapon.model.anchors.rearSightAnchor.getWorldPosition(new S),o=n.weapon.model.anchors.frontSightAnchor.getWorldPosition(new S),l=r.clone().project(a),h=o.clone().project(a),c=.5*window.innerWidth,u=Math.hypot(l.x,l.y)*c,d=Math.hypot(h.x,h.y)*c,f=Math.hypot(l.x-h.x,l.y-h.y)*c,g=Math.max(u,d,f*.5);return{pass:u<=ua&&d<=ua&&f<=ua,err:g}}checkClearance(t,e="rifle",i=!1){const n=this.game;this._setupAds(t,e,i);const a=n.weapon.model,o=-a.anchors.rearSightAnchor.getWorldPosition(new S).z;let l=1/0,h="none",c=-1/0;const u=new S;a.root.traverse(g=>{if(!g.isMesh||g.material.transparent||g.userData.isAimPoint)return;const v=g.geometry.attributes.position;if(v)for(let p=0;p<v.count;p++){if(u.fromBufferAttribute(v,p).applyMatrix4(g.matrixWorld),u.z>c&&(c=u.z),u.z>=0)continue;const m=-u.z;if(m>=o)continue;const b=Math.hypot(u.x,u.y)/m;b<l&&(l=b,h=g.name||g.parent?.name||"part")}});const d=Math.atan(l===1/0?1/0:l)*180/Math.PI;return{pass:d>=M_&&c>0,minDeg:l===1/0?90:d,worst:h}}}class S_{constructor(){this.state="menu",this.godMode=!1,this.renderer=new Dg(document.getElementById("app")),this.world=new av(this.renderer.worldScene,"high"),this.particlesAdd=new yh(this.renderer.worldScene,{capacity:768,additive:!0}),this.particlesAlpha=new yh(this.renderer.worldScene,{capacity:1600,additive:!1});for(const t of[this.particlesAdd,this.particlesAlpha])t.groundFn=(e,i)=>this.world.terrain.heightAt(e,i);this.decals=new cv(this.renderer.worldScene),this.blood=new _v(this.particlesAlpha,this.decals,this.world.terrain.heightAt.bind(this.world.terrain)),this.tracers=new Sv(this.renderer.worldScene,64),this.audio=new Cv,this.music=new Pv(this.audio),this.shells=new bv(this.renderer.worldScene,(t,e)=>this.world.terrain.heightAt(t,e),this.particlesAlpha,this.audio,28),this.player=new Iv(this.world,null,this._playerEvents()),this.cameraRig=new Nv(this.renderer.worldCamera,null,this.player),this.explosions=new Rv(this.renderer.worldScene,this.particlesAdd,this.particlesAlpha,this.decals,this.world.lights,this.world.weather,this.audio,this.cameraRig,this.renderer.grade),this.weapon=new jv(this.renderer.vmScene,this.audio,{cameraRig:this.cameraRig,player:this.player,world:this.world,fireBullet:t=>this.fireBullet(t),firePellets:t=>this.firePellets(t),onShotFX:t=>this.muzzleFX(t),onPumpShell:()=>this.pumpShellEject()}),this._initVmLights(),this.enemyManager=new f_(this,this.renderer.worldScene),this.enemyRaycaster=new Zo,this.fx={particlesAdd:this.particlesAdd,particlesAlpha:this.particlesAlpha,decals:this.decals,blood:this.blood,tracers:this.tracers,lights:this.world.lights,explosions:this.explosions,flyingPlates:this.enemyManager.flyingPlates},this.streak=new p_(this),this.killcam=new m_(this),this.hud=new v_,this.hud.setVisible(!1),this.screens=new x_(t=>this.startMatch(t),()=>this.resetToMenu()),this.debug=new y_(this.renderer,this),this.selftest=new w_(this),this.score=0,this.kills=0,this.shotsFired=0,this.shotsHit=0,this.headshots=0,this.waveScore=0,this.hp=100,this.maxHp=100,this.regenDelay=0,this._heartbeatT=0,this._promptT=0,this._waveBreather=0,this._lastKillWasWaveEnd=!1,this._setupInput(),this._setupPause(),this._initWeaponFX(),this.clock=fe,this._raf=null,this._warmupRareShaders()}_warmupRareShaders(){const t=T.s,e=this.renderer.worldScene,i=this.renderer.worldCamera,n=i.position.clone(),a=i.quaternion.clone();try{const r=["rusher","gunner","heavy"],o=[new S(2,0,6),new S(-2,0,6),new S(0,0,8)];for(let h=0;h<r.length;h++){const c=new Rc(r[h],o[h],{scene:e,world:this.world,game:this,fx:this.fx,audio:this.audio});this.enemyManager.enemies.push(c),c.die(new S(0,.3,1),1,this.enemyManager.ragdolls,e)}this.weapon.fire(),this.weapon._stash.rifle=this.weapon._snapshotState(),this.weapon._applyKind("shotgun"),this.weapon.fire(),this.weapon.pump.cancel(),this.weapon.pump.resetMeshes(),this.weapon._applyKind("rifle"),this.weapon._stash.rifle=null,this.weapon._stash.shotgun=null,this._flashT=0,this.vmFlash.visible=!1,this.vmMuzzle.intensity=0;for(const h of this.explosions.fireballs)h.visible=!0,h.position.set(0,1.2,7),h.material.uniforms.uProgress.value=.35;for(const h of this.explosions.rings)h.visible=!0,h.position.set(0,.2,7),h.material.uniforms.uProgress.value=.35;i.position.set(o[0].x,2.5,o[0].z+9),i.lookAt(0,1,7);const l=this.world.lights.dynamicPool;for(let h=0;h<=l.length;h++){for(let c=0;c<l.length;c++)l[c].light.visible=c<h,c<h&&(l[c].light.intensity=.01);this.renderer.render()}this.renderer.render()}finally{i.position.copy(n),i.quaternion.copy(a);for(const r of this.world.lights.dynamicPool)r.light.visible=!1,r.light.intensity=0,r.life=0;for(const r of this.explosions.fireballs)r.visible=!1;for(const r of this.explosions.rings)r.visible=!1;this.explosions.active.length=0,this.enemyManager.clearAll(),this.decals.clearBlood(),T.s=t}}_playerEvents(){return{footstep:(t,e)=>this.audio.footstep(t,e),slideStart:()=>this.audio.slideLoop(!0),jump:()=>this.audio.jump(),land:t=>{this.audio.land(t),this.cameraRig.land(t),this.landFX(t)},mantle:()=>{this.audio.mantle(),this.cameraRig.addShake(.18)}}}_setupInput(){this.input=null}_setupPause(){this.pauseOverlay=document.createElement("div"),this.pauseOverlay.style.cssText=`position: fixed; inset: 0; z-index: 40; display: none;
      align-items: center; justify-content: center; flex-direction: column; gap: 18px;
      background: rgba(4,8,16,0.72); color: #e8f0fa; font-family: system-ui; cursor: pointer;
      letter-spacing: 6px; font-size: 22px;`,this.pauseOverlay.innerHTML=`<div>PAUSED</div>
      <div style="font-size:13px;letter-spacing:3px;opacity:0.6">CLICK TO RESUME · ESC TO RELEASE MOUSE</div>`,document.body.appendChild(this.pauseOverlay),this.pauseOverlay.addEventListener("click",()=>this.resume()),document.addEventListener("visibilitychange",()=>{document.hidden&&this.state==="playing"&&this.pause()})}_initVmLights(){const t=this.renderer.vmScene;this.vmHemi=new fc(5927592,10335448,1.15),t.add(this.vmHemi),this.vmKey=new ws(10466536,2.4),this.vmKey.position.set(-.5,.9,-.4),t.add(this.vmKey),this.vmWarm=new ws(16763274,.5),this.vmWarm.position.set(.7,-.2,.3),t.add(this.vmWarm),this.vmRim=new ws(10479808,1.5),this.vmRim.position.set(.35,.75,.85),t.add(this.vmRim),this.vmFill=new ws(9414872,.38),this.vmFill.position.set(-.4,-.85,.2),t.add(this.vmFill),this.vmMuzzle=new mc(16761469,0,1.2,1.8),t.add(this.vmMuzzle),t.environment=Ig(this.renderer.renderer)}_initWeaponFX(){const t=b_();this.vmFlash=new tu(new ac({map:t,color:16767392,blending:ki,transparent:!0,depthWrite:!1,rotation:0})),this.vmFlash.scale.setScalar(.09),this.vmFlash.visible=!1,this.renderer.vmScene.add(this.vmFlash),this._flashT=0;const e=new re({transparent:!0,depthWrite:!1,blending:ki,uniforms:{uTime:{value:0},uHeat:{value:0}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,fragmentShader:`
        uniform float uTime, uHeat;
        varying vec2 vUv;
        float h(vec2 p){ return fract(sin(dot(floor(p*40.0), vec2(127.1,311.7)))*43758.5453); }
        void main() {
          float n = h(vec2(vUv.x, vUv.y*3.0 - uTime*2.2)) * 0.6
                  + h(vec2(vUv.x*3.0, vUv.y*5.0 - uTime*3.7)) * 0.4;
          float a = smoothstep(0.35, 0.85, n) * uHeat
            * smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
          gl_FragColor = vec4(vec3(0.75, 0.82, 0.95) * a * 0.35, a * 0.4);
        }`});this.heatQuad=new U(new Be(.05,.34),e),this.heatQuad.position.set(0,.03,-.68),this.weapon.rig.add(this.heatQuad),this.heatMat=e}startMatch(t){this.godMode=t,this.audio.init(),this.audio.resume(),this.music.start(),this.input||(this.input=new Ug(this.renderer.renderer.domElement),this.player.input=this.input,this.cameraRig.input=this.input,this.input.onLockChange=e=>{!e&&this.state==="playing"&&this.pause()}),this.state="playing",this.resetState(),this.hud.setVisible(!0),this.input.requestLock()}resetToMenu(){this.state="menu",this.input.releaseLock(),this.hud.setVisible(!1),this.resetState(),this.music.stop()}resetState(){this.paused=!1,this.pauseOverlay.style.display="none",this.killcam.active=!1,this.enemyManager.clearAll(),this.decals.clearBlood(),this.decals.clearHoles(),this.streak.reset(),this.hp=this.maxHp,this.regenDelay=0,this.score=0,this.kills=0,this.shotsFired=0,this.shotsHit=0,this.headshots=0,this.waveScore=0,this.player.pos.set(0,this.world.terrain.heightAt(0,0),0),this.player.vel.set(0,0,0),this.player.sliding=!1,this.player.tacSprint=!1,this.player.mantle=null,this.player.crouch=0,this.weapon.pump.cancel(),this.weapon.pump.resetMeshes(),this.weapon.rifleReload.cancel(),this.weapon.rifleReload.resetMeshes(),this.weapon.shellReload.cancel(),this.weapon.shellReload.resetMeshes(),this.weapon.swapT=-1,this.weapon.swapTo=null,this.weapon.kind!=="rifle"&&this.weapon._applyKind("rifle"),this.weapon._stash.rifle=null,this.weapon._stash.shotgun=null,this.weapon._sgReloadStart=0,this.weapon.ammo=this.weapon.magSize,this.weapon.reloading=!1,this.weapon._followSnapped=!1,this.weapon.reload.cancel(),this.weapon.reload.resetMeshes(),this.weapon.adsT=0,this.weapon.heat=0,this.weapon.overdrive=!1,this.cameraRig.yaw=.5,this.cameraRig.pitch=0,this.cameraRig.killcam=null,this.hud.setKillcam(!1),this.respawnDrums(),this.wave=0,this.enemyManager.wave=0,this._waveBreather=1.6,this._pendingWave=1,this._menuAngle=0,this.hud.hideControls();for(const t of["hitstop","killcam","overdrive","death"])fe.releaseScale(t);this.renderer.grade.uniforms.uDamage.value=0,this.renderer.grade.uniforms.uFlash.value=0}pause(){this.state==="playing"&&(this.paused=!0,this.pauseOverlay.style.display="flex",this.audio.suspend())}resume(){this.state==="playing"&&(this.paused=!1,this.pauseOverlay.style.display="none",this.audio.resume(),this.input.requestLock())}respawnDrums(){for(const t of this.world.props.drums)t.exploded=!1,t.mesh.visible=!0}fireBullet({spread:t,first:e,shotIndex:i}){this.shotsFired++;const n=this.renderer.worldCamera,a=this.cameraRig.eye.clone(),r=new S(0,0,-1).applyQuaternion(n.quaternion);if(t>0){const o=new S(1,0,0).applyQuaternion(n.quaternion),l=new S(0,1,0).applyQuaternion(n.quaternion),h=T.next()*Math.PI*2,c=Math.sqrt(T.next())*t;r.addScaledVector(o,Math.cos(h)*c).addScaledVector(l,Math.sin(h)*c).normalize()}this._resolveBullet(a,r,34*(this.weapon.overdrive?1.15:1),e,!1),this.tracers.spawn(this.weapon.muzzleWorld,r,80,this.weapon.overdrive?1:0)}firePellets({spread:t,pelletSpread:e,count:i,damage:n,first:a}){this.shotsFired++;const r=this.renderer.worldCamera,o=this.cameraRig.eye.clone(),l=new S(0,0,-1).applyQuaternion(r.quaternion),h=new S(1,0,0).applyQuaternion(r.quaternion),c=new S(0,1,0).applyQuaternion(r.quaternion);if(t>0){const d=T.next()*Math.PI*2,f=Math.sqrt(T.next())*t;l.addScaledVector(h,Math.cos(d)*f).addScaledVector(c,Math.sin(d)*f).normalize()}const u=new Map;for(let d=0;d<i;d++){const f=Math.sqrt((d+.5)/i),g=d*2.399963+T.next()*.55,v=l.clone().addScaledVector(h,Math.cos(g)*f*e).addScaledVector(c,Math.sin(g)*f*e).normalize(),p=this._resolveBullet(o,v,n,a&&d===0,!1,{pellet:!0});if(p&&p.enemy){const m=u.get(p.enemy)||{dmg:0,hs:!1,killed:!1,point:p.point};m.dmg+=p.dmg,m.hs=m.hs||p.headshot,m.killed=m.killed||p.killed,u.set(p.enemy,m)}(d===0||d===(i/2|0)||d===i-1)&&this.tracers.spawn(this.weapon.muzzleWorld,v,34,0)}u.size>0&&this.shotsHit++;for(const d of u.values())this.hud.damageNumber(d.point,Math.round(d.dmg),d.hs,r),this.hud.hitMarker(d.killed),this.audio.hitTick()}_resolveBullet(t,e,i,n,a,r){const o=this.world.raycast(t,e,300),l=this.enemyManager.raycastEnemies(t,e,300);let h=null,c=null;if(l&&(!o||l.distance<o.distance)?(h=l,c="enemy"):o&&(h=o,c="world"),!h)return;const u=h.point.clone();if(e.clone(),c==="enemy"){r?.pellet||this.shotsHit++,this._lastHit={kind:"enemy",dead:h.object.userData.enemy.dead,d:+h.distance.toFixed(2)};const f=h.object.userData.enemy,g=h.object.userData.part;if(f.dead)return f.ragdoll&&f.ragdoll.impulse(u,e,5),this.blood.spray(u,e,{power:.6}),r?.pellet||this.audio.hitTick(),{enemy:null};if(r?.pellet){const m=1-ye.clamp((h.distance-8)/24,0,1)*.65;i*=m}const v=Math.round(i*(n?1.15:1)),p=f.hit(v,e,g);return this.blood.spray(u,e,{headshot:p.headshot}),r?.pellet?(p.killed&&this.onEnemyKilled(f,e,3.2,p.headshot,"bullet"),{enemy:f,dmg:v,headshot:p.headshot,killed:p.killed,point:u}):(this.hud.damageNumber(u,v,p.headshot,this.renderer.worldCamera),p.killed?this.onEnemyKilled(f,e,3.2,p.headshot,"bullet"):(this.audio.hitTick(),this.hud.hitMarker(!1)),{enemy:f,dmg:v,headshot:p.headshot,killed:p.killed,point:u})}const d=h.object.userData.surface??"snow";if(this._lastHit={kind:"world",surface:d,d:+h.distance.toFixed(2)},this.surfaceImpact(h,e),!a&&(d==="wood"||d==="tarp")){const f=u.clone().addScaledVector(e,.55);this._resolveBullet(f,e,i*.5,!1,!0)}}surfaceImpact(t,e){const i=t.point,n=t.face?t.face.normal.clone().transformDirection(t.object.matrixWorld):new S(0,1,0);switch(t.object.userData.surface??"snow"){case"snow":{for(let r=0;r<12;r++)this.particlesAlpha.spawn({x:i.x,y:i.y,z:i.z,vx:e.x*1.4+T.gauss(0,1.8),vy:T.range(.6,3.4),vz:e.z*1.4+T.gauss(0,1.8),life:T.range(.4,.9),size:T.range(.1,.24),sizeVel:.16,r:.85,g:.9,b:.97,alpha:.6,alphaPow:1.2,grav:.5,drag:1.6,bounce:0});for(let r=0;r<3;r++)this.particlesAlpha.spawn({x:i.x,y:i.y+.1,z:i.z,vx:T.gauss(0,.5),vy:T.range(.4,1),vz:T.gauss(0,.5),life:T.range(.7,1.2),size:T.range(.3,.55),sizeVel:.5,r:.8,g:.86,b:.95,alpha:.34,alphaPow:1.6,grav:-.04,drag:2.2,collide:!1});this.decals.add("hole",i,n,{size:.22});break}case"metal":case"container":{for(let r=0;r<8;r++)this.particlesAdd.spawn({x:i.x,y:i.y,z:i.z,vx:n.x*2+T.gauss(0,3),vy:T.range(1,4),vz:n.z*2+T.gauss(0,3),life:T.range(.2,.5),size:T.range(.012,.028),stretch:2,r:1,g:.8,b:.45,alpha:1,grav:1.2,drag:.4,bounce:.4});this.decals.add("hole",i,n,{size:.14}),this.audio.shellTinkle();break}case"ice":{for(let r=0;r<12;r++)this.particlesAdd.spawn({x:i.x,y:i.y,z:i.z,vx:n.x*1.5+T.gauss(0,2),vy:T.range(1,3.4),vz:n.z*1.5+T.gauss(0,2),life:T.range(.3,.7),size:T.range(.01,.035),r:.7,g:.9,b:1,alpha:1,grav:1,drag:.3,bounce:.3});this.decals.add("hole",i,n,{size:.3}),this.audio.shellTinkle();break}case"wood":{for(let r=0;r<8;r++)this.particlesAlpha.spawn({x:i.x,y:i.y,z:i.z,vx:n.x*1.2+T.gauss(0,2.2),vy:T.range(.5,3),vz:n.z*1.2+T.gauss(0,2.2),life:T.range(.4,.9),size:T.range(.02,.05),stretch:2.5,r:.55,g:.4,b:.22,alpha:.95,grav:1,drag:.4,bounce:.2});this.decals.add("hole",i,n,{size:.18});break}case"glass":{const r=t.object.userData.window;if(r&&!r.broken){r.broken=!0,t.object.visible=!1;for(let o=0;o<16;o++)this.particlesAdd.spawn({x:i.x,y:i.y,z:i.z,vx:e.x*1+T.gauss(0,1.8),vy:T.range(-.5,2.4),vz:e.z*1+T.gauss(0,1.8),life:T.range(.5,1.2),size:T.range(.015,.05),stretch:1.4,r:1,g:.82,b:.5,alpha:.9,grav:1,drag:.3,bounce:.25});this.world.lights.flashLight(i.clone().addScaledVector(n,-.5),16761976,60,6),this.audio.glassBreak()}break}case"tarp":{const r=t.object.userData.cloth;if(r){r.uniforms.uImpulse.value=1;const o=t.uv??{x:.5,y:.5};r.uniforms.uImpulseAt.value.set(o.x,o.y);const l=t.object.userData;l.holeIdx=((l.holeIdx??0)+1)%8,r.uniforms.uHoles.value[l.holeIdx].set(o.x,o.y,T.range(.02,.05),0)}for(let o=0;o<6;o++)this.particlesAlpha.spawn({x:i.x,y:i.y,z:i.z,vx:T.gauss(0,1.4),vy:T.gauss(0,1),vz:T.gauss(0,1.4),life:T.range(.3,.7),size:T.range(.02,.05),r:.6,g:.62,b:.5,alpha:.7,grav:.7,drag:1});break}case"drum":{const r=t.object.userData.collider?.drum;r&&!r.exploded&&(r.exploded=!0,r.mesh.visible=!1,this.explosions.explode(r.pos.clone(),{groundY:this.world.terrain.heightAt(r.pos.x,r.pos.z),onImpulse:(o,l)=>{this.enemyManager.applyExplosion(o,l);for(const h of this.world.props.drums)h===r||h.exploded||h.pos.distanceTo(o)<3.2&&(h.exploded=!0,h.mesh.visible=!1,setTimeout(()=>this.explosions.explode(h.pos.clone(),{groundY:this.world.terrain.heightAt(h.pos.x,h.pos.z),onImpulse:(c,u)=>this.enemyManager.applyExplosion(c,u)}),160))}}));break}default:this.decals.add("hole",i,n,{size:.16})}}muzzleFX(t){const e=this.weapon.isShotgun,i=(t?1.3:1)*(e?2.2:1),n=this.weapon.model.anchors.muzzleAnchor;this.vmFlash.position.copy(n.getWorldPosition(Xn)),this.vmFlash.material.rotation=T.next()*Math.PI*2,this.vmFlash.scale.setScalar(T.range(.11,.16)*i),this.vmFlash.material.color.setHex(t?16769712:16767392),this.vmFlash.visible=!0,this._flashT=e?.07:.045,this.vmMuzzle.position.copy(this.vmFlash.position),this.vmMuzzle.intensity=(e?4:1.8)*i,this.world.lights.flashLight(this.weapon.muzzleWorld,16761469,(e?26:12)*(t?1.3:1),e?.09:.05);const a=this.weapon.muzzleWorld,r=this.world.weather.windDir;for(let o=0;o<(e?4:2);o++)this.particlesAlpha.spawn({x:a.x,y:a.y,z:a.z,vx:r.x*1.2+T.gauss(0,.3),vy:T.range(.2,.6),vz:r.y*1.2+T.gauss(0,.3),life:T.range(.7,1.4),size:T.range(.05,.09),sizeVel:.16,r:.75,g:.78,b:.82,alpha:.22,alphaPow:1.5,grav:-.06,drag:1.8,collide:!1,windMult:1.2});if(!e){const o=this.renderer.worldCamera,l=Cr.set(1,0,0).applyQuaternion(o.quaternion),h=Xh.set(0,1,0).applyQuaternion(o.quaternion),c=T_.copy(this.weapon.muzzleWorld).addScaledVector(o.getWorldDirection(E_),.62);this.shells.eject(c,l,h)}this.hud.ammoPop(),this.music.gunFired()}pumpShellEject(){const t=this.renderer.worldCamera,e=this.weapon.shotgun.anchors.ejectAnchor.getWorldPosition(Xn).applyMatrix4(t.matrixWorld),i=Cr.set(1,0,0).applyQuaternion(t.quaternion),n=Xh.set(0,1,0).applyQuaternion(t.quaternion);this.shells.eject(e,i,n,"shotgun")}landFX(t){const e=this.player.pos;for(let i=0;i<Math.round(6*t);i++)this.particlesAlpha.spawn({x:e.x+T.gauss(0,.3),y:e.y+.05,z:e.z+T.gauss(0,.3),vx:T.gauss(0,1.4),vy:T.range(.4,1.6),vz:T.gauss(0,1.4),life:T.range(.3,.7),size:T.range(.08,.18),sizeVel:.1,r:.85,g:.9,b:.97,alpha:.4,alphaPow:1.2,grav:.6,drag:1.6})}slideFX(){const t=this.player.pos,e=this.player.vel;for(let i=0;i<3;i++)this.particlesAlpha.spawn({x:t.x-e.x*.1+T.gauss(0,.2),y:t.y+.08,z:t.z-e.z*.1+T.gauss(0,.2),vx:-e.x*.35+T.gauss(0,.8),vy:T.range(.8,2.4),vz:-e.z*.35+T.gauss(0,.8),life:T.range(.4,.9),size:T.range(.08,.2),sizeVel:.14,r:.86,g:.9,b:.97,alpha:.5,alphaPow:1.1,grav:.8,drag:1.2,windMult:.4})}onEnemyKilled(t,e,i,n,a){this.kills++,n&&this.headshots++,t.die(e,i,this.enemyManager.ragdolls,this.renderer.worldScene),this.blood.pool(t.root.position),this.audio.killThock(),n&&this.audio.headshotCrack(),this.hud.hitMarker(!0);const r=(n?150:100)*Math.max(1,this.streak.combo+1);if(this.score+=r,this.waveScore+=r,this.hud.killFeed(t.type,n,r),this.streak.onKill(),fe.requestScale("hitstop",.1,.07),this.enemyManager.aliveCount===0&&this.enemyManager.spawnQueue.length===0&&this.state==="playing"){const l=t.root.position.clone().setY(t.root.position.y+.9);setTimeout(()=>{this.state==="playing"&&this.killcam.start(l)},350)}}playerHit(t,e){if(this.state!=="playing"||this.godMode)return;this.hp=Math.max(0,this.hp-t),this.regenDelay=4,this.audio.hurt(),this.cameraRig.addShake(.42);const i=this.renderer.grade.uniforms;if(i.uDamage.value=Math.min(.85,i.uDamage.value+.5),e){const n=e.clone().setY(0).normalize();i.uDamageDir.value.set(n.x,n.z),this.hud.damageDirection(n,this.cameraRig.yaw)}this.hp<=0&&this.playerDie()}nearMiss(){this.audio.nearMiss()}debugShot(t){const e=this.player,i=new S(e.pos.x,e.pos.y+e.eyeHeight,e.pos.z),n=t.clone().sub(i).normalize();this.cameraRig.yaw=Math.atan2(-n.x,-n.z),this.cameraRig.pitch=Math.asin(ye.clamp(n.y,-1,1)),this.shotsFired++,this.muzzleFX(!1),this._resolveBullet(i.clone(),n.clone(),60,!1,!1),this.tracers.spawn(this.weapon.muzzleWorld,n.clone(),80,0)}debugRayInfo(t,e,i){const n=this.player,a=Cr.set(n.pos.x,n.pos.y+n.eyeHeight,n.pos.z),r=Xn.set(t,e,i).sub(a).normalize(),o=this.world.raycast(a,r,300),l=this.enemyManager.raycastEnemies(a,r,300),h=c=>c?{d:+c.distance.toFixed(2),surface:c.object.userData?.surface??null,isDrum:!!c.object.userData?.collider?.drum,geo:c.object.geometry?.type??"?"}:null;return{eye:[a.x.toFixed(1),a.y.toFixed(1),a.z.toFixed(1)],world:h(o),enemy:l?+l.distance.toFixed(2):null}}debugExplodeAt(t,e,i){this.explosions.explode(Xn.set(t,e,i),{groundY:this.world.terrain.heightAt(t,i),onImpulse:(n,a)=>this.enemyManager.applyExplosion(n,a)})}playerDie(){this.state="dead",this.paused=!1,this.pauseOverlay.style.display="none",this.hud.setVisible(!1),this.renderer.grade.uniforms.uDamage.value=.85,this.renderer.grade.uniforms.uLowHp.value=1,this.input.releaseLock(),this.music.stop(),this.screens.showDeath(this.enemyManager.wave,this.score,this.kills),fe.requestScale("death",.3,6),this.cameraRig.addShake(1)}start(){let t=performance.now();const e=i=>{this._raf=requestAnimationFrame(e);const n=Math.min((i-t)/1e3,.05);t=i,this.debug.frame(n*1e3),this.frame(n,i)};this._raf=requestAnimationFrame(e)}frame(t,e){this._lastFrameNow=e,fe.update(this.paused?0:t),bs.sec=fe.real;const i=fe.dt,n=fe.dtReal;if(this.input&&this.input.pressed("Backquote")&&this.debug.toggle(),this.state==="playing"&&!this.paused){this.input.key("Space")&&(this.player.wantJump=!0),this.input.pressed("KeyT")&&!this.killcam.active&&!this.weapon.reloading&&this.selftest.run(),this.input.anyKeyEver&&this.hud.hideControls(),this.player.update(i),this.weapon.update(n,this.input,this.player,this.cameraRig),this.enemyManager.update(i),this.streak.update(n),this._updateWaves(n),this._updateHealth(n),this._updatePrompt();const l=this.world.weather,h=A_.set(l.windDir.x*l.windSpeed*.35,0,l.windDir.y*l.windSpeed*.35);this.particlesAdd.wind.copy(h),this.particlesAlpha.wind.copy(h),this.player.sliding&&this.player.grounded&&this.slideFX(),!this.player.sliding&&this._wasSliding&&this.audio.slideLoop(!1),this._wasSliding=this.player.sliding}const a=this.state==="playing"||this.state==="dead"?i:n;if(this.world.update(this.paused?0:a,this.renderer.worldCamera.position),this.paused||(this.particlesAdd.update(a),this.particlesAlpha.update(a),this.tracers.update(a),this.shells.update(a),this.explosions.update(a),this.decals.update(a)),this.state==="menu"?this._menuCamera(n):(this.cameraRig.update(n,this.weapon.adsAmount,i),this.cameraRig.killcam||this.renderer.worldCamera.rotateZ(this.cameraRig.reloadRoll??0)),this.renderer.worldCamera.updateMatrixWorld(),this.weapon.rig.visible=this.state!=="menu"&&!this.killcam.active,this.renderer.vmScene.updateMatrixWorld(),this.weapon.updateMuzzleWorld(this.renderer.worldCamera),this._syncVmLights(),this._flashT>0){this._flashT-=n;const l=Math.max(0,this._flashT/.045);this.vmFlash.material.opacity=Math.min(1,l*2.2),this.vmFlash.scale.multiplyScalar(1-Math.min(n,i*6)),this.vmMuzzle.intensity=Math.max(0,this.vmMuzzle.intensity-n*42),this._flashT<=0&&(this.vmFlash.visible=!1,this.vmMuzzle.intensity=0)}this.heatMat.uniforms.uTime.value=fe.real,this.heatMat.uniforms.uHeat.value=Math.max(0,(this.weapon.heat-.3)/.7)*.8,this.heatQuad.visible=this.weapon.kind==="rifle";const r=this.renderer.grade.uniforms;r.uTime.value=fe.real,this.state!=="dead"&&(r.uDamage.value=Math.max(0,r.uDamage.value-n*1.4)),r.uLowHp.value=this.state==="dead"?1:this.state==="playing"&&!this.godMode?kt(1-this.hp/40,0,1):0,r.uOverdrive.value=Ae(r.uOverdrive.value,this.streak.overdriveT>0?1:0,5,n),r.uAberrationBoost.value=Math.max(r.uDamage.value*.01,this.streak.overdriveT>0?.004:0);const o=this.cameraRig.angularVel;r.uSmear.value.set(kt(-o.x*3e-5,-.02,.02),kt(o.y*24e-6,-.015,.015)),this.audio.setWind(this.world.weather.gust,this.world.weather.windSpeed),this.music.update(),this.state==="playing"&&(this.hud.update(n,this.renderer.worldCamera,this.weapon,this.player),this.hud.setAmmo(this.weapon.ammo,this.weapon.magSize,this.weapon.reloading,this.weapon.reload.progress,this.weapon.isShotgun?"12GA // RESERVE ∞":"5.56 // RESERVE ∞"),this.hud.setWeapon(this.weapon.kind),this.hud.setHealth(this.hp,this.maxHp,this.godMode),this.hud.setWave(this.enemyManager.wave||this._pendingWave||1,this.enemyManager.aliveCount+this.enemyManager.spawnQueue.length),this.hud.setScore(this.score),this.hud.setCombo(this.streak.combo,this.streak.comboTimer)),this.debug.update(),this.renderer.monitor(t*1e3,fe.real),this.renderer.render(),this.input?.endFrame()}_menuCamera(t){this._menuAngle=(this._menuAngle??0)+t*.07;const e=this._menuAngle,i=this.renderer.worldCamera,n=15+Math.sin(e*.6)*3;i.position.set(Math.cos(e)*n,this.world.terrain.heightAt(Math.cos(e)*n,Math.sin(e)*n)+2.6+Math.sin(e*.4)*.5,Math.sin(e)*n),i.lookAt(0,2.2,0),i.fov=68,i.updateProjectionMatrix()}_syncVmLights(){const t=this.renderer.worldCamera;Xn.copy(this.world.lights.key.position).normalize().transformDirection(t.matrixWorldInverse),this.vmKey.position.copy(Xn).multiplyScalar(2);const e=this.world.sky.tint;this.vmHemi.color.setRGB(.32+e.g*.3,.42+e.g*.22,.62+e.b*.2);const i=this.world.sky.surge??.7;this.vmRim.color.setRGB(.3+e.g*1.3,.6+e.g*2.1,.52+e.b*1.4),this.vmRim.intensity=.9+1.6*i}_updateWaves(t){if(this._waveBreather>0){this._waveBreather-=t,this._waveBreather<=0&&(this.wave=this._pendingWave,this.enemyManager.startWave(this.wave),this.hud.waveBanner(this.wave),this.audio.waveSting());return}if(this.enemyManager.wave>0&&this.enemyManager.aliveCount===0&&this.enemyManager.spawnQueue.length===0&&!this.killcam.active){const i=this.shotsFired>0?this.shotsHit/this.shotsFired*100:0,n=this.kills>0?this.headshots/this.kills*100:0;this.screens.showTally({wave:this.enemyManager.wave,accuracy:i,headshotPct:n,bestCombo:Math.max(this.streak.bestCombo,1),waveScore:this.waveScore}),this.waveScore=0,this.decals.clearBlood(),this.respawnDrums(),this._pendingWave=this.enemyManager.wave+1,this._waveBreather=6}const e=kt(.15+this.enemyManager.wave*.09+Math.min(this.enemyManager.aliveCount,10)*.045+(this.streak.combo>2?.15:0),0,1);this.music.targetIntensity=this._waveBreather>0?.1:e}_updateHealth(t){if(this.godMode){this.hp=this.maxHp;return}this.regenDelay>0?this.regenDelay-=t:this.hp<this.maxHp&&(this.hp=Math.min(this.maxHp,this.hp+20*t)),this.hp<35&&(this._heartbeatT-=t,this._heartbeatT<=0&&(this._heartbeatT=ye.lerp(.55,1,this.hp/35),this.audio.heartbeat()))}_updatePrompt(){this._promptT-=fe.dtReal,this._promptT<=0&&(this._promptT=.18,this.player._findMantle()&&this.hud.prompt({key:"SPACE",label:"MANTLE"}))}}function b_(){const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d"),e=t.createRadialGradient(64,64,2,64,64,62);e.addColorStop(0,"rgba(255,250,230,1)"),e.addColorStop(.25,"rgba(255,200,110,0.85)"),e.addColorStop(.6,"rgba(255,140,40,0.28)"),e.addColorStop(1,"rgba(255,120,30,0)"),t.fillStyle=e,t.beginPath(),t.arc(64,64,62,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(255,240,200,0.9)";for(let n=0;n<6;n++){const a=n/6*Math.PI*2;t.lineWidth=4-n%2*2,t.beginPath(),t.moveTo(64,64),t.lineTo(64+Math.cos(a)*60,64+Math.sin(a)*60),t.stroke()}const i=new Vi(s);return i.colorSpace=Ne,i}const Xn=new S,Cr=new S,Xh=new S,T_=new S,E_=new S,A_=new S,Cc=new S_;Cc.start();window.__game=Cc;window.addEventListener("error",s=>console.error("[window]",s.message,s.filename,s.lineno));
