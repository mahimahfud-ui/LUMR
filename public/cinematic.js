// Original cinematic layer for mahimahfud. No ThreeUI source is used here.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const small=matchMedia('(max-width:760px)').matches;
export function intro(){
  let seen=false;try{seen=sessionStorage.getItem('mmf-intro')==='1'}catch{}
  if(seen||reduce)return Promise.resolve();
  return new Promise(done=>{
    const el=document.createElement('div');el.style.cssText='position:fixed;inset:0;z-index:999;background:#050504;display:grid;place-items:center;transition:opacity .7s cubic-bezier(.22,1,.36,1);cursor:pointer';
    el.innerHTML='<div style="position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,236,205,.06) 50%,transparent 65%);transform:translateX(-100%);animation:mmfSweep 1.8s .3s cubic-bezier(.22,1,.36,1) forwards"></div><div style="font:500 clamp(28px,6vw,64px)/1 Manrope,sans-serif;letter-spacing:.01em;color:#f2efe8;opacity:0;filter:blur(8px);transition:1s cubic-bezier(.22,1,.36,1)">mahimahfud</div>';
    const st=document.createElement('style');st.textContent='@keyframes mmfSweep{to{transform:translateX(100%)}}';document.head.appendChild(st);document.body.appendChild(el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{const w=el.children[1];w.style.opacity=1;w.style.filter='blur(0)';w.style.letterSpacing='.12em'}));
    let ended=false;const end=()=>{if(ended)return;ended=true;removeEventListener('keydown',end);try{sessionStorage.setItem('mmf-intro','1')}catch{}el.style.opacity=0;setTimeout(()=>{el.remove();st.remove();done()},700)};
    el.addEventListener('pointerdown',end);addEventListener('keydown',end);setTimeout(end,1900);
  });
}
export function atmosphere(root){
  const fallback=()=>document.documentElement.classList.add('no-webgl');
  try{
    const r=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'low-power'});if(!r.getContext())throw 0;
    r.setPixelRatio(Math.min(devicePixelRatio,small?1:1.25));r.domElement.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none';root.appendChild(r.domElement);
    const scene=new THREE.Scene(),cam=new THREE.OrthographicCamera(-1,1,1,-1,0,1),u={t:{value:0},r:{value:new THREE.Vector2(1,1)}};
    const mat=new THREE.ShaderMaterial({uniforms:u,vertexShader:'void main(){gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`precision highp float;uniform float t;uniform vec2 r;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.);float l=n(p*1.2+vec2(t*.018,-t*.012));vec3 c=vec3(.035,.034,.031)+vec3(.55,.42,.27)*pow(l,3.)*.07;c*=1.-.65*dot(uv-.5,uv-.5);gl_FragColor=vec4(c,1.);}`});
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat));
    const N=small?180:420,a=new Float32Array(N*3);for(let i=0;i<N;i++){a[i*3]=Math.random()*2-1;a[i*3+1]=Math.random()*2-1;a[i*3+2]=0}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xe0d5c4,size:small?1.4:1.2,transparent:true,opacity:.26,depthWrite:false,sizeAttenuation:false})));
    let raf=0,last=performance.now(),run=true;const size=()=>{r.setSize(innerWidth,innerHeight,false);u.r.value.set(r.domElement.width,r.domElement.height)};size();addEventListener('resize',size);
    const frame=now=>{if(!run)return;raf=requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.1);last=now;u.t.value+=dt;const p=g.attributes.position.array;for(let i=0;i<N;i++){p[i*3+1]+=dt*.008;if(p[i*3+1]>1)p[i*3+1]=-1}g.attributes.position.needsUpdate=true;r.render(scene,cam)};raf=requestAnimationFrame(frame);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){run=false;cancelAnimationFrame(raf)}else{run=true;last=performance.now();raf=requestAnimationFrame(frame)}});
    r.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();run=false;r.domElement.remove();fallback()});
  }catch{fallback()}
}