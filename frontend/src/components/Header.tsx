import { Link, useLocation } from "react-router-dom";
//useLocation : donne l’URL courante (pathname) pour savoir quel onglet est “actif”.
import { useState } from "react";
import { NAV } from "@/routes/nav.config";
import Submenu from "./Submenu";

export default function Header() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { pathname } = useLocation();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-6">
        <Link to="/" className="font-semibold text-emerald-700">EcoStay</Link>

        <nav className="hidden md:flex items-center gap-2 relative">
          {NAV.map((item, idx) => (
            <div
              key={item.label}
              onMouseEnter={() => setOpenIdx(idx)}
              onMouseLeave={() => setOpenIdx(null)}
              className="relative"
            >
              <Link
                to={item.path}
                className={`px-3 py-2 rounded hover:bg-slate-100 ${
                  pathname.startsWith(item.path) ? "text-emerald-700 font-medium" : ""
                }`}
              >
                {item.label}
              </Link>
              {!!item.children && openIdx === idx && (
                <Submenu items={item.children} onClose={() => setOpenIdx(null)} />
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto">
          <Link
            to="/decouverte/dormir-autrement"
            className="rounded-xl px-4 py-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          >
            Réservez votre séjour
          </Link>
        </div>
      </div>
    </header>
  );
}
