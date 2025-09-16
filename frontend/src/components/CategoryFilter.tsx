// src/components/CategoryFilter.tsx
import type { Category } from "@/types/category";

type Props = {
  categories: Category[];
  selectedIds: number[];
  onToggle: (id: number) => void;
};

export default function CategoryFilter({ categories, selectedIds, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(c => {
        const active = selectedIds.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => onToggle(c.id)}
            className={`px-3 py-1 rounded-full border text-sm ${
              active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white"
            }`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
