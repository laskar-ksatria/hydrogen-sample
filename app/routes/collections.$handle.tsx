import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, useSearchParams} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {CollectionFilters} from '~/components/CollectionFilters';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const sortBy = url.searchParams.get('sort_by');

  // Parse filter parameters
  const filters = parseFilterParams(url.searchParams);

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        ...paginationVariables,
        sortKey: getSortKey(sortBy),
        reverse: getSortReverse(sortBy),
        filters: filters.length > 0 ? filters : undefined,
      },
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

// Helper function to parse filter parameters from URL
function parseFilterParams(searchParams: URLSearchParams) {
  const filters: any[] = [];

  // Parse product type filters
  const productTypes = searchParams.getAll('filter.p.type');
  if (productTypes.length > 0) {
    productTypes.forEach((type) => {
      filters.push({productType: type});
    });
  }

  // Parse vendor filters
  const vendors = searchParams.getAll('filter.p.vendor');
  if (vendors.length > 0) {
    vendors.forEach((vendor) => {
      filters.push({productVendor: vendor});
    });
  }

  // Parse availability filters
  const availability = searchParams.get('filter.v.availability');
  if (availability) {
    filters.push({available: availability === 'true'});
  }

  // Parse price filters
  const priceMin = searchParams.get('filter.v.price.gte');
  const priceMax = searchParams.get('filter.v.price.lte');
  if (priceMin || priceMax) {
    filters.push({
      price: {
        min: priceMin ? parseFloat(priceMin) : undefined,
        max: priceMax ? parseFloat(priceMax) : undefined,
      },
    });
  }

  return filters;
}

// Helper function to convert sort_by parameter to Shopify sortKey
function getSortKey(sortBy: string | null): any {
  switch (sortBy) {
    case 'title-ascending':
      return 'TITLE';
    case 'title-descending':
      return 'TITLE';
    case 'price-ascending':
      return 'PRICE';
    case 'price-descending':
      return 'PRICE';
    case 'created-ascending':
      return 'CREATED';
    case 'created-descending':
      return 'CREATED';
    case 'best-selling':
      return 'BEST_SELLING';
    default:
      return 'COLLECTION_DEFAULT';
  }
}

// Helper function to determine if sort should be reversed
function getSortReverse(sortBy: string | null): boolean {
  switch (sortBy) {
    case 'title-descending':
    case 'price-descending':
    case 'created-descending':
      return true;
    default:
      return false;
  }
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const currentSortBy = searchParams.get('sort_by') || 'collection-default';

  // Get available filters from the collection data
  const availableFilters = collection.products.filters || [];

  // Transform Shopify filters to our component format
  const filters = availableFilters.map((filter: any) => ({
    id: filter.id,
    label: filter.label,
    type: filter.type,
    values: filter.values.map((value: any) => ({
      id: value.id,
      label: value.label,
      count: value.count,
      input: value.input,
    })),
  }));

  // Fallback to mock filters if no real filters available
  const displayFilters =
    filters.length > 0
      ? filters
      : [
          {
            id: 'filter.p.type',
            label: 'Type',
            type: 'LIST' as const,
            values: [
              {
                id: 'filter.p.typeshoes',
                label: 'Shoes',
                count: 15,
                input: '{"productType":"shoes"}',
              },
              {
                id: 'filter.p.typeclothing',
                label: 'Clothing',
                count: 25,
                input: '{"productType":"clothing"}',
              },
              {
                id: 'filter.p.typeaccessories',
                label: 'Accessories',
                count: 10,
                input: '{"productType":"accessories"}',
              },
              {
                id: 'filter.p.typebags',
                label: 'Bags',
                count: 12,
                input: '{"productType":"bags"}',
              },
              {
                id: 'filter.p.typejewelry',
                label: 'Jewelry',
                count: 8,
                input: '{"productType":"jewelry"}',
              },
            ],
          },
          {
            id: 'filter.p.vendor',
            label: 'Vendor',
            type: 'LIST' as const,
            values: [
              {
                id: 'filter.p.vendornike',
                label: 'Nike',
                count: 8,
                input: '{"productVendor":"nike"}',
              },
              {
                id: 'filter.p.vendoradidas',
                label: 'Adidas',
                count: 12,
                input: '{"productVendor":"adidas"}',
              },
              {
                id: 'filter.p.vendorpuma',
                label: 'Puma',
                count: 6,
                input: '{"productVendor":"puma"}',
              },
              {
                id: 'filter.p.vendorunder-armour',
                label: 'Under Armour',
                count: 4,
                input: '{"productVendor":"under-armour"}',
              },
              {
                id: 'filter.p.vendornew-balance',
                label: 'New Balance',
                count: 7,
                input: '{"productVendor":"new-balance"}',
              },
            ],
          },
          {
            id: 'filter.v.availability',
            label: 'Availability',
            type: 'LIST' as const,
            values: [
              {
                id: 'filter.v.availability0',
                label: 'Out of Stock',
                count: 3,
                input: '{"available":false}',
              },
              {
                id: 'filter.v.availability1',
                label: 'In Stock',
                count: 1,
                input: '{"available":true}',
              },
            ],
          },
        ];

  const sortOptions = [
    {value: 'collection-default', label: 'Featured'},
    {value: 'title-ascending', label: 'Alphabetically, A-Z'},
    {value: 'title-descending', label: 'Alphabetically, Z-A'},
    {value: 'price-ascending', label: 'Price, low to high'},
    {value: 'price-descending', label: 'Price, high to low'},
    {value: 'created-ascending', label: 'Date, old to new'},
    {value: 'created-descending', label: 'Date, new to old'},
    {value: 'best-selling', label: 'Best selling'},
  ];

  return (
    <div className="collection min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Collection Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-mono">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-gray-600 max-w-3xl font-mono">
              {collection.description}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <CollectionFilters
            filters={displayFilters}
            sortOptions={sortOptions}
            currentSortBy={currentSortBy}
            totalProducts={collection.products.nodes.length}
          />

          {/* Products Grid */}
          <div className="flex-1">
            <PaginatedResourceSection
              connection={collection.products}
              resourcesClassName="products-grid"
            >
              {({node: product, index}: {node: any; index: number}) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 8 ? 'eager' : undefined}
                />
              )}
            </PaginatedResourceSection>
          </div>
        </div>
      </div>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    vendor
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 10) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse,
        filters: $filters
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
    }
  }
` as const;
