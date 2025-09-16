// src/components/CategoryFilter.tsx
import type { Category } from "@/types/category";

type Props = {
  categories: Category[];
  selectedIds: number[];
  onToggle: (id: number) => void;
};

export default function CategoryFilter({ categories, selectedIds, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-8 gap-y-3">
      {categories.map((c) => {
        const active = selectedIds.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onToggle(c.id)}
            aria-pressed={active}
            className={[
              "inline-flex items-center justify-center",
              "rounded-full px-3 py-1 text-sm select-none",
              "border transition whitespace-nowrap",
              active
                // état sélectionné : halo + bordure verte, fond très léger, texte foncé
                ? "bg-emerald-50 text-slate-900 border-emerald-600 shadow-sm ring-2 ring-emerald-300 ring-offset-2"
                // état normal : fond blanc, bordure grise, texte gris
                : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50",
              // accessibilité focus clavier
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
            ].join(" ")}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
