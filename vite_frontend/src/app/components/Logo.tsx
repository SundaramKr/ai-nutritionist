import { Leaf } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Leaf className="w-6 h-6 text-primary" />
      <span className="text-xl font-semibold text-on-surface" style={{ fontFamily: 'var(--font-family-display)' }}>
        NutriPlan
      </span>
    </div>
  );
}