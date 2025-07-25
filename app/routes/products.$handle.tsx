import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {AddToCartButton} from '~/components/AddToCartButton';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCarousel} from '~/components/ProductCarousel';
import ProductVariant from '~/components/ProductVariant';

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
  const [{product}, relatedProducts] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    storefront.query(Q_PRODUCT_RELATED, {variables: {handle}}),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
    relatedProducts,
  };
}

interface IImage {
  altText: string | null;
  id: string;
  url: string;
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
  const {product, relatedProducts} = useLoaderData<typeof loader>();
  console.log(relatedProducts);
  const productImages = product?.images?.nodes as IImage[];

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
              {productImages.map((item) => (
                <div
                  key={item?.id}
                  className="aspect-[3/4] bg-zinc-200  flex items-center justify-center"
                >
                  <Image className="object-cover w-full h-full" data={item} />
                  {/* <span className="text-gray-500">Image</span> */}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-4 xl:col-span-4 font-mono">
          <div className="md:sticky md:top-[70px] z-0 bg-white">
            <div className="space-y-6">
              {/* Brand */}
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {product?.vendor}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl font-bold text-gray-900">
                {product?.title}
              </h1>

              {/* Price */}
              <div className="text-xl font-semibold text-gray-900">
                <ProductPrice
                  price={selectedVariant?.price}
                  compareAtPrice={selectedVariant?.compareAtPrice}
                />
              </div>

              {/* Size Selection */}
              <ProductVariant
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />

              {/* Description */}
              <div className="space-y-3 md:mt-5">
                <h3 className="text-base font-medium">Description</h3>
                <div
                  className="space-y-2 text-sm text-gray-700"
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductCarousel
        noViewAll={true}
        title="You might also like"
        products={relatedProducts?.productRecommendations}
        useContainer={true}
      />
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
    images(first: 25) {
      nodes {
        id 
        altText
        url
      }
    }
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

const Q_PRODUCT_RELATED = `#graphql
query RELATED($handle: String) {
  productRecommendations(productHandle: $handle) {
                title
                vendor
                handle
                id
                priceRange {
                  minVariantPrice {
                    currencyCode
                    amount
                  }
                  maxVariantPrice {
                    currencyCode
                    amount
									}
                }
                images(first: 2) {
                  nodes {
                    id
                    url
                    altText
                  }
                }
  }
}
` as const;
