/**
 * Radio Browser API client.
 * Pure API functions — no database, no auth, no framework dependencies.
 * @see https://de1.api.radio-browser.info/
 */
import type { RadioStation } from './types.js';
/**
 * Search radio stations by name, country, or tag.
 * Combines filters via Radio Browser advanced search endpoint.
 * @param query - Station name search string
 * @param country - Filter by country name (e.g. "Germany")
 * @param tag - Filter by genre tag (e.g. "jazz")
 * @param limit - Max results (1-30, default 10)
 * @returns Matching stations sorted by click count
 */
export declare function searchStations(query?: string, country?: string, tag?: string, limit?: number): Promise<RadioStation[]>;
/**
 * Get a single station by UUID.
 * @param uuid - Station UUID
 * @returns Station or null if not found
 */
export declare function getStationByUUID(uuid: string): Promise<RadioStation | null>;
/**
 * Get top stations by click count.
 * @param limit - Max results (1-30, default 10)
 * @returns Top stations sorted by popularity
 */
export declare function getTopStations(limit?: number): Promise<RadioStation[]>;
//# sourceMappingURL=api.d.ts.map