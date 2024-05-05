import { useState } from "react";
import { HealthCareInfo } from "./GameUI";
import { GameScore } from "~~/app/nillion-hangman/page";

const word = "hlole";

interface WordRevealProps {
  statements: HealthCareInfo["statements"];
  gameScore: GameScore;
}

const WordReveal = ({ statements, gameScore }: WordRevealProps) => {
  const [wordInput, setWordInput] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wordInput === word) {
      alert("You guessed the word!");
    } else {
      alert("Try again!");
    }
    setWordInput("");
  };

  const revealedLetters = gameScore.validStmtCodes
    .map(code => {
      return statements.find(stmt => stmt.code === code)?.secretLetters ?? "";
    })
    .filter(Boolean);

  return (
    <div className="flex flex-col justify-center items-center space-y-5">
      <h2>Game Scoreboard</h2>
      <p>{`Failed attempts: ${gameScore.numAttempts - gameScore.numCorrect} / 3`}</p>
      <div>
        <h3>{`${revealedLetters.length} of 5 Letters Revealed`}</h3>
        <div className="flex justify-center items-center">
          <div className="flex flex-row gap-1">
            {revealedLetters.length > 0 ? (
              revealedLetters.map((letter, index) => <LetterBox key={index} letter={letter} />)
            ) : (
              <span className="text-sm mx-auto">None</span>
            )}
          </div>
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="word-reveal" className="block text-md font-medium">
            Guess the word:
          </label>
          <input
            id="word-reveal"
            name="word-reveal"
            type="text"
            value={wordInput}
            className="input input-primary-content text-center my-2"
            onChange={e => setWordInput(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary block mx-auto">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default WordReveal;

const LetterBox = ({ letter }: { letter: string }) => (
  <div className="bg-neutral-content rounded px-2 py-1 text-sm">{letter}</div>
);
