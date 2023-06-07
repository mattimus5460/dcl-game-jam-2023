import { getUserData } from "@decentraland/Identity";
import { signedFetch } from "@decentraland/SignedFetch";
import { LEVEL_TYPES } from "src/LevelManager/types";

//const REDEEM_BASE_URL = `http://localhost:3000`;
const REDEEM_BASE_URL = `https://ipwpq4k3zi.execute-api.us-east-1.amazonaws.com`;
const BASE_URL = `https://7ky6d8fqz1.execute-api.us-east-1.amazonaws.com`;
const QUESTS_SERVICE_BASE_URL = `https://640sy1ms60.execute-api.us-east-1.amazonaws.com`;

export async function postData(url: string, data = {}) {
  // Default options are marked with *
  const response = await signedFetch(`${BASE_URL}${url}`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return JSON.parse(response.text); // parses JSON response into native JavaScript objects
}

// UDPAGTE
export async function updateData(url: string, data = {}) {
  // Default options are marked with *
  const response = await signedFetch(`${BASE_URL}${url}`, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return JSON.parse(response.text); // parses JSON response into native JavaScript objects
}

export async function postDataRedeem(url: string, data = {}) {
  const response = await signedFetch(`${REDEEM_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify(data),
  });
  return response;
}

export async function postDataNoBase(url: string, data = {}) {
  return await signedFetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
}

export async function getDataNoBase(url: string, headers = {}) {
  // Default options are marked with *
  const response = await signedFetch(`${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
  });
  return JSON.parse(response.text); // parses JSON response into native JavaScript objects
}

export async function getData(url: string, headers = {}) {
  // Default options are marked with *
  const response = await signedFetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
  });
  return JSON.parse(response.text); // parses JSON response into native JavaScript objects
}

export const LogInventoryToServer = async (
  actionType: string,
  itemId: string,
  count: number
) => {
  const { userId } = await getUserData();

  await postData(`/api/rest/item/action/${userId}`, {
    actionType,
    itemId,
    count,
  });
};

export const GetPlayerInventory = async () => {
  const { userId } = await getUserData();

  return await getData(`/api/rest/inventory/${userId}`);
};

export const GetPlayerLandedLogs = async () => {
  const { userId } = await getUserData();
  return await getData(`/api/rest/all_logs/${userId}`);
};

export const LogPlayerLanded = async (playerID, timestamp) => {
  log("in api: ", playerID, timestamp);
  await postData(`/api/rest/landed_log`, {
    timestamp,
    playerID,
  });
};

export const GetPlayerLevels = async () => {
  const { userId } = await getUserData();

  return await getData(`/api/rest/level/${userId}`);
};

export const GetPlayerLevelLeaderboards = async (
  levelType: LEVEL_TYPES = LEVEL_TYPES.PLAYER
) => {
  return await getData(`/api/rest/leaderbaord/levels/${levelType}`);
};

export const WriteXpToServer = async (
  levelType: string,
  level: number,
  xp: number,
  total: number
) => {
  const { userId } = await getUserData();

  await postData(`/api/rest/level/${levelType}/xp/${userId}/add`, {
    level,
    xp,
    total,
  });
};

export enum ACTION_LOG_TYPES {
  WOOD_CUT = "WOOD_CUT",
  MINE_ROCK = "MINE_ROCK",
  MEAT_GATHER = "MEAT_GATHER",
  BONE_COLLECTED = "BONE_COLLECTED",
  DUNGEON_RUN = "DUNGEON_RUN",
}

export const writeActionLogToServer = async (actionName: string) => {
  const { userId } = await getUserData();
  await postData(`/api/rest/action/${userId}/${actionName}`);
};

export const writeDungeonActionLogToServer = async (actionName: string) => {
  const { userId } = await getUserData();
  await postData(`/api/rest/dungeon/${userId}/${actionName}`);
};

export const GetPlayerDungeonCount = async () => {
  const { userId } = await getUserData();

  return getData(`/api/rest/dungeonCount/${userId}`);
};

//writeActionLogToServer(ACTION_LOG_TYPES.MINE_ROCK)

export const AddPlayerEquipableItem = async ({
  item_type,
  item_id,
  equipped = true,
}) => {
  const { userId } = await getUserData();

  await postData(`/api/rest/item/equip/${userId}`, {
    item_type,
    item_id,
    equipped,
  });
};

export const RemovePlayerEquipableItem = async ({ item_type, item_id }) => {
  const { userId } = await getUserData();

  await postData(`/api/rest/item/${userId}/equip/${item_id}`, {
    equipped: false,
  });
};

export const GetPlayerEquipItems = async () => {
  const { userId } = await getUserData();

  return await getData(`/api/rest/item/equip/${userId}`);
};

export const GetPlayerEquippedItems = async () => {
  const { userId } = await getUserData();

  return await getData(`/api/rest/item/equip/${userId}/equiped`);
};

export const AddPetToPlayer = async (petType: string) => {
  const { userId } = await getUserData();

  await postData(`/api/rest/pet/${userId}/${petType}`);
};

export const GetPlayerTotalCompletedQuests = async () => {
  const { userId } = await getUserData();

  return (
    (await getData(`/api/rest/quests/completed/${userId}/count`))?.value?.[0]
      ?.count || 0
  );
};

export const GetPlayerPets = async () => {
  const { userId } = await getUserData();

  return await getData(`/api/rest/pet/${userId}`);
};

export const AddAvatarModels = async (model: string, weight: number = 0) => {
  const { userId } = await getUserData();

  return postData(`/api/rest/player/${userId}/avatar`, {
    model,
    weight,
  });
};
export const GetPlayerAvatars = async (): Promise<{
  models: { file: string; weight: number }[];
}> => {
  const { userId } = await getUserData();

  return await getData(`/api/rest/player/${userId}/avatar`);
};

export const CreatePlayer = async (
  alliance: number,
  race: number,
  skill: number
) => {
  const { userId } = await getUserData();

  return postData(`/api/rest/player/${userId}/info`, {
    alliance,
    race,
    skill,
  });
};

export const GetPlayerInfo = async () => {
  const { userId } = await getUserData();

  return getData(`/api/rest/player/${userId}/info`);
};

// LEADER BOARD functions
export const getPlayerRounds = async () => {
  //api/rest/rounds/:playerID
  const { userId } = await getUserData();
  return getData(`/api/rest/rounds/${userId}`);
};

export const getZombieLeaderboard = async () => {
  return getData(`/api/rest/rounds`);
};

export const createPlayerRounds = async (rounds) => {
  //api/rest/rounds/:playerID
  const { userId, displayName } = await getUserData();
  return postData(`/api/rest/rounds`, {
    playerID: userId,
    username: displayName,
    rounds: +rounds,
  });
};

export const updatePlayerRounds = async (rounds) => {
  //api/rest/rounds/:playerID
  const { userId } = await getUserData();
  return updateData(`/api/rest/rounds`, {
    playerID: userId,
    rounds: +rounds,
  });
};

/**
 * Server side validation which confirms if the user can claim the reward
 * for an individual quest
 * @param questId : number - The quest id for which the user is trying to claim reward
 * @returns : boolean - Whether the user can claim the reward or not
 */
export const CanUserClaimReward = async (questId: number) => {
  const { userId } = await getUserData();
  const response = await fetch(
    `${QUESTS_SERVICE_BASE_URL}/claim_reward_request/${userId}/${questId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      redirect: "follow", // manual, *follow, error
    }
  );
  if (response.status != 200) return false;
  return true;
};

/**
 * Server side validation which confirms if the user can claim the bonus reward
 * for completing all quests today
 * @returns : boolean - Whether the user can claim the bonus reward
 */
export const CanUserClaimBonusReward = async () => {
  const { userId } = await getUserData();
  const response = await fetch(
    `${QUESTS_SERVICE_BASE_URL}/claim_bonus_reward_request/${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      redirect: "follow", // manual, *follow, error
    }
  );
  if (response.status != 200) return false;
  return true;
};

/**
 * Updates the progress of a player's quest to the DB
 * @param questId : number - The id for the quest for which the progress needs to be updated
 * @param progress : number - The latest progress which needs to be updated to the DB
 * @returns : boolean - The server returns whether the quest has been completed or not
 */
export const UpdatePlayerQuestLog = async (
  questId: number,
  progress: number
) => {
  const { userId } = await getUserData();
  let response = await fetch(
    `${QUESTS_SERVICE_BASE_URL}/patch_player_quest_log`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      redirect: "follow", // manual, *follow, error
      body: JSON.stringify({
        playerId: userId,
        questId: questId,
        progress: progress,
      }),
    }
  );
  if (response.status != 200)
    throw new Error("Something went wrong while updating quest progress");
  response = await response.json();
  return response["has_completed"];
};

export const WriteUserUsername = async () => {
  const { userId, displayName } = await getUserData();

  await postData(`/api/rest/userinfo/${userId}/add`, {
    username: displayName,
  });
};
