"use client";

import { useState, useEffect } from "react";

const professions = [
  "plombier",
  "électricien",
  "vitrier",
  "menuisier",
  "peintre",
  "serrurier",
  "couvreur",
  "carreleur",
];

type AnimationState = "typing" | "displaying" | "erasing";

export function AnimatedProfession() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>("typing");

  useEffect(() => {
    const currentProfession = professions[currentIndex];
    const totalLength = currentProfession.length;

    let timeoutId: NodeJS.Timeout;

    if (animationState === "typing") {
      if (visibleLength < totalLength) {
        timeoutId = setTimeout(() => {
          setVisibleLength((prev) => prev + 1);
        }, 150); // Speed of letter animation (150ms per letter)
      } else {
        // Finished typing, display the full word
        timeoutId = setTimeout(() => {
          setAnimationState("displaying");
        }, 150);
      }
    } else if (animationState === "displaying") {
      // Display full word for 2 seconds, then start erasing
      timeoutId = setTimeout(() => {
        setAnimationState("erasing");
      }, 2000);
    } else if (animationState === "erasing") {
      if (visibleLength > 0) {
        timeoutId = setTimeout(() => {
          setVisibleLength((prev) => prev - 1);
        }, 150); // Speed of letter animation (150ms per letter)
      } else {
        // Finished erasing, move to next profession
        timeoutId = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % professions.length);
        }, 150);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [animationState, visibleLength, currentIndex]);

  // Reset visible length and state when profession changes
  useEffect(() => {
    setVisibleLength(0);
    setAnimationState("typing");
  }, [currentIndex]);

  const currentProfession = professions[currentIndex];

  return (
    <span className="inline-block">
      {currentProfession.split("").map((letter, index) => {
        const isVisible = index < visibleLength;
        const isErasing =
          animationState === "erasing" && index >= visibleLength;

        return (
          <span
            key={`${currentIndex}-${index}`}
            className={`text-teal-600 dark:text-teal-400 inline-block transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
              }`}
          >
            {letter}
          </span>
        );
      })}
    </span>
  );
}
