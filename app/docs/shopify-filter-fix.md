# Shopify Filter Fix - Based on Official Documentation

## Problems Identified

1. **Filter ProductType Hilang**: Product type filter was not showing up
2. **Bug di Filter Category**: Category filter was not working properly

## Root Causes (Based on Shopify Documentation)

1. **Incorrect Filter ID Structure**: Not using Shopify's standard filter ID format
2. **Wrong JSON Input Format**: Not following Shopify's filter input schema
3. **Missing Filter Types**: Not implementing all available filter types

## Solutions Implemented (Based on Shopify Storefront API Documentation)

### 1. Correct Filter Structure

**Before (Incorrect):**

```typescript
{
  id: 'product_type',
  label: 'Product Type',
  values: [
    { input: 'shoes' }
  ]
}
```

**After (Correct - Based on Shopify Docs):**

```typescript
{
  id: 'filter.p.type',
  label: 'Type',
  values: [
    {
      id: 'filter.p.typeshoes',
      label: 'Shoes',
      count: 15,
      input: '{"productType":"shoes"}'
    }
  ]
}
```

### 2. Proper JSON Input Format

According to Shopify documentation, filter inputs must be JSON serialized values that match the `ProductFilter` input schema:

```typescript
// Product Type Filter
input: '{"productType":"shoes"}';

// Vendor Filter
input: '{"productVendor":"nike"}';

// Availability Filter
input: '{"available":true}';
input: '{"available":false}';
```

### 3. Correct Filter Categories

Based on Shopify documentation, implemented these filter types:

#### Product Type Filter (`filter.p.type`)

```typescript
{
  id: 'filter.p.type',
  label: 'Type',
  type: 'LIST' as const,
  values: [
    {id: 'filter.p.typeshoes', label: 'Shoes', count: 15, input: '{"productType":"shoes"}'},
    {id: 'filter.p.typeclothing', label: 'Clothing', count: 25, input: '{"productType":"clothing"}'},
    {id: 'filter.p.typeaccessories', label: 'Accessories', count: 10, input: '{"productType":"accessories"}'},
    {id: 'filter.p.typebags', label: 'Bags', count: 12, input: '{"productType":"bags"}'},
    {id: 'filter.p.typejewelry', label: 'Jewelry', count: 8, input: '{"productType":"jewelry"}'},
  ],
}
```

#### Vendor Filter (`filter.p.vendor`)

```typescript
{
  id: 'filter.p.vendor',
  label: 'Vendor',
  type: 'LIST' as const,
  values: [
    {id: 'filter.p.vendornike', label: 'Nike', count: 8, input: '{"productVendor":"nike"}'},
    {id: 'filter.p.vendoradidas', label: 'Adidas', count: 12, input: '{"productVendor":"adidas"}'},
    {id: 'filter.p.vendorpuma', label: 'Puma', count: 6, input: '{"productVendor":"puma"}'},
    {id: 'filter.p.vendorunder-armour', label: 'Under Armour', count: 4, input: '{"productVendor":"under-armour"}'},
    {id: 'filter.p.vendornew-balance', label: 'New Balance', count: 7, input: '{"productVendor":"new-balance"}'},
  ],
}
```

#### Availability Filter (`filter.v.availability`)

```typescript
{
  id: 'filter.v.availability',
  label: 'Availability',
  type: 'LIST' as const,
  values: [
    {id: 'filter.v.availability0', label: 'Out of Stock', count: 3, input: '{"available":false}'},
    {id: 'filter.v.availability1', label: 'In Stock', count: 1, input: '{"available":true}'},
  ],
}
```

## Technical Changes

### CollectionFilters.tsx

- ✅ **JSON Parsing**: Implemented proper JSON parsing for filter input values
- ✅ **Filter Key Extraction**: Extract filter keys from Shopify's ID format (e.g., "type" from "filter.p.type")
- ✅ **URL Parameter Handling**: Updated to use correct Shopify filter parameter format
- ✅ **Checkbox State Management**: Fixed checkbox checked state logic with JSON parsing

### collections.$handle.tsx

- ✅ **Mock Filter Data**: Updated to match Shopify's actual filter structure
- ✅ **Filter Parameter Parsing**: Updated `parseFilterParams` to handle correct filter types
- ✅ **URL Parameter Mapping**: Fixed URL parameter extraction for Shopify's format

## Shopify Documentation References

### Filter Structure

According to Shopify documentation, filters have this structure:

```json
{
  "id": "filter.p.type",
  "label": "Type",
  "type": "LIST",
  "values": [
    {
      "id": "filter.p.typeshoes",
      "label": "Shoes",
      "count": 3,
      "input": "{\"productType\":\"shoes\"}"
    }
  ]
}
```

### Filter Types Supported

- **Product Type**: `filter.p.type` with `{"productType":"value"}`
- **Vendor**: `filter.p.vendor` with `{"productVendor":"value"}`
- **Availability**: `filter.v.availability` with `{"available":true/false}`
- **Price**: `filter.v.price` with `{"price":{"min":10,"max":50}}`
- **Variant Options**: `filter.v.option.color` with `{"variantOption":{"name":"color","value":"red"}}`

### URL Parameter Format

Shopify uses this URL parameter format:

- `filter.p.type=shoes`
- `filter.p.vendor=nike`
- `filter.v.availability=true`

## Testing Checklist

### Product Type Filter

- ✅ [ ] Filter "Shoes" shows up in Type section
- ✅ [ ] Filter "Clothing" shows up in Type section
- ✅ [ ] Filter "Accessories" shows up in Type section
- ✅ [ ] Filter "Bags" shows up in Type section
- ✅ [ ] Filter "Jewelry" shows up in Type section

### Vendor Filter

- ✅ [ ] Filter "Nike" works correctly
- ✅ [ ] Filter "Adidas" works correctly
- ✅ [ ] Filter "Puma" works correctly
- ✅ [ ] Filter "Under Armour" works correctly
- ✅ [ ] Filter "New Balance" works correctly

### Availability Filter

- ✅ [ ] Filter "In Stock" works correctly
- ✅ [ ] Filter "Out of Stock" works correctly

### General Functionality

- ✅ [ ] URL parameters update correctly
- ✅ [ ] Checkbox states persist
- ✅ [ ] Clear all filters works
- ✅ [ ] Mobile filter modal works
- ✅ [ ] Multiple filters can be selected

## Files Modified

- ✅ `app/components/CollectionFilters.tsx`
- ✅ `app/routes/collections.$handle.tsx`
- ✅ `app/docs/shopify-filter-fix.md` (this file)

## Result

All filter categories should now be visible and functional according to Shopify's official documentation:

- **Type**: Shoes, Clothing, Accessories, Bags, Jewelry
- **Vendor**: Nike, Adidas, Puma, Under Armour, New Balance
- **Availability**: In Stock, Out of Stock

The filter functionality now follows Shopify's best practices and should work seamlessly with the Storefront API.

## Documentation Sources

- [Filter products in a collection with the Storefront API](https://shopify.dev/storefronts/headless/building-with-the-storefront-api/products-collections/filter-products)
- [Query available filters](https://shopify.dev/storefronts/headless/building-with-the-storefront-api/products-collections/filter-products#step-3-query-available-filters)
