// src/layouts/MainLayout.tsx
import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BgImage from "@/assets/Ciel.jpg";

export default function MainLayout() {
  return (
    // Calque 1 : image de fond plein écran
    <div
      className="min-h-dvh md:min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      {/* Calque 2 : voile pour la lisibilité */}
      <div className="min-h-dvh md:min-h-screen bg-white/75 flex flex-col">
        <Header />

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Restaure la position de scroll lors des navigations */}
      <ScrollRestoration />
    </div>
  );
}
