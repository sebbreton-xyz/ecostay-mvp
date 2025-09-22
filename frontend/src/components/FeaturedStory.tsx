import { Link } from "react-router-dom";

type FeaturedImage = { src: string; alt: string; caption?: string };
type FeaturedStoryProps = {
    kicker?: string;
    title: string;
    chapo: string;
    cta?: { label: string; href: string };
    secondary?: FeaturedImage;
    hero: FeaturedImage;
    /** NEW: "wide" (par défaut) = image large, "side" = texte gauche / image droite */
    layout?: "wide" | "side";
};

export default function FeaturedStory({
    kicker = "À la une",
    title,
    chapo,
    cta,
    secondary,
    hero,
    layout = "wide",
}: FeaturedStoryProps) {
    if (layout === "side") {
        return (
            <section className="app-container app-section">
                <div className="grid gap-8 md:grid-cols-2 items-start">
                    {/* IMAGE à droite sur desktop, au-dessus sur mobile */}
                    <figure className="order-1 md:order-2 md:justify-self-end">
                        <img
                            src={hero.src}
                            alt={hero.alt}
                            className="w-full max-h-[480px] object-cover rounded-xl border shadow-sm"
                            loading="lazy"
                        />
                        {hero.caption && (
                            <figcaption className="mt-2 text-sm text-slate-600">{hero.caption}</figcaption>
                        )}
                    </figure>

                    {/* TEXTE à gauche */}
                    <div className="order-2 md:order-1 max-w-2xl">
                        {kicker && <p className="text-sm font-medium text-emerald-700">{kicker}</p>}
                        <h2 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
                        <p className="mt-3 text-slate-700">{chapo}</p>

                        {cta && (
                            <div className="mt-5">
                                <Link
                                    to={cta.href}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2
                  font-medium text-white no-underline hover:bg-emerald-700
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-emerald-600 focus-visible:ring-offset-2
                  visited:text-white"
                                >
                                    {cta.label}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Optionnel : image secondaire en-dessous */}
                {secondary && (
                    <div className="mt-8">
                        <img
                            src={secondary.src}
                            alt={secondary.alt}
                            className="w-full rounded-xl border shadow-sm"
                            loading="lazy"
                        />
                        {secondary.caption && (
                            <p className="mt-2 text-sm text-slate-600">{secondary.caption}</p>
                        )}
                    </div>
                )}
            </section>
        );
    }

    // ====== fallback "wide" (comportement actuel) ======
    return (
        <section className="app-container app-section">
            <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] items-start">
                <div className="max-w-2xl">
                    {kicker && <p className="text-sm font-medium text-emerald-700">{kicker}</p>}
                    <h2 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
                    <p className="mt-3 text-slate-700">{chapo}</p>
                    {cta && (
                        <div className="mt-5">
                            <Link
                                to={cta.href}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2
                font-medium text-white no-underline hover:bg-emerald-700
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-emerald-600 focus-visible:ring-offset-2
                visited:text-white"
                            >
                                {cta.label}
                            </Link>
                        </div>
                    )}
                </div>

                <figure className="justify-self-end">
                    <img
                        src={hero.src}
                        alt={hero.alt}
                        className="w-full max-w-[720px] rounded-xl border shadow-sm"
                        loading="lazy"
                    />
                    {hero.caption && (
                        <figcaption className="mt-2 text-sm text-slate-600">{hero.caption}</figcaption>
                    )}
                </figure>
            </div>

            {secondary && (
                <div className="mt-8">
                    <img
                        src={secondary.src}
                        alt={secondary.alt}
                        className="w-full rounded-xl border shadow-sm"
                        loading="lazy"
                    />
                    {secondary.caption && (
                        <p className="mt-2 text-sm text-slate-600">{secondary.caption}</p>
                    )}
                </div>
            )}
        </section>
    );
}
