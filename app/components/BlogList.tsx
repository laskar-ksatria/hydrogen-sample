import {IoChevronForward, IoChevronBack} from 'react-icons/io5';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';

// Import swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Dummy blog data
const dummyBlogs = [
  {
    id: 1,
    title: 'The Future of E-commerce',
    date: 'December 15, 2024',
    excerpt:
      'Discover the latest trends shaping the future of online shopping and digital commerce.',
  },
  {
    id: 2,
    title: 'Sustainable Fashion Guide',
    date: 'December 12, 2024',
    excerpt:
      'Learn how to build a more sustainable wardrobe with eco-friendly fashion choices.',
  },
  {
    id: 3,
    title: 'Style Tips for Winter',
    date: 'December 10, 2024',
    excerpt:
      'Stay warm and stylish this winter with our expert styling tips and outfit ideas.',
  },
  {
    id: 4,
    title: 'Behind the Scenes',
    date: 'December 8, 2024',
    excerpt:
      'Take a look behind the scenes of our latest photoshoot and collection launch.',
  },
  {
    id: 5,
    title: 'Customer Stories',
    date: 'December 5, 2024',
    excerpt:
      'Read inspiring stories from our customers and how our products fit into their lives.',
  },
  {
    id: 6,
    title: 'Holiday Gift Guide',
    date: 'December 1, 2024',
    excerpt:
      'Find the perfect gifts for your loved ones with our curated holiday gift guide.',
  },
];

interface Blog {
  id: number;
  title: string;
  date: string;
  excerpt: string;
}

interface BlogListProps {
  useContainer?: boolean;
  title?: string;
  blogs?: Blog[];
}

function BlogCard({blog}: {blog: Blog}) {
  return (
    <article className="w-[280px] sm:w-[300px] md:w-[320px] lg:w-[350px] group cursor-pointer">
      {/* Blog Image */}
      <div className="aspect-[4/3] bg-zinc-200 overflow-hidden mb-4">
        <div className="w-full h-full bg-zinc-200 flex items-center justify-center group-hover:bg-zinc-300 transition-colors duration-300">
          <div className="text-zinc-400 text-sm font-medium">Blog Image</div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="space-y-3">
        {/* Date */}
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {blog.date}
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-light text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Read More Link */}
        <div className="pt-2">
          <button className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200 border-b border-gray-300 hover:border-gray-500">
            Read More
          </button>
        </div>
      </div>
    </article>
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

export function BlogList({
  useContainer = false,
  title = 'Latest Stories',
  blogs = dummyBlogs,
}: BlogListProps) {
  return (
    <section
      className={`md:pt-12 pt-8 md:pb-8 pb-2 ${useContainer ? '' : 'pl-2 pr-4 md:pl-1 md:pr-2 lg:pl-8 lg:pr-2'}`}
    >
      <CarouselContainer useContainer={useContainer}>
        {/* Header */}
        <div className="flex items-center font-mono justify-between mb-8">
          <div>
            <h2 className="text-xl font-mono md:text-3xl font-semibold text-gray-900 mb-1">
              {title}
            </h2>
            <p className="text-gray-600 text-base">
              Discover insights, trends, and stories from our world
            </p>
          </div>
          <div className="flex gap-2">
            <button className="swiper-button-prev-blog p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
              <IoChevronBack className="w-5 h-5 text-gray-600" />
            </button>
            <button className="swiper-button-next-blog p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
              <IoChevronForward className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Blogs Swiper */}
        <div
          className={`relative ${
            useContainer
              ? '-mx-2 sm:-mx-2 md:-mx-4 lg:-mx-8 px-2 sm:px-2 md:px-4 lg:px-8'
              : '-ml-2 -mr-4 pl-2 pr-4'
          }`}
        >
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1.0}
            direction="horizontal"
            navigation={{
              prevEl: '.swiper-button-prev-blog',
              nextEl: '.swiper-button-next-blog',
            }}
            breakpoints={{
              480: {
                slidesPerView: 1.2,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 1.8,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 2.8,
                spaceBetween: 16,
              },
              1280: {
                slidesPerView: 3.5,
                spaceBetween: 16,
              },
            }}
            style={{
              paddingBottom: '16px',
            }}
            wrapperClass="!flex !flex-row"
          >
            {blogs.map((blog) => (
              <SwiperSlide
                key={blog.id}
                className="!w-[280px] sm:!w-[300px] md:!w-[320px] lg:!w-[350px]"
                style={{
                  flexShrink: 0,
                }}
              >
                <BlogCard blog={blog} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </CarouselContainer>
    </section>
  );
}
