// src/context/GameContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";

// Define type for combination pair (number + direction)
type CombinationPair = {
  number: number;
  direction: "clockwise" | "counterclockwise";
};

// Define the Game Context type
interface GameContextType {
  secretCombination: CombinationPair[];
  playerInput: CombinationPair[];
  isUnlocked: boolean;
  resetGame: () => void;
  addPlayerInput: (input: CombinationPair) => void;
}

// Create the GameContext
export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

// Provider Component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [secretCombination, setSecretCombination] = useState<CombinationPair[]>([]);
  const [playerInput, setPlayerInput] = useState<CombinationPair[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Generate random combination at game start
  useEffect(() => {
    generateCombination();
  }, []);

  const generateCombination = () => {
    const newCombination: CombinationPair[] = Array.from({ length: 3 }, () => ({
      number: Math.floor(Math.random() * 9) + 1,
      direction: Math.random() > 0.5 ? "clockwise" : "counterclockwise",
    }));
    setSecretCombination(newCombination);
    setPlayerInput([]);
    setIsUnlocked(false);
    console.log("Secret Combination:", newCombination); // Debugging
  };

  // Add player input and check if correct
  const addPlayerInput = (input: CombinationPair) => {
    const newInput = [...playerInput, input];

    // Check if input matches the secret combination
    if (newInput.length === secretCombination.length) {
      if (JSON.stringify(newInput) === JSON.stringify(secretCombination)) {
        setIsUnlocked(true); // Unlock vault
      } else {
        generateCombination(); // Reset game on failure
      }
    }

    setPlayerInput(newInput);
  };

  return (
    <GameContext.Provider
      value={{ secretCombination, playerInput, isUnlocked, resetGame: generateCombination, addPlayerInput }}
    >
      {children}
    </GameContext.Provider>
  );
};
