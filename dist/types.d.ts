/**
 * Radio Browser API types.
 * Matches the JSON response schema from https://de1.api.radio-browser.info/
 */
/** A single radio station from the Radio Browser API. */
export interface RadioStation {
    stationuuid: string;
    name: string;
    url_resolved: string;
    favicon: string;
    country: string;
    countrycode: string;
    tags: string;
    codec: string;
    bitrate: number;
    votes: number;
    clickcount: number;
    language: string;
}
//# sourceMappingURL=types.d.ts.map