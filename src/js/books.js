import { setHeaderFooter, getParam } from './util';
import { getBookById, getCovers } from './externalServices.mjs';

import '../css/style.css';
import '../css/books.css';

setHeaderFooter();

async function init() {
  const covers = getCovers();
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

  const cover = document.querySelector('.cover');
  cover.src = covers[book.name.toLowerCase()];
  cover.alt = `cover for ${book.name}`;
}

init();
