import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AnimatedText = ({
  texts,
  decryptSpeed = 80,
  maxIterations = 90,
  delay = 10,
  cycleDuration = 7000,
}) => {
  const [originalText, setOriginalText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const chars = "ABCDEFGHIJKLMNOPRSTUYabcdefghijklmnoprstuy!?";

  // Function to pick a random text from the array that's different from the current one
  const pickRandomText = () => {
    // If we only have one text, just return it
    if (texts.length === 1) return texts[0];

    // Create an array of indexes excluding the current one
    const availableIndices = Array.from(
      { length: texts.length },
      (_, i) => i
    ).filter((i) => i !== textIndex);

    // Pick a random index from the available ones
    const newIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setTextIndex(newIndex);
    return texts[newIndex];
  };

  // Effect to handle the cycling of different texts
  useEffect(() => {
    // Initial text selection
    if (originalText === "") {
      const initialText = texts[Math.floor(Math.random() * texts.length)];
      setOriginalText(initialText);
    }

    // Set up the interval for changing text
    const cycleInterval = setInterval(() => {
      // Only change text when the current animation is complete
      if (!isDecrypting) {
        const newText = pickRandomText();
        setOriginalText(newText);
        setIsDecrypting(true); // Trigger a new animation cycle
      }
    }, cycleDuration);

    return () => clearInterval(cycleInterval);
  }, [texts, isDecrypting, cycleDuration, textIndex, originalText]);

  // Effect to handle the decryption animation
  useEffect(() => {
    let timeout;
    let iteration = 0;

    const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

    const generateScrambledText = (progress) => {
      const originalChars = Math.floor(originalText.length * progress);
      let result = "";
      for (let i = 0; i < originalText.length; i++) {
        if (i < originalChars) {
          result += originalText[i];
        } else if (
          originalText[i] === " " ||
          originalText[i] === "." ||
          originalText[i] === "," ||
          originalText[i] === "!" ||
          originalText[i] === "?"
        ) {
          // Preserve punctuation and spaces
          result += originalText[i];
        } else {
          result += getRandomChar();
        }
      }
      return result;
    };

    const animateText = () => {
      if (!isDecrypting) return;
      const progress = Math.min(1, iteration / maxIterations);
      setDisplayText(generateScrambledText(progress));
      iteration++;
      if (iteration > maxIterations) {
        setDisplayText(originalText);
        setIsDecrypting(false);
        return;
      }
      timeout = setTimeout(animateText, decryptSpeed);
    };

    if (originalText !== "" && isDecrypting) {
      iteration = 0;
      timeout = setTimeout(animateText, delay);
    }

    return () => clearTimeout(timeout);
  }, [originalText, decryptSpeed, maxIterations, delay, isDecrypting]);

  return (
    <motion.p
      className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-8 h-[10rem] md:h-[7.5rem] overflow-hidden"
      key={originalText}
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
    </motion.p>
  );
};

export default AnimatedText;
