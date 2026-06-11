"use client";

import { useState } from "react";
import StarField from "./StarField";
import Moon from "./Moon";
import StoryForm from "./StoryForm";
import StoryDisplay from "./StoryDisplay";

export default function StoryApp() {
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <StarField />
      <Moon />

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="text-5xl mb-3 select-none">🌙</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
            Bedtime Story Magic
          </h1>
          <p className="mt-3 text-lg text-purple-200/75">
            Transform today&apos;s adventures into a magical tale ✨
          </p>
        </div>

        <StoryForm
          onStory={setStory}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />

        {(story || isLoading) && (
          <StoryDisplay story={story} isLoading={isLoading} />
        )}
      </div>
    </main>
  );
}
