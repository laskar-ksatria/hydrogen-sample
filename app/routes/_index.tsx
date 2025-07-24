import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {SectionBanner} from '~/components/SectionBanner';
import {ProductCarousel} from '~/components/ProductCarousel';
import {BrandSection} from '~/components/BrandSection';
import {RowSection} from '~/components/RowSection';
import {BlogList} from '~/components/BlogList';
import {
  processHomePageData,
  transformForBrandSection,
} from '~/examples/metaobject-usage';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
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
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}, homeContent] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(Q_HOME_PAGE_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
    homeContent,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  const homeContent = processHomePageData(data.homeContent);
  const brandSectionProps = transformForBrandSection(
    data.homeContent.metaobject,
  );

  console.log(homeContent);

  return (
    <div className="home">
      <SectionBanner collections={homeContent.bannerCollections} />
      <ProductCarousel useContainer={true} />
      <ProductCarousel useContainer={true} />
      {brandSectionProps ? (
        <BrandSection {...brandSectionProps} />
      ) : (
        <BrandSection />
      )}
      <BlogList useContainer={true} />
      <div className="py-6">
        {/* <RowSection position="left" /> */}
        {/* <RowSection position="right" /> */}
        {/* <RowSection position="left" /> */}
      </div>
    </div>
  );
}

// <FeaturedCollection collection={data.featuredCollection} />
// <RecommendedProducts products={data.recommendedProducts} />

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const Q_HOME_PAGE_QUERY = `#graphql
query HOME_PAGE {
  metaobject(handle: {type: "home_page", handle: "home"}) {
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
      references(first: 100) {
        nodes {
          ... on Metaobject {
            id
            fields {
              key
              type
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
          ... on Collection {
            id
            title
            handle
            products(first: 15) {
              nodes {
                title
                vendor
                priceRange {
                  maxVariantPrice {
                    currencyCode
                    amount
									}
                }
                images(first: 10) {
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
        }
      }
    }
  }
}
`;
