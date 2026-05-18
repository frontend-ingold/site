const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL || 'https://wolmart-api.vercel.app');

export async function getPageData() {
  const response = await fetch(`${API_BASE_URL}/api/page-data`);

  if (!response.ok) {
    throw new Error(`Failed to fetch page data: ${response.status}`);
  }

  return response.json();
}
