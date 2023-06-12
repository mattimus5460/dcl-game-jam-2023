import * as utils from "@dcl/ecs-scene-utils";
import * as ui from "@dcl/ui-scene-utils";
import { buildLeaderBoard } from "./buildLeaderBoard";
import {
  GetPlayerLevelLeaderboards,
  getPlayerRounds,
  getZombieLeaderboard,
} from "src/api/api";
import { LEVEL_TYPES } from "src/LevelManager/types";

// reference position for the leader board
const boardParent = new Entity();
boardParent.addComponent(
  new Transform(
    new Transform({
      position: new Vector3(25.79, 2.5, 13.33),
      rotation: Quaternion.Euler(0, -270, 0),
    })
  )
);
engine.addEntity(boardParent);

async function updateBoard() {
  const scoreData: any = await getZombieLeaderboard(); // data.scoreBoard

  const data = [...scoreData.zombies_leader_board];
  //log("RETURNRED RAW LEADER BOARD", data);
  // sorting
  data.sort((a, b) => b.rounds - a.rounds);
  let topTen = data.slice(0, 10);

  buildLeaderBoard(topTen, boardParent, 10).catch((error) => log(error));
}

// update board every 2 seconds
boardParent.addComponent(
  new utils.Interval(2000, () => {
    updateBoard().catch((error) => log(error));
  })
);

// update leader board
updateBoard().catch((error) => log(error));
