export default function Moon() {
  return (
    <div className="fixed top-6 right-8 z-0 pointer-events-none animate-float">
      {/* Soft glow behind moon */}
      <div
        className="absolute rounded-full"
        style={{
          inset: "-40px",
          background:
            "radial-gradient(circle, rgba(245,220,66,0.12) 0%, transparent 70%)",
        }}
      />
      <svg
        width="110"
        height="110"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="moonGrad" cx="38%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#fef5b0" />
            <stop offset="100%" stopColor="#f0c030" />
          </radialGradient>
        </defs>
        {/* Full moon base */}
        <circle cx="50" cy="50" r="44" fill="url(#moonGrad)" />
        {/* Crescent cutout — uses the background color */}
        <circle cx="72" cy="42" r="38" fill="#060c1e" />
        {/* Craters */}
        <circle cx="22" cy="64" r="6.5" fill="#e8c030" opacity="0.35" />
        <circle cx="30" cy="43" r="4" fill="#e8c030" opacity="0.3" />
        <circle cx="13" cy="50" r="3" fill="#e8c030" opacity="0.25" />
        <circle cx="17" cy="76" r="3.5" fill="#e8c030" opacity="0.22" />
      </svg>
    </div>
  );
}
