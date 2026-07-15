export const authApi = {
  loginWithKeycloak: async ({ username, password }) => {
    const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
    const realm = import.meta.env.VITE_KEYCLOAK_REALM;
    const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

    const tokenUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.append("grant_type", "password");
    body.append("client_id", clientId);
    body.append("username", username);
    body.append("password", password);

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      throw new Error("Invalid username or password");
    }

    return response.json();
  },
};