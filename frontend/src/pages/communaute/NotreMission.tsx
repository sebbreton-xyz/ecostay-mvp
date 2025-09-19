// src/pages/communaute/NotreMission.tsx
import { mission } from "@/content/mission";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function NotreMission() {
  // (optionnel) titre de page
  useEffect(() => {
    document.title = `${mission.title} — EcoStay`;
  }, []);

  return (
    <>
      {/* HERO — piloté par src/content/mission.ts */}
      <section className="not-prose relative isolate h-[48vh] min-h-[320px] overflow-clip">
        {mission.hero?.src && (
          <img
            src={mission.hero.src}
            alt={mission.hero.alt ?? ""}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover md:object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/0" />

        {/* Conteneur texte du hero */}
        <div className="app-container relative h-full flex flex-col justify-end pb-10">
          <p className="text-sm font-medium text-emerald-300">{mission.kicker}</p>
          <h1 className="mt-1 text-4xl font-semibold text-white">{mission.title}</h1>
          <p className="mt-2 max-w-2xl text-white/90">{mission.excerpt}</p>

          <div className="mt-4">
            <Link
              to="/communaute" // ⚠️ crée la route /communaute ou change la cible si besoin
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2
                         font-medium !text-white no-underline hover:bg-emerald-700
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              Rejoindre la communauté
            </Link>
          </div>
        </div>
      </section>

      {/* Contenu long */}
      <main className="app-container app-section">
        <article
          className="
      prose prose-slate max-w-none
      prose-headings:font-semibold prose-headings:text-slate-900
      prose-a:text-emerald-700 hover:prose-a:text-emerald-800 prose-a:underline prose-a:underline-offset-4
      prose-strong:text-slate-900
      prose-img:rounded-xl prose-figcaption:text-sm prose-figcaption:text-slate-500
    "
        >
          {/* ton contenu long */}
        </article>
      </main>

    </>
  );
}
