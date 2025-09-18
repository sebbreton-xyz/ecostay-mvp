// src/components/PageHero.tsx
import { Link } from "react-router-dom";
import * as React from "react";
import VerdoLogo from "@/assets/Logo.png";
import Campagne from "@/assets/Campagne.jpg";


type PageHeroProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function PageHero({ title, subtitle, children }: PageHeroProps) {
  // Hauteur commune logo / illustration
  const blockHeights = "h-32 md:h-48 lg:h-60";

  return (
    <section className="bg-gradient-to-b from-emerald-50/60 to-transparent">
      <div className="mx-auto w-full max-w-screen-2xl px-6 py-8 space-y-6">
        {/* Bandeau : Logo + Illustration, même hauteur */}
        <div className="grid grid-cols-12 gap-4">
          {/* Colonne gauche : logo + CTA, contenus dans la même hauteur */}
          <div className="col-span-12 md:col-span-3">
            <div className={`${blockHeights} grid grid-rows-[1fr_auto]`}>
              {/* Logo en haut, légèrement remonté, cadré dans sa cellule */}
              <div className="overflow-hidden flex items-start">
                <img
                  src={VerdoLogo}
                  alt="Verdo"
                  className="h-full w-auto object-contain"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget.parentElement as HTMLElement).innerHTML =
                      '<span class="text-3xl md:text-4xl font-semibold text-emerald-700">Verdo</span>';
                  }}
                />
              </div>

              {/* CTA en bas, contenu dans la hauteur → plus de débordement */}
              <div className="pt-2">
                <div className="text-[13px] uppercase tracking-wide text-emerald-700/80 mb-1">
                  Prêt·e à partir ?
                </div>
                <Link
                  to="/decouverte/dormir-autrement"
                  className="inline-block rounded-xl border px-4 py-2 font-medium
                           text-emerald-700 border-emerald-600 hover:bg-emerald-50"
                >
                  Réservez votre séjour
                </Link>
              </div>
            </div>
          </div>

          {/* Colonne droite : Illustration (même hauteur) */}
          {/* Colonne droite : Illustration (même hauteur) */}
          <div className="col-span-12 md:col-span-9">
            <div className={`${blockHeights} rounded-2xl overflow-hidden border border-emerald-300/40 shadow-sm`}>
              <img
                src={Campagne}
                alt="Paysage de campagne"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

        </div>

        {(title || subtitle || children) && (
          <div>
            {title && <h1 className="text-3xl font-semibold">{title}</h1>}
            {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
            {children && <div className="mt-4">{children}</div>}
          </div>
        )}

        {/* Les 4 onglets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Découverte", path: "/decouverte" },
            { label: "Impact", path: "/impact" },
            { label: "Communauté", path: "/communaute" },
            { label: "Mon espace", path: "/mon-espace" },
          ].map((it) => (
            <Link
              key={it.path}
              to={it.path}
              className="rounded-xl border px-3 py-5 text-center hover:bg-slate-50"
            >
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );


}
