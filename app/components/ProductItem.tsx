import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {useState} from 'react';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const [isHovered, setIsHovered] = useState(false);

  // Get all images from the product
  const images = (product as any).images?.nodes || [];
  const primaryImage = images[0] ?? product.featuredImage;
  const secondaryImage = images[1]; // Image index 1 for hover

  // Defensive: check priceRange and minVariantPrice/maxVariantPrice
  let price = null;
  let currency = 'USD';
  if (product.priceRange?.minVariantPrice?.amount) {
    price = product.priceRange.minVariantPrice.amount;
    currency = product.priceRange.minVariantPrice.currencyCode ?? 'USD';
  } else if (
    typeof product.priceRange === 'object' &&
    product.priceRange &&
    'maxVariantPrice' in product.priceRange &&
    product.priceRange.maxVariantPrice?.amount
  ) {
    price = product.priceRange.maxVariantPrice.amount;
    currency = product.priceRange.maxVariantPrice.currencyCode ?? 'USD';
  }

  return (
    <Link
      className="w-[220px] sm:w-[240px] md:w-[260px] lg:w-[276px] cursor-pointer"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/* Product Image Container */}
      <div
        className="h-[280px] sm:h-[300px] md:h-[330px] lg:h-[358px] bg-zinc-200 mb-4 overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Primary Image */}
        {primaryImage && (
          <Image
            alt={primaryImage.altText || product.title}
            data={primaryImage}
            loading={loading}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}

        {/* Secondary Image (Hover) */}
        {secondaryImage && (
          <Image
            alt={secondaryImage.altText || product.title}
            data={secondaryImage}
            loading={loading}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Fallback if no images */}
        {!primaryImage && !secondaryImage && (
          <div className="w-full h-full bg-zinc-200"></div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1 sm:space-y-2">
        <div className="font-bold text-xs sm:text-sm uppercase tracking-wide text-gray-900">
          {(product as any).vendor || 'Brand'}
        </div>
        <div className="text-xs sm:text-sm text-gray-700 leading-tight">
          {product.title}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="font-semibold  text-xs sm:text-base text-gray-900">
            {price ? (
              <span>
                {currency} {parseFloat(price).toLocaleString()}
              </span>
            ) : (
              <span className="text-gray-400">No price</span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
