import { Link } from "react-router-dom";

type FeaturedImage = {
    src: string; alt: string; caption?: string;
};
type FeaturedStoryProps = {
    kicker?: string;
    title: string;
    chapo: string;
    cta?: { label: string; href: string };
    secondary?: FeaturedImage; // optionnel (vignette)
    hero: FeaturedImage;
};

export default function FeaturedStory({
    kicker = "À la une",
    title,
    chapo,
    cta,
    hero,
    secondary,
}: FeaturedStoryProps) {
    return (
        <section className="not-prose app-container app-section-lg">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
                <div>
                    <p className="text-sm font-medium text-emerald-700">{kicker}</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
                    <p className="mt-4 text-slate-700">{chapo}</p>

                    {cta && (
                        <div className="mt-6">
                            <Link
                                to={cta.href}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2
                           font-medium text-white no-underline hover:bg-emerald-700
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-emerald-600 focus-visible:ring-offset-2
                           !text-white visited:!text-white hover:!text-white active:!text-white"
                            >
                                {cta.label}
                            </Link>
                        </div>
                    )}
                </div>

                <figure className="justify-self-end">
                    <img src={hero.src} alt={hero.alt} className="w-full max-w-[720px] rounded-xl border shadow-sm" loading="lazy" />
                    {hero.caption && <figcaption className="mt-2 text-sm text-slate-600">{hero.caption}</figcaption>}
                </figure>
            </div>

            {secondary && (
                <div className="mt-8">
                    <img src={secondary.src} alt={secondary.alt} className="w-full rounded-xl border shadow-sm" loading="lazy" />
                </div>
            )}
        </section>
    );
}