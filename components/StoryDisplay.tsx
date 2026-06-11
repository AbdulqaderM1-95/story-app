"use client";

import { useState } from "react";

interface Props {
  story: string;
  isLoading: boolean;
}

export default function StoryDisplay({ story, isLoading }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!story) return;
    await navigator.clipboard.writeText(story);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mt-8 mb-12 animate-fade-in-up">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📖</span> Your Magical Story
          </h2>
          {story && !isLoading && (
            <button
              onClick={handleCopy}
              className="text-xs text-purple-300 hover:text-white border border-purple-500/40 hover:border-purple-400 px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              {copied ? "Copied!" : "Copy Story"}
            </button>
          )}
        </div>

        {!story && isLoading && (
          <p className="text-purple-300/60 text-sm animate-pulse">
            Once upon a time…
          </p>
        )}

        {story && (
          <div
            className="text-white/90 leading-8 text-[1.05rem] whitespace-pre-wrap"
            style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
          >
            {story}
            {isLoading && (
              <span className="inline-block w-0.5 h-5 bg-purple-400 ml-0.5 align-middle animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
