// src/pages/decouverte/ExperiencesLocales.tsx
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import FeaturedStory from "@/components/FeaturedStory";
import { getFeaturedLocalStory, getArchiveStories } from "@/content/localStories";

export default function ExperiencesLocales() {
  const featured = getFeaturedLocalStory();
  const archive = getArchiveStories();

  return (
    <>
      <PageHero
        title="Expériences locales"
        subtitle="Des micro-aventures écoresponsables, à vivre près de chez vous."
      />

      {/* À la une */}
      <FeaturedStory
        layout="side"
        kicker={featured.kicker ?? "À la une"}
        title={featured.title}
        chapo={featured.chapo}
        cta={featured.cta}
        hero={featured.hero}
        secondary={featured.secondary}
      />

      {/* Archive */}
      <section className="app-container app-section">
        <h2 className="text-xl font-semibold">Dernières expériences</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {archive.map((a) => (
            <article key={a.slug} className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <Link to={`/decouverte/experiences-locales/${a.slug}`}>
                <img src={a.hero.src} alt={a.hero.alt} className="h-44 w-full object-cover" loading="lazy" />
                <div className="p-4">
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="mt-1 line-clamp-3 text-slate-700">{a.chapo}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(a.date).toLocaleDateString("fr-FR")}
                    {a.tags?.length ? <> · {a.tags.join(" · ")}</> : null}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
