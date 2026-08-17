/* ============================================================
   Navegação única do Book de Cases.
   Fonte de verdade: a lista PAGES abaixo.
   Cada página só precisa de:  <script src="assets/nav.js"></script>
   O script monta o menu do topo e a paginação do rodapé,
   e marca sozinho a página atual.
   ============================================================ */
(function () {
  var PAGES = [
    { file: 'case-01.html',  menu: 'Case 1',              title: 'Os três ciclos que prendiam o RH' },
    { file: 'case-02.html',  menu: 'Case 2',              title: 'A entrada de quem chega decide o cliente do outro lado' },
    { file: 'case-03.html',  menu: 'Case 3',              title: 'Semana da Inovação em Gente e Gestão' },
    { file: 'case-04.html',  menu: 'Case 4',              title: 'O Radar que mostra o que a empresa quer ser' },
    { file: 'case-05.html',  menu: 'Case 5',              title: 'Guia WOW · Ways of Working' },
    { file: 'case-06.html',  menu: 'Case 6',              title: 'Evento cultural do RH · Pizza Ágil' },
    { file: 'case-07.html',  menu: 'Case 7',              title: 'O RH que experimentou antes de pedir' },
    { file: 'case-08.html',  menu: 'Case 8',              title: 'A captação era o pedido. O problema era a saída' },
    { file: 'pesquisa.html', menu: 'Pesquisa de Mercado', title: 'Oito anatomias do RH' }
  ];

  function currentFile() {
    var p = location.pathname.split('/').pop();
    return p && p.length ? p : 'Home.html';
  }

  var here = currentFile();
  var idx = PAGES.map(function (p) { return p.file; }).indexOf(here);

  /* ---------- menu do topo ---------- */
  var nav = document.createElement('div');
  nav.className = 'nav';
  var inner = document.createElement('div');
  inner.className = 'inner';

  var brand = document.createElement('a');
  brand.className = 'brand';
  brand.href = 'Home.html';
  brand.textContent = 'Book de Cases · Eric Leite';
  inner.appendChild(brand);

  PAGES.forEach(function (p, i) {
    var a = document.createElement('a');
    a.className = 'item' + (i === idx ? ' on' : '');  /* idx -1 na capa: nada aceso */
    a.href = p.file;
    a.textContent = p.menu;
    inner.appendChild(a);
  });

  nav.appendChild(inner);
  document.body.insertBefore(nav, document.body.firstChild);

  /* ---------- rodapé, no padrão do ericleite.co ---------- */
  var velho = document.querySelector('footer');
  if (velho) velho.remove();
  var pg = document.getElementById('pager');
  if (pg) pg.remove();

  var foot = document.createElement('footer');
  foot.innerHTML =
    '<div class="foot-row">' +
    '<span class="fcota">©2026 <a href="https://ericleite.co" target="_blank" rel="noopener">ericleite.co</a> · estratégia organizacional · design de soluções</span>' +
    '<span class="fcota foot-leis"><a href="https://ericleite.co/privacidade.html" target="_blank" rel="noopener">Privacidade</a> · <a href="https://ericleite.co/privacidade.html#cookies" target="_blank" rel="noopener">Cookies</a></span>' +
    '<a class="fcota" id="to-top" href="#">voltar pro topo ↑</a>' +
    '</div>';
  document.body.appendChild(foot);
  document.getElementById('to-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- posição, se a página pedir ---------- */
  var pos = document.getElementById('pos');
  if (pos && idx > 0 && idx < PAGES.length - 1) {
    pos.textContent = 'Case ' + String(idx).padStart(2, '0') + ' de ' + (PAGES.length - 2);
  }
})();
