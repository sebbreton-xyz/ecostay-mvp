import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import BgImage from "@/assets/Ciel.jpg";

export default function MainLayout() {
  return (
    // Calque 1 : image de fond plein écran
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      {/* Calque 2 : voile pour la lisibilité (tu peux ajuster l’opacité) */}
      <div className="min-h-screen bg-white/75">
        <Header />
        <main className="overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}