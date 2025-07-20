export default function HalloBar() {
  const text = 'End of Season Sale is now here! Up to 70% off on new styles.';
  return (
    <div className="bg-red-600 py-[0.5rem] text-white">
      <p className="text-center text-xs font-light font-mono">{text}</p>
    </div>
  );
}
