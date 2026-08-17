/* ============================================================
   Barra de tópicos de cada case, no padrão do HackNews, em modo
   ROLAGEM CONTÍNUA: todas as seções ficam visíveis, empilhadas,
   e a barra acompanha a rolagem acendendo o tópico em que o
   leitor está. Clicar num tópico rola até ele.

   A página só precisa dos painéis:
     <section class="pane" id="p-resumo" data-aba="Resumo">…</section>

   Links profundos continuam valendo: #aba=p-blueprint rola até a
   seção, e âncoras internas (#friccoes) rolam normalmente.
   ============================================================ */
(function () {
  function montar() {
    var panes = [].slice.call(document.querySelectorAll('section.pane[data-aba]'));
    if (panes.length < 2) return;

    /* rolagem contínua: nenhum painel escondido */
    panes.forEach(function (p) { p.classList.add('on'); });

    var barra = document.createElement('nav');
    barra.className = 'tabs';
    barra.setAttribute('aria-label', 'Seções do case');
    var miolo = document.createElement('div');
    miolo.className = 'tinner';
    barra.appendChild(miolo);

    var botoes = panes.map(function (pane, i) {
      var b = document.createElement('button');
      b.className = 'tab';
      b.type = 'button';
      b.innerHTML = '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
                    pane.getAttribute('data-aba');
      b.addEventListener('click', function () { rolarPara(i); });
      miolo.appendChild(b);
      return b;
    });

    var host = panes[0].parentNode;
    host.insertBefore(barra, panes[0]);

    function alturaFixa() {
      var nav = document.querySelector('.nav');
      return (nav ? nav.offsetHeight : 0) + barra.offsetHeight;
    }

    function rolarPara(i) {
      var y = panes[i].getBoundingClientRect().top + window.scrollY - alturaFixa() - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
      try { history.replaceState(null, '', '#aba=' + panes[i].id); } catch (e) {}
    }

    /* ---------- a barra acompanha a rolagem ---------- */
    var atual = -1;
    function marcar() {
      var linha = window.scrollY + alturaFixa() + Math.min(160, window.innerHeight * 0.25);
      var i = 0;
      for (var k = 0; k < panes.length; k++) {
        if (panes[k].offsetTop <= linha) i = k;
      }
      /* no fim da página, acende o último */
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        i = panes.length - 1;
      }
      if (i === atual) return;
      atual = i;
      botoes.forEach(function (b, k) { b.classList.toggle('on', k === i); });
      var b = botoes[i];
      if (b.offsetLeft < miolo.scrollLeft ||
          b.offsetLeft + b.offsetWidth > miolo.scrollLeft + miolo.clientWidth) {
        miolo.scrollTo({ left: b.offsetLeft - 60, behavior: 'smooth' });
      }
    }
    marcar();
    window.addEventListener('scroll', marcar, { passive: true });
    window.addEventListener('resize', marcar);

    /* ---------- links profundos ---------- */
    var m = /(?:^|#|&)aba=([\w-]+)/.exec(location.hash);
    if (m) {
      var k = panes.map(function (p) { return p.id; }).indexOf(m[1]);
      if (k >= 0) setTimeout(function () { rolarPara(k); }, 60);
    } else if (location.hash.length > 1) {
      var el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(function () {
        var y = el.getBoundingClientRect().top + window.scrollY - alturaFixa() - 8;
        window.scrollTo({ top: y });
      }, 60);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();
