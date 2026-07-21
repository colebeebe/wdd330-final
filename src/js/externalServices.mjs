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
  return { error: 'Error fetching resource' };
}
