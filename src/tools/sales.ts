import { getClient } from '../utils/api-client.js';
import type {
  Sale,
  SaleCreateInput,
  PaymentType,
  Payment,
  Fulfillment,
  FulfillmentCreateInput,
  FulfillmentSummary,
  PickList,
  PaginatedResponse,
  SingleResponse,
  V09Sale,
  V09RegisterSalesResponse,
  DailySalesSummary,
  DailySalesSummaryTransaction,
} from '../types/lightspeed.js';

// Sale Tools

export async function listSales(params: {
  page_size?: number;
  after?: string;
  before?: string;
  since?: string;
  outlet_id?: string;
  status?: string;
  customer_id?: string;
  user_id?: string;
  invoice_number?: string;
  tag?: string;
}): Promise<PaginatedResponse<Sale>> {
  const client = getClient();
  return client.list<Sale>('/register_sales', {
    version: '0.9',
    params: {
      page_size: params.page_size,
      after: params.after,
      before: params.before,
      since: params.since,
      outlet_id: params.outlet_id,
      status: params.status,
      customer_id: params.customer_id,
      user_id: params.user_id,
      invoice_number: params.invoice_number,
      tag: params.tag,
    },
  });
}

export async function getSale(saleId: string): Promise<SingleResponse<Sale>> {
  const client = getClient();
  return client.getOne<Sale>(`/register_sales/${saleId}`, { version: '0.9' });
}

export async function createSale(data: SaleCreateInput): Promise<SingleResponse<Sale>> {
  const client = getClient();
  return client.post<SingleResponse<Sale>>('/register_sales', data, { version: '0.9' });
}

export async function updateSale(saleId: string, data: Partial<SaleCreateInput>): Promise<SingleResponse<Sale>> {
  const client = getClient();
  return client.put<SingleResponse<Sale>>(`/register_sales/${saleId}`, data, { version: '0.9' });
}

export async function returnSale(saleId: string, data: {
  return_products?: { product_id: string; quantity: number }[];
}): Promise<SingleResponse<Sale>> {
  const client = getClient();
  return client.put<SingleResponse<Sale>>(`/sales/${saleId}/return`, data, { version: '2.0' });
}

// Payment Tools

export async function getPayment(paymentId: string): Promise<SingleResponse<Payment>> {
  const client = getClient();
  return client.getOne<Payment>(`/payments/${paymentId}`, { version: '2.0' });
}

// Sales API 2.0

export async function listSales2(params: {
  page_size?: number;
  after?: string;
  outlet_id?: string;
  status?: string;
  since?: string;
}): Promise<PaginatedResponse<Sale>> {
  const client = getClient();
  return client.list<Sale>('/sales', {
    version: '2.0',
    params: {
      page_size: params.page_size,
      after: params.after,
      outlet_id: params.outlet_id,
      status: params.status,
      since: params.since,
    },
  });
}

export async function getSale2(saleId: string): Promise<SingleResponse<Sale>> {
  const client = getClient();
  return client.getOne<Sale>(`/sales/${saleId}`, { version: '2.0' });
}

export async function createSale2(data: SaleCreateInput): Promise<SingleResponse<Sale>> {
  const client = getClient();
  return client.post<SingleResponse<Sale>>('/sales', data, { version: '2.0' });
}

export async function updateSale2(saleId: string, data: Partial<SaleCreateInput>): Promise<SingleResponse<Sale>> {
  const client = getClient();
  return client.put<SingleResponse<Sale>>(`/sales/${saleId}`, data, { version: '2.0' });
}

export async function deleteSale(saleId: string): Promise<void> {
  const client = getClient();
  await client.delete(`/sales/${saleId}`, { version: '2.0' });
}

// Payment Type Tools

export async function listPaymentTypes(): Promise<PaginatedResponse<PaymentType>> {
  const client = getClient();
  return client.list<PaymentType>('/payment_types', { version: '0.9' });
}

export async function listPaymentTypes2(params: {
  page_size?: number;
  after?: string;
}): Promise<PaginatedResponse<PaymentType>> {
  const client = getClient();
  return client.list<PaymentType>('/payment_types', {
    version: '2.0',
    params: {
      page_size: params.page_size,
      after: params.after,
    },
  });
}

export async function getPaymentType(paymentTypeId: string): Promise<SingleResponse<PaymentType>> {
  const client = getClient();
  return client.getOne<PaymentType>(`/payment_types/${paymentTypeId}`, { version: '2.0' });
}

// Payments listing
export async function listPayments(params: {
  page_size?: number;
  after?: string;
  sale_id?: string;
}): Promise<PaginatedResponse<Payment>> {
  const client = getClient();
  return client.list<Payment>('/payments', {
    version: '2.0',
    params: {
      page_size: params.page_size,
      after: params.after,
      sale_id: params.sale_id,
    },
  });
}

// Fulfillment Tools

export async function listFulfillments(params: {
  page_size?: number;
  after?: string;
  sale_id?: string;
  status?: string;
}): Promise<PaginatedResponse<Fulfillment>> {
  const client = getClient();
  return client.list<Fulfillment>('/fulfillments', {
    version: '2.0',
    params: {
      page_size: params.page_size,
      after: params.after,
      sale_id: params.sale_id,
      status: params.status,
    },
  });
}

export async function getFulfillment(fulfillmentId: string): Promise<SingleResponse<Fulfillment>> {
  const client = getClient();
  // Note: There is no /fulfillments/{id} endpoint in the API.
  // We fetch from the list and filter by ID instead.
  const response = await client.list<Fulfillment>('/fulfillments', {
    version: '2.0',
    params: {},
  });

  // Find the fulfillment by ID from the list
  const fulfillmentsData = response.data || [];
  const fulfillment = fulfillmentsData.find((f: Fulfillment) => f.id === fulfillmentId);

  if (!fulfillment) {
    throw new Error(`Fulfillment with ID ${fulfillmentId} not found`);
  }

  return { data: fulfillment, includes: null };
}

export async function createFulfillment(data: FulfillmentCreateInput): Promise<SingleResponse<Fulfillment>> {
  const client = getClient();
  return client.post<SingleResponse<Fulfillment>>('/fulfillments', data, { version: '2.0' });
}

export async function updateFulfillment(fulfillmentId: string, data: Partial<FulfillmentCreateInput>): Promise<SingleResponse<Fulfillment>> {
  const client = getClient();
  return client.put<SingleResponse<Fulfillment>>(`/fulfillments/${fulfillmentId}`, data, { version: '2.0' });
}

export async function deleteFulfillment(fulfillmentId: string): Promise<void> {
  const client = getClient();
  await client.delete(`/fulfillments/${fulfillmentId}`, { version: '2.0' });
}

// Extended Fulfillment Tools (BETA)

export async function getFulfillmentSummary(): Promise<SingleResponse<FulfillmentSummary>> {
  const client = getClient();
  return client.getOne<FulfillmentSummary>('/fulfillments/summary', { version: '2.0' });
}

export async function fulfillSaleLineItems(saleId: string, data: {
  line_items: { sale_product_id: string; quantity: number }[];
}): Promise<SingleResponse<Fulfillment>> {
  const client = getClient();
  return client.post<SingleResponse<Fulfillment>>(`/sales/${saleId}/fulfillments/line_items`, data, { version: '2.0' });
}

export async function packSaleLineItems(saleId: string, data: {
  line_items: { sale_product_id: string; quantity: number }[];
}): Promise<SingleResponse<Fulfillment>> {
  const client = getClient();
  return client.post<SingleResponse<Fulfillment>>(`/sales/${saleId}/fulfillments/pack`, data, { version: '2.0' });
}

export async function pickSaleLineItems(saleId: string, data: {
  line_items: { sale_product_id: string; quantity: number }[];
}): Promise<SingleResponse<Fulfillment>> {
  const client = getClient();
  return client.post<SingleResponse<Fulfillment>>(`/sales/${saleId}/fulfillments/pick`, data, { version: '2.0' });
}

// Sale Fulfillments (on sale resource)

export async function fulfillSale(saleId: string, data: FulfillmentCreateInput): Promise<SingleResponse<Fulfillment>> {
  const client = getClient();
  return client.post<SingleResponse<Fulfillment>>(`/sales/${saleId}/fulfillments`, data, { version: '2.0' });
}

export async function listSaleFulfillments(saleId: string, params: {
  page_size?: number;
  after?: string;
}): Promise<PaginatedResponse<Fulfillment>> {
  const client = getClient();
  return client.list<Fulfillment>(`/sales/${saleId}/fulfillments`, {
    version: '2.0',
    params: {
      page_size: params.page_size,
      after: params.after,
    },
  });
}

// Pick List Tools

export async function listSalePickLists(saleId: string, params: {
  page_size?: number;
  after?: string;
}): Promise<PaginatedResponse<PickList>> {
  const client = getClient();
  return client.list<PickList>(`/sales/${saleId}/pick_lists`, {
    version: '2.0',
    params: {
      page_size: params.page_size,
      after: params.after,
    },
  });
}

// ─── Daily Sales Summary ──────────────────────────────────────────────────────

/**
 * Fetch all closed, non-deleted sales for a given date and compute a complete
 * revenue waterfall that matches the Lightspeed Sales Report:
 *
 *   gross_sales            Full price × qty before discounts
 *   - total_discounts      Sum of line-item discounts (negative value)
 *   = net_sales            Post-discount revenue
 *   - return_amount        Value of return transactions (negative)
 *   = net_revenue          Matches the "Revenue" column in Lightspeed reports
 *
 * The v0.9 /register_sales endpoint returns all data (incl. line items and
 * payments) in a single paginated call, so we page until we have all records
 * for the target date, then stop.
 */
export async function getDailySalesSummary(params: {
  date: string;  // YYYY-MM-DD
}): Promise<DailySalesSummary> {
  const client = getClient();
  const targetDate = params.date; // e.g. "2026-05-10"

  // Collect all matching sales across pages
  const allSales: V09Sale[] = [];
  let page = 1;
  let doneCollecting = false;

  // We fetch in descending order (default) and stop when we've passed our date.
  // Strategy: fetch pages until we see records older than our target date, then stop.
  // Worst case we over-fetch by one page; that's fine.
  while (!doneCollecting) {
    const raw = await client.get<V09RegisterSalesResponse>('/register_sales', {
      version: '0.9',
      params: {
        page_size: 200,
        page,
        status: 'CLOSED',
      },
    });

    const records = raw.register_sales ?? [];
    if (records.length === 0) break;

    let foundAny = false;
    let allOlder = true;

    for (const sale of records) {
      const saleDay = sale.sale_date.substring(0, 10); // "2026-05-10"
      if (saleDay === targetDate && !sale.deleted_at) {
        allSales.push(sale);
        foundAny = true;
        allOlder = false;
      } else if (saleDay > targetDate) {
        // Still in records newer than target — keep paging
        allOlder = false;
      }
      // saleDay < targetDate contributes to allOlder check
    }

    // If every record on this page is older than the target date, we're done
    const oldestOnPage = records[records.length - 1].sale_date.substring(0, 10);
    if (oldestOnPage < targetDate) {
      doneCollecting = true;
    }

    if (raw.pagination && page >= raw.pagination.pages) {
      doneCollecting = true;
    }

    page++;
  }

  // ─── Compute the waterfall ──────────────────────────────────────────────────

  let grossSales = 0;
  let totalDiscounts = 0;
  let returnAmount = 0;
  let taxCollected = 0;
  let saleCount = 0;
  let returnCount = 0;
  let clearanceCount = 0;
  let clearanceAmount = 0;
  const paymentMap = new Map<string, { amount: number; count: number }>();

  const transactions: DailySalesSummaryTransaction[] = [];

  for (const sale of allSales) {
    const isReturn = !!(sale.return_for && sale.return_for !== '');
    const products = sale.register_sale_products ?? [];
    const payments = sale.register_sale_payments ?? [];

    // gross = sum of positive price_total lines only.
    // Negative price_total lines (TapMango loyalty discounts, qty=-1) are NOT
    // revenue — including their absolute value in gross inflates both gross and
    // the derived discount (saleGross - saleNet). Exclude them entirely.
    let saleGross = 0;

    for (const p of products) {
      const priceTotal = Number(p.price_total) || 0;
      if (priceTotal <= 0) continue;  // skip negative/zero lines (TapMango etc.)
      saleGross += priceTotal;

      // Clearance: scan promotions array for name="Clearance"
      const hasClearance = (p.promotions ?? []).some(
        promo => promo.name?.toLowerCase() === 'clearance'
      );
      if (hasClearance) {
        clearanceCount++;
        // The discount field is the markdown delta (retail price - selling price)
        clearanceAmount -= Number(p.discount) || 0;  // store as negative
      }
    }

    const saleNet = Number(sale.total_price) || 0;  // authoritative post-discount revenue
    const saleDiscount = round2(saleGross - saleNet);        // derived discount
    const saleTax = Number(sale.total_tax) || 0;

    // Aggregate payment methods
    for (const pmt of payments) {
      const methodName = pmt.name || 'Unknown';
      const pmtAmount = Number(pmt.amount) || 0;
      if (!paymentMap.has(methodName)) {
        paymentMap.set(methodName, { amount: 0, count: 0 });
      }
      const entry = paymentMap.get(methodName)!;
      entry.amount += pmtAmount;
      entry.count += 1;
    }

    if (isReturn) {
      returnCount++;
      returnAmount -= saleNet; // will be negative contribution to revenue
      taxCollected += saleTax; // tax on returns is typically negative in sale.total_tax
    } else {
      saleCount++;
      grossSales += saleGross;
      totalDiscounts -= saleDiscount; // store as negative
      taxCollected += saleTax;
    }

    // Build transaction record
    const txPayments = payments.map(p => ({
      name: p.name || 'Unknown',
      amount: Number(p.amount) || 0,
    }));

    transactions.push({
      invoice_number: sale.invoice_number,
      sale_date: sale.sale_date,
      is_return: isReturn,
      gross: saleGross,
      discounts: -saleDiscount,
      net: saleNet,
      tax: saleTax,
      payments: txPayments,
    });
  }

  const netSales = grossSales + totalDiscounts; // totalDiscounts is already negative
  const netRevenue = netSales - returnAmount;   // returnAmount is positive, we subtract

  const paymentBreakdown = Array.from(paymentMap.entries())
    .map(([method, { amount, count }]) => ({ method, amount: round2(amount), count }))
    .sort((a, b) => b.amount - a.amount);

  return {
    date: targetDate,
    store_id: params.date, // will be overwritten by caller with actual store id

    sale_count: saleCount,
    return_count: returnCount,
    total_transaction_count: allSales.length,

    gross_sales: round2(grossSales),
    total_discounts: round2(totalDiscounts),
    net_sales: round2(netSales),
    return_amount: round2(-returnAmount),   // show as negative
    net_revenue: round2(netRevenue),

    tax_collected: round2(taxCollected),
    avg_sale_value: saleCount > 0 ? round2(netRevenue / saleCount) : 0,

    clearance_count: clearanceCount,
    clearance_amount: round2(clearanceAmount),  // already negative

    payment_breakdown: paymentBreakdown,

    transactions: transactions.sort((a, b) => a.sale_date.localeCompare(b.sale_date)),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// Tool definitions for MCP
export const saleToolDefinitions = [
  {
    name: 'lightspeed_list_sales',
    description: 'List sales/transactions with optional filtering and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        page_size: { type: 'number', description: 'Number of results per page' },
        after: { type: 'string', description: 'Cursor for pagination (next page)' },
        before: { type: 'string', description: 'Cursor for pagination (previous page)' },
        since: { type: 'string', description: 'Filter by last updated date (ISO 8601)' },
        outlet_id: { type: 'string', description: 'Filter by outlet ID' },
        status: { type: 'string', description: 'Filter by status (SAVED, CLOSED, ONACCOUNT, VOIDED, LAYBY)' },
        customer_id: { type: 'string', description: 'Filter by customer ID' },
        user_id: { type: 'string', description: 'Filter by user/staff ID' },
        invoice_number: { type: 'string', description: 'Filter by invoice number' },
        tag: { type: 'string', description: 'Filter by sale tag' },
      },
    },
  },
  {
    name: 'lightspeed_get_sale',
    description: 'Get a single sale by ID',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID' },
      },
      required: ['sale_id'],
    },
  },
  {
    name: 'lightspeed_create_sale',
    description: 'Create a new sale/transaction',
    inputSchema: {
      type: 'object',
      properties: {
        outlet_id: { type: 'string', description: 'Outlet ID (required)' },
        register_id: { type: 'string', description: 'Register ID (required)' },
        customer_id: { type: 'string', description: 'Customer ID' },
        user_id: { type: 'string', description: 'Staff user ID' },
        status: { type: 'string', description: 'Sale status (SAVED, CLOSED, ONACCOUNT, LAYBY)' },
        note: { type: 'string', description: 'Sale note' },
        sale_date: { type: 'string', description: 'Sale date (ISO 8601)' },
        register_sale_products: {
          type: 'array',
          description: 'Array of products in the sale',
          items: {
            type: 'object',
            properties: {
              product_id: { type: 'string', description: 'Product ID' },
              quantity: { type: 'number', description: 'Quantity' },
              price: { type: 'number', description: 'Unit price' },
              discount: { type: 'number', description: 'Discount amount' },
              tax_id: { type: 'string', description: 'Tax ID' },
              note: { type: 'string', description: 'Line item note' },
            },
            required: ['product_id', 'quantity'],
          },
        },
        register_sale_payments: {
          type: 'array',
          description: 'Array of payments for the sale',
          items: {
            type: 'object',
            properties: {
              payment_type_id: { type: 'string', description: 'Payment type ID' },
              amount: { type: 'number', description: 'Payment amount' },
            },
            required: ['payment_type_id', 'amount'],
          },
        },
      },
      required: ['outlet_id', 'register_id', 'register_sale_products'],
    },
  },
  {
    name: 'lightspeed_update_sale',
    description: 'Update an existing sale',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID to update' },
        status: { type: 'string', description: 'New status' },
        customer_id: { type: 'string', description: 'Customer ID' },
        note: { type: 'string', description: 'Sale note' },
        register_sale_products: { type: 'array', description: 'Updated products array' },
        register_sale_payments: { type: 'array', description: 'Updated payments array' },
      },
      required: ['sale_id'],
    },
  },
  {
    name: 'lightspeed_list_payment_types',
    description: 'List all available payment types',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'lightspeed_list_payment_types_v2',
    description: 'List payment types using API v2.0 with pagination',
    inputSchema: {
      type: 'object',
      properties: {
        page_size: { type: 'number', description: 'Number of results per page' },
        after: { type: 'string', description: 'Cursor for pagination' },
      },
    },
  },
  {
    name: 'lightspeed_get_payment_type',
    description: 'Get a single payment type by ID',
    inputSchema: {
      type: 'object',
      properties: {
        payment_type_id: { type: 'string', description: 'The payment type ID' },
      },
      required: ['payment_type_id'],
    },
  },
  {
    name: 'lightspeed_list_payments',
    description: 'List all payments with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        page_size: { type: 'number', description: 'Number of results per page' },
        after: { type: 'string', description: 'Cursor for pagination' },
        sale_id: { type: 'string', description: 'Filter by sale ID' },
      },
    },
  },
  {
    name: 'lightspeed_list_fulfillments',
    description: 'List fulfillments with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        page_size: { type: 'number', description: 'Number of results per page' },
        after: { type: 'string', description: 'Cursor for pagination' },
        sale_id: { type: 'string', description: 'Filter by sale ID' },
        status: { type: 'string', description: 'Filter by status (PENDING, PACKED, SHIPPED, DELIVERED, CANCELLED)' },
      },
    },
  },
  {
    name: 'lightspeed_get_fulfillment',
    description: 'Get a single fulfillment by ID',
    inputSchema: {
      type: 'object',
      properties: {
        fulfillment_id: { type: 'string', description: 'The fulfillment ID' },
      },
      required: ['fulfillment_id'],
    },
  },
  {
    name: 'lightspeed_create_fulfillment',
    description: 'Create a new fulfillment for a sale',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID to fulfill' },
        status: { type: 'string', description: 'Fulfillment status' },
        tracking_number: { type: 'string', description: 'Shipment tracking number' },
        tracking_company: { type: 'string', description: 'Shipping carrier name' },
        line_items: {
          type: 'array',
          description: 'Line items to fulfill',
          items: {
            type: 'object',
            properties: {
              sale_product_id: { type: 'string', description: 'Sale product ID' },
              quantity: { type: 'number', description: 'Quantity to fulfill' },
            },
            required: ['sale_product_id', 'quantity'],
          },
        },
      },
      required: ['sale_id', 'line_items'],
    },
  },
  {
    name: 'lightspeed_update_fulfillment',
    description: 'Update a fulfillment (e.g., add tracking info)',
    inputSchema: {
      type: 'object',
      properties: {
        fulfillment_id: { type: 'string', description: 'The fulfillment ID' },
        status: { type: 'string', description: 'New status' },
        tracking_number: { type: 'string', description: 'Tracking number' },
        tracking_company: { type: 'string', description: 'Shipping carrier' },
      },
      required: ['fulfillment_id'],
    },
  },
  {
    name: 'lightspeed_delete_fulfillment',
    description: 'Delete a fulfillment',
    inputSchema: {
      type: 'object',
      properties: {
        fulfillment_id: { type: 'string', description: 'The fulfillment ID to delete' },
      },
      required: ['fulfillment_id'],
    },
  },
  {
    name: 'lightspeed_create_sale_v2',
    description: 'Create a new sale using API v2.0',
    inputSchema: {
      type: 'object',
      properties: {
        outlet_id: { type: 'string', description: 'Outlet ID (required)' },
        register_id: { type: 'string', description: 'Register ID (required)' },
        customer_id: { type: 'string', description: 'Customer ID' },
        user_id: { type: 'string', description: 'Staff user ID' },
        status: { type: 'string', description: 'Sale status' },
        note: { type: 'string', description: 'Sale note' },
        register_sale_products: { type: 'array', description: 'Array of products' },
        register_sale_payments: { type: 'array', description: 'Array of payments' },
      },
      required: ['outlet_id', 'register_id'],
    },
  },
  {
    name: 'lightspeed_update_sale_v2',
    description: 'Update a sale using API v2.0',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID to update' },
        status: { type: 'string', description: 'New status' },
        customer_id: { type: 'string', description: 'Customer ID' },
        note: { type: 'string', description: 'Sale note' },
      },
      required: ['sale_id'],
    },
  },
  {
    name: 'lightspeed_delete_sale',
    description: 'Delete/void a sale',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID to delete' },
      },
      required: ['sale_id'],
    },
  },
  {
    name: 'lightspeed_return_sale',
    description: 'Process a return for a sale',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID to return' },
        return_products: {
          type: 'array',
          description: 'Products to return',
          items: {
            type: 'object',
            properties: {
              product_id: { type: 'string', description: 'Product ID' },
              quantity: { type: 'number', description: 'Quantity to return' },
            },
            required: ['product_id', 'quantity'],
          },
        },
      },
      required: ['sale_id'],
    },
  },
  {
    name: 'lightspeed_get_payment',
    description: 'Get a single payment by ID',
    inputSchema: {
      type: 'object',
      properties: {
        payment_id: { type: 'string', description: 'The payment ID' },
      },
      required: ['payment_id'],
    },
  },
  {
    name: 'lightspeed_get_fulfillment_summary',
    description: 'Get fulfillment summary statistics (BETA)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'lightspeed_fulfill_sale_line_items',
    description: 'Fulfill specific line items of a sale (BETA)',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID' },
        line_items: {
          type: 'array',
          description: 'Line items to fulfill',
          items: {
            type: 'object',
            properties: {
              sale_product_id: { type: 'string', description: 'Sale product ID' },
              quantity: { type: 'number', description: 'Quantity to fulfill' },
            },
            required: ['sale_product_id', 'quantity'],
          },
        },
      },
      required: ['sale_id', 'line_items'],
    },
  },
  {
    name: 'lightspeed_pack_sale_line_items',
    description: 'Pack specific line items of a sale (BETA)',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID' },
        line_items: {
          type: 'array',
          description: 'Line items to pack',
          items: {
            type: 'object',
            properties: {
              sale_product_id: { type: 'string', description: 'Sale product ID' },
              quantity: { type: 'number', description: 'Quantity to pack' },
            },
            required: ['sale_product_id', 'quantity'],
          },
        },
      },
      required: ['sale_id', 'line_items'],
    },
  },
  {
    name: 'lightspeed_pick_sale_line_items',
    description: 'Pick specific line items of a sale (BETA)',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID' },
        line_items: {
          type: 'array',
          description: 'Line items to pick',
          items: {
            type: 'object',
            properties: {
              sale_product_id: { type: 'string', description: 'Sale product ID' },
              quantity: { type: 'number', description: 'Quantity to pick' },
            },
            required: ['sale_product_id', 'quantity'],
          },
        },
      },
      required: ['sale_id', 'line_items'],
    },
  },
  {
    name: 'lightspeed_fulfill_sale',
    description: 'Create a fulfillment for a sale',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID' },
        status: { type: 'string', description: 'Fulfillment status' },
        tracking_number: { type: 'string', description: 'Tracking number' },
        tracking_company: { type: 'string', description: 'Shipping carrier' },
        line_items: {
          type: 'array',
          description: 'Line items to fulfill',
          items: {
            type: 'object',
            properties: {
              sale_product_id: { type: 'string', description: 'Sale product ID' },
              quantity: { type: 'number', description: 'Quantity to fulfill' },
            },
            required: ['sale_product_id', 'quantity'],
          },
        },
      },
      required: ['sale_id', 'line_items'],
    },
  },
  {
    name: 'lightspeed_list_sale_fulfillments',
    description: 'List fulfillments for a specific sale',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID' },
        page_size: { type: 'number', description: 'Number of results per page' },
        after: { type: 'string', description: 'Cursor for pagination' },
      },
      required: ['sale_id'],
    },
  },
  {
    name: 'lightspeed_list_sale_pick_lists',
    description: 'List pick lists for a specific sale',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: { type: 'string', description: 'The sale ID' },
        page_size: { type: 'number', description: 'Number of results per page' },
        after: { type: 'string', description: 'Cursor for pagination' },
      },
      required: ['sale_id'],
    },
  },
  {
    name: 'lightspeed_daily_sales_summary',
    description: `Get a complete daily sales summary for a store on a specific date.
Returns a revenue waterfall that matches the Lightspeed Sales Report:
  gross_sales → minus discounts → net_sales → minus returns → net_revenue
Also includes: transaction count, return count, tax collected, average sale value,
payment method breakdown (cash / card / etc.), and a per-transaction list with
discount and return flags. Always use this tool when the user asks about sales,
revenue, or performance for a specific day — do NOT manually paginate register_sales.`,
    inputSchema: {
      type: 'object',
      properties: {
        store_id: {
          type: 'string',
          description: 'Store ID to query (e.g. "larkgifts", "nerdherd", "ohman", "gettysburggoods"). Required when multiple stores are configured.',
        },
        date: {
          type: 'string',
          description: 'The date to summarise, in YYYY-MM-DD format (e.g. "2026-05-10").',
        },
      },
      required: ['date'],
    },
  },
];
