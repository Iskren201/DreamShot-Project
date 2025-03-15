import React, { createContext, useContext, useState, ReactNode } from "react";

interface CombinationStep {
  direction: string;
  degrees: number;
}

interface VaultContextType {
  isOpen: boolean;
  combination: CombinationStep[];
  currentMove: number;
  generateCombination: () => void;
  checkCombination: (rotation: number) => void;
  resetGame: () => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const useVaultContext = (): VaultContextType => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVaultContext must be used within a VaultProvider");
  }
  return context;
};

export const VaultProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [combination, setCombination] = useState<CombinationStep[]>([]);
  const [currentMove, setCurrentMove] = useState(0);

  // Generate a random secret combination
  const generateCombination = () => {
    const directions = ["left", "right"];
    const newCombination = Array.from({ length: 3 }, () => ({
      direction: directions[Math.floor(Math.random() * 2)],
      degrees: Math.floor(Math.random() * 360) + 60, // Each step between 60° to 360°
    }));
    setCombination(newCombination);
    console.log("Secret Combination:", newCombination);
  };

  // Check if the player has successfully followed the combination
  const checkCombination = (rotation: number) => {
    const currentStep = combination[currentMove];
    if (
      (currentStep.direction === "left" && rotation < 0) ||
      (currentStep.direction === "right" && rotation > 0)
    ) {
      if (Math.abs(rotation) >= currentStep.degrees) {
        // Correct move, move to the next step
        setCurrentMove((prev) => prev + 1);
        if (currentMove === combination.length - 1) {
          // Unlock the vault if all moves are correct
          setIsOpen(true);
        }
      } else {
        // Incorrect move, reset game
        console.log("Wrong move, resetting the game.");
        resetGame();
      }
    }
  };

  // Reset the game state
  const resetGame = () => {
    setCurrentMove(0);
    setIsOpen(false);
    generateCombination();
  };

  return (
    <VaultContext.Provider
      value={{
        isOpen,
        combination,
        currentMove,
        generateCombination,
        checkCombination,
        resetGame,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};
