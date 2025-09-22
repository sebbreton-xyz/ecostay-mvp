// src/components/Footer.tsx
import { Link } from "react-router-dom";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-12 border-t border-emerald-600 bg-emerald-700 text-white">
            {/* Bande principale */}
            <div className="app-container px-6 py-10">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Marque / pitch */}
                    <div>
                        <h3 className="text-xl font-semibold">Verdo</h3>
                        <p className="mt-2 text-white/80">
                            La référence du séjour alternatif : responsable, authentique et ancré dans le local.
                        </p>
                    </div>

                    {/* Découvrir */}
                    <nav aria-labelledby="footer-discover">
                        <h4 id="footer-discover" className="text-sm font-semibold uppercase tracking-wide text-white/90">
                            Découvrir
                        </h4>
                        <ul className="mt-3 space-y-2 text-white/90">
                            <li><Link to="/decouverte/dormir-autrement" className="hover:underline">Dormir autrement</Link></li>
                            <li><Link to="/impact" className="hover:underline">Impact</Link></li>
                            <li><Link to="/communaute" className="hover:underline">Communauté</Link></li>
                            <li><Link to="/mon-espace" className="hover:underline">Mon espace</Link></li>
                        </ul>
                    </nav>

                    {/* Légal */}
                    <nav aria-labelledby="footer-legal">
                        <h4 id="footer-legal" className="text-sm font-semibold uppercase tracking-wide text-white/90">
                            Légal
                        </h4>
                        <ul className="mt-3 space-y-2 text-white/90">
                            <li><Link to="/mentions-legales" className="hover:underline">Mentions légales</Link></li>
                            <li><Link to="/cgu" className="hover:underline">Conditions d’utilisation</Link></li>
                            <li><Link to="/cgv" className="hover:underline">Conditions de vente</Link></li>
                            <li><Link to="/confidentialite" className="hover:underline">Politique de confidentialité</Link></li>
                            <li><Link to="/cookies" className="hover:underline">Gestion des cookies</Link></li>
                            <li><Link to="/accessibilite" className="hover:underline">Accessibilité</Link></li>
                        </ul>
                    </nav>

                    {/* Contact / Newsletter (placeholder) */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-white/90">
                            Contact
                        </h4>
                        <ul className="mt-3 space-y-2 text-white/90">
                            <li>
                                <a href="mailto:contact@verdo.example" className="hover:underline">
                                    contact@verdo.example
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">Presse</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">Devenir hôte</a>
                            </li>
                        </ul>

                        <form
                            className="mt-5"
                            onSubmit={(e) => {
                                e.preventDefault(); /* placeholder */
                            }}
                        >
                            <label htmlFor="nl" className="sr-only">Votre e-mail</label>
                            <div className="flex gap-2">
                                <input
                                    id="nl"
                                    type="email"
                                    placeholder="Votre e-mail"
                                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="rounded-lg bg-white/95 px-3 py-2 text-emerald-800 hover:bg-white"
                                >
                                    S’abonner
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-white/70">
                                En vous inscrivant, vous acceptez notre{" "}
                                <Link to="/confidentialite" className="underline">
                                    politique de confidentialité
                                </Link>.
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Barre basse */}
            <div className="border-t border-white/15">
                <div className="app-container px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-white/80">© {year} Verdo — Tous droits réservés.</p>
                    <div className="flex items-center gap-4 text-white/80">
                        <a href="#" aria-label="Instagram" className="hover:text-white">Instagram</a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-white">LinkedIn</a>
                        <a href="#" aria-label="X / Twitter" className="hover:text-white">X</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
