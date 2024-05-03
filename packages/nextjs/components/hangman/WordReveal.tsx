import { useState } from "react";

const word = "hlole";

const WordReveal = () => {
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

  return (
    <div className="flex flex-col justify-center items-center space-y-5">
      <h2>WordReveal</h2>
      <div>
        <h3>Revealed Letters</h3>
        <div className="flex flex-row gap-1">
          {word.split("").map((letter, index) => (
            <div key={index} className="bg-neutral-content rounded px-2 py-1 text-sm">
              {letter}
            </div>
          ))}
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
