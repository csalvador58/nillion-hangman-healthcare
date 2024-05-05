import { useState } from "react";
import { HealthCareInfo } from "./GameUI";
import { GameResult, GameScore } from "~~/app/nillion-hangman/page";

interface ScoreboardProps {
  gameIsLoading: { status: boolean; text: string };
  statements: HealthCareInfo["statements"];
  gameScore: GameScore;
  handleWordGuess: (word: string) => void;
}

const Scoreboard = ({ gameIsLoading, statements, gameScore, handleWordGuess }: ScoreboardProps) => {
  const [wordInput, setWordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    handleWordGuess(wordInput);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    setWordInput("");
  };

  const revealedLetters = gameScore.validStmtCodes
    .map(code => {
      return statements.find(stmt => stmt.code === code)?.secretLetter ?? "";
    })
    .filter(Boolean);

  return (
    <div className="flex flex-col justify-center items-center space-y-5">
      {gameScore.gameResult === GameResult.playing && (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center gap-2">
              <span className="loading loading-dots loading-lg"></span>
              <h2 className="text-blue-700 text-xl">...Loading...</h2>
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : (
            <h2>Game Scoreboard</h2>
          )}
          <p>{`Failed attempts: ${gameScore.numFails} / 5`}</p>
          <div>
            {revealedLetters.length > 4 ? (
              <h3 className="text-red-500">{`Time to guess the secret word!`}</h3>
            ) : (
              <h3>{`${revealedLetters.length} of 5 Letters Revealed`}</h3>
            )}
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
                disabled={gameIsLoading.status}
              />
              <button type="submit" className="btn btn-primary block mx-auto" disabled={gameIsLoading.status}>
                Submit
              </button>
            </form>
          </div>
        </>
      )}

      {gameScore.gameResult === GameResult.win && (
        <>
          <h2>Game Over</h2>
          <p>{`You win!`}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </>
      )}

      {gameScore.gameResult === GameResult.lose && (
        <>
          <h2>Game Over</h2>
          <p>{`You lose!`}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </>
      )}
    </div>
  );
};

export default Scoreboard;

const LetterBox = ({ letter }: { letter: string }) => (
  <div className="bg-neutral-content rounded px-2 py-1 text-sm">{letter}</div>
);
