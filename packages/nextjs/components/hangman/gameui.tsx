import { useEffect, useState } from "react";
import programData from "../../app/data/healthcare-info.json";
import Directions from "./Directions";
import SelectCategory from "./SelectCategory";
import SelectStatements from "./SelectStatements";
import WordReveal from "./WordReveal";
import { getRandomSet, randomFillerStatements, shuffleStatements } from "./utils";

const GAME_INFO = programData.list as unknown as HealthCareInfo[];
const GAME_CATEGORIES = [...new Set(GAME_INFO.map(item => item.category))];

export enum StmtStatus {
  selected = "selected",
  unselected = "unselected",
}

export interface Statements {
  code: string;
  text: string;
  secretLetters: string;
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
  checkSelectedStatement: (selectedStatement: string) => void;
  storeProgramAndSecrets: (secrets: number[]) => void;
}

const GameUI = ({ checkSelectedStatement, storeProgramAndSecrets }: GameUIProps) => {
  const [selectedCategorySet, setSelectedCategorySet] = useState<HealthCareInfo>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [statements, setStatements] = useState<HealthCareInfo["statements"]>([]);

  const setTopicAndInitGame = (selectedCategory: string) => {
    let selectedCategorySet: HealthCareInfo[] = [];
    let falseStatements: HealthCareInfo["statements"] = [];
    let secretCodeArray: number[] = [];

    // Set the selected category
    setSelectedCategory(selectedCategory);

    // Retrieve healthcare info related to the selected category
    GAME_INFO.filter(item => {
      if (selectedCategory.toLowerCase() === item.category) {
        selectedCategorySet = [...selectedCategorySet, item];
      } else {
        falseStatements = [...falseStatements, ...item.statements];
      }
    });
    // Get a random set of statements from the selected category
    const randomSet = getRandomSet(selectedCategorySet);
    if (!randomSet) return;
    secretCodeArray = randomSet.statements.map(item => parseInt(item.code));
    setSelectedCategorySet(randomSet);
    // Setup false statements to be used as fillers in the game
    const fillerStatements = randomFillerStatements(falseStatements, 5);
    // Create an array of true and filler statements
    const shuffledStatements = shuffleStatements([...randomSet.statements, ...fillerStatements]);
    setStatements(shuffledStatements);

    // Init game by storing program and secrets
    storeProgramAndSecrets(secretCodeArray);
  };

  const setName = selectedCategorySet
    ? selectedCategorySet?.name.charAt(0).toUpperCase() + selectedCategorySet?.name.slice(1)
    : "";

  const handleSubmit = () => {
    console.log("submitted");
  };

  const handleSelectStatement = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget;
    const updatedStatements = statements.map(item => {
      if (item.code === id) {
        item.status = StmtStatus.selected;
      }
      return item;
    });
    setStatements(updatedStatements);
    checkSelectedStatement(id);
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
            <WordReveal />
          )}
        </div>
      </div>

      {/* Player input section */}
      {selectedCategory ? (
        <SelectStatements
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
