  const canvas = document.getElementById('matrix-bg');
  const ctx = canvas.getContext('2d');
  const chars = 'YARLIN';
  const fontSize = 14;
  let drops = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 255, 65, 0.4)';
    ctx.font = fontSize + 'px monospace';

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = Math.random() > 0.95 ? 'rgba(255, 255, 255, 0.4)'
  : 'rgba(0, 255, 65, 0.3)';
      ctx.fillText(char, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 30);


  const CS   = 240;          // tamanho do canvas em px
    const CELL = 24;           // px por unidade
    const MID  = CS / 2;       // centro = ponto (0,0)
 
    function desenhar(dados) {
      const cv  = document.getElementById('calc-canvas');
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, CS, CS);
 
      // pega as cores das variáveis CSS
      const s   = getComputedStyle(document.documentElement);
      const cGrade  = 'rgba(0,255,65,0.06)';
      const cEixo   = 'rgba(0,255,65,0.2)';
      const cTexto  = 'rgba(0,255,65,0.3)';
      const cReta   = s.getPropertyValue('--cor-reta').trim()   || '#00aaff';
      const cPonto1 = s.getPropertyValue('--cor-ponto1').trim() || '#ff4444';
      const cPonto2 = s.getPropertyValue('--cor-ponto2').trim() || '#00ff41';
 
      // grade
      ctx.strokeStyle = cGrade;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= CS; i += CELL) {
        ctx.beginPath(); ctx.moveTo(i, 0);  ctx.lineTo(i, CS);  ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i);  ctx.lineTo(CS, i);  ctx.stroke();
      }
 
      // eixos
      ctx.strokeStyle = cEixo;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, MID); ctx.lineTo(CS, MID); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(MID, 0); ctx.lineTo(MID, CS); ctx.stroke();
 
      // setas
      ctx.fillStyle = cEixo;
      ctx.beginPath(); ctx.moveTo(CS-6,MID-4); ctx.lineTo(CS,MID); ctx.lineTo(CS-6,MID+4); ctx.fill();
      ctx.beginPath(); ctx.moveTo(MID-4,6);    ctx.lineTo(MID,0);  ctx.lineTo(MID+4,6);    ctx.fill();
 
      // labels
      ctx.fillStyle = cTexto;
      ctx.font = '10px Courier New';
      ctx.fillText('x', CS-11, MID-6);
      ctx.fillText('y', MID+5, 10);
      ctx.fillText('0', MID+3, MID+12);
 
      // numeração
      ctx.font = '8px Courier New';
      for (let v = -4; v <= 4; v++) {
        if (v === 0) continue;
        ctx.fillText( v,  MID + v*CELL - 3, MID + 12);
        ctx.fillText(-v,  MID + 4,          MID + v*CELL + 3);
      }
 
      if (!dados) return;
 
      // converte coord matemática → pixel
      const px = (x, y) => ({ x: MID + x*CELL, y: MID - y*CELL });
 
      // reta
      if (dados.a !== undefined) {
        const p1 = px(-5, dados.a*-5 + dados.b);
        const p2 = px( 5, dados.a* 5 + dados.b);
        ctx.strokeStyle = cReta;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
      }
 
      // ponto 1
      if (dados.p1) {
        const p = px(dados.p1.x, dados.p1.y);
        ctx.fillStyle = cPonto1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
        ctx.font = '9px Courier New';
        ctx.fillText(`(${dados.p1.x},${dados.p1.y})`, p.x+6, p.y-4);
      }
 
      // ponto 2
      if (dados.p2) {
        const p = px(dados.p2.x, dados.p2.y);
        ctx.fillStyle = cPonto2;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
        ctx.font = '9px Courier New';
        ctx.fillText(`(${dados.p2.x},${dados.p2.y})`, p.x+6, p.y-4);
      }
    }
 
    function fmt(n) {
      const r = Math.round(n * 1000) / 1000;
      return r % 1 === 0 ? r.toString() : r.toFixed(3).replace(/\.?0+$/, '');
    }
 
    function montarFn(a, b) {
      let s = 'y = ';
      if      (a === 0)  { }
      else if (a === 1)  { s += 'x'; }
      else if (a === -1) { s += '-x'; }
      else               { s += fmt(a) + 'x'; }
      if      (b > 0 && a !== 0) { s += ' + ' + fmt(b); }
      else if (b < 0 && a !== 0) { s += ' - ' + fmt(Math.abs(b)); }
      else if (a === 0)           { s += fmt(b); }
      return s;
    }
 
    function calcular() {
      const x1 = parseFloat(document.getElementById('x1').value);
      const y1 = parseFloat(document.getElementById('y1').value);
      const x2 = parseFloat(document.getElementById('x2').value);
      const y2 = parseFloat(document.getElementById('y2').value);
 
      const erro      = document.getElementById('calc-erro');
      const resultado = document.getElementById('calc-resultado');
 
      if ([x1,y1,x2,y2].some(isNaN)) return;
 
      if (x1 === x2) {
        erro.style.display      = 'block';
        resultado.style.display = 'none';
        desenhar();
        return;
      }
      erro.style.display = 'none';
 
      const a = (y2 - y1) / (x2 - x1);
      const b = y1 - a * x1;
 
      desenhar({ a, b, p1:{x:x1,y:y1}, p2:{x:x2,y:y2} });
 
      document.getElementById('calc-formula').textContent = montarFn(a, b);
 
      const passos = [
        { n:'1', d:false, h:`<strong>coeficiente angular (a):</strong><br>
          <span class="op">a = (y₂ − y₁) / (x₂ − x₁)</span><br>
          a = (${fmt(y2)} − ${fmt(y1)}) / (${fmt(x2)} − ${fmt(x1)}) = <strong class="valor">${fmt(a)}</strong>` },
        { n:'2', d:false, h:`<strong>coeficiente linear (b):</strong><br>
          <span class="op">b = y₁ − a × x₁</span><br>
          b = ${fmt(y1)} − (${fmt(a)} × ${fmt(x1)}) = <strong class="valor">${fmt(b)}</strong>` },
        { n:'3', d:false, h:`<strong>verificação com o 2º ponto:</strong><br>
          y = ${fmt(a)} × ${fmt(x2)} + ${fmt(b)} = <strong class="valor">${fmt(a*x2+b)}</strong>
          ${Math.abs(a*x2+b-y2)<0.001 ? '✓ correto' : '⚠ erro'}` },
        { n:'∴', d:true,  h:`<strong>função:</strong> <span class="valor">${montarFn(a,b)}</span><br>
          <span style="font-size:11px;color:var(--cor-texto-muted)">a = ${fmt(a)} (inclinação) &nbsp;|&nbsp; b = ${fmt(b)} (onde cruza o eixo y)</span>` }
      ];
 
      document.getElementById('calc-steps').innerHTML = passos.map(p =>
        `<div class="calc-step ${p.d?'destaque':''}">
           <span class="calc-step-num">${p.n}</span>
           <span class="calc-step-texto">${p.h}</span>
         </div>`
      ).join('');
 
      resultado.style.display = 'block';
    }
 
    document.querySelectorAll('input').forEach(i =>
      i.addEventListener('keydown', e => { if(e.key==='Enter') calcular(); })
    );
 
    desenhar();