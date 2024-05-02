import { useEffect, useState } from "react";
import programData from "../../app/data/healthcare-info.json";
import Directions from "./Directions";
import SelectCategory from "./SelectCategory";
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
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

const GameUI = ({ selectedCategory, setSelectedCategory }: GameUIProps) => {
  const [selectedCategorySet, setSelectedCategorySet] = useState<HealthCareInfo>();
  const [statements, setStatements] = useState<HealthCareInfo["statements"]>([]);

  useEffect(() => {
    let selectedCategorySet: HealthCareInfo[] = [];
    let falseStatements: HealthCareInfo["statements"] = [];

    GAME_INFO.filter(item => {
      if (selectedCategory.toLowerCase() === item.category) {
        selectedCategorySet = [...selectedCategorySet, item];
      } else {
        falseStatements = [...falseStatements, ...item.statements];
      }
    });
    // Get a random set from the selected category
    const randomSet = getRandomSet(selectedCategorySet);
    if (!randomSet) return;
    setSelectedCategorySet(randomSet);
    // Setup false statements to be used as filler
    const fillerStatements = randomFillerStatements(falseStatements, 5);
    // Create an array of true and filler statements
    const shuffledStatements = shuffleStatements([...randomSet.statements, ...fillerStatements]);
    setStatements(shuffledStatements);
  }, [selectedCategory]);

  console.log("selectedCategory");
  console.log(selectedCategory);

  const setName = selectedCategorySet
    ? selectedCategorySet?.name.charAt(0).toUpperCase() + selectedCategorySet?.name.slice(1)
    : "";

  const handleSubmit = () => {
    console.log("submitted");
  };

  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center w-full rounded-3xl my-2 justify-between relative">
      <h1 className="sticky top-5 text-xl mx-auto w-fit py-2 px-5 rounded-lg bg-black bg-opacity-70">
        Nillion Falling man game
      </h1>
      <div className="grid grid-rows-3 grid-flow-col gap-2">
        {/* Hangman animation main screen */}
        <div className="row-start-1 row-end-3 w-[45vw] ... bg-slate-500 rounded-lg">01</div>

        {/* Directions section */}
        <div className="row-start-1 row-end-2 col-span-2 w-[45vw] ... bg-slate-400 rounded-lg">
          <Directions />
        </div>
        <div className="row-start-2 row-end-3 col-span-2 ... bg-slate-500 flex justify-center items-center rounded-lg">
          {!selectedCategory ? (
            <SelectCategory categories={GAME_CATEGORIES} setSelectedCategory={setSelectedCategory} />
          ) : (
            <WordReveal />
          )}
        </div>
      </div>

      {/* Player input section */}
      {selectedCategory ? (
        <ul className="fixed bottom-0 left-0 w-full h-1/3 overflow-auto bg-base-200 px-10 shadow-lg">
          {/* <div className="fixed bottom-0 left-auto w-full h-1/3 overflow-auto bg-gray-100 p-4 shadow-lg"> */}
          <h2 className="sticky top-0 bg-black py-2 w-screen max-w-screen ml-[calc(50%-50vw)] bg-opacity-70">
            Healthcare Topic:{" "}
            <span className="text-blue-600">
              {selectedCategory}
              {` "${setName}"`}
            </span>
          </h2>
          {(statements as HealthCareInfo["statements"]).map((item, idx) => (
            <li key={item.code} className="bg-secondary shadow-md rounded-lg my-2 pt-6 lg:pt-0">
              <button
                id={item.code}
                className="btn btn-ghost h-fit w-full"
                disabled={item.status === StmtStatus.selected}
                onClick={() => {
                  // Update the status of the selected statement
                  setStatements(prev =>
                    prev.map(statement =>
                      statement.code === item.code ? { ...statement, status: StmtStatus.selected } : statement,
                    ),
                  );
                }}
              >
                {Array.from(item.secretLetters).map((letter, index) => (
                  <div key={`${idx}-${index}-${letter}`} className="bg-neutral-content rounded px-2 py-1 text-sm">
                    {letter}
                  </div>
                ))}
                <p className="text-inherit leading-relaxed">{`${
                  item.text.charAt(0).toUpperCase() + item.text.slice(1)
                }.`}</p>
              </button>
            </li>
          ))}
          {/* </div> */}
        </ul>
      ) : null}
    </div>
  );
};

export default GameUI;
