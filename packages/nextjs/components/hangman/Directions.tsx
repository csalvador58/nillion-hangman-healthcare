const Directions = () => {
  return (
    <div className="p-8">
      <h1 className="text-inherit text-xl">Directions</h1>
      <ul className="list-decimal list-inside text-left">
        <li>Reveal the secret word before the running man falls!</li>
        <li>Scroll through the 10 statements below.</li>
        <li>Find the 5 statements related the the Healthcare topic.</li>
        <li>Each correct statement will reveal the assign letters.</li>
        <li>Use these assigned letters as hints.</li>
      </ul>
      <div className="flex justify-center items-center gap-1">
        <div className="bg-neutral-content rounded text-sm px-2 py-1">k</div>
        <p className="text-inherit leading-relaxed">{`Enables patients to access their EMR.`}</p>
      </div>
    </div>
  );
};

export default Directions;
