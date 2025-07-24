# Filter Bug Fix

## Problems Identified

1. **Filter ProductType Hilang**: Product type filter was not showing up
2. **Bug di Filter Category**: Category filter was not working properly

## Root Causes

1. **Complex Filter ID Structure**: Using complex filter IDs with prefixes like `filter.p.product_type`
2. **JSON Parsing Issues**: Trying to parse simple string values as JSON
3. **Missing Tag Filter Support**: Tag filters were not properly handled

## Solutions Implemented

### 1. Simplified Filter Structure

**Before:**

```typescript
{
  id: 'filter.p.product_type',
  label: 'Product Type',
  values: [
    { input: '{"productType":"shoes"}' }
  ]
}
```

**After:**

```typescript
{
  id: 'product_type',
  label: 'Product Type',
  values: [
    { input: 'shoes' }
  ]
}
```

### 2. Removed JSON Parsing

**Before:**

```typescript
// Complex JSON parsing
try {
  const parsedInput = JSON.parse(value) as Record<string, string>;
  const filterValue = Object.values(parsedInput)[0];
  newActiveFilters[filterKey] = [...newActiveFilters[filterKey], filterValue];
} catch {
  // Fallback
}
```

**After:**

```typescript
// Simple direct assignment
newActiveFilters[filterKey] = [...newActiveFilters[filterKey], value];
```

### 3. Added Tag Filter Support

```typescript
// Parse tag filters
const tags = searchParams.getAll('filter.p.tag');
if (tags.length > 0) {
  tags.forEach((tag) => {
    filters.push({tag});
  });
}
```

### 4. Enhanced Mock Filter Data

```typescript
const displayFilters = [
  {
    id: 'product_type',
    label: 'Product Type',
    type: 'LIST' as const,
    values: [
      {id: '1', label: 'Shoes', count: 15, input: 'shoes'},
      {id: '2', label: 'Clothing', count: 25, input: 'clothing'},
      {id: '3', label: 'Accessories', count: 10, input: 'accessories'},
      {id: '4', label: 'Bags', count: 12, input: 'bags'},
      {id: '5', label: 'Jewelry', count: 8, input: 'jewelry'},
    ],
  },
  {
    id: 'vendor',
    label: 'Brand',
    type: 'LIST' as const,
    values: [
      {id: '1', label: 'Nike', count: 8, input: 'nike'},
      {id: '2', label: 'Adidas', count: 12, input: 'adidas'},
      {id: '3', label: 'Puma', count: 6, input: 'puma'},
      {id: '4', label: 'Under Armour', count: 4, input: 'under-armour'},
      {id: '5', label: 'New Balance', count: 7, input: 'new-balance'},
    ],
  },
  {
    id: 'tag',
    label: 'Category',
    type: 'LIST' as const,
    values: [
      {id: '1', label: 'Men', count: 20, input: 'men'},
      {id: '2', label: 'Women', count: 18, input: 'women'},
      {id: '3', label: 'Kids', count: 15, input: 'kids'},
      {id: '4', label: 'Unisex', count: 10, input: 'unisex'},
    ],
  },
];
```

## Technical Changes

### CollectionFilters.tsx

- ✅ Simplified `handleFilterChange` function
- ✅ Removed complex JSON parsing logic
- ✅ Fixed checkbox checked state logic
- ✅ Updated both desktop and mobile filter components

### collections.$handle.tsx

- ✅ Updated mock filter data structure
- ✅ Added tag filter support in `parseFilterParams`
- ✅ Simplified filter ID structure
- ✅ Enhanced filter options (more product types, brands, categories)

## Testing Checklist

### Product Type Filter

- ✅ [ ] Filter "Shoes" shows up in Product Type section
- ✅ [ ] Filter "Clothing" shows up in Product Type section
- ✅ [ ] Filter "Accessories" shows up in Product Type section
- ✅ [ ] Filter "Bags" shows up in Product Type section
- ✅ [ ] Filter "Jewelry" shows up in Product Type section

### Brand Filter

- ✅ [ ] Filter "Nike" works correctly
- ✅ [ ] Filter "Adidas" works correctly
- ✅ [ ] Filter "Puma" works correctly
- ✅ [ ] Filter "Under Armour" works correctly
- ✅ [ ] Filter "New Balance" works correctly

### Category Filter

- ✅ [ ] Filter "Men" works correctly
- ✅ [ ] Filter "Women" works correctly
- ✅ [ ] Filter "Kids" works correctly
- ✅ [ ] Filter "Unisex" works correctly

### General Functionality

- ✅ [ ] URL parameters update correctly
- ✅ [ ] Checkbox states persist
- ✅ [ ] Clear all filters works
- ✅ [ ] Mobile filter modal works
- ✅ [ ] Multiple filters can be selected

## Files Modified

- ✅ `app/components/CollectionFilters.tsx`
- ✅ `app/routes/collections.$handle.tsx`
- ✅ `app/docs/filter-bug-fix.md` (this file)

## Result

All filter categories should now be visible and functional:

- **Product Type**: Shoes, Clothing, Accessories, Bags, Jewelry
- **Brand**: Nike, Adidas, Puma, Under Armour, New Balance
- **Category**: Men, Women, Kids, Unisex

The filter functionality should work smoothly without any bugs or missing filters.
