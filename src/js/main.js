import { setHeaderFooter } from './util';
import { getBookList, getCovers, getLocalEvents } from './externalServices.mjs';

import '../css/style.css';

setHeaderFooter();

const covers = getCovers('M');
const events = getLocalEvents();

function bookCardTemplate(book) {
  return `
    <div class="book-card">
      <a href="/books/index.html?id=${book._id}">
        <div class="cover-container">
          <img src="${covers[book.name.toLowerCase()]}" crossorigin="anonymous" />
        </div>
        <div class="book-info">
          <h3>${book.name}</h3>
          <p class="author">${book.author.firstName} ${book.author.lastName}</p>
          <p class="year">${book.publicationYear}</p>
        </div>
      </a>
    </div>
  `;
}

function eventCardTemplate(event) {
  return `
    <div class="event-card">
      <img src="https://picsum.photos/120/187" alt="random photo" />
      <div class="event-card-info">
        <h3>${event.title}</h3>
        <p class="event-date">${event.date}</p>
        <p>${event.description}</p>
      </div>
    </div>
  `;
}

// Fisher-Yates Shuffle
function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i * 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

async function init() {
  const books = await getBookList();
  const bookContainer = document.querySelector('.card-container');
  const featuredBooks = shuffle(books).slice(0, 5);

  featuredBooks.forEach(
    (book) => (bookContainer.innerHTML += bookCardTemplate(book)),
  );

  const eventContainer = document.querySelector('.events-container');

  events.forEach(
    (event) => (eventContainer.innerHTML += eventCardTemplate(event)),
  );
}

init();
