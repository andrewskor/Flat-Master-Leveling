  const canvas = document.getElementById('index-bg');
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

  const S=2.6;
  function shadow(x,y,b,c){ctx.shadowOffsetX=x;ctx.shadowOffsetY=y;ctx.shadowBlur=b;ctx.shadowColor=c;}
  function noShadow(){ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;ctx.shadowBlur=0;ctx.shadowColor='transparent';}

  // ── SPIRIT LEVEL ─────────────────────────────────────
  function drawLevel(x,y,angle,alpha){
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);ctx.scale(S,S);
    shadow(0,4,14,'rgba(0,0,0,0.65)');
    const W2=62,H2=14;
    const bg=ctx.createLinearGradient(0,-H2,0,H2);
    bg.addColorStop(0,'#e06000');bg.addColorStop(0.15,'#f47920');bg.addColorStop(0.5,'#ff9a30');bg.addColorStop(0.85,'#e06000');bg.addColorStop(1,'#902800');
    ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(-W2,-H2,W2*2,H2*2,5);ctx.fill();
    noShadow();
    ctx.fillStyle='rgba(255,200,100,0.3)';ctx.beginPath();ctx.roundRect(-W2,-H2,W2*2,5,[5,5,0,0]);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,0.3)';ctx.beginPath();ctx.roundRect(-W2,H2-5,W2*2,5,[0,0,5,5]);ctx.fill();
    const ec=ctx.createLinearGradient(-W2,0,W2,0);
    ec.addColorStop(0,'#181810');ec.addColorStop(0.08,'#484838');ec.addColorStop(0.92,'#484838');ec.addColorStop(1,'#181810');
    ctx.fillStyle=ec;
    ctx.beginPath();ctx.roundRect(-W2-3,-H2+1,10,H2*2-2,[4,0,0,4]);ctx.fill();
    ctx.beginPath();ctx.roundRect(W2-7,-H2+1,10,H2*2-2,[0,4,4,0]);ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.5)';ctx.lineWidth=1;
    for(let i=-56;i<=56;i+=4){
      const tickH=i%20===0?10:i%8===0?7:4;
      ctx.beginPath();ctx.moveTo(i,-H2);ctx.lineTo(i,-H2+tickH);ctx.stroke();
      ctx.beginPath();ctx.moveTo(i,H2);ctx.lineTo(i,H2-tickH);ctx.stroke();
    }
    ctx.strokeStyle='rgba(255,200,100,0.3)';ctx.lineWidth=0.5;
    for(let i=-56;i<=56;i+=4){ctx.beginPath();ctx.moveTo(i+0.5,-H2);ctx.lineTo(i+0.5,-H2+4);ctx.stroke();}
    function drawVial(vx){
      ctx.fillStyle='#1a1a10';ctx.beginPath();ctx.arc(vx,0,13,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#c04800';ctx.beginPath();ctx.arc(vx,0,11,0,Math.PI*2);ctx.fill();
      const vg=ctx.createRadialGradient(vx-3,-3,1,vx,0,10);
      vg.addColorStop(0,'rgba(180,255,120,0.9)');vg.addColorStop(0.6,'rgba(60,160,40,0.8)');vg.addColorStop(1,'rgba(20,80,10,0.9)');
      ctx.fillStyle=vg;ctx.beginPath();ctx.arc(vx,0,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(220,255,180,0.95)';ctx.beginPath();ctx.ellipse(vx+1,0,4,3,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.7)';ctx.beginPath();ctx.ellipse(vx,-1,1.5,1,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.5)';ctx.lineWidth=0.8;
      ctx.beginPath();ctx.moveTo(vx-5,0);ctx.lineTo(vx-5,-8);ctx.stroke();
      ctx.beginPath();ctx.moveTo(vx+5,0);ctx.lineTo(vx+5,-8);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.15)';ctx.beginPath();ctx.ellipse(vx-3,-4,5,3,Math.PI*0.3,0,Math.PI*2);ctx.fill();
    }
    drawVial(-35);drawVial(35);
    ctx.fillStyle='#1a1a10';ctx.beginPath();ctx.roundRect(-16,-6,32,12,6);ctx.fill();
    ctx.fillStyle='#c04800';ctx.beginPath();ctx.roundRect(-15,-5,30,10,5);ctx.fill();
    const cvg=ctx.createLinearGradient(-14,0,14,0);
    cvg.addColorStop(0,'rgba(20,100,20,0.9)');cvg.addColorStop(0.5,'rgba(60,180,40,0.85)');cvg.addColorStop(1,'rgba(20,100,20,0.9)');
    ctx.fillStyle=cvg;ctx.beginPath();ctx.roundRect(-14,-4,28,8,4);ctx.fill();
    ctx.fillStyle='rgba(200,255,160,0.95)';ctx.beginPath();ctx.ellipse(1,0,3.5,2.5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.beginPath();ctx.ellipse(0,-0.8,1.2,0.8,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.4)';ctx.lineWidth=0.8;
    ctx.beginPath();ctx.moveTo(-5,-4);ctx.lineTo(-5,4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(5,-4);ctx.lineTo(5,4);ctx.stroke();
    ctx.fillStyle='#1a1a10';ctx.beginPath();ctx.arc(54,0,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#383828';ctx.beginPath();ctx.arc(54,0,2.5,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  // ── GAUGE RAKE ───────────────────────────────────────
  function drawGaugeRake(x,y,angle,alpha){
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);ctx.scale(S,S);
    shadow(0,3,10,'rgba(0,0,0,0.5)');
    const pg=ctx.createLinearGradient(-4,0,4,0);
    pg.addColorStop(0,'#585050');pg.addColorStop(0.5,'#d8d0c4');pg.addColorStop(1,'#585050');
    ctx.strokeStyle=pg;ctx.lineWidth=7;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-92);ctx.stroke();
    noShadow();
    const wg=ctx.createLinearGradient(-44,-108,44,-108);
    wg.addColorStop(0,'#5a3808');wg.addColorStop(0.2,'#c8882a');wg.addColorStop(0.5,'#e8a838');wg.addColorStop(0.8,'#c8882a');wg.addColorStop(1,'#5a3808');
    ctx.fillStyle=wg;ctx.beginPath();ctx.roundRect(-44,-114,88,14,4);ctx.fill();
    ctx.strokeStyle='rgba(60,30,0,0.2)';ctx.lineWidth=1;
    for(let i=-38;i<42;i+=7){ctx.beginPath();ctx.moveTo(i,-113);ctx.lineTo(i+4,-101);ctx.stroke();}
    ctx.fillStyle='rgba(255,255,255,0.12)';ctx.beginPath();ctx.roundRect(-43,-113,86,5,2);ctx.fill();
    const lg=ctx.createLinearGradient(-3,0,3,0);
    lg.addColorStop(0,'#606058');lg.addColorStop(0.5,'#c0b8b0');lg.addColorStop(1,'#606058');
    ctx.strokeStyle=lg;ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(-32,-108);ctx.lineTo(-32,-126);ctx.stroke();
    ctx.beginPath();ctx.moveTo(32,-108);ctx.lineTo(32,-126);ctx.stroke();
    const fp=ctx.createLinearGradient(-38,-128,38,-128);
    fp.addColorStop(0,'#404038');fp.addColorStop(0.5,'#a0a098');fp.addColorStop(1,'#404038');
    ctx.fillStyle=fp;
    ctx.beginPath();ctx.roundRect(-38,-128,10,5,2);ctx.fill();
    ctx.beginPath();ctx.roundRect(28,-128,10,5,2);ctx.fill();
    const cg=ctx.createLinearGradient(-7,-116,7,-116);
    cg.addColorStop(0,'#484840');cg.addColorStop(0.5,'#909088');cg.addColorStop(1,'#484840');
    ctx.fillStyle=cg;ctx.beginPath();ctx.roundRect(-7,-116,14,20,3);ctx.fill();
    ctx.restore();
  }

  // ── SPIKED SHOES ─────────────────────────────────────
  function drawSpikedShoe(x,y,angle,alpha){
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);ctx.scale(S,S);
    shadow(0,4,10,'rgba(0,0,0,0.6)');
    const sg=ctx.createLinearGradient(0,-10,0,10);
    sg.addColorStop(0,'#303028');sg.addColorStop(0.6,'#484840');sg.addColorStop(1,'#181810');
    ctx.fillStyle=sg;
    ctx.beginPath();ctx.moveTo(-32,8);ctx.bezierCurveTo(-36,10,36,10,32,8);ctx.bezierCurveTo(36,-4,28,-12,-28,-12);ctx.bezierCurveTo(-36,-12,-36,6,-32,8);ctx.closePath();ctx.fill();
    noShadow();
    ctx.strokeStyle='rgba(120,120,100,0.4)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(-32,8);ctx.bezierCurveTo(-36,10,36,10,32,8);ctx.bezierCurveTo(36,-4,28,-12,-28,-12);ctx.bezierCurveTo(-36,-12,-36,6,-32,8);ctx.closePath();ctx.stroke();
    const stg=ctx.createLinearGradient(0,-16,0,-8);stg.addColorStop(0,'#282820');stg.addColorStop(1,'#484840');
    ctx.fillStyle=stg;ctx.beginPath();ctx.roundRect(-30,-16,60,7,3);ctx.fill();
    ctx.beginPath();ctx.roundRect(-22,-23,44,7,3);ctx.fill();
    ctx.strokeStyle='#c8b860';ctx.lineWidth=2.5;ctx.strokeRect(-7,-26,14,9);
    ctx.fillStyle='#a09040';ctx.fillRect(-1,-25,2,7);
    const spkG=ctx.createRadialGradient(0,0,0,0,0,3);spkG.addColorStop(0,'#f0e8d8');spkG.addColorStop(1,'#808070');
    ctx.fillStyle=spkG;
    [[-22,12],[-12,12],[-2,12],[8,12],[18,12],[-17,5],[0,5],[16,5]].forEach(([sx,sy])=>{
      ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-2.5,sy+10);ctx.lineTo(sx+2.5,sy+10);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-0.5,sy+5);ctx.stroke();
    });
    ctx.restore();
  }

  // ── RED SQUEEGEE ─────────────────────────────────────
  function drawRedSqueegee(x,y,angle,alpha){
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);ctx.scale(S,S);
    shadow(0,3,10,'rgba(0,0,0,0.5)');
    const hg=ctx.createLinearGradient(-5,0,5,0);hg.addColorStop(0,'#7a1808');hg.addColorStop(0.4,'#e83818');hg.addColorStop(1,'#7a1808');
    ctx.strokeStyle=hg;ctx.lineWidth=9;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-88);ctx.stroke();
    noShadow();
    ctx.strokeStyle='rgba(0,0,0,0.25)';ctx.lineWidth=11;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(0,-58);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle='rgba(255,150,100,0.2)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-2,0);ctx.lineTo(-2,-88);ctx.stroke();
    const ng=ctx.createLinearGradient(-6,-88,6,-88);ng.addColorStop(0,'#404038');ng.addColorStop(0.5,'#c8c0b8');ng.addColorStop(1,'#404038');
    ctx.strokeStyle=ng;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(0,-84);ctx.lineTo(0,-96);ctx.stroke();
    const bhg=ctx.createLinearGradient(-40,-100,40,-100);bhg.addColorStop(0,'#303028');bhg.addColorStop(0.5,'#b0a8a0');bhg.addColorStop(1,'#303028');
    ctx.fillStyle=bhg;ctx.beginPath();ctx.roundRect(-40,-104,80,11,3);ctx.fill();
    const rg=ctx.createLinearGradient(-38,-114,38,-114);rg.addColorStop(0,'#8a1008');rg.addColorStop(0.3,'#e02010');rg.addColorStop(0.7,'#e02010');rg.addColorStop(1,'#8a1008');
    ctx.fillStyle=rg;ctx.beginPath();ctx.roundRect(-38,-115,76,12,2);ctx.fill();
    ctx.fillStyle='rgba(255,180,160,0.25)';ctx.beginPath();ctx.roundRect(-35,-114,70,4,1);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,0.4)';ctx.beginPath();ctx.roundRect(-38,-104,76,3,1);ctx.fill();
    ctx.restore();
  }

  // ── MIXING PADDLE ────────────────────────────────────
  function drawMixingPaddle(x,y,angle,alpha){
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);ctx.scale(S,S);
    shadow(0,3,10,'rgba(0,0,0,0.5)');
    const sg=ctx.createLinearGradient(-4,0,4,0);sg.addColorStop(0,'#484840');sg.addColorStop(0.5,'#d0c8bc');sg.addColorStop(1,'#484840');
    ctx.strokeStyle=sg;ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-82);ctx.stroke();
    noShadow();
    const cg=ctx.createLinearGradient(-6,-8,6,-8);cg.addColorStop(0,'#282820');cg.addColorStop(0.5,'#606058');cg.addColorStop(1,'#282820');
    ctx.fillStyle=cg;ctx.beginPath();ctx.roundRect(-6,-10,12,14,3);ctx.fill();
    ctx.lineWidth=3.5;ctx.lineCap='round';ctx.lineJoin='round';
    const wireG=ctx.createLinearGradient(-20,-130,20,-130);wireG.addColorStop(0,'#808078');wireG.addColorStop(0.5,'#e8e0d0');wireG.addColorStop(1,'#808078');
    ctx.strokeStyle=wireG;
    ctx.beginPath();ctx.moveTo(0,-82);ctx.bezierCurveTo(-22,-92,-24,-106,-8,-112);ctx.bezierCurveTo(8,-118,10,-130,-8,-136);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,-82);ctx.bezierCurveTo(22,-92,24,-106,8,-112);ctx.bezierCurveTo(-8,-118,-10,-130,8,-136);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-8,-136);ctx.bezierCurveTo(-10,-142,10,-142,8,-136);ctx.stroke();
    ctx.strokeStyle='#a09888';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(-20,-108);ctx.lineTo(20,-108);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-16,-120);ctx.lineTo(16,-120);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(-1,-82);ctx.bezierCurveTo(-23,-92,-25,-106,-9,-112);ctx.stroke();
    ctx.restore();
  }

  // ── TROWEL ───────────────────────────────────────────
  function drawTrowel(x,y,angle,alpha){
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);ctx.scale(S,S);
    shadow(0,3,10,'rgba(0,0,0,0.5)');
    const hg=ctx.createLinearGradient(-6,0,6,0);hg.addColorStop(0,'#4a2e08');hg.addColorStop(0.4,'#c8882a');hg.addColorStop(1,'#4a2e08');
    ctx.fillStyle=hg;ctx.beginPath();ctx.roundRect(-6,0,12,54,5);ctx.fill();
    noShadow();
    ctx.fillStyle='rgba(0,0,0,0.3)';
    for(let i=0;i<4;i++){ctx.beginPath();ctx.roundRect(-6,8+i*10,12,5,2);ctx.fill();}
    const bg=ctx.createLinearGradient(-10,-10,10,-10);bg.addColorStop(0,'#404038');bg.addColorStop(0.5,'#b0a8a0');bg.addColorStop(1,'#404038');
    ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(-10,-10,20,13,3);ctx.fill();
    const blg=ctx.createLinearGradient(-20,-12,20,-12);blg.addColorStop(0,'#707068');blg.addColorStop(0.3,'#d8d0c8');blg.addColorStop(0.7,'#f0e8e0');blg.addColorStop(1,'#707068');
    ctx.fillStyle=blg;ctx.beginPath();ctx.moveTo(-22,-14);ctx.lineTo(22,-14);ctx.lineTo(10,-78);ctx.lineTo(-10,-78);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.25)';ctx.beginPath();ctx.moveTo(-5,-16);ctx.lineTo(5,-16);ctx.lineTo(3,-73);ctx.lineTo(-3,-73);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(-22,-14);ctx.lineTo(-10,-78);ctx.stroke();
    ctx.beginPath();ctx.moveTo(22,-14);ctx.lineTo(10,-78);ctx.stroke();
    ctx.restore();
  }

  function makeTool(type,W,H){return{type,x:Math.random()*W,y:Math.random()*H,angle:Math.random()*Math.PI*2,dx:(Math.random()-0.5)*0.35,dy:(Math.random()-0.5)*0.35,rotSpeed:(Math.random()-0.5)*0.0025,alpha:0.5+Math.random()*0.3,phaseOffset:Math.random()*Math.PI*2};}

  let tools=[];
  function initTools(){
    const W=canvas.width,H=canvas.height;
    tools=[
      makeTool('level',W,H),
      makeTool('rake',W,H),
      makeTool('shoe',W,H),
      makeTool('squeegee',W,H),
      makeTool('paddle',W,H),
      makeTool('trowel',W,H),
    ];
  }
  initTools(); window.addEventListener('resize',initTools);

  function updateTools(){
    const W=canvas.width,H=canvas.height,pad=240;
    tools.forEach(tool=>{
      tool.x+=tool.dx+Math.sin(t*0.3+tool.phaseOffset)*0.15;
      tool.y+=tool.dy+Math.cos(t*0.25+tool.phaseOffset)*0.15;
      tool.angle+=tool.rotSpeed;
      if(tool.x<-pad)tool.x=W+pad;if(tool.x>W+pad)tool.x=-pad;
      if(tool.y<-pad)tool.y=H+pad;if(tool.y>H+pad)tool.y=-pad;
    });
  }

  function drawAllTools(){
    tools.forEach(tool=>{
      if(tool.type==='level')    drawLevel(tool.x,tool.y,tool.angle,tool.alpha);
      if(tool.type==='rake')     drawGaugeRake(tool.x,tool.y,tool.angle,tool.alpha);
      if(tool.type==='shoe')     drawSpikedShoe(tool.x,tool.y,tool.angle,tool.alpha);
      if(tool.type==='squeegee') drawRedSqueegee(tool.x,tool.y,tool.angle,tool.alpha);
      if(tool.type==='paddle')   drawMixingPaddle(tool.x,tool.y,tool.angle,tool.alpha);
      if(tool.type==='trowel')   drawTrowel(tool.x,tool.y,tool.angle,tool.alpha);
    });
  }

  function draw(){drawMarble();updateTools();drawAllTools();t+=0.008;requestAnimationFrame(draw);}
  draw();
