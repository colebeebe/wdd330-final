import { setHeaderFooter, getParam } from './util';

import '../css/style.css';
import '../css/books.css';
import { getBookById } from './externalServices.mjs';

setHeaderFooter();

async function init() {
  const id = getParam('id');
  const book = await getBookById(id);

  document.querySelector('.title').textContent = book.name;
  document.querySelector('.format').textContent = book.format;
  document.querySelector('.author').textContent =
    `${book.author.firstName} ${book.author.lastName}`;
  document.querySelector('.pages').textContent = `Pages: ${book.pageCount}`;
  document.querySelector('.year').textContent = book.publicationYear;
  document.querySelector('.publisher').textContent = book.publisher;
  const genresEl = document.querySelector('.genres');
  book.genres.forEach((genre) => (genresEl.innerHTML += `<li>${genre}</li>`));
}

init();
