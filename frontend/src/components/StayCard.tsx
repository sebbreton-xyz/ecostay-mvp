// src/components/StayCard.tsx
import type { Stay } from "@/types/stay";
import yourteImg from "@/assets/Yourte.jpg";

type Props = {
  stay: Stay;
  onClick?: () => void;
  isActive?: boolean;
};

function formatPrice(price: Stay["price"]) {
  if (price == null) return "—";
  const n = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(n)) return String(price);
  return `${n.toFixed(2)} €`;
}

export default function StayCard({ stay, onClick, isActive }: Props) {
  const title = (stay as any).title ?? (stay as any).name ?? "Séjour";
  const isDemo =
    (stay as any).is_demo === true || String(title).startsWith("[DEMO]");

  return (
    <article
      className={[
        "rounded-2xl border bg-white transition shadow-sm",
        onClick ? "cursor-pointer hover:shadow" : "cursor-default hover:shadow",
        isActive ? "ring-2 ring-emerald-500 ring-offset-2" : "",
      ].join(" ")}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      aria-pressed={!!isActive}
    >
      {/* Layout : contenu | image (image visible ≥ md) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3 md:gap-4 p-4">
        {/* Colonne contenu */}
        <div>
          <header className="mb-2">
            <h3 className="text-lg font-semibold leading-tight flex items-center gap-2">
              <span>{title}</span>
              {isDemo && (
                <span
                  className="inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] uppercase tracking-wide text-emerald-700 border-emerald-600/50 bg-emerald-50"
                  aria-label="Séjour de démonstration"
                  title="Séjour de démonstration"
                >
                  Démo
                </span>
              )}
            </h3>
            <p className="text-sm text-slate-500">
              {stay.city ?? "Ville inconnue"}
            </p>
          </header>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              <span className="text-slate-500">Tarif :</span>{" "}
              {formatPrice(stay.price)} / nuit
            </div>
          </div>

          {stay.created_at && (
            <p className="mt-2 text-xs text-slate-400">
              Publié le{" "}
              {new Date(stay.created_at).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>

        {/* Colonne image — forcée pour toutes les cards */}
        <div className="hidden md:block">
          <div className="relative h-full min-h-[110px] rounded-lg overflow-hidden">
            <img
              src={yourteImg}
              alt="Illustration du séjour"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
