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
          publicationYear
          author {
            firstName
            lastName
          }
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

// Provide covers manually since the API doesn't support it yet
// Size can be S, M, or L
export function getCovers(size = 'L') {
  return {
    dune: `https://covers.openlibrary.org/b/olid/OL26242482M-${size}.jpg`,
    'children of dune': `https://covers.openlibrary.org/b/olid/OL5213852M-${size}.jpg`,
    mistborn: `https://covers.openlibrary.org/b/olid/OL60101225M-${size}.jpg`,
    "harry potter and the sorceror's stone": `https://covers.openlibrary.org/b/olid/OL30621390M-${size}.jpg`,
    'harry potter and the chamber of secrets': `https://covers.openlibrary.org/b/olid/OL27506465M-${size}.jpg`,
  };
}

// Simulate an api getting stored local events
export function getLocalEvents() {
  return [
    {
      title: 'Storytime at the Library',
      date: 'July 23, 2026',
      description:
        'Come and enjoy reading time with your children. We provide stories, songs, and a light snack!',
    },
    {
      title: 'Meet the Mayor',
      date: 'July 25, 2026',
      description:
        'Join us for a conversation with our town mayor and learn about local government, upcoming projects, and ways to get involved in the community.',
    },
    {
      title: 'Book Club Night',
      date: 'July 28, 2026',
      description:
        'Bring your thoughts on this month’s featured book and enjoy a lively discussion with fellow readers. New members are always welcome!',
    },
    {
      title: 'Local Author Meet & Greet',
      date: 'July 30, 2026',
      description:
        'Meet a local author, hear about their writing journey, and get your books signed after the presentation.',
    },
    {
      title: 'Craft Corner',
      date: 'August 1, 2026',
      description:
        'Create a fun seasonal craft using supplies provided by the library. Perfect for kids, families, and creative minds of all ages.',
    },
    {
      title: 'Tech Help Hour',
      date: 'August 4, 2026',
      description:
        'Need help with your phone, tablet, or laptop? Library staff will be available to answer questions and provide one-on-one assistance.',
    },
  ];
}
