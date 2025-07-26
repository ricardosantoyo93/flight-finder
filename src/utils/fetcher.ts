const skyScrapperApiKey = import.meta.env.VITE_SKY_SCRAPPER_API_KEY;
const skyScrapperHost = import.meta.env.VITE_SKY_SCRAPPER_HOST;

const url = `https://${skyScrapperHost}/api/v1/`;

export async function fetcher<T>({
  endpoint,
  options = {},
}: {
  endpoint: string;
  options: RequestInit;
}): Promise<T> {
  const res = await fetch(`${url}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "x-rapidapi-key": skyScrapperApiKey,
      "x-rapidapi-host": skyScrapperHost,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Fetch error: ${res.status} - ${errorBody}`);
  }

  return res.json();
}
