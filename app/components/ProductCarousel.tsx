import {IoChevronForward, IoChevronBack} from 'react-icons/io5';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';

// Import swiper styles - if these don't work, we'll use fallback
import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
  id: string;
  brand: string;
  name: string;
  price: string;
  isNew?: boolean;
}

interface ProductCarouselProps {
  title?: string;
  products?: Product[];
}

const dummyProducts: Product[] = [
  {
    id: '1',
    brand: 'A. SOCIETY',
    name: 'Navy',
    price: '$160',
    isNew: true,
  },
  {
    id: '2',
    brand: 'RICK OWENS',
    name: 'Deep V Si T',
    price: '$465',
    isNew: true,
  },
  {
    id: '3',
    brand: 'RICK OWENS',
    name: 'Brad T',
    price: '$350',
    isNew: true,
  },
  {
    id: '4',
    brand: 'PUMA',
    name: 'Speedcat OG',
    price: '$140',
    isNew: true,
  },
  {
    id: '5',
    brand: 'STONE ISLAND',
    name: '60/2 Cotton Jersey Short-Sleeve T-Shirt Compass Patch',
    price: '$250',
    isNew: true,
  },
  {
    id: '6',
    brand: 'NIKE',
    name: 'Air Force 1 Low',
    price: '$110',
    isNew: true,
  },
  {
    id: '7',
    brand: 'SUPREME',
    name: 'Box Logo Hoodie',
    price: '$180',
    isNew: true,
  },
  {
    id: '8',
    brand: 'BALENCIAGA',
    name: 'Triple S Sneaker',
    price: '$895',
    isNew: false,
  },
];

function ProductCard({product}: {product: Product}) {
  return (
    <div className="w-[276px] cursor-pointer">
      {/* Product Image Placeholder */}
      <div className="h-[358px] bg-zinc-200 mb-4 overflow-hidden">
        <div className="w-full h-full bg-zinc-200"></div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="font-bold text-sm uppercase tracking-wide text-gray-900">
          {product.brand}
        </div>
        <div className="text-sm text-gray-700 leading-tight">
          {product.name}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{product.price}</span>
          {product.isNew && <span className="text-xs text-gray-500">New</span>}
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
      className={`py-12 ${useContainer ? '' : 'pl-2 pr-4 md:pl-1 md:pr-2 lg:pl-8 lg:pr-2'}`}
    >
      <CarouselContainer useContainer={useContainer}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <div className="flex gap-2">
            <button className="swiper-button-prev-custom p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
              <IoChevronBack className="w-5 h-5 text-gray-600" />
            </button>
            <button className="swiper-button-next-custom p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
              <IoChevronForward className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Products Swiper */}
        <div
          className={`relative ${
            useContainer
              ? '-mx-2 sm:-mx-2 md:-mx-4 lg:-mx-8 px-2 sm:px-2 md:px-4 lg:px-8'
              : '-ml-2 -mr-4 pl-2 pr-4'
          }`}
        >
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
                key={product.id}
                style={{
                  width: '276px',
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
