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

  await renderWithTemplate(headerTemplateFn, headerEl);
  await renderWithTemplate(
    footerTemplateFn,
    footerEl,
    footerData,
    footerCallback,
  );

  setSearchFunctionality();
}

function setSearchFunctionality() {
  const searchbar = document.querySelector('#searchbar');
  const results = document.querySelector('.search-results');

  let timeout;
  searchbar.addEventListener('input', (e) => {
    const query = e.target.value;
    results.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      results.innerHTML += `<a href="#">${query}</a>`;
    }
    if (query.length > 2) {
      results.classList.remove('hide');
    } else {
      results.classList.add('hide');
    }
  });
}
