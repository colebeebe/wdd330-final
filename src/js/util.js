import { getBookList } from './externalServices.mjs';

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

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

  const loginLink = document.querySelector('.login-link');
  loginLink.href = apiUrl + '/auth/google';

  setSearchFunctionality();
}

async function setSearchFunctionality() {
  const searchbar = document.querySelector('#searchbar');
  const results = document.querySelector('.search-results');

  const books = await getBookList();

  let timeout;
  searchbar.addEventListener('input', (e) => {
    const query = e.target.value;
    results.innerHTML = '';

    books
      .filter((book) => book.name.toLowerCase().includes(query.toLowerCase()))
      .forEach(
        (book) =>
          (results.innerHTML += `<a href="/books/index.html?id=${book._id}">${book.name}</a>`),
      );

    if (query.length > 2) {
      results.classList.remove('hide');
    } else {
      results.classList.add('hide');
    }
  });
}
