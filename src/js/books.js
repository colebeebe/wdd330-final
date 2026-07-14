import { setHeaderFooter, getParam } from './util';
import '../css/style.css';
import '../css/books.css';

const apiUrl = import.meta.env.VITE_API_URL;

setHeaderFooter();
getBookInfo();

async function getBookInfo() {
  const id = getParam('id');

  const dbQuery = {
    query: `
      query GetBook($id: ID!) {
        book(id: $id) {
          name
          author {
            firstName
            lastName
          }
          publicationYear
          genres
          pageCount
          format
        }
      }
    `,
    variables: {
      id,
    },
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

  const book = data.data.book;

  document.querySelector('.title').textContent = book.name;
  document.querySelector('.author').textContent =
    `${book.author.firstName} ${book.author.lastName}`;
  document.querySelector('.year').textContent = book.publicationYear;

  const genres = document.querySelector('.genres');
  genres.innerHTML = '';
  book.genres.forEach(
    (g) => (genres.innerHTML += `<div class="genre-tag">${g}</div>`),
  );

  document.querySelector('.format').textContent = `Format: ${book.format}`;
  document.querySelector('.page-count').textContent =
    `Pages: ${book.pageCount}`;
}
