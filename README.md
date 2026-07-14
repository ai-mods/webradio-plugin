# webradio-plugin

![MCP](https://img.shields.io/badge/MCP-Compatible-blue?logo=anthropic)
![Node](https://img.shields.io/badge/Node-≥18-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Radio Browser API](https://img.shields.io/badge/Radio_Browser-API-orange?logo=radio)

Search and discover 30,000+ internet radio stations via [Radio Browser API](https://www.radio-browser.info/). Works as a standalone MCP server for Claude Desktop or as an importable library in any Node.js project.

Search results include clickable stream URLs — click a link to start listening directly in your browser.

## Tools

| Tool | Description |
| ---- | ----------- |
| `radio_search` | Search stations by name, country, or genre tag |
| `radio_get_station` | Get station details and stream URL by UUID |
| `radio_top_stations` | Get the most popular stations worldwide |

## Usage

### Claude Desktop (Extension)

Install `webradio-plugin.mcpb` from the [latest release](https://github.com/ai-mods/webradio-plugin/releases/latest) via double-click, or add to config manually:

```json
{
  "mcpServers": {
    "webradio": {
      "command": "node",
      "args": ["/path/to/webradio-plugin/dist/server.js"]
    }
  }
}
```

### As a Library

```ts
import { searchStations, getStationByUUID, getTopStations } from 'webradio-plugin';

const stations = await searchStations('jazz', 'Germany');
const station = await getStationByUUID('abc-123');
const top = await getTopStations(10);
```

## Build

```bash
npm install
npm run build
```

## Environment

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `RADIO_BROWSER_API_URL` | `https://de1.api.radio-browser.info` | API base URL |

## License

MIT
