const REACT_APP_API_BASE = "/api";
let msalInstance = null;

const getAccessToken = async (scopes) => {
  // MSAL.js v2 exposes several account APIs,
  // logic to determine which account to use is the responsibility of the developer
  const account = msalInstance?.getAllAccounts()[0];
  if (!account) {
    return null;
  }
  const accessTokenRequest = {
    scopes: scopes || loginRequest.scopes,
    account: account,
  };
  // Use the same publicClientApplication instance provided to MsalProvider
  const response = await msalInstance.acquireTokenSilent(accessTokenRequest);
  // Acquire token silent success
  let accessToken = response.accessToken;
  return accessToken;
};

// usage
// const { get, post, put, del } = useFetchWithAuth();
// del('/api/endpoint', { id: 1 }).then((data) => console.log(data));

const useFetchWithAuth = () => {
  const authHeader = async () => {
    const token = await getAccessToken();
    return { Authorization: `Bearer ${token}` };
  };

  const request = (method) => {
    return async (path, body) => {
      const url = `${REACT_APP_API_BASE}${path}`;
      const requestOptions = {
        method,
        headers: await authHeader(),
      };
      if (body) {
        requestOptions.headers["Content-Type"] = "application/json";
        requestOptions.body = JSON.stringify(body);
      }
      return fetch(url, requestOptions);
    };
  };

  return {
    get: request("GET"),
    post: request("POST"),
    put: request("PUT"),
    del: request("DELETE"),
  };
};

export { useFetchWithAuth };
