/* Delegation also supports articles inserted into the news dialog. */
(() => {
  function update(form) {
    const total = form.querySelectorAll('input[type="checkbox"]').length;
    const checked = form.querySelectorAll('input[type="checkbox"]:checked').length;
    form.querySelector('.guia-count').textContent = `${checked} de ${total} punts revisats`;
  }
  document.addEventListener('change', event => {
    const form = event.target.closest('.guia-checklist');
    if (form) update(form);
  });
  document.addEventListener('reset', event => {
    if (event.target.matches('.guia-checklist')) setTimeout(() => update(event.target), 0);
  });
})();
