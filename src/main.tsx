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
  | "unfinished_legend";

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
};

type ArchetypeProfile = {
  name: string;
  alias: string;
  image: string;
  curse: string;
  role: string;
  bait: string;
  prescription: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

const locations: LocationOption[] = [
  { id: "new-york-us", city: "New York", country: "United States", latitude: 40.7128, longitude: -74.006, timezone: "America/New_York" },
  { id: "los-angeles-us", city: "Los Angeles", country: "United States", latitude: 34.0522, longitude: -118.2437, timezone: "America/Los_Angeles" },
  { id: "chicago-us", city: "Chicago", country: "United States", latitude: 41.8781, longitude: -87.6298, timezone: "America/Chicago" },
  { id: "london-uk", city: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London" },
  { id: "toronto-ca", city: "Toronto", country: "Canada", latitude: 43.6532, longitude: -79.3832, timezone: "America/Toronto" },
  { id: "vancouver-ca", city: "Vancouver", country: "Canada", latitude: 49.2827, longitude: -123.1207, timezone: "America/Vancouver" },
  { id: "sydney-au", city: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney" },
  { id: "melbourne-au", city: "Melbourne", country: "Australia", latitude: -37.8136, longitude: 144.9631, timezone: "Australia/Melbourne" },
  { id: "paris-fr", city: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris" },
  { id: "berlin-de", city: "Berlin", country: "Germany", latitude: 52.52, longitude: 13.405, timezone: "Europe/Berlin" },
  { id: "amsterdam-nl", city: "Amsterdam", country: "Netherlands", latitude: 52.3676, longitude: 4.9041, timezone: "Europe/Amsterdam" },
  { id: "tokyo-jp", city: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, timezone: "Asia/Tokyo" },
  { id: "seoul-kr", city: "Seoul", country: "South Korea", latitude: 37.5665, longitude: 126.978, timezone: "Asia/Seoul" },
  { id: "busan-kr", city: "Busan", country: "South Korea", latitude: 35.1796, longitude: 129.0756, timezone: "Asia/Seoul" },
  { id: "singapore-sg", city: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198, timezone: "Asia/Singapore" },
  { id: "hong-kong-hk", city: "Hong Kong", country: "Hong Kong", latitude: 22.3193, longitude: 114.1694, timezone: "Asia/Hong_Kong" },
  { id: "mumbai-in", city: "Mumbai", country: "India", latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata" },
  { id: "dubai-ae", city: "Dubai", country: "United Arab Emirates", latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai" },
  { id: "mexico-city-mx", city: "Mexico City", country: "Mexico", latitude: 19.4326, longitude: -99.1332, timezone: "America/Mexico_City" },
  { id: "sao-paulo-br", city: "Sao Paulo", country: "Brazil", latitude: -23.5558, longitude: -46.6396, timezone: "America/Sao_Paulo" },
];

const archetypes: Record<ArchetypeCode, ArchetypeProfile> = {
  burdened_one: {
    name: "The Burdened One",
    alias: "The Unpaid Project Manager of the Universe",
    image: "/archetypes/burdened-one.png",
    curse: "Chronically responsible, spiritually employed without benefits.",
    role: "The friend who says 'I'll handle it' and then quietly becomes a load-bearing wall.",
    bait: "Mistaking exhaustion for maturity because Saturn handed you a clipboard too early.",
    prescription: "Delegate one thing before your nervous system starts unionizing.",
  },
  chaos_magnet: {
    name: "The Chaos Magnet",
    alias: "The Human Plot Twist",
    image: "/archetypes/chaos-magnet.png",
    curse: "A walking season finale with suspiciously good timing.",
    role: "The person who enters a calm room and somehow unlocks the bonus crisis.",
    bait: "Calling every impulse 'a sign' when sometimes it is just boredom wearing eyeliner.",
    prescription: "Eat, wait twenty minutes, then decide whether the plot actually needs arson.",
  },
  overthinker: {
    name: "The Overthinker",
    alias: "The 47 Tabs Open Personality",
    image: "/archetypes/overthinker.png",
    curse: "Mentally buffering, emotionally litigating, cosmically over-researched.",
    role: "The friend who can turn 'sure' into a twelve-part courtroom drama.",
    bait: "Believing the right analysis will save you from having to feel something.",
    prescription: "Touch grass, send the text, and stop letting Mercury run a hostage situation.",
  },
  dangerous_heart: {
    name: "The Dangerous Heart",
    alias: "The Romantic Red Flag with Good Branding",
    image: "/archetypes/dangerous-heart.png",
    curse: "Seductive intensity with a suspicious basement.",
    role: "The friend whose love life needs a soundtrack, subtitles, and legal counsel.",
    bait: "Confusing emotional activation with destiny because calm feels underproduced.",
    prescription: "If it feels like a federal investigation, do not call it chemistry.",
  },
  haunted_dreamer: {
    name: "The Haunted Dreamer",
    alias: "The Delulu Oracle",
    image: "/archetypes/haunted-dreamer.png",
    curse: "Psychic enough to be annoying, avoidant enough to be expensive.",
    role: "The friend who reads the room, absorbs the room, then needs three days in the fog.",
    bait: "Calling a fantasy 'intuition' because the playlist was convincing.",
    prescription: "Verify the vibe with evidence before marrying a hallucination in your notes app.",
  },
  unfinished_legend: {
    name: "The Unfinished Legend",
    alias: "The Main Character in Development Hell",
    image: "/archetypes/unfinished-legend.png",
    curse: "Huge destiny, suspiciously delayed shipping.",
    role: "The friend with main character energy and a release date the universe keeps moving.",
    bait: "Waiting for a sign when the sign is already yelling 'do the damn thing.'",
    prescription: "Move one ugly inch forward. Potential is cute; execution pays rent.",
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

const defaultLocation = locations.find((location) => location.id === "seoul-kr") ?? locations[0];

function isValidIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00`));
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function App() {
  const [birthDate, setBirthDate] = React.useState("1995-12-18");
  const [birthTime, setBirthTime] = React.useState("14:30");
  const [locationQuery, setLocationQuery] = React.useState(`${defaultLocation.city}, ${defaultLocation.country}`);
  const [selectedLocation, setSelectedLocation] = React.useState<LocationOption | null>(defaultLocation);
  const [reading, setReading] = React.useState<ReadingResponse>(demoReading);
  const [loading, setLoading] = React.useState(false);
  const [shareLoading, setShareLoading] = React.useState(false);
  const [shareLink, setShareLink] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState("");

  const suggestions = React.useMemo(() => {
    const query = locationQuery.trim().toLowerCase();

    if (query.length < 2) {
      return [];
    }

    return locations
      .filter((location) => `${location.city}, ${location.country}`.toLowerCase().includes(query))
      .slice(0, 6);
  }, [locationQuery]);

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

  const active = archetypes[reading.primary_type.code];
  const scoreMap: Record<string, { label: string; score: number }> = reading.all_archetype_scores ?? {};
  const scores = Object.entries(scoreMap)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 6);

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
              inputMode="numeric"
              placeholder="YYYY-MM-DD"
              aria-label="Birth date in YYYY-MM-DD format"
            />
          </label>
          <label>
            <span>
              <Clock3 size={15} /> Birth time <em>required</em>
            </span>
            <input
              value={birthTime}
              onChange={(event) => setBirthTime(event.target.value)}
              inputMode="numeric"
              placeholder="HH:MM"
              aria-label="Birth time in 24-hour HH:MM format"
            />
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
                placeholder="Start typing: New York, London, Seoul..."
                aria-label="Birthplace search"
              />
            </div>
            {suggestions.length > 0 && locationQuery !== `${selectedLocation?.city}, ${selectedLocation?.country}` && (
              <div className="suggestions">
                {suggestions.map((location) => (
                  <button key={location.id} type="button" onClick={() => chooseLocation(location)}>
                    <strong>{location.city}</strong>
                    <span>{location.country} - {location.timezone}</span>
                  </button>
                ))}
              </div>
            )}
          </label>

          <div className="auto-coordinates wide">
            <span>Coordinates are auto-filled from birthplace.</span>
            <b>{selectedLocation ? `${selectedLocation.latitude}, ${selectedLocation.longitude}` : "Select a city"}</b>
            <b>{selectedLocation?.timezone ?? "Timezone pending"}</b>
          </div>

          <button type="submit" disabled={loading}>
            <Sparkles size={18} />
            {loading ? "Summoning" : "Roast me"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        <div className="deck-strip">
          {Object.entries(archetypes).map(([code, item]) => (
            <button
              className={code === reading.primary_type.code ? "mini-card active" : "mini-card"}
              key={code}
              onClick={() => setReading({ ...demoReading, primary_type: { ...demoReading.primary_type, code: code as ArchetypeCode, label: item.name, viral_alias: item.alias } })}
              type="button"
            >
              <img src={item.image} alt="" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="result-panel">
        <article className="result-card">
          <div className="portrait-frame">
            <img src={active.image} alt={reading.primary_type.viral_alias} />
          </div>
          <div className="result-copy">
            <p className="score">{reading.primary_type.score}% - {reading.primary_type.result_badge}</p>
            <h2>{reading.primary_type.viral_alias}</h2>
            <p className="official-name">{reading.primary_type.label}</p>
            <p className="headline">{reading.primary_type.headline}</p>

            <div className="dossier">
              <div>
                <span>Signature curse</span>
                <b>{active.curse}</b>
              </div>
              <div>
                <span>Social function</span>
                <b>{active.role}</b>
              </div>
              <div>
                <span>Fatal bait</span>
                <b>{active.bait}</b>
              </div>
              <div>
                <span>Prescription</span>
                <b>{active.prescription}</b>
              </div>
            </div>

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

        <div className="score-board">
          {scores.map(([code, value]) => (
            <div className="score-row" key={code}>
              <span>{archetypes[code as ArchetypeCode]?.alias ?? value.label}</span>
              <div>
                <i style={{ width: `${Math.max(value.score, 8)}%` }} />
              </div>
              <b>{value.score}%</b>
            </div>
          ))}
        </div>

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
