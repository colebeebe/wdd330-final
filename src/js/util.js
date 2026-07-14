const apiUrl = import.meta.env.VITE_API_URL;
let books = [];

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

  const dbQuery = {
    query: `
      query getAllBooks {
        books {
          _id
          name
        }
      }
    `,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dbQuery),
  };
  const response = await fetch(apiUrl + '/graphql', options);
  const data = await response.json();

  books = data.data.books;

  let timeout;
  searchbar.addEventListener('input', (e) => {
    const query = e.target.value;
    results.innerHTML = '';

    const searchList = books.filter((b) =>
      b.name.toLowerCase().includes(query.toLowerCase()),
    );

    searchList.forEach(
      (item) =>
        (results.innerHTML += `<a href="/books/index.html?id=${item._id}">${item.name}</a>`),
    );

    if (searchList.length < 1) {
      results.innerHTML = '<a>No books match your query.</a>';
    }

    if (query.length > 2) {
      results.classList.remove('hide');
    } else {
      results.classList.add('hide');
    }
  });
}
