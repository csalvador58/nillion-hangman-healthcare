"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import GameUI from "~~/components/hangman/GameUI";
import CodeSnippet from "~~/components/nillion/CodeSnippet";
import { CopyString } from "~~/components/nillion/CopyString";
import { NillionOnboarding } from "~~/components/nillion/NillionOnboarding";
import RetrieveSecretCommand from "~~/components/nillion/RetrieveSecretCommand";
import SecretForm from "~~/components/nillion/SecretForm";
import { Address } from "~~/components/scaffold-eth";
import { compute } from "~~/utils/nillion/compute";
import { getUserKeyFromSnap } from "~~/utils/nillion/getUserKeyFromSnap";
import { retrieveSecretCommand } from "~~/utils/nillion/retrieveSecretCommand";
import { retrieveSecretInteger } from "~~/utils/nillion/retrieveSecretInteger";
import { storeProgram } from "~~/utils/nillion/storeProgram";
import { storeSecretsInteger } from "~~/utils/nillion/storeSecretsInteger";

interface StringObject {
  [key: string]: string | null;
}

const Hangman: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [connectedToSnap, setConnectedToSnap] = useState<boolean>(false);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [nillion, setNillion] = useState<any>(null);
  const [nillionClient, setNillionClient] = useState<any>(null);

  const [programName] = useState<string>("addition_simple");
  const [programId, setProgramId] = useState<string | null>(null);
  const [computeResult, setComputeResult] = useState<string | null>(null);

  const [storedSecretsNameToStoreId, setStoredSecretsNameToStoreId] = useState<StringObject>({
    my_int1: null,
    my_int2: null,
  });
  const [parties] = useState<string[]>(["Party1"]);
  const [outputs] = useState<string[]>(["my_output"]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // connect to snap
  async function handleConnectToSnap() {
    const snapResponse = await getUserKeyFromSnap();
    setUserKey(snapResponse?.user_key || null);
    setConnectedToSnap(snapResponse?.connectedToSnap || false);
  }

  // store program in the Nillion network and set the resulting program id
  async function handleStoreProgram() {
    await storeProgram(nillionClient, programName).then(setProgramId);
  }

  async function handleRetrieveInt(secret_name: string, store_id: string | null) {
    if (store_id) {
      const value = await retrieveSecretInteger(nillionClient, store_id, secret_name);
      alert(`${secret_name} is ${value}`);
    }
  }

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

  // handle form submit to store secrets with bindings
  async function handleSecretFormSubmit(
    secretName: string,
    secretValue: string,
    permissionedUserIdForRetrieveSecret: string | null,
    permissionedUserIdForUpdateSecret: string | null,
    permissionedUserIdForDeleteSecret: string | null,
    permissionedUserIdForComputeSecret: string | null,
  ) {
    if (programId) {
      const partyName = parties[0];
      await storeSecretsInteger(
        nillion,
        nillionClient,
        [{ name: secretName, value: secretValue }],
        programId,
        partyName,
        permissionedUserIdForRetrieveSecret ? [permissionedUserIdForRetrieveSecret] : [],
        permissionedUserIdForUpdateSecret ? [permissionedUserIdForUpdateSecret] : [],
        permissionedUserIdForDeleteSecret ? [permissionedUserIdForDeleteSecret] : [],
        permissionedUserIdForComputeSecret ? [permissionedUserIdForComputeSecret] : [],
      ).then(async (store_id: string) => {
        console.log("Secret stored at store_id:", store_id);
        setStoredSecretsNameToStoreId(prevSecrets => ({
          ...prevSecrets,
          [secretName]: store_id,
        }));
      });
    }
  }

  // compute on secrets
  async function handleCompute() {
    if (programId) {
      await compute(nillion, nillionClient, Object.values(storedSecretsNameToStoreId), programId, outputs[0]).then(
        result => setComputeResult(result),
      );
    }
  }

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-5 flex flex-col">
          <h1 className="text-xl">
            <span className="block text-4xl font-bold">Falling Man (aka Hangman)</span>
            {!connectedAddress && <p>Connect your MetaMask Flask wallet</p>}
            {connectedAddress && connectedToSnap && !userKey && (
              <a target="_blank" href="https://nillion-snap-site.vercel.app/" rel="noopener noreferrer">
                <button className="btn btn-sm btn-primary mt-4">
                  No Nillion User Key - Generate and store user key here
                </button>
              </a>
            )}
          </h1>

          {connectedAddress && (
            <div className="flex justify-center items-center space-x-2">
              <p className="my-2 font-medium">Connected Wallet Address:</p>
              <Address address={connectedAddress} />
            </div>
          )}

          {connectedAddress && !connectedToSnap && (
            <button className="btn btn-sm btn-primary mt-4" onClick={handleConnectToSnap}>
              Connect to Snap with your Nillion User Key
            </button>
          )}

          {connectedToSnap && (
            <div>
              {userKey && (
                <div>
                  <div className="flex justify-center items-center space-x-2">
                    <p className="my-2 font-medium">
                      🤫 Nillion User Key from{" "}
                      <a target="_blank" href="https://nillion-snap-site.vercel.app/" rel="noopener noreferrer">
                        MetaMask Flask
                      </a>
                      :
                    </p>

                    <CopyString str={userKey} />
                  </div>

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

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            {!connectedToSnap ? (
              <NillionOnboarding />
            ) : (
              <div>
                <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-m rounded-3xl my-2">
                  <h1 className="text-xl">Step 1: Store a Nada program</h1>
                  {!programId ? (
                    <button className="btn btn-sm btn-primary mt-4" onClick={handleStoreProgram}>
                      Store {programName} program
                    </button>
                  ) : (
                    <div>
                      ✅ {programName} program stored <br />
                      <span className="flex">
                        <CopyString str={programId} start={5} end={programName.length + 5} textBefore="program_id: " />
                      </span>
                    </div>
                  )}

                  <CodeSnippet program_name={programName} />
                </div>

                <GameUI selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hangman;
