// src/pages/decouverte/DormirAutrement.tsx
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StayMap from "@/components/StayMap";
import StayCard from "@/components/StayCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useCategories } from "@/hooks/useCategories";
import { useStaysSearch } from "@/hooks/useStaysSearch";
import type { Stay } from "@/types/stay";

type ViewMode = "list" | "map";

function stayHasAnyCategory(stay: Stay, selected: number[]) {
  if (!selected.length) return true;
  const cat = (stay as any).category;
  if (!cat) return false;
  const catId = typeof cat === "number" ? cat : cat.id;
  return selected.includes(catId);
}

// Normalisation alignée backend (accents, élisions, apostrophes, tirets)
const normalizeQuery = (s: string) =>
  s
    ?.normalize("NFD").replace(/\p{Diacritic}/gu, "")
    ?.replace(/\bqu'\s*/gi, "")
    ?.replace(/\b[ldjtnsmc]'\s*/gi, "")
    ?.replace(/[’'`]\s*/g, "")
    ?.replace(/[—–-]/g, " ")
    ?.toLowerCase()
    ?.trim()
    ?.replace(/\s+/g, " ") || undefined;

export default function DormirAutrement() {
  // -------- URL params (pré-remplissage au premier rendu) --------
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialCategorySlug = searchParams.get("category") ?? "";
  const categoryUrlAppliedRef = useRef(false); // ← empêche de re-forcer la catégorie depuis l'URL

  // -------- Filtres (UI) --------
  const [query, setQuery] = useState<string>(initialQ);
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [ordering, setOrdering] = useState<string>("-created_at");
  const [view, setView] = useState<ViewMode>("map");
  const [onlyWithCoords, setOnlyWithCoords] = useState(true);

  const { data: categories = [] } = useCategories();

  // Quand les catégories arrivent, mappe le slug -> id une seule fois
  useEffect(() => {
    if (
      categoryUrlAppliedRef.current ||           // déjà appliqué
      !initialCategorySlug ||                    // pas de slug initial
      !categories.length ||                      // pas encore les catégories
      selectedCats.length                        // déjà une sélection manuelle
    ) return;

    const match = (categories as any).find((c: any) => c.slug === initialCategorySlug);
    if (match) {
      setSelectedCats([match.id]);
      categoryUrlAppliedRef.current = true;
    }
  }, [categories, initialCategorySlug, selectedCats.length]);

  const selectedSlug =
    categories.find((c: any) => c.id === selectedCats[0])?.slug ?? undefined;

  // -------- Sync URL (sans retomber sur le slug initial) --------
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    let changed = false;

    // q
    const qNorm = query ? normalizeQuery(query) : "";
    if (qNorm) {
      if (next.get("q") !== qNorm) { next.set("q", qNorm); changed = true; }
    } else if (next.has("q")) { next.delete("q"); changed = true; }

    // category : reflète UNIQUEMENT l'état courant (selectedSlug)
    if (selectedSlug) {
      if (next.get("category") !== selectedSlug) { next.set("category", selectedSlug); changed = true; }
    } else if (next.has("category")) { next.delete("category"); changed = true; }

    if (changed) setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedSlug]);

  // -------- Requête API --------
  const { data = [], isLoading, isError, error, refetch, isFetching } =
    useStaysSearch({
      q: normalizeQuery(query),
      city: city || undefined,
      category: selectedSlug, // filtre seulement si on a un slug courant
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      has_coords: onlyWithCoords ? "true" : undefined,
      ordering: ordering as any,
    });

  // -------- Sélection / scroll sync --------
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const lastOriginRef = useRef<"map" | "list" | null>(null);
  const selectFromMap = (id: number) => { lastOriginRef.current = "map"; setSelectedId(id); };
  const selectFromList = (id: number) => { lastOriginRef.current = "list"; setSelectedId(id); };

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  useEffect(() => {
    if (!selectedId || lastOriginRef.current !== "map") return;
    const el = cardRefs.current[selectedId];
    if (el && view === "list") el.scrollIntoView({ block: "center", behavior: "smooth" });
    lastOriginRef.current = null;
  }, [selectedId, view]);

  // -------- Filtre client (multi-cat UI → single-select logique) --------
  const filtered = useMemo(
    () => data.filter((s) => stayHasAnyCategory(s, selectedCats)),
    [data, selectedCats]
  );
  const count = filtered.length;

  // Toggle single-select avec désélection si on reclique la même étiquette
  const toggleCat = (id: number) => {
    setSelectedCats((cur) => (cur[0] === id ? [] : [id]));
    setSelectedId(null);
  };

  // -------- Carte carrée (liste = même hauteur) --------
  const mapBoxRef = useRef<HTMLDivElement | null>(null);

  // Hauteur de secours pour le 1er rendu (~70vh, bornée)
  const [mapHeight, setMapHeight] = useState<number>(() => {
    if (typeof window === "undefined") return 480;
    const h = Math.min(window.innerHeight * 0.7, 900);
    return Math.max(360, Math.floor(h));
  });

  // Mesure la hauteur réelle du conteneur carte après layout
  useLayoutEffect(() => {
    const el = mapBoxRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const h = Math.floor(e.contentRect.height);
        if (h > 0) setMapHeight(h);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);


  // -------- Pagination (vue liste) --------
  const [pageSize, setPageSize] = useState<number>(12); // 8,10,12,20,50,100
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setPage(1);
  }, [query, city, selectedSlug, minPrice, maxPrice, onlyWithCoords]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, pageSize, view]);

  // ----------------------------------------------------------------

  return (
    <>
      <section className="mx-auto w-full max-w-screen-2xl px-6 pt-4 pb-2">
        <h1 className="text-2xl font-semibold">Dormir autrement</h1>
        <p className="text-slate-600">
          Séjours éco-responsables, authentiques et ancrés dans le local.
        </p>
      </section>

      {/* Barre de recherche + filtres (collée à l’API) */}
      <section className="mx-auto w-full max-w-screen-2xl px-6">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher (titre, ville)…"
              className="w-full rounded-xl border px-4 py-2"
              aria-label="Rechercher un séjour"
            />
          </div>
          <div className="md:col-span-3">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ville exacte (ex. Sarlat)…"
              className="w-full rounded-xl border px-4 py-2"
              aria-label="Ville"
            />
          </div>
          <div className="md:col-span-3 grid grid-cols-2 gap-2">
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Prix min"
              className="w-full rounded-xl border px-3 py-2"
              aria-label="Prix minimum"
            />
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Prix max"
              className="w-full rounded-xl border px-3 py-2"
              aria-label="Prix maximum"
            />
          </div>
          <div className="md:col-span-2">
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
              aria-label="Trier par"
            >
              <option value="-created_at">Les plus récents</option>
              <option value="price">Prix croissant</option>
              <option value="-price">Prix décroissant</option>
              <option value="title">Titre A→Z</option>
              <option value="-title">Titre Z→A</option>
            </select>
          </div>
        </div>

        {/* Catégories (chips) */}
        <div className="mt-3">
          <CategoryFilter
            categories={categories}
            selectedIds={selectedCats}
            onToggle={toggleCat}
          />
        </div>

        {/* Barre options carte */}
        <div className="mt-2 flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyWithCoords}
              onChange={(e) => setOnlyWithCoords(e.target.checked)}
            />
            <span>Uniquement les séjours géolocalisés</span>
          </label>
        </div>

        {/* État chargement/erreur */}
        {isLoading && <p className="mt-2 text-slate-600">Chargement…</p>}
        {isError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Impossible de charger les séjours.</p>
            <p className="text-sm opacity-80">Détail : {error?.message}</p>
            <button className="mt-3 rounded-lg border px-3 py-1 text-sm" onClick={() => refetch()}>
              Réessayer
            </button>
          </div>
        )}
      </section>

      {/* Résultats */}
      {!isLoading && !isError && (
        <section className="mx-auto w-full max-w-screen-2xl px-6 pb-10">
          {/* header résultats + toggle Liste/Carte */}
          <div className="mt-3 mb-2 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-baseline gap-3">
              <h2 className="text-lg md:text-xl font-semibold">Résultats</h2>
              <span className="text-sm text-slate-600">
                {isFetching ? "Mise à jour…" : `${count} séjours`}
              </span>
            </div>

            <div className="inline-flex rounded-lg border p-1">
              {(["list", "map"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-sm rounded-md ${view === v ? "bg-slate-900 text-white" : "text-slate-700"
                    }`}
                  aria-pressed={view === v}
                >
                  {v === "list" ? "Liste" : "Carte"}
                </button>
              ))}
            </div>
          </div>

          {/* VUE LISTE (pleine largeur, paginée) */}
          {view === "list" && (
            <>
              <div className="mb-3 flex items-center justify-end gap-2">
                <label className="text-sm text-slate-600">Par page</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border px-2 py-1 text-sm"
                >
                  {[8, 10, 12, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {count === 0 ? (
                <div className="h-[360px] w-full rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center text-slate-500">
                  Aucun séjour pour ces filtres.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pageItems.map((stay) => (
                      <StayCard
                        key={stay.id}
                        stay={stay}
                        isActive={selectedId === stay.id}
                      />
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
                    >
                      Précédent
                    </button>
                    <span className="text-sm text-slate-600">
                      Page {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
                    >
                      Suivant
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {view === "map" && (
            <div className="md:grid md:grid-cols-[minmax(360px,520px)_1fr] md:gap-4">
              {/* LISTE — même hauteur que la carte + scroll interne */}
              <div
                className={[
                  "min-h-0",                  // indispensable en grid pour autoriser le scroll
                  "overscroll-contain",       // évite de “voler” la molette à la page/carte
                  "overflow-y-auto",          // toujours scrollable
                  "pr-2 -mr-2",               // compense la scrollbar
                  "rounded-xl border bg-white/60 backdrop-blur-sm",
                  "scrollbar-stable", 
                ].join(" ")}
                style={{
                  height: mapHeight,          // == hauteur du carré carte
                  maxHeight: mapHeight,
                }}
              >
                <div className="space-y-3 p-3">
                  {filtered.map((stay) => (
                    <div
                      key={stay.id}
                      ref={(el) => { cardRefs.current[stay.id] = el; }}
                      onClick={() => selectFromList(stay.id)}
                    >
                      <StayCard stay={stay} isActive={selectedId === stay.id} />
                    </div>
                  ))}
                </div>
              </div>

              {/* CARTE — sticky + carrée */}
              <div className="md:sticky md:top-[140px] mt-3 md:mt-0">
                <div ref={mapBoxRef} className="relative w-full aspect-square rounded-xl overflow-hidden border">
                  <div className="absolute inset-0">
                    <StayMap
                      stays={filtered}
                      selectedId={selectedId}
                      onMarkerClick={selectFromMap}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}


        </section>
      )}
    </>
  );
}
