export interface GlossaryTerm {
  id: string;
  word: string;
  translit: string;
  english: string;
  category: 'Material' | 'Process' | 'Garment' | 'Trade';
  categoryLabel: string;
  definition: string;
  historicalCitation: string;
  excavationFact: string;
  linkedChapter: number;
  audioPronunciation: string;
}

export interface ComicDialogue {
  character: 'maya' | 'kabir' | 'leo' | 'master_weaver' | 'narrator';
  characterName: string;
  text: string;
  emotion?: 'excited' | 'curious' | 'surprised' | 'explaining' | 'triumphant';
}

export interface ComicPanel {
  id: string;
  title: string;
  kicker: string;
  sceneDescription: string;
  dialogues: ComicDialogue[];
  soundEffect?: string;
  interactiveType?: 'spindle_whorl' | 'loom_shuttle' | 'silk_map' | 'dye_alchemist' | 'none';
  sanskritSpotlight?: {
    word: string;
    translit: string;
    meaning: string;
    historicalEra: string;
  };
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  era: string;
  location: string;
  summary: string;
  colorScheme: {
    primary: string;
    secondary: string;
    border: string;
    accent: string;
  };
  relicReward: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  panels: ComicPanel[];
}

export interface SilkCheckpoint {
  id: number;
  name: string;
  sanskritName: string;
  lat: string;
  lon: string;
  xPercent: number;
  yPercent: number;
  category: string;
  description: string;
  historicalRelic: string;
}
