import { StringObject } from "~~/app/nillion-hangman/page";
import { storeProgram } from "~~/utils/nillion/storeProgram";
import { storeSecretsBlob } from "~~/utils/nillion/storeSecretsBlob";
import { JsInput, storeSecretsInteger } from "~~/utils/nillion/storeSecretsInteger";

export interface GameConfig {
  programName: string;
  programId: string;
  programUserId: string;
  nillion: any;
  nillionClient: any;
  secrets: StringObject[];
}

const PERMISSIONED_USERID = {
  retrieve: "",
  update: "",
  delete: "",
  compute: "",
};

export async function initGameAndSecrets(
  nillion: any,
  nillionClient: any,
  programName: string,
  partyName: string,
  gameSecrets: { secretIntegers: StringObject[]; secretBlobs: StringObject[] },
): Promise<GameConfig> {
  // Init game config
  let config: GameConfig = {
    programName: "",
    programId: "",
    programUserId: "",
    nillion: null,
    nillionClient: null,
    secrets: Array<{ [key: string]: string }>(),
  };

  try {
    // Setup nillion client
    const programUserId = nillionClient.user_id;
    console.log("programUserId: ", programUserId);
    console.log("gameSecrets: ", gameSecrets);

    // store the program
    const programId = await storeProgram(nillionClient, programName);
    console.log("programId: ", programId);

    // store game secret integers
    for (const secret of gameSecrets.secretIntegers) {
      // Object entries
      const [name, value] = Object.entries(secret)[0];
      console.log("name: ", name, "value: ", value);
      const storeId = await storeSecretsInteger(
        nillion,
        nillionClient,
        [{ name: name, value: value }] as JsInput[],
        programId,
        partyName,
        PERMISSIONED_USERID.retrieve ? [PERMISSIONED_USERID.retrieve] : [],
        PERMISSIONED_USERID.update ? [PERMISSIONED_USERID.update] : [],
        PERMISSIONED_USERID.delete ? [PERMISSIONED_USERID.delete] : [],
        PERMISSIONED_USERID.compute ? [PERMISSIONED_USERID.compute] : [],
      );
      console.log("storeId: ", storeId);
      config.secrets.push({ [name]: storeId });
    }

    // store game secret blobs
    for (const secret of gameSecrets.secretBlobs) {
      // Object entries
      const [name, value] = Object.entries(secret)[0];
      console.log("name: ", name, "value: ", value);
      const storeId = await storeSecretsBlob(
        nillion,
        nillionClient,
        [{ name: name, value: value }] as JsInput[],
        PERMISSIONED_USERID.retrieve ? [PERMISSIONED_USERID.retrieve] : [],
        PERMISSIONED_USERID.update ? [PERMISSIONED_USERID.update] : [],
        PERMISSIONED_USERID.delete ? [PERMISSIONED_USERID.delete] : [],
      );
      console.log("storeId: ", storeId);
      config.secrets.push({ [name]: storeId });
    }

    config = { ...config, programName, programId, programUserId, nillion, nillionClient };
    return config;
  } catch (error) {
    console.error("Error initializing game: ", error);
    throw new Error("Error initializing game");
  }
}