import {Link} from 'react-router';

interface BannerSectionProps {
  title: string;
  imageUrl: string;
  href: string;
  position: 'left' | 'right';
}

function BannerSection({title, imageUrl, href, position}: BannerSectionProps) {
  return (
    <Link
      to={href}
      className="relative flex-1 h-full overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-white text-4xl md:text-6xl lg:text-8xl font-bold tracking-wide drop-shadow-lg">
          {title}
        </h2>
      </div>
    </Link>
  );
}

export function SectionBanner() {
  return (
    <section className="w-full h-[80vh] md:h-[70vh] lg:h-[90vh] min-h-[600px] md:min-h-[500px]">
      <div className="flex flex-col md:flex-row h-full">
        <BannerSection
          title="Men"
          imageUrl="https://image-cdn.hypb.st/hbx.hypebeast.com%2Ffiles%2FBanner_1x1_01.jpg?w=1800"
          href="/collections/men"
          position="left"
        />
        <BannerSection
          title="Women"
          imageUrl="https://image-cdn.hypb.st/hbx.hypebeast.com%2Ffiles%2FBanner_1x1_01.jpg?w=1800"
          href="/collections/women"
          position="right"
        />
      </div>
    </section>
  );
}
