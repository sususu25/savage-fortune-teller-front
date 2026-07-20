import React from "react";
import ReactDOM from "react-dom/client";
import { CalendarDays, Check, Clock3, Copy, MapPin, Search, Share2, Sparkles } from "lucide-react";
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
    viral_alias: string;
    headline: string;
    result_badge: string;
    share_text: string;
  };
  section_titles: Record<string, string>;
  sections: Record<string, string>;
  all_archetype_scores?: Record<string, { label: string; score: number }>;
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
  },
  moon_flood: {
    name: "The Human Weather System",
    alias: "The Human Weather System",
    image: "/archetypes/haunted-dreamer.webp",
  },
  venus_maximalist: {
    name: "The Standards With Their Own Zip Code",
    alias: "The Standards With Their Own Zip Code",
    image: "/archetypes/dangerous-heart.webp",
  },
  mars_ignition: {
    name: "The Fight-or-Also-Fight Response",
    alias: "The Fight-or-Also-Fight Response",
    image: "/archetypes/chaos-magnet.webp",
  },
  jupiter_evangelist: {
    name: "The Free Advice Philanthropist",
    alias: "The Free Advice Philanthropist",
    image: "/archetypes/unfinished-legend.webp",
  },
  ascendant_mask: {
    name: "The Different Person Depending on the Lighting",
    alias: "The Different Person Depending on the Lighting",
    image: "/archetypes/overthinker.webp",
  },
};

const demoReading: ReadingResponse = {
  primary_type: {
    code: "overthinker",
    label: "The Overthinker",
    score: 76,
    viral_alias: "The 47 Tabs Open Personality",
    headline: "Your brain has 47 tabs open, and somehow one of them is arguing with a memory from 2019.",
    result_badge: "mentally buffering",
    share_text: "I got 76% The 47 Tabs Open Personality. My birth chart told my brain to shut the hell up.",
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
  all_archetype_scores: {
    overthinker: { label: "The Overthinker", score: 76 },
    haunted_dreamer: { label: "The Haunted Dreamer", score: 58 },
    burdened_one: { label: "The Burdened One", score: 43 },
    dangerous_heart: { label: "The Dangerous Heart", score: 35 },
    chaos_magnet: { label: "The Chaos Magnet", score: 31 },
    unfinished_legend: { label: "The Unfinished Legend", score: 27 },
  },
};

const defaultLocation = fallbackLocations[0];
const hourOptions = Array.from({ length: 24 }, (_, hour) => hour.toString().padStart(2, "0"));
const minuteOptions = Array.from({ length: 60 }, (_, minute) => minute.toString().padStart(2, "0"));

function updateTimePart(value: string, part: "hour" | "minute", nextPart: string) {
  const [hour = "00", minute = "00"] = value.split(":");
  return part === "hour" ? `${nextPart}:${minute}` : `${hour}:${nextPart}`;
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

function App() {
  const [birthDate, setBirthDate] = React.useState("1995-12-18");
  const [birthTime, setBirthTime] = React.useState("14:30");
  const [locationQuery, setLocationQuery] = React.useState(`${defaultLocation.city}, ${defaultLocation.country}`);
  const [selectedLocation, setSelectedLocation] = React.useState<LocationOption | null>(defaultLocation);
  const [suggestions, setSuggestions] = React.useState<LocationOption[]>([]);
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [reading, setReading] = React.useState<ReadingResponse>(demoReading);
  const [loading, setLoading] = React.useState(false);
  const [shareLoading, setShareLoading] = React.useState(false);
  const [shareLink, setShareLink] = React.useState("");
  const [copied, setCopied] = React.useState(false);
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

    setLoading(true);
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

      setReading((await response.json()) as ReadingResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The oracle refused to cooperate.");
    } finally {
      setLoading(false);
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

  const active = getActiveProfile(reading);
  const scoreMap: Record<string, { label: string; score: number }> = reading.all_archetype_scores ?? {};
  const scores = Object.entries(scoreMap).sort((a, b) => b[1].score - a[1].score);
  const dossierItems = [
    ["Signature curse", active.curse],
    ["Social function", active.role],
    ["Fatal bait", active.bait],
    ["Prescription", active.prescription],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <main className="shell">
      <section className="oracle-panel">
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

      <section className="result-panel">
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

            {dossierItems.length > 0 && (
              <div className="dossier">
                {dossierItems.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
            )}

            <button
              className="share-button"
              type="button"
              onClick={createShareLink}
              disabled={shareLoading}
            >
              <Share2 size={17} />
              {shareLoading ? "Creating link" : "Share result"}
            </button>
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
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
