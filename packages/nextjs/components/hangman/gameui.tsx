import { useEffect, useState } from "react";
import programData from "../../app/data/healthcare-info.json";
import Directions from "./Directions";
import SelectCategory from "./SelectCategory";

const GAME_INFO = programData.list as unknown as HealthCareInfo[];
const GAME_CATEGORIES = [...new Set(GAME_INFO.map(item => item.category))];

interface HealthCareInfo {
  id: string;
  category: string;
  name: string;
  statements: {
    code: string;
    text: string;
    secretLetters: string;
  }[];
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
    console.log(shuffledStatements);
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
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center w-full rounded-3xl my-2 justify-between">
      <h1 className="text-xl">Falling man game</h1>

      <div className="grid grid-rows-3 grid-flow-col gap-2">
        <div className="row-start-1 row-end-3 w-[45vw] ... bg-slate-500 rounded-lg">01</div>
        <div className="row-start-1 row-end-2 col-span-2 w-[45vw] ... bg-slate-400 rounded-lg">
          <Directions />
          <button className="btn btn-primary" onClick={handleSubmit}>
            submit
          </button>
        </div>
        {/* <div className="row-start-3 row-end-4 col-span-2 ... bg-slate-200 rounded-lg">03</div> */}
        <div className="row-start-2 row-end-3 col-span-2 ... bg-slate-500 flex justify-center items-center rounded-lg">
          {!selectedCategory ? (
            <SelectCategory categories={GAME_CATEGORIES} setSelectedCategory={setSelectedCategory} />
          ) : null}
        </div>
      </div>

      {selectedCategory ? (
        <ul className="fixed bottom-0 left-0 w-full h-1/3 overflow-auto bg-base-200 px-10 py-4 shadow-lg">
          {/* <div className="fixed bottom-0 left-auto w-full h-1/3 overflow-auto bg-gray-100 p-4 shadow-lg"> */}
          <h2>{`Correctly select all 5 statements that relate to "Healthcare ${selectedCategory} - ${setName}" to win!`}</h2>
          {(statements as HealthCareInfo["statements"]).map((item, idx) => (
            <li key={item.code} className="bg-secondary shadow-md rounded-lg my-2 pt-6 lg:pt-0">
              <button className="btn btn-ghost h-fit w-full">
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

const getRandomSet = (arr: HealthCareInfo[]) => {
  // Get unique set names
  const uniqueNames = Array.from(new Set(arr.map(item => item.name)));

  // Randomly select a name
  const selectedName = uniqueNames[Math.floor(Math.random() * uniqueNames.length)];

  // Return the set with the selected name
  return arr.find(item => item.name === selectedName);
};

const randomFillerStatements = (
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

const shuffleStatements = (statements: HealthCareInfo["statements"]): HealthCareInfo["statements"] => {
  const shuffledStatements = [...statements];
  for (let i = shuffledStatements.length - 1; i > 0; i--) {
    const randomIdx = Math.floor(Math.random() * (i + 1));
    [shuffledStatements[i], shuffledStatements[randomIdx]] = [shuffledStatements[randomIdx], shuffledStatements[i]];
  }
  return shuffledStatements;
};
