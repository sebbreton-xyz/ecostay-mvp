// src/components/Submenu.tsx
import { Link, useNavigate } from "react-router-dom"; // ⬅️ ajout useNavigate

export default function Submenu({
  items,
  onClose,
}: {
  items: { label: string; path: string }[];
  onClose?: () => void;
}) {
  const navigate = useNavigate(); // ⬅️ init navigate

  return (
    <div className="absolute left-0 top-full mt-2 w-[560px] rounded-xl border bg-white shadow-lg p-4 grid grid-cols-2 gap-3 z-50">
      {items.map((it) => (
        <Link
          key={it.path}
          to={it.path}
          onClick={(e) => {
            // Empêche le Link de gérer la nav tout de suite
            e.preventDefault();
            // Ferme le menu
            onClose?.();
            // Puis navigue au tick suivant (le DOM peut se démonter sans bloquer la nav)
            setTimeout(() => navigate(it.path), 0);
          }}
          className="block rounded-lg border border-emerald-600/60 px-3 py-6 text-center text-emerald-700 hover:bg-emerald-50"
        >
          {it.label}
        </Link>
      ))}
    </div>
  );
}
