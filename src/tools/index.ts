// Export all tools and their definitions

export * from './stores.js';
export * from './customers.js';
export * from './products.js';
export * from './sales.js';
export * from './inventory.js';
export * from './outlets.js';
export * from './suppliers.js';
export * from './webhooks.js';
export * from './pricing.js';
export * from './variants.js';
export * from './services.js';
export * from './serial-numbers.js';
export * from './quotes.js';
export * from './search.js';
export * from './channels.js';
export * from './security.js';
export * from './custom-fields.js';
export * from './rules.js';
export * from './partner.js';

import { storeToolDefinitions } from './stores.js';
import { customerToolDefinitions } from './customers.js';
import { productToolDefinitions } from './products.js';
import { saleToolDefinitions } from './sales.js';
import { inventoryToolDefinitions } from './inventory.js';
import { outletToolDefinitions } from './outlets.js';
import { supplierToolDefinitions } from './suppliers.js';
import { webhookToolDefinitions } from './webhooks.js';
import { pricingToolDefinitions } from './pricing.js';
import { variantToolDefinitions } from './variants.js';
import { serviceToolDefinitions } from './services.js';
import { serialNumberToolDefinitions } from './serial-numbers.js';
import { quoteToolDefinitions } from './quotes.js';
import { searchToolDefinitions } from './search.js';
import { channelToolDefinitions } from './channels.js';
import { securityToolDefinitions } from './security.js';
import { customFieldToolDefinitions } from './custom-fields.js';
import { ruleToolDefinitions } from './rules.js';
import { partnerToolDefinitions } from './partner.js';

// Combine all tool definitions
export const allToolDefinitions = [
  ...storeToolDefinitions,
  ...customerToolDefinitions,
  ...productToolDefinitions,
  ...saleToolDefinitions,
  ...inventoryToolDefinitions,
  ...outletToolDefinitions,
  ...supplierToolDefinitions,
  ...webhookToolDefinitions,
  ...pricingToolDefinitions,
  ...variantToolDefinitions,
  ...serviceToolDefinitions,
  ...serialNumberToolDefinitions,
  ...quoteToolDefinitions,
  ...searchToolDefinitions,
  ...channelToolDefinitions,
  ...securityToolDefinitions,
  ...customFieldToolDefinitions,
  ...ruleToolDefinitions,
  ...partnerToolDefinitions,
];
