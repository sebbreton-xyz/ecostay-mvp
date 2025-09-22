import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

import HomePage from "@/pages/home/HomePage";

// Découverte
import DecouverteIndex from "@/pages/decouverte/Index";
import DormirAutrement from "@/pages/decouverte/DormirAutrement";
import ExperiencesLocales from "@/pages/decouverte/ExperiencesLocales";
import ExperienceArticle from "@/pages/decouverte/ExperienceArticle";
import PartenairesEngages from "@/pages/decouverte/PartenairesEngages";

// Impact
import ImpactIndex from "@/pages/impact/Index";
import SolutionsDurables from "@/pages/impact/SolutionsDurables";
import Sengager from "@/pages/impact/Sengager";

// Communauté
import CommunauteIndex from "@/pages/communaute/Index";
import NotreMission from "@/pages/communaute/NotreMission";
import Contact from "@/pages/communaute/Contact";

// Mon espace
import MonEspace from "@/pages/monespace/Index";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },

      { path: "/decouverte", element: <DecouverteIndex /> },
      { path: "/decouverte/dormir-autrement", element: <DormirAutrement /> },
      { path: "/decouverte/experiences-locales", element: <ExperiencesLocales /> },
      { path: "/decouverte/experiences-locales/:slug", element: <ExperienceArticle /> },
      { path: "/decouverte/partenaires-engages", element: <PartenairesEngages /> },

      { path: "/impact", element: <ImpactIndex /> },
      { path: "/impact/solutions-durables", element: <SolutionsDurables /> },
      { path: "/impact/sengager", element: <Sengager /> },

      { path: "/communaute", element: <CommunauteIndex /> },
      { path: "/communaute/notre-mission", element: <NotreMission /> },
      { path: "/communaute/contact", element: <Contact /> },

      { path: "/monespace", element: <MonEspace /> },
    ],
  },
]);
