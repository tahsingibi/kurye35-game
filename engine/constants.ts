export const VW = 450;
export const VH = 800;
export const HORIZON = 218;

export const FIXED_STEP = 1000 / 60;

export const ACHIEVEMENTS_DATA = {
  first: { slug: "first", reward: 250, icon: "1" },
  combo: { slug: "combo", reward: 350, icon: "3×" },
  speed: { slug: "speed", reward: 400, icon: "100" },
  clean: { slug: "clean", reward: 400, icon: "✓" },
  escape: { slug: "escape", reward: 500, icon: "P" },
  trap: { slug: "trap", reward: 600, icon: "↯" },
  ten: { slug: "ten", reward: 700, icon: "10" },
  master: { slug: "master", reward: 1000, icon: "★" },
} as const;

export interface MissionDef {
  slugTitle: string;
  slugDesc: string;
  type: "delta" | "timed" | "clean" | "total";
  target: number;
  seconds?: number;
}

export const MISSIONS_DATA: MissionDef[] = [
  { slugTitle: "missions.m1_title", slugDesc: "missions.m1_desc", type: "delta", target: 2 },
  { slugTitle: "missions.m2_title", slugDesc: "missions.m2_desc", type: "timed", target: 3, seconds: 75 },
  { slugTitle: "missions.m3_title", slugDesc: "missions.m3_desc", type: "clean", target: 25 },
  { slugTitle: "missions.m4_title", slugDesc: "missions.m4_desc", type: "total", target: 9 },
  { slugTitle: "missions.m5_title", slugDesc: "missions.m5_desc", type: "total", target: 14 },
];

export interface StoryPageDef {
  tagKey: string;
  titleKey: string;
  lineKeys: string[];
}

export const STORY_PAGES: StoryPageDef[] = [
  {
    tagKey: "story.page_1_tag",
    titleKey: "story.page_1_title",
    lineKeys: ["story.page_1_line_1", "story.page_1_line_2"],
  },
  {
    tagKey: "story.page_2_tag",
    titleKey: "story.page_2_title",
    lineKeys: ["story.page_2_line_1", "story.page_2_line_2"],
  },
  {
    tagKey: "story.page_3_tag",
    titleKey: "story.page_3_title",
    lineKeys: ["story.page_3_line_1", "story.page_3_line_2"],
  },
];
