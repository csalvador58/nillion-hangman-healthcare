"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import GameUI from "~~/components/hangman/GameUI";
import { GameConfig, initGameAndSecrets } from "~~/components/hangman/utils/initGameAndSecrets";
import CodeSnippet from "~~/components/nillion/CodeSnippet";
import { CopyString } from "~~/components/nillion/CopyString";
import { NillionOnboarding } from "~~/components/nillion/NillionOnboarding";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { compute } from "~~/utils/nillion/compute";
import { getUserKeyFromSnap } from "~~/utils/nillion/getUserKeyFromSnap";
import { retrieveSecretBlob } from "~~/utils/nillion/retrieveSecretBlob";
import { JsInput, storeSecretsInteger } from "~~/utils/nillion/storeSecretsInteger";

export enum GameResult {
  waiting = "waiting",
  playing = "playing",
  win = "win",
  lose = "lose",
}
export interface GameScore {
  numCorrect: number;
  numFails: number;
  validStmtCodes: string[];
  gameResult?: GameResult;
}

export interface StringObject {
  [key: string]: string;
}

const Hangman: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [connectedToSnap, setConnectedToSnap] = useState<boolean>(false);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [nillion, setNillion] = useState<any>(null);
  const [nillionClient, setNillionClient] = useState<any>(null);

  const [programName] = useState<string>("hangman");
  const [gameConfig, setGameConfig] = useState<GameConfig>();
  const [gameScore, setGameScore] = useState<GameScore>({
    numCorrect: 0,
    numFails: 0,
    validStmtCodes: [],
    gameResult: GameResult.waiting,
  });
  const [gameIsLoading, setGameIsLoading] = useState<{ status: boolean; text: string }>({ status: false, text: "" });
  const [parties] = useState<string[]>(["player1"]);
  const [outputs] = useState<string[]>(["my_output1", "my_output2", "my_output3", "my_output4", "my_output5"]);

  // connect to snap
  async function handleConnectToSnap() {
    const snapResponse = await getUserKeyFromSnap();
    setUserKey(snapResponse?.user_key || null);
    setConnectedToSnap(snapResponse?.connectedToSnap || false);
  }

  // // Test Only
  // async function handleRetrieveSecrets() {
  //   if (gameConfig) {
  //     for (const secret of gameConfig.secrets) {
  //       const [secret_name, store_id] = Object.entries(secret)[0];
  //       if (secret_name.includes("code")) {
  //         const value = await retrieveSecretInteger(nillionClient, store_id, secret_name);
  //         alert(`${secret_name} is ${value}`);
  //       } else {
  //         const value = await retrieveSecretBlob(nillionClient, store_id, secret_name);
  //         alert(`${secret_name} is ${value}`);
  //       }
  //     }
  //   }
  // }

  // reset nillion values
  const resetNillion = () => {
    setConnectedToSnap(false);
    setUserKey(null);
    setUserId(null);
    setNillion(null);
    setNillionClient(null);
  };

  useEffect(() => {
    // when wallet is disconnected, reset nillion
    if (!connectedAddress) {
      resetNillion();
    }
  }, [connectedAddress]);

  // Initialize nillionClient for use on page
  useEffect(() => {
    if (userKey) {
      const getNillionClientLibrary = async () => {
        const nillionClientUtil = await import("~~/utils/nillion/nillionClient");
        const libraries = await nillionClientUtil.getNillionClient(userKey);
        setNillion(libraries.nillion);
        setNillionClient(libraries.nillionClient);
        return libraries.nillionClient;
      };
      getNillionClientLibrary().then(nillionClient => {
        const user_id = nillionClient.user_id;
        setUserId(user_id);
      });
    }
  }, [userKey]);

  /**
   * Initializes the game to setup Nillion client and program ID.
   * Creates secret integers for the 5 correct statement codes and
   * secret blob for the secret word. Generates program bindings for the secrets
   * for use on the Nillion network with the program ID.
   */
  async function handleGameStart(secrets: { secretIntegers: StringObject[]; secretBlobs: StringObject[] }) {
    // Set game loading state
    setGameIsLoading({ status: true, text: "Loading game and storing secrets..." });

    if (userKey) {
      const partyName = parties[0];
      const config = await initGameAndSecrets(nillion, nillionClient, programName, partyName, secrets);
      console.log("game config", config);
      setGameConfig(config);
      setGameScore({
        ...gameScore,
        gameResult: GameResult.playing,
      });
    }
    setGameIsLoading({ status: false, text: "" });
  }

  /**
   * Checks if the selected statement code is correct.
   * First processes as a secret integer input to obtain a store id,
   * then computes on the secrets. If return array of integers contains a 0,
   * the player input was correct.
   */
  async function checkSelectedStatement(code: string) {
    if (!gameConfig) {
      setGameIsLoading({ status: true, text: "Error, please refresh page and try again!" });
      return;
    }

    setGameIsLoading({ status: true, text: "Processing selection..." });
    // store the selected statement code as player secret input
    const partyName = parties[0];
    const playerInputToStoreId = await storeSecretsInteger(
      nillion,
      nillionClient,
      [{ name: "player_input", value: code.toString() }] as JsInput[],
      gameConfig.programId,
      partyName,
    );

    // Filter storeIds for the selected statement codes
    const secretCodesToStoreIds = gameConfig.secrets
      .filter(secret => Object.keys(secret)[0].includes("code"))
      .map(secret => Object.values(secret)[0]);

    // Combine storeIds for compute
    const storeIdsToCompute = [...secretCodesToStoreIds, playerInputToStoreId];

    // compute on secrets
    const results = await compute(nillion, nillionClient, storeIdsToCompute, gameConfig.programId, outputs);
    console.log("compute result: ", results);

    // Check if player input was correct and update scoreboard
    if (results.some(item => item === "0")) {
      setGameScore({
        ...gameScore,
        numCorrect: gameScore.numCorrect + 1,
        validStmtCodes: [...gameScore.validStmtCodes, code],
      });
    } else {
      if (gameScore.numFails < 4) {
        setGameScore({
          ...gameScore,
          numFails: gameScore.numFails + 1,
          validStmtCodes: [...gameScore.validStmtCodes],
        });
      } else {
        setGameScore({
          ...gameScore,
          gameResult: GameResult.lose,
        });
      }
    }

    // update the game config with the player input store id
    const secretsToStoreIds = gameConfig.secrets;
    secretsToStoreIds.push({ player_input: playerInputToStoreId });
    setGameConfig({ ...gameConfig, secrets: secretsToStoreIds });

    // Set game loading state
    setGameIsLoading({ status: false, text: "" });
  }

  /**
   * Retrieves the secret word via secret blob from the Nillion network and
   * checks if the player's guess is correct.
   */
  async function handleWordGuess(word: string) {
    // Retrieve secret word
    const storeId = gameConfig?.secrets.find(secret => Object.keys(secret)[0].includes("secret_word"));
    if (!storeId) {
      setGameIsLoading({ status: true, text: "Error, please refresh page and try again!" });
      return;
    }
    const value = await retrieveSecretBlob(nillionClient, Object.values(storeId)[0], "secret_word");
    if (value !== word) {
      if (gameScore.numFails < 4) {
        setGameScore({
          ...gameScore,
          numFails: gameScore.numFails + 1,
        });
      } else {
        setGameScore({
          ...gameScore,
          gameResult: GameResult.lose,
        });
      }
    } else if (value === word) {
      setGameScore({
        ...gameScore,
        gameResult: GameResult.win,
      });
    }

    setGameIsLoading({ status: false, text: "" });
  }

  return (
    <>
      <div className="flex items-center flex-col pt-10 bg-black h-[100vh]">
        <div className="px-5 flex flex-col">
          <h1 className="text-xl">
            <span className="block text-4xl font-bold mt-10">Falling Man (aka Hangman)</span>
            {!connectedAddress && <p className="text-center">Connect your MetaMask Flask wallet</p>}
            {connectedAddress && connectedToSnap && !userKey && (
              <a target="_blank" href="https://nillion-snap-site.vercel.app/" rel="noopener noreferrer">
                <button className="btn btn-sm btn-primary mt-4">
                  No Nillion User Key - Generate and store user key here
                </button>
              </a>
            )}
          </h1>
          {!connectedAddress && (
            <div className="flex items-center justify-center">
              <RainbowKitCustomConnectButton />
            </div>
          )}
          {connectedAddress && !connectedToSnap && (
            <button className="btn btn-sm btn-primary" onClick={handleConnectToSnap}>
              Connect to Snap with your Nillion User Key
            </button>
          )}

          {connectedToSnap && (
            <div>
              {userKey && (
                <div>
                  {userId && (
                    <div className="flex justify-center items-center space-x-2">
                      <p className="my-2 font-medium">Connected as Nillion User ID:</p>
                      <CopyString str={userId} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-grow bg-black w-full px-4 py-8">
          <div className="flex justify-center items-center gap-4 flex-col sm:flex-row">
            {!connectedToSnap ? (
              <NillionOnboarding />
            ) : (
              <div>
                <div className="flex flex-col bg-black px-10 py-10 text-center items-center max-w-m rounded-3xl my-2">
                  <h1 className="text-xl">Nada program</h1>
                  <CodeSnippet program_name={programName} />
                </div>

                <GameUI
                  gameIsLoading={gameIsLoading}
                  setGameIsLoading={setGameIsLoading}
                  handleWordGuess={handleWordGuess}
                  checkSelectedStatement={checkSelectedStatement}
                  handleGameStart={handleGameStart}
                  gameScore={gameScore}
                />
                <div className="h-[30vh]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hangman;
