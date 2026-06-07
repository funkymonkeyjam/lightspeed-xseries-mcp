import { listRegisteredStores } from '../utils/api-client.js';

export const storeToolDefinitions = [
  {
    name: 'lightspeed_list_stores',
    description: 'List all configured Lightspeed stores available in this MCP server. Returns each store\'s ID, friendly name, and domain prefix. Use the store_id value from this list in all other tool calls to target a specific store.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
];

export async function listStores(): Promise<unknown> {
  const stores = listRegisteredStores();
  return {
    stores,
    count: stores.length,
    note: 'Pass a store\'s "id" value as the store_id parameter in any other tool call to target that store.',
  };
}
