import type { Stay } from "@/types/stay";

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

  return (
    <article
      className={[
        "rounded-2xl border bg-white p-4 shadow-sm transition cursor-default",
        isActive ? "ring-2 ring-emerald-500 ring-offset-2" : "hover:shadow",
      ].join(" ")}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      aria-pressed={!!isActive}
    >
      <header className="mb-2">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <p className="text-sm text-slate-500">{stay.city ?? "Ville inconnue"}</p>
      </header>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          <span className="text-slate-500">Tarif :</span> {formatPrice(stay.price)} / nuit
        </div>
      </div>

      {stay.created_at && (
        <p className="mt-2 text-xs text-slate-400">
          Publié le {new Date(stay.created_at).toLocaleDateString("fr-FR")}
        </p>
      )}
    </article>
  );
}
