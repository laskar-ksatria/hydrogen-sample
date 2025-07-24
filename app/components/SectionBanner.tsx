import {Link} from 'react-router';
import type {Collection} from '~/types/metaobject';

interface BannerSectionProps {
  collection: Collection;
  index: number;
  total: number;
}

/**
 * Individual banner section component for each collection
 * Features:
 * - Responsive background image from collection.image.url
 * - Hover effects with scale and opacity transitions
 * - Click-through to collection page (/collections/{handle})
 * - Product count display
 * - Animated arrow on hover
 */
function BannerSection({collection, index, total}: BannerSectionProps) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      className="relative flex-1 h-full overflow-hidden cursor-pointer group"
    >
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105 bg-gray-200"
          style={{
            backgroundImage: collection.image?.url
              ? `url(${collection.image.url})`
              : 'none',
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-4xl md:text-6xl lg:text-8xl font-bold tracking-wide drop-shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500">
            {collection.title}
          </h2>
        </div>
      </div>

      {/* Hover overlay with arrow */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

interface SectionBannerProps {
  /** Array of collections from banner_collections metaobject field */
  collections?: Collection[];
}

/**
 * Main banner section component that displays collection banners
 *
 * Features:
 * - Dynamic collection data from Shopify metaobject
 * - Responsive layout (1-3 collections supported)
 * - Fallback to default collections if no data provided
 * - Click-through navigation to collection pages
 * - Background images from collection.image.url
 * - Hover effects and animations
 *
 * Usage:
 * ```tsx
 * // With metaobject data
 * const bannerCollections = getBannerCollections(metaobject.fields);
 * <SectionBanner collections={bannerCollections} />
 *
 * // Fallback (will show default Men/Women collections)
 * <SectionBanner />
 * ```
 *
 * @param collections - Array of Collection objects from metaobject banner_collections field
 */
export function SectionBanner({collections = []}: SectionBannerProps) {
  // Fallback to default collections if no data provided
  const defaultCollections: Collection[] = [
    {
      id: 'default-1',
      title: 'Men',
      handle: 'men',
      products: {nodes: []},
      image: {
        id: 'default-image-1',
        url: 'https://image-cdn.hypb.st/hbx.hypebeast.com%2Ffiles%2FBanner_1x1_01.jpg?w=1800',
        altText: 'Men Collection',
      },
    },
    {
      id: 'default-2',
      title: 'Women',
      handle: 'women',
      products: {nodes: []},
      image: {
        id: 'default-image-2',
        url: 'https://image-cdn.hypb.st/hbx.hypebeast.com%2Ffiles%2FBanner_1x1_01.jpg?w=1800',
        altText: 'Women Collection',
      },
    },
  ];

  const displayCollections =
    collections.length > 0 ? collections : defaultCollections;

  if (displayCollections.length === 0) {
    return null;
  }

  return (
    <section className="w-full font-mono h-[80vh] md:h-[70vh] lg:h-[90vh] min-h-[600px] md:min-h-[500px]">
      <div
        className={`flex h-full ${
          displayCollections.length === 1
            ? 'flex-col'
            : displayCollections.length === 2
              ? 'flex-col md:flex-row'
              : 'flex-col lg:flex-row'
        }`}
      >
        {displayCollections.map((collection, index) => (
          <BannerSection
            key={collection.id}
            collection={collection}
            index={index}
            total={displayCollections.length}
          />
        ))}
      </div>
    </section>
  );
}

/* 
// Usage Examples:

// 1. With metaobject data (recommended)
import { getBannerCollections } from '~/types/metaobject';

const bannerCollections = getBannerCollections(metaobject.fields);
<SectionBanner collections={bannerCollections} />

// 2. With custom data
const customCollections = [
  {
    id: '1',
    title: 'Summer Sale',
    handle: 'summer-sale',
    products: { nodes: [...] },
    image: { url: 'https://...', altText: 'Summer', id: '1' }
  }
];
<SectionBanner collections={customCollections} />

// 3. Fallback mode (shows default Men/Women)
<SectionBanner />
*/
