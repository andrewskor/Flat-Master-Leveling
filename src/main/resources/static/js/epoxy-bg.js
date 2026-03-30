(function () {
  const canvas = document.getElementById('epoxy-bg');
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; }
  resize(); window.addEventListener('resize',resize);
  let t=0;

  const stops=[
    [0,5,15],
    [0,10,25],
    [2,18,40],
    [5,30,70],
    [8,55,110],
    [10,90,160],
    [15,130,200],
    [20,165,220],
    [40,190,235],
    [80,220,255],
  ];
  function sampleColor(v){const n=(v+1)/2,idx=n*(stops.length-1),lo=Math.floor(idx),hi=Math.min(lo+1,stops.length-1),f=idx-lo;return[stops[lo][0]+(stops[hi][0]-stops[lo][0])*f,stops[lo][1]+(stops[hi][1]-stops[lo][1])*f,stops[lo][2]+(stops[hi][2]-stops[lo][2])*f];}
  function fbm(x,y,t){const a1=Math.sin(x*1.4+y*0.9+t*0.18)*Math.cos(y*1.6-x*0.6-t*0.12);const a2=Math.sin(x*2.5-y*1.8+t*0.22)*Math.cos(x*1.1+y*2.0+t*0.14);const a3=Math.cos(x*3.3+y*1.1-t*0.16)*Math.sin(y*2.7-x*1.5+t*0.19);return a1*0.5+a2*0.35+a3*0.15;}

  function drawMarble(){
    const W=canvas.width,H=canvas.height,SW=Math.floor(W/3),SH=Math.floor(H/3);
    const off=document.createElement('canvas');off.width=SW;off.height=SH;
    const oc=off.getContext('2d'),img=oc.createImageData(SW,SH),d=img.data;
    for(let y=0;y<SH;y++)for(let x=0;x<SW;x++){
      const nx=x/SW,ny=y/SH,w1=fbm(nx*2.2,ny*2.2,t),w2=fbm(nx*2.2+w1*1.0+5.2,ny*2.2+w1*0.7+1.7,t*1.05);
      const wx=nx+w1*0.45,wy=ny+w2*0.45;
      const bands=Math.sin((wx*3.2+wy*2.2+w1*2.0+w2*1.4)*Math.PI+t*0.25);
      const vein=Math.pow(Math.max(0,Math.sin((wx*5+wy*3.2+w2*2.5)*Math.PI*1.5-t*0.3)),5);
      const swirl=fbm(wx*2.8+w2,wy*4-w1,t*0.8);
      let v=Math.max(-1,Math.min(1,bands*0.55+swirl*0.3+vein*0.5-0.15));
      const[r,g,b]=sampleColor(v);const micro=Math.sin(nx*25+ny*20+t)*2;const sheen=Math.pow(Math.max(0,Math.sin(wx*3+wy*2+t*0.6)),8)*35;
      const i=(y*SW+x)*4;d[i]=Math.min(255,r+sheen+micro);d[i+1]=Math.min(255,g+sheen);d[i+2]=Math.min(255,b+sheen-micro*0.5);d[i+3]=255;
    }
    oc.putImageData(img,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(off,0,0,W,H);
    const gl=ctx.createLinearGradient(0,0,W*0.6,H*0.4);
    gl.addColorStop(0,'rgba(255,255,255,0)');gl.addColorStop(0.4,'rgba(255,255,255,0.06)');
    gl.addColorStop(0.55,'rgba(255,255,255,0.13)');gl.addColorStop(0.7,'rgba(255,255,255,0.04)');
    gl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=gl;ctx.fillRect(0,0,W,H);
  }

  function draw(){drawMarble();t+=0.008;requestAnimationFrame(draw);}
  draw();
})();