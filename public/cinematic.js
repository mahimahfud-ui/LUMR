// Original cinematic gallery atmosphere for mahimahfud.
// Designed as an atmospheric media-world: floating photo frames, lens glow,
// film-grain-like particles and slow camera drift. No ThreeUI source is copied.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE = matchMedia('(max-width:760px)').matches;

export function intro(){
  let seen=false; try{seen=sessionStorage.getItem('mmf-intro-v2')==='1'}catch{}
  if(seen || REDUCED) return Promise.resolve();

  return new Promise(done=>{
    const wrap=document.createElement('div');
    wrap.style.cssText='position:fixed;inset:0;z-index:9999;background:#070706;display:grid;place-items:center;overflow:hidden;cursor:pointer;transition:opacity 850ms cubic-bezier(.22,1,.36,1)';
    wrap.innerHTML=`
      <div class="mmf-intro-vignette"></div>
      <div class="mmf-intro-haze"></div>
      <div class="mmf-intro-frame"><div class="mmf-intro-photo"></div><span>01 / archive</span></div>
      <div class="mmf-intro-brand">mahimahfud<span>.</span></div>
      <div class="mmf-intro-sub">photographs · motion · moments</div>
    `;
    const style=document.createElement('style');
    style.textContent=`
      .mmf-intro-vignette{position:absolute;inset:-15%;background:radial-gradient(circle at center,transparent 20%,rgba(0,0,0,.45) 62%,rgba(0,0,0,.9) 100%);opacity:0;animation:mmfV 2.4s .15s forwards}
      .mmf-intro-haze{position:absolute;width:120vw;height:30vh;left:-10vw;top:50%;transform:translateY(-50%) rotate(-7deg);background:linear-gradient(90deg,transparent,rgba(238,224,197,.08),transparent);filter:blur(28px);animation:mmfH 2.3s .15s cubic-bezier(.22,1,.36,1) forwards}
      .mmf-intro-frame{position:absolute;width:min(54vw,560px);aspect-ratio:1.48;border:1px solid rgba(245,239,227,.12);box-shadow:0 40px 120px rgba(0,0,0,.45);opacity:0;transform:translateY(22px) scale(.94) rotate(-2deg);animation:mmfF 1.25s .35s cubic-bezier(.22,1,.36,1) forwards;overflow:hidden;background:radial-gradient(circle at 35% 35%,rgba(210,194,162,.16),transparent 38%),linear-gradient(120deg,#141412,#080807 70%)}
      .mmf-intro-frame:after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 35%,rgba(255,246,222,.08) 50%,transparent 65%);transform:translateX(-120%);animation:mmfS 1.7s .55s cubic-bezier(.22,1,.36,1) forwards}
      .mmf-intro-frame span{position:absolute;left:16px;bottom:12px;font:9px/1 "DM Sans",sans-serif;letter-spacing:.16em;color:rgba(242,239,232,.42);z-index:2}
      .mmf-intro-brand{position:relative;z-index:3;font:500 clamp(28px,5vw,56px)/1 "Manrope",sans-serif;letter-spacing:.08em;color:#f2efe8;opacity:0;filter:blur(10px);animation:mmfB 1.1s .65s cubic-bezier(.22,1,.36,1) forwards}
      .mmf-intro-brand span{color:#8b857a}
      .mmf-intro-sub{position:absolute;z-index:3;bottom:11vh;font:9px/1 "DM Sans",sans-serif;letter-spacing:.23em;text-transform:uppercase;color:rgba(242,239,232,.4);opacity:0;animation:mmfP .8s 1.05s cubic-bezier(.22,1,.36,1) forwards}
      @keyframes mmfV{to{opacity:1}} @keyframes mmfH{to{transform:translate(18vw,-50%) rotate(-7deg);opacity:1}}
      @keyframes mmfF{to{opacity:1;transform:translateY(0) scale(1) rotate(0)}} @keyframes mmfS{to{transform:translateX(120%)}}
      @keyframes mmfB{to{opacity:1;filter:blur(0);letter-spacing:.12em}} @keyframes mmfP{to{opacity:1}}
      @media(max-width:760px){.mmf-intro-frame{width:76vw}.mmf-intro-sub{bottom:8vh}}
    `;
    document.head.appendChild(style); document.body.appendChild(wrap);

    let finished=false;
    const end=()=>{if(finished)return;finished=true;window.removeEventListener('keydown',end);try{sessionStorage.setItem('mmf-intro-v2','1')}catch{}wrap.style.opacity='0';setTimeout(()=>{wrap.remove();style.remove();done()},880)};
    wrap.addEventListener('pointerdown',end,{once:true});
    window.addEventListener('keydown',end,{once:true});
    setTimeout(end,2800);
  });
}

const IMAGE_POOL=[
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=78',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=78',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=78',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=78',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=78'
];

export function atmosphere(root){
  if(REDUCED) return;
  try{
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    if(!renderer.getContext()) throw new Error('WebGL unavailable');
    renderer.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1:1.35));
    renderer.setSize(innerWidth,innerHeight,false);
    renderer.domElement.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none';
    root.appendChild(renderer.domElement);

    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,40);
    camera.position.z=8;

    const ambient=new THREE.Group(); scene.add(ambient);

    const dustCount=MOBILE?220:500;
    const pa=new Float32Array(dustCount*3);
    for(let i=0;i<dustCount;i++){
      pa[i*3]=(Math.random()-.5)*11;
      pa[i*3+1]=(Math.random()-.5)*7;
      pa[i*3+2]=(Math.random()-.5)*6;
    }
    const pg=new THREE.BufferGeometry();
    pg.setAttribute('position',new THREE.BufferAttribute(pa,3));
    const dust=new THREE.Points(pg,new THREE.PointsMaterial({
      color:0xded4c6,size:MOBILE?0.025:0.022,transparent:true,opacity:.22,depthWrite:false
    }));
    ambient.add(dust);

    const loader=new THREE.TextureLoader();
    const frames=[];
    IMAGE_POOL.forEach((url,i)=>{
      loader.load(url,texture=>{
        texture.colorSpace=THREE.SRGBColorSpace;
        const material=new THREE.MeshBasicMaterial({
          map:texture,transparent:true,opacity:.12,depthWrite:false
        });
        const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.7,1.8),material);
        mesh.position.set((i-2)*1.55,(i%2?.55:-.55),-2.5-i*.35);
        mesh.rotation.z=(i-2)*.035;
        mesh.userData={baseX:mesh.position.x,baseY:mesh.position.y,phase:i*.9};
        ambient.add(mesh); frames.push(mesh);
      });
    });

    const halo=new THREE.Mesh(
      new THREE.CircleGeometry(2.5,96),
      new THREE.MeshBasicMaterial({color:0xb3a080,transparent:true,opacity:.028,depthWrite:false,blending:THREE.AdditiveBlending})
    );
    halo.position.z=-1.2; ambient.add(halo);

    let raf=0,last=performance.now(),visible=true,time=0,mx=0,my=0;
    addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)},{passive:true});
    const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);renderer.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1:1.35))};
    addEventListener('resize',resize);

    const frame=now=>{
      if(!visible)return;
      raf=requestAnimationFrame(frame);
      const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;
      camera.position.x+=(mx*.24-camera.position.x)*.035;
      camera.position.y+=(-my*.18-camera.position.y)*.035;
      ambient.rotation.z+=dt*.004;
      dust.rotation.y+=dt*.008;
      const a=pg.attributes.position.array;
      for(let i=0;i<dustCount;i++){a[i*3+1]+=dt*.012;if(a[i*3+1]>3.8)a[i*3+1]=-3.8}
      pg.attributes.position.needsUpdate=true;
      frames.forEach((m,i)=>{
        m.position.x=m.userData.baseX+Math.sin(time*.22+m.userData.phase)*.08+mx*.16*(i%2?1:-1);
        m.position.y=m.userData.baseY+Math.cos(time*.18+m.userData.phase)*.05+my*.08;
        m.rotation.y=Math.sin(time*.24+m.userData.phase)*.045;
        m.rotation.z+=(i-2)*.000004;
      });
      halo.scale.setScalar(1+Math.sin(time*.5)*.025);
      renderer.render(scene,camera);
    };

    const resume=()=>{visible=true;last=performance.now();raf=requestAnimationFrame(frame)};
    const pause=()=>{visible=false;cancelAnimationFrame(raf)};
    document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();pause();renderer.domElement.remove()});
    resume();
  }catch(err){console.warn('Cinematic WebGL fallback',err)}
}