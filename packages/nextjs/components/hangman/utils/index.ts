import { HealthCareInfo, StmtStatus } from "~~/components/hangman/GameUI";

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

export const getRandomSet = (arr: HealthCareInfo[]) => {
  // Get unique set names
  const uniqueNames = Array.from(new Set(arr.map(item => item.name)));

  // Randomly select a name
  const selectedName = uniqueNames[Math.floor(Math.random() * uniqueNames.length)];

  return arr.find(item => item.name === selectedName);
};

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
