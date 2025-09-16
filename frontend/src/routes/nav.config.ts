export type NavItem = {
  label: string
  path: string
  children?: { label: string; path: string }[]
}

export const NAV: NavItem[] = [
  {
    label: "Découverte",
    path: "/decouverte",
    children: [
      { label: "Dormir autrement", path: "/decouverte/dormir-autrement" },
      { label: "Expériences locales", path: "/decouverte/experiences-locales" },
      { label: "Partenaires engagés", path: "/decouverte/partenaires-engages" },
    ],
  },
  {
    label: "Impact",
    path: "/impact",
    children: [
      { label: "Solutions durables", path: "/impact/solutions-durables" },
      { label: "S’engager", path: "/impact/sengager" },
    ],
  },
  {
    label: "Communauté",
    path: "/communaute",
    children: [
      { label: "Notre mission", path: "/communaute/notre-mission" },
      { label: "Contact", path: "/communaute/contact" },
    ],
  },
  {
    label: "Mon espace",
    path: "/mon-espace",
  },
]
