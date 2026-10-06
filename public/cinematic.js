// mahimahfud — original cinematic 3D space gallery atmosphere.
// Spatial depth, orbiting archive frames, perspective camera, star field and scroll dolly.
// No third-party source or UI is copied.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE=matchMedia('(max-width:760px)').matches;

function artTexture(index){
 const size=MOBILE?256:384,c=document.createElement('canvas'); c.width=size;c.height=size;
 const x=c.getContext('2d'),p=[['#0d1424','#445a90','#b8c9ff'],['#090d13','#3b6b75','#d8f2ef'],['#120f18','#614d82','#e2d5ff'],['#10150f','#4c7048','#dcefc8'],['#15120c','#796244','#f2ddae'],['#0d1017','#3c4b69','#d6e0ff']][index%6];
 const g=x.createRadialGradient(size*.48,size*.42,8,size*.5,size*.5,size*.72);g.addColorStop(0,p[2]);g.addColorStop(.2,p[1]);g.addColorStop(1,p[0]);x.fillStyle=g;x.fillRect(0,0,size,size);
 for(let i=0;i<32;i++){const px=Math.random()*size,py=Math.random()*size,r=Math.random()*size*.055,gg=x.createRadialGradient(px,py,0,px,py,r);gg.addColorStop(0,'rgba(255,255,255,.20)');gg.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gg;x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.fill()}
 x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=Math.max(1,size*.002);for(let i=0;i<5;i++){x.beginPath();x.arc(size*.52,size*.48,size*(.18+i*.09),i*.31,(i+.72)*Math.PI);x.stroke()}
 x.fillStyle='rgba(255,255,255,.72)';x.font=(Math.max(11,size*.038))+'px Manrope,Arial,sans-serif';x.fillText(String(index+1).padStart(2,'0')+' / FRAME',size*.07,size*.91);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
function frameTexture(index){
 const size=MOBILE?256:384,c=document.createElement('canvas');c.width=size;c.height=size;const x=c.getContext('2d');x.clearRect(0,0,size,size);
 const gap=size*.065;x.strokeStyle='rgba(209,222,255,.62)';x.lineWidth=Math.max(1,size*.009);x.strokeRect(gap,gap,size-gap*2,size-gap*2);x.strokeStyle='rgba(209,222,255,.18)';x.lineWidth=1;x.strokeRect(gap*1.55,gap*1.55,size-gap*3.1,size-gap*3.1);
 return new THREE.CanvasTexture(c);
}

export function intro(){
 let seen=false;try{seen=sessionStorage.getItem('mmf-intro-v5')==='1'}catch{};if(seen||REDUCED)return Promise.resolve();
 return new Promise(done=>{
  const wrap=document.createElement('div');wrap.style.cssText='position:fixed;inset:0;z-index:9999;background:#02040a;overflow:hidden;display:grid;place-items:center;cursor:pointer;opacity:1';
  wrap.innerHTML='<div class="mmf-i-canvas"></div><div class="mmf-i-brand">mahimahfud<span>.</span></div><div class="mmf-i-sub">entering visual space</div>';
  const style=document.createElement('style');style.textContent='.mmf-i-canvas{position:absolute;inset:0}.mmf-i-canvas canvas{position:absolute;inset:0;width:100%;height:100%}.mmf-i-brand{position:relative;z-index:2;font:600 clamp(26px,5vw,56px)/1 Manrope,sans-serif;letter-spacing:.1em;color:#f3f6ff;opacity:0;filter:blur(12px);animation:mmfIB 1.1s .25s cubic-bezier(.22,1,.36,1) forwards}.mmf-i-brand span{color:#9eb7ff}.mmf-i-sub{position:absolute;z-index:2;bottom:9vh;font:9px/1 DM Sans,Arial,sans-serif;letter-spacing:.34em;text-transform:uppercase;color:rgba(220,228,246,.46);opacity:0;animation:mmfIS .9s .9s ease forwards}.mmf-i-brand:after{content:"";position:absolute;left:-25vw;right:-25vw;top:50%;height:1px;background:linear-gradient(90deg,transparent,rgba(199,216,255,.25),transparent);transform:translateX(-100vw);animation:mmfSweep 2s .55s ease forwards}@keyframes mmfIB{to{opacity:1;filter:blur(0);letter-spacing:.135em}}@keyframes mmfIS{to{opacity:1}}@keyframes mmfSweep{to{transform:translateX(100vw)}}';
  document.head.appendChild(style);document.body.appendChild(wrap);
  let renderer,scene,camera,world,raf=0,last=performance.now(),time=0,dead=false;
  try{
   const host=wrap.querySelector('.mmf-i-canvas');renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1:1.35));renderer.setSize(innerWidth,innerHeight,false);host.appendChild(renderer.domElement);
   scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,80);camera.position.z=11;world=new THREE.Group();scene.add(world);
   const n=MOBILE?110:220,pos=new Float32Array(n*3);for(let i=0;i<n;i++){pos[i*3]=(Math.random()-.5)*20;pos[i*3+1]=(Math.random()-.5)*12;pos[i*3+2]=-Math.random()*38}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));world.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xb9c8ff,size:MOBILE?.03:.024,transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending})));
   const planet=new THREE.Mesh(new THREE.SphereGeometry(1.7,42,42),new THREE.MeshBasicMaterial({color:0x0e1627,transparent:true,opacity:.86,wireframe:true}));planet.position.z=-3;world.add(planet);
   for(let i=0;i<8;i++){const a=i/8*Math.PI*2,m=new THREE.Mesh(new THREE.PlaneGeometry(1.25,1.05),new THREE.MeshBasicMaterial({map:artTexture(i),transparent:true,opacity:.22,depthWrite:false}));m.position.set(Math.cos(a)*2.2,Math.sin(a)*1.45,-3.8-Math.sin(a)*1.2);m.rotation.z=-a*.16;world.add(m)}
   const onResize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)};addEventListener('resize',onResize);
   const draw=now=>{if(dead)return;raf=requestAnimationFrame(draw);const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;world.rotation.y+=dt*.18;world.rotation.x=Math.sin(time*.42)*.04;camera.position.z=11-Math.min(1.9,time*.25);renderer.render(scene,camera)};draw(performance.now());
  }catch(e){console.warn('3D intro fallback',e)}
  const end=()=>{if(dead)return;dead=true;cancelAnimationFrame(raf);try{sessionStorage.setItem('mmf-intro-v5','1')}catch{};wrap.style.transition='opacity .9s cubic-bezier(.22,1,.36,1)';wrap.style.opacity='0';setTimeout(()=>{wrap.remove();style.remove();done()},920)};
  wrap.addEventListener('pointerdown',end,{once:true});window.addEventListener('keydown',end,{once:true});setTimeout(end,3400);
 });
}

export function atmosphere(root){
 if(REDUCED)return;
 try{
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1:1.35));renderer.setSize(innerWidth,innerHeight,false);renderer.domElement.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none';root.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,140);camera.position.set(0,0,11);
  const world=new THREE.Group();scene.add(world);
  const starsN=MOBILE?1000:1900,sp=new Float32Array(starsN*3),sv=new Float32Array(starsN);for(let i=0;i<starsN;i++){sp[i*3]=(Math.random()-.5)*32;sp[i*3+1]=(Math.random()-.5)*19;sp[i*3+2]=-Math.random()*62;sv[i]=.002+Math.random()*.011}const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));world.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xb9c8ff,size:MOBILE?.018:.022,transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending})));
  const dustN=MOBILE?220:430,dp=new Float32Array(dustN*3);for(let i=0;i<dustN;i++){dp[i*3]=(Math.random()-.5)*19;dp[i*3+1]=(Math.random()-.5)*13;dp[i*3+2]=-Math.random()*15-1}const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dp,3));world.add(new THREE.Points(dg,new THREE.PointsMaterial({color:0xf0f4ff,size:MOBILE?.028:.034,transparent:true,opacity:.24,depthWrite:false,blending:THREE.AdditiveBlending})));
  const planet=new THREE.Mesh(new THREE.SphereGeometry(2.15,48,48),new THREE.MeshBasicMaterial({color:0x0a1120,transparent:true,opacity:.9,wireframe:true}));planet.position.z=-3.1;world.add(planet);
  const glow=new THREE.Mesh(new THREE.SphereGeometry(2.55,48,48),new THREE.MeshBasicMaterial({color:0x7fa6ff,transparent:true,opacity:.035,depthWrite:false,blending:THREE.AdditiveBlending}));glow.position.copy(planet.position);world.add(glow);
  const core=new THREE.Mesh(new THREE.SphereGeometry(.83,32,32),new THREE.MeshBasicMaterial({color:0x1a2943,transparent:true,opacity:.46}));core.position.z=-1.75;world.add(core);
  const rail1=new THREE.Mesh(new THREE.TorusGeometry(3.35,.011,14,220),new THREE.MeshBasicMaterial({color:0x9db8ff,transparent:true,opacity:.22}));rail1.rotation.set(.92,.14,0);rail1.position.copy(planet.position);world.add(rail1);
  const rail2=new THREE.Mesh(new THREE.TorusGeometry(4.35,.007,14,240),new THREE.MeshBasicMaterial({color:0x7f9ed8,transparent:true,opacity:.12}));rail2.rotation.set(1.16,-.55,.2);rail2.position.copy(planet.position);world.add(rail2);
  const frameWorld=new THREE.Group();frameWorld.position.z=-3.1;world.add(frameWorld);
  const count=MOBILE?13:21,golden=Math.PI*(3-Math.sqrt(5)),cards=[];
  for(let i=0;i<count;i++){const y=1-(i/Math.max(1,count-1))*2,rad=Math.sqrt(Math.max(0,1-y*y)),theta=i*golden,x=Math.cos(theta)*rad,z=Math.sin(theta)*rad,card=new THREE.Group(),w=MOBILE?.76:1.02,h=w*(.72+(i%4===0?.18:0)),art=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:artTexture(i+1),transparent:true,opacity:MOBILE?.16:.22,depthWrite:false})),frame=new THREE.Mesh(new THREE.PlaneGeometry(w*1.055,h*1.055),new THREE.MeshBasicMaterial({map:frameTexture(i+1),transparent:true,opacity:MOBILE?.18:.28,depthWrite:false,blending:THREE.AdditiveBlending}));card.add(art,frame);card.position.set(x*4.5,y*4.5,z*4.5);card.rotation.y=Math.atan2(x,z);card.rotation.x=Math.asin(Math.max(-1,Math.min(1,y)));card.userData.phase=i*.72;frameWorld.add(card);cards.push(card)}
  const beaconWorld=new THREE.Group();world.add(beaconWorld);for(let i=0;i<10;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(i%3===0?.055:.033,12,12),new THREE.MeshBasicMaterial({color:0xdbe7ff,transparent:true,opacity:.55})),a=i/10*Math.PI*2;b.position.set(Math.cos(a)*5.5,Math.sin(a*1.35)*2.2,-4.4+(i%3)*.8);beaconWorld.add(b)}
  let mx=0,my=0,smx=0,smy=0,scroll=0,scrollTarget=0,last=performance.now(),time=0,raf=0,visible=true;
  addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});addEventListener('scroll',()=>{scrollTarget=Math.max(0,Math.min(1,scrollY/(innerHeight*.55)))},{passive:true});
  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);renderer.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1:1.35))};addEventListener('resize',resize);
  const pause=()=>{visible=false;cancelAnimationFrame(raf)},resume=()=>{visible=true;last=performance.now();raf=requestAnimationFrame(frame)};document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
  function frame(now){if(!visible)return;raf=requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;smx+=(mx-smx)*.035;smy+=(my-smy)*.035;scroll+=(scrollTarget-scroll)*.075;camera.position.x=smx*1.5;camera.position.y=-smy*.95;camera.position.z=11-scroll*2.6;camera.lookAt(0,0,-3.25);world.rotation.y+=dt*.018;world.rotation.x=Math.sin(time*.16)*.018;
   const s=sg.attributes.position.array;for(let i=0;i<starsN;i++){s[i*3+2]+=sv[i]*(dt*60);if(s[i*3+2]>4){s[i*3+2]=-62;s[i*3]=(Math.random()-.5)*32;s[i*3+1]=(Math.random()-.5)*19}}sg.attributes.position.needsUpdate=true;
   const d=dg.attributes.position.array;for(let i=0;i<dustN;i++){d[i*3+2]+=dt*.032;if(d[i*3+2]>2)d[i*3+2]=-16}dg.attributes.position.needsUpdate=true;
   planet.rotation.y+=dt*.045;planet.rotation.x+=dt*.012;glow.scale.setScalar(1+.05*Math.sin(time*.8));core.scale.setScalar(1+.025*Math.sin(time*1.2));rail1.rotation.z+=dt*.11;rail2.rotation.z-=dt*.075;frameWorld.rotation.y-=dt*.028;frameWorld.rotation.x=Math.sin(time*.28)*.035;
   cards.forEach((card,i)=>{card.position.y+=Math.sin(time*.22+card.userData.phase)*dt*.011;card.rotation.z=Math.sin(time*.25+card.userData.phase)*.025;const q=.018*Math.sin(time*1.15+card.userData.phase);card.scale.setScalar(1+q)});beaconWorld.rotation.y+=dt*.035;beaconWorld.rotation.x=Math.sin(time*.22)*.03;renderer.render(scene,camera);
  }
  resize();resume();renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();pause();renderer.domElement.remove()});
 }catch(e){console.warn('Space 3D fallback',e)}
}