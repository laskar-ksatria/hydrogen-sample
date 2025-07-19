import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

export const meta: MetaFunction = () => {
  return [{title: 'HBX | Home'}];
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
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
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

  return (
    <div className="home">
      {/* Promotional Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <span>
            End of Season Sale is now live! Up to 70% off on new styles. T&Cs
            Apply.
          </span>
          <Link to="/collections/sale" className="promo-link">
            See More
          </Link>
        </div>
      </div>

      {/* Hero Split Layout */}
      <div className="hero-split">
        <Link to="/collections/men" className="hero-section hero-men">
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop&crop=center"
              alt="Men's Collection"
              className="hero-img"
            />
          </div>
          <div className="hero-overlay">
            <h1 className="hero-title">Men</h1>
          </div>
        </Link>

        <Link to="/collections/women" className="hero-section hero-women">
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop&crop=center"
              alt="Women's Collection"
              className="hero-img"
            />
          </div>
          <div className="hero-overlay">
            <h1 className="hero-title">Women</h1>
          </div>
        </Link>
      </div>

      {/* New Arrivals Section */}
      <NewArrivalsSection />

      {/* Featured Products */}
      <div className="featured-section">
        <RecommendedProducts products={data.recommendedProducts} />
      </div>

      {/* Brand Spotlight */}
      <BrandSpotlight />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Featured Collections */}
      <FeaturedCollections />
    </div>
  );
}

function NewArrivalsSection() {
  const newArrivals = [
    {
      id: 1,
      title: 'Stone Island Compass Logo Sweatshirt',
      brand: 'Stone Island',
      price: 'IDR 4,200,000',
      image:
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center',
      isNew: true,
    },
    {
      id: 2,
      title: 'Rick Owens DRKSHDW Sneakers',
      brand: 'Rick Owens',
      price: 'IDR 8,500,000',
      image:
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
      isNew: true,
    },
    {
      id: 3,
      title: 'Maison Margiela Tabi Boots',
      brand: 'Maison Margiela',
      price: 'IDR 12,000,000',
      image:
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&crop=center',
      isNew: true,
    },
    {
      id: 4,
      title: 'Acne Studios Face Hoodie',
      brand: 'Acne Studios',
      price: 'IDR 6,800,000',
      image:
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center',
      isNew: true,
    },
  ];

  return (
    <section className="new-arrivals-section">
      <div className="section-container">
        <div className="section-header">
          <h2>New Arrivals</h2>
          <Link to="/collections/new" className="view-all-link">
            View All
          </Link>
        </div>
        <div className="new-arrivals-grid">
          {newArrivals.map((product) => (
            <div key={product.id} className="hbx-product-card">
              <Link
                to={`/products/${product.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="product-card-link"
              >
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image-hbx"
                  />
                  {product.isNew && <span className="new-badge">NEW</span>}
                  <div className="product-hover-overlay">
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </div>
                <div className="product-details">
                  <div className="product-brand">{product.brand}</div>
                  <h3 className="product-name">{product.title}</h3>
                  <div className="product-price-hbx">{product.price}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandSpotlight() {
  const brands = [
    {
      name: 'Stone Island',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
    },
    {
      name: 'Rick Owens',
      image:
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=200&fit=crop',
    },
    {
      name: 'Maison Margiela',
      image:
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=200&fit=crop',
    },
    {
      name: 'Acne Studios',
      image:
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=200&fit=crop',
    },
  ];

  return (
    <section className="brand-spotlight">
      <div className="section-container">
        <h2>Featured Brands</h2>
        <div className="brands-grid">
          {brands.map((brand, index) => (
            <Link
              key={index}
              to={`/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="brand-card"
            >
              <img src={brand.image} alt={brand.name} />
              <div className="brand-overlay">
                <h3>{brand.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  const categories = [
    {
      name: 'Hoodies',
      count: '148 items',
      image:
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    },
    {
      name: 'Sneakers',
      count: '89 items',
      image:
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop',
    },
    {
      name: 'Jackets',
      count: '203 items',
      image:
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=400&fit=crop',
    },
    {
      name: 'Accessories',
      count: '67 items',
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop',
    },
  ];

  return (
    <section className="category-grid-section">
      <div className="section-container">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/collections/${category.name.toLowerCase()}`}
              className="category-card"
            >
              <img src={category.image} alt={category.name} />
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCollections() {
  return (
    <section className="featured-collections">
      <div className="section-container">
        <div className="collections-grid">
          <Link
            to="/collections/sale"
            className="collection-banner sale-banner"
          >
            <div className="collection-content">
              <h2>End of Season Sale</h2>
              <p>Up to 70% off selected items</p>
              <span className="shop-now-btn">Shop Now →</span>
            </div>
          </Link>

          <Link to="/collections/new" className="collection-banner new-banner">
            <div className="collection-content">
              <h2>New Arrivals</h2>
              <p>Fresh drops from top brands</p>
              <span className="shop-now-btn">Discover →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Featured Products</h2>
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
