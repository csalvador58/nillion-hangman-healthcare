import Image from "next/image";
import { GameResult, GameScore } from "~~/app/nillion-hangman/page";

interface FallingManProps {
  gameScore: GameScore;
}

const FallingMan = ({ gameScore }: FallingManProps) => {
  return (
    <div className="w-full h-full relative">
      {gameScore.gameResult === GameResult.waiting && (
        <Image
          src="/assets/start.svg"
          alt="start game with mountain background"
          className="rounded-lg object-cover"
          fill
        />
      )}
      {gameScore.gameResult !== GameResult.waiting && (
        <>
          <Image src="/assets/background.svg" alt="mountains" className="rounded-lg object-cover" fill />
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <Image src="/assets/cliff.svg" alt="mounttain cliff edge" className="object-cover" fill />
          </div>
        </>
      )}
      {gameScore.gameResult === GameResult.playing && gameScore.numFails === 0 && (
        <div className="absolute top-48 left-10 z-10">
          <Image src="/assets/running.gif" alt="running stickman" width={100} height={100} />
        </div>
      )}
      {/* <div className="absolute top-56 left-36 z-10">
        <Image src="/assets/running.gif" alt="running stickman" width={100} height={100} />
      </div> */}
      {gameScore.gameResult === GameResult.playing && gameScore.numFails === 1 && (
        <div className="absolute top-44 left-40 z-10">
          <Image src="/assets/jumping.svg" alt="initial jumping stickman" width={140} height={140} />
        </div>
      )}
      {gameScore.gameResult === GameResult.playing && gameScore.numFails === 2 && (
        <div className="absolute top-32 left-64 z-10">
          <Image src="/assets/jumping2.svg" alt="stickman in the air after jumping" width={120} height={120} />
        </div>
      )}
      {gameScore.gameResult === GameResult.playing && gameScore.numFails === 3 && (
        <div className="absolute top-56 left-80 z-10">
          <Image src="/assets/falling.svg" alt="falling stickman" width={110} height={110} />
        </div>
      )}
      {gameScore.gameResult === GameResult.playing && gameScore.numFails === 4 && (
        <div className="absolute top-96 left-80 z-10">
          <Image src="/assets/falling.svg" alt="falling stickman" width={100} height={100} />
        </div>
      )}
      {gameScore.gameResult === GameResult.win && (
        <div className="absolute top-[450px] left-80 z-10">
          <Image src="/assets/win_game.svg" alt="parachuting stickman" width={300} height={300} />
        </div>
      )}
      {gameScore.gameResult === GameResult.lose && (
        <div className="absolute top-[650px] left-96 overflow-hidden">
          <Image src="/assets/lose_game.svg" alt="stickman in the water" width={40} height={40} />
        </div>
      )}
    </div>
  );
};

export default FallingMan;
