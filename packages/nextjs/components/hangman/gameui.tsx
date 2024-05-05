import { useState } from "react";
import programData from "../../app/data/healthcare-info.json";
import Directions from "./Directions";
import Scoreboard from "./Scoreboard";
import SelectCategory from "./SelectCategory";
import SelectStatements from "./SelectStatements";
import { getRandomSet, randomFillerStatements, shuffleStatements, splitStatements } from "./utils";
import { GameScore, StringObject } from "~~/app/nillion-hangman/page";

const GAME_INFO = programData.list as unknown as HealthCareInfo[];
const GAME_CATEGORIES = [...new Set(GAME_INFO.map(item => item.category))];

export enum StmtStatus {
  selected = "selected",
  unselected = "unselected",
}

export interface Statements {
  code: string;
  text: string;
  secretLetter: string;
  status: StmtStatus;
}

export interface HealthCareInfo {
  id: string;
  category: string;
  name: string;
  statements: Statements[];
  secret: string;
  secretDescription: string;
}

interface GameUIProps {
  gameIsLoading: { status: boolean; text: string };
  setGameIsLoading: React.Dispatch<React.SetStateAction<{ status: boolean; text: string }>>;
  handleWordGuess: (word: string) => void;
  checkSelectedStatement: (selectedStatement: string) => void;
  handleGameStart: (secrets: { secretIntegers: StringObject[]; secretBlobs: StringObject[] }) => void;
  gameScore: GameScore;
}

const GameUI = ({
  gameIsLoading,
  setGameIsLoading,
  handleWordGuess,
  checkSelectedStatement,
  handleGameStart,
  gameScore,
}: GameUIProps) => {
  const [selectedCategorySet, setSelectedCategorySet] = useState<HealthCareInfo>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [statements, setStatements] = useState<HealthCareInfo["statements"]>([]);

  const setTopicAndInitGame = async (topic: string) => {
    // Set game loading state
    setGameIsLoading({ status: true, text: "Setting up game..." });

    // Split game statements into selected and unselected categories
    const { selectedStmts, unselectedStmts } = splitStatements(GAME_INFO, topic);

    // Randomly select a set of statements for in-game play
    const randomSet = getRandomSet(selectedStmts);
    if (!randomSet) throw new Error("No random set found");

    // Pick filler statements for the game
    const fillerStatements = randomFillerStatements(unselectedStmts, 5);

    // Create an array of correct and filler statements
    const shuffledStatements = shuffleStatements([...randomSet.statements, ...fillerStatements]);

    // Set the selected category and set
    setStatements(shuffledStatements);
    setSelectedCategory(topic);
    setSelectedCategorySet(randomSet);

    // Init game by storing program and secrets
    const secretCodes = randomSet.statements.map((statement, index) => ({
      [`stmt_code_${index + 1}`]: statement.code,
    }));

    const secretWord = [{ ["secret_word"]: randomSet.secret }];
    const secrets = { secretIntegers: [...secretCodes], secretBlobs: [...secretWord] };
    handleGameStart(secrets);

    // Loading state will be set to false in the handleGameStart function
  };

  const setName = selectedCategorySet
    ? selectedCategorySet?.name.charAt(0).toUpperCase() + selectedCategorySet?.name.slice(1)
    : "";

  const handleSelectStatement = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget;
    // Set game loading state
    setGameIsLoading({ status: true, text: "Processing selection..." });

    // Update the status of the selected statement
    const updatedStatements = statements.map(item => {
      if (item.code === id) {
        item.status = StmtStatus.selected;
      }
      return item;
    });
    setStatements(updatedStatements);

    // Check if the selected statement is correct
    checkSelectedStatement(id);

    // Loading state will be set to false in the checkSelectedStatement function
  };

  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center w-full rounded-3xl my-2 justify-between relative">
      <h1 className="sticky top-5 text-xl mx-auto w-fit py-2 px-5 rounded-lg bg-black bg-opacity-70">
        Falling Nillion game
      </h1>
      <div className="grid grid-rows-3 grid-flow-col gap-2">
        {/* Left side grid - Hangman animation main screen */}
        <div className="row-start-1 row-end-3 w-[45vw] ... bg-slate-500 rounded-lg">01</div>

        {/* Upper right grid - Directions section */}
        <div className="row-start-1 row-end-2 col-span-2 w-[45vw] ... bg-slate-400 rounded-lg">
          <Directions />
        </div>
        {/* Lower right grid - Select category or Word reveal section */}
        <div className="row-start-2 row-end-3 col-span-2 ... bg-slate-500 flex justify-center items-center rounded-lg">
          {!selectedCategory ? (
            <SelectCategory categories={GAME_CATEGORIES} setTopicAndInitGame={setTopicAndInitGame} />
          ) : (
            <Scoreboard
              gameIsLoading={gameIsLoading}
              statements={statements}
              gameScore={gameScore}
              handleWordGuess={handleWordGuess}
            />
          )}
        </div>
      </div>

      {/* Player input section */}
      {selectedCategory ? (
        <SelectStatements
          gameIsLoading={gameIsLoading}
          gameScore={gameScore}
          selectedCategory={selectedCategory}
          setName={setName}
          statements={statements}
          handleSelectStatement={handleSelectStatement}
        />
      ) : null}
    </div>
  );
};

export default GameUI;
