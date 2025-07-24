# Metaobject TypeScript Types

TypeScript interfaces untuk response JSON dari Shopify Metaobject API, khususnya untuk home page configuration.

## 📁 File Structure

```
app/types/
├── metaobject.ts       # Core TypeScript interfaces
└── README.md          # Documentation (this file)

app/examples/
└── metaobject-usage.ts # Usage examples
```

## 🔧 Core Interfaces

### `MetaobjectResponse`

Interface utama untuk response API:

```typescript
interface MetaobjectResponse {
  data: {
    metaobject: Metaobject;
  };
  extensions: {
    cost: {
      requestedQueryCost: number;
    };
  };
}
```

### `Metaobject`

Interface untuk metaobject data:

```typescript
interface Metaobject {
  id: string;
  handle: string;
  fields: MetaobjectField[];
}
```

### `MetaobjectField`

Interface untuk individual fields:

```typescript
interface MetaobjectField {
  key: string;
  value: string;
  reference: MetaobjectReference | null;
  references?: MetaobjectReferences | null;
}
```

## 🎯 Usage Examples

### 1. Basic Usage

```typescript
import type {MetaobjectResponse} from '~/types/metaobject';
import {getStringField, getBrandSectionBanner} from '~/types/metaobject';

function processHomeData(response: MetaobjectResponse) {
  const {metaobject} = response.data;

  // Get simple text fields
  const pageTitle = getStringField(metaobject.fields, 'title');
  const brandTitle = getStringField(metaobject.fields, 'brand_section_title');

  // Get complex reference fields
  const brandBanner = getBrandSectionBanner(metaobject.fields);

  return {
    pageTitle,
    brandTitle,
    brandBanner,
  };
}
```

### 2. Working with Collections

```typescript
import {getBannerCollections, getBannerCollectionIds} from '~/types/metaobject';

function getBannerData(metaobject: Metaobject) {
  // Get full collection data with references
  const collections = getBannerCollections(metaobject.fields);

  // Or get just the collection IDs
  const collectionIds = getBannerCollectionIds(metaobject.fields);

  return collections.map((collection) => ({
    id: collection.id,
    title: collection.title,
    handle: collection.handle,
    imageUrl: collection.image.url,
    productCount: collection.products.nodes.length,
    firstProduct: collection.products.nodes[0] || null,
  }));
}
```

### 3. Type-Safe Field Access

```typescript
import {MetaobjectFieldKey, getFieldByKey} from '~/types/metaobject';

function getFieldValue(
  fields: MetaobjectField[],
  key: MetaobjectFieldKey,
): string | null {
  const field = getFieldByKey(fields, key);
  return field?.value || null;
}

// Auto-completion dan type safety
const title = getFieldValue(metaobject.fields, 'brand_section_title'); // ✅ Valid
const invalid = getFieldValue(metaobject.fields, 'invalid_key'); // ❌ TypeScript error
```

## 🛠 Helper Functions

### Field Getters

- `getStringField(fields, key)` - Get simple string field value
- `getBannerCollections(fields)` - Get banner collections as Collection[] with full data
- `getBannerCollectionIds(fields)` - Parse banner collections JSON array (IDs only)
- `getCollectionsDisplay(fields)` - Parse collections display JSON array
- `getBrandSectionBanner(fields)` - Get brand section banner reference

### Type Guards

- `isCollection(node)` - Check if node is Collection
- `isMetaobject(node)` - Check if node is Metaobject

### Utilities

- `getFieldByKey(fields, key)` - Find field by key with type safety
- `parseJsonField<T>(field)` - Safely parse JSON field values

## 🎨 React Component Integration

### Component Props

```typescript
import type { BrandSectionProps, CollectionBannerProps } from '~/examples/metaobject-usage';

// Use in your React components
function BrandSection({ title, description, buttonText, buttonUrl, desktopImage }: BrandSectionProps) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      {desktopImage && <img src={desktopImage.url} alt={desktopImage.altText || ''} />}
      <a href={buttonUrl}>{buttonText}</a>
    </section>
  );
}
```

### Data Transformation

```typescript
import { transformForBrandSection } from '~/examples/metaobject-usage';

function HomePage({ metaobjectData }: { metaobjectData: MetaobjectResponse }) {
  const brandSectionProps = transformForBrandSection(metaobjectData.data.metaobject);

  if (!brandSectionProps) {
    return <div>Brand section not configured</div>;
  }

  return <BrandSection {...brandSectionProps} />;
}
```

## 🔍 Available Field Keys

TypeScript akan memberikan auto-completion untuk field keys:

```typescript
type MetaobjectFieldKey =
  | 'banner_collections'
  | 'brand_section_banner'
  | 'brand_section_button_cta'
  | 'brand_section_button_text'
  | 'brand_section_description'
  | 'brand_section_title'
  | 'collections_display'
  | 'title';
```

## 🚀 Benefits

1. **Type Safety** - Catch errors at compile time
2. **Auto-completion** - IDE support untuk field names dan properties
3. **Documentation** - Types serve as documentation
4. **Refactoring** - Safe refactoring with TypeScript
5. **Validation** - Runtime type checking dengan type guards
6. **Maintainability** - Easier to maintain dan scale

## 💡 Tips

1. **Always use helper functions** untuk field access
2. **Leverage type guards** untuk runtime checks
3. **Use transformers** untuk convert data ke component props
4. **Check for null/undefined** values secara konsisten
5. **Extend interfaces** jika ada additional fields

## 🔧 Extension

Untuk menambah field types baru:

1. Update `MetaobjectFieldKey` type
2. Add getter function di `metaobject.ts`
3. Add example usage di `metaobject-usage.ts`
4. Update documentation

Contoh:

```typescript
// 1. Update type
type MetaobjectFieldKey = '...' | 'new_field_key';

// 2. Add getter
export function getNewField(fields: MetaobjectField[]): string | null {
  return getStringField(fields, 'new_field_key');
}
```
