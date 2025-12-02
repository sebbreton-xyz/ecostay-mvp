// src/content/mission.ts
import heroImg from "@/assets/bretagne/cabane-menhir2.png";

export const mission = {
    kicker: "Communauté",
    title: "Notre mission",
    excerpt:
        "Aider chacun à voyager autrement : des séjours sobres en carbone, ancrés dans les territoires, qui financent la transition écologique locale.",
    bullets: [
        "Transparence — indicateurs clairs (eau, énergie, déchets, mobilité).",
        "Bas carbone — transports doux, efficacité énergétique, sobriété.",
        "Circuits courts — rémunération d’artisans, agriculteurs et guides locaux."
    ],
    cta: { label: "Lire la mission", href: "/communaute/notre-mission" },

    hero: {
        src: heroImg,  // On passe la variable importée
        alt: "",       // décoratif ici (le titre/chapô portent le sens)
    },
};
// Note : les images sont gérées dans HomePage.tsx pour le moment
// car utilisées aussi dans FeaturedStory.