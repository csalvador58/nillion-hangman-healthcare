const Directions = () => {
  return (
    <div className="p-8">
      <h1 className="text-inherit text-xl">Directions</h1>
      <ul className="list-decimal list-inside text-left">
        <li>Pick a Healthcare topic to learn below</li>
        <li>Reveal the secret word before the Nillion stickman falls!</li>
        <li>Scroll & read through the 10 statements below.</li>
        <li>
          Correctly select all <span className="text-blue-700">5 statements</span> related to the topic.
        </li>
        <li>Each correct statement will reveal some assigned letters.</li>
        <li>Use these assigned letters as hints reveal the secret word.</li>
      </ul>
      <div className="flex justify-center items-center gap-1">
        <div className="bg-neutral-content rounded text-sm px-2 py-1">k</div>
        <p className="text-inherit leading-relaxed">{`Enables patients to access their EMR.`}</p>
      </div>
      <p className="text-error bg-warning m-0 inline p-1 rounded-md">{`Example: "k" is the assigned letter that will be revealed.`}</p>
    </div>
  );
};

export default Directions;
