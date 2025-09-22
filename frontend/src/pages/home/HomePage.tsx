// src/pages/home/HomePage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStays } from "@/hooks/useStays";
import { useCategories } from "@/hooks/useCategories";
import StayCard from "@/components/StayCard";
import FeaturedStory from "@/components/FeaturedStory";
import MissionTeaser from "@/components/MissionTeaser";
import logo from "@/assets/Logo.png";
import favicon from "@/assets/Favicon.png";
import campagne from "@/assets/Campagne.jpg";
// NEW: brancher la Home sur la même source éditoriale
import { getFeaturedLocalStory } from "@/content/localStories";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: stays = [], isLoading } = useStays();
  const { data: categories = [], isLoading: loadingCats } = useCategories();
  const topCats = categories.slice(0, 16);
  const [query, setQuery] = useState("");

  // même normalisation que /DormirAutrement + backend
  const normalizeQuery = (s: string) =>
    s
      ?.normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      ?.replace(/\bqu'\s*/gi, "")
      ?.replace(/\b[ldjtnsmc]'\s*/gi, "")
      ?.replace(/[’'`]\s*/g, "")
      ?.replace(/[—–-]/g, " ")
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s+/g, " ") || undefined;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = query.trim();
    const q = normalizeQuery(raw);
    const params = new URLSearchParams();
    if (q) params.set("q", q);

    const compact = raw.replace(/\s+/g, "");
    if (/^\d{5}$/.test(compact)) params.set("postal_code", compact);
    else if (/^(?:\d{2}|2a|2b)$/i.test(compact))
      params.set("department", compact.toUpperCase());

    navigate(`/decouverte/dormir-autrement?${params.toString()}`);
  };

  const highlights = stays.slice(0, 6);

  // NEW: récupère l'article à la une depuis la même source que "Expériences locales"
  const featured = getFeaturedLocalStory();

  return (
    <>
      {/* ===== HERO full-bleed (haut carré, bas arrondi) ===== */}
      <section className="relative">
        {/* bande pleine largeur */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          {/* conteneur visuel */}
          <div className="relative min-h-[270px] md:h-[39vh] overflow-hidden border-y md:rounded-b-3xl">
            {/* image entière, collée en haut */}
            <img
              src={campagne}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top bg-gradient-to-b from-emerald-50 to-sky-50"
            />

            {/* Logo en haut à gauche */}
            <Link
              to="/"
              className="absolute z-20 top-0 left-2 sm:top-1 sm:left-3 md:top-2 md:left-6
             w-1/4 sm:w-1/5 md:w-1/5 lg:w-1/6
             max-w-[360px] min-w-[96px]"
            >
              <img src={logo} alt="EcoStay" className="w-full h-auto" />
            </Link>

            {/* Décor : Favicon géant à droite */}
            <img
              src={favicon}
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 hidden sm:block z-20 h-[58%] sm:h-[64%] md:h-[78%] lg:h-[85%] w-auto opacity-90 drop-shadow-xl"
            />

            {/* voile de lisibilité sur la moitié basse */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-white/75" />

            {/* grille 2 rangées : contenu bas + chips tout en bas */}
            <div className="absolute inset-0 grid grid-rows-[1fr_auto]">
              {/* rangée 1 : bloc titre+recherche */}
              <div className="flex items-end justify-center px-6">
                <div className="w-full max-w-3xl text-center pb-4 md:pb-6 relative -translate-y-4 md:-translate-y-8">
                  <div className="flex flex-col items-center justify-between min-h-[160px] md:min-h-[190px] lg:min-h-[210px]">
                    <h1 className="text-slate-900 text-2xl md:text-4xl font-semibold">
                      La référence du séjour alternatif
                    </h1>
                    <p className="text-sm md:text-base text-slate-700">
                      <span className="baseline-shimmer">Prêt·e à partir ? Voyagez autrement.</span>
                    </p>
                    <form onSubmit={onSubmit} className="w-full flex gap-2">
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Titre, ville, code postal, département…"
                        aria-label="Rechercher un séjour"
                        className="w-full rounded-xl border bg-white px-4 py-2 text-slate-900 placeholder:text-slate-500"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
                      >
                        Explorer
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* rangée 2 : étiquettes collées en bas */}
              <div className="px-4 md:px-8 pb-3">
                <div className="mx-auto max-w-screen-2xl">
                  <div className="flex gap-2 overflow-x-auto md:flex-wrap md:justify-center md:overflow-visible">
                    {(loadingCats ? [] : topCats).map((c: any) => (
                      <Link
                        key={c.id}
                        to={`/decouverte/dormir-autrement?category=${encodeURIComponent(c.slug)}`}
                        className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm bg-white text-slate-800 shadow-xl ring-1 ring-black/5 backdrop-blur hover:-translate-y-0.5 transition"
                      >
                        {c.name_fr || c.name_en || c.slug}
                      </Link>
                    ))}
                    {!loadingCats && topCats.length === 0 && (
                      <span className="rounded-full px-3 py-1.5 text-sm bg-white/70 text-slate-500 ring-1 ring-black/5">
                        Catégories bientôt disponibles
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* espace sous le hero */}
        <div className="h-6 md:h-8" />
      </section>

      {/* ===== Séjours à la une ===== */}
      <section className="mx-auto w-full max-w-screen-2xl px-6 mt-2">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold">Séjours à la une</h2>
          <Link to="/decouverte/dormir-autrement" className="text-sm text-emerald-700 hover:underline">
            Voir tous les séjours
          </Link>
        </div>

        {isLoading ? (
          <p className="text-slate-600">Chargement…</p>
        ) : highlights.length === 0 ? (
          <div className="rounded-xl bg-slate-100 p-6 text-slate-600">Bientôt des séjours ici !</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        )}
      </section>

      {/* ===== Édito & Mission ===== */}
      <FeaturedStory
        kicker={featured.kicker ?? "À la une"}
        title={featured.title}
        chapo={featured.chapo}
        cta={featured.cta}
        hero={featured.hero}
        secondary={featured.secondary}
      />

      <MissionTeaser />

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-xl font-semibold text-emerald-700">Chiffres clés</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "3", d: "piliers (sobriété, local, transparence)" },
            { k: "6", d: "engagements concrets" },
            { k: "2025", d: "déploiement des scores publics" },
            { k: "100%", d: "données sourçables et explicables" },
          ].map(({ k, d }) => (
            <div key={k} className="rounded-xl border p-5 bg-white">
              <div className="text-3xl font-semibold text-emerald-700">{k}</div>
              <div className="text-sm text-slate-600">{d}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
