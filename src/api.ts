/**
 * Radio Browser API client.
 * Pure API functions — no database, no auth, no framework dependencies.
 * @see https://de1.api.radio-browser.info/
 */

import type { RadioStation } from './types.js';

const RADIO_API = process.env['RADIO_BROWSER_API_URL'] || 'https://de1.api.radio-browser.info';
const USER_AGENT = 'radio-browser-mcp/1.0';

/**
 * Search radio stations by name, country, or tag.
 * Combines filters via Radio Browser advanced search endpoint.
 * @param query - Station name search string
 * @param country - Filter by country name (e.g. "Germany")
 * @param tag - Filter by genre tag (e.g. "jazz")
 * @param limit - Max results (1-30, default 10)
 * @returns Matching stations sorted by click count
 */
export async function searchStations(
  query?: string,
  country?: string,
  tag?: string,
  limit = 10,
): Promise<RadioStation[]> {
  const params = new URLSearchParams({
    limit: String(Math.min(limit, 30)),
    order: 'clickcount',
    reverse: 'true',
    hidebroken: 'true',
  });
  if (query) params.set('name', query);
  if (country) params.set('country', country);
  if (tag) params.set('tag', tag);

  const res = await fetch(`${RADIO_API}/json/stations/search?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw new Error(`Radio Browser API error: ${res.status}`);
  return (await res.json()) as RadioStation[];
}

/**
 * Get a single station by UUID.
 * @param uuid - Station UUID
 * @returns Station or null if not found
 */
export async function getStationByUUID(uuid: string): Promise<RadioStation | null> {
  const res = await fetch(`${RADIO_API}/json/stations/byuuid/${encodeURIComponent(uuid)}`, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw new Error(`Radio Browser API error: ${res.status}`);
  const stations = (await res.json()) as RadioStation[];
  return stations[0] || null;
}

/**
 * Get top stations by click count.
 * @param limit - Max results (1-30, default 10)
 * @returns Top stations sorted by popularity
 */
export async function getTopStations(limit = 10): Promise<RadioStation[]> {
  const res = await fetch(
    `${RADIO_API}/json/stations/topclick?limit=${Math.min(limit, 30)}&hidebroken=true`,
    { headers: { 'User-Agent': USER_AGENT } },
  );
  if (!res.ok) throw new Error(`Radio Browser API error: ${res.status}`);
  return (await res.json()) as RadioStation[];
}
