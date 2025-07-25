import type {
  MetaobjectResponse,
  Metaobject,
  Collection,
  BrandSectionBanner,
  MetaobjectField,
  Product,
} from '~/types/metaobject';
import {
  getBannerCollections,
  getBannerCollectionIds,
  getCollectionsDisplay,
  getBrandSectionBanner,
  getStringField,
  isCollection,
  isMetaobject,
  getFieldByKey,
} from '~/types/metaobject';

// Example: Processing the metaobject response
export function processHomePageData(response: MetaobjectResponse) {
  const {metaobject} = response;

  // Extract collections for banner (returns full Collection objects)
  const bannerCollections = getBannerCollections(metaobject.fields);

  // Get brand section data
  const brandBanner = getBrandSectionBanner(metaobject.fields);
  const brandTitle = getStringField(metaobject.fields, 'brand_section_title');
  const brandDescription = getStringField(
    metaobject.fields,
    'brand_section_description',
  );
  const brandButtonText = getStringField(
    metaobject.fields,
    'brand_section_button_text',
  );
  const brandButtonCta = getStringField(
    metaobject.fields,
    'brand_section_button_cta',
  );

  // Get collections display data
  const collectionsDisplayIds = getCollectionsDisplay(metaobject.fields);

  return {
    pageTitle: getStringField(metaobject.fields, 'title'),
    bannerCollections,
    brandSection: {
      title: brandTitle,
      description: brandDescription,
      buttonText: brandButtonText,
      buttonUrl: brandButtonCta,
      banner: brandBanner,
    },
    collectionsDisplay: collectionsDisplayIds,
  };
}

// Example: Extract banner collections with type safety (now simplified)
export function extractBannerCollections(metaobject: Metaobject): Collection[] {
  return getBannerCollections(metaobject.fields);
}

// Example: Get brand section images with flexible key matching
export function getBrandSectionImages(brandBanner: BrandSectionBanner | null) {
  if (!brandBanner) return null;

  // Helper function to find field by key (case-insensitive)
  const findFieldByKey = (targetKey: string) => {
    return brandBanner.fields.find(
      (field) => field.key.toLowerCase() === targetKey.toLowerCase(),
    );
  };

  // Try multiple possible key variations for desktop
  const desktopField =
    findFieldByKey('desktop') ||
    findFieldByKey('Desktop') ||
    findFieldByKey('DESKTOP') ||
    findFieldByKey('desk');

  // Try multiple possible key variations for mobile
  const mobileField =
    findFieldByKey('mobile') ||
    findFieldByKey('Mobile') ||
    findFieldByKey('MOBILE') ||
    findFieldByKey('mob');

  // Try multiple possible key variations for title
  const titleField =
    findFieldByKey('title') ||
    findFieldByKey('Title') ||
    findFieldByKey('TITLE');

  return {
    desktop: desktopField?.reference?.image || null,
    mobile: mobileField?.reference?.image || null,
    title: titleField?.value || null,
  };
}

// Example: Type-safe field processing
export function processMetaobjectFields(metaobject: Metaobject) {
  const processedData: Record<string, any> = {};

  metaobject.fields.forEach((field) => {
    switch (field.key) {
      case 'banner_collections':
      case 'collections_display':
        // Parse JSON arrays
        try {
          processedData[field.key] = JSON.parse(field.value);
        } catch {
          processedData[field.key] = [];
        }
        break;

      case 'brand_section_banner':
        // Complex object reference
        processedData[field.key] = field.reference;
        break;

      default:
        // Simple string values
        processedData[field.key] = field.value;
    }
  });

  return processedData;
}

// Example: React component prop types
export interface HomePageProps {
  metaobjectData: MetaobjectResponse;
}

export interface BrandSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  desktopImage?: {
    url: string;
    altText: string | null;
  };
  mobileImage?: {
    url: string;
    altText: string | null;
  };
}

export interface CollectionBannerProps {
  collections: Collection[];
}

// Example: Data transformation for components
export function transformForBrandSection(
  metaobject: Metaobject,
): BrandSectionProps | null {
  const brandBanner = getBrandSectionBanner(metaobject.fields);
  const title = getStringField(metaobject.fields, 'brand_section_title');
  const description = getStringField(
    metaobject.fields,
    'brand_section_description',
  );
  const buttonText = getStringField(
    metaobject.fields,
    'brand_section_button_text',
  );
  const buttonUrl = getStringField(
    metaobject.fields,
    'brand_section_button_cta',
  );

  if (!title || !description || !buttonText || !buttonUrl) {
    return null;
  }

  const images = getBrandSectionImages(brandBanner);

  return {
    title,
    description,
    buttonText,
    buttonUrl,
    desktopImage: images?.desktop || undefined,
    mobileImage: images?.mobile || undefined,
  };
}

// Example: GraphQL query type (for reference)
export const HOME_METAOBJECT_QUERY = `
  query HomeMetaobject($handle: String!) {
    metaobject(handle: { handle: $handle, type: "home_page" }) {
      id
      handle
      fields {
        key
        value
        reference {
          ... on Metaobject {
            id
            fields {
              key
              value
              reference {
                ... on MediaImage {
                  image {
                    altText
                    id
                    url
                  }
                }
              }
            }
          }
        }
        references(first: 10) {
          nodes {
            ... on Collection {
              id
              title
              handle
              products(first: 1) {
                nodes {
                  title
                  vendor
                  priceRange {
                    maxVariantPrice {
                      currencyCode
                      amount
                    }
                  }
                  images(first: 6) {
                    nodes {
                      id
                      url
                      altText
                    }
                  }
                }
              }
              image {
                id
                url
                altText
              }
            }
            ... on Metaobject {
              id
              fields {
                key
                type
                value
                reference {
                  ... on Collection {
                    id
                    handle
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

// Helper to extract collections_display references as array of { title, products }
export function getCollectionsDisplayReferences(
  fields: MetaobjectField[],
): Array<{title: string; products: Product[]}> {
  const field = getFieldByKey(fields, 'collections_display');
  if (!field?.references?.nodes) return [];

  // Only process nodes that are Metaobject (have fields)
  return field.references.nodes
    .filter((node): node is Metaobject => 'fields' in node)
    .map((node) => {
      const titleField = node.fields.find(
        (f: MetaobjectField) => f.key === 'title',
      );
      const collectionField = node.fields.find(
        (f: MetaobjectField) => f.key === 'collection',
      );
      const collection = collectionField?.reference as Collection | undefined;
      if (!titleField?.value || !collection?.products) return null;
      return {
        title: titleField.value,
        products: collection.products.nodes,
      };
    })
    .filter(Boolean) as Array<{title: string; products: Product[]}>;
}
