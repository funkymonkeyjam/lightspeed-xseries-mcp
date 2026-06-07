import type {
  LightspeedConfig,
  PaginatedResponse,
  SingleResponse,
} from '../types/lightspeed.js';

interface ErrorBody {
  error?: string;
  error_description?: string;
  message?: string;
  errors?: Array<{ message?: string }>;
}

export class LightspeedApiClient {
  private config: LightspeedConfig;
  private baseUrls: Record<string, string>;

  constructor(config: LightspeedConfig) {
    this.config = config;
    const prefix = config.domainPrefix;
    this.baseUrls = {
      '0.9': `https://${prefix}.retail.lightspeed.app/api`,
      '2.0': `https://${prefix}.retail.lightspeed.app/api/2.0`,
      '2.0-beta': `https://${prefix}.retail.lightspeed.app/api/2.0-beta`,
      '2.1': `https://${prefix}.retail.lightspeed.app/api/2.1`,
      '3.0': `https://${prefix}.retail.lightspeed.app/api/3.0`,
      '3.0-beta': `https://${prefix}.retail.lightspeed.app/api/3.0-beta`,
    };
  }

  private getBaseUrl(version?: string): string {
    const v = version || this.config.apiVersion || '2.0';
    return this.baseUrls[v] || this.baseUrls['2.0'];
  }

  private async request<T>(
    method: string,
    endpoint: string,
    options: {
      version?: string;
      params?: Record<string, string | number | boolean | undefined>;
      body?: unknown;
    } = {}
  ): Promise<T> {
    const baseUrl = this.getBaseUrl(options.version);
    const url = new URL(`${baseUrl}${endpoint}`);

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (options.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorBody = await response.json() as ErrorBody;
        if (errorBody.error && typeof errorBody.error === 'string') {
          errorMessage = `${errorBody.error}${errorBody.error_description ? ` - ${errorBody.error_description}` : ''}`;
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        } else if (errorBody.errors && Array.isArray(errorBody.errors)) {
          errorMessage = errorBody.errors.map((e) => e.message || JSON.stringify(e)).join(', ');
        } else {
          errorMessage = JSON.stringify(errorBody);
        }
      } catch {
        errorMessage = `HTTP ${response.status} ${response.statusText}`;
      }
      throw new Error(`Lightspeed API Error (${response.status}): ${errorMessage} [URL: ${url.toString()}]`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  async get<T>(endpoint: string, options?: { version?: string; params?: Record<string, string | number | boolean | undefined> }): Promise<T> {
    return this.request<T>('GET', endpoint, options);
  }

  async post<T>(endpoint: string, body: unknown, options?: { version?: string }): Promise<T> {
    return this.request<T>('POST', endpoint, { ...options, body });
  }

  async put<T>(endpoint: string, body: unknown, options?: { version?: string }): Promise<T> {
    return this.request<T>('PUT', endpoint, { ...options, body });
  }

  async patch<T>(endpoint: string, body: unknown, options?: { version?: string }): Promise<T> {
    return this.request<T>('PATCH', endpoint, { ...options, body });
  }

  async delete<T>(endpoint: string, options?: { version?: string }): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }

  async list<T>(
    endpoint: string,
    options?: {
      version?: string;
      params?: Record<string, string | number | boolean | undefined>;
    }
  ): Promise<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(endpoint, options);
  }

  async getOne<T>(
    endpoint: string,
    options?: { version?: string }
  ): Promise<SingleResponse<T>> {
    return this.get<SingleResponse<T>>(endpoint, options);
  }
}

// ─── Multi-Store Registry ─────────────────────────────────────────────────────

export interface StoreEntry {
  id: string;
  name: string;
  domainPrefix: string;
  accessToken: string;
}

interface StoreConfig {
  id: string;
  name?: string;
  domainPrefix: string;
  accessToken: string;
}

const storeRegistry = new Map<string, { meta: StoreEntry; client: LightspeedApiClient }>();
let activeStoreId: string | null = null;

/**
 * Initialize all stores from LIGHTSPEED_STORES env var (JSON array) or
 * fall back to single-store LIGHTSPEED_DOMAIN_PREFIX + LIGHTSPEED_ACCESS_TOKEN.
 */
export function initializeStoresFromEnv(): void {
  const storesJson = process.env.LIGHTSPEED_STORES;

  if (storesJson) {
    let stores: StoreConfig[];
    try {
      stores = JSON.parse(storesJson) as StoreConfig[];
    } catch {
      throw new Error('LIGHTSPEED_STORES is not valid JSON. Expected an array of store objects.');
    }

    if (!Array.isArray(stores) || stores.length === 0) {
      throw new Error('LIGHTSPEED_STORES must be a non-empty JSON array.');
    }

    for (const store of stores) {
      if (!store.id || !store.domainPrefix || !store.accessToken) {
        throw new Error(`Store entry missing required fields (id, domainPrefix, accessToken): ${JSON.stringify(store)}`);
      }
      registerStore(store);
    }

    // Default active store = first in the list
    activeStoreId = stores[0].id;
    console.error(`[lightspeed-mcp] Loaded ${stores.length} store(s): ${stores.map(s => s.id).join(', ')}`);
    return;
  }

  // Backward-compat: single-store env vars
  const domainPrefix = process.env.LIGHTSPEED_DOMAIN_PREFIX;
  const accessToken = process.env.LIGHTSPEED_ACCESS_TOKEN;

  if (domainPrefix && accessToken) {
    registerStore({ id: 'default', name: 'Default Store', domainPrefix, accessToken });
    activeStoreId = 'default';
    console.error('[lightspeed-mcp] Loaded 1 store (single-store mode via LIGHTSPEED_DOMAIN_PREFIX).');
    return;
  }

  // No env config — will rely on per-call args (lazy init)
  console.error('[lightspeed-mcp] No store credentials in environment. Waiting for per-call initialization.');
}

export function registerStore(config: StoreConfig): void {
  const client = new LightspeedApiClient({
    domainPrefix: config.domainPrefix,
    accessToken: config.accessToken,
  });
  storeRegistry.set(config.id, {
    meta: {
      id: config.id,
      name: config.name ?? config.id,
      domainPrefix: config.domainPrefix,
      accessToken: '***', // never expose token in metadata
    },
    client,
  });
}

/**
 * Resolve the client to use for a tool call.
 * Priority: store_id arg → active store → single registered store → lazy init from args.
 */
export function resolveClient(args: Record<string, unknown>): LightspeedApiClient {
  const requestedId = args.store_id as string | undefined;

  // Explicit store_id in args
  if (requestedId) {
    const entry = storeRegistry.get(requestedId);
    if (!entry) {
      const available = Array.from(storeRegistry.keys()).join(', ') || 'none configured';
      throw new Error(`Store "${requestedId}" not found. Available stores: ${available}`);
    }
    return entry.client;
  }

  // Use active store if set
  if (activeStoreId) {
    const entry = storeRegistry.get(activeStoreId);
    if (entry) return entry.client;
  }

  // If exactly one store registered, use it implicitly
  if (storeRegistry.size === 1) {
    return storeRegistry.values().next().value!.client;
  }

  // Multiple stores but no store_id — require explicit selection
  if (storeRegistry.size > 1) {
    const available = Array.from(storeRegistry.keys()).join(', ');
    throw new Error(`Multiple stores configured. Please specify store_id. Available: ${available}`);
  }

  // No stores registered yet — lazy init from call args (original behavior)
  const domainPrefix = args.domain_prefix as string | undefined;
  const accessToken = args.access_token as string | undefined;
  if (!domainPrefix || !accessToken) {
    throw new Error(
      'No stores configured. Set LIGHTSPEED_STORES or LIGHTSPEED_DOMAIN_PREFIX + LIGHTSPEED_ACCESS_TOKEN, ' +
      'or pass domain_prefix and access_token as tool arguments.'
    );
  }
  registerStore({ id: 'default', domainPrefix, accessToken });
  activeStoreId = 'default';
  return storeRegistry.get('default')!.client;
}

export function listRegisteredStores(): StoreEntry[] {
  return Array.from(storeRegistry.values()).map(e => e.meta);
}

export function getStoreCount(): number {
  return storeRegistry.size;
}

// ─── Legacy single-store API (backward compat for any external callers) ──────

let legacyClient: LightspeedApiClient | null = null;

export function initializeClient(config: LightspeedConfig): LightspeedApiClient {
  legacyClient = new LightspeedApiClient(config);
  registerStore({ id: 'default', domainPrefix: config.domainPrefix, accessToken: config.accessToken });
  activeStoreId = 'default';
  return legacyClient;
}

export function getClient(): LightspeedApiClient {
  if (activeStoreId) {
    const entry = storeRegistry.get(activeStoreId);
    if (entry) return entry.client;
  }
  if (legacyClient) return legacyClient;
  throw new Error('Lightspeed API client not initialized. Please provide store credentials.');
}

export function isClientInitialized(): boolean {
  return storeRegistry.size > 0 || legacyClient !== null;
}
