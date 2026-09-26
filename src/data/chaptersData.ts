import { Chapter } from '../types';

export const graphicNovelChapters: Chapter[] = [
  {
    id: 1,
    title: "Chapter I: The Mechanical Genesis",
    subtitle: "The Sacred Spindle Whorls of Mohenjo-Daro (2500 BCE)",
    era: "Indus Valley Bronze Age · 2500 BCE",
    location: "Mohenjo-daro DK Area, Indus River",
    summary: "School kids Maya, Kabir, and Leo step through an enchanted museum portal right onto the sunbaked brick courtyards of the ancient Indus civilization. Kabir discovers a heavy terracotta disk spinning at dizzying speeds, drawing pure cotton into an unbroken thread.",
    colorScheme: {
      primary: "#bd593c", // Terracotta
      secondary: "#fbf3eb",
      border: "#42281d",
      accent: "#c59f3f" // Gold
    },
    relicReward: {
      id: "relic_spindle",
      name: "Mohenjo-daro Terracotta Spindle",
      icon: "🏺",
      description: "A balanced 45-gram flywheel that transforms raw Gossypium arboreum cotton into celestial thread."
    },
    panels: [
      {
        id: "p1_1",
        title: "The Portal Beneath the Museum Glass",
        kicker: "The School Field Trip",
        sceneDescription: "Maya presses her glasses close against the museum tablet kiosk. Kabir taps his fingers on the wooden loom frame, and Leo's tablet screen pulses with golden Sanskrit script: सूत्रम् (Sūtram)!",
        dialogues: [
          {
            character: "maya",
            characterName: "Maya",
            text: "Wait! Look at the tablet on the wooden pedestal! The Sanskrit glyph is glowing!",
            emotion: "surprised"
          },
          {
            character: "kabir",
            characterName: "Kabir",
            text: "Whoa! The air smells like wet river clay and roasted cumin... guys, where are we?!",
            emotion: "excited"
          },
          {
            character: "leo",
            characterName: "Leo",
            text: "My scanner reads: Indus Valley, 2500 BCE! That terracotta disc on the floor is still spinning!",
            emotion: "explaining"
          }
        ],
        soundEffect: "WHUUUUSH! ✨",
        interactiveType: "none",
        sanskritSpotlight: {
          word: "तन्तुः (Tantuḥ)",
          translit: "Tantu",
          meaning: "Raw fiber strand alignment vectors",
          historicalEra: "Mehrgarh / Indus Horizon"
        }
      },
      {
        id: "p1_2",
        title: "The Whirlwind of the Flywheel",
        kicker: "The Artisan's Workshop",
        sceneDescription: "An ancient Indus artisan smiles warmly, sitting beside a basket of snowy cotton bolls. She shows Kabir how gravity and inertia twist loose fluffy fibers into a strong, slender cord.",
        dialogues: [
          {
            character: "master_weaver",
            characterName: "Indus Artisan",
            text: "Welcome, young seekers. Before you can weave the cosmos, you must tame the single strand. Take the whorl and spin!",
            emotion: "explaining"
          },
          {
            character: "kabir",
            characterName: "Kabir",
            text: "If I twist it too fast, it snaps! If I don't twist enough, it falls apart like a cloud!",
            emotion: "excited"
          },
          {
            character: "maya",
            characterName: "Maya",
            text: "Look at the tension ratio! The flywheel weight keeps the momentum continuous!",
            emotion: "curious"
          }
        ],
        soundEffect: "WHIRRR-WHIRRR-WHIRRR! 🌀",
        interactiveType: "spindle_whorl",
        sanskritSpotlight: {
          word: "सूत्रम् (Sūtram)",
          translit: "Sūtram",
          meaning: "The foundational continuous thread / yarn matrix",
          historicalEra: "Rigvedic Literature"
        }
      }
    ]
  },
  {
    id: 2,
    title: "Chapter II: The Weaver's Code",
    subtitle: "The Master Loom of the Mauryan Guilds (300 BCE)",
    era: "Mauryan Guild Era · 300 BCE",
    location: "Pataliputra Guild Quarter",
    summary: "Drawn forward in time, the children find themselves inside a bustling royal textile workshop. Giant teakwood looms click and clack rhythmically as master weavers interlace dyed yarn into royal cloth.",
    colorScheme: {
      primary: "#2d5a3c", // Forest Jade
      secondary: "#f2f7f3",
      border: "#1d3826",
      accent: "#e5a93c"
    },
    relicReward: {
      id: "relic_shuttle",
      name: "Carved Rosewood Loom Shuttle",
      icon: "🪵",
      description: "A smooth wooden vessel that carries the weft yarn across open warp sheds in the blink of an eye."
    },
    panels: [
      {
        id: "p2_1",
        title: "The Rhythm of the Giant Looms",
        kicker: "Pataliputra Guilds",
        sceneDescription: "Dozens of looms echo across the high-ceilinged stone hall. Shafts of sunlight illuminate floating flecks of indigo and madder dust.",
        dialogues: [
          {
            character: "leo",
            characterName: "Leo",
            text: "Look at the binary pattern! Up, down, up, down... it is literally an ancient computer program!",
            emotion: "excited"
          },
          {
            character: "maya",
            characterName: "Maya",
            text: "The vertical threads are under huge tension—that's the Warp. And the flying wooden boat is the Shuttle carrying the Weft!",
            emotion: "explaining"
          },
          {
            character: "kabir",
            characterName: "Kabir",
            text: "Let me try pressing the treadle pedal! Can I make the shuttle fly?",
            emotion: "curious"
          }
        ],
        soundEffect: "CLACK-THUMP! CLACK-THUMP! 🪓",
        interactiveType: "loom_shuttle",
        sanskritSpotlight: {
          word: "वानम् (Vānam)",
          translit: "Vāna",
          meaning: "The dynamic interlacing of warp and weft on a loom",
          historicalEra: "Taittiriya Samhita"
        }
      },
      {
        id: "p2_2",
        title: "The Guild Master's Golden Rule",
        kicker: "The Secret of Kṣauma",
        sceneDescription: "The Vayakāra (Master Weaver) inspects the linen fabric Kabir just helped weave. The crisp flax yarn gleams like pale honey.",
        dialogues: [
          {
            character: "master_weaver",
            characterName: "Vayakāra Somadeva",
            text: "Well done, young scholars! The beat must be even as the breath. A single loose weft line ripples through the whole cloth.",
            emotion: "triumphant"
          },
          {
            character: "kabir",
            characterName: "Kabir",
            text: "My arms are tired, but look at that chevron pattern! We actually made real ancient fabric!",
            emotion: "excited"
          }
        ],
        soundEffect: "SHHH-CLICK! 🧵",
        interactiveType: "none",
        sanskritSpotlight: {
          word: "क्षौमम् (Kṣaumam)",
          translit: "Kṣauma",
          meaning: "Pure flax linen worn by scholars and seers",
          historicalEra: "Manusmriti / Vedic Records"
        }
      }
    ]
  },
  {
    id: 3,
    title: "Chapter III: The Trans-Himalayan Caravan",
    subtitle: "The Great Silk Exchange of Takṣaśilā University (100 CE)",
    era: "Kushan Silk Road Golden Era · 100 CE",
    location: "Takṣaśilā (Taxila), Gandhara Crossroads",
    summary: "At the famed international university city of Takṣaśilā, caravan bells herald traders arriving from China, Persia, and the Gangetic plains. The children uncover the fierce debate between golden wild Tussar silk and refined Chinese mulberry silk.",
    colorScheme: {
      primary: "#8a2218", // China Crimson
      secondary: "#fcf4f3",
      border: "#47130d",
      accent: "#d4a737"
    },
    relicReward: {
      id: "relic_silk_scroll",
      name: "Taxila Silk Guild Trade Manuscript",
      icon: "📜",
      description: "A bilingual trade scroll mapping the mountain passes from Taxila to Dunhuang with wild silk samples."
    },
    panels: [
      {
        id: "p3_1",
        title: "Caravans in the Shadow of the Snow Mountains",
        kicker: "The Great Dry-Port",
        sceneDescription: "Two-humped Bactrian camels kneel in the dust, their packs laden with tightly wrapped cylindrical bales. Scholars in saffron robes debate with merchant guilds in Gandharan Greek and Sanskrit.",
        dialogues: [
          {
            character: "maya",
            characterName: "Maya",
            text: "Look at these two different silk bundles! This one is shimmering dark gold—it comes from wild forest moths!",
            emotion: "curious"
          },
          {
            character: "leo",
            characterName: "Leo",
            text: "And this roll is pure moonlit white mulberry silk from Chang'an! The Sanskrit calls it Cīnāṁśuka!",
            emotion: "explaining"
          },
          {
            character: "kabir",
            characterName: "Kabir",
            text: "The merchants are bartering! Let's trace their caravan route on the ancient map!",
            emotion: "excited"
          }
        ],
        soundEffect: "JINGLE-CLINK! 🔔 🐪",
        interactiveType: "silk_map",
        sanskritSpotlight: {
          word: "चिनांशुकम् (Cīnāṁśuka)",
          translit: "Cīnāṁśuka",
          meaning: "Imported luxury silk panels traded across northern passes",
          historicalEra: "Classical Sanskrit / Kalidasa"
        }
      }
    ]
  },
  {
    id: 4,
    title: "Chapter IV: The Celestial Tapestry",
    subtitle: "The Royal Drapes & The Golden Loom Return (400 CE)",
    era: "Classical Gupta Synthesis · 400 CE",
    location: "Ujjain Royal Pavilion & Crafts Museum Return",
    summary: "The final trial takes place in a grand court pavilion bathed in natural indigo and marigold dyes. The children must weave the final golden zari thread to unlock the museum portal and return home.",
    colorScheme: {
      primary: "#44356a", // Royal Indigo Purple
      secondary: "#f6f3fc",
      border: "#261c40",
      accent: "#f3be3a"
    },
    relicReward: {
      id: "relic_golden_seal",
      name: "The Golden Sūtra-Kośa Seal",
      icon: "👑",
      description: "The legendary royal weaver's seal proving mastery over spinning, weaving, and the trans-continental silk routes."
    },
    panels: [
      {
        id: "p4_1",
        title: "Dyeing the Threads of the Gods",
        kicker: "The Color Alchemist",
        sceneDescription: "Clay vats ferment deep blue Indigo, madder roots simmer in brass pots, and golden turmeric powders fill stone bowls. The children mix natural mordants to color royal silk robes.",
        dialogues: [
          {
            character: "maya",
            characterName: "Maya",
            text: "No chemical dyes exist here! The indigo leaves turn blue only when exposed to the air—it's magic chemistry!",
            emotion: "excited"
          },
          {
            character: "kabir",
            characterName: "Kabir",
            text: "Look at how the Antarīya drape cascades! It has no stitches, yet it fits like royal armor!",
            emotion: "curious"
          }
        ],
        soundEffect: "BUBBLE-SPLASH! 🧪",
        interactiveType: "dye_alchemist",
        sanskritSpotlight: {
          word: "अन्तरीयम् (Antarīyam)",
          translit: "Antarīya",
          meaning: "The historic unstitched lower body wrap bound at the waist",
          historicalEra: "Gupta Classical Era"
        }
      },
      {
        id: "p4_2",
        title: "The Golden Thread Awakens",
        kicker: "The Secret Unlocked",
        sceneDescription: "Maya, Kabir, and Leo unite the spinning whorl, the rosewood shuttle, and the silk manuscript onto the ancient loom. A flash of warm golden light sweeps over them, transporting them back to the museum tablet kiosk!",
        dialogues: [
          {
            character: "leo",
            characterName: "Leo",
            text: "We're back in the museum! But look at my tablet... it has the full Sūtra-Kośa encyclopedia unlocked!",
            emotion: "triumphant"
          },
          {
            character: "maya",
            characterName: "Maya",
            text: "And the wooden loom in the exhibit is gently humming... like it's saying thank you!",
            emotion: "excited"
          },
          {
            character: "kabir",
            characterName: "Kabir",
            text: "That was the best history lesson ever! Can we scroll through Chapter 1 again?!",
            emotion: "excited"
          }
        ],
        soundEffect: "DING-CHIME-SPARKLE! 🌟",
        interactiveType: "none",
        sanskritSpotlight: {
          word: "उत्तरीयम् (Uttarīyam)",
          translit: "Uttarīya",
          meaning: "The decorative shoulder shawl worn over the upper torso",
          historicalEra: "Ajanta Cave Inscriptions"
        }
      }
    ]
  }
];
