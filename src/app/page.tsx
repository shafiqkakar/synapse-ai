"use client";

import { useEffect, useMemo, useState } from "react";

type Pricing = "Free" | "Freemium" | "Paid";

type Tool = {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  pricing: Pricing;
  badge?: string;
  url: string;
  popularity: number;
  addedAt: string;
};

const tools: Tool[] = [
  { id: 1, name: "ChatGPT", category: "Productivity", description: "Write, learn, brainstorm and solve problems with an AI assistant.", icon: "✳", color: "green", pricing: "Freemium", badge: "Popular", url: "https://chatgpt.com", popularity: 100, addedAt: "2026-01-10" },
  { id: 2, name: "Midjourney", category: "Image", description: "Create imaginative artwork and stunning visuals from text prompts.", icon: "◈", color: "purple", pricing: "Paid", badge: "Creative", url: "https://www.midjourney.com", popularity: 88, addedAt: "2026-03-10" },
  { id: 3, name: "GitHub Copilot", category: "Coding", description: "Get coding suggestions and assistance directly in your workflow.", icon: "⌘", color: "blue", pricing: "Freemium", url: "https://github.com/features/copilot", popularity: 91, addedAt: "2026-04-15" },
  { id: 4, name: "Perplexity", category: "Research", description: "Explore questions and discover answers with linked sources.", icon: "⌕", color: "cyan", pricing: "Freemium", badge: "Research", url: "https://www.perplexity.ai", popularity: 85, addedAt: "2026-05-10" },
  { id: 5, name: "Runway", category: "Video", description: "Experiment with AI-powered video creation and visual storytelling.", icon: "▶", color: "pink", pricing: "Freemium", url: "https://runwayml.com", popularity: 78, addedAt: "2026-06-01" },
  { id: 6, name: "Jasper", category: "Writing", description: "Create marketing copy and content for different brand needs.", icon: "✎", color: "orange", pricing: "Paid", url: "https://www.jasper.ai", popularity: 72, addedAt: "2026-02-05" },
  { id: 7, name: "Claude", category: "Productivity", description: "Work through writing, analysis, coding and complex questions.", icon: "✺", color: "orange", pricing: "Freemium", url: "https://claude.ai", popularity: 95, addedAt: "2026-07-12" },
  { id: 8, name: "Canva Magic Studio", category: "Image", description: "Design graphics and explore AI-assisted creative tools.", icon: "✿", color: "blue", pricing: "Freemium", url: "https://www.canva.com", popularity: 83, addedAt: "2026-08-04" },
  { id: 9, name: "Cursor", category: "Coding", description: "Build and edit software with an AI-focused code editor.", icon: "↗", color: "cyan", pricing: "Freemium", badge: "For developers", url: "https://cursor.com", popularity: 89, addedAt: "2026-09-20" },
  { id: 10, name: "Hugging Face", category: "Research", description: "Explore machine learning models, datasets and AI applications.", icon: "🤗", color: "orange", pricing: "Free", badge: "Open source", url: "https://huggingface.co", popularity: 80, addedAt: "2026-10-01" },
  { id: 11, name: "ElevenLabs", category: "Audio", description: "Create AI voices, text-to-speech and audio experiences.", icon: "♫", color: "purple", pricing: "Freemium", url: "https://elevenlabs.io", popularity: 86, addedAt: "2026-10-10" },
  { id: 12, name: "Google AI Studio", category: "Coding", description: "Experiment with Google's AI models and prototype AI-powered apps.", icon: "✧", color: "blue", pricing: "Free", url: "https://aistudio.google.com", popularity: 87, addedAt: "2026-10-18" },
];

const categories = [
  "All Tools", "Productivity", "Writing", "Image",
  "Video", "Coding", "Research", "Audio",
];

const pricingOptions = ["All Pricing", "Free", "Freemium", "Paid"];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Most popular", value: "popular" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
  { label: "Newest first", value: "newest" },
];

const STORAGE_KEY = "synapse-ai-saved-tools";

/* Custom Synapse AI logo */
function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M24 4 39 13v22L24 44 9 35V13L24 4Z" />
        <path d="M16 17.5c2.8-3.4 12.7-3.4 15.5.2M16 30.5c2.8 3.4 12.7 3.4 15.5-.2M16 17.5v13M32 17.5v13M16 24h16" />
        <circle cx="16" cy="17.5" r="2.5" />
        <circle cx="32" cy="17.5" r="2.5" />
        <circle cx="16" cy="30.5" r="2.5" />
        <circle cx="32" cy="30.5" r="2.5" />
        <circle cx="24" cy="24" r="3.2" />
      </svg>
    </span>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Tools");
  const [pricing, setPricing] = useState("All Pricing");
  const [sortBy, setSortBy] = useState("featured");
  const [saved, setSaved] = useState<number[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed: unknown = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setSaved(
            parsed.filter(
              (id): id is number =>
                typeof id === "number" && tools.some((tool) => tool.id === id)
            )
          );
        }
      }
    } catch {
      console.warn("Could not load saved tools");
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      console.warn("Could not save favourites");
    }
  }, [saved, storageReady]);

  const filteredTools = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = tools.filter((tool) => {
      const matchesSearch =
        `${tool.name} ${tool.category} ${tool.description}`
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        activeCategory === "All Tools" || tool.category === activeCategory;

      const matchesPricing =
        pricing === "All Pricing" || tool.pricing === pricing;

      const matchesSaved = !savedOnly || saved.includes(tool.id);

      return matchesSearch && matchesCategory && matchesPricing && matchesSaved;
    });

    return result.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);

      if (sortBy === "newest") {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }

      return b.popularity - a.popularity;
    });
  }, [search, activeCategory, pricing, sortBy, saved, savedOnly]);

  function clearFilters() {
    setSearch("");
    setActiveCategory("All Tools");
    setPricing("All Pricing");
    setSortBy("featured");
    setSavedOnly(false);
  }

  function toggleSaved(id: number) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <main className="site-shell">
      {/* Navigation */}
      <nav className="navbar">
        <a href="#" className="brand" aria-label="Synapse AI home">
          <BrandMark />
          <span className="brand-name">
            synapse<span className="brand-light">.ai</span>
          </span>
        </a>

        <div className="nav-links">
          <a href="#explore">Directory</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
        </div>

        <a className="nav-cta" href="#explore">
          Find a tool <span>↗</span>
        </a>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot" />
            THE AI TOOLKIT FOR WHAT’S NEXT
          </div>

          <h1>
            Good ideas
            <br />
            deserve <span>great tools.</span>
          </h1>

          <p className="hero-description">
            A considered directory of AI tools for creating, coding,
            researching and getting more out of every idea.
          </p>

          <form
            className="hero-search"
            onSubmit={(event) => {
              event.preventDefault();
              document
                .getElementById("explore")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="search-icon">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="What do you want to make?"
              aria-label="Search AI tools"
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

            <button type="submit" className="search-button">
              Search <span>↗</span>
            </button>
          </form>

          <div className="hero-meta">
            <span>↳ 12 curated tools</span>
            <span>↳ 8 categories</span>
            <span>↳ Your saved toolkit</span>
          </div>
        </div>

        {/* CSS-created hero artwork with the custom logo */}
        <div className="hero-art" aria-label="Create, build and discover with AI">
          <div className="art-grid" />
          <div className="art-orbit orbit-a" />
          <div className="art-orbit orbit-b" />
          <div className="art-orbit orbit-c" />

          <div className="art-center">
            <BrandMark />
            <span>IDEAS IN MOTION</span>
          </div>

          <div className="art-node node-one">
            <i>✳</i>
            <span><b>Create</b><small>Make something new</small></span>
          </div>

          <div className="art-node node-two">
            <i>⌘</i>
            <span><b>Build</b><small>Turn plans into products</small></span>
          </div>

          <div className="art-node node-three">
            <i>⌕</i>
            <span><b>Discover</b><small>Find your next edge</small></span>
          </div>

          <span className="art-coordinate coordinate-one">AI / 001</span>
          <span className="art-coordinate coordinate-two">SYNAPSE®</span>
        </div>

        <div className="hero-side-note">
          A BETTER WAY TO WORK WITH AI <span>↓</span>
        </div>
      </section>

      {/* Lime announcement strip */}
      <section className="manifesto-strip">
        <span className="strip-label">BUILT FOR CURIOUS MINDS</span>
        <p>Less tab-hopping. <strong>More making.</strong></p>
        <a href="#explore">Explore the directory <span>↘</span></a>
      </section>

      {/* Tool directory */}
      <section className="explore-section" id="explore">
        <div className="section-heading">
          <div>
            <div className="section-kicker">THE DIRECTORY / 001—012</div>
            <h2>Find your <span>next advantage.</span></h2>
            <p>Useful tools, without the endless searching.</p>
          </div>

          <button
            className={`saved-filter ${savedOnly ? "saved-active" : ""}`}
            onClick={() => setSavedOnly((value) => !value)}
            aria-pressed={savedOnly}
          >
            <span className="heart-mark">{savedOnly ? "♥" : "♡"}</span>
            Saved toolkit <b>{saved.length.toString().padStart(2, "0")}</b>
          </button>
        </div>

        <div className="category-header" id="categories">
          <span>01 / EXPLORE BY CATEGORY</span>
          <span>SELECT A LANE ↴</span>
        </div>

        <div className="category-row">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-pill ${
                activeCategory === category ? "category-active" : ""
              }`}
              aria-pressed={activeCategory === category}
            >
              <span className="category-index">{String(index).padStart(2, "0")}</span>
              {category}
              <span className="category-arrow">↗</span>
            </button>
          ))}
        </div>

        <div className="filter-panel">
          <div className="filter-intro">
            <span className="filter-dot" /> REFINE RESULTS
          </div>

          <div className="filter-field">
            <label htmlFor="pricing-filter">Pricing</label>
            <select
              id="pricing-filter"
              value={pricing}
              onChange={(event) => setPricing(event.target.value)}
            >
              {pricingOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="sort-filter">Sort results</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button className="reset-filters" onClick={clearFilters}>
            Reset <span>↺</span>
          </button>
        </div>

        <div className="results-line">
          <span>
            Showing <strong>{String(filteredTools.length).padStart(2, "0")}</strong>
            {" / "}{String(tools.length).padStart(2, "0")} tools
          </span>
          <span className="results-note">
            A small directory with big potential <span>✳</span>
          </span>
        </div>

        {filteredTools.length > 0 ? (
          <div className="tools-grid">
            {filteredTools.map((tool) => (
              <article className="tool-card" key={tool.id}>
                <div className="card-top">
                  <div className={`tool-icon ${tool.color}`}>{tool.icon}</div>
                  <span className="card-number">
                    TOOL / {String(tool.id).padStart(2, "0")}
                  </span>
                  <button
                    className={`bookmark-button ${
                      saved.includes(tool.id) ? "is-saved" : ""
                    }`}
                    onClick={() => toggleSaved(tool.id)}
                    aria-label={
                      saved.includes(tool.id)
                        ? `Remove ${tool.name} from saved tools`
                        : `Save ${tool.name}`
                    }
                    aria-pressed={saved.includes(tool.id)}
                  >
                    {saved.includes(tool.id) ? "♥" : "♡"}
                  </button>
                </div>

                <div className="tool-title-row">
                  <h3>{tool.name}</h3>
                  {tool.badge && <span className="tool-badge">{tool.badge}</span>}
                </div>

                <p className="tool-description">{tool.description}</p>

                <div className="tool-details">
                  <span className="tool-category">{tool.category}</span>
                  <span className={`tool-pricing pricing-${tool.pricing.toLowerCase()}`}>
                    {tool.pricing === "Freemium" ? "Free + Paid" : tool.pricing}
                  </span>
                </div>

                <a
                  className="tool-link"
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore tool <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>⌕</span>
            <h3>No tools found.</h3>
            <p>Try another search, change your filters, or save some tools first.</p>
            <button onClick={clearFilters}>Clear all filters ↗</button>
          </div>
        )}
      </section>

      {/* About section */}
      <section className="feature-section" id="about">
        <div className="feature-copy">
          <div className="section-kicker">WHY SYNAPSE / 003</div>
          <h2>Make room for<br /><span>the actual work.</span></h2>
          <p>
            The AI landscape is moving fast. Synapse gives you a clearer
            starting point, so your attention stays on the idea—not on
            searching for the right tool.
          </p>
          <a href="#explore" className="primary-button">
            Build your toolkit <span>↗</span>
          </a>
        </div>

        <div className="feature-cards">
          <div className="feature-card">
            <span className="feature-symbol">⌕</span>
            <div><h3>Discover</h3><p>Find tools that fit your goals.</p></div>
            <span className="feature-number">01</span>
          </div>
          <div className="feature-card">
            <span className="feature-symbol">↗</span>
            <div><h3>Explore</h3><p>Compare categories and possibilities.</p></div>
            <span className="feature-number">02</span>
          </div>
          <div className="feature-card">
            <span className="feature-symbol">♡</span>
            <div><h3>Collect</h3><p>Keep your favourites close at hand.</p></div>
            <span className="feature-number">03</span>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bottom-cta">
        <div className="cta-mark"><BrandMark /></div>
        <div>
          <div className="section-kicker">YOUR NEXT IDEA STARTS HERE</div>
          <h2>Go make <span>something.</span></h2>
          <p>Your next favourite tool might be one click away.</p>
        </div>
        <a href="#explore" className="primary-button">
          Explore Synapse <span>↗</span>
        </a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <a href="#" className="brand">
          <BrandMark />
          <span className="brand-name">synapse<span className="brand-light">.ai</span></span>
        </a>
        <p>Find the tool. Follow the idea.</p>
        <span className="footer-copy">© 2026 Synapse AI · Independent AI tool directory</span>
      </footer>
    </main>
  );
}