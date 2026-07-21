const baseUrl = import.meta.env.VITE_API_URL;

async function convertToJson(res) {
  const json = await res.json();
  if (res.ok) {
    return json;
  } else {
    throw { name: 'servicesError', message: json };
  }
}

export async function getBookList() {
  const query = {
    query: `
      query {
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
    body: JSON.stringify(query),
  };
  const response = await fetch(baseUrl + '/graphql', options);
  if (response.ok) {
    const json = await convertToJson(response);
    return json.data.books;
  }
  return { error: 'Could not fetch resource' };
}

export async function getBookById(id) {
  const query = {
    query: `
      query($id: ID!) {
        book(id: $id) {
          name
          publicationYear
          publisher
          genres
          pageCount
          format
          author {
            firstName
            lastName
          }
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
    body: JSON.stringify(query),
  };

  const response = await fetch(baseUrl + '/graphql', options);
  if (response.ok) {
    const data = await convertToJson(response);
    return data.data.book;
  }
  return { error: 'Could not fetch resource' };
}
