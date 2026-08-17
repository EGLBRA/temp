/* ============================================================
   Ciclos causais na capa do book.

   Cada laço nasce em tom quente, fecha o círculo e vira azul.
   É o método que atravessa os oito cases: ciclo vicioso nunca
   aparece sozinho, sempre com o virtuoso desenhado ao lado.

   Sem biblioteca, 30 quadros por segundo, para quando a capa
   sai da tela ou quando a aba perde o foco, e obedece a
   preferência de menos movimento do sistema.
   ============================================================ */
(function capaCiclos() {
  var cv = document.getElementById('capa-ciclos');
  if (!cv) return;

  var capa = cv.parentNode;
  var ctx = cv.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;

  var menosMovimento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var QUENTE = '201,106,82';   /* o vicioso, o mesmo tom dos diagramas dos cases */
  var AZUL = '125,151,255';    /* o virtuoso, o azul do ericleite.co */
  var GIZ = '232,229,223';

  var semente = 20260817;
  function sorte() {
    semente = (semente * 16807) % 2147483647;
    return (semente - 1) / 2147483646;
  }

  function medir() {
    var r = capa.getBoundingClientRect();
    W = Math.round(r.width);
    H = Math.round(r.height);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ---------- um ciclo ---------- */
  var ciclos = [];

  function novo(t) {
    var nos = 3;                       /* três nós: o laço dos três problemas */
    var raio = 52 + sorte() * 78;
    /* nascem da metade direita para diante, onde o texto da capa não vai */
    var cx = W * 0.48 + sorte() * (W * 0.46);
    var cy = raio + 12 + sorte() * Math.max(24, H - raio * 2 - 24);
    var giro = sorte() * Math.PI * 2;
    var pontos = [];
    for (var i = 0; i < nos; i++) {
      var a = giro + i * (Math.PI * 2 / nos);
      pontos.push([cx + Math.cos(a) * raio, cy + Math.sin(a) * raio]);
    }
    ciclos.push({ nos: pontos, t: t || 0, dur: 500 + Math.floor(sorte() * 220) });
  }

  /* curva de um nó ao seguinte, abaulada para fora do círculo */
  function arco(a, b, cx, cy) {
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    var dx = mx - cx, dy = my - cy;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    return [a, [mx + dx / d * d * 0.44, my + dy / d * d * 0.44], b];
  }

  function ponto(p, u) {
    var v = 1 - u;
    return [
      v * v * p[0][0] + 2 * v * u * p[1][0] + u * u * p[2][0],
      v * v * p[0][1] + 2 * v * u * p[1][1] + u * u * p[2][1]
    ];
  }

  function traco(p, u0, u1, cor, alfa, larg) {
    if (u1 <= u0 || alfa <= 0.004) return;
    ctx.beginPath();
    for (var k = 0; k <= 20; k++) {
      var q = ponto(p, u0 + (u1 - u0) * (k / 20));
      if (k === 0) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]);
    }
    ctx.strokeStyle = 'rgba(' + cor + ',' + alfa + ')';
    ctx.lineWidth = larg;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function seta(p, cor, alfa) {
    if (alfa <= 0.004) return;
    var q = ponto(p, 1), r = ponto(p, 0.93);
    var ang = Math.atan2(q[1] - r[1], q[0] - r[0]);
    var L = 8.5;
    ctx.beginPath();
    ctx.moveTo(q[0], q[1]);
    ctx.lineTo(q[0] - Math.cos(ang - 0.42) * L, q[1] - Math.sin(ang - 0.42) * L);
    ctx.lineTo(q[0] - Math.cos(ang + 0.42) * L, q[1] - Math.sin(ang + 0.42) * L);
    ctx.closePath();
    ctx.fillStyle = 'rgba(' + cor + ',' + alfa + ')';
    ctx.fill();
  }

  /* fases: desenha o vicioso, respira, vira virtuoso, esvanece */
  function desenha(c) {
    var f = c.t / c.dur;
    var vel = 1;
    if (f < 0.05) vel = f / 0.05;
    if (f > 0.84) vel = 1 - (f - 0.84) / 0.16;
    vel = Math.max(0, Math.min(1, vel));

    var n = c.nos.length, i;
    var cx = 0, cy = 0;
    for (i = 0; i < n; i++) { cx += c.nos[i][0]; cy += c.nos[i][1]; }
    cx /= n; cy /= n;

    var desenhado = Math.min(1, f / 0.46);
    var virou = f < 0.60 ? 0 : Math.min(1, (f - 0.60) / 0.22);

    for (i = 0; i < n; i++) {
      var p = arco(c.nos[i], c.nos[(i + 1) % n], cx, cy);
      var ini = i / n, fim = (i + 1) / n;
      var d = (desenhado - ini) / (fim - ini);
      if (d <= 0) continue;
      d = Math.min(1, d);
      var v = Math.max(0, Math.min(1, (virou - ini) / (fim - ini)));

      if (v < 1) traco(p, Math.min(d, v), d, QUENTE, 0.36 * vel, 1.6);
      if (v > 0) traco(p, 0, Math.min(d, v), AZUL, 0.58 * vel, 1.9);
      if (d >= 1) seta(p, v >= 1 ? AZUL : QUENTE, (v >= 1 ? 0.58 : 0.36) * vel);
    }

    for (i = 0; i < n; i++) {
      var ap = Math.min(1, Math.max(0, desenhado * n - i + 0.4));
      if (ap <= 0) continue;
      ctx.beginPath();
      ctx.arc(c.nos[i][0], c.nos[i][1], 4.6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(' + GIZ + ',' + (0.32 * vel * ap) + ')';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }

  /* ---------- laço de animação ---------- */
  var PASSO = 1000 / 30;
  var ultimo = 0, espera = 0, visivel = true, ligado = false;

  function quadro(ts) {
    if (!ligado) return;
    if (ts - ultimo >= PASSO) {
      ultimo = ts;
      ctx.clearRect(0, 0, W, H);
      for (var i = ciclos.length - 1; i >= 0; i--) {
        ciclos[i].t += 1;
        if (ciclos[i].t >= ciclos[i].dur) { ciclos.splice(i, 1); continue; }
        desenha(ciclos[i]);
      }
      espera += 1;
      if (ciclos.length < 3 && espera > 74) { espera = 0; novo(0); }
    }
    requestAnimationFrame(quadro);
  }

  function liga() {
    if (ligado || !visivel || document.hidden) return;
    ligado = true;
    ultimo = 0;
    requestAnimationFrame(quadro);
  }

  function desliga() { ligado = false; }

  function estatico() {
    ctx.clearRect(0, 0, W, H);
    ciclos = [];
    novo(0); novo(0);
    for (var i = 0; i < ciclos.length; i++) {
      ciclos[i].t = Math.round(ciclos[i].dur * 0.78);
      desenha(ciclos[i]);
    }
  }

  function comecar() {
    medir();
    ciclos = [];
    if (W < 720) { ctx.clearRect(0, 0, W, H); return; }   /* no celular a capa fica limpa */
    if (menosMovimento) { estatico(); return; }
    novo(0);
    novo(Math.round(260));
    liga();
  }

  comecar();

  var espera_resize = null;
  window.addEventListener('resize', function () {
    clearTimeout(espera_resize);
    espera_resize = setTimeout(function () { desliga(); comecar(); }, 180);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) desliga(); else liga();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      visivel = entradas[0].isIntersecting;
      if (visivel) liga(); else desliga();
    }, { threshold: 0 }).observe(capa);
  }
})();
