// Aplica al sitio las imágenes subidas desde admin.html (carpeta assets/uploads del repositorio).
// Cualquier elemento con data-img-key="llave" se reemplaza si existe assets/uploads/<llave>.jpg.
// Si no existe, queda la imagen original del HTML.
//   <img data-img-key="hero" ...>                 -> cambia el src
//   <section data-img-key="x" data-img-overlay>   -> fondo con capa azul para leer el texto
//   <div data-img-key="x" data-img-replace>       -> fondo; oculta el ícono SVG interior
(function () {
  var DIR = 'assets/uploads/';
  var version = Math.floor(Date.now() / 60000); // se renueva cada minuto

  var style = document.createElement('style');
  style.textContent =
    '[data-img-key].has-photo:not(img){background-size:cover;background-position:center;background-repeat:no-repeat}' +
    '.page-hero.has-photo h1,.page-hero.has-photo p{color:#fff}';
  document.head.appendChild(style);

  function apply(el, url) {
    if (el.tagName === 'IMG') {
      el.src = url;
      return;
    }
    var overlay = el.hasAttribute('data-img-overlay')
      ? 'linear-gradient(rgba(27,58,91,.72),rgba(27,58,91,.72)), '
      : '';
    el.style.backgroundImage = overlay + 'url("' + url + '")';
    el.classList.add('has-photo');
    if (el.hasAttribute('data-img-replace')) {
      el.querySelectorAll(':scope > svg').forEach(function (s) { s.style.display = 'none'; });
    }
  }

  document.querySelectorAll('[data-img-key]').forEach(function (el) {
    var key = el.getAttribute('data-img-key');
    var url = DIR + encodeURIComponent(key) + '.jpg?v=' + version;
    var probe = new Image();
    probe.onload = function () { apply(el, url); };
    probe.src = url; // si da error (no existe), se deja la original
  });
})();
