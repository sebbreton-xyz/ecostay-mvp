// src/types/story.ts
export type StoryImage = { src: string; alt: string; caption?: string };

export type StoryBlock =
    | { type: "p"; text: string }
    | { type: "h3"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "quote"; text: string }
    | { type: "img"; image: StoryImage };

export type Story = {
    id: number;
    slug: string;
    date: string; // ISO (ex: "2025-09-22")
    kicker?: string;
    title: string;
    chapo: string;
    hero: StoryImage;
    secondary?: StoryImage;
    tags?: string[];
    featured?: boolean;
    cta?: { label: string; href: string };
    blocks: StoryBlock[];
};
