import React from "react";
import ReactDOM from "react-dom/client";
import {
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Coins,
  Copy,
  Heart,
  HelpCircle,
  Landmark,
  Home,
  Mail,
  MapPin,
  Moon,
  Orbit,
  Scale,
  Search,
  Share2,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Sun,
  Telescope,
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

type LoveReadingResponse = {
  primary_love_type: {
    code: string;
    label: string;
    viral_alias: string;
    result_badge: string;
    headline: string;
    score: number;
    matched_features?: string[];
  };
  section_titles: Record<string, string>;
  sections: Record<string, string>;
  all_love_scores?: Record<string, { label: string; viral_alias: string; score: number }>;
  chart?: ChartResponse;
};

type ThemedPrimaryResult = {
  code: string;
  label: string;
  viral_alias: string;
  result_badge: string;
  headline: string;
  score: number;
  matched_features?: string[];
};

type ThemedReadingResponse = {
  primary_money_type?: ThemedPrimaryResult;
  primary_career_type?: ThemedPrimaryResult;
  primary_energy_type?: ThemedPrimaryResult;
  section_titles: Record<string, string>;
  sections: Record<string, string>;
  all_money_scores?: Record<string, ThemedPrimaryResult>;
  all_career_scores?: Record<string, ThemedPrimaryResult>;
  all_energy_scores?: Record<string, ThemedPrimaryResult>;
  chart?: ChartResponse;
};

type ThemedPrimaryKey = "primary_money_type" | "primary_career_type" | "primary_energy_type";

type ThemedReadingPageConfig = {
  slug: string;
  endpoint: string;
  primaryKey: ThemedPrimaryKey;
  eyebrow: string;
  title: string;
  lede: string;
  coordinateCopy: string;
  submitLabel: string;
  loadingLabel: string;
  loadingCopy: string;
  errorPrefix: string;
  fallbackError: string;
  focusPoints: Array<{ key: string; label: string; icon: "heart" | "coins" | "landmark" | "moon" | "sparkles" | "sun" }>;
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

type ServiceCard = {
  slug: string;
  name: string;
  shortName: string;
  badge: string;
  summary: string;
  science: string;
  status: "live" | "free" | "next";
};

type FortuneCard = {
  name: string;
  subtitle: string;
  verdict: string;
  receipt: string;
  advice: string;
  spriteIndex: number;
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

const SERVICES: ServiceCard[] = [
  {
    slug: "birth-chart-roast",
    name: "Birth Chart Roast",
    shortName: "Roast",
    badge: "live",
    summary: "Your full chart gets processed into one main archetype, Big 3 receipts, and a verdict rude enough to be useful.",
    science: "Uses Sun, Moon, Ascendant, houses, major aspects, element/modality balance, and weighted archetype rules.",
    status: "live",
  },
  {
    slug: "daily-card",
    name: "Daily Card Pull",
    shortName: "Daily Card",
    badge: "live",
    summary: "A tarot-ish one-card omen for the day. No mystical invoice, just a tiny symbolic slap on the wrist.",
    science: "Uses a seeded card deck and archetypal meanings; good for mood, not life-changing paperwork.",
    status: "free",
  },
  {
    slug: "love-life-roast",
    name: "Love Life Roast",
    shortName: "Love",
    badge: "live",
    summary: "A Venus/Mars/Moon audit for people who call chemistry destiny because calm feels underproduced.",
    science: "Reads Venus, Mars, Moon, 5th/7th/8th houses, and Venus-Mars or Moon-Pluto style contacts.",
    status: "live",
  },
  {
    slug: "money-curse-reading",
    name: "Money Curse Reading",
    shortName: "Money",
    badge: "live",
    summary: "A financial pattern roast for the part of your chart that keeps buying emotional support objects.",
    science: "Reads the 2nd house, 8th house, Venus, Jupiter, Saturn, and security-vs-risk signatures.",
    status: "live",
  },
  {
    slug: "career-villain-arc",
    name: "Career Villain Arc",
    shortName: "Career",
    badge: "live",
    summary: "Career weather for people whose ambition has lore, enemies, and a suspiciously cinematic delay.",
    science: "Reads Sun, Saturn, Midheaven, 10th house, 6th house, and public-purpose signatures.",
    status: "live",
  },
  {
    slug: "energy-damage-forecast",
    name: "Energy Damage Forecast",
    shortName: "Energy",
    badge: "live",
    summary: "A non-medical burnout-pattern roast for the part of your chart that keeps ignoring its own battery warning.",
    science: "Reads Moon, Mars, Saturn, 6th/12th houses, element balance, and pressure-vs-recovery signatures.",
    status: "live",
  },
];

const FORTUNE_CARDS: FortuneCard[] = [
  {
    name: "The Unread Text",
    subtitle: "Mercury in the witness protection program",
    verdict: "Today, the message you are avoiding has built a small apartment in your nervous system.",
    receipt: "Mercury rules messages, timing, and the little mental courtroom where you keep cross-examining punctuation.",
    advice: "Reply, archive, or delete. Do not let a notification become your landlord.",
    spriteIndex: 0,
  },
  {
    name: "The Financial Denial",
    subtitle: "Venus holding a receipt behind her back",
    verdict: "Your taste is expensive and your budget is pretending not to recognize you in public.",
    receipt: "Venus speaks to pleasure and value; Saturn asks whether the pleasure has a repayment plan.",
    advice: "Buy the thing only if tomorrow-you would not call today-you a charming criminal.",
    spriteIndex: 3,
  },
  {
    name: "The Situationship Tower",
    subtitle: "Mars, Venus, and bad structural engineering",
    verdict: "Something vague wants to collapse into clarity. Annoying, but architecturally necessary.",
    receipt: "Mars wants action, Venus wants sweetness, and hard aspects prefer truth with a dramatic entrance.",
    advice: "Ask the direct question. Mystery is cute until it starts charging emotional rent.",
    spriteIndex: 1,
  },
  {
    name: "The Main Character Invoice",
    subtitle: "Sun in premium visibility mode",
    verdict: "You want the spotlight, but the spotlight would like to see a plan.",
    receipt: "The Sun describes expression and identity; the 10th house asks what the public version can actually deliver.",
    advice: "Make one visible move before narrating the entire comeback documentary.",
    spriteIndex: 4,
  },
  {
    name: "The Boundary Funeral",
    subtitle: "Neptune brought fog and no paperwork",
    verdict: "Someone else's mood may attempt to enter your bloodstream today. Deny entry politely.",
    receipt: "Neptune blurs edges; the Moon absorbs atmosphere; the 12th house keeps receipts in a locked basement.",
    advice: "If it is not your feeling, do not adopt it just because it looked cold outside.",
    spriteIndex: 5,
  },
  {
    name: "The Saturn Clipboard",
    subtitle: "Cosmic HR has entered the chat",
    verdict: "A boring task is probably the hinge of the day. Deeply offensive, unfortunately true.",
    receipt: "Saturn rules structure, delay, responsibility, and the part of maturity nobody puts on mood boards.",
    advice: "Do the unglamorous thing first. Then be mysterious and hot afterward.",
    spriteIndex: 2,
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this real astrology or just a funny personality test?",
    answer:
      "The roast starts from real chart data: birth time, birthplace, planets, houses, Ascendant, Midheaven, and major aspects. The delivery is comedic; the receipts are not imaginary confetti.",
  },
  {
    question: "Why do you need birth time?",
    answer:
      "Birth time changes the Ascendant and houses, which are huge for Big 3, career, relationships, and the exact location of the emotional crime scene. If the time is wrong, the roast may still be funny but less precise.",
  },
  {
    question: "What if I do not know my birth time?",
    answer:
      "Use noon only as a placeholder and treat the result as soft evidence. Sun-sign and some planet placements may still work, but Ascendant and house-based receipts become shaky.",
  },
  {
    question: "Is this advice?",
    answer:
      "No. This is entertainment and reflection, not medical, legal, financial, or mental-health advice. If a result changes your life, please blame your choices, not our decorative candle budget.",
  },
  {
    question: "Why is the tone savage?",
    answer:
      "Because gentle horoscopes already exist and they have enough throw pillows. The goal is funny, memorable, and a little too accurate, without pretending the stars are a licensed therapist.",
  },
  {
    question: "Will there be love, money, career, and energy readings?",
    answer:
      "Yes. The site is expanding into separate chart lanes, but the plan is to keep each result short, shareable, and receipt-based instead of turning into a 40-page mystical dishwasher manual.",
  },
  {
    question: "Do you store my birth details?",
    answer:
      "Readings are sent to the API to calculate the chart. Shared links store the generated result and basic input details so the link can load. Do not enter information you consider highly sensitive.",
  },
  {
    question: "Why do some pages explain astrology if the site is a meme?",
    answer:
      "Because a roast is funnier when it has evidence. The explanations are there to show the system is chart-based, not to trap you in a beige educational hallway.",
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

function getServiceIcon(slug: string) {
  if (slug.includes("love")) {
    return <Heart size={18} />;
  }
  if (slug.includes("money")) {
    return <Coins size={18} />;
  }
  if (slug.includes("career")) {
    return <Landmark size={18} />;
  }
  if (slug.includes("energy")) {
    return <Sparkles size={18} />;
  }
  if (slug.includes("daily")) {
    return <Shuffle size={18} />;
  }
  return <Telescope size={18} />;
}

function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Site navigation">
      <a className="home-rune" href="/" aria-label="Savage Fortune Teller home">SFT</a>
      <a href="/"><Home size={15} /> Roast</a>
      <a href="/readings"><Telescope size={15} /> Readings</a>
      <a href="/daily-card"><Shuffle size={15} /> Daily Card</a>
      <a href="/faq"><HelpCircle size={15} /> FAQ</a>
      <a href="/method"><Orbit size={15} /> Method</a>
    </nav>
  );
}

function ServiceGrid() {
  return (
    <div className="service-grid">
      {SERVICES.map((service) => {
        const href = service.slug === "birth-chart-roast" ? "/" : `/${service.slug}`;
        return (
          <a href={href} key={service.slug}>
            <span className="service-icon">{getServiceIcon(service.slug)}</span>
            <em>{service.badge}</em>
            <span className="free-rite">Free beta</span>
            <b>{service.name}</b>
            <p>{service.summary}</p>
            <small>{service.science}</small>
          </a>
        );
      })}
    </div>
  );
}

function getTarotSpriteStyle(spriteIndex: number) {
  const column = spriteIndex % 3;
  const row = Math.floor(spriteIndex / 3);
  return {
    "--sprite-x": `${column * 50}%`,
    "--sprite-y": `${row * 100}%`,
  } as React.CSSProperties;
}

const dailyCardPositions = [
  [6, 42, -18],
  [12, 36, -14],
  [18, 39, -10],
  [24, 34, -7],
  [30, 38, -4],
  [36, 33, -1],
  [42, 37, 3],
  [48, 32, 6],
  [54, 36, 9],
  [60, 31, 12],
  [66, 35, 15],
  [72, 30, 18],
  [10, 50, -16],
  [22, 48, -9],
  [34, 50, -3],
  [46, 47, 5],
  [58, 49, 11],
  [70, 46, 17],
];

function DailyCardPull() {
  const [cardIndex, setCardIndex] = React.useState<number | null>(null);
  const card = cardIndex === null ? null : FORTUNE_CARDS[cardIndex % FORTUNE_CARDS.length];

  function chooseCard(index: number) {
    setCardIndex(index);
  }

  return (
    <div className={card ? "daily-card-tool has-card" : "daily-card-tool"}>
      <div className={card ? "tarot-spread has-selection" : "tarot-spread"} aria-label="Choose one SFT card">
        {dailyCardPositions.map(([x, y, tilt], index) => {
          const item = FORTUNE_CARDS[index % FORTUNE_CARDS.length];
          return (
          <button
            className={cardIndex === index ? "tarot-choice selected" : "tarot-choice"}
            key={`${item.name}-${index}`}
            type="button"
            onClick={() => chooseCard(index)}
            style={{
              ...getTarotSpriteStyle(item.spriteIndex),
              "--card-x": `${x}%`,
              "--card-y": `${y}%`,
              "--fan-tilt": `${tilt}deg`,
            } as React.CSSProperties}
            aria-label="Pull one face-down SFT card"
          >
            <span className="tarot-image" />
            <span className="sr-only">{item.name}</span>
          </button>
        )})}
        <div className="daily-table-prompt">
          <p className="eyebrow">{card ? "Card pulled" : "Choose one"}</p>
          <h2>{card ? "The card has turned." : "Pick a card from the table."}</h2>
          <p>{card ? "The front is awake. Unfortunately, so is the advice." : "They all look innocent from the back. This is how they get you."}</p>
        </div>
      </div>
      {card && (
        <div className="daily-card-copy">
          <p className="eyebrow">Today&apos;s symbolic evidence</p>
          <div className="drawn-card active">
            <span className="drawn-card-image" style={getTarotSpriteStyle(card.spriteIndex)} />
            <div>
              <h2>{card.name}</h2>
              <p>{card.subtitle}</p>
            </div>
          </div>
          <h3>{card.verdict}</h3>
          <p><b>Receipt:</b> {card.receipt}</p>
          <p><b>Court-ordered advice:</b> {card.advice}</p>
          <button type="button" className="secondary-button" onClick={() => setCardIndex(null)}>
            <Shuffle size={17} />
            Reset the spread
          </button>
        </div>
      )}
    </div>
  );
}

function ServiceLoadingPanel({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="ritual-panel service-loading-panel" aria-live="polite">
      <div className="tarot-back revealing">
        <span>SFT</span>
      </div>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}

const THEMED_READING_CONFIGS: Record<string, ThemedReadingPageConfig> = {
  "money-curse-reading": {
    slug: "money-curse-reading",
    endpoint: "/money-readings",
    primaryKey: "primary_money_type",
    eyebrow: "Money Curse Reading",
    title: "Your financial pattern, dragged with chart receipts.",
    lede: "A separate 2nd/8th house, Venus, Jupiter, and Saturn reading for spending habits, scarcity scripts, and emotional checkout decisions.",
    coordinateCopy: "Venus, Jupiter, Saturn, and money houses need coordinates.",
    submitLabel: "Audit my money curse",
    loadingLabel: "Auditing the bank account aura",
    loadingCopy: "Venus is checking the receipts. Jupiter is exaggerating. Saturn has opened a spreadsheet and nobody is safe.",
    errorPrefix: "The money court returned",
    fallbackError: "The money court refused to open the books.",
    focusPoints: [
      { key: "venus", label: "Venus", icon: "heart" },
      { key: "jupiter", label: "Jupiter", icon: "sparkles" },
      { key: "saturn", label: "Saturn", icon: "coins" },
    ],
  },
  "career-villain-arc": {
    slug: "career-villain-arc",
    endpoint: "/career-readings",
    primaryKey: "primary_career_type",
    eyebrow: "Career Villain Arc",
    title: "Your ambition has a plot. The chart has notes.",
    lede: "A separate Sun/Saturn/Midheaven reading for public image, work pressure, reputation, and the part of you that wants a dramatic chair turn.",
    coordinateCopy: "Sun, Saturn, Midheaven, and work houses need coordinates.",
    submitLabel: "Roast my career arc",
    loadingLabel: "Reviewing your public file",
    loadingCopy: "The Midheaven is being questioned under candlelight. Your ambition has requested legal representation.",
    errorPrefix: "The career board returned",
    fallbackError: "The career board tabled your case.",
    focusPoints: [
      { key: "sun", label: "Sun", icon: "sun" },
      { key: "saturn", label: "Saturn", icon: "landmark" },
      { key: "mc", label: "Midheaven", icon: "sparkles" },
    ],
  },
  "energy-damage-forecast": {
    slug: "energy-damage-forecast",
    endpoint: "/energy-readings",
    primaryKey: "primary_energy_type",
    eyebrow: "Energy Damage Forecast",
    title: "Burnout weather, not medical advice.",
    lede: "A separate Moon/Mars/Saturn reading for stress patterns, recovery style, pressure habits, and the battery warning you keep negotiating with.",
    coordinateCopy: "Moon, Mars, Saturn, and pressure houses need coordinates.",
    submitLabel: "Forecast my damage",
    loadingLabel: "Checking the burnout weather",
    loadingCopy: "Moon, Mars, and Saturn are arguing over whether this is stress, drama, or a lifestyle brand.",
    errorPrefix: "The energy desk returned",
    fallbackError: "The energy desk went offline.",
    focusPoints: [
      { key: "moon", label: "Moon", icon: "moon" },
      { key: "mars", label: "Mars", icon: "sparkles" },
      { key: "saturn", label: "Saturn", icon: "coins" },
    ],
  },
};

function renderThemeIcon(icon: ThemedReadingPageConfig["focusPoints"][number]["icon"], size = 20) {
  if (icon === "heart") return <Heart size={size} />;
  if (icon === "coins") return <Coins size={size} />;
  if (icon === "landmark") return <Landmark size={size} />;
  if (icon === "moon") return <Moon size={size} />;
  if (icon === "sun") return <Sun size={size} />;
  return <Sparkles size={size} />;
}

function ThemedReadingPage({ config }: { config: ThemedReadingPageConfig }) {
  const [birthDate, setBirthDate] = React.useState("2000-01-01");
  const [birthTime, setBirthTime] = React.useState("12:00");
  const [locationQuery, setLocationQuery] = React.useState(`${defaultLocation.city}, ${defaultLocation.country}`);
  const [selectedLocation, setSelectedLocation] = React.useState<LocationOption | null>(defaultLocation);
  const [suggestions, setSuggestions] = React.useState<LocationOption[]>([]);
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [themeReading, setThemeReading] = React.useState<ThemedReadingResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

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
          if (!response.ok) throw new Error(`Location search failed with HTTP ${response.status}.`);
          return response.json() as Promise<LocationSearchResponse>;
        })
        .then((data) => {
          const remoteLocations = data.locations ?? (data.location ? [data.location] : []);
          const nextSuggestions = remoteLocations.map(toLocationOption);
          setSuggestions(
            nextSuggestions.length > 0
              ? nextSuggestions
              : fallbackLocations.filter((location) =>
                  `${location.city}, ${location.country}`.toLowerCase().includes(query.toLowerCase()),
                ),
          );
        })
        .catch(() => {
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

  function chooseThemeLocation(location: LocationOption) {
    setSelectedLocation(location);
    setLocationQuery(`${location.city}, ${location.country}`);
    setSuggestions([]);
    setError("");
  }

  async function requestThemeReading(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!isValidIsoDate(birthDate)) {
      setError("Use YYYY-MM-DD for the birth date. The stars tolerate drama, not broken formats.");
      return;
    }

    if (!isValidTime(birthTime)) {
      setError("Use 24-hour HH:MM time. Vibes o'clock is not a timezone.");
      return;
    }

    if (!selectedLocation || locationQuery !== `${selectedLocation.city}, ${selectedLocation.country}`) {
      setError("Choose a city from the suggestions so the chart knows where the incident happened.");
      return;
    }

    const ritualStartedAt = Date.now();
    setLoading(true);
    setThemeReading(null);

    try {
      const response = await fetch(`${API_BASE_URL}${config.endpoint}`, {
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
        throw new Error(`${config.errorPrefix} HTTP ${response.status}.`);
      }

      const nextReading = (await response.json()) as ThemedReadingResponse;
      const elapsed = Date.now() - ritualStartedAt;
      await wait(Math.max(1200 - elapsed, 0));
      setThemeReading(nextReading);
    } catch (err) {
      setError(err instanceof Error ? err.message : config.fallbackError);
    } finally {
      setLoading(false);
    }
  }

  const primary = themeReading?.[config.primaryKey];

  return (
    <main className="content-shell">
      <SiteNav />
      <section className="content-page service-workspace">
        <p className="eyebrow">{config.eyebrow}</p>
        <h1>{config.title}</h1>
        <p className="lede">{config.lede}</p>

        <form className="birth-form service-form" onSubmit={requestThemeReading}>
          <label>
            <span><CalendarDays size={15} /> Birth date <em>required</em></span>
            <input value={birthDate} onChange={(event) => setBirthDate(event.target.value)} type="date" aria-label="Birth date" />
          </label>
          <label>
            <span><Clock3 size={15} /> Birth time <em>required</em></span>
            <div className="time-selects" aria-label="Birth time">
              <select value={birthTime.split(":")[0] ?? "00"} onChange={(event) => setBirthTime((value) => updateTimePart(value, "hour", event.target.value))}>
                {hourOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
              </select>
              <span>:</span>
              <select value={birthTime.split(":")[1] ?? "00"} onChange={(event) => setBirthTime((value) => updateTimePart(value, "minute", event.target.value))}>
                {minuteOptions.map((minute) => <option key={minute} value={minute}>{minute}</option>)}
              </select>
            </div>
          </label>
          <label className="wide location-field">
            <span><MapPin size={15} /> Birthplace <em>choose from list</em></span>
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
                  <button key={location.id} type="button" onClick={() => chooseThemeLocation(location)}>
                    <strong>{location.normalized_query ?? `${location.city}, ${location.country}`}</strong>
                    <span>{location.timezone}{location.source ? ` - ${location.source}` : ""}</span>
                  </button>
                ))}
              </div>
            )}
          </label>

          <div className="auto-coordinates wide">
            <span>{locationLoading ? "Searching birthplace..." : config.coordinateCopy}</span>
            <b>{selectedLocation ? `${selectedLocation.latitude}, ${selectedLocation.longitude}` : "Select a city"}</b>
            <b>{selectedLocation?.timezone ?? "Timezone pending"}</b>
          </div>

          <button type="submit" disabled={loading}>
            {getServiceIcon(config.slug)}
            {loading ? config.loadingLabel : config.submitLabel}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {loading && (
          <ServiceLoadingPanel
            eyebrow={config.eyebrow}
            title={config.loadingLabel}
            copy={config.loadingCopy}
          />
        )}

        {themeReading && primary && !loading && (
          <section className="service-result">
            <p className="score">{primary.score}% - {primary.result_badge}</p>
            <h2>{primary.viral_alias}</h2>
            <p className="official-name">{primary.label}</p>
            <p className="headline">{primary.headline}</p>

            <div className="big-three love-three">
              {config.focusPoints.map((point) => {
                const body = themeReading.chart?.planets[point.key] ?? themeReading.chart?.angles[point.key];
                return (
                  <article key={point.key}>
                    {renderThemeIcon(point.icon)}
                    <span>{point.label}</span>
                    <b>{formatPlacement(body)}</b>
                  </article>
                );
              })}
            </div>

            <div className="section-grid">
              {Object.entries(themeReading.section_titles).map(([key, title]) => (
                <article className="reading-section" key={key}>
                  <h3>{title}</h3>
                  <p>{themeReading.sections[key]}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function LoveLifeRoastPage() {
  const [birthDate, setBirthDate] = React.useState("2000-01-01");
  const [birthTime, setBirthTime] = React.useState("12:00");
  const [locationQuery, setLocationQuery] = React.useState(`${defaultLocation.city}, ${defaultLocation.country}`);
  const [selectedLocation, setSelectedLocation] = React.useState<LocationOption | null>(defaultLocation);
  const [suggestions, setSuggestions] = React.useState<LocationOption[]>([]);
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [loveReading, setLoveReading] = React.useState<LoveReadingResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

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

          setSuggestions(
            nextSuggestions.length > 0
              ? nextSuggestions
              : fallbackLocations.filter((location) =>
                  `${location.city}, ${location.country}`.toLowerCase().includes(query.toLowerCase()),
                ),
          );
        })
        .catch(() => {
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

  function chooseLoveLocation(location: LocationOption) {
    setSelectedLocation(location);
    setLocationQuery(`${location.city}, ${location.country}`);
    setSuggestions([]);
    setError("");
  }

  async function requestLoveReading(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!isValidIsoDate(birthDate)) {
      setError("Use YYYY-MM-DD for the birth date. Venus is dramatic, not format-blind.");
      return;
    }

    if (!isValidTime(birthTime)) {
      setError("Use 24-hour HH:MM time. The relationship court rejects vibes o'clock.");
      return;
    }

    if (!selectedLocation || locationQuery !== `${selectedLocation.city}, ${selectedLocation.country}`) {
      setError("Choose a city from the suggestions so Venus knows where the crime scene happened.");
      return;
    }

    const ritualStartedAt = Date.now();
    setLoading(true);
    setLoveReading(null);

    try {
      const response = await fetch(`${API_BASE_URL}/love-readings`, {
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
        throw new Error(`The love court returned HTTP ${response.status}.`);
      }

      const nextReading = (await response.json()) as LoveReadingResponse;
      const elapsed = Date.now() - ritualStartedAt;
      await wait(Math.max(1200 - elapsed, 0));
      setLoveReading(nextReading);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The love court refused to convene.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="content-shell">
      <SiteNav />
      <section className="content-page service-workspace">
        <p className="eyebrow">Love Life Roast</p>
        <h1>Romantic pattern recognition, but make it prosecutable.</h1>
        <p className="lede">
          A separate Venus/Mars/Moon reading for your dating style, attachment weather, and recurring relationship incident reports.
        </p>

        <form className="birth-form service-form" onSubmit={requestLoveReading}>
          <label>
            <span><CalendarDays size={15} /> Birth date <em>required</em></span>
            <input value={birthDate} onChange={(event) => setBirthDate(event.target.value)} type="date" aria-label="Birth date" />
          </label>
          <label>
            <span><Clock3 size={15} /> Birth time <em>required</em></span>
            <div className="time-selects" aria-label="Birth time">
              <select value={birthTime.split(":")[0] ?? "00"} onChange={(event) => setBirthTime((value) => updateTimePart(value, "hour", event.target.value))}>
                {hourOptions.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
              </select>
              <span>:</span>
              <select value={birthTime.split(":")[1] ?? "00"} onChange={(event) => setBirthTime((value) => updateTimePart(value, "minute", event.target.value))}>
                {minuteOptions.map((minute) => <option key={minute} value={minute}>{minute}</option>)}
              </select>
            </div>
          </label>
          <label className="wide location-field">
            <span><MapPin size={15} /> Birthplace <em>choose from list</em></span>
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
                  <button key={location.id} type="button" onClick={() => chooseLoveLocation(location)}>
                    <strong>{location.normalized_query ?? `${location.city}, ${location.country}`}</strong>
                    <span>{location.timezone}{location.source ? ` - ${location.source}` : ""}</span>
                  </button>
                ))}
              </div>
            )}
          </label>

          <div className="auto-coordinates wide">
            <span>{locationLoading ? "Searching birthplace..." : "Venus, Mars, Moon, and houses need coordinates."}</span>
            <b>{selectedLocation ? `${selectedLocation.latitude}, ${selectedLocation.longitude}` : "Select a city"}</b>
            <b>{selectedLocation?.timezone ?? "Timezone pending"}</b>
          </div>

          <button type="submit" disabled={loading}>
            <Heart size={18} />
            {loading ? "Auditing your love life" : "Roast my love life"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {loading && (
          <ServiceLoadingPanel
            eyebrow="Love Life Roast"
            title="Auditing your love life"
            copy="Venus, Mars, and the Moon are being questioned separately so nobody can coordinate their story."
          />
        )}

        {loveReading && !loading && (
          <section className="service-result">
            <p className="score">{loveReading.primary_love_type.score}% - {loveReading.primary_love_type.result_badge}</p>
            <h2>{loveReading.primary_love_type.viral_alias}</h2>
            <p className="official-name">{loveReading.primary_love_type.label}</p>
            <p className="headline">{loveReading.primary_love_type.headline}</p>

            <div className="big-three love-three">
              <article><Heart size={20} /><span>Venus</span><b>{formatPlacement(loveReading.chart?.planets.venus)}</b></article>
              <article><Sparkles size={20} /><span>Mars</span><b>{formatPlacement(loveReading.chart?.planets.mars)}</b></article>
              <article><Moon size={20} /><span>Moon</span><b>{formatPlacement(loveReading.chart?.planets.moon)}</b></article>
            </div>

            <div className="section-grid">
              {Object.entries(loveReading.section_titles).map(([key, title]) => (
                <article className="reading-section" key={key}>
                  <h3>{title}</h3>
                  <p>{loveReading.sections[key]}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
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
  const serviceEntry = SERVICES.find((service) => cleanPath === `/${service.slug}`);

  React.useEffect(() => {
    const titles: Record<string, string> = {
      "/readings": "Savage Readings - Savage Fortune Teller",
      "/daily-card": "Daily Card Pull - Savage Fortune Teller",
      "/faq": "FAQ - Savage Fortune Teller",
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
      : serviceEntry?.name
        ? `${serviceEntry.name} - Savage Fortune Teller`
      : archetypeEntry?.[1].name
        ? `${archetypeEntry[1].name} - Savage Fortune Teller`
        : titles[cleanPath] ?? "Savage Fortune Teller";
  }, [article?.title, serviceEntry?.name, archetypeEntry, cleanPath]);

  if (cleanPath === "/readings") {
    return (
      <main className="content-shell">
        <SiteNav />
        <section className="content-page">
          <p className="eyebrow">Savage reading room</p>
          <h1>Pick your cosmic charge.</h1>
          <p className="lede">
            Short, shareable fortune tools with enough chart logic to avoid becoming a scented candle quiz.
          </p>
          <ServiceGrid />
        </section>
      </main>
    );
  }

  if (cleanPath === "/daily-card") {
    return (
      <main className="content-shell daily-page-shell">
        <SiteNav />
        <section className="content-page daily-page">
          <p className="eyebrow">Daily Card Pull</p>
          <h1>A one-card omen with receipts.</h1>
          <p className="lede">
            Tarot-ish, not tarot cosplay. Pull a card, get the day&apos;s symbolic accusation, proceed with dignity if available.
          </p>
          <DailyCardPull />
        </section>
      </main>
    );
  }

  if (cleanPath === "/love-life-roast") {
    return <LoveLifeRoastPage />;
  }

  if (THEMED_READING_CONFIGS[serviceEntry?.slug ?? ""]) {
    return <ThemedReadingPage config={THEMED_READING_CONFIGS[serviceEntry?.slug ?? ""]} />;
  }

  if (cleanPath === "/faq") {
    return (
      <main className="content-shell">
        <SiteNav />
        <section className="content-page">
          <p className="eyebrow">FAQ</p>
          <h1>Questions the stars made everyone ask.</h1>
          <p className="lede">
            Fast answers about birth times, chart logic, privacy, and why the site insists on being funny with evidence.
          </p>
          <div className="faq-list">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (serviceEntry && serviceEntry.slug !== "birth-chart-roast" && serviceEntry.slug !== "daily-card") {
    return (
      <main className="content-shell">
        <SiteNav />
        <section className="content-page">
          <p className="eyebrow">{serviceEntry.badge}</p>
          <h1>{serviceEntry.name}</h1>
          <p className="lede">{serviceEntry.summary}</p>
          <div className="service-detail">
            <article>
              <span className="service-icon">{getServiceIcon(serviceEntry.slug)}</span>
              <b>What it reads</b>
              <p>{serviceEntry.science}</p>
            </article>
            <article>
              <b>Format</b>
              <p>
                This lane is being shaped as a short chart-based reading: quick enough to share, specific enough to feel accused.
              </p>
            </article>
            <article>
              <b>Tone check</b>
              <p>
                No pastel affirmation soup. The result should feel like a fortune teller with a spreadsheet and a dangerous sense of timing.
              </p>
            </article>
          </div>
          <a className="text-link" href="/">Try the live Birth Chart Roast</a>
        </section>
      </main>
    );
  }

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
            <p>
              Birth Chart Roast is the first full chart lane. Love, money, career, and energy readings use the same evidence-first structure without turning every page into an academic basement.
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
            <ServiceGrid />
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
              If ads are shown, Google and other third-party vendors may use cookies to serve ads based on prior visits to this site or other sites. Users can manage personalized advertising through Google&apos;s Ads Settings or other browser privacy controls.
            </p>
            <p>
              Basic technical data such as browser, device, approximate location, referrer, and usage events may be processed by hosting, analytics, security, or advertising providers to keep the site working and understand what people actually use.
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
              Do not misuse the sharing feature, spam requests, scrape the service at scale, attempt to break the service, or copy the site&apos;s original text and assets into a competing product without permission.
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
              Please include the page URL and a short description if you are reporting a bug, privacy request, or content concern.
            </p>
          </>
        )}

        {![
          "/method",
          "/articles",
          "/archetypes",
          "/about",
          "/privacy",
          "/terms",
          "/contact",
          "/readings",
          "/daily-card",
          "/faq",
          ...SERVICES.map((service) => `/${service.slug}`),
        ].includes(cleanPath) && (
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

  if (!isResultMode) {
    return (
      <main className="home-shell">
        <section className="fortune-stage">
          <SiteNav />
          <div className="fortune-hero-copy">
            <p className="eyebrow">Savage Fortune Teller</p>
            <h1>Pick a card. Get read for filth, with receipts.</h1>
            <p>
              Astrology-backed roasts and fortune tools for people who want the stars to be accurate, funny, and only mildly legally concerning.
            </p>
          </div>

          <div className="fortune-table" aria-label="Savage fortune reading cards">
            <div className="service-card-table">
              {SERVICES.map((service, index) => {
                const href = service.slug === "birth-chart-roast" ? "#birth-chart-roast-form" : `/${service.slug}`;
                return (
                  <a
                    className={service.slug === "birth-chart-roast" ? "fortune-choice-card featured" : "fortune-choice-card"}
                    href={href}
                    key={service.slug}
                    style={{ "--card-tilt": `${[-5, 2, 5, -2, 3, -4][index] ?? 0}deg` } as React.CSSProperties}
                  >
                    <span className="card-moon">{getServiceIcon(service.slug)}</span>
                    <b>{service.name}</b>
                    <em>{service.badge}</em>
                    <span className="free-rite">Free beta</span>
                    <small>{service.summary}</small>
                  </a>
                );
              })}
            </div>

            <form id="birth-chart-roast-form" className="birth-form home-birth-form" onSubmit={requestReading}>
              <div className="form-header wide">
                <p className="eyebrow">Live chart lane</p>
                <h2>Birth Chart Roast</h2>
                <span>Enter birth details once. The chart supplies the evidence; the roast supplies the emotional damage.</span>
              </div>
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
                <span>{locationLoading ? "Searching birthplace..." : "Coordinates and timezone are auto-filled from birthplace."}</span>
                <b>{selectedLocation ? `${selectedLocation.latitude}, ${selectedLocation.longitude}` : "Select a city"}</b>
                <b>{selectedLocation?.timezone ?? "Timezone pending"}</b>
              </div>

              <button type="submit" disabled={loading}>
                <Sparkles size={18} />
                {loading ? "Summoning" : "Roast me"}
              </button>
            </form>

            {error && <div className="error home-error">{error}</div>}
          </div>
        </section>
      </main>
    );
  }

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

        <div className="mini-service-list" aria-label="Other savage readings">
          {SERVICES.filter((service) => service.slug !== "birth-chart-roast").slice(0, 4).map((service) => (
            <a href={`/${service.slug}`} key={service.slug}>
              {getServiceIcon(service.slug)}
              <span>{service.shortName}</span>
            </a>
          ))}
        </div>
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
                className="secondary-button"
                type="button"
                onClick={startNewReading}
              >
                <Sparkles size={17} />
                New roast
              </button>
            </div>
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

        <div className="section-grid">
          {Object.entries(reading.section_titles).map(([key, title]) => (
            <article className="reading-section" key={key}>
              <h3>{title}</h3>
              <p>{reading.sections[key]}</p>
            </article>
          ))}
        </div>

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
        <footer className="site-footer">
          <a href="/readings">Readings</a>
          <a href="/daily-card">Daily Card</a>
          <a href="/faq">FAQ</a>
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
