import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

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
  const image = product.featuredImage;

  return (
    <div className="hbx-product-item">
      <Link
        className="product-link"
        key={product.id}
        prefetch="intent"
        to={variantUrl}
      >
        <div className="product-image-container">
          {image && (
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
              className="product-image"
            />
          )}
          <div className="product-overlay">
            <button className="quick-view-btn">Quick View</button>
          </div>
        </div>

        <div className="product-info">
          <h4 className="product-title">{product.title}</h4>
          <div className="product-price">
            <Money data={product.priceRange.minVariantPrice} />
          </div>
        </div>
      </Link>
    </div>
  );
}
