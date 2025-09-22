import { useParams, Link } from "react-router-dom";
import { getStoryBySlug } from "@/content/localStories";

function BlockRenderer({ type, ...rest }: any) {
    switch (type) {
        case "h3":
            return <h3 className="mt-10 text-xl font-semibold">{rest.text}</h3>;
        case "p":
            return <p className="mt-4">{rest.text}</p>;
        case "ul":
            return (
                <ul className="mt-4 list-disc pl-6">
                    {rest.items.map((it: string) => (
                        <li key={it}>{it}</li>
                    ))}
                </ul>
            );
        case "quote":
            return (
                <blockquote className="mt-6 border-l-4 pl-4 italic text-slate-600">{rest.text}</blockquote>
            );
        case "img":
            return (
                <figure className="mt-6">
                    <img
                        src={rest.image.src}
                        alt={rest.image.alt}
                        className="rounded-xl border shadow-sm"
                    />
                    {rest.image.caption && (
                        <figcaption className="mt-2 text-sm text-slate-500">
                            {rest.image.caption}
                        </figcaption>
                    )}
                </figure>
            );
        default:
            return null;
    }
}

export default function ExperienceArticle() {
    const { slug } = useParams();
    const story = slug ? getStoryBySlug(slug) : null;

    if (!story) {
        return (
            <div className="app-container py-10">
                <p>
                    Article introuvable.{" "}
                    <Link to="/decouverte/experiences-locales" className="text-emerald-700 underline">
                        Retour
                    </Link>
                </p>
            </div>
        );
    }

    const dateFR = new Date(story.date).toLocaleDateString("fr-FR");
    const meta =
        (dateFR ? `Publié le ${dateFR}` : "") +
        (story.tags?.length ? ` · ${story.tags.join(" · ")}` : "");

    return (
        <article className="app-container app-section-lg">
            {/* ===== HEADER : texte gauche / image droite ===== */}
            <div className="grid gap-8 md:grid-cols-2 items-start">
                <header className="max-w-2xl">
                    {story.kicker && (
                        <p className="text-sm font-medium text-emerald-700">{story.kicker}</p>
                    )}
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight">{story.title}</h1>
                    <p className="mt-3 text-slate-700">{story.chapo}</p>
                    <div className="mt-2 text-sm text-slate-500">{meta}</div>
                </header>

                <figure className="md:justify-self-end">
                    <img
                        src={story.hero.src}
                        alt={story.hero.alt}
                        className="w-full max-h-[480px] object-cover rounded-xl border shadow-sm"
                    />
                    {story.hero.caption && (
                        <figcaption className="mt-2 text-sm text-slate-600">
                            {story.hero.caption}
                        </figcaption>
                    )}
                </figure>
            </div>

            {/* ===== CONTENU ===== */}
            {story.secondary && (
                <figure className="mt-8">
                    <img
                        src={story.secondary.src}
                        alt={story.secondary.alt}
                        className="w-full rounded-xl border shadow-sm"
                        loading="lazy"
                    />
                    {story.secondary.caption && (
                        <figcaption className="mt-2 text-sm text-slate-600">
                            {story.secondary.caption}
                        </figcaption>
                    )}
                </figure>
            )}

            <div className="prose prose-slate mt-8 max-w-none">
                {story.blocks.map((b, i) => (
                    <BlockRenderer key={i} {...b} />
                ))}
            </div>

            <div className="mt-10">
                <Link to="/decouverte/experiences-locales" className="text-emerald-700 underline">
                    ← Retour aux expériences locales
                </Link>
            </div>
        </article>
    );
}
