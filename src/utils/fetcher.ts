// Helper to call fetch(), handle JSON, and surface errors

/**
 * A wrapper around fetch()
 * @template T - the expected shape of the JSON response
 * @param url - API endpoint to call
 * @param init - extra options like method, body
 * @returns the JSON body parsed as T or null if there's no content
 */
export async function fetcher<T>(
  url: string,
  init?: RequestInit
): Promise<T | null> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {}
    throw new Error(message);
  }
  if (response.status === 204) {
    return null;
  }
  const payload = await response.json();
  return payload as T;
}
