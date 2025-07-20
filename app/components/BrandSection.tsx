export function BrandSection() {
  return (
    <section className="md:py-10 py-5 font-mono bg-black/80 text-white px-4">
      <div className="container">
        <div className="max-w-7xl mx-auto">
          {/* Main Content Container with Dashed Border */}
          <div className="p-8 md:p-10 text-center">
            {/* Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light mb-3">
              Talk about your brand
            </h2>

            {/* Description */}
            <div className="p-6 md:p-8 mb-3">
              <p className="text-sm md:text-lg leading-relaxed w-2xl text-center mx-auto">
                Share information about your brand with your customers. Describe
                a product, make announcements, or welcome customers to your
                store.
              </p>
            </div>

            {/* CTA Button */}
            <div className="p-3 inline-block">
              <button className="bg-transparent text-white border-2 border-white cursor-pointer px-8 py-3 text-sm md:text-lg font-medium hover:bg-gray-700 transition-colors duration-200">
                Discover More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
