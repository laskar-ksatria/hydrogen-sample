import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {AddToCartButton} from '~/components/AddToCartButton';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCarousel} from '~/components/ProductCarousel';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className="relative">
      {/* Sticky Breadcrumb - Nempel di Header */}
      <div className="container bg-white p-4">
        <div className="text-xs font-mono text-gray-600">
          Home › Products › {title}
        </div>
      </div>

      <div className="grid container grid-cols-1 md:grid-cols-12 gap-6 w-full">
        {/* Left Column - Scrollable Content */}
        <div className="md:col-span-6 lg:col-span-8 xl:col-span-8">
          <div className="space-y-6">
            {/* Product Images */}
            <div className="grid grid-cols-2 gap-4">
              {Array.from({length: 4}, (_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-zinc-200  flex items-center justify-center"
                >
                  <span className="text-gray-500">Image {i + 1}</span>
                </div>
              ))}
            </div>
            {/* <div className="space-y-8">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Premium quality materials</li>
                  <li>Comfortable fit</li>
                  <li>Durable construction</li>
                  <li>Easy maintenance</li>
                </ul>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                {Array.from({length: 5}, (_, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 py-4 last:border-b-0"
                  >
                    <div className="flex items-center mb-2">
                      <span className="font-medium">Customer {i + 1}</span>
                      <div className="ml-2 text-yellow-400">★★★★★</div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Great product! Really satisfied with the quality and
                      comfort.
                    </p>
                  </div>
                ))}
              </div>

              {Array.from({length: 10}, (_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 border border-gray-200 rounded-lg"
                >
                  <h4 className="font-semibold mb-2">Section {i + 1}</h4>
                  <p className="text-gray-600">
                    This is additional content to demonstrate the sticky
                    behavior of the right column. Keep scrolling to see the
                    effect.
                  </p>
                </div>
              ))}
            </div> */}
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-4 xl:col-span-4 font-mono">
          <div className="md:sticky md:top-[70px] z-0 bg-white">
            <div className="space-y-6">
              {/* Brand */}
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                NIKE
              </div>

              {/* Product Title */}
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

              {/* Price */}
              <div className="text-xl font-semibold text-gray-900">
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>

              {/* Size Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-black">Size</span>
                  <button className="flex items-center text-sm text-blue-600 hover:underline">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Size Guide ›
                  </button>
                </div>

                {/* Custom Size Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    'US 7 / W 8',
                    'US 8 / W 9',
                    'US 9 / W 10',
                    'US 10 / W 11',
                    'US 11 / W 12',
                  ].map((size, index) => (
                    <button
                      key={size}
                      className={`
                         px-4 py-3 text-sm font-medium text-center
                         border border-gray-300 rounded-lg
                         hover:border-gray-400 transition-colors
                         ${index === 2 ? 'border-black bg-gray-50' : 'bg-white'}
                       `}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Add to Bag Button */}
                <AddToCartButton
                  disabled={
                    !selectedVariant || !selectedVariant.availableForSale
                  }
                  onClick={() => {
                    // You can add cart opening logic here if needed
                  }}
                  lines={
                    selectedVariant
                      ? [
                          {
                            merchandiseId: selectedVariant.id,
                            quantity: 1,
                            selectedVariant,
                          },
                        ]
                      : []
                  }
                >
                  <span className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors mt-6 block text-center">
                    {selectedVariant?.availableForSale
                      ? 'Add to Bag'
                      : 'Sold out'}
                  </span>
                </AddToCartButton>

                {/* Buy Now Button */}
                <button
                  className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors mt-0"
                  disabled={
                    !selectedVariant || !selectedVariant.availableForSale
                  }
                  onClick={() => {
                    // Add buy now logic here - typically redirects to checkout
                    if (selectedVariant) {
                      // You can add redirect to checkout logic here
                    }
                  }}
                >
                  {selectedVariant?.availableForSale
                    ? 'Buy Now'
                    : 'Unavailable'}
                </button>

                {/* Original ProductForm (hidden but functional) */}
                <div className="hidden">
                  <ProductForm
                    productOptions={productOptions}
                    selectedVariant={selectedVariant}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">Description</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Nike</p>
                  <p>• {title}</p>
                  <p>• Soft and responsive ReactX foam</p>
                  <p>• Slip-on design</p>
                  <p>• Swoosh detail at side</p>
                  <p>• Rubber outsole</p>
                  <p>• See more Sandals and Shoes</p>
                </div>
              </div>
              {/* <div className="space-y-1 text-sm border-t pt-4">
                <p>14 days returns.</p>
                <p>This item is excluded from promotions.</p>
                <p className="text-gray-500">
                  Product ID: {product.id.split('/').pop()}
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <ProductCarousel title="You might also like" useContainer={true} />

      {/* Test Content for Scrolling */}

      {/* Rest of your content */}
      {/* <ProductImage image={selectedVariant?.image} /> */}
      {/* <div className="product-main">
        <h1>{title}</h1>
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
        />
        <br />
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />
        <br />
        <br />
        <p>
          <strong>Description</strong>
        </p>
        <br />
        <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        <br />
      </div> */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
