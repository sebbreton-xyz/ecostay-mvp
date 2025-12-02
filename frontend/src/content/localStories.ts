// src/content/localStories.ts
import type { Story } from "@/types/story";
import menhir from "@/assets/bretagne/cabane-menhir.png";
import ensoleillee from "@/assets/bretagne/cabane-ensoleillee.png";
import SolarCuisine from "@/assets/SolarCuisine.jpg";

export const localStories: Story[] = [
    // NOUVELLE "À LA UNE"
    {
        id: 1,
        slug: "nuit-aux-lucioles-cuisine-solaire",
        date: "2025-09-22",
        kicker: "Expérience locale",
        title: "Nuit aux lucioles & cuisine solaire : micro-aventure sans écran",
        chapo:
            "48 h à deux pas de chez soi : on arrive en TER + vélo, on cuisine au four solaire, on suit un guide pour observer les lucioles et on dort dans une tiny maison écoresponsable. Un week-end low-tech, doux et lumineux.",
        hero: { src: SolarCuisine, alt: "Cuisine solaire au bord d'un ruisseau" },
        tags: ["Slow", "Famille", "Bugey"],
        featured: true,
        cta: {
            label: "Découvrir l’expérience",
            href: "/decouverte/experiences-locales/nuit-aux-lucioles-cuisine-solaire",
        },
        blocks: [
            { type: "h3", text: "Pourquoi on adore" },
            {
                type: "p",
                text:
                    "Cette micro-aventure mise sur l’essentiel : lumière, silence, rencontres. On débranche les écrans, on cuisine grâce au soleil (même voilé !), et on redécouvre les petites merveilles nocturnes.",
            },
            {
                type: "ul",
                items: [
                    "🚆 + 🚲 : accès sans voiture (petite gare, vélos dispo sur place).",
                    "☀️ Atelier cuisine solaire (pain plat, légumes rôtis, dessert fruité).",
                    "🌌 Veillée aux lucioles avec un éco-guide (écoute et respect des habitats).",
                    "🏡 Nuit en tiny maison bois, isolation biosourcée, eau filtrée.",
                    "🥣 Petit-déj local (miels & confitures artisanales).",
                ],
            },
            { type: "h3", text: "Impact & pratique" },
            {
                type: "p",
                text:
                    "Empreinte carbone minimale, circuits courts, activités à faible impact. Pensez à une lampe frontale à lumière rouge et à une gourde. L’expérience existe d’avril à septembre, selon météo et période d’activité des lucioles.",
            },
            { type: "quote", text: "Au bout du pré, la nuit respire — et scintille." },
        ],
    },

    // ARCHIVE — ancienne À la une (Home)
    {
        id: 2,
        slug: "archive-ancienne-a-la-une-sept-2025",
        date: "2025-09-01",
        kicker: "Archive",
        title: "Dormir comme il y a 6 000 ans — Cabane néolithique en Bretagne",
        chapo:
            "Dans les Monts d’Arrée, Lila et Maël ont rebâti une cabane de roseaux, noisetier et torchis.",
        hero: {
            src: menhir,
            alt:
                "Cabane néolithique sur la lande des Monts d’Arrée, parois en noisetier tressé, toit de roseaux, menhir dans la brume.",
            caption:
                "Cabane néolithique reconstruite en Bretagne — noisetier tressé, torchis d’argile, toit de roseaux, sur la lande des Monts d’Arrée.",
        },
        secondary: {
            src: ensoleillee,
            alt:
                "Atelier participatif : tressage des parois en noisetier devant la cabane, lande bretonne ensoleillée.",
            caption: "Atelier participatif — tressage en noisetier, gestes simples et conviviaux.",
        },
        tags: ["Archive", "Bretagne", "Archéo"],
        featured: false,
        cta: {
            label: "Découvrir la cabane",
            href: "/decouverte/experiences-locales/archive-ancienne-a-la-une-sept-2025",
        },
        blocks: [
            { type: "h3", text: "Vivre une nuit à l’âge de pierre (sans folklore)" },
            {
                type: "p",
                text:
                    "Ici, pas de reconstitution figée : on apprend en faisant. Lila et Maël partagent des gestes simples — choisir les bonnes tiges de noisetier, tresser, enduire le torchis — et racontent comment ces techniques rendaient la cabane chaude, sèche et étonnamment durable.",
            },
            {
                type: "ul",
                items: [
                    "Visite guidée de la cabane : structure, matériaux, astuces d’étanchéité.",
                    "Atelier tressage & torchis (participatif, tout public).",
                    "Veillée feu sous la voûte d’herbe sèche (selon météo).",
                    "Balade crépusculaire jusqu’au menhir voisin.",
                ],
            },

            { type: "h3", text: "Matériaux & techniques (très) low-tech" },
            {
                type: "p",
                text:
                    "La structure est en noisetier souple, le remplissage en torchis (mélange argile/fibre/eau), et le toit en roseaux. Les assemblages misent sur l’élasticité du végétal, l’épaisseur du torchis pour inertie et la pente du toit pour l’écoulement.",
            },
            {
                type: "ul",
                items: [
                    "Noisetier tressé : léger, flexible, rapide à mettre en œuvre.",
                    "Torchis : argile locale + fibres (paille/chanvre) pour éviter les fissures.",
                    "Toit de roseaux : pente forte, excellente résistance à la pluie.",
                    "Entretien : contrôle saisonnier, reprises locales si besoin.",
                ],
            },

            { type: "quote", text: "Le feu crépite, le torchis garde la chaleur, la lande respire." },

            { type: "h3", text: "Infos pratiques" },
            {
                type: "p",
                text:
                    "L’expérience se fait en petit groupe. Équipez-vous de chaussures fermées et d’une gourde. Les ateliers sont accessibles aux enfants (sous la responsabilité d’un adulte).",
            },
            {
                type: "ul",
                items: [
                    "Période : avril → octobre (selon météo).",
                    "Accès : Monts d’Arrée ; parking à proximité, covoiturage encouragé.",
                    "À prévoir : vêtement qui peut se salir pour l’atelier torchis ; lampe frontale.",
                ],
            },
        ],
    },
];

export function getFeaturedLocalStory() {
    return localStories.find((s) => s.featured) ?? localStories[0];
}

export function getStoryBySlug(slug: string) {
    return localStories.find((s) => s.slug === slug) ?? null;
}

export function getArchiveStories() {
    return localStories.filter((s) => !s.featured);
}
