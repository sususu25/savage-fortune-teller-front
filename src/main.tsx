import React from "react";
import ReactDOM from "react-dom/client";
import { CalendarDays, Clock3, MapPin, Share2, Sparkles } from "lucide-react";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

const archetypes: Record<ArchetypeCode, { name: string; alias: string; image: string }> = {
  burdened_one: {
    name: "The Burdened One",
    alias: "The Unpaid Project Manager of the Universe",
    image: "/archetypes/burdened-one.png",
  },
  chaos_magnet: {
    name: "The Chaos Magnet",
    alias: "The Human Plot Twist",
    image: "/archetypes/chaos-magnet.png",
  },
  overthinker: {
    name: "The Overthinker",
    alias: "The 47 Tabs Open Personality",
    image: "/archetypes/overthinker.png",
  },
  dangerous_heart: {
    name: "The Dangerous Heart",
    alias: "The Romantic Red Flag with Good Branding",
    image: "/archetypes/dangerous-heart.png",
  },
  haunted_dreamer: {
    name: "The Haunted Dreamer",
    alias: "The Delulu Oracle",
    image: "/archetypes/haunted-dreamer.png",
  },
  unfinished_legend: {
    name: "The Unfinished Legend",
    alias: "The Main Character in Development Hell",
    image: "/archetypes/unfinished-legend.png",
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
      "You are The 47 Tabs Open Personality. Your brain is a group chat where everyone is typing, nobody is reading, and one tab is replaying a sentence from 2019 like it pays rent.",
    why_you_are_like_this:
      "Mercury is doing unpaid overtime in your chart. You process feelings by turning them into a 12-part internal investigation.",
    the_receipts:
      "Mercury emphasis, air dominance, third-house noise, and hard mental aspects are all pointing at the same cursed committee meeting.",
    emotional_damage_forecast:
      "You may spend three hours analyzing a text that meant exactly what it said. Go outside and let your ass remember weather exists.",
    love_life_a_situation:
      "In love, you can turn a crush into a research project with citations. Ask the question. Send the message.",
    court_ordered_advice:
      "Your brain is useful, but it is not the damn CEO of reality.",
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

function App() {
  const [birthDate, setBirthDate] = React.useState("1995-12-18");
  const [birthTime, setBirthTime] = React.useState("14:30");
  const [birthCity, setBirthCity] = React.useState("Seoul");
  const [birthCountry, setBirthCountry] = React.useState("South Korea");
  const [latitude, setLatitude] = React.useState("37.5665");
  const [longitude, setLongitude] = React.useState("126.978");
  const [timezone, setTimezone] = React.useState("Asia/Seoul");
  const [reading, setReading] = React.useState<ReadingResponse>(demoReading);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function requestReading(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/readings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth_date: birthDate,
          birth_time: birthTime,
          birth_city: birthCity,
          birth_country: birthCountry,
          latitude: Number(latitude),
          longitude: Number(longitude),
          timezone,
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
              <CalendarDays size={15} /> Date
            </span>
            <input value={birthDate} onChange={(event) => setBirthDate(event.target.value)} type="date" />
          </label>
          <label>
            <span>
              <Clock3 size={15} /> Time
            </span>
            <input value={birthTime} onChange={(event) => setBirthTime(event.target.value)} type="time" />
          </label>
          <label>
            <span>
              <MapPin size={15} /> City
            </span>
            <input value={birthCity} onChange={(event) => setBirthCity(event.target.value)} />
          </label>
          <label>
            <span>Country</span>
            <input value={birthCountry} onChange={(event) => setBirthCountry(event.target.value)} />
          </label>
          <label>
            <span>Latitude</span>
            <input value={latitude} onChange={(event) => setLatitude(event.target.value)} inputMode="decimal" />
          </label>
          <label>
            <span>Longitude</span>
            <input value={longitude} onChange={(event) => setLongitude(event.target.value)} inputMode="decimal" />
          </label>
          <label className="wide">
            <span>Timezone</span>
            <input value={timezone} onChange={(event) => setTimezone(event.target.value)} />
          </label>
          <button type="submit" disabled={loading}>
            <Sparkles size={18} />
            {loading ? "Summoning" : "Roast me"}
          </button>
        </form>

        {error && (
          <div className="error">
            {error} Demo result is still on the table, because even failure deserves a costume.
          </div>
        )}

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
            <p className="score">{reading.primary_type.score}% {reading.primary_type.result_badge}</p>
            <h2>{reading.primary_type.viral_alias}</h2>
            <p className="headline">{reading.primary_type.headline}</p>
            <button
              className="share-button"
              type="button"
              onClick={() => navigator.clipboard?.writeText(reading.primary_type.share_text)}
            >
              <Share2 size={17} />
              Copy share line
            </button>
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
