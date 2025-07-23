export function RowSection({position}: {position: 'left' | 'right'}) {
  return (
    <section className="py-6 md:py-8">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Image Side */}
          <div className="order-1">
            <div className="aspect-[4/3] bg-zinc-200 overflow-hidden">
              <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                <div className="text-zinc-400 text-sm font-medium">
                  Image placeholder
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-2 space-y-4">
            {/* Caption */}
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              CAPTION
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900">
              Row
            </h2>

            {/* Description */}
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Pair text with an image to focus on your chosen product,
              collection, or blog post. Add details on availability, style, or
              even provide a review.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <button className="border-2 border-gray-300 text-gray-700 px-6 py-2 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                Button label
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
