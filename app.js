// Portfólio v2: tema, cópia do e-mail, entrada suave e conferência ao vivo no GitHub.
(function () {
  var raiz = document.documentElement;
  raiz.classList.add('js');

  // ---- tema (noite/papel), lembrado no navegador quando possível ----
  var botaoTema = document.querySelector('.tema');
  function aplicarTema(tema) {
    raiz.setAttribute('data-theme', tema);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', tema === 'papel' ? '#f3efe4' : '#0c0d0b');
    if (botaoTema) {
      botaoTema.setAttribute('aria-label', tema === 'papel' ? 'Trocar para o dark mode' : 'Trocar para o light mode');
    }
  }
  var salvo = null;
  try { salvo = localStorage.getItem('tema'); } catch (e) { salvo = null; }
  if (salvo === 'papel' || salvo === 'noite') aplicarTema(salvo);
  if (botaoTema) {
    botaoTema.addEventListener('click', function () {
      var novo = raiz.getAttribute('data-theme') === 'papel' ? 'noite' : 'papel';
      aplicarTema(novo);
      try { localStorage.setItem('tema', novo); } catch (e) { /* sem armazenamento: só vale nesta visita */ }
    });
  }

  // ---- copiar e-mail ----
  var copiar = document.querySelector('.copiar');
  var aviso = document.getElementById('copiado');
  if (copiar) {
    copiar.addEventListener('click', function () {
      var email = 'pedrohferreira98@hotmail.com';
      var ok = function () { aviso.textContent = 'copiado'; setTimeout(function () { aviso.textContent = ''; }, 2200); };
      var falhou = function () { aviso.textContent = 'selecione e copie o endereço ao lado'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(ok, falhou);
      } else {
        falhou();
      }
    });
  }

  // ---- entrada suave das seções ----
  var alvos = document.querySelectorAll('.janela-area, .regra, .bloco h2, .grupo, .item, .tempo li, .stack > div, .contato .email');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    alvos.forEach(function (el) { el.classList.add('surge'); obs.observe(el); });
  }

  // ---- conferência ao vivo: commits no PratoFácil, direto da API pública do GitHub ----
  // Se a API não responder (limite de requisições, sem rede), fica o número conferido à mão.
  var REPO = 'marciodosanjos/pratoFacil';
  var EU = 'ferreiradrope';
  fetch('https://api.github.com/repos/' + REPO + '/contributors?per_page=100', {
    headers: { Accept: 'application/vnd.github+json' }
  })
    .then(function (r) { if (!r.ok) throw new Error('api ' + r.status); return r.json(); })
    .then(function (lista) {
      if (!Array.isArray(lista) || !lista.length) return;
      var total = 0, meus = 0;
      lista.forEach(function (c) {
        total += c.contributions;
        if (c.login === EU) meus = c.contributions;
      });
      if (!meus) return;
      var texto = meus + ' de ' + total;
      var numero = document.getElementById('vivo-commits');
      var selo = document.getElementById('vivo-selo');
      var frase = document.getElementById('vivo-frase');
      if (numero) numero.textContent = texto;
      if (selo) selo.hidden = false;
      if (frase) frase.textContent = 'Agora, pela API do GitHub: ' + texto + ' commits são meus.';
    })
    .catch(function () { /* mantém o valor estático */ });
})();
