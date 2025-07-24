import {Link} from 'react-router';

export interface BrandSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  desktopImage?: {
    url: string;
    altText: string | null;
  };
  mobileImage?: {
    url: string;
    altText: string | null;
  };
}

/**
 * Brand section component with dynamic content from metaobject
 *
 * Features:
 * - Dynamic content from brand_section metaobject fields
 * - Responsive background images from banner.fields (key-based: "desktop", "Desktop", "mobile", "Mobile", etc.)
 * - Smart overlay with hover effects
 * - Fallback to default content if no data provided
 * - Link button with custom URL detection
 *
 * Image Key Support:
 * - Desktop: "desktop", "Desktop", "DESKTOP", "desk"
 * - Mobile: "mobile", "Mobile", "MOBILE", "mob"
 *
 * Usage:
 * ```tsx
 * // With metaobject data
 * const brandSectionProps = transformForBrandSection(metaobject);
 * <BrandSection {...brandSectionProps} />
 *
 * // Fallback mode
 * <BrandSection />
 * ```
 */
export function BrandSection({
  title = 'Talk about your brand',
  description = 'Share information about your brand with your customers. Describe a product, make announcements, or welcome customers to your store.',
  buttonText = 'Discover More',
  buttonUrl = '/collections',
  desktopImage,
  mobileImage,
}: BrandSectionProps = {}) {
  const hasBackgroundImage = desktopImage?.url || mobileImage?.url;

  return (
    <section className="md:py-10 py-5 font-mono bg-black/80 text-white px-4 relative overflow-hidden group">
      {/* Background Images */}
      {hasBackgroundImage && (
        <>
          {/* Desktop Background */}
          {desktopImage?.url && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(${desktopImage.url})`,
              }}
            />
          )}

          {/* Mobile Background */}
          {mobileImage?.url && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(${mobileImage.url})`,
              }}
            />
          )}

          {/* Smart Overlay with hover effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/65 group-hover:from-black/40 group-hover:via-black/45 group-hover:to-black/55 transition-all duration-500" />
        </>
      )}

      <div className="container relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Content Container */}
          <div className="p-8 md:p-10 text-center">
            {/* Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light mb-3 text-white drop-shadow-2xl group-hover:drop-shadow-lg transition-all duration-300">
              {title}
            </h2>

            {/* Description */}
            <div className="p-6 md:p-8 mb-3">
              <p className="text-sm md:text-lg leading-relaxed max-w-2xl text-center mx-auto text-white/95 drop-shadow-lg group-hover:text-white transition-all duration-300">
                {description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="p-3 inline-block">
              {buttonUrl.startsWith('/') ? (
                <Link
                  to={buttonUrl}
                  className="bg-transparent text-white border-2 border-white cursor-pointer px-8 py-3 text-sm md:text-lg font-medium hover:bg-white hover:text-black hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-block"
                >
                  {buttonText}
                </Link>
              ) : (
                <a
                  href={buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent text-white border-2 border-white cursor-pointer px-8 py-3 text-sm md:text-lg font-medium hover:bg-white hover:text-black hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-block"
                >
                  {buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 
// Usage Examples:

// 1. With metaobject data (recommended) - supports flexible keys
// Keys supported: "desktop"/"Desktop"/"DESKTOP"/"desk" and "mobile"/"Mobile"/"MOBILE"/"mob"
import { transformForBrandSection } from '~/examples/metaobject-usage';

const brandSectionProps = transformForBrandSection(metaobject);
if (brandSectionProps) {
  <BrandSection {...brandSectionProps} />
}

// 2. With custom data
<BrandSection 
  title="Custom Brand Title"
  description="Custom description text"
  buttonText="Shop Now"
  buttonUrl="/collections/featured"
  desktopImage={{ url: "https://...", altText: "Brand" }}
  mobileImage={{ url: "https://...", altText: "Brand Mobile" }}
/>

// 3. Fallback mode (shows default content)
<BrandSection />

// Data structure from metaobject:
// banner.fields = [
//   { key: "Desktop", reference: { image: { url: "...", altText: "..." } } },
//   { key: "Mobile", reference: { image: { url: "...", altText: "..." } } },
//   { key: "title", value: "Brand Title" }
// ]
*/
