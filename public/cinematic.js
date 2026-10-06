// Original space-adventure atmosphere for mahimahfud.
// Cinematic/WebGL mood only; no third-party UI source is copied.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE=matchMedia('(max-width:760px)').matches;

export function intro(){
  let seen=false;try{seen=sessionStorage.getItem('mmf-intro-v3')==='1'}catch{}
  if(seen||REDUCED)return Promise.resolve();
  return new Promise(done=>{
    const wrap=document.createElement('div');
    wrap.className='mmf-intro';
    wrap.innerHTML='<canvas class="mmf-intro-canvas"></canvas><div class="mmf-intro-ring r1"></div><div class="mmf-intro-ring r2"></div><div class="mmf-intro-glow"></div><div class="mmf-intro-brand">mahimahfud<span>.</span></div><div class="mmf-intro-sub">entering visual space</div>';
    const style=document.createElement('style');
    style.textContent='.mmf-intro{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;overflow:hidden;background:#02040a;cursor:pointer}.mmf-intro-canvas{position:absolute;inset:0;width:100%;height:100%}.mmf-intro-ring{position:absolute;border:1px solid rgba(178,201,255,.13);border-radius:50%;transform:rotateX(68deg) rotateZ(15deg);filter:blur(.2px)}.mmf-intro-ring.r1{width:min(52vw,620px);height:min(52vw,620px);animation:mmfOrbit 5s linear infinite}.mmf-intro-ring.r2{width:min(74vw,860px);height:min(74vw,860px);transform:rotateX(67deg) rotateZ(-22deg);opacity:.55;animation:mmfOrbit2 8s linear infinite}.mmf-intro-glow{position:absolute;width:26vmin;height:26vmin;border-radius:50%;background:radial-gradient(circle,#dfe8ff 0,rgba(150,181,255,.28) 14%,rgba(65,95,175,.10) 44%,transparent 72%);filter:blur(10px);animation:mmfPulse 2.2s ease-in-out infinite}.mmf-intro-brand{position:relative;z-index:2;font:600 clamp(27px,5vw,58px)/1 "Manrope",sans-serif;letter-spacing:.08em;color:#f3f6ff;opacity:0;filter:blur(12px);animation:mmfBrand 1.15s .35s cubic-bezier(.22,1,.36,1) forwards}.mmf-intro-brand span{color:#9eb7ff}.mmf-intro-sub{position:absolute;z-index:2;bottom:10vh;font:9px/1 "DM Sans",sans-serif;letter-spacing:.34em;text-transform:uppercase;color:rgba(218,226,245,.48);opacity:0;animation:mmfSub .9s 1s ease forwards}.mmf-intro:after{content:"";position:absolute;inset:0;background:radial-gradient(circle,transparent 22%,rgba(0,0,0,.12) 56%,rgba(0,0,0,.76) 100%);pointer-events:none}@keyframes mmfBrand{to{opacity:1;filter:blur(0);letter-spacing:.13em}}@keyframes mmfSub{to{opacity:1}}@keyframes mmfPulse{50%{transform:scale(1.16);opacity:.8}}@keyframes mmfOrbit{to{transform:rotateX(68deg) rotateZ(375deg)}}@keyframes mmfOrbit2{to{transform:rotateX(67deg) rotateZ(-382deg)}}@media(max-width:760px){.mmf-intro-ring.r1{width:68vw;height:68vw}.mmf-intro-ring.r2{width:94vw;height:94vw}.mmf-intro-sub{bottom:8vh}}';
    document.head.appendChild(style);document.body.appendChild(wrap);
    const canvas=wrap.querySelector('canvas'),ctx=canvas.getContext('2d');
    let w=0,h=0,raf=0,start=performance.now(),ended=false;
    const stars=Array.from({length:MOBILE?130:240},()=>({x:Math.random(),y:Math.random(),z:Math.random()}));
    const resize=()=>{w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)};
    const draw=now=>{raf=requestAnimationFrame(draw);const t=(now-start)/1000;ctx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){s.z=(s.z+.0028)%1;const depth=.15+s.z*1.35,dx=(s.x-.5)*innerWidth/depth+innerWidth/2,dy=(s.y-.5)*innerHeight/depth+innerHeight/2,size=.35+s.z*1.7;ctx.fillStyle='rgba(205,220,255,'+(0.06+s.z*.32)+')';ctx.fillRect(dx,dy,size,size)}ctx.strokeStyle='rgba(160,188,255,.055)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(innerWidth/2,innerHeight/2,Math.min(innerWidth,innerHeight)*(.14+.015*Math.sin(t*2)),0,Math.PI*2);ctx.stroke()};
    resize();addEventListener('resize',resize);draw(performance.now());
    const end=()=>{if(ended)return;ended=true;cancelAnimationFrame(raf);removeEventListener('resize',resize);window.removeEventListener('keydown',end);try{sessionStorage.setItem('mmf-intro-v3','1')}catch{}wrap.style.transition='opacity 900ms cubic-bezier(.22,1,.36,1)';wrap.style.opacity='0';setTimeout(()=>{wrap.remove();style.remove();done()},920)};
    wrap.addEventListener('pointerdown',end,{once:true});window.addEventListener('keydown',end,{once:true});setTimeout(end,3200);
  });
}

export function atmosphere(root){
  if(REDUCED)return;
  try{
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1:1.35));renderer.setSize(innerWidth,innerHeight,false);
    renderer.domElement.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none';
    root.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(54,innerWidth/innerHeight,.1,80);camera.position.set(0,0,10);
    const world=new THREE.Group();scene.add(world);
    const count=MOBILE?650:1200,positions=new Float32Array(count*3),speeds=new Float32Array(count),sizes=new Float32Array(count);
    for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*22;positions[i*3+1]=(Math.random()-.5)*13;positions[i*3+2]=-Math.random()*35;speeds[i]=.003+Math.random()*.012;sizes[i]=.7+Math.random()*1.6}
    const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(positions,3));sg.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
    const sm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTime:{value:0}},vertexShader:'attribute float aSize;uniform float uTime;void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=aSize*(260.0/-mv.z);gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform float uTime;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.0,d);gl_FragColor=vec4(.70,.80,1.0,a*.58);}'});
    const stars=new THREE.Points(sg,sm);world.add(stars);
    const ringMat=new THREE.MeshBasicMaterial({color:0x7f9ed8,transparent:true,opacity:.15,wireframe:true});
    const ring1=new THREE.Mesh(new THREE.TorusGeometry(2.7,.008,12,180),ringMat);ring1.rotation.x=.92;world.add(ring1);
    const ring2=new THREE.Mesh(new THREE.TorusGeometry(3.9,.006,12,180),ringMat.clone());ring2.material.opacity=.09;ring2.rotation.x=1.18;ring2.rotation.z=.65;world.add(ring2);
    const orb=new THREE.Mesh(new THREE.SphereGeometry(1.1,40,40),new THREE.MeshBasicMaterial({color:0x10182a,transparent:true,opacity:.92}));orb.position.z=-1.8;world.add(orb);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(1.35,40,40),new THREE.MeshBasicMaterial({color:0x7fa6ff,transparent:true,opacity:.045,blending:THREE.AdditiveBlending,depthWrite:false}));glow.position.copy(orb.position);world.add(glow);
    const comet=new THREE.Mesh(new THREE.SphereGeometry(.045,12,12),new THREE.MeshBasicMaterial({color:0xdbe6ff}));world.add(comet);
    let mx=0,my=0,last=performance.now(),raf=0,visible=true,time=0;
    addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
    const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);renderer.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1:1.35))};addEventListener('resize',resize);
    const pause=()=>{visible=false;cancelAnimationFrame(raf)},resume=()=>{visible=true;last=performance.now();raf=requestAnimationFrame(frame)};document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
    const frame=now=>{if(!visible)return;raf=requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;
      const p=sg.attributes.position.array;for(let i=0;i<count;i++){p[i*3+2]+=speeds[i]*(dt*60);if(p[i*3+2]>2){p[i*3+2]=-35;p[i*3]=(Math.random()-.5)*22;p[i*3+1]=(Math.random()-.5)*13}}sg.attributes.position.needsUpdate=true;sm.uniforms.uTime.value=time;
      camera.position.x+=(mx*1.05-camera.position.x)*.025;camera.position.y+=(-my*.72-camera.position.y)*.025;camera.lookAt(0,0,-4);
      world.rotation.y+=dt*.012;world.rotation.x=Math.sin(time*.18)*.018;ring1.rotation.z+=dt*.11;ring2.rotation.z-=dt*.07;orb.rotation.y+=dt*.08;glow.scale.setScalar(1+.06*Math.sin(time*.8));
      const ct=time%5.8,ang=ct/5.8*Math.PI*2;comet.position.set(Math.cos(ang)*4.6,Math.sin(ang*1.3)*1.5,-3.2+Math.sin(ang)*1.2);renderer.render(scene,camera)};
    resize();resume();
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();pause();renderer.domElement.remove()});
  }catch(err){console.warn('Space WebGL fallback',err)}
}