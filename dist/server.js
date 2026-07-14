#!/usr/bin/env node
/**
 * Radio Browser MCP Server.
 * Provides tools to search and discover internet radio stations
 * via the free Radio Browser API.
 *
 * Transport: stdio (for Claude Desktop and other MCP clients)
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { searchStations, getStationByUUID, getTopStations } from './api.js';
/** Format a station list as readable text for LLM consumption. */
function formatStations(stations) {
    if (stations.length === 0)
        return 'No stations found.';
    return stations
        .map((s, i) => `${i + 1}. **${s.name}** — ${s.country || 'Unknown'}` +
        `${s.tags ? ` | ${s.tags.split(',').slice(0, 3).join(', ')}` : ''}` +
        ` | ${s.bitrate}kbps` +
        `\n   Stream: ${s.url_resolved}` +
        `\n   UUID: ${s.stationuuid}`)
        .join('\n\n');
}
const server = new McpServer({
    name: 'webradio-plugin',
    version: '1.0.1',
});
// ---------------------------------------------------------------------------
// Tool: radio_search
// ---------------------------------------------------------------------------
server.registerTool('radio_search', {
    title: 'Search Radio Stations',
    description: 'Search for internet radio stations by name, country, or genre tag. ' +
        'Returns station name, country, tags, bitrate, stream URL, and UUID. ' +
        'At least one of query, country, or tag must be provided. ' +
        'Always present stream URLs as clickable markdown links so users can listen directly.',
    inputSchema: {
        query: z
            .string()
            .optional()
            .describe('Station name to search for'),
        country: z
            .string()
            .optional()
            .describe('Filter by country name (e.g. "Germany", "United Kingdom")'),
        tag: z
            .string()
            .optional()
            .describe('Filter by genre tag (e.g. "jazz", "rock", "classical")'),
        limit: z
            .number()
            .int()
            .min(1)
            .max(30)
            .default(10)
            .describe('Max results (default 10, max 30)'),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ query, country, tag, limit }) => {
    if (!query && !country && !tag) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'Please provide at least one search parameter: query, country, or tag.',
                },
            ],
        };
    }
    try {
        const stations = await searchStations(query, country, tag, limit);
        return { content: [{ type: 'text', text: formatStations(stations) }] };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
});
// ---------------------------------------------------------------------------
// Tool: radio_get_station
// ---------------------------------------------------------------------------
server.registerTool('radio_get_station', {
    title: 'Get Radio Station',
    description: 'Get details of a specific radio station by its UUID, including stream URL. ' +
        'Use the UUID from radio_search results.',
    inputSchema: {
        station_uuid: z.string().describe('UUID of the station'),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ station_uuid }) => {
    try {
        const station = await getStationByUUID(station_uuid);
        if (!station) {
            return {
                content: [{ type: 'text', text: `Station not found: ${station_uuid}` }],
            };
        }
        const info = [
            `Name: ${station.name}`,
            `Country: ${station.country || 'Unknown'}`,
            `Tags: ${station.tags || 'none'}`,
            `Codec: ${station.codec} | Bitrate: ${station.bitrate}kbps`,
            `Stream URL: ${station.url_resolved}`,
            `Votes: ${station.votes} | Clicks: ${station.clickcount}`,
            `UUID: ${station.stationuuid}`,
        ].join('\n');
        return { content: [{ type: 'text', text: info }] };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
});
// ---------------------------------------------------------------------------
// Tool: radio_top_stations
// ---------------------------------------------------------------------------
server.registerTool('radio_top_stations', {
    title: 'Top Radio Stations',
    description: 'Get the most popular radio stations worldwide, sorted by click count. ' +
        'Always present stream URLs as clickable markdown links so users can listen directly.',
    inputSchema: {
        limit: z
            .number()
            .int()
            .min(1)
            .max(30)
            .default(10)
            .describe('Max results (default 10, max 30)'),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ limit }) => {
    try {
        const stations = await getTopStations(limit);
        return { content: [{ type: 'text', text: formatStations(stations) }] };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
        };
    }
});
// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Radio Browser MCP server running via stdio');
}
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map