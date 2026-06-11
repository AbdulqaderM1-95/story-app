"use client";

import { useState } from "react";

const THEMES = [
  {
    id: "horror",
    label: "Horror",
    emoji: "🕷️",
    desc: "Spooky thrills",
    activeBg: "bg-red-950/70",
    activeBorder: "border-red-400",
    glow: "shadow-red-500/40",
  },
  {
    id: "comedy",
    label: "Comedy",
    emoji: "🎭",
    desc: "Laugh out loud",
    activeBg: "bg-yellow-950/70",
    activeBorder: "border-yellow-400",
    glow: "shadow-yellow-500/40",
  },
  {
    id: "adventure",
    label: "Adventure",
    emoji: "⚔️",
    desc: "Epic quests",
    activeBg: "bg-emerald-950/70",
    activeBorder: "border-emerald-400",
    glow: "shadow-emerald-500/40",
  },
  {
    id: "sci-fi",
    label: "Sci-Fi",
    emoji: "🚀",
    desc: "Space & beyond",
    activeBg: "bg-cyan-950/70",
    activeBorder: "border-cyan-400",
    glow: "shadow-cyan-500/40",
  },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

interface Props {
  onStory: (story: string) => void;
  setIsLoading: (v: boolean) => void;
  isLoading: boolean;
}

const INPUT =
  "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200";

const LABEL = "block text-sm font-medium text-purple-200/80 mb-1.5";

export default function StoryForm({ onStory, setIsLoading, isLoading }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [dayDesc, setDayDesc] = useState("");
  const [theme, setTheme] = useState<ThemeId | "">("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const key = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!key) { setError("API key not configured."); return; }
    if (!name.trim()) { setError("Please enter the child's name."); return; }
    if (!age) { setError("Please select the child's age."); return; }
    if (dayDesc.trim().length < 10) {
      setError("Please describe what happened today (a few more words).");
      return;
    }
    if (!theme) { setError("Please choose a story theme."); return; }

    setError("");
    setIsLoading(true);
    onStory("");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            typeof window !== "undefined"
              ? window.location.origin
              : "https://bedtime-story-magic.app",
          "X-Title": "Bedtime Story Magic",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b:free",
          stream: true,
          messages: [
            {
              role: "system",
              content:
                "You are a warm, imaginative storyteller who creates magical bedtime stories for children. Your stories are age-appropriate, vivid, and always end on a cozy, sleepy note.",
            },
            {
              role: "user",
              content: `Write a ${theme} bedtime story for a ${age}-year-old child named ${name}.

Events from ${name}'s day today: ${dayDesc}

Guidelines:
- Transform these real events into a magical ${theme} story
- Make ${name} the hero of the adventure
- Keep it around 350–400 words
- Use language appropriate for a ${age}-year-old
- End with ${name} peacefully drifting off to sleep
- Start with "Once upon a time" or an equally enchanting opener`,
            },
          ],
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        if (res.status === 401) throw new Error("Invalid API key. Please check your OpenRouter key.");
        if (res.status === 429) throw new Error("Too many requests. Please wait a moment and try again.");
        throw new Error(`API error ${res.status}${body ? ": " + body : ""}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value, { stream: true }).split("\n")) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") break;
            try {
              const token = JSON.parse(data).choices?.[0]?.delta?.content;
              if (token) {
                full += token;
                onStory(full);
              }
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate story. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl animate-fade-in-up">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🌟</span> Create Your Story
        </h2>

        <div className="space-y-5">
          {/* Name + Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Child&apos;s Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Emma"
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Child&apos;s Age</label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={INPUT + " cursor-pointer"}
              >
                <option value="" className="bg-gray-900">Select age…</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n} className="bg-gray-900">
                    {n} {n === 1 ? "year" : "years"} old
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Day Description */}
          <div>
            <label className={LABEL}>
              What did {name || "they"} do today?
            </label>
            <textarea
              value={dayDesc}
              onChange={(e) => setDayDesc(e.target.value)}
              placeholder={`Tell us about ${name || "their"} adventures — did they visit a friend? Learn something new? Go somewhere special? The more details, the more magical the story!`}
              rows={4}
              className={INPUT + " resize-none leading-relaxed"}
            />
          </div>

          {/* Theme Selection */}
          <div>
            <label className={LABEL}>Choose a Story Theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {THEMES.map((t) => {
                const selected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={[
                      "flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200",
                      selected
                        ? `${t.activeBg} ${t.activeBorder} shadow-lg ${t.glow}`
                        : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/25",
                    ].join(" ")}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-white text-sm font-semibold">{t.label}</span>
                    <span className="text-white/40 text-xs">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-300 text-sm bg-red-950/40 border border-red-800/50 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Weaving your story…
              </>
            ) : (
              <>✨ Weave the Story</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
