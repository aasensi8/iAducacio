const dialog = document.querySelector('#news-dialog');
const content = document.querySelector('#article-content');
let opening = false;
document.querySelectorAll('[data-article]').forEach(link => {
  link.addEventListener('click', async event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !dialog.showModal) return;
    event.preventDefault();
    if (opening) return;
    opening = true;
    try {
      const response = await fetch(link.href);
      if (!response.ok) throw new Error('Article unavailable');
      const page = new DOMParser().parseFromString(await response.text(), 'text/html');
      const article = page.querySelector('.news-article');
      if (!article) throw new Error('Article missing');
      content.replaceChildren(article);
      dialog.showModal();
      dialog.scrollTop = 0;
      content.querySelector('h1').focus({preventScroll:true});
    } catch {
      window.location.assign(link.href);
    } finally {
      opening = false;
    }
  });
});
document.querySelector('#close-article').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
