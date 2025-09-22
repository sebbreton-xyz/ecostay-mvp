// src/components/Header.tsx
import { Link, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { NAV } from "@/routes/nav.config";
import Submenu from "./Submenu";
import logo from "@/assets/Logo.png";

export default function Header() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { pathname } = useLocation();

  // Timer pour fermeture douce quand on sort de TOUTE la nav (pas item par item)
  const closeTimer = useRef<number | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenIdx(null), 160);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="app-container h-14 md:h-16 flex items-center justify-between gap-4">
        {/* Logo Verdo cliquable */}
        <Link to="/" className="shrink-0 inline-flex items-center" aria-label="Verdo — Accueil">
          <img src={logo} alt="" className="h-8 md:h-9 w-auto" />
        </Link>

        {/* Nav centrée : pastilles vertes + sous-menus */}
        <nav
          className="relative hidden md:flex flex-1 items-center justify-center gap-2"
          onMouseEnter={cancelClose}   // tant qu'on est dans la nav, on annule la fermeture
          onMouseLeave={scheduleClose} // on ferme uniquement en sortant de la nav
        >
          {NAV.map((item, idx) => {
            const active = pathname.startsWith(item.path);
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenIdx(idx)} // ouvrir au survol
              >
                <Link
                  to={item.path}
                  className={[
                    "inline-flex items-center rounded-full px-3 md:px-4 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-emerald-700 text-white"
                      : "bg-emerald-600 text-white hover:bg-emerald-700",
                  ].join(" ")}
                >
                  {item.label}
                </Link>

                {item.children && openIdx === idx && (
                  // Wrapper z-indexé : évite qu'un calque en dessous intercepte les clics
                  <div className="relative z-[60]">
                    <Submenu items={item.children} onClose={() => setOpenIdx(null)} />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* CTA à droite */}
        <Link
          to="/decouverte/dormir-autrement"
          className="inline-flex items-center rounded-full bg-emerald-700 px-4 py-1.5 text-sm text-white shadow-sm hover:bg-emerald-800"
        >
          Réservez votre séjour
        </Link>
      </div>
    </header>
  );
}
