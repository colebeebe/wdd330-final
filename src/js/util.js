async function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
  position = 'afterbegin',
  clear = 'true',
) {
  const template = await templateFn(data);
  if (clear) {
    parentElement.innerHTML = '';
  }
  parentElement.insertAdjacentHTML(position, template);
  if (callback) {
    callback(data);
  }
}

function loadTemplate(path) {
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
  };
}

export async function setHeaderFooter() {
  const headerTemplateFn = loadTemplate('/partials/header.html');
  const footerTemplateFn = loadTemplate('/partials/footer.html');

  const headerEl = document.querySelector('header');
  const footerEl = document.querySelector('footer');

  const footerData = { year: new Date().getFullYear() };
  const footerCallback = ({ year }) =>
    (footerEl.querySelector('.copyright-info').innerHTML =
      `&copy;${year} Cole Beebe-Urbanawiz`);

  renderWithTemplate(headerTemplateFn, headerEl);
  renderWithTemplate(footerTemplateFn, footerEl, footerData, footerCallback);
}
