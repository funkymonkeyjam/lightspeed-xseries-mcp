#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { resolveClient, initializeStoresFromEnv } from './utils/api-client.js';
import { allToolDefinitions } from './tools/index.js';
import * as stores from './tools/stores.js';
import * as customers from './tools/customers.js';
import * as products from './tools/products.js';
import * as sales from './tools/sales.js';
import * as inventory from './tools/inventory.js';
import * as outlets from './tools/outlets.js';
import * as suppliers from './tools/suppliers.js';
import * as webhooks from './tools/webhooks.js';
import * as pricing from './tools/pricing.js';
import * as variants from './tools/variants.js';
import * as services from './tools/services.js';
import * as serialNumbers from './tools/serial-numbers.js';
import * as quotes from './tools/quotes.js';
import * as search from './tools/search.js';
import * as channels from './tools/channels.js';
import * as security from './tools/security.js';
import * as customFields from './tools/custom-fields.js';
import * as rules from './tools/rules.js';
import * as partner from './tools/partner.js';

// Server configuration
const SERVER_NAME = 'lightspeed-xseries-mcp-server';
const SERVER_VERSION = '1.0.0';

// Create MCP server
const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allToolDefinitions.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// resolveClient handles multi-store selection via store_id arg or registry defaults

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const toolArgs = (args || {}) as Record<string, unknown>;

  try {
    let result: unknown;

    // lightspeed_list_stores does not need a client — handle it first
    if (name === 'lightspeed_list_stores') {
      result = await stores.listStores();
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }

    // Resolve the correct store client (multi-store aware)
    resolveClient(toolArgs);

    switch (name) {
      // Customer tools
      case 'lightspeed_list_customers':
        result = await customers.listCustomers(toolArgs as Parameters<typeof customers.listCustomers>[0]);
        break;
      case 'lightspeed_get_customer':
        result = await customers.getCustomer(toolArgs.customer_id as string);
        break;
      case 'lightspeed_create_customer':
        result = await customers.createCustomer(toolArgs as Parameters<typeof customers.createCustomer>[0]);
        break;
      case 'lightspeed_update_customer':
        result = await customers.updateCustomer(
          toolArgs.customer_id as string,
          toolArgs as Parameters<typeof customers.updateCustomer>[1]
        );
        break;
      case 'lightspeed_delete_customer':
        result = await customers.deleteCustomer(toolArgs.customer_id as string);
        result = { success: true, message: 'Customer deleted successfully' };
        break;
      case 'lightspeed_list_customer_groups':
        result = await customers.listCustomerGroups(toolArgs as Parameters<typeof customers.listCustomerGroups>[0]);
        break;
      case 'lightspeed_get_customer_group':
        result = await customers.getCustomerGroup(toolArgs.group_id as string);
        break;

      // Product tools
      case 'lightspeed_list_products':
        result = await products.listProducts(toolArgs as Parameters<typeof products.listProducts>[0]);
        break;
      case 'lightspeed_get_product':
        result = await products.getProduct(toolArgs.product_id as string);
        break;
      case 'lightspeed_create_product':
        result = await products.createProduct(toolArgs as unknown as Parameters<typeof products.createProduct>[0]);
        break;
      case 'lightspeed_update_product':
        result = await products.updateProduct(
          toolArgs.product_id as string,
          toolArgs as Parameters<typeof products.updateProduct>[1]
        );
        break;
      case 'lightspeed_delete_product':
        await products.deleteProduct(toolArgs.product_id as string);
        result = { success: true, message: 'Product deleted successfully' };
        break;
      case 'lightspeed_list_product_types':
        result = await products.listProductTypes(toolArgs as Parameters<typeof products.listProductTypes>[0]);
        break;
      case 'lightspeed_get_product_type':
        result = await products.getProductType(toolArgs.type_id as string);
        break;
      case 'lightspeed_create_product_type':
        result = await products.createProductType(toolArgs as unknown as Parameters<typeof products.createProductType>[0]);
        break;
      case 'lightspeed_list_product_categories':
        result = await products.listProductCategories(toolArgs as Parameters<typeof products.listProductCategories>[0]);
        break;
      case 'lightspeed_get_product_category':
        result = await products.getProductCategory(toolArgs.category_id as string);
        break;
      case 'lightspeed_create_product_category':
        result = await products.createProductCategory(toolArgs as unknown as Parameters<typeof products.createProductCategory>[0]);
        break;
      case 'lightspeed_list_product_images':
        result = await products.listProductImages(toolArgs.product_id as string);
        break;
      case 'lightspeed_upload_product_image':
        result = await products.uploadProductImage(
          toolArgs.product_id as string,
          toolArgs.image_url as string
        );
        break;
      case 'lightspeed_delete_product_image':
        await products.deleteProductImage(
          toolArgs.product_id as string,
          toolArgs.image_id as string
        );
        result = { success: true, message: 'Product image deleted successfully' };
        break;

      // Sale tools
      case 'lightspeed_list_sales':
        result = await sales.listSales(toolArgs as Parameters<typeof sales.listSales>[0]);
        break;
      case 'lightspeed_get_sale':
        result = await sales.getSale(toolArgs.sale_id as string);
        break;
      case 'lightspeed_create_sale':
        result = await sales.createSale(toolArgs as unknown as Parameters<typeof sales.createSale>[0]);
        break;
      case 'lightspeed_update_sale':
        result = await sales.updateSale(
          toolArgs.sale_id as string,
          toolArgs as Parameters<typeof sales.updateSale>[1]
        );
        break;
      case 'lightspeed_list_payment_types':
        result = await sales.listPaymentTypes();
        break;
      case 'lightspeed_list_payment_types_v2':
        result = await sales.listPaymentTypes2(toolArgs as Parameters<typeof sales.listPaymentTypes2>[0]);
        break;
      case 'lightspeed_get_payment_type':
        result = await sales.getPaymentType(toolArgs.payment_type_id as string);
        break;
      case 'lightspeed_list_payments':
        result = await sales.listPayments(toolArgs as Parameters<typeof sales.listPayments>[0]);
        break;
      case 'lightspeed_list_fulfillments':
        result = await sales.listFulfillments(toolArgs as Parameters<typeof sales.listFulfillments>[0]);
        break;
      case 'lightspeed_get_fulfillment':
        result = await sales.getFulfillment(toolArgs.fulfillment_id as string);
        break;
      case 'lightspeed_create_fulfillment':
        result = await sales.createFulfillment(toolArgs as unknown as Parameters<typeof sales.createFulfillment>[0]);
        break;
      case 'lightspeed_update_fulfillment':
        result = await sales.updateFulfillment(
          toolArgs.fulfillment_id as string,
          toolArgs as Parameters<typeof sales.updateFulfillment>[1]
        );
        break;
      case 'lightspeed_delete_fulfillment':
        await sales.deleteFulfillment(toolArgs.fulfillment_id as string);
        result = { success: true, message: 'Fulfillment deleted successfully' };
        break;
      case 'lightspeed_create_sale_v2':
        result = await sales.createSale2(toolArgs as unknown as Parameters<typeof sales.createSale2>[0]);
        break;
      case 'lightspeed_update_sale_v2':
        result = await sales.updateSale2(
          toolArgs.sale_id as string,
          toolArgs as Parameters<typeof sales.updateSale2>[1]
        );
        break;
      case 'lightspeed_delete_sale':
        await sales.deleteSale(toolArgs.sale_id as string);
        result = { success: true, message: 'Sale deleted successfully' };
        break;

      case 'lightspeed_daily_sales_summary': {
        // resolveClient already set the active store; capture store_id for the response
        const summary = await sales.getDailySalesSummary({
          date: toolArgs.date as string,
        });
        // Stamp the store_id from args so the response is self-documenting
        summary.store_id = (toolArgs.store_id as string | undefined) ?? 'unknown';
        result = summary;
        break;
      }

      // Inventory tools
      case 'lightspeed_list_inventory':
        result = await inventory.listInventory(toolArgs as Parameters<typeof inventory.listInventory>[0]);
        break;
      case 'lightspeed_get_inventory':
        result = await inventory.getInventory(toolArgs.inventory_id as string);
        break;
      case 'lightspeed_update_inventory':
        result = await inventory.updateInventory(
          toolArgs.inventory_id as string,
          toolArgs as Parameters<typeof inventory.updateInventory>[1]
        );
        break;
      case 'lightspeed_list_consignments':
        result = await inventory.listConsignments(toolArgs as Parameters<typeof inventory.listConsignments>[0]);
        break;
      case 'lightspeed_get_consignment':
        result = await inventory.getConsignment(toolArgs.consignment_id as string);
        break;
      case 'lightspeed_create_consignment':
        result = await inventory.createConsignment(toolArgs as unknown as Parameters<typeof inventory.createConsignment>[0]);
        break;
      case 'lightspeed_update_consignment':
        result = await inventory.updateConsignment(
          toolArgs.consignment_id as string,
          toolArgs as Parameters<typeof inventory.updateConsignment>[1]
        );
        break;
      case 'lightspeed_delete_consignment':
        await inventory.deleteConsignment(toolArgs.consignment_id as string);
        result = { success: true, message: 'Consignment deleted successfully' };
        break;
      case 'lightspeed_list_consignment_products':
        result = await inventory.listConsignmentProducts(
          toolArgs.consignment_id as string,
          toolArgs as Parameters<typeof inventory.listConsignmentProducts>[1]
        );
        break;
      case 'lightspeed_add_consignment_product':
        result = await inventory.addConsignmentProduct(
          toolArgs.consignment_id as string,
          toolArgs as unknown as Parameters<typeof inventory.addConsignmentProduct>[1]
        );
        break;
      case 'lightspeed_update_consignment_product':
        result = await inventory.updateConsignmentProduct(
          toolArgs.consignment_id as string,
          toolArgs.product_id as string,
          toolArgs as Parameters<typeof inventory.updateConsignmentProduct>[2]
        );
        break;
      case 'lightspeed_delete_consignment_product':
        await inventory.deleteConsignmentProduct(
          toolArgs.consignment_id as string,
          toolArgs.product_id as string
        );
        result = { success: true, message: 'Consignment product deleted successfully' };
        break;

      // Outlet tools
      case 'lightspeed_list_outlets':
        result = await outlets.listOutlets();
        break;
      case 'lightspeed_get_outlet':
        result = await outlets.getOutlet(toolArgs.outlet_id as string);
        break;
      case 'lightspeed_list_registers':
        result = await outlets.listRegisters(toolArgs as Parameters<typeof outlets.listRegisters>[0]);
        break;
      case 'lightspeed_get_register':
        result = await outlets.getRegister(toolArgs.register_id as string);
        break;
      case 'lightspeed_list_shifts':
        result = await outlets.listShifts(toolArgs as Parameters<typeof outlets.listShifts>[0]);
        break;
      case 'lightspeed_get_shift':
        result = await outlets.getShift(toolArgs.shift_id as string);
        break;
      case 'lightspeed_list_taxes':
        result = await outlets.listTaxes();
        break;
      case 'lightspeed_get_tax':
        result = await outlets.getTax(toolArgs.tax_id as string);
        break;
      case 'lightspeed_create_tax':
        result = await outlets.createTax(toolArgs as unknown as Parameters<typeof outlets.createTax>[0]);
        break;
      case 'lightspeed_update_tax':
        result = await outlets.updateTax(
          toolArgs.tax_id as string,
          toolArgs as Parameters<typeof outlets.updateTax>[1]
        );
        break;
      case 'lightspeed_delete_tax':
        await outlets.deleteTax(toolArgs.tax_id as string);
        result = { success: true, message: 'Tax deleted successfully' };
        break;
      case 'lightspeed_list_users':
        result = await outlets.listUsers();
        break;
      case 'lightspeed_get_user':
        result = await outlets.getUser(toolArgs.user_id as string);
        break;
      case 'lightspeed_get_retailer':
        result = await outlets.getRetailer();
        break;

      // Supplier tools
      case 'lightspeed_list_suppliers':
        result = await suppliers.listSuppliers(toolArgs as Parameters<typeof suppliers.listSuppliers>[0]);
        break;
      case 'lightspeed_get_supplier':
        result = await suppliers.getSupplier(toolArgs.supplier_id as string);
        break;
      case 'lightspeed_create_supplier':
        result = await suppliers.createSupplier(toolArgs as unknown as Parameters<typeof suppliers.createSupplier>[0]);
        break;
      case 'lightspeed_update_supplier':
        result = await suppliers.updateSupplier(
          toolArgs.supplier_id as string,
          toolArgs as Parameters<typeof suppliers.updateSupplier>[1]
        );
        break;
      case 'lightspeed_delete_supplier':
        await suppliers.deleteSupplier(toolArgs.supplier_id as string);
        result = { success: true, message: 'Supplier deleted successfully' };
        break;
      case 'lightspeed_list_brands':
        result = await suppliers.listBrands(toolArgs as Parameters<typeof suppliers.listBrands>[0]);
        break;
      case 'lightspeed_get_brand':
        result = await suppliers.getBrand(toolArgs.brand_id as string);
        break;
      case 'lightspeed_create_brand':
        result = await suppliers.createBrand(toolArgs as unknown as Parameters<typeof suppliers.createBrand>[0]);
        break;
      case 'lightspeed_update_brand':
        result = await suppliers.updateBrand(
          toolArgs.brand_id as string,
          toolArgs as Parameters<typeof suppliers.updateBrand>[1]
        );
        break;
      case 'lightspeed_delete_brand':
        await suppliers.deleteBrand(toolArgs.brand_id as string);
        result = { success: true, message: 'Brand deleted successfully' };
        break;
      case 'lightspeed_list_tags':
        result = await suppliers.listTags(toolArgs as Parameters<typeof suppliers.listTags>[0]);
        break;
      case 'lightspeed_get_tag':
        result = await suppliers.getTag(toolArgs.tag_id as string);
        break;
      case 'lightspeed_create_tag':
        result = await suppliers.createTag(toolArgs as unknown as Parameters<typeof suppliers.createTag>[0]);
        break;
      case 'lightspeed_update_tag':
        result = await suppliers.updateTag(
          toolArgs.tag_id as string,
          toolArgs as Parameters<typeof suppliers.updateTag>[1]
        );
        break;
      case 'lightspeed_delete_tag':
        await suppliers.deleteTag(toolArgs.tag_id as string);
        result = { success: true, message: 'Tag deleted successfully' };
        break;

      // Webhook tools
      case 'lightspeed_list_webhooks':
        result = await webhooks.listWebhooks();
        break;
      case 'lightspeed_get_webhook':
        result = await webhooks.getWebhook(toolArgs.webhook_id as string);
        break;
      case 'lightspeed_create_webhook':
        result = await webhooks.createWebhook(toolArgs as unknown as Parameters<typeof webhooks.createWebhook>[0]);
        break;
      case 'lightspeed_update_webhook':
        result = await webhooks.updateWebhook(
          toolArgs.webhook_id as string,
          toolArgs as Parameters<typeof webhooks.updateWebhook>[1]
        );
        break;
      case 'lightspeed_delete_webhook':
        await webhooks.deleteWebhook(toolArgs.webhook_id as string);
        result = { success: true, message: 'Webhook deleted successfully' };
        break;

      // Pricing tools
      case 'lightspeed_list_price_books':
        result = await pricing.listPriceBooks(toolArgs as Parameters<typeof pricing.listPriceBooks>[0]);
        break;
      case 'lightspeed_get_price_book':
        result = await pricing.getPriceBook(toolArgs.price_book_id as string);
        break;
      case 'lightspeed_create_price_book':
        result = await pricing.createPriceBook(toolArgs as unknown as Parameters<typeof pricing.createPriceBook>[0]);
        break;
      case 'lightspeed_update_price_book':
        result = await pricing.updatePriceBook(
          toolArgs.price_book_id as string,
          toolArgs as Parameters<typeof pricing.updatePriceBook>[1]
        );
        break;
      case 'lightspeed_delete_price_book':
        await pricing.deletePriceBook(toolArgs.price_book_id as string);
        result = { success: true, message: 'Price book deleted successfully' };
        break;
      case 'lightspeed_list_price_book_products':
        result = await pricing.listPriceBookProducts(
          toolArgs.price_book_id as string,
          toolArgs as Parameters<typeof pricing.listPriceBookProducts>[1]
        );
        break;
      case 'lightspeed_add_price_book_product':
        result = await pricing.addPriceBookProduct(
          toolArgs.price_book_id as string,
          toolArgs as unknown as Parameters<typeof pricing.addPriceBookProduct>[1]
        );
        break;
      case 'lightspeed_update_price_book_product':
        result = await pricing.updatePriceBookProduct(
          toolArgs.price_book_id as string,
          toolArgs.product_id as string,
          toolArgs as Parameters<typeof pricing.updatePriceBookProduct>[2]
        );
        break;
      case 'lightspeed_delete_price_book_product':
        await pricing.deletePriceBookProduct(
          toolArgs.price_book_id as string,
          toolArgs.product_id as string
        );
        result = { success: true, message: 'Price book product deleted successfully' };
        break;
      case 'lightspeed_list_all_price_book_products':
        result = await pricing.listAllPriceBookProducts(toolArgs as Parameters<typeof pricing.listAllPriceBookProducts>[0]);
        break;
      case 'lightspeed_list_promotions':
        result = await pricing.listPromotions(toolArgs as Parameters<typeof pricing.listPromotions>[0]);
        break;
      case 'lightspeed_get_promotion':
        result = await pricing.getPromotion(toolArgs.promotion_id as string);
        break;
      case 'lightspeed_list_gift_cards':
        result = await pricing.listGiftCards(toolArgs as Parameters<typeof pricing.listGiftCards>[0]);
        break;
      case 'lightspeed_get_gift_card':
        result = await pricing.getGiftCard(toolArgs.gift_card_id as string);
        break;
      case 'lightspeed_create_gift_card':
        result = await pricing.createGiftCard(toolArgs as unknown as Parameters<typeof pricing.createGiftCard>[0]);
        break;
      case 'lightspeed_update_gift_card':
        result = await pricing.updateGiftCard(
          toolArgs.gift_card_id as string,
          toolArgs as Parameters<typeof pricing.updateGiftCard>[1]
        );
        break;
      case 'lightspeed_list_store_credits':
        result = await pricing.listStoreCredits(toolArgs as Parameters<typeof pricing.listStoreCredits>[0]);
        break;
      case 'lightspeed_get_store_credit':
        result = await pricing.getStoreCredit(toolArgs.store_credit_id as string);
        break;

      // Additional Customer Group tools
      case 'lightspeed_create_customer_group':
        result = await customers.createCustomerGroup(toolArgs as unknown as Parameters<typeof customers.createCustomerGroup>[0]);
        break;
      case 'lightspeed_update_customer_group':
        result = await customers.updateCustomerGroup(
          toolArgs.group_id as string,
          toolArgs as Parameters<typeof customers.updateCustomerGroup>[1]
        );
        break;
      case 'lightspeed_delete_customer_group':
        await customers.deleteCustomerGroup(toolArgs.group_id as string);
        result = { success: true, message: 'Customer group deleted successfully' };
        break;
      case 'lightspeed_add_customers_to_group':
        result = await customers.addCustomersToGroup(
          toolArgs.group_id as string,
          toolArgs.customer_ids as string[]
        );
        break;
      case 'lightspeed_remove_customers_from_group':
        result = await customers.removeCustomersFromGroup(
          toolArgs.group_id as string,
          toolArgs.customer_ids as string[]
        );
        break;
      case 'lightspeed_get_group_customers':
        result = await customers.getGroupCustomers(
          toolArgs.group_id as string,
          toolArgs as Parameters<typeof customers.getGroupCustomers>[1]
        );
        break;
      case 'lightspeed_bulk_update_customer_taxes':
        result = await customers.bulkUpdateCustomerTaxes(toolArgs as unknown as Parameters<typeof customers.bulkUpdateCustomerTaxes>[0]);
        break;

      // Additional Product tools
      case 'lightspeed_delete_product_family':
        await products.deleteProductFamily(toolArgs.family_id as string);
        result = { success: true, message: 'Product family deleted successfully' };
        break;
      case 'lightspeed_get_product_inventory':
        result = await products.getProductInventory(toolArgs.product_id as string);
        break;
      case 'lightspeed_get_product_price_books':
        result = await products.getProductPriceBooks(
          toolArgs.product_id as string,
          toolArgs as Parameters<typeof products.getProductPriceBooks>[1]
        );
        break;
      case 'lightspeed_get_product_image_data':
        result = await products.getProductImageData(
          toolArgs.product_id as string,
          toolArgs.image_id as string
        );
        break;
      case 'lightspeed_set_product_image_position':
        result = await products.setProductImagePosition(
          toolArgs.product_id as string,
          toolArgs.image_id as string,
          toolArgs.position as number
        );
        break;
      case 'lightspeed_delete_product_categories':
        await products.deleteProductCategories(toolArgs.category_ids as string[]);
        result = { success: true, message: 'Product categories deleted successfully' };
        break;
      case 'lightspeed_list_products_v3':
        result = await products.listProducts3(toolArgs as Parameters<typeof products.listProducts3>[0]);
        break;
      case 'lightspeed_get_product_v3':
        result = await products.getProduct3(toolArgs.product_id as string);
        break;

      // Additional Sales tools
      case 'lightspeed_return_sale':
        result = await sales.returnSale(
          toolArgs.sale_id as string,
          toolArgs as Parameters<typeof sales.returnSale>[1]
        );
        break;
      case 'lightspeed_get_payment':
        result = await sales.getPayment(toolArgs.payment_id as string);
        break;
      case 'lightspeed_get_fulfillment_summary':
        result = await sales.getFulfillmentSummary();
        break;
      case 'lightspeed_fulfill_sale_line_items':
        result = await sales.fulfillSaleLineItems(
          toolArgs.sale_id as string,
          toolArgs as unknown as Parameters<typeof sales.fulfillSaleLineItems>[1]
        );
        break;
      case 'lightspeed_pack_sale_line_items':
        result = await sales.packSaleLineItems(
          toolArgs.sale_id as string,
          toolArgs as unknown as Parameters<typeof sales.packSaleLineItems>[1]
        );
        break;
      case 'lightspeed_pick_sale_line_items':
        result = await sales.pickSaleLineItems(
          toolArgs.sale_id as string,
          toolArgs as unknown as Parameters<typeof sales.pickSaleLineItems>[1]
        );
        break;
      case 'lightspeed_fulfill_sale':
        result = await sales.fulfillSale(
          toolArgs.sale_id as string,
          toolArgs as unknown as Parameters<typeof sales.fulfillSale>[1]
        );
        break;
      case 'lightspeed_list_sale_fulfillments':
        result = await sales.listSaleFulfillments(
          toolArgs.sale_id as string,
          toolArgs as Parameters<typeof sales.listSaleFulfillments>[1]
        );
        break;
      case 'lightspeed_list_sale_pick_lists':
        result = await sales.listSalePickLists(
          toolArgs.sale_id as string,
          toolArgs as Parameters<typeof sales.listSalePickLists>[1]
        );
        break;

      // Additional Inventory tools
      case 'lightspeed_get_consignment_totals':
        result = await inventory.getConsignmentTotals(toolArgs.consignment_id as string);
        break;
      case 'lightspeed_bulk_update_consignment_products':
        result = await inventory.bulkUpdateConsignmentProducts(
          toolArgs.consignment_id as string,
          toolArgs as unknown as Parameters<typeof inventory.bulkUpdateConsignmentProducts>[1]
        );
        break;

      // Additional Outlet tools
      case 'lightspeed_get_current_user':
        result = await outlets.getCurrentUser();
        break;
      case 'lightspeed_bulk_get_users':
        result = await outlets.bulkGetUsers(toolArgs.user_ids as string[]);
        break;
      case 'lightspeed_get_user_sales_totals':
        result = await outlets.getUserSalesTotals(toolArgs.user_id as string);
        break;
      case 'lightspeed_delete_user':
        await outlets.deleteUser(toolArgs.user_id as string);
        result = { success: true, message: 'User deleted successfully' };
        break;
      case 'lightspeed_delete_user_sessions':
        await outlets.deleteUserSessions(toolArgs.user_id as string);
        result = { success: true, message: 'User sessions deleted successfully' };
        break;
      case 'lightspeed_update_user':
        result = await outlets.updateUser(
          toolArgs.user_id as string,
          toolArgs as Parameters<typeof outlets.updateUser>[1]
        );
        break;
      case 'lightspeed_create_user':
        result = await outlets.createUser(toolArgs as Parameters<typeof outlets.createUser>[0]);
        break;
      case 'lightspeed_open_register':
        result = await outlets.openRegister(
          toolArgs.register_id as string,
          toolArgs as Parameters<typeof outlets.openRegister>[1]
        );
        break;
      case 'lightspeed_close_register':
        result = await outlets.closeRegister(
          toolArgs.register_id as string,
          toolArgs as Parameters<typeof outlets.closeRegister>[1]
        );
        break;
      case 'lightspeed_get_register_payments_summary':
        result = await outlets.getRegisterPaymentsSummary(toolArgs.register_id as string);
        break;
      case 'lightspeed_list_button_layouts':
        result = await outlets.listButtonLayouts(toolArgs as Parameters<typeof outlets.listButtonLayouts>[0]);
        break;
      case 'lightspeed_get_button_layout':
        result = await outlets.getButtonLayout(toolArgs.layout_id as string);
        break;
      case 'lightspeed_list_outlet_product_taxes':
        result = await outlets.listOutletProductTaxes(toolArgs as Parameters<typeof outlets.listOutletProductTaxes>[0]);
        break;
      case 'lightspeed_get_config':
        result = await outlets.getConfig();
        break;
      case 'lightspeed_list_inventory_counts':
        result = await outlets.listInventoryCounts(
          toolArgs.outlet_id as string,
          toolArgs as Parameters<typeof outlets.listInventoryCounts>[1]
        );
        break;
      case 'lightspeed_get_inventory_count':
        result = await outlets.getInventoryCount(
          toolArgs.outlet_id as string,
          toolArgs.count_id as string
        );
        break;
      case 'lightspeed_create_inventory_count':
        result = await outlets.createInventoryCount(
          toolArgs.outlet_id as string,
          toolArgs as Parameters<typeof outlets.createInventoryCount>[1]
        );
        break;
      case 'lightspeed_update_inventory_count':
        result = await outlets.updateInventoryCount(
          toolArgs.outlet_id as string,
          toolArgs.count_id as string,
          toolArgs as Parameters<typeof outlets.updateInventoryCount>[2]
        );
        break;
      case 'lightspeed_delete_inventory_count':
        await outlets.deleteInventoryCount(
          toolArgs.outlet_id as string,
          toolArgs.count_id as string
        );
        result = { success: true, message: 'Inventory count deleted successfully' };
        break;
      case 'lightspeed_list_inventory_count_items':
        result = await outlets.listInventoryCountItems(
          toolArgs.outlet_id as string,
          toolArgs.count_id as string,
          toolArgs as Parameters<typeof outlets.listInventoryCountItems>[2]
        );
        break;
      case 'lightspeed_update_inventory_count_item':
        result = await outlets.updateInventoryCountItem(
          toolArgs.outlet_id as string,
          toolArgs.count_id as string,
          toolArgs.item_id as string,
          toolArgs as Parameters<typeof outlets.updateInventoryCountItem>[3]
        );
        break;

      // Additional Pricing tools
      case 'lightspeed_create_promotion':
        result = await pricing.createPromotion(toolArgs as unknown as Parameters<typeof pricing.createPromotion>[0]);
        break;
      case 'lightspeed_update_promotion':
        result = await pricing.updatePromotion(
          toolArgs.promotion_id as string,
          toolArgs as Parameters<typeof pricing.updatePromotion>[1]
        );
        break;
      case 'lightspeed_delete_promotion':
        await pricing.deletePromotion(toolArgs.promotion_id as string);
        result = { success: true, message: 'Promotion deleted successfully' };
        break;
      case 'lightspeed_search_promotions':
        result = await pricing.searchPromotions(toolArgs as Parameters<typeof pricing.searchPromotions>[0]);
        break;
      case 'lightspeed_get_promotion_products':
        result = await pricing.getPromotionProducts(
          toolArgs.promotion_id as string,
          toolArgs as Parameters<typeof pricing.getPromotionProducts>[1]
        );
        break;
      case 'lightspeed_get_promotion_promo_codes':
        result = await pricing.getPromotionPromoCodes(
          toolArgs.promotion_id as string,
          toolArgs as Parameters<typeof pricing.getPromotionPromoCodes>[1]
        );
        break;
      case 'lightspeed_apply_discount':
        result = await pricing.applyDiscount(
          toolArgs.sale_id as string,
          toolArgs as Parameters<typeof pricing.applyDiscount>[1]
        );
        break;
      case 'lightspeed_delete_promo_codes':
        await pricing.deletePromoCodes(toolArgs.promo_codes as string[]);
        result = { success: true, message: 'Promo codes deleted successfully' };
        break;
      case 'lightspeed_get_active_promo_codes':
        result = await pricing.getActivePromoCodes(toolArgs as unknown as Parameters<typeof pricing.getActivePromoCodes>[0]);
        break;
      case 'lightspeed_void_gift_card':
        await pricing.voidGiftCard(toolArgs.gift_card_id as string);
        result = { success: true, message: 'Gift card voided successfully' };
        break;
      case 'lightspeed_create_gift_card_transaction':
        result = await pricing.createGiftCardTransaction(
          toolArgs.gift_card_id as string,
          toolArgs as unknown as Parameters<typeof pricing.createGiftCardTransaction>[1]
        );
        break;
      case 'lightspeed_get_gift_card_by_transaction':
        result = await pricing.getGiftCardByTransaction(toolArgs.transaction_id as string);
        break;
      case 'lightspeed_reverse_gift_card_transaction':
        await pricing.reverseGiftCardTransaction(toolArgs.transaction_id as string);
        result = { success: true, message: 'Gift card transaction reversed successfully' };
        break;
      case 'lightspeed_get_customer_store_credit':
        result = await pricing.getCustomerStoreCredit(toolArgs.customer_id as string);
        break;
      case 'lightspeed_bulk_get_store_credits':
        result = await pricing.bulkGetStoreCredits(toolArgs as unknown as Parameters<typeof pricing.bulkGetStoreCredits>[0]);
        break;
      case 'lightspeed_create_store_credit_transaction':
        result = await pricing.createStoreCreditTransaction(toolArgs as unknown as Parameters<typeof pricing.createStoreCreditTransaction>[0]);
        break;
      case 'lightspeed_get_store_credit_report':
        result = await pricing.getStoreCreditReport(toolArgs as Parameters<typeof pricing.getStoreCreditReport>[0]);
        break;
      case 'lightspeed_get_gift_card_v3':
        result = await pricing.getGiftCard3(toolArgs.gift_card_id as string);
        break;
      case 'lightspeed_find_gift_card_by_number':
        result = await pricing.findGiftCardByNumber(toolArgs.number as string);
        break;
      case 'lightspeed_list_price_books_v3':
        result = await pricing.listPriceBooks3(toolArgs as Parameters<typeof pricing.listPriceBooks3>[0]);
        break;
      case 'lightspeed_get_price_book_v3':
        result = await pricing.getPriceBook3(toolArgs.price_book_id as string);
        break;
      case 'lightspeed_create_price_book_v3':
        result = await pricing.createPriceBook3(toolArgs as unknown as Parameters<typeof pricing.createPriceBook3>[0]);
        break;
      case 'lightspeed_update_price_book_v3':
        result = await pricing.updatePriceBook3(
          toolArgs.price_book_id as string,
          toolArgs as Parameters<typeof pricing.updatePriceBook3>[1]
        );
        break;

      // Variant tools
      case 'lightspeed_list_variant_attributes':
        result = await variants.listVariantAttributes(toolArgs as Parameters<typeof variants.listVariantAttributes>[0]);
        break;
      case 'lightspeed_get_variant_attribute':
        result = await variants.getVariantAttribute(toolArgs.attribute_id as string);
        break;
      case 'lightspeed_create_variant_attribute':
        result = await variants.createVariantAttribute(toolArgs as unknown as Parameters<typeof variants.createVariantAttribute>[0]);
        break;
      case 'lightspeed_update_variant_attribute':
        result = await variants.updateVariantAttribute(
          toolArgs.attribute_id as string,
          toolArgs as Parameters<typeof variants.updateVariantAttribute>[1]
        );
        break;
      case 'lightspeed_delete_variant_attribute':
        await variants.deleteVariantAttribute(toolArgs.attribute_id as string);
        result = { success: true, message: 'Variant attribute deleted successfully' };
        break;
      case 'lightspeed_add_product_variant':
        result = await variants.addProductVariant(
          toolArgs.product_id as string,
          toolArgs as unknown as Parameters<typeof variants.addProductVariant>[1]
        );
        break;

      // Service tools
      case 'lightspeed_list_services':
        result = await services.listServices(toolArgs as Parameters<typeof services.listServices>[0]);
        break;
      case 'lightspeed_get_service':
        result = await services.getService(toolArgs.service_id as string);
        break;
      case 'lightspeed_create_service':
        result = await services.createService(toolArgs as unknown as Parameters<typeof services.createService>[0]);
        break;
      case 'lightspeed_list_customer_services':
        result = await services.listCustomerServices(
          toolArgs.customer_id as string,
          toolArgs as Parameters<typeof services.listCustomerServices>[1]
        );
        break;
      case 'lightspeed_get_services_agenda':
        result = await services.getServicesAgenda(
          toolArgs.outlet_id as string,
          toolArgs as Parameters<typeof services.getServicesAgenda>[1]
        );
        break;

      // Serial Number tools
      case 'lightspeed_list_serial_numbers':
        result = await serialNumbers.listSerialNumbers(toolArgs as Parameters<typeof serialNumbers.listSerialNumbers>[0]);
        break;
      case 'lightspeed_get_serial_number':
        result = await serialNumbers.getSerialNumber(toolArgs.serial_number_id as string);
        break;
      case 'lightspeed_create_serial_number':
        result = await serialNumbers.createSerialNumber(toolArgs as unknown as Parameters<typeof serialNumbers.createSerialNumber>[0]);
        break;
      case 'lightspeed_delete_serial_number':
        await serialNumbers.deleteSerialNumber(toolArgs.serial_number_id as string);
        result = { success: true, message: 'Serial number deleted successfully' };
        break;

      // Quote tools
      case 'lightspeed_list_quotes':
        result = await quotes.listQuotes(toolArgs as Parameters<typeof quotes.listQuotes>[0]);
        break;
      case 'lightspeed_get_quote':
        result = await quotes.getQuote(toolArgs.quote_id as string);
        break;
      case 'lightspeed_create_quote':
        result = await quotes.createQuote(toolArgs as Parameters<typeof quotes.createQuote>[0]);
        break;
      case 'lightspeed_update_quote':
        result = await quotes.updateQuote(
          toolArgs.quote_id as string,
          toolArgs as Parameters<typeof quotes.updateQuote>[1]
        );
        break;
      case 'lightspeed_delete_quote':
        await quotes.deleteQuote(toolArgs.quote_id as string);
        result = { success: true, message: 'Quote deleted successfully' };
        break;
      case 'lightspeed_convert_quote_to_sale':
        result = await quotes.convertQuoteToSale(toolArgs.quote_id as string);
        break;

      // Search tools
      case 'lightspeed_search':
        result = await search.search(toolArgs as Parameters<typeof search.search>[0]);
        break;

      // Channel tools
      case 'lightspeed_list_channels':
        result = await channels.listChannels(toolArgs as Parameters<typeof channels.listChannels>[0]);
        break;
      case 'lightspeed_list_request_logs':
        result = await channels.listRequestLogs(toolArgs as Parameters<typeof channels.listRequestLogs>[0]);
        break;
      case 'lightspeed_get_request_log':
        result = await channels.getRequestLog(toolArgs.request_log_id as string);
        break;
      case 'lightspeed_get_request_log_text':
        result = await channels.getRequestLogText(toolArgs.request_log_id as string);
        break;

      // Security tools
      case 'lightspeed_list_security_events':
        result = await security.listSecurityEvents(toolArgs as Parameters<typeof security.listSecurityEvents>[0]);
        break;
      case 'lightspeed_list_audit_logs':
        result = await security.listAuditLogs(toolArgs as Parameters<typeof security.listAuditLogs>[0]);
        break;

      // Custom Field tools
      case 'lightspeed_list_custom_fields':
        result = await customFields.listCustomFields(toolArgs as Parameters<typeof customFields.listCustomFields>[0]);
        break;
      case 'lightspeed_create_custom_field':
        result = await customFields.createCustomField(toolArgs as unknown as Parameters<typeof customFields.createCustomField>[0]);
        break;
      case 'lightspeed_update_custom_field':
        result = await customFields.updateCustomField(
          toolArgs.field_id as string,
          toolArgs as Parameters<typeof customFields.updateCustomField>[1]
        );
        break;
      case 'lightspeed_delete_custom_field':
        await customFields.deleteCustomField(toolArgs.field_id as string);
        result = { success: true, message: 'Custom field deleted successfully' };
        break;
      case 'lightspeed_list_custom_field_values':
        result = await customFields.listCustomFieldValues(toolArgs as Parameters<typeof customFields.listCustomFieldValues>[0]);
        break;
      case 'lightspeed_set_custom_field_values':
        result = await customFields.setCustomFieldValues(toolArgs as unknown as Parameters<typeof customFields.setCustomFieldValues>[0]);
        break;

      // Rule tools
      case 'lightspeed_list_rules':
        result = await rules.listRules(toolArgs as Parameters<typeof rules.listRules>[0]);
        break;
      case 'lightspeed_create_rule':
        result = await rules.createRule(toolArgs as unknown as Parameters<typeof rules.createRule>[0]);
        break;
      case 'lightspeed_delete_rule':
        await rules.deleteRule(toolArgs.rule_id as string);
        result = { success: true, message: 'Rule deleted successfully' };
        break;
      case 'lightspeed_list_remote_rules':
        result = await rules.listRemoteRules(toolArgs as Parameters<typeof rules.listRemoteRules>[0]);
        break;
      case 'lightspeed_create_remote_rule':
        result = await rules.createRemoteRule(toolArgs as unknown as Parameters<typeof rules.createRemoteRule>[0]);
        break;
      case 'lightspeed_delete_remote_rule':
        await rules.deleteRemoteRule(toolArgs.rule_id as string);
        result = { success: true, message: 'Remote rule deleted successfully' };
        break;

      // Partner tools
      case 'lightspeed_list_partner_subscriptions':
        result = await partner.listPartnerSubscriptions(toolArgs as Parameters<typeof partner.listPartnerSubscriptions>[0]);
        break;
      case 'lightspeed_get_partner_subscription':
        result = await partner.getPartnerSubscription(toolArgs.subscription_id as string);
        break;
      case 'lightspeed_create_subscription_token':
        result = await partner.createSubscriptionToken(toolArgs as unknown as Parameters<typeof partner.createSubscriptionToken>[0]);
        break;
      case 'lightspeed_get_subscription_by_token':
        result = await partner.getSubscriptionByToken(toolArgs.token as string);
        break;
      case 'lightspeed_create_update_subscription_token':
        result = await partner.createUpdateSubscriptionToken(toolArgs as unknown as Parameters<typeof partner.createUpdateSubscriptionToken>[0]);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  // Initialize store registry from environment variables
  initializeStoresFromEnv();

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Lightspeed MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
