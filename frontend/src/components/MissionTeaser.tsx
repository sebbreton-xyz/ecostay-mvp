import { Link } from "react-router-dom";
import { mission } from "@/content/mission";

export default function MissionTeaser() {
    return (
        <section className="not-prose app-container app-section" aria-labelledby="mission-teaser">
            <div className="rounded-2xl border shadow-sm p-6 bg-white">
                <p className="text-sm font-medium text-emerald-700">{mission.kicker}</p>
                <h2 id="mission-teaser" className="mt-1 text-2xl font-semibold tracking-tight">
                    {mission.title}
                </h2>
                <p className="mt-3 text-slate-700">{mission.excerpt}</p>

                <ul className="mt-4 grid gap-2 text-slate-700 md:grid-cols-3">
                    {mission.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                            <span aria-hidden className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-600" />
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-6">
                    <Link
                        to={mission.cta.href}
                        className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2
                       font-medium text-white no-underline hover:bg-emerald-700
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-emerald-600 focus-visible:ring-offset-2
                       !text-white visited:!text-white hover:!text-white active:!text-white"
                    >
                        {mission.cta.label}
                    </Link>
                </div>
            </div>
        </section>
    );
}
