// Shopify Metaobject Types
export interface MetaobjectResponse {
  metaobject: Metaobject;
}

export interface Metaobject {
  id: string;
  handle: string;
  fields: MetaobjectField[];
}

export interface MetaobjectField {
  key: string;
  value: string;
  reference: MetaobjectReference | null;
  references?: MetaobjectReferences | null;
}

export interface MetaobjectReference {
  id?: string;
  fields?: MetaobjectField[];
  image?: {
    altText: string | null;
    id: string;
    url: string;
  };
}

export interface MetaobjectReferences {
  nodes: (Collection | Metaobject)[];
}

// Collection Types
export interface Collection {
  id: string;
  title: string;
  handle: string;
  products: {
    nodes: Product[];
  };
  image: CollectionImage;
}

export interface CollectionImage {
  id: string;
  url: string;
  altText: string | null;
}

// Product Types
export interface Product {
  title: string;
  vendor: string;
  priceRange: {
    maxVariantPrice: {
      currencyCode: string;
      amount: string;
    };
  };
  images: {
    nodes: ProductImage[];
  };
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

// Specific field types based on the response
export interface BrandSectionBanner {
  id: string;
  fields: Array<{
    key: 'desktop' | 'mobile' | 'title';
    value: string;
    reference: {
      image: {
        altText: string | null;
        id: string;
        url: string;
      };
    } | null;
  }>;
}

export interface CollectionDisplay {
  id: string;
  fields: Array<{
    key: 'collection' | 'title';
    type: string;
    value: string;
    reference: Record<string, any> | null;
  }>;
}

// Helper types for parsing JSON string values
export type BannerCollectionsValue = string[]; // Array of collection IDs
export type CollectionsDisplayValue = string[]; // Array of metaobject IDs

// Utility type for type-safe field access
export type MetaobjectFieldKey =
  | 'banner_collections'
  | 'brand_section_banner'
  | 'brand_section_button_cta'
  | 'brand_section_button_text'
  | 'brand_section_description'
  | 'brand_section_title'
  | 'collections_display'
  | 'title';

// Type guards
export function isCollection(
  node: Collection | Metaobject,
): node is Collection {
  return 'handle' in node && 'products' in node;
}

export function isMetaobject(
  node: Collection | Metaobject,
): node is Metaobject {
  return 'fields' in node && !('products' in node);
}

// Helper functions for working with the data
export function getFieldByKey(
  fields: MetaobjectField[],
  key: MetaobjectFieldKey,
): MetaobjectField | undefined {
  return fields.find((field) => field.key === key);
}

export function parseJsonField<T>(
  field: MetaobjectField | undefined,
): T | null {
  if (!field?.value) return null;
  try {
    return JSON.parse(field.value) as T;
  } catch {
    return null;
  }
}

// Typed field getters
export function getBannerCollections(fields: MetaobjectField[]): Collection[] {
  const field = getFieldByKey(fields, 'banner_collections');
  if (!field?.references?.nodes) {
    return [];
  }
  return field.references.nodes.filter(isCollection);
}

export function getBannerCollectionIds(fields: MetaobjectField[]): string[] {
  const field = getFieldByKey(fields, 'banner_collections');
  return parseJsonField<string[]>(field) || [];
}

export function getCollectionsDisplay(fields: MetaobjectField[]): string[] {
  const field = getFieldByKey(fields, 'collections_display');
  return parseJsonField<string[]>(field) || [];
}

export function getBrandSectionBanner(
  fields: MetaobjectField[],
): BrandSectionBanner | null {
  const field = getFieldByKey(fields, 'brand_section_banner');
  return field?.reference as BrandSectionBanner | null;
}

export function getStringField(
  fields: MetaobjectField[],
  key: MetaobjectFieldKey,
): string | null {
  const field = getFieldByKey(fields, key);
  return field?.value || null;
}
