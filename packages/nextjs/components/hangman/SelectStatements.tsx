import { HealthCareInfo, StmtStatus } from "./GameUI";

interface SelectStatementsProps {
  selectedCategory: string;
  setName: string;
  statements: HealthCareInfo["statements"];
  handleSelectStatement: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SelectStatements = ({ selectedCategory, setName, statements, handleSelectStatement }: SelectStatementsProps) => {
  return (
    <ul className="fixed bottom-0 left-0 w-full h-1/3 overflow-auto bg-base-200 px-10 shadow-lg">
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
            onClick={handleSelectStatement}
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
    </ul>
  );
};

export default SelectStatements;
