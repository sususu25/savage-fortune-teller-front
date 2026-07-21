import React from "react";
import ReactDOM from "react-dom/client";
import {
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Copy,
  FileDown,
  Home,
  Mail,
  MapPin,
  Moon,
  Orbit,
  Scale,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import "./styles.css";

type ArchetypeCode =
  | "burdened_one"
  | "chaos_magnet"
  | "overthinker"
  | "dangerous_heart"
  | "haunted_dreamer"
  | "unfinished_legend"
  | "main_character_energy"
  | "moon_flood"
  | "venus_maximalist"
  | "mars_ignition"
  | "jupiter_evangelist"
  | "ascendant_mask";

type ReadingResponse = {
  primary_type: {
    code: ArchetypeCode;
    label: string;
    score: number;
    matched_features?: string[];
    viral_alias: string;
    headline: string;
    result_badge: string;
    share_text: string;
  };
  secondary_tags?: Array<{ code: string; label: string; score: number; matched_features?: string[] }>;
  section_titles: Record<string, string>;
  sections: Record<string, string>;
  all_archetype_scores?: Record<string, { label: string; score: number }>;
  features?: Record<string, boolean | number>;
  chart?: ChartResponse;
};

type ChartBody = {
  sign: string;
  house?: number;
  degree: number;
  longitude: number;
};

type ChartAspect = {
  p1: string;
  p2: string;
  type: string;
  orb: number;
};

type ChartResponse = {
  meta: {
    resolved_location: string;
    timezone: string;
    local_datetime: string;
    latitude: number;
    longitude: number;
  };
  planets: Record<string, ChartBody>;
  angles: Record<string, ChartBody>;
  points?: Record<string, ChartBody>;
  aspects: ChartAspect[];
};

type ShareCreateResponse = {
  share_id: string;
  share_path: string;
  share_url: string | null;
};

type ShareResponse = {
  share_id: string;
  result_payload: ReadingResponse;
  input?: {
    birth_date?: string;
    birth_time?: string;
    birth_city?: string;
    birth_country?: string;
  } | null;
};

type LocationOption = {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  normalized_query?: string;
  source?: string;
};

type LocationSearchResponse = {
  locations?: Omit<LocationOption, "id">[];
  location?: Omit<LocationOption, "id">;
};

type ArchetypeProfile = {
  name: string;
  alias: string;
  image?: string;
  curse?: string;
  role?: string;
  bait?: string;
  prescription?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

const fallbackLocations: LocationOption[] = [
  { id: "seoul-kr", city: "Seoul", country: "South Korea", latitude: 37.5665, longitude: 126.978, timezone: "Asia/Seoul" },
  { id: "gunpo-kr", city: "Gunpo", country: "South Korea", latitude: 37.3617, longitude: 126.9352, timezone: "Asia/Seoul" },
  { id: "new-york-us", city: "New York", country: "United States", latitude: 40.7128, longitude: -74.006, timezone: "America/New_York" },
  { id: "london-uk", city: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London" },
];

const archetypeProfiles: Partial<Record<ArchetypeCode, ArchetypeProfile>> = {
  burdened_one: {
    name: "The Burdened One",
    alias: "The Unpaid Project Manager of the Universe",
    image: "/archetypes/burdened-one.webp",
    curse: "Chronically responsible, spiritually employed without benefits.",
    role: "The friend who says 'I'll handle it' and then quietly becomes a load-bearing wall.",
    bait: "Mistaking exhaustion for maturity because Saturn handed you a clipboard too early.",
    prescription: "Delegate one thing before your nervous system starts unionizing.",
  },
  chaos_magnet: {
    name: "The Chaos Magnet",
    alias: "The Human Plot Twist",
    image: "/archetypes/chaos-magnet.webp",
    curse: "A walking season finale with suspiciously good timing.",
    role: "The person who enters a calm room and somehow unlocks the bonus crisis.",
    bait: "Calling every impulse 'a sign' when sometimes it is just boredom wearing eyeliner.",
    prescription: "Eat, wait twenty minutes, then decide whether the plot actually needs arson.",
  },
  overthinker: {
    name: "The Overthinker",
    alias: "The 47 Tabs Open Personality",
    image: "/archetypes/overthinker.webp",
    curse: "Mentally buffering, emotionally litigating, cosmically over-researched.",
    role: "The friend who can turn 'sure' into a twelve-part courtroom drama.",
    bait: "Believing the right analysis will save you from having to feel something.",
    prescription: "Touch grass, send the text, and stop letting Mercury run a hostage situation.",
  },
  dangerous_heart: {
    name: "The Dangerous Heart",
    alias: "The Romantic Red Flag with Good Branding",
    image: "/archetypes/dangerous-heart.webp",
    curse: "Seductive intensity with a suspicious basement.",
    role: "The friend whose love life needs a soundtrack, subtitles, and legal counsel.",
    bait: "Confusing emotional activation with destiny because calm feels underproduced.",
    prescription: "If it feels like a federal investigation, do not call it chemistry.",
  },
  haunted_dreamer: {
    name: "The Haunted Dreamer",
    alias: "The Delulu Oracle",
    image: "/archetypes/haunted-dreamer.webp",
    curse: "Psychic enough to be annoying, avoidant enough to be expensive.",
    role: "The friend who reads the room, absorbs the room, then needs three days in the fog.",
    bait: "Calling a fantasy 'intuition' because the playlist was convincing.",
    prescription: "Verify the vibe with evidence before marrying a hallucination in your notes app.",
  },
  unfinished_legend: {
    name: "The Unfinished Legend",
    alias: "The Main Character in Development Hell",
    image: "/archetypes/unfinished-legend.webp",
    curse: "Huge destiny, suspiciously delayed shipping.",
    role: "The friend with main character energy and a release date the universe keeps moving.",
    bait: "Waiting for a sign when the sign is already yelling 'do the damn thing.'",
    prescription: "Move one ugly inch forward. Potential is cute; execution pays rent.",
  },
  main_character_energy: {
    name: "The Discourse's Main Character",
    alias: "The Discourse's Main Character",
    image: "/archetypes/unfinished-legend.webp",
    curse: "Solar volume set to arena mode, even when the room asked for indoor voice.",
    role: "The person who can make a grocery run feel like a press tour.",
    bait: "Confusing visibility with destiny because the spotlight started blinking first.",
    prescription: "Let one scene be quiet. Your legend will survive a lunch break.",
  },
  moon_flood: {
    name: "The Human Weather System",
    alias: "The Human Weather System",
    image: "/archetypes/haunted-dreamer.webp",
    curse: "Emotionally high-definition, spiritually one push notification away from rain.",
    role: "The friend who can feel a tone shift through drywall.",
    bait: "Treating every mood like a prophecy instead of a weather report.",
    prescription: "Name the feeling before it becomes a limited series.",
  },
  venus_maximalist: {
    name: "The Standards With Their Own Zip Code",
    alias: "The Standards With Their Own Zip Code",
    image: "/archetypes/dangerous-heart.webp",
    curse: "Taste level immaculate, tolerance level suspiciously underfunded.",
    role: "The friend who can smell bad lighting and emotional laziness.",
    bait: "Calling it discernment when sometimes it is just fear wearing perfume.",
    prescription: "Keep the standards. Retire the imaginary velvet rope at breakfast.",
  },
  mars_ignition: {
    name: "The Fight-or-Also-Fight Response",
    alias: "The Fight-or-Also-Fight Response",
    image: "/archetypes/chaos-magnet.webp",
    curse: "A motivational speaker trapped inside an emergency flare.",
    role: "The person who enters 'quick question' already dressed for combat.",
    bait: "Mistaking adrenaline for clarity because patience has terrible branding.",
    prescription: "Wait one breath longer than your ego thinks is medically possible.",
  },
  jupiter_evangelist: {
    name: "The Free Advice Philanthropist",
    alias: "The Free Advice Philanthropist",
    image: "/archetypes/unfinished-legend.webp",
    curse: "Optimism with a microphone and no unsubscribe button.",
    role: "The friend who can turn a minor plan into a ten-year doctrine.",
    bait: "Believing bigger is always wiser because Jupiter keeps yelling from the balcony.",
    prescription: "Edit the sermon into one next step. The universe has meetings.",
  },
  ascendant_mask: {
    name: "The Different Person Depending on the Lighting",
    alias: "The Different Person Depending on the Lighting",
    image: "/archetypes/overthinker.webp",
    curse: "A public-facing personality suite with suspiciously good branding.",
    role: "The person whose first impression has a whole costume department.",
    bait: "Performing adaptability until nobody can find the actual person backstage.",
    prescription: "Tell the truth slightly earlier. The mask can clock out.",
  },
};

const SIGN_NAMES: Record<string, string> = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

const BODY_NAMES: Record<string, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
  asc: "Ascendant",
  mc: "Midheaven",
  north_node: "North Node",
};

const FEATURE_COPY: Record<string, string> = {
  saturn_angular: "Saturn is angular, so the chart has unpaid-manager energy before breakfast.",
  saturn_sun_hard: "Sun and Saturn are in a hard aspect: ambition, pressure, and emotional taxes.",
  saturn_moon_hard: "Moon and Saturn are tense, which is astrology for feelings with a dress code.",
  saturn_asc_hard: "Saturn presses on the Ascendant, giving your first impression a clipboard.",
  capricorn_emphasis: "Capricorn emphasis adds responsibility, restraint, and premium-grade self-bullying.",
  tenth_house_emphasis: "10th-house emphasis makes reputation feel like a group project you cannot leave.",
  sixth_house_emphasis: "6th-house emphasis turns daily life into a productivity courtroom.",
  hard_aspect_dominance: "Multiple hard aspects raise the drama budget. Character development is not optional.",
  uranus_angular: "Uranus is angular, which makes the chart allergic to predictable furniture.",
  uranus_moon_hard: "Moon-Uranus tension gives emotional weather with surprise software updates.",
  uranus_mercury_hard: "Mercury-Uranus tension makes the mind fast, jumpy, and one tab from a theory wall.",
  uranus_asc_hard: "Uranus hitting the Ascendant makes your vibe arrive before your explanation does.",
  mutable_dominance: "Mutable dominance is flexible, chaotic, and legally too adaptable.",
  eighth_house_emphasis: "8th-house emphasis adds intensity, secrets, and the urge to investigate vibes for crimes.",
  sudden_change_signature: "A sudden-change signature says stability was invited but left early.",
  mercury_angular: "Mercury is angular, so your brain came with push notifications.",
  mercury_sun_close: "Sun close to Mercury fuses identity with thinking. Very efficient, deeply annoying.",
  mercury_saturn_hard: "Mercury-Saturn tension fact-checks every thought until joy files a complaint.",
  mercury_neptune_hard: "Mercury-Neptune tension can turn one message into a fog machine with footnotes.",
  gemini_emphasis: "Gemini emphasis adds speed, curiosity, and twelve conversational escape routes.",
  virgo_emphasis: "Virgo emphasis adds precision, pattern-spotting, and microscopic standards.",
  third_house_emphasis: "3rd-house emphasis makes the mind loud enough to need its own lease.",
  air_dominance: "Air dominance means the feelings were immediately converted into analysis.",
  venus_pluto_hard: "Venus-Pluto tension brings love-life intensity with suspicious lighting.",
  moon_pluto_hard: "Moon-Pluto tension turns emotions into deep-sea research.",
  mars_pluto_hard: "Mars-Pluto tension gives desire a steering wheel and questionable brakes.",
  scorpio_emphasis: "Scorpio emphasis adds x-ray vision and absolutely no chill about subtext.",
  fifth_house_emphasis: "5th-house emphasis makes romance, art, and attention unusually combustible.",
  seventh_house_emphasis: "7th-house emphasis makes relationships central, whether or not anyone signed the waiver.",
  relationship_intensity_signature: "The relationship signature is loud enough to require subtitles.",
  neptune_angular: "Neptune is angular, so reality enters through a smoke machine.",
  moon_neptune_strong: "Moon-Neptune contact makes feelings porous, poetic, and inconveniently absorbent.",
  sun_neptune_strong: "Sun-Neptune contact blurs identity with fantasy, compassion, and one dramatic playlist.",
  asc_neptune_strong: "Neptune on the Ascendant makes your aura do unpaid public relations.",
  twelfth_house_emphasis: "12th-house emphasis adds privacy, dreams, and emotional background processes.",
  pisces_emphasis: "Pisces emphasis gives intuition, softness, and a suspicious relationship with reality.",
  water_dominance: "Water dominance means the chart brought feelings in bulk.",
  porous_boundary_signature: "Porous boundaries make other people's moods enter like they own keys.",
  north_node_sun_strong: "North Node-Sun contact says the life plot keeps poking your identity.",
  north_node_moon_strong: "North Node-Moon contact ties growth to emotional patterns you keep trying to ghost.",
  north_node_asc_strong: "North Node-Ascendant contact makes becoming yourself annoyingly visible.",
  north_node_mc_strong: "North Node-Midheaven contact points the plot toward public purpose.",
  jupiter_mc_strong: "Jupiter-Midheaven contact makes the ambition bigger than the calendar.",
  saturn_node_strong: "Saturn-Node contact gives destiny homework and a deadline.",
  pluto_node_strong: "Pluto-Node contact makes transformation less optional than advertised.",
  late_bloomer_signature: "Late-bloomer signatures are destiny with a delayed shipping label.",
  sun_angular: "Angular Sun puts the self on the front porch with a spotlight.",
  leo_emphasis: "Leo emphasis adds performance, pride, and a need for applause with decent lighting.",
  sun_jupiter_easy: "Sun-Jupiter harmony inflates confidence in a mostly charming, occasionally illegal way.",
  sun_asc_close: "Sun close to the Ascendant makes presence hard to miss and harder to mute.",
  fire_dominance: "Fire dominance brings urgency, courage, and a tiny motivational explosion.",
  moon_angular: "Angular Moon puts feelings in the lobby where everyone can see them.",
  cancer_emphasis: "Cancer emphasis adds memory, protection, and emotional storage units.",
  fourth_house_emphasis: "4th-house emphasis makes private life the basement where the plot lives.",
  moon_venus_hard: "Moon-Venus tension wants comfort and romance to solve the same problem.",
  moon_mars_hard: "Moon-Mars tension turns moods into tiny weather systems with knives.",
  moon_asc_close: "Moon close to the Ascendant makes every feeling leak through the face.",
  venus_angular: "Angular Venus makes taste and attraction part of the first impression.",
  libra_emphasis: "Libra emphasis adds charm, comparison, and a courtroom for aesthetics.",
  taurus_emphasis: "Taurus emphasis loves comfort, loyalty, and refusing to be rushed by fools.",
  venus_jupiter_easy: "Venus-Jupiter harmony says pleasure arrived with a plus-one and a budget problem.",
  mars_venus_strong: "Mars-Venus contact gives chemistry a megaphone.",
  second_house_emphasis: "2nd-house emphasis makes worth, money, taste, and security extremely loud.",
  mars_angular: "Angular Mars puts urgency in the driver's seat.",
  aries_emphasis: "Aries emphasis adds speed, nerve, and a low tolerance for slow walkers.",
  first_house_emphasis: "1st-house emphasis makes identity immediate and hard to politely ignore.",
  mars_sun_hard: "Mars-Sun tension turns willpower into a competitive sport.",
  mars_saturn_hard: "Mars-Saturn tension is stop-go pressure: rage with a parking brake.",
  jupiter_angular: "Angular Jupiter makes beliefs, growth, and unsolicited wisdom highly visible.",
  sagittarius_emphasis: "Sagittarius emphasis adds appetite, faith, and a suitcase full of opinions.",
  ninth_house_emphasis: "9th-house emphasis makes meaning, travel, and philosophy unusually dramatic.",
  jupiter_overextension_signature: "Jupiter overextension makes 'just one more thing' a lifestyle disease.",
  asc_ruler_hard: "The Ascendant ruler is stressed, so the persona runs on emergency lighting.",
  sun_asc_hard: "Sun-Ascendant tension makes identity and presentation argue in public.",
  asc_moon_hard: "Moon-Ascendant tension makes the face leak feelings without approval.",
  mask_signature: "The mask signature suggests adaptability got promoted to survival strategy.",
};

const ARTICLES = [
  {
    slug: "big-three",
    title: "What Your Big 3 Actually Does",
    summary: "Sun, Moon, and Ascendant are the chart's main operating system: ego, emotional weather, and first impression.",
    body:
      "The Sun describes the shape of identity and what keeps asking to be expressed. The Moon describes needs, habits, memory, and the emotional basement where the weird boxes are stored. The Ascendant describes how the chart enters a room before the person has explained themselves. Together they do not explain everything, but they give the roast its spine.",
  },
  {
    slug: "houses",
    title: "Houses Are Where The Drama Lives",
    summary: "Planets are characters, signs are style, houses are the rooms where the mess happens.",
    body:
      "A Venus placement in the 2nd house talks differently than Venus in the 8th. Same planet, different room, different legal consequences. Houses help the reading move from generic zodiac content into life areas: body, money, siblings, home, romance, work, relationships, crisis, belief, career, friends, and the private unconscious.",
  },
  {
    slug: "aspects",
    title: "Aspects: The Group Chat Between Planets",
    summary: "Aspects show whether planets cooperate, debate, or throw chairs in the conference room.",
    body:
      "A trine tends to flow. A square tends to create friction. An opposition makes two parts of the chart stare at each other across the table. Conjunctions intensify whatever planets are involved. Savage Fortune Teller uses major aspects as receipts, because a roast without evidence is just yelling in a cape.",
  },
  {
    slug: "saturn",
    title: "Saturn Is Not Mean, Just HR",
    summary: "Saturn placements often describe pressure, discipline, fear, delay, and the annoying dignity of effort.",
    body:
      "Saturn-heavy charts can look responsible early, but that responsibility may come with over-control, guilt, and the need to earn rest like it is a luxury subscription. In a roast, Saturn is the part that says 'you are doing great' while handing you another impossible standard.",
  },
  {
    slug: "mercury",
    title: "Mercury And The 47 Tabs Problem",
    summary: "Mercury signatures show how the mind processes, talks, worries, jokes, and refuses to shut up.",
    body:
      "Strong Mercury can be brilliant, funny, observant, and impossible to relax around internally. Air signs, 3rd-house emphasis, Virgo/Gemini signatures, and tense Mercury aspects can all feed the Overthinker pipeline. The gift is pattern recognition. The curse is using it on a two-word text.",
  },
  {
    slug: "venus",
    title: "Venus, Standards, And Romantic Branding",
    summary: "Venus shows taste, attraction, pleasure, values, and what kind of softness a person trusts.",
    body:
      "Venus is not only romance. It is what you find beautiful, what you want to keep, and what makes life feel worth decorating. When Venus is loud or stressed, the roast gets into standards, longing, aesthetic judgment, and the tendency to make desire look better in lighting than in reality.",
  },
  {
    slug: "mars",
    title: "Mars Is The Gas Pedal With Opinions",
    summary: "Mars describes drive, anger, pursuit, courage, libido, conflict style, and how fast someone reaches for action.",
    body:
      "Mars-heavy people often do not need more motivation. They need timing, aim, and a breathing technique that does not sound like a threat. In the chart, Mars shows how desire moves. In the roast, it shows where the person may confuse urgency with truth.",
  },
  {
    slug: "moon",
    title: "The Moon Is Your Emotional Autocomplete",
    summary: "The Moon shows instinct, need, memory, attachment patterns, and how the nervous system asks for safety.",
    body:
      "Moon placements often come out when someone is tired, hungry, in love, or pretending not to be hurt. It is not the public mission statement. It is the private weather. When the Moon is strong, the reading gets emotionally specific very fast, sometimes before the user consented to being perceived.",
  },
  {
    slug: "ascendant",
    title: "The Ascendant Is Your Opening Scene",
    summary: "The Ascendant is not fake. It is the doorway, the reflex, the first draft of how life meets you.",
    body:
      "People often treat the Ascendant like a mask, but a mask can still be meaningful. It shows how the chart meets the world and how the world tends to respond. When the Ascendant or its ruler is stressed, identity and presentation can become a full-time performance department.",
  },
  {
    slug: "nodes",
    title: "The Nodes Are Plot Pressure",
    summary: "The North Node points toward growth themes that feel important, awkward, and suspiciously recurring.",
    body:
      "Node contacts are not a magic destiny stamp, but they are useful for describing repeated life lessons. Strong Node signatures can feel like being chased by the same assignment in different outfits. The roast translates that into 'potential is cute, execution pays rent.'",
  },
];

const demoReading: ReadingResponse = {
  primary_type: {
    code: "overthinker",
    label: "The Overthinker",
    score: 76,
    viral_alias: "The 47 Tabs Open Personality",
    headline: "Your brain has 47 tabs open, and somehow one of them is arguing with a memory from 2019.",
    result_badge: "mentally buffering",
    share_text: "I got 76% The 47 Tabs Open Personality. My birth chart told my brain to shut the hell up.",
    matched_features: ["mercury_angular", "mercury_sun_close", "third_house_emphasis", "air_dominance"],
  },
  section_titles: {
    cosmic_diagnosis: "Your Cosmic Diagnosis",
    why_you_are_like_this: "Why You Are Like This",
    the_receipts: "The Receipts",
    emotional_damage_forecast: "Emotional Damage Forecast",
    love_life_a_situation: "Love Life: A Situation",
    court_ordered_advice: "Court-Ordered Advice From The Stars",
  },
  sections: {
    cosmic_diagnosis:
      "You are The 47 Tabs Open Personality: a haunted browser window with cheekbones. Your chart is not saying you are doomed. It is saying your mind keeps trying to become a surveillance state because feelings are apparently too pedestrian.",
    why_you_are_like_this:
      "Mercury is doing unpaid overtime in your chart. Strong air or Mercury signatures can make the brain fast, observant, and allergic to uncertainty. Useful? Absolutely. Peaceful? Not unless someone confiscates the imaginary courtroom in your skull.",
    the_receipts:
      "Mercury emphasis, air dominance, third-house noise, and hard mental aspects are classic receipts. Translation: your chart has pattern recognition, verbal processing, and the emotional relaxation skills of a cursed office printer.",
    emotional_damage_forecast:
      "You may spend three hours analyzing a text that meant exactly what it said. Please do not build a conspiracy board because someone replied 'sure.' Go outside and let your ass remember weather exists.",
    love_life_a_situation:
      "In love, you can turn a crush into a research project with citations. Ask the question. Send the message. Stop making eye contact with imaginary rejection in the corner like it pays rent.",
    court_ordered_advice:
      "Set a timer for worrying. When it ends, do one real-world action, even a tiny one. Your brain is useful, but it is not the damn CEO of reality.",
  },
  chart: {
    meta: {
      resolved_location: "London, United Kingdom",
      timezone: "Europe/London",
      local_datetime: "2000-01-01T12:00:00+00:00",
      latitude: 51.5074,
      longitude: -0.1278,
    },
    planets: {
      sun: { sign: "capricorn", house: 10, degree: 10.297, longitude: 280.297 },
      moon: { sign: "scorpio", house: 7, degree: 18.84, longitude: 228.84 },
      mercury: { sign: "sagittarius", house: 9, degree: 28.19, longitude: 268.19 },
      venus: { sign: "sagittarius", house: 9, degree: 3.38, longitude: 243.38 },
      mars: { sign: "aquarius", house: 11, degree: 28.21, longitude: 328.21 },
      jupiter: { sign: "aries", house: 12, degree: 25.22, longitude: 25.22 },
      saturn: { sign: "taurus", house: 1, degree: 10.24, longitude: 40.24 },
      uranus: { sign: "aquarius", house: 11, degree: 14.73, longitude: 314.73 },
      neptune: { sign: "aquarius", house: 10, degree: 3.22, longitude: 303.22 },
      pluto: { sign: "sagittarius", house: 8, degree: 11.43, longitude: 251.43 },
    },
    angles: {
      asc: { sign: "taurus", degree: 15.02, longitude: 45.02 },
      mc: { sign: "capricorn", degree: 22.1, longitude: 292.1 },
    },
    points: {
      north_node: { sign: "leo", house: 4, degree: 5.98, longitude: 125.98 },
    },
    aspects: [
      { p1: "sun", p2: "saturn", type: "trine", orb: 0.06 },
      { p1: "mercury", p2: "mars", type: "sextile", orb: 0.02 },
      { p1: "moon", p2: "uranus", type: "square", orb: 4.11 },
    ],
  },
  features: {
    mercury_sun_close: true,
    mercury_angular: true,
    air_dominance: 2,
    third_house_emphasis: 1,
  },
  all_archetype_scores: {
    overthinker: { label: "The Overthinker", score: 76 },
    haunted_dreamer: { label: "The Haunted Dreamer", score: 58 },
    burdened_one: { label: "The Burdened One", score: 43 },
    dangerous_heart: { label: "The Dangerous Heart", score: 35 },
    chaos_magnet: { label: "The Chaos Magnet", score: 31 },
    unfinished_legend: { label: "The Unfinished Legend", score: 27 },
  },
};

const defaultLocation = fallbackLocations.find((location) => location.id === "london-uk") ?? fallbackLocations[0];
const hourOptions = Array.from({ length: 24 }, (_, hour) => hour.toString().padStart(2, "0"));
const minuteOptions = Array.from({ length: 60 }, (_, minute) => minute.toString().padStart(2, "0"));

function updateTimePart(value: string, part: "hour" | "minute", nextPart: string) {
  const [hour = "00", minute = "00"] = value.split(":");
  return part === "hour" ? `${nextPart}:${minute}` : `${hour}:${nextPart}`;
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function isValidIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00`));
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function makeLocationId(location: Omit<LocationOption, "id">) {
  return `${location.city}-${location.country}-${location.latitude}-${location.longitude}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function toLocationOption(location: Omit<LocationOption, "id">): LocationOption {
  return {
    ...location,
    id: makeLocationId(location),
  };
}

function getActiveProfile(result: ReadingResponse): ArchetypeProfile {
  const configured = archetypeProfiles[result.primary_type.code];

  return {
    name: configured?.name ?? result.primary_type.label,
    alias: configured?.alias ?? result.primary_type.viral_alias,
    image: configured?.image,
    curse: configured?.curse,
    role: configured?.role,
    bait: configured?.bait,
    prescription: configured?.prescription,
  };
}

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatSign(sign: string) {
  return SIGN_NAMES[sign] ?? titleCase(sign);
}

function formatBodyName(body: string) {
  return BODY_NAMES[body] ?? titleCase(body);
}

function formatPlacement(body?: ChartBody) {
  if (!body) {
    return "Unknown";
  }

  const degree = Number.isFinite(body.degree) ? `${Math.round(body.degree * 10) / 10} deg` : "";
  const house = body.house ? `, House ${body.house}` : "";
  return `${formatSign(body.sign)} ${degree}${house}`;
}

function getTopReceipts(result: ReadingResponse) {
  const matched = result.primary_type.matched_features ?? [];
  const receiptLines = matched
    .map((feature) => FEATURE_COPY[feature] ?? `${titleCase(feature)} showed up in the scoring model.`)
    .slice(0, 5);

  if (receiptLines.length > 0) {
    return receiptLines;
  }

  const strongestAspects = (result.chart?.aspects ?? [])
    .slice()
    .sort((a, b) => a.orb - b.orb)
    .slice(0, 3)
    .map(
      (aspect) =>
        `${formatBodyName(aspect.p1)} ${aspect.type} ${formatBodyName(aspect.p2)} within ${Math.round(aspect.orb * 10) / 10} deg. The chart brought paperwork.`,
    );

  return strongestAspects.length > 0 ? strongestAspects : ["The chart returned a low-drama evidence file. Suspicious, but allowed."];
}

function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Site navigation">
      <a href="/"><Home size={15} /> Roast</a>
      <a href="/method"><Orbit size={15} /> Method</a>
      <a href="/articles"><BookOpen size={15} /> Astrology 101</a>
      <a href="/archetypes"><Sparkles size={15} /> Archetypes</a>
      <a href="/about"><ShieldCheck size={15} /> About</a>
    </nav>
  );
}

function ChartEvidence({ result }: { result: ReadingResponse }) {
  const chart = result.chart;
  const receipts = getTopReceipts(result);
  const planets = chart
    ? ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"].filter(
        (planet) => chart.planets[planet],
      )
    : [];
  const strongestAspects = (chart?.aspects ?? []).slice().sort((a, b) => a.orb - b.orb).slice(0, 6);

  if (!chart) {
    return (
      <section className="evidence-panel">
        <p className="eyebrow">Astrology receipts</p>
        <h3>Evidence file unavailable</h3>
        <p>This shared result was created before chart details were stored. Fresh roasts come with the paperwork.</p>
      </section>
    );
  }

  return (
    <section className="evidence-panel">
      <div className="evidence-heading">
        <div>
          <p className="eyebrow">Astrology receipts</p>
          <h3>Why the chart chose violence</h3>
        </div>
        <span>{chart.meta.resolved_location} - {chart.meta.timezone}</span>
      </div>

      <div className="big-three">
        <article>
          <Sun size={20} />
          <span>Sun</span>
          <b>{formatPlacement(chart.planets.sun)}</b>
        </article>
        <article>
          <Moon size={20} />
          <span>Moon</span>
          <b>{formatPlacement(chart.planets.moon)}</b>
        </article>
        <article>
          <Compass size={20} />
          <span>Ascendant</span>
          <b>{formatPlacement(chart.angles.asc)}</b>
        </article>
      </div>

      <div className="receipt-list">
        {receipts.map((receipt) => (
          <p key={receipt}>{receipt}</p>
        ))}
      </div>

      <details className="chart-details">
        <summary>Full planet positions</summary>
        <div className="planet-table">
          {planets.map((planet) => (
            <div key={planet}>
              <span>{formatBodyName(planet)}</span>
              <b>{formatPlacement(chart.planets[planet])}</b>
            </div>
          ))}
          {chart.points?.north_node && (
            <div>
              <span>North Node</span>
              <b>{formatPlacement(chart.points.north_node)}</b>
            </div>
          )}
          {chart.angles.mc && (
            <div>
              <span>Midheaven</span>
              <b>{formatPlacement(chart.angles.mc)}</b>
            </div>
          )}
        </div>
      </details>

      {strongestAspects.length > 0 && (
        <details className="chart-details">
          <summary>Closest major aspects</summary>
          <div className="aspect-list">
            {strongestAspects.map((aspect) => (
              <span key={`${aspect.p1}-${aspect.p2}-${aspect.type}`}>
                {formatBodyName(aspect.p1)} {aspect.type} {formatBodyName(aspect.p2)} - {Math.round(aspect.orb * 10) / 10} deg orb
              </span>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

function StaticPage({ path }: { path: string }) {
  const cleanPath = path.replace(/\/$/, "") || "/";
  const article = ARTICLES.find((item) => cleanPath === `/articles/${item.slug}`);
  const archetypeEntry = Object.entries(archetypeProfiles).find(([code]) => cleanPath === `/archetypes/${code}`);

  React.useEffect(() => {
    const titles: Record<string, string> = {
      "/method": "Calculation Method - Savage Fortune Teller",
      "/articles": "Astrology 101 - Savage Fortune Teller",
      "/archetypes": "Archetypes - Savage Fortune Teller",
      "/about": "About - Savage Fortune Teller",
      "/privacy": "Privacy Policy - Savage Fortune Teller",
      "/terms": "Terms - Savage Fortune Teller",
      "/contact": "Contact - Savage Fortune Teller",
    };
    document.title = article?.title
      ? `${article.title} - Savage Fortune Teller`
      : archetypeEntry?.[1].name
        ? `${archetypeEntry[1].name} - Savage Fortune Teller`
        : titles[cleanPath] ?? "Savage Fortune Teller";
  }, [article?.title, archetypeEntry, cleanPath]);

  if (article) {
    return (
      <main className="content-shell">
        <SiteNav />
        <article className="content-page">
          <p className="eyebrow">Astrology 101</p>
          <h1>{article.title}</h1>
          <p className="lede">{article.summary}</p>
          <p>{article.body}</p>
          <a className="text-link" href="/articles">Back to all articles</a>
        </article>
      </main>
    );
  }

  if (archetypeEntry) {
    const [code, profile] = archetypeEntry;
    return (
      <main className="content-shell">
        <SiteNav />
        <article className="content-page">
          <p className="eyebrow">Archetype dossier</p>
          <h1>{profile.name}</h1>
          <p className="lede">{profile.alias}</p>
          <div className="dossier-grid">
            {profile.image && <img src={profile.image} alt={profile.alias} />}
            <div>
              <p><b>Core curse:</b> {profile.curse ?? "A suspiciously specific chart pattern wearing a dramatic hat."}</p>
              <p><b>Social role:</b> {profile.role ?? "The person whose chart keeps entering rooms with lore."}</p>
              <p><b>Favorite bait:</b> {profile.bait ?? "Mistaking a repeated pattern for a personality brand."}</p>
              <p><b>Prescription:</b> {profile.prescription ?? "Make one real choice before the stars start charging consulting fees."}</p>
            </div>
          </div>
          <p>
            In scoring, this archetype is selected when chart features associated with {profile.name.toLowerCase()} rise above the others.
            The result is a roast, not a diagnosis, but the receipts come from actual placements, houses, and aspects.
          </p>
          <a className="text-link" href="/archetypes">Back to all archetypes</a>
        </article>
      </main>
    );
  }

  return (
    <main className="content-shell">
      <SiteNav />
      <section className="content-page">
        {cleanPath === "/method" && (
          <>
            <p className="eyebrow">Calculation method</p>
            <h1>How the roast is calculated</h1>
            <p className="lede">
              Savage Fortune Teller calculates a real birth chart first, then translates the loudest patterns into one of 12 roast archetypes.
            </p>
            <div className="method-steps">
              <article><b>1. Birth data</b><span>Date, time, birthplace, coordinates, and timezone are used to calculate the chart.</span></article>
              <article><b>2. Planet positions</b><span>Sun through Pluto, the North Node, Ascendant, Midheaven, houses, and major aspects are generated.</span></article>
              <article><b>3. Feature extraction</b><span>The app checks signatures like Saturn pressure, Mercury emphasis, water dominance, 8th-house intensity, and Node contacts.</span></article>
              <article><b>4. Archetype scoring</b><span>Each archetype has weighted rules. The highest score becomes the main roast, with secondary suspects shown below.</span></article>
            </div>
            <p>
              The language is savage for entertainment, but the structure is intentionally transparent. If the chart says Mercury is yelling, the result should show where Mercury was found yelling.
            </p>
          </>
        )}

        {cleanPath === "/articles" && (
          <>
            <p className="eyebrow">Astrology 101</p>
            <h1>Useful astrology, lightly unwell</h1>
            <p className="lede">Short guides for reading the receipts behind the roast.</p>
            <div className="article-list">
              {ARTICLES.map((item) => (
                <a href={`/articles/${item.slug}`} key={item.slug}>
                  <b>{item.title}</b>
                  <span>{item.summary}</span>
                </a>
              ))}
            </div>
          </>
        )}

        {cleanPath === "/archetypes" && (
          <>
            <p className="eyebrow">Archetypes</p>
            <h1>The 12 chart suspects</h1>
            <p className="lede">Each archetype is a comedic translation of repeated chart signatures.</p>
            <div className="archetype-list">
              {Object.entries(archetypeProfiles).map(([code, profile]) => (
                <a href={`/archetypes/${code}`} key={code}>
                  {profile.image && <img src={profile.image} alt="" />}
                  <b>{profile.alias}</b>
                  <span>{profile.name}</span>
                </a>
              ))}
            </div>
          </>
        )}

        {cleanPath === "/about" && (
          <>
            <p className="eyebrow">About</p>
            <h1>Astrology with receipts and poor impulse control</h1>
            <p className="lede">
              Savage Fortune Teller is a birth chart roast app for people who want the stars to be accurate, funny, and slightly out of pocket.
            </p>
            <p>
              The app combines calculated astrology placements with a custom archetype scoring model. It is built for entertainment and self-reflection, not medical, legal, financial, or psychological advice.
            </p>
            <div className="policy-links">
              <a href="/privacy"><ShieldCheck size={16} /> Privacy</a>
              <a href="/terms"><Scale size={16} /> Terms</a>
              <a href="/contact"><Mail size={16} /> Contact</a>
            </div>
          </>
        )}

        {cleanPath === "/privacy" && (
          <>
            <p className="eyebrow">Privacy</p>
            <h1>Privacy Policy</h1>
            <p className="lede">Birth details are used to generate the reading. The app should not ask for more personal information than the roast needs.</p>
            <p>
              When you create a reading, birth date, birth time, birthplace, coordinates, timezone, and generated result data may be sent to the API. Shared readings store the generated result and basic input details so the shared link can load later.
            </p>
            <p>
              If ads are shown, Google and other third-party vendors may use cookies to serve ads based on prior visits to this site or other sites. Users can manage personalized advertising through Google's Ads Settings.
            </p>
            <p>
              Do not enter information you consider highly sensitive. Future payment features should be handled by a payment processor; this site should not store full card numbers.
            </p>
          </>
        )}

        {cleanPath === "/terms" && (
          <>
            <p className="eyebrow">Terms</p>
            <h1>Terms of Use</h1>
            <p className="lede">Use this site for entertainment, reflection, and sending your friends a result that starts a group chat incident.</p>
            <p>
              Astrology readings on this site are not professional advice and should not be used for decisions involving health, safety, money, law, or emergencies. Results may be blunt, comedic, and intentionally dramatic.
            </p>
            <p>
              Do not misuse the sharing feature, attempt to break the service, or copy the site's original text and assets into a competing product without permission.
            </p>
          </>
        )}

        {cleanPath === "/contact" && (
          <>
            <p className="eyebrow">Contact</p>
            <h1>Contact</h1>
            <p className="lede">For bugs, privacy requests, partnership questions, or an archetype that personally offended your Moon sign, contact the site owner.</p>
            <p>
              Email: <a className="text-link" href="mailto:lotsofbears2@gmail.com">lotsofbears2@gmail.com</a>
            </p>
            <p>
              Before AdSense submission, make sure this address is an inbox you actually control. The stars cannot receive compliance email on your behalf.
            </p>
          </>
        )}

        {!["/method", "/articles", "/archetypes", "/about", "/privacy", "/terms", "/contact"].includes(cleanPath) && (
          <>
            <p className="eyebrow">Lost page</p>
            <h1>This page wandered into the 12th house.</h1>
            <p className="lede">Try the roast again or read the astrology guide while the page collects itself.</p>
            <a className="text-link" href="/">Return home</a>
          </>
        )}
      </section>
    </main>
  );
}

function App() {
  const initialPath = window.location.pathname.replace(/\/$/, "") || "/";
  const isSharedReadingPath = initialPath.startsWith("/r/");
  const isStaticPage = !isSharedReadingPath && initialPath !== "/";

  const [birthDate, setBirthDate] = React.useState("2000-01-01");
  const [birthTime, setBirthTime] = React.useState("12:00");
  const [locationQuery, setLocationQuery] = React.useState(`${defaultLocation.city}, ${defaultLocation.country}`);
  const [selectedLocation, setSelectedLocation] = React.useState<LocationOption | null>(defaultLocation);
  const [suggestions, setSuggestions] = React.useState<LocationOption[]>([]);
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [reading, setReading] = React.useState<ReadingResponse>(demoReading);
  const [hasReading, setHasReading] = React.useState(false);
  const [isRevealing, setIsRevealing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [shareLoading, setShareLoading] = React.useState(false);
  const [shareLink, setShareLink] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [premiumNotice, setPremiumNotice] = React.useState(false);
  const [error, setError] = React.useState("");

  if (isStaticPage) {
    return <StaticPage path={initialPath} />;
  }

  React.useEffect(() => {
    const query = locationQuery.trim();
    const selectedLabel = selectedLocation ? `${selectedLocation.city}, ${selectedLocation.country}` : "";

    if (query.length < 2 || query === selectedLabel) {
      setSuggestions([]);
      setLocationLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLocationLoading(true);

      const params = new URLSearchParams({ city: query, limit: "8" });

      fetch(`${API_BASE_URL}/locations/search?${params.toString()}`, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Location search failed with HTTP ${response.status}.`);
          }
          return response.json() as Promise<LocationSearchResponse>;
        })
        .then((data) => {
          const remoteLocations = data.locations ?? (data.location ? [data.location] : []);
          const nextSuggestions = remoteLocations.map(toLocationOption);

          if (nextSuggestions.length > 0) {
            setSuggestions(nextSuggestions);
            return;
          }

          setSuggestions(
            fallbackLocations.filter((location) =>
              `${location.city}, ${location.country}`.toLowerCase().includes(query.toLowerCase()),
            ),
          );
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }

          setSuggestions(
            fallbackLocations.filter((location) =>
              `${location.city}, ${location.country}`.toLowerCase().includes(query.toLowerCase()),
            ),
          );
        })
        .finally(() => setLocationLoading(false));
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [locationQuery, selectedLocation]);

  React.useEffect(() => {
    const match = window.location.pathname.match(/^\/r\/([^/]+)$/);
    if (!match) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setHasReading(false);
    setIsRevealing(false);
    setError("");

    fetch(`${API_BASE_URL}/shares/${encodeURIComponent(match[1])}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`That shared reading vanished with HTTP ${response.status}.`);
        }

        return response.json() as Promise<ShareResponse>;
      })
      .then((data) => {
        if (cancelled) {
          return;
        }

        setReading(data.result_payload);
        setHasReading(true);
        setShareLink(window.location.href);
        if (data.input) {
          setBirthDate(data.input.birth_date ?? birthDate);
          setBirthTime(data.input.birth_time ?? birthTime);
          const city = data.input.birth_city;
          const country = data.input.birth_country;
          if (city && country) {
            setLocationQuery(`${city}, ${country}`);
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "The shared reading refused to appear.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function chooseLocation(location: LocationOption) {
    setSelectedLocation(location);
    setLocationQuery(`${location.city}, ${location.country}`);
    setSuggestions([]);
    setError("");
  }

  async function requestReading(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!isValidIsoDate(birthDate)) {
      setError("Use YYYY-MM-DD for the birth date. The stars are dramatic, not psychic about formats.");
      return;
    }

    if (!isValidTime(birthTime)) {
      setError("Use 24-hour HH:MM time. The oracle refuses to parse vibes o'clock.");
      return;
    }

    if (!selectedLocation || locationQuery !== `${selectedLocation.city}, ${selectedLocation.country}`) {
      setError("Choose a city from the suggestions so coordinates can be filled automatically.");
      return;
    }

    const ritualStartedAt = Date.now();
    setLoading(true);
    setHasReading(false);
    setIsRevealing(false);
    setShareLink("");
    setCopied(false);
    setPremiumNotice(false);

    try {
      const response = await fetch(`${API_BASE_URL}/readings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth_date: birthDate,
          birth_time: birthTime,
          birth_city: selectedLocation.city,
          birth_country: selectedLocation.country,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          timezone: selectedLocation.timezone,
        }),
      });

      if (!response.ok) {
        throw new Error(`The oracle coughed up HTTP ${response.status}.`);
      }

      const nextReading = (await response.json()) as ReadingResponse;
      const elapsed = Date.now() - ritualStartedAt;
      await wait(Math.max(1400 - elapsed, 0));
      setIsRevealing(true);
      await wait(620);
      setReading(nextReading);
      setHasReading(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The oracle refused to cooperate.");
    } finally {
      setLoading(false);
      setIsRevealing(false);
    }
  }

  async function copyToClipboard(value: string) {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function createShareLink() {
    setShareLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch(`${API_BASE_URL}/shares`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          result_payload: reading,
          input: {
            birth_date: birthDate,
            birth_time: birthTime,
            birth_city: selectedLocation?.city ?? "",
            birth_country: selectedLocation?.country ?? "",
          },
          source: "web",
        }),
      });

      if (!response.ok) {
        throw new Error(`The share spell fizzled with HTTP ${response.status}.`);
      }

      const data = (await response.json()) as ShareCreateResponse;
      const nextShareLink = data.share_url ?? `${window.location.origin}${data.share_path}`;
      setShareLink(nextShareLink);

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Savage Fortune Teller",
            text: reading.primary_type.share_text,
            url: nextShareLink,
          });
        } catch (shareError) {
          if (!(shareError instanceof DOMException && shareError.name === "AbortError")) {
            throw shareError;
          }
        }
      } else {
        await copyToClipboard(nextShareLink);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "The share link refused to materialize.");
    } finally {
      setShareLoading(false);
    }
  }

  function startNewReading() {
    setHasReading(false);
    setIsRevealing(false);
    setLoading(false);
    setShareLink("");
    setCopied(false);
    setPremiumNotice(false);
    setError("");

    if (window.location.pathname.startsWith("/r/")) {
      window.history.pushState({}, "", "/");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const active = getActiveProfile(reading);
  const scoreMap: Record<string, { label: string; score: number }> = reading.all_archetype_scores ?? {};
  const scores = Object.entries(scoreMap).sort((a, b) => b[1].score - a[1].score);
  const isResultMode = loading || isRevealing || hasReading;

  return (
    <main className={isResultMode ? "shell shell-result-mode" : "shell"}>
      {!isResultMode && (
      <section className="oracle-panel">
        <SiteNav />
        <div className="brand">
          <span className="brand-mark">SFT</span>
          <div>
            <p className="eyebrow">Savage Fortune Teller</p>
            <h1>Birth Chart Roast</h1>
          </div>
        </div>

        <form className="birth-form" onSubmit={requestReading}>
          <label>
            <span>
              <CalendarDays size={15} /> Birth date <em>required</em>
            </span>
            <input
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              type="date"
              aria-label="Birth date"
            />
          </label>
          <label>
            <span>
              <Clock3 size={15} /> Birth time <em>required</em>
            </span>
            <div className="time-selects" aria-label="Birth time">
              <select
                value={birthTime.split(":")[0] ?? "00"}
                onChange={(event) => setBirthTime((value) => updateTimePart(value, "hour", event.target.value))}
                aria-label="Birth hour in 24-hour format"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
              <span>:</span>
              <select
                value={birthTime.split(":")[1] ?? "00"}
                onChange={(event) => setBirthTime((value) => updateTimePart(value, "minute", event.target.value))}
                aria-label="Birth minute"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>{minute}</option>
                ))}
              </select>
            </div>
          </label>
          <label className="wide location-field">
            <span>
              <MapPin size={15} /> Birthplace <em>choose from list</em>
            </span>
            <div className="location-input-wrap">
              <Search size={16} />
              <input
                value={locationQuery}
                onChange={(event) => {
                  setLocationQuery(event.target.value);
                  setSelectedLocation(null);
                }}
                placeholder="Start typing any city..."
                aria-label="Birthplace search"
              />
            </div>
            {suggestions.length > 0 && locationQuery !== `${selectedLocation?.city}, ${selectedLocation?.country}` && (
              <div className="suggestions">
                {suggestions.map((location) => (
                  <button key={location.id} type="button" onClick={() => chooseLocation(location)}>
                    <strong>{location.normalized_query ?? `${location.city}, ${location.country}`}</strong>
                    <span>{location.timezone}{location.source ? ` - ${location.source}` : ""}</span>
                  </button>
                ))}
              </div>
            )}
          </label>

          <div className="auto-coordinates wide">
            <span>{locationLoading ? "Searching birthplace..." : "Coordinates are auto-filled from birthplace."}</span>
            <b>{selectedLocation ? `${selectedLocation.latitude}, ${selectedLocation.longitude}` : "Select a city"}</b>
            <b>{selectedLocation?.timezone ?? "Timezone pending"}</b>
          </div>

          <button type="submit" disabled={loading}>
            <Sparkles size={18} />
            {loading ? "Summoning" : "Roast me"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}
      </section>
      )}

      <section className={hasReading ? "result-panel result-panel-expanded" : "result-panel result-panel-empty"}>
        {loading || isRevealing ? (
          <div className="ritual-panel" aria-live="polite">
            <div className={isRevealing ? "tarot-back revealing" : "tarot-back"}>
              <span>SFT</span>
            </div>
            <p className="eyebrow">Consulting the chart</p>
            <h2>The card is turning.</h2>
            <p>
              Coordinates are being translated into cosmic evidence. Please remain seated while the universe prepares its testimony.
            </p>
          </div>
        ) : !hasReading ? (
          <div className="intro-panel">
            <div className="tarot-back">
              <span>SFT</span>
            </div>
            <p className="eyebrow">Private until summoned</p>
            <h2>Enter the birth details. The roast stays hidden until the card turns.</h2>
            <p>
              No type, no verdict, no spoilers. Just a sealed chart waiting to become everyone else's problem.
            </p>
          </div>
        ) : (
          <>
        <article className="result-card">
          <div className="portrait-frame">
            {active.image ? (
              <img src={active.image} alt={reading.primary_type.viral_alias} />
            ) : (
              <div className="portrait-placeholder">
                <span>SFT</span>
                <b>{reading.primary_type.result_badge}</b>
              </div>
            )}
          </div>
          <div className="result-copy">
            <p className="score">{reading.primary_type.score}% - {reading.primary_type.result_badge}</p>
            <h2>{reading.primary_type.viral_alias}</h2>
            <p className="official-name">{reading.primary_type.label}</p>
            <p className="headline">{reading.primary_type.headline}</p>


            <div className="result-actions">
              <button
                className="share-button"
                type="button"
                onClick={createShareLink}
                disabled={shareLoading}
              >
                <Share2 size={17} />
                {shareLoading ? "Creating link" : "Share result"}
              </button>
              <button
                className="pdf-button"
                type="button"
                onClick={() => setPremiumNotice(true)}
              >
                <FileDown size={17} />
                PDF report - $2
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={startNewReading}
              >
                <Sparkles size={17} />
                New roast
              </button>
            </div>
            {premiumNotice && (
              <p className="premium-note">
                Premium PDF is being kept behind the velvet rope for now. Payment and download access are coming soon.
              </p>
            )}
            {shareLink && (
              <div className="share-tools">
                <div className="share-url" title={shareLink}>
                  {shareLink}
                </div>
                <button type="button" onClick={() => copyToClipboard(shareLink)} aria-label="Copy share link">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(reading.primary_type.share_text)}&url=${encodeURIComponent(shareLink)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  X
                </a>
              </div>
            )}
          </div>
        </article>

        <ChartEvidence result={reading} />

        {scores.length > 0 && (
          <details className="score-board">
            <summary>Other chart suspects</summary>
            <div className="score-list">
              {scores.map(([code, value]) => (
                <div className="score-row" key={code}>
                  <span>{archetypeProfiles[code as ArchetypeCode]?.alias ?? value.label}</span>
                  <div>
                    <i style={{ width: `${Math.max(value.score, 8)}%` }} />
                  </div>
                  <b>{value.score}%</b>
                </div>
              ))}
            </div>
          </details>
        )}

        <div className="section-grid">
          {Object.entries(reading.section_titles).map(([key, title]) => (
            <article className="reading-section" key={key}>
              <h3>{title}</h3>
              <p>{reading.sections[key]}</p>
            </article>
          ))}
        </div>
        <footer className="site-footer">
          <a href="/method">Method</a>
          <a href="/articles">Astrology 101</a>
          <a href="/archetypes">Archetypes</a>
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </footer>
          </>
        )}
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
