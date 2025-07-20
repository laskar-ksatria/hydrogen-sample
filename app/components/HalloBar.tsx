export default function HalloBar() {
  const text = 'End of Season Sale is now here! Up to 70% off on new styles.';

  return (
    <div className="bg-red-600 py-[0.5rem] text-white overflow-hidden">
      {/* Desktop/Tablet - Centered text */}
      <p className="hidden md:block text-center text-xs font-light font-mono">
        {text}
      </p>

      {/* Mobile - Marquee effect */}
      <div className="md:hidden relative">
        <div className="hallo-marquee-container">
          <div className="hallo-marquee-content">
            <span className="text-xs font-light font-mono whitespace-nowrap pr-20">
              {text}
            </span>
            <span className="text-xs font-light font-mono whitespace-nowrap pr-20">
              {text}
            </span>
            <span className="text-xs font-light font-mono whitespace-nowrap pr-20">
              {text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
