import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

const STATS = [
  { label: "Backpackers", value: 1200, suffix: "+" },
  { label: "Countries", value: 48, suffix: "" },
  { label: "Trips Completed", value: 320, suffix: "+" },
  { label: "Average Rating", value: 4.8, suffix: "/5", isDecimal: true },
  { label: "Verified Guides", value: 100, suffix: "%" },
];

function Counter({ value, suffix, isDecimal }: { value: number; suffix: string; isDecimal?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {isDecimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function TrustBar() {
  return (
    <section className="bg-gradient-signature py-8 border-y border-white/10 shadow-lg shadow-forest/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
          {STATS.map((stat, idx) => (
            <div key={idx} className="text-center md:border-r border-white/10 last:border-0">
              <div className="text-2xl md:text-3xl font-black text-white mb-1">
                <Counter value={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
