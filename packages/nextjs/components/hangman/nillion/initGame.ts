import { storeProgram } from "~~/utils/nillion/storeProgram";
import { storeSecretsInteger } from "~~/utils/nillion/storeSecretsInteger";

interface StringObject {
  [key: string]: string | null;
}

interface GameConfig {
  programName: string;
  programUserId: string;
  nillion: any;
  nillionClient: any;
  secrets: StringObject[];
}

const PROGRAM_PARTY_NAME = "program";
const PLAYER_1_PARTY_NAME = "player1";
const PERMISSIONED_USERID = {
  retrieve: "",
  update: "",
  delete: "",
  compute: "",
};

export async function initGame(
  userKey: string,
  programName: string,
  gameSecrets: [{ name: string; value: string }],
): Promise<GameConfig> {
  // Init game config
  let config: GameConfig = {
    programName: "",
    programUserId: "",
    nillion: null,
    nillionClient: null,
    secrets: Array<{ [key: string]: string }>(),
  };

  try {
    const { nillion, nillionClient } = await getNillionClientLibrary();
    const programUserId = nillionClient.user_id;

    // store the program
    const programId = await storeProgram(nillionClient, programName);

    // set permission for player 1 run compute
    PERMISSIONED_USERID.compute = userKey;

    // store game secrets
    for (const secret of gameSecrets) {
      const storeId = await storeSecretsInteger(
        nillion,
        nillionClient,
        [secret],
        programId,
        PROGRAM_PARTY_NAME,
        PERMISSIONED_USERID.retrieve ? [PERMISSIONED_USERID.retrieve] : [],
        PERMISSIONED_USERID.update ? [PERMISSIONED_USERID.update] : [],
        PERMISSIONED_USERID.delete ? [PERMISSIONED_USERID.delete] : [],
        PERMISSIONED_USERID.compute ? [PERMISSIONED_USERID.compute] : [],
      );
      config.secrets = [...config.secrets, { [secret.name]: storeId }];
    }

    config = { ...config, programName, programUserId, nillion, nillionClient };
    return config;
  } catch (error) {
    console.error("Error initializing game: ", error);
    throw new Error("Error initializing game");
  }
}

const getNillionClientLibrary = async () => {
  const nillionClientUtil = await import("~~/utils/nillion/nillionClient");
  const programKey = process.env.NEXT_PUBLIC_NILLION_USERKEY_TEXT_PARTY_1;
  console.log("programKey: ", programKey);
  if (!programKey) throw new Error("Nillion program key not found");
  const libraries = await nillionClientUtil.getNillionClient(programKey);
  return { nillion: libraries.nillion, nillionClient: libraries.nillionClient };
};
