export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  // Resolve VITE_API_URL if configured, otherwise use relative path which is standard
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  const base = envUrl ? envUrl.replace(/\/$/, "") : "";
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  const resolvedUrl = envUrl ? `${base}${cleanUrl}` : cleanUrl;

  const headers = {
    ...options.headers,
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(resolvedUrl, { ...options, headers });

    // Wrap the json() method to gracefully parse non-JSON responses and throw unified clean error messages
    const originalJson = response.json.bind(response);
    response.json = async () => {
      try {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error(`Failed to parse response as JSON. Status: ${response.status}. URL: ${resolvedUrl}. Text sample:`, text.substring(0, 200), parseError);
          throw new Error("Unable to connect to the server. Please try again later.");
        }
      } catch (err: any) {
        if (err.message === "Unable to connect to the server. Please try again later.") {
          throw err;
        }
        console.error("Failed to read response body or parse JSON:", err);
        throw new Error("Unable to connect to the server. Please try again later.");
      }
    };

    return response;
  } catch (networkError) {
    console.error("Network error during apiFetch for:", resolvedUrl, networkError);
    // Return a mock Response-like structure so caller's try/catch handlers can safely run `.json()`
    // and receive the clean user-friendly error message.
    return {
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      json: async () => {
        throw new Error("Unable to connect to the server. Please try again later.");
      },
      text: async () => "",
    } as unknown as Response;
  }
}
