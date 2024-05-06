import { HealthCareInfo, StmtStatus } from "~~/components/hangman/GameUI";

/**
 * Split in-game statements into selected and unselected categories based on player selected topic.
 */
export const splitStatements = (gameInfo: HealthCareInfo[], topic: string) => {
  const selectedStmts: HealthCareInfo[] = [];
  const unselectedStmts: HealthCareInfo["statements"] = [];

  gameInfo.forEach(item => {
    if (topic.toLowerCase() === item.category) {
      selectedStmts.push(item);
    } else {
      unselectedStmts.push(...item.statements);
    }
  });

  return { selectedStmts, unselectedStmts };
};

/**
 * Randomly select a sub-topic for a set of statements based on the player selected topic.
 */
export const getRandomSet = (arr: HealthCareInfo[]) => {
  // Get unique set names
  const uniqueNames = Array.from(new Set(arr.map(item => item.name)));

  // Randomly select a name
  const selectedName = uniqueNames[Math.floor(Math.random() * uniqueNames.length)];

  return arr.find(item => item.name === selectedName);
};

/**
 * Generate random filler statements to mix with set of statements player will be guessing.
 */
export const randomFillerStatements = (
  statements: HealthCareInfo["statements"],
  num: number,
): HealthCareInfo["statements"] => {
  const statementsCopy = [...statements];
  const selectedStatements = [];

  for (let i = 0; i < num && statementsCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * statementsCopy.length);
    selectedStatements.push(statementsCopy[randomIndex]);
    statementsCopy.splice(randomIndex, 1); // Remove the selected item
  }

  return selectedStatements;
};

/**
 * Shuffle statements for the game.
 */
export const shuffleStatements = (statements: HealthCareInfo["statements"]): HealthCareInfo["statements"] => {
  const shuffledStatements = [...statements];
  for (let i = shuffledStatements.length - 1; i > 0; i--) {
    const randomIdx = Math.floor(Math.random() * (i + 1));
    [shuffledStatements[i], shuffledStatements[randomIdx]] = [shuffledStatements[randomIdx], shuffledStatements[i]];
  }

  // Set status of all statements to unselected
  shuffledStatements.forEach(item => (item.status = StmtStatus.unselected));
  return shuffledStatements;
};
