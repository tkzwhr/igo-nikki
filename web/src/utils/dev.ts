export async function registerUser(id: string, name: string) {
  const query = `
    mutation RegisterUser($id: String!, $name: String!) {
      insert_users_one(object: {id: $id, name: $name}, on_conflict: {constraint: users_pk, update_columns: name}) {
        id
      }
    }
  `;
  const variables = { id, name };
  const body = { query, variables };

  try {
    const res = await fetch("http://localhost:20180/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hasura-Admin-Secret": "hasura",
      },
      body: JSON.stringify(body),
    });
    const resJson = await res.json();
    console.debug(resJson);
  } catch (e) {
    console.debug(e);
  }
}
