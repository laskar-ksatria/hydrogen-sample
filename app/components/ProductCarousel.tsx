import {IoChevronForward, IoChevronBack} from 'react-icons/io5';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';

// Import swiper styles - if these don't work, we'll use fallback
import 'swiper/css';
import 'swiper/css/navigation';
import {Link} from 'react-router';
import {ProductItem} from '~/components/ProductItem';
import type {Product as ProductShopify} from '~/types/metaobject';
import {useState} from 'react';

interface Product {
  id: string;
  vendor: string;
  name: string;
  price: string;
  isNew?: boolean;
  primaryImage?: string;
  secondaryImage?: string;
}

interface ProductCarouselProps {
  title?: string;
  products?: Product[] | ProductShopify[];
}

const dummyProducts: Product[] = [
  {
    id: '1',
    vendor: 'A. SOCIETY',
    name: 'Navy',
    price: '160,000',
    isNew: true,
    primaryImage:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    secondaryImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  },
  {
    id: '2',
    vendor: 'RICK OWENS',
    name: 'Deep V Si T',
    price: '465,000',
    isNew: true,
    primaryImage:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
    secondaryImage:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop',
  },
  {
    id: '3',
    vendor: 'RICK OWENS',
    name: 'Brad T',
    price: '350,000',
    isNew: true,
    primaryImage:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    secondaryImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  },
  {
    id: '4',
    vendor: 'PUMA',
    name: 'Speedcat OG',
    price: '140,000',
    isNew: true,
    primaryImage:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    secondaryImage:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop',
  },
  {
    id: '5',
    vendor: 'STONE ISLAND',
    name: '60/2 Cotton Jersey Short-Sleeve T-Shirt Compass Patch',
    price: '250,000',
    isNew: true,
    primaryImage:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    secondaryImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  },
  {
    id: '6',
    vendor: 'NIKE',
    name: 'Air Force 1 Low',
    price: '110,000',
    isNew: true,
    primaryImage:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    secondaryImage:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop',
  },
  {
    id: '7',
    vendor: 'SUPREME',
    name: 'Box Logo Hoodie',
    price: '180,000',
    isNew: true,
    primaryImage:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    secondaryImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  },
  {
    id: '8',
    vendor: 'BALENCIAGA',
    name: 'Triple S Sneaker',
    price: '895,000',
    isNew: false,
    primaryImage:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    secondaryImage:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop',
  },
];

function ProductCard({product}: {product: Product | ProductShopify}) {
  const [isHovered, setIsHovered] = useState(false);

  // If product has Shopify fields, render with ProductItem
  if ('priceRange' in product && 'title' in product && 'images' in product) {
    // @ts-expect-error: ProductItem expects Shopify product type
    return <ProductItem product={product} />;
  }

  // For dummy products, add hover functionality
  const dummyProduct = product as Product;

  // Fallback to dummy product card with consistent styling
  return (
    <div className="w-[220px] sm:w-[240px] md:w-[260px] lg:w-[276px] cursor-pointer">
      {/* Product Image Container */}
      <div
        className="h-[280px] sm:h-[300px] md:h-[330px] lg:h-[358px] bg-zinc-200 mb-4 overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Primary Image */}
        {dummyProduct.primaryImage && (
          <img
            src={dummyProduct.primaryImage}
            alt={dummyProduct.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isHovered && dummyProduct.secondaryImage
                ? 'opacity-0'
                : 'opacity-100'
            }`}
          />
        )}

        {/* Secondary Image (Hover) */}
        {dummyProduct.secondaryImage && (
          <img
            src={dummyProduct.secondaryImage}
            alt={dummyProduct.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Fallback if no images */}
        {!dummyProduct.primaryImage && !dummyProduct.secondaryImage && (
          <div className="w-full h-full bg-zinc-200"></div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1 sm:space-y-2">
        <div className="font-bold text-xs sm:text-sm uppercase tracking-wide text-gray-900">
          {dummyProduct?.vendor}
        </div>
        <div className="text-xs sm:text-sm text-gray-700 leading-tight">
          {dummyProduct.name}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="font-semibold text-xs sm:text-base text-gray-900">
            {dummyProduct.price}
          </span>
        </div>
      </div>
    </div>
  );
}

interface CarouselContainerProps {
  useContainer?: boolean;
  children: React.ReactNode;
  className?: string;
}

function CarouselContainer({
  useContainer = false,
  children,
  className = '',
}: CarouselContainerProps) {
  if (useContainer) {
    return <div className={`container ${className}`}>{children}</div>;
  }
  return (
    <div className={`max-w-7xl ml-0 mr-auto ${className}`}>{children}</div>
  );
}

export function ProductCarousel({
  title = "Men's New Arrivals",
  products = dummyProducts,
  useContainer = false,
}: ProductCarouselProps & {useContainer?: boolean}) {
  return (
    <section
      className={`md:pt-12 pt-8 md:pb-8 pb-2 ${useContainer ? '' : 'pl-2 md:pl-1 lg:pl-8'}`}
    >
      <CarouselContainer useContainer={useContainer}>
        {/* Header */}
        <div className="flex font-mono items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Link to="/" className="underline cursor-pointer hover:no-underline">
            View All
          </Link>
          {/* <button className="swiper-button-prev-custom p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
              <IoChevronBack className="w-5 h-5 text-gray-600" />
            </button>
            <button className="swiper-button-next-custom p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
              <IoChevronForward className="w-5 h-5 text-gray-600" />
            </button> */}
        </div>

        {/* Products Swiper */}
        <div className={`relative ${useContainer ? '' : '-ml-2 pl-2'}`}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={12}
            slidesPerView={1.2}
            direction="horizontal"
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            breakpoints={{
              480: {
                slidesPerView: 2.0,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 3.2,
                spaceBetween: 12,
              },
              1024: {
                slidesPerView: 4.0,
                spaceBetween: 12,
              },
              1280: {
                slidesPerView: 4.8,
                spaceBetween: 12,
              },
            }}
            style={{
              paddingBottom: '16px',
            }}
            wrapperClass="!flex !flex-row"
          >
            {products.map((product) => (
              <SwiperSlide
                key={
                  'id' in product
                    ? product.id
                    : // fallback for Shopify product (use title+index)
                      'title' in product
                      ? product.title
                      : Math.random()
                }
                className="!w-[220px] sm:!w-[240px] md:!w-[260px] lg:!w-[276px]"
                style={{
                  flexShrink: 0,
                }}
              >
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </CarouselContainer>
    </section>
  );
}
