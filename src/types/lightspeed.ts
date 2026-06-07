// Lightspeed X-Series API Types

// Common types
export interface PaginatedResponse<T> {
  data: T[];
  version?: {
    min: number;
    max: number;
  };
}

export interface SingleResponse<T> {
  data: T;
  includes?: unknown;
}

// Customer types
export interface Customer {
  id: string;
  customer_code?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  twitter?: string;
  website?: string;
  physical_address_1?: string;
  physical_address_2?: string;
  physical_suburb?: string;
  physical_city?: string;
  physical_postcode?: string;
  physical_state?: string;
  physical_country_id?: string;
  postal_address_1?: string;
  postal_address_2?: string;
  postal_suburb?: string;
  postal_city?: string;
  postal_postcode?: string;
  postal_state?: string;
  postal_country_id?: string;
  customer_group_id?: string;
  enable_loyalty?: boolean;
  loyalty_balance?: number;
  store_credit?: number;
  note?: string;
  sex?: string;
  date_of_birth?: string;
  company_name?: string;
  do_not_email?: boolean;
  contact_source?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface CustomerCreateInput {
  customer_code?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  twitter?: string;
  website?: string;
  physical_address_1?: string;
  physical_address_2?: string;
  physical_suburb?: string;
  physical_city?: string;
  physical_postcode?: string;
  physical_state?: string;
  physical_country_id?: string;
  postal_address_1?: string;
  postal_address_2?: string;
  postal_suburb?: string;
  postal_city?: string;
  postal_postcode?: string;
  postal_state?: string;
  postal_country_id?: string;
  customer_group_id?: string;
  enable_loyalty?: boolean;
  note?: string;
  sex?: string;
  date_of_birth?: string;
  company_name?: string;
  do_not_email?: boolean;
}

// Customer Group types
export interface CustomerGroup {
  id: string;
  name: string;
  group_id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Product types
export interface Product {
  id: string;
  source_id?: string;
  variant_source_id?: string;
  handle?: string;
  has_variants?: boolean;
  variant_parent_id?: string;
  variant_option_one_name?: string;
  variant_option_one_value?: string;
  variant_option_two_name?: string;
  variant_option_two_value?: string;
  variant_option_three_name?: string;
  variant_option_three_value?: string;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  image_large?: string;
  images?: ProductImage[];
  sku?: string;
  tags?: string;
  tag_ids?: string[];
  brand_id?: string;
  brand_name?: string;
  supplier_name?: string;
  supplier_code?: string;
  supplier_id?: string;
  supply_price?: number;
  account_code?: string;
  account_code_purchase?: string;
  type_id?: string;
  type_name?: string;
  product_type_id?: string;
  track_inventory?: boolean;
  inventory?: ProductInventory[];
  price?: number;
  price_including_tax?: number;
  tax?: number;
  tax_id?: string;
  tax_name?: string;
  tax_rate?: number;
  price_book_entries?: PriceBookEntry[];
  loyalty_value?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  version?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  version?: number;
}

export interface ProductInventory {
  outlet_id: string;
  outlet_name?: string;
  count?: number;
  reorder_point?: number;
  restock_level?: number;
}

export interface PriceBookEntry {
  id: string;
  product_id: string;
  price_book_id: string;
  price_book_name?: string;
  type?: string;
  outlet_name?: string;
  outlet_id?: string;
  customer_group_name?: string;
  customer_group_id?: string;
  price?: number;
  loyalty_value?: number;
  tax?: number;
  tax_id?: string;
  tax_name?: string;
  tax_rate?: number;
  display_retail_price_tax_inclusive?: number;
  min_units?: number;
  max_units?: number;
  valid_from?: string;
  valid_to?: string;
}

export interface ProductCreateInput {
  source_id?: string;
  variant_source_id?: string;
  handle?: string;
  active?: boolean;
  name: string;
  description?: string;
  sku?: string;
  tags?: string;
  tag_ids?: string[];
  brand_id?: string;
  supplier_id?: string;
  supply_price?: number;
  account_code?: string;
  account_code_purchase?: string;
  product_type_id?: string;
  track_inventory?: boolean;
  price?: number;
  tax_id?: string;
  loyalty_value?: number;
  variant_option_one_name?: string;
  variant_option_one_value?: string;
  variant_option_two_name?: string;
  variant_option_two_value?: string;
  variant_option_three_name?: string;
  variant_option_three_value?: string;
}

// Brand types
export interface Brand {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  version?: number;
}

export interface BrandCreateInput {
  name: string;
  description?: string;
}

// Product Type types
export interface ProductType {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  version?: number;
}

export interface ProductTypeCreateInput {
  name: string;
}

// Tag types
export interface Tag {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  version?: number;
}

export interface TagCreateInput {
  name: string;
}

// Supplier types
export interface Supplier {
  id: string;
  name: string;
  description?: string;
  source?: string;
  contact?: SupplierContact;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface SupplierContact {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  twitter?: string;
  website?: string;
  physical_address_1?: string;
  physical_address_2?: string;
  physical_suburb?: string;
  physical_city?: string;
  physical_postcode?: string;
  physical_state?: string;
  physical_country_id?: string;
  postal_address_1?: string;
  postal_address_2?: string;
  postal_suburb?: string;
  postal_city?: string;
  postal_postcode?: string;
  postal_state?: string;
  postal_country_id?: string;
}

export interface SupplierCreateInput {
  name: string;
  description?: string;
  contact?: SupplierContact;
}

// Outlet types
export interface Outlet {
  id: string;
  name: string;
  time_zone?: string;
  currency?: string;
  currency_symbol?: string;
  display_prices_tax_inclusive?: boolean;
  physical_address_1?: string;
  physical_address_2?: string;
  physical_suburb?: string;
  physical_city?: string;
  physical_postcode?: string;
  physical_state?: string;
  physical_country_id?: string;
  email?: string;
  phone?: string;
  default_tax_id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Register types
export interface Register {
  id: string;
  name: string;
  outlet_id: string;
  outlet_name?: string;
  ask_for_note_on_save?: boolean;
  print_note_on_receipt?: boolean;
  ask_for_user_on_sale?: boolean;
  show_discounts_on_receipt?: boolean;
  print_receipt?: boolean;
  email_receipt?: boolean;
  invoice_prefix?: string;
  invoice_suffix?: string;
  invoice_sequence?: number;
  button_layout_id?: string;
  is_open?: boolean;
  register_open_time?: string;
  register_close_time?: string;
  register_open_sequence_id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Sale types
export interface Sale {
  id: string;
  outlet_id: string;
  register_id: string;
  user_id?: string;
  customer_id?: string;
  invoice_number?: string;
  invoice_sequence?: number;
  status?: 'SAVED' | 'CLOSED' | 'ONACCOUNT' | 'VOIDED' | 'LAYBY' | 'LAYBY_CLOSED' | 'ONACCOUNT_CLOSED';
  note?: string;
  short_code?: string;
  return_for?: string;
  source?: string;
  source_id?: string;
  register_sale_products?: SaleProduct[];
  register_sale_payments?: SalePayment[];
  totals?: SaleTotals;
  sale_date?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface SaleProduct {
  id?: string;
  product_id: string;
  quantity: number;
  price?: number;
  price_set?: number;
  discount?: number;
  loyalty_value?: number;
  tax?: number;
  tax_id?: string;
  tax_total?: number;
  price_total?: number;
  status?: string;
  attributes?: SaleProductAttribute[];
  note?: string;
}

export interface SaleProductAttribute {
  name: string;
  value: string;
}

export interface SalePayment {
  id?: string;
  payment_type_id: string;
  register_id?: string;
  amount: number;
  payment_date?: string;
}

export interface SaleTotals {
  total_price?: number;
  total_tax?: number;
  total_loyalty?: number;
  total_payment?: number;
  total_to_pay?: number;
}

export interface SaleCreateInput {
  outlet_id: string;
  register_id: string;
  user_id?: string;
  customer_id?: string;
  status?: 'SAVED' | 'CLOSED' | 'ONACCOUNT' | 'LAYBY';
  note?: string;
  register_sale_products: SaleProduct[];
  register_sale_payments?: SalePayment[];
  sale_date?: string;
}

// Payment Type types
export interface PaymentType {
  id: string;
  name: string;
  payment_type_id?: string;
  config?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Tax types
export interface Tax {
  id: string;
  name: string;
  rate?: number;
  default?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface TaxCreateInput {
  name: string;
  rate: number;
}

// User types
export interface User {
  id: string;
  username?: string;
  display_name?: string;
  email?: string;
  email_verified?: boolean;
  account_type?: string;
  image?: string;
  is_primary_user?: boolean;
  restricted_outlet_id?: string;
  target_daily?: number;
  target_weekly?: number;
  target_monthly?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Webhook types
export interface Webhook {
  id: string;
  retailer_id?: string;
  type: string;
  url: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WebhookCreateInput {
  type: string;
  url: string;
  active?: boolean;
}

// Consignment types
export interface Consignment {
  id: string;
  outlet_id: string;
  supplier_id?: string;
  type: 'SUPPLIER' | 'OUTLET' | 'STOCKTAKE' | 'RETURN';
  name?: string;
  status?: 'OPEN' | 'SENT' | 'RECEIVED' | 'CANCELLED' | 'STOCKTAKE_SCHEDULED' | 'STOCKTAKE_IN_PROGRESS' | 'STOCKTAKE_IN_PROGRESS_PROCESSING' | 'STOCKTAKE_COMPLETE';
  consignment_date?: string;
  due_at?: string;
  received_at?: string;
  source_outlet_id?: string;
  total_cost_price?: number;
  total_count_received?: number;
  reference?: string;
  supplier_invoice?: string;
  filters?: ConsignmentFilter[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ConsignmentFilter {
  type: string;
  value: string;
}

export interface ConsignmentCreateInput {
  outlet_id: string;
  supplier_id?: string;
  type: 'SUPPLIER' | 'OUTLET' | 'STOCKTAKE' | 'RETURN';
  name?: string;
  status?: 'OPEN' | 'SENT' | 'RECEIVED' | 'CANCELLED';
  consignment_date?: string;
  due_at?: string;
  source_outlet_id?: string;
  reference?: string;
  supplier_invoice?: string;
}

export interface ConsignmentProduct {
  id: string;
  consignment_id: string;
  product_id: string;
  count?: number;
  cost?: number;
  received?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ConsignmentProductCreateInput {
  product_id: string;
  count: number;
  cost?: number;
}

// Inventory types
export interface Inventory {
  id: string;
  product_id: string;
  outlet_id: string;
  inventory_level: number;
  reorder_point?: number;
  restock_level?: number;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryUpdateInput {
  product_id: string;
  outlet_id: string;
  inventory_level: number;
  reorder_point?: number;
  restock_level?: number;
}

// Price Book types
export interface PriceBook {
  id: string;
  name: string;
  outlet_id?: string;
  customer_group_id?: string;
  valid_from?: string;
  valid_to?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  version?: number;
}

export interface PriceBookCreateInput {
  name: string;
  outlet_id?: string;
  customer_group_id?: string;
  valid_from?: string;
  valid_to?: string;
}

export interface PriceBookProduct {
  id: string;
  price_book_id: string;
  product_id: string;
  price: number;
  loyalty_value?: number;
  min_units?: number;
  max_units?: number;
  tax_id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface PriceBookProductCreateInput {
  product_id: string;
  price: number;
  loyalty_value?: number;
  min_units?: number;
  max_units?: number;
  tax_id?: string;
}

// Promotion types
export interface Promotion {
  id: string;
  name: string;
  type: 'SALE' | 'DISCOUNT' | 'BUNDLE';
  active?: boolean;
  start_date?: string;
  end_date?: string;
  outlet_ids?: string[];
  customer_group_ids?: string[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Gift Card types
export interface GiftCard {
  id: string;
  number: string;
  balance: number;
  initial_value?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  expiry_date?: string;
  customer_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GiftCardCreateInput {
  number?: string;
  initial_value: number;
  expiry_date?: string;
  customer_id?: string;
}

// Store Credit types
export interface StoreCredit {
  id: string;
  customer_id: string;
  balance: number;
  created_at?: string;
  updated_at?: string;
}

// Shift types
export interface Shift {
  id: string;
  register_id: string;
  user_id?: string;
  outlet_id: string;
  status?: 'OPEN' | 'CLOSED';
  open_time?: string;
  close_time?: string;
  opening_float?: number;
  closing_float?: number;
  expected?: number;
  counted?: number;
  difference?: number;
  created_at?: string;
  updated_at?: string;
}

// Fulfillment types
export interface Fulfillment {
  id: string;
  sale_id: string;
  status?: 'PENDING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  tracking_number?: string;
  tracking_company?: string;
  shipped_at?: string;
  delivered_at?: string;
  line_items?: FulfillmentLineItem[];
  created_at?: string;
  updated_at?: string;
}

export interface FulfillmentLineItem {
  id?: string;
  sale_product_id: string;
  quantity: number;
}

export interface FulfillmentCreateInput {
  sale_id: string;
  status?: 'PENDING' | 'PACKED' | 'SHIPPED';
  tracking_number?: string;
  tracking_company?: string;
  line_items: FulfillmentLineItem[];
}

// Audit Log types
export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes?: Record<string, unknown>;
  ip_address?: string;
  created_at?: string;
}

// Retailer types
export interface Retailer {
  id: string;
  name: string;
  domain_prefix: string;
  currency?: string;
  currency_symbol?: string;
  time_zone?: string;
  contact_email?: string;
  contact_phone?: string;
  physical_address?: string;
  created_at?: string;
  updated_at?: string;
}

// Serial Number types
export interface SerialNumber {
  id: string;
  product_id: string;
  serial: string;
  status?: 'AVAILABLE' | 'SOLD' | 'RETURNED';
  sale_id?: string;
  consignment_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Product Category types
export interface ProductCategory {
  id: string;
  name: string;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  version?: number;
}

export interface ProductCategoryCreateInput {
  name: string;
  parent_id?: string;
}

// API Configuration
export interface LightspeedConfig {
  domainPrefix: string;
  accessToken: string;
  apiVersion?: '0.9' | '2.0' | '2.1' | '3.0';
}

// Error types
export interface LightspeedError {
  error: string;
  error_description?: string;
  details?: Record<string, unknown>;
}

// Customer Group Create/Update Input
export interface CustomerGroupCreateInput {
  name: string;
}

// Variant Attribute types
export interface VariantAttribute {
  id: string;
  name: string;
  values?: string[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface VariantAttributeCreateInput {
  name: string;
  values?: string[];
}

// Service Order types
export interface ServiceOrder {
  id: string;
  customer_id?: string;
  outlet_id: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description?: string;
  scheduled_at?: string;
  completed_at?: string;
  assigned_user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceOrderCreateInput {
  customer_id?: string;
  outlet_id: string;
  status?: string;
  description?: string;
  scheduled_at?: string;
  assigned_user_id?: string;
}

// Serial Number Create Input
export interface SerialNumberCreateInput {
  product_id: string;
  serial: string;
}

// Quote types
export interface Quote {
  id: string;
  customer_id?: string;
  outlet_id: string;
  register_id?: string;
  user_id?: string;
  status?: string;
  note?: string;
  quote_products?: QuoteProduct[];
  totals?: SaleTotals;
  valid_until?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuoteProduct {
  id?: string;
  product_id: string;
  quantity: number;
  price?: number;
  discount?: number;
  tax_id?: string;
}

// Channel Request Log types
export interface Channel {
  id: string;
  name: string;
  type?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RequestLog {
  id: string;
  channel_id?: string;
  method?: string;
  url?: string;
  status_code?: number;
  request_body?: string;
  response_body?: string;
  created_at?: string;
}

// Security Event types
export interface SecurityEvent {
  id: string;
  user_id?: string;
  event_type: string;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, unknown>;
  created_at?: string;
}

// Custom Field types
export interface CustomField {
  id: string;
  name: string;
  entity_type: string;
  field_type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'SELECT';
  options?: string[];
  required?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomFieldCreateInput {
  name: string;
  entity_type: string;
  field_type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'SELECT';
  options?: string[];
  required?: boolean;
}

export interface CustomFieldValue {
  id: string;
  custom_field_id: string;
  entity_id: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

// Rule types
export interface Rule {
  id: string;
  name: string;
  trigger: string;
  conditions?: Record<string, unknown>;
  actions?: Record<string, unknown>;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RuleCreateInput {
  name: string;
  trigger: string;
  conditions?: Record<string, unknown>;
  actions?: Record<string, unknown>;
  active?: boolean;
}

export interface RemoteRule {
  id: string;
  name: string;
  url: string;
  trigger: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RemoteRuleCreateInput {
  name: string;
  url: string;
  trigger: string;
  active?: boolean;
}

// Partner Billing types
export interface PartnerSubscription {
  id: string;
  retailer_id: string;
  plan_id?: string;
  status?: string;
  billing_cycle?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionToken {
  token: string;
  retailer_id: string;
  expires_at?: string;
  created_at?: string;
}

// Outlet Product Tax types
export interface OutletProductTax {
  id: string;
  outlet_id: string;
  product_id: string;
  tax_id: string;
  created_at?: string;
  updated_at?: string;
}

// Pick List types
export interface PickList {
  id: string;
  sale_id: string;
  status?: string;
  items?: PickListItem[];
  created_at?: string;
  updated_at?: string;
}

export interface PickListItem {
  id?: string;
  product_id: string;
  quantity: number;
  picked_quantity?: number;
}

// Button Layout types
export interface ButtonLayout {
  id: string;
  name: string;
  outlet_id?: string;
  layout?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

// Promotion Create Input
export interface PromotionCreateInput {
  name: string;
  type: 'SALE' | 'DISCOUNT' | 'BUNDLE';
  active?: boolean;
  start_date?: string;
  end_date?: string;
  outlet_ids?: string[];
  customer_group_ids?: string[];
  discount_amount?: number;
  discount_percentage?: number;
}

// Promo Code types
export interface PromoCode {
  id: string;
  code: string;
  promotion_id: string;
  usage_limit?: number;
  usage_count?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Gift Card Transaction types
export interface GiftCardTransaction {
  id: string;
  gift_card_id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  sale_id?: string;
  note?: string;
  created_at?: string;
}

export interface GiftCardTransactionCreateInput {
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  sale_id?: string;
  note?: string;
}

// Store Credit Transaction types
export interface StoreCreditTransaction {
  id: string;
  customer_id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  sale_id?: string;
  note?: string;
  created_at?: string;
}

export interface StoreCreditTransactionCreateInput {
  customer_id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  sale_id?: string;
  note?: string;
}

// User Sales Totals types
export interface UserSalesTotals {
  user_id: string;
  total_sales: number;
  total_revenue: number;
  average_sale: number;
  period_start?: string;
  period_end?: string;
}

// Register Payments Summary
export interface RegisterPaymentsSummary {
  register_id: string;
  payments: {
    payment_type_id: string;
    payment_type_name?: string;
    total: number;
    count: number;
  }[];
}

// Consignment Totals
export interface ConsignmentTotals {
  total_cost: number;
  total_count: number;
  total_received: number;
}

// Fulfillment Summary
export interface FulfillmentSummary {
  total_pending: number;
  total_packed: number;
  total_shipped: number;
  total_delivered: number;
}

// Search Result types
export interface SearchResult {
  type: string;
  id: string;
  name?: string;
  data?: Record<string, unknown>;
}

// Payment types (single payment)
export interface Payment {
  id: string;
  sale_id: string;
  payment_type_id: string;
  amount: number;
  payment_date?: string;
  created_at?: string;
  updated_at?: string;
}

// ─── V0.9 Raw API Response Types (internal use by getDailySalesSummary) ────────

/** Raw line item as returned by the v0.9 /register_sales list endpoint */
export interface V09SaleProduct {
  id: string;
  product_id: string;
  name?: string;
  sku?: string;
  handle?: string;
  quantity: number;
  price: number;
  discount: number;
  price_total: number;
  cost?: number;
  tax?: number;
  tax_total: number;
  tax_id?: string;
  tax_name?: string;
  status?: string;
}

/** Raw payment as returned by the v0.9 /register_sales list endpoint */
export interface V09SalePayment {
  id: string;
  name: string;
  label?: string;
  payment_type_id?: string;
  amount: number;
  payment_date?: string;
}

/** Raw sale record as returned by the v0.9 /register_sales list endpoint */
export interface V09Sale {
  id: string;
  invoice_number: string;
  sale_date: string;
  status: string;
  deleted_at: string | null;
  return_for: string;
  total_price: number;
  total_tax: number;
  total_cost?: number;
  note?: string;
  register_sale_products: V09SaleProduct[];
  register_sale_payments: V09SalePayment[];
  totals?: {
    total_price?: number;
    total_tax?: number;
    total_payment?: number;
    total_to_pay?: number;
  };
}

/** Raw paginated response from v0.9 /register_sales */
export interface V09RegisterSalesResponse {
  register_sales: V09Sale[];
  pagination: {
    results: number;
    page: number;
    page_size: number;
    pages: number;
  };
}

// ─── Daily Sales Summary (output of getDailySalesSummary) ─────────────────────

export interface DailySalesSummaryTransaction {
  invoice_number: string;
  sale_date: string;
  is_return: boolean;
  gross: number;
  discounts: number;
  net: number;
  tax: number;
  payments: Array<{ name: string; amount: number }>;
}

export interface DailySalesSummary {
  date: string;
  store_id: string;

  // Transaction counts
  sale_count: number;
  return_count: number;
  total_transaction_count: number;

  // Revenue waterfall (matches Lightspeed Sales Report columns)
  gross_sales: number;        // Full price × qty, before any discounts
  total_discounts: number;    // Sum of all discounts applied (shown as negative)
  net_sales: number;          // gross_sales + total_discounts (post-discount)
  return_amount: number;      // Value of returned merchandise (shown as negative)
  net_revenue: number;        // net_sales + return_amount — matches LS "Revenue" column

  // Tax & avg
  tax_collected: number;
  avg_sale_value: number;     // net_revenue / sale_count (excluding returns)

  // Payment breakdown
  payment_breakdown: Array<{ method: string; amount: number; count: number }>;

  // Raw transactions (for drill-down)
  transactions: DailySalesSummaryTransaction[];
}
