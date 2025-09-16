// export default function PageHero() {
//   return (
//     <section className="bg-gradient-to-b from-emerald-50 to-transparent">
//       <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-[240px_1fr] gap-6">
//         <a
//           href="/decouverte/dormir-autrement"
//           className="block rounded-xl border px-4 py-6 text-center font-medium hover:bg-emerald-50"
//         >
//           Réservez<br/>votre séjour
//         </a>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           {["Découverte","Impact","Communauté","Mon espace"].map((t,i) => (
//             <a
//               key={t}
//               href={["/decouverte","/impact","/communaute","/mon-espace"][i]}
//               className="rounded-xl border px-3 py-5 text-center hover:bg-slate-50"
//             >
//               {t}
//             </a>
//           ))}
//           <div className="col-span-4">
//             <input
//               placeholder="Rechercher…"
//               className="w-full rounded-xl border px-4 py-2"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
// REMPLACEMENT DES <a> PAR DES <Link> POUR REACT-ROUTER !!! 


// src/components/PageHero.tsx
import { Link } from "react-router-dom";
import * as React from "react";

type PageHeroProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <section className="bg-gradient-to-b from-emerald-50 to-transparent">
      <div className="mx-auto max-w-7xl px-4 py-10 space-y-6">
        {(title || subtitle) && (
          <div>
            {title && <h1 className="text-3xl font-semibold">{title}</h1>}
            {subtitle && (
              <p className="mt-2 text-slate-600">{subtitle}</p>
            )}
            {children && <div className="mt-4">{children}</div>}
          </div>
        )}

        <div className="grid md:grid-cols-[240px_1fr] gap-6">
          <Link
            to="/decouverte/dormir-autrement"
            className="block rounded-xl border px-4 py-6 text-center font-medium hover:bg-emerald-50"
          >
            Réservez<br/>votre séjour
          </Link>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Découverte","Impact","Communauté","Mon espace"].map((t,i) => (
              <Link
                key={t}
                to={["/decouverte","/impact","/communaute","/mon-espace"][i]}
                className="rounded-xl border px-3 py-5 text-center hover:bg-slate-50"
              >
                {t}
              </Link>
            ))}
            <div className="col-span-4">
              <input
                placeholder="Rechercher…"
                className="w-full rounded-xl border px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
